import express from "express";
import {
  createPartnerProfile,
  getPartners,
  getPartner,
  updatePartner,
  addReview,
  deletePartner,
} from "../controllers/partnerController.js";
import {
  createAssignment,
  getAssignments,
  updateAssignmentStatus,
  addCommunication,
  submitReview,
} from "../controllers/assignmentController.js";
import { protect } from "../middleware/auth.js";
import { apiLimiter, publicLimiter } from "../middleware/rateLimiter.js";
import { body, query } from "express-validator";
import {
  validateRequest,
  validationRules,
} from "../middleware/validateRequest.js";

const router = express.Router();

// Partner profile routes
router.post(
  "/",
  protect,
  apiLimiter,
  [
    body("services")
      .isArray({ min: 1 })
      .withMessage("At least one service is required"),
    body("services.*")
      .isIn(["design", "marketing", "development", "content", "consulting"])
      .withMessage("Invalid service type"),
    body("pricing.hourlyRate")
      .optional()
      .isFloat({ min: 0 })
      .withMessage("Hourly rate must be a positive number"),
    body("pricing.projectRate")
      .optional()
      .isFloat({ min: 0 })
      .withMessage("Project rate must be a positive number"),
    body("pricing.currency")
      .isIn(["NGN", "GHS", "USD", "KES", "ZAR", "EGP"])
      .withMessage("Invalid currency"),
    body("location.country")
      .isIn(["NG", "GH", "KE", "ZA", "EG"])
      .withMessage("Invalid country code"),
    validateRequest,
  ],
  createPartnerProfile
);

router.get("/", publicLimiter, getPartners);

router.get(
  "/:id",
  publicLimiter,
  validationRules.mongoId("id"),
  validateRequest,
  getPartner
);

router.patch(
  "/:id",
  protect,
  apiLimiter,
  validationRules.mongoId("id"),
  validateRequest,
  updatePartner
);

router.post(
  "/:id/review",
  protect,
  apiLimiter,
  [
    validationRules.mongoId("id"),
    body("rating")
      .isInt({ min: 1, max: 5 })
      .withMessage("Rating must be between 1 and 5"),
    body("comment")
      .isString()
      .trim()
      .isLength({ min: 10, max: 500 })
      .withMessage("Comment must be between 10 and 500 characters"),
    validateRequest,
  ],
  addReview
);

router.delete(
  "/:id",
  protect,
  apiLimiter,
  validationRules.mongoId("id"),
  validateRequest,
  deletePartner
);

// Partner assignment routes
router.post(
  "/:partnerId/assignments",
  protect,
  apiLimiter,
  [
    validationRules.mongoId("partnerId"),
    body("launchId").custom(validationRules.mongoId("launchId").validator),
    body("service")
      .isIn(["design", "marketing", "development", "content", "consulting"])
      .withMessage("Invalid service type"),
    body("budget.amount")
      .isFloat({ min: 0 })
      .withMessage("Budget amount must be a positive number"),
    body("budget.currency")
      .isIn(["NGN", "GHS", "USD", "KES", "ZAR", "EGP"])
      .withMessage("Invalid currency"),
    validateRequest,
  ],
  createAssignment
);

router.get("/assignments", protect, apiLimiter, getAssignments);

router.patch(
  "/assignments/:id/status",
  protect,
  apiLimiter,
  [
    validationRules.mongoId("id"),
    body("status")
      .isIn(["pending", "accepted", "in-progress", "completed", "cancelled"])
      .withMessage("Invalid status"),
    validateRequest,
  ],
  updateAssignmentStatus
);

router.post(
  "/assignments/:id/communication",
  protect,
  apiLimiter,
  [
    validationRules.mongoId("id"),
    body("message")
      .isString()
      .trim()
      .isLength({ min: 1, max: 1000 })
      .withMessage("Message must be between 1 and 1000 characters"),
    validateRequest,
  ],
  addCommunication
);

router.post(
  "/assignments/:id/review",
  protect,
  apiLimiter,
  [
    validationRules.mongoId("id"),
    body("rating")
      .isInt({ min: 1, max: 5 })
      .withMessage("Rating must be between 1 and 5"),
    body("comment")
      .isString()
      .trim()
      .isLength({ min: 10, max: 500 })
      .withMessage("Comment must be between 10 and 500 characters"),
    validateRequest,
  ],
  submitReview
);

export default router;
