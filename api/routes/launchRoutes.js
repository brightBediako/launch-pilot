import express from "express";
import { body, param, query } from "express-validator";
import {
  createLaunch,
  getLaunches,
  getLaunch,
  updateLaunch,
  deleteLaunch,
  generatePlan,
  regeneratePlan,
} from "../controllers/launchController.js";
import { protect } from "../middleware/auth.js";
import {
  validateRequest,
  validationRules,
} from "../middleware/validateRequest.js";
import { apiLimiter, aiLimiter } from "../middleware/rateLimiter.js";

const router = express.Router();

// All routes require authentication
router.use(protect);

// @route   POST /api/launches
router.post(
  "/",
  apiLimiter,
  [
    body("title")
      .trim()
      .isLength({ min: 3, max: 100 })
      .withMessage("Title must be between 3 and 100 characters"),
    body("description")
      .trim()
      .isLength({ min: 10, max: 2000 })
      .withMessage("Description must be between 10 and 2000 characters"),
    body("productType")
      .isIn([
        "saas",
        "mobile-app",
        "web-app",
        "physical-product",
        "service",
        "other",
      ])
      .withMessage("Invalid product type"),
    body("targetDate")
      .isISO8601()
      .withMessage("Target date must be a valid date")
      .custom((value) => {
        if (new Date(value) <= new Date()) {
          throw new Error("Target date must be in the future");
        }
        return true;
      }),
    body("markets")
      .optional()
      .isArray()
      .withMessage("Markets must be an array"),
    body("budget.amount")
      .optional()
      .isNumeric()
      .withMessage("Budget amount must be a number"),
    body("budget.currency")
      .optional()
      .isIn(["NGN", "GHS", "USD", "KES", "ZAR", "EGP"])
      .withMessage("Invalid currency"),
  ],
  validateRequest,
  createLaunch
);

// @route   GET /api/launches
router.get(
  "/",
  apiLimiter,
  [
    query("status")
      .optional()
      .isIn(["draft", "planning", "active", "completed", "cancelled"])
      .withMessage("Invalid status"),
    query("market")
      .optional()
      .isIn(["NG", "GH", "KE", "ZA", "EG", "global"])
      .withMessage("Invalid market"),
    query("page")
      .optional()
      .isInt({ min: 1 })
      .withMessage("Page must be a positive integer"),
    query("limit")
      .optional()
      .isInt({ min: 1, max: 100 })
      .withMessage("Limit must be between 1 and 100"),
  ],
  validateRequest,
  getLaunches
);

// @route   GET /api/launches/:id
router.get(
  "/:id",
  apiLimiter,
  [param("id").custom(validationRules.mongoId.isMongoId)],
  validateRequest,
  getLaunch
);

// @route   PATCH /api/launches/:id
router.patch(
  "/:id",
  apiLimiter,
  [
    param("id").custom(validationRules.mongoId.isMongoId),
    body("title")
      .optional()
      .trim()
      .isLength({ min: 3, max: 100 })
      .withMessage("Title must be between 3 and 100 characters"),
    body("description")
      .optional()
      .trim()
      .isLength({ min: 10, max: 2000 })
      .withMessage("Description must be between 10 and 2000 characters"),
    body("status")
      .optional()
      .isIn(["draft", "planning", "active", "completed", "cancelled"])
      .withMessage("Invalid status"),
  ],
  validateRequest,
  updateLaunch
);

// @route   DELETE /api/launches/:id
router.delete(
  "/:id",
  apiLimiter,
  [param("id").custom(validationRules.mongoId.isMongoId)],
  validateRequest,
  deleteLaunch
);

// @route   POST /api/launches/:id/generate-plan
router.post(
  "/:id/generate-plan",
  aiLimiter,
  [param("id").custom(validationRules.mongoId.isMongoId)],
  validateRequest,
  generatePlan
);

// @route   POST /api/launches/:id/regenerate-plan
router.post(
  "/:id/regenerate-plan",
  aiLimiter,
  [param("id").custom(validationRules.mongoId.isMongoId)],
  validateRequest,
  regeneratePlan
);

export default router;
