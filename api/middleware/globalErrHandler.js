import logger from "../utils/logger.js";

export const globalErrhandler = (err, req, res, next) => {
  // Log the error
  logger.error(`Error: ${err.message}\nStack: ${err.stack}`);

  const statusCode = err?.statusCode || 500;
  const message = err?.message || "Internal server error";

  const response = {
    success: false,
    message,
  };

  // Only include stack trace in development
  if (process.env.NODE_ENV !== "production") {
    response.stack = err?.stack;
  }

  res.status(statusCode).json(response);
};

//404 handler
export const notFound = (req, res, next) => {
  const err = new Error(`Route ${req.originalUrl} Not Found`);
  err.statusCode = 404;
  next(err);
};
