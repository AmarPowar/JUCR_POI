import dotenv from "dotenv";

dotenv.config();

export const config = {
  port: process.env.PORT as string,
  mongoURI: process?.env?.MONGO_URI as string ,
  openChargeMapAPIKey: process.env.OPENCHARGEMAP_API_KEY as string,
  openChargeMapBaseURL: process.env.OPEN_CHARGE_MAP_BASE_URL as string,
  CONCURRENCY_LIMIT: process.env.CONCURRENCY_LIMIT as string,
};
