import { Response, NextFunction } from "express";
import {
  fetchPOIData,
  processInBatches,
} from "../services/openChargeMap.service";
import logger from "../utils/logger";
import { connectToDatabase } from "../db/connection";
import { config } from "../config";
import pLimit from "p-limit";
import { IFilters } from "../utils/import.interface";
import { retryRequest } from "../utils/utils";

/**
 * Controller function for handling the import data request.
 * @param req  : { body: { filters: IFilters; }
 * @param res
 * @param next
 * @returns A Promise that resolves when the function completes its operation.
 */
export const importPOIData = async (
  req: { body: { filters: IFilters } },
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Connect to DB
    await connectToDatabase();
    // This defines the maximum number of concurrent operations that can run at a time.
    const limit = config.CONCURRENCY_LIMIT;
    // ensuring that no more than `limit` tasks run at the same time.
    const limitConcurrency = pLimit(+limit as number);

    const { filters } = req.body;
    logger.info("filters for POI service .....", filters);
    logger.info("Starting POI data import process...");

    let page = filters.page as number;
    let batchSize = filters.maxresults as number;
    let hasMoreData = true;
    // Loop to fetch and process Points of Interest (POIs) data in batches until no more data is available.
    let allPOIs: any[] = [];
    while (hasMoreData) {
      logger.info(`Fetching POIs with page ${filters.page}`);
      // Fetch a batch of POIs data based on the current filters and page.
     // const pois = await fetchPOIData(filters);
      const pois = await retryRequest(() => fetchPOIData(filters));
      if (pois.length) {
        // POIs data save operation into database

        allPOIs.push(...pois);
        logger.info(`allPOIs Size ${allPOIs.length}`);

        if (allPOIs.length > batchSize) {
          await processInBatches(allPOIs, +limit,limitConcurrency);
          allPOIs = [];
        }
        page++;
        filters.page = page;
      } else {
        hasMoreData = false;
        break;
      }
    }
    // Send Respose with current status
    const importPoisStatus = {
      batchSize,
      page,
      // hardStop,
    };
    logger.info("POI data import process completed successfully");
    res.status(200).send({
      message: "POI data import process completed successfully",
      importPoisStatus,
    });
  } catch (error) {
    logger.error("Error during POI data import:", error);
    res.status(500).send("Error occurs while importing data");
  }
};
