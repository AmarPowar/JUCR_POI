import axios from 'axios';
import logger from '../utils/logger';
import { config } from '../config';
import { IFilters } from '../utils/import.interface';
import POIModel from '../db/models/poiModel';
import { v4 as uuidv4 } from 'uuid';

export const fetchPOIData = async (filters: IFilters) => {
  try {
    const inputParam: Record<string, any> = {
      key: config.openChargeMapAPIKey
    }

    if (Object.keys(filters).length) {
      console.log("Input filters:", filters);
      for (const [key, value] of Object.entries(filters)) {
        inputParam[key] = value;
      }
    }
    logger.info('Fetching Points of Interest (POI) data...');
    const response = await axios.get(`${config.openChargeMapBaseURL}poi/`, {
      params: inputParam,
    });

    if (response.data && response.data.length) {
      logger.info(`Fetched ${response.data.length} POIs`);
      return response.data;
    } else {
      logger.warn('No POI data found in the response');
      return [];
    }
  } catch (error) {
    logger.error('Error fetching POI data:', error);
    throw error;
  }
};

export const savePOIsToDB = async (pois: any[]) => {
  const transformedPOIs = pois.map(poi => ({
    _id: uuidv4(),
    ...poi,
  }));
  try {
   const r =  await POIModel.insertMany(transformedPOIs, { ordered: false });
    logger.info(`${transformedPOIs.length} POIs saved to MongoDB=====${r}`);
  } catch (error) {
    logger.error('Error saving POIs to MongoDB:', error);
    if (error) {
      logger.error('Duplicate key errors occurred for some entries.');
    }
  }
}
