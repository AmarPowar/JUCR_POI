import { Response, NextFunction } from 'express';
import { fetchPOIData, savePOIsToDB, } from '../services/openChargeMap.service';
import logger from '../utils/logger';
import { connectToDatabase } from '../db/connection';
import { config } from '../config';
import pLimit from 'p-limit';
import { IFilters } from '../utils/import.interface';

/**
 * Controller function for handling the import data request.
 *
 * This function processes the validated request body containing filter criteria
 * and performs the necessary operations to handle the import data workflow.
 * 
 * @param req  : { body: { filters: IFilters; }
 * @param res
 * @param next 
 * @returns A Promise that resolves when the function completes its operation.
 */
export const importPOIData = async (req: { body: { filters: IFilters; }; }, res: Response, next: NextFunction): Promise<void> => {
  try {
    // Connect to DB 
    await connectToDatabase();
    // This defines the maximum number of concurrent operations that can run at a time.
    const limit = config.CONCURRENCY_LIMIT;
    // ensuring that no more than `limit` tasks run at the same time.
    const limitConcurrency = pLimit(limit);

    const { filters } = req.body;
    logger.info('filters for POI service .....', filters);
    logger.info('Starting POI data import process...');

    let offset = filters.offset as number;
    let batchSize = filters.maxresults as number;
    let hasMoreData = true;
    let hardStop = filters.hardStop as number

    while (hasMoreData) {
      logger.info(`Fetching POIs with offset ${filters.offset}`);
      const pois = await fetchPOIData(filters);
      if (pois.length) {
        await limitConcurrency(() => savePOIsToDB(pois));
        offset += batchSize
      } else {
        hasMoreData = false;
      }

    }
    const importPoisStatus = {
      batchSize,
      offset,
      hardStop
    }
    logger.info('POI data import process completed successfully');
    res.status(200).send({
      message: 'POI data import process completed successfully', importPoisStatus
    });
  } catch (error) {
    logger.error('Error during POI data import:', error);
    res.status(500).send('Error occurs while importing data');
  }
};
