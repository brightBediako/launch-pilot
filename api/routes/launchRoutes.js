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

/**
 * @swagger
 * /api/launches:
 *   post:
 *     summary: Create a new launch
 *     tags: [Launches]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - description
 *               - productType
 *               - targetDate
 *             properties:
 *               title:
 *                 type: string
 *                 minLength: 3
 *                 maxLength: 100
 *                 example: EcoTech Mobile App Launch
 *               description:
 *                 type: string
 *                 minLength: 10
 *                 maxLength: 2000
 *                 example: Revolutionary eco-friendly mobile app for Nigerian market
 *               productType:
 *                 type: string
 *                 enum: [saas, mobile-app, web-app, physical-product, service, other]
 *                 example: mobile-app
 *               targetDate:
 *                 type: string
 *                 format: date-time
 *                 example: 2025-03-15T00:00:00Z
 *               markets:
 *                 type: array
 *                 items:
 *                   type: string
 *                   enum: [Nigeria, Ghana, Kenya, South Africa, Egypt]
 *                 example: [Nigeria, Ghana]
 *               budget:
 *                 type: object
 *                 properties:
 *                   amount:
 *                     type: number
 *                     example: 5000
 *                   currency:
 *                     type: string
 *                     enum: [NGN, GHS, USD, KES, ZAR, EGP]
 *                     example: NGN
 *     responses:
 *       201:
 *         description: Launch created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Launch created successfully
 *                 data:
 *                   $ref: '#/components/schemas/Launch'
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */
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

/**
 * @swagger
 * /api/launches:
 *   get:
 *     summary: Get all launches for current user
 *     tags: [Launches]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [draft, planning, active, completed, cancelled]
 *         description: Filter by launch status
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Items per page
 *     responses:
 *       200:
 *         description: Launches retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     launches:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Launch'
 *                     pagination:
 *                       type: object
 *                       properties:
 *                         total:
 *                           type: integer
 *                         page:
 *                           type: integer
 *                         pages:
 *                           type: integer
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */
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

/**
 * @swagger
 * /api/launches/{id}:
 *   get:
 *     summary: Get a single launch by ID
 *     tags: [Launches]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Launch ID
 *     responses:
 *       200:
 *         description: Launch retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Launch'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */
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

/**
 * @swagger
 * /api/launches/{id}/generate-plan:
 *   post:
 *     summary: Generate AI-powered launch plan
 *     tags: [Launches]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Launch ID
 *     responses:
 *       200:
 *         description: Launch plan generated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Launch plan generated successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     plan:
 *                       $ref: '#/components/schemas/LaunchPlan'
 *                     aiProvider:
 *                       type: string
 *                       enum: [gemini, openai, template]
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       429:
 *         description: AI rate limit exceeded
 */
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
