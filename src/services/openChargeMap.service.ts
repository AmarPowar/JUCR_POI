import axios, { AxiosResponse } from "axios";
import logger from "../utils/logger";
import { config } from "../config";
import { IFilters } from "../utils/import.interface";
import POIModel from "../db/models/poiModel";
import { v4 as uuidv4 } from "uuid";

/**
 *  Function to fetch Points of Interest (POI) data from an external API based on given filters.
 * @param filters
 * @returns
 */

export const fetchPOIData = async (filters: IFilters) => {
  try {
    const inputParam: Record<string, any> = {
      key: config.openChargeMapAPIKey,
    };
    if (Object.keys(filters).length) {
      for (const [key, value] of Object.entries(filters)) {
        inputParam[key] = value;
      }
    }
    logger.info(`Filter applied to api call.  Filter :${filters}`);
    logger.info("Fetching Points of Interest (POI) data...");
    // Open Charge Map API call
    const response = await callOpenChargeMapBaseAPI(inputParam);
    if (response.data && response.data.length) {
      logger.info(`Fetched ${response.data.length} POIs`);
      return response.data;
    } else {
      logger.warn("No POI data found in the response");
      return [];
    }
  } catch (error) {
    logger.error("Error fetching POI data:", error);
    throw error;
  }
};

/**
 * Function to save a list of Points of Interest (POIs) to a MongoDB database.
 * @param pois
 */
export const savePOIsToDB = async (pois: any[]) => {
  const transformedPOIs = pois.map((poi) => ({
    _id: uuidv4(),
    ...poi,
  }));
  try {
    const Result = await POIModel.insertMany(transformedPOIs, {
      ordered: false,
    });
    logger.info(
      `${transformedPOIs.length} POIs saved to MongoDB`
    );
  } catch (error) {
    logger.error("Error saving POIs to MongoDB:", error);
    if (error) {
      logger.error("Duplicate key errors occurred for some entries.");
    }
  }
};

/**
 * Function to make a GET request to the OpenChargeMap API to fetch Points of Interest (POI) data.
 * @param inputParam
 * @returns
 */
export const callOpenChargeMapBaseAPI = async (
  inputParam: Record<string, any>
): Promise<AxiosResponse<any, any>> => {
  const response = await axios.get(`${config.openChargeMapBaseURL}poi/`, {
    params: inputParam,
  });
  return response;
};



export const processInBatches = async (pois: any[], concurrencyLimit: number) => {
  const batchSize = Math.ceil(pois.length / concurrencyLimit);
  logger.info(
    ` batch size ${batchSize}`
  );
  const batchPromises = [];
  
  for (let i = 0; i < concurrencyLimit; i++) {
    const batch = pois.slice(i * batchSize, (i + 1) * batchSize);
    batchPromises.push(savePOIsToDB(batch)); // Insert POIs in batches
  }

  await Promise.all(batchPromises);
};