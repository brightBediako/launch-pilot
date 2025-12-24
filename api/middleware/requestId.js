import { v4 as uuidv4 } from "uuid";
import logger from "../utils/logger.js";

/**
 * Middleware to generate and attach request ID to each request
 * Request ID is used for request tracing and log correlation
 */
export const requestIdMiddleware = (req, res, next) => {
  // Generate or use existing request ID from header
  const requestId = req.headers["x-request-id"] || uuidv4();

  // Attach to request object
  req.requestId = requestId;

  // Add to response headers
  res.setHeader("X-Request-ID", requestId);

  // Add request ID to logger context
  logger.defaultMeta = { ...logger.defaultMeta, requestId };

  next();
};

/**
 * Get request ID from request object
 * @param {Object} req - Express request object
 * @returns {string} Request ID
 */
export const getRequestId = (req) => {
  return req.requestId || "unknown";
};

export default requestIdMiddleware;

