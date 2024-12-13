import { Response, NextFunction } from 'express';
import { fetchPOIData, savePOIData } from '../services/openChargeMap.service';
import logger from '../utils/logger';

export const importPOIData = async (req: { body: { filters: object; }; }, res: Response, next: NextFunction):Promise<void> => {
  try {
    const { filters } = req.body;
    logger.info('filters for POI service .....', filters);
    logger.info('Starting POI data import process...');
    const data = await fetchPOIData();
    console.log("data====",data);
    if (data.length) {
    //  await savePOIData(data);
    }
    logger.info('POI data import process completed successfully');
     res.status(200).send('POI data import completed successfully');
  } catch (error) {
    logger.error('Error during POI data import:', error);
     res.status(500).send('Error  import completed successfully');
  }
};
