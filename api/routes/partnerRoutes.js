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
import { body, query, param } from "express-validator";
import {
  validateRequest,
  validationRules,
} from "../middleware/validateRequest.js";

const router = express.Router();

// Partner profile routes
/**
 * @swagger
 * /api/partners:
 *   post:
 *     summary: Create partner profile
 *     tags: [Partners]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - services
 *               - pricing
 *             properties:
 *               services:
 *                 type: array
 *                 items:
 *                   type: string
 *                   enum: [design, marketing, development, content, consulting]
 *                 example: [design, marketing]
 *               pricing:
 *                 type: object
 *                 properties:
 *                   hourlyRate:
 *                     type: number
 *                   projectRate:
 *                     type: number
 *                   currency:
 *                     type: string
 *                     enum: [NGN, GHS, USD, KES, ZAR, EGP]
 *     responses:
 *       201:
 *         description: Partner profile created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Partner'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */
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
  [param("id").custom(validationRules.mongoId.isMongoId)],
  validateRequest,
  getPartner
);

router.patch(
  "/:id",
  protect,
  apiLimiter,
  [param("id").custom(validationRules.mongoId.isMongoId)],
  validateRequest,
  updatePartner
);

router.post(
  "/:id/review",
  protect,
  apiLimiter,
  [
    param("id").custom(validationRules.mongoId.isMongoId),
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
  [param("id").custom(validationRules.mongoId.isMongoId)],
  validateRequest,
  deletePartner
);

// Partner assignment routes
router.post(
  "/:partnerId/assignments",
  protect,
  apiLimiter,
  [
    param("partnerId").custom(validationRules.mongoId.isMongoId),
    body("launchId").custom(validationRules.mongoId.isMongoId),
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
    param("id").custom(validationRules.mongoId.isMongoId),
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
    param("id").custom(validationRules.mongoId.isMongoId),
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
    param("id").custom(validationRules.mongoId.isMongoId),
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
