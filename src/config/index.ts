import dotenv from 'dotenv';

dotenv.config();

export const config = {
  port: process.env.PORT || 4000,
  mongoURI: process.env.MONGO_URI || 'mongodb://user:password@localhost:27017/openChargeMap?authSource=admin',
  openChargeMapAPIKey: process.env.OPENCHARGEMAP_API_KEY || 'ff82541f-c8d1-4507-be67-bd07e3259c4e',
  openChargeMapBaseURL: 'https://api.openchargemap.io/v3/',
};
