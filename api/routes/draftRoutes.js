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
