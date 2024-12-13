import mongoose from 'mongoose';
import { config } from '../config';
import logger from '../utils/logger';

export const connectToDatabase = async () => {
  try {
    await mongoose.connect(config.mongoURI, {
     // useNewUrlParser: true,
    //  useUnifiedTopology: true,
    });
    logger.info('Connected to MongoDB successfully');
  } catch (error) {
    logger.error('Error connecting to MongoDB:', error);
    process.exit(1);
  }
};
