import http from "http";
import cron from "node-cron";
import app from "./app/app.js";
import { initializeSocket } from "./services/socketService.js";
import { aggregateDailyMetrics } from "./services/analyticsService.js";
import logger from "./utils/logger.js";

//creating server
const PORT = process.env.PORT || 8000;
const server = http.createServer(app);

// Initialize Socket.IO
initializeSocket(server);
logger.info("Socket.IO initialized");

// Setup cron jobs
// Run daily metrics aggregation at midnight (00:00) every day
cron.schedule("0 0 * * *", async () => {
  logger.info("Running daily metrics aggregation...");
  try {
    await aggregateDailyMetrics();
    logger.info("Daily metrics aggregation completed");
  } catch (error) {
    logger.error(`Daily metrics aggregation failed: ${error.message}`);
  }
});

server.listen(PORT, () => {
  logger.info(`Server is up and running on port ${PORT}`);
  logger.info(`Environment: ${process.env.NODE_ENV || "development"}`);
});
