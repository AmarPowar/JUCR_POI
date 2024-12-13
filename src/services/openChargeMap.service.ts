import axios from 'axios';
import logger from '../utils/logger';
import { config } from '../config';
import { POIModel } from '../db/models/poiModel';

export const fetchPOIData = async () => {
  try {
    logger.info('Fetching Points of Interest (POI) data...');
    const response = await axios.get(`${config.openChargeMapBaseURL}poi/`, {
      params: {
        key: config.openChargeMapAPIKey,
        output: 'json',
      },
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

export const savePOIData = async (data: any[]) => {
  try {
    logger.info(`Saving ${data.length} POIs to the database...`);
    const bulkOps = data.map((poi) => ({
      updateOne: {
        filter: { id: poi.ID },
        update: {
          id: poi.ID,
          name: poi.Title,
          location: poi.AddressInfo.Town,
          chargingPoints: poi.Connections.length,
        },
        upsert: true,
      },
    }));
    await POIModel.bulkWrite(bulkOps);
    logger.info('POI data saved successfully');
  } catch (error) {
    logger.error('Error saving POI data to database:', error);
    throw error;
  }
};
