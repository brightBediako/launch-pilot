import mongoose from "mongoose";
import logger from "../utils/logger.js";

const dbConnect = async () => {
  try {
    mongoose.set("strictQuery", false);
    const connected = await mongoose.connect(process.env.MONGO_URI);
    logger.info(`MongoDB connected: ${connected.connection.host}`);
  } catch (error) {
    logger.error(`MongoDB connection error: ${error.message}`);
    process.exit(1);
  }
};

export default dbConnect;
