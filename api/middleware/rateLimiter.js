import rateLimit from "express-rate-limit";

// Create a no-op middleware for development
const noOpMiddleware = (req, res, next) => next();

// Rate limiter for authentication routes
export const authLimiter =
  process.env.NODE_ENV === "production"
    ? rateLimit({
        windowMs: 15 * 60 * 1000, // 15 minutes
        max: 5, // Limit each IP to 5 requests per windowMs
        statusCode: 429,
      })
    : noOpMiddleware;

// Rate limiter for general API routes
export const apiLimiter =
  process.env.NODE_ENV === "production"
    ? rateLimit({
        windowMs: 15 * 60 * 1000, // 15 minutes
        max: 100, // Limit each IP to 100 requests per windowMs
        statusCode: 429,
      })
    : noOpMiddleware;

// Rate limiter for public routes (e.g., email capture)
export const publicLimiter =
  process.env.NODE_ENV === "production"
    ? rateLimit({
        windowMs: 60 * 60 * 1000, // 1 hour
        max: 10, // Limit each IP to 10 requests per hour
        statusCode: 429,
      })
    : noOpMiddleware;

// Rate limiter for AI generation routes (more restrictive)
export const aiLimiter =
  process.env.NODE_ENV === "production"
    ? rateLimit({
        windowMs: 60 * 60 * 1000, // 1 hour
        max: 20, // Limit each IP to 20 AI requests per hour
        statusCode: 429,
      })
    : noOpMiddleware;
