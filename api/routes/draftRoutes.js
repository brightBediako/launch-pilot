import express from "express";
import { body, param } from "express-validator";
import {
  createDraft,
  getDraftsByLaunch,
  getDraft,
  updateDraft,
  deleteDraft,
  regenerateDraft,
  publishDraft,
} from "../controllers/draftController.js";
import { protect } from "../middleware/auth.js";
import {
  validateRequest,
  validationRules,
} from "../middleware/validateRequest.js";
import { apiLimiter, aiLimiter } from "../middleware/rateLimiter.js";

const router = express.Router();

// All routes require authentication
router.use(protect);

// Launch-specific routes
/**
 * @swagger
 * /api/launches/{launchId}/drafts:
 *   post:
 *     summary: Create AI-generated content draft
 *     tags: [Content Drafts]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: launchId
 *         required: true
 *         schema:
 *           type: string
 *         description: Launch ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - platform
 *             properties:
 *               platform:
 *                 type: string
 *                 enum: [producthunt, twitter, linkedin]
 *                 example: twitter
 *               generateWithAI:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       201:
 *         description: Content draft created successfully
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
 *                   example: Draft created successfully
 *                 data:
 *                   $ref: '#/components/schemas/ContentDraft'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       429:
 *         description: AI rate limit exceeded
 */
// @route   POST /api/launches/:launchId/drafts
router.post(
  "/launches/:launchId/drafts",
  aiLimiter,
  [
    param("launchId").custom(validationRules.mongoId.isMongoId),
    body("platform")
      .isIn(["producthunt", "twitter", "linkedin"])
      .withMessage("Invalid platform"),
    body("generateWithAI")
      .optional()
      .isBoolean()
      .withMessage("generateWithAI must be boolean"),
  ],
  validateRequest,
  createDraft
);

/**
 * @swagger
 * /api/launches/{launchId}/drafts:
 *   get:
 *     summary: Get all drafts for a launch
 *     tags: [Content Drafts]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: launchId
 *         required: true
 *         schema:
 *           type: string
 *         description: Launch ID
 *     responses:
 *       200:
 *         description: Drafts retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/ContentDraft'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */
// @route   GET /api/launches/:launchId/drafts
router.get(
  "/launches/:launchId/drafts",
  apiLimiter,
  [param("launchId").custom(validationRules.mongoId.isMongoId)],
  validateRequest,
  getDraftsByLaunch
);

// Draft-specific routes
// @route   GET /api/drafts/:id
router.get(
  "/:id",
  apiLimiter,
  [param("id").custom(validationRules.mongoId.isMongoId)],
  validateRequest,
  getDraft
);

// @route   PATCH /api/drafts/:id
router.patch(
  "/:id",
  apiLimiter,
  [
    param("id").custom(validationRules.mongoId.isMongoId),
    body("content")
      .optional()
      .isObject()
      .withMessage("Content must be an object"),
    body("status")
      .optional()
      .isIn(["draft", "scheduled", "published"])
      .withMessage("Invalid status"),
  ],
  validateRequest,
  updateDraft
);

// @route   DELETE /api/drafts/:id
router.delete(
  "/:id",
  apiLimiter,
  [param("id").custom(validationRules.mongoId.isMongoId)],
  validateRequest,
  deleteDraft
);

// @route   POST /api/drafts/:id/regenerate
router.post(
  "/:id/regenerate",
  aiLimiter,
  [param("id").custom(validationRules.mongoId.isMongoId)],
  validateRequest,
  regenerateDraft
);

// @route   POST /api/drafts/:id/publish
router.post(
  "/:id/publish",
  apiLimiter,
  [param("id").custom(validationRules.mongoId.isMongoId)],
  validateRequest,
  publishDraft
);

export default router;
