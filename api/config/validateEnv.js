/**
 * Environment variable validation
 * Validates all required environment variables at startup
 */

const requiredEnvVars = {
  // Server
  NODE_ENV: {
    required: false,
    default: "development",
    validate: (value) => ["development", "production", "test"].includes(value),
  },
  PORT: {
    required: false,
    default: "8000",
    validate: (value) => !isNaN(parseInt(value)) && parseInt(value) > 0,
  },
  // Database
  MONGO_URI: {
    required: true,
    validate: (value) => typeof value === "string" && value.length > 0,
  },
  // JWT
  JWT_KEY: {
    required: true,
    validate: (value) => typeof value === "string" && value.length >= 32,
  },
  JWT_EXPIRES_IN: {
    required: false,
    default: "15m",
  },
  JWT_REFRESH_EXPIRES_IN: {
    required: false,
    default: "7d",
  },
  // Cloudinary (optional but recommended)
  CLOUDINARY_CLOUD_NAME: {
    required: false,
    validate: (value) => !value || typeof value === "string",
  },
  CLOUDINARY_API_KEY: {
    required: false,
    validate: (value) => !value || typeof value === "string",
  },
  CLOUDINARY_API_SECRET: {
    required: false,
    validate: (value) => !value || typeof value === "string",
  },
  // AI Providers (at least one required)
  GOOGLE_AI_API_KEY: {
    required: false,
    validate: (value) => !value || typeof value === "string",
  },
  OPENAI_API_KEY: {
    required: false,
    validate: (value) => !value || typeof value === "string",
  },
  // Email (optional)
  EMAIL_HOST: {
    required: false,
    validate: (value) => !value || typeof value === "string",
  },
  EMAIL_PORT: {
    required: false,
    default: "587",
    validate: (value) => !value || !isNaN(parseInt(value)),
  },
  EMAIL_USER: {
    required: false,
    validate: (value) => !value || typeof value === "string",
  },
  EMAIL_PASS: {
    required: false,
    validate: (value) => !value || typeof value === "string",
  },
  EMAIL_FROM: {
    required: false,
    validate: (value) => !value || typeof value === "string",
  },
  // Frontend
  FRONTEND_URL: {
    required: false,
    default: "http://localhost:3000",
    validate: (value) => typeof value === "string" && value.length > 0,
  },
  // African Market Settings
  DEFAULT_TIMEZONE: {
    required: false,
    default: "Africa/Lagos",
    validate: (value) =>
      !value ||
      ["Africa/Lagos", "Africa/Accra", "Africa/Nairobi", "UTC"].includes(
        value
      ),
  },
  DEFAULT_CURRENCY: {
    required: false,
    default: "NGN",
    validate: (value) =>
      !value || ["NGN", "GHS", "USD", "KES", "ZAR", "EGP"].includes(value),
  },
};

/**
 * Validate environment variables
 * @throws {Error} If required variables are missing or invalid
 */
export const validateEnv = () => {
  const errors = [];
  const warnings = [];

  // Check required variables
  for (const [key, config] of Object.entries(requiredEnvVars)) {
    const value = process.env[key];

    if (config.required && !value) {
      errors.push(`Required environment variable ${key} is missing`);
      continue;
    }

    // Set default if not provided
    if (!value && config.default) {
      process.env[key] = config.default;
      continue;
    }

    // Validate value if validator exists
    if (value && config.validate && !config.validate(value)) {
      errors.push(
        `Environment variable ${key} has invalid value: ${value}`
      );
    }
  }

  // Check AI providers (at least one should be configured)
  if (!process.env.GOOGLE_AI_API_KEY && !process.env.OPENAI_API_KEY) {
    warnings.push(
      "No AI providers configured. AI features will use rule-based fallback."
    );
  }

  // Check Cloudinary (recommended)
  if (
    !process.env.CLOUDINARY_CLOUD_NAME ||
    !process.env.CLOUDINARY_API_KEY ||
    !process.env.CLOUDINARY_API_SECRET
  ) {
    warnings.push(
      "Cloudinary not fully configured. File uploads may not work."
    );
  }

  // Check email service (optional but recommended)
  if (
    !process.env.EMAIL_HOST ||
    !process.env.EMAIL_USER ||
    !process.env.EMAIL_PASS
  ) {
    warnings.push(
      "Email service not configured. Email features will not work."
    );
  }

  // Throw if there are errors
  if (errors.length > 0) {
    throw new Error(
      `Environment validation failed:\n${errors.join("\n")}\n\n${warnings.join("\n")}`
    );
  }

  // Log warnings
  if (warnings.length > 0) {
    console.warn("Environment validation warnings:\n" + warnings.join("\n"));
  }

  return { errors, warnings };
};

export default validateEnv;

