import mongoose from 'mongoose';
import { config } from '../config';
import logger from '../utils/logger';

export const connectToDatabase = async () => {
  try {
    await mongoose.connect(config.mongoURI, {});
    logger.info('Connected to MongoDB successfully');
  } catch (error) {
    logger.error('Error connecting to MongoDB:', error);
    throw error;
  }
}