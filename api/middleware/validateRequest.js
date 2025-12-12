import { validationResult } from "express-validator";

// Middleware to validate request using express-validator
export const validateRequest = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: errors.array().map((err) => ({
        field: err.path || err.param,
        message: err.msg,
      })),
    });
  }

  next();
};

// Common validation rules
export const validationRules = {
  // Email validation
  email: {
    isEmail: {
      errorMessage: "Please provide a valid email address",
    },
    normalizeEmail: true,
  },

  // Password validation
  password: {
    isLength: {
      options: { min: 8 },
      errorMessage: "Password must be at least 8 characters long",
    },
    matches: {
      options: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      errorMessage:
        "Password must contain at least one uppercase letter, one lowercase letter, and one number",
    },
  },

  // Name validation
  name: {
    trim: true,
    isLength: {
      options: { min: 2, max: 50 },
      errorMessage: "Name must be between 2 and 50 characters",
    },
  },

  // MongoDB ObjectId validation
  mongoId: {
    isMongoId: {
      errorMessage: "Invalid ID format",
    },
  },

  // URL validation
  url: {
    optional: { options: { nullable: true, checkFalsy: true } },
    isURL: {
      errorMessage: "Please provide a valid URL",
    },
  },

  // Timezone validation
  timezone: {
    isIn: {
      options: [["Africa/Lagos", "Africa/Accra", "UTC"]],
      errorMessage:
        "Invalid timezone. Must be Africa/Lagos, Africa/Accra, or UTC",
    },
  },

  // Currency validation
  currency: {
    isIn: {
      options: [["NGN", "GHS", "USD"]],
      errorMessage: "Invalid currency. Must be NGN, GHS, or USD",
    },
  },
};
