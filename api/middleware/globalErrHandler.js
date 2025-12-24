import logger from "../utils/logger.js";
import { AppError } from "../utils/errors.js";
import { getRequestId } from "./requestId.js";

export const globalErrhandler = (err, req, res, next) => {
  const requestId = getRequestId(req);

  // Log the error with request ID
  logger.error({
    message: err.message,
    stack: err.stack,
    statusCode: err?.statusCode || 500,
    errorCode: err?.errorCode,
    requestId,
    url: req.originalUrl,
    method: req.method,
  });

  // Handle operational errors (known errors)
  if (err instanceof AppError) {
    const response = {
      success: false,
      message: err.message,
      errorCode: err.errorCode,
      requestId,
    };

    // Add validation errors if present
    if (err.errors && Array.isArray(err.errors)) {
      response.errors = err.errors;
    }

    // Only include stack trace in development
    if (process.env.NODE_ENV !== "production") {
      response.stack = err.stack;
    }

    return res.status(err.statusCode).json(response);
  }

  // Handle unexpected errors
  const statusCode = err?.statusCode || 500;
  const message =
    process.env.NODE_ENV === "production"
      ? "Internal server error"
      : err.message || "Internal server error";

  const response = {
    success: false,
    message,
    errorCode: "INTERNAL_SERVER_ERROR",
    requestId,
  };

  // Only include stack trace in development
  if (process.env.NODE_ENV !== "production") {
    response.stack = err.stack;
  }

  res.status(statusCode).json(response);
};

//404 handler
export const notFound = (req, res, next) => {
  const err = new Error(`Route ${req.originalUrl} Not Found`);
  err.statusCode = 404;
  next(err);
};
