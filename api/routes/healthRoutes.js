import express from "express";
import mongoose from "mongoose";
import { GoogleGenerativeAI } from "@google/generative-ai";
import OpenAI from "openai";
import logger from "../utils/logger.js";

const router = express.Router();

/**
 * Health check endpoint
 * @route GET /health
 * @access Public
 */
router.get("/", async (req, res) => {
  const health = {
    status: "healthy",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || "development",
    services: {},
  };

  // Check database connection
  try {
    const dbState = mongoose.connection.readyState;
    const dbStates = {
      0: "disconnected",
      1: "connected",
      2: "connecting",
      3: "disconnecting",
    };
    health.services.database = {
      status: dbState === 1 ? "healthy" : "unhealthy",
      state: dbStates[dbState] || "unknown",
    };
  } catch (error) {
    health.services.database = {
      status: "unhealthy",
      error: error.message,
    };
  }

  // Check AI services (non-blocking)
  try {
    if (process.env.GOOGLE_AI_API_KEY) {
      health.services.gemini = { status: "configured" };
    } else {
      health.services.gemini = { status: "not_configured" };
    }
  } catch (error) {
    health.services.gemini = { status: "error", error: error.message };
  }

  try {
    if (process.env.OPENAI_API_KEY) {
      health.services.openai = { status: "configured" };
    } else {
      health.services.openai = { status: "not_configured" };
    }
  } catch (error) {
    health.services.openai = { status: "error", error: error.message };
  }

  // Check Cloudinary (non-blocking)
  try {
    if (
      process.env.CLOUDINARY_CLOUD_NAME &&
      process.env.CLOUDINARY_API_KEY &&
      process.env.CLOUDINARY_API_SECRET
    ) {
      health.services.cloudinary = { status: "configured" };
    } else {
      health.services.cloudinary = { status: "not_configured" };
    }
  } catch (error) {
    health.services.cloudinary = { status: "error", error: error.message };
  }

  // Check email service (non-blocking)
  try {
    if (
      process.env.EMAIL_HOST &&
      process.env.EMAIL_USER &&
      process.env.EMAIL_PASS
    ) {
      health.services.email = { status: "configured" };
    } else {
      health.services.email = { status: "not_configured" };
    }
  } catch (error) {
    health.services.email = { status: "error", error: error.message };
  }

  // Determine overall status
  const hasUnhealthyService = Object.values(health.services).some(
    (service) => service.status === "unhealthy"
  );

  if (hasUnhealthyService) {
    health.status = "degraded";
  }

  // Return appropriate status code
  const statusCode = health.status === "healthy" ? 200 : 503;

  res.status(statusCode).json(health);
});

/**
 * Readiness probe (for Kubernetes/Docker)
 * Checks if service is ready to accept traffic
 */
router.get("/ready", async (req, res) => {
  try {
    // Check critical services
    const dbReady = mongoose.connection.readyState === 1;

    if (!dbReady) {
      return res.status(503).json({
        status: "not_ready",
        message: "Database not connected",
      });
    }

    res.status(200).json({
      status: "ready",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    logger.error(`Readiness check failed: ${error.message}`);
    res.status(503).json({
      status: "not_ready",
      message: error.message,
    });
  }
});

/**
 * Liveness probe (for Kubernetes/Docker)
 * Checks if service is alive
 */
router.get("/live", (req, res) => {
  res.status(200).json({
    status: "alive",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

export default router;

