import express from "express";
import {
  createLaunchPage,
  getLaunchPageBySlug,
  getLaunchPage,
  updateLaunchPage,
  publishLaunchPage,
  subscribePage,
  getSubscribers,
  notifyAllSubscribers,
} from "../controllers/launchPageController.js";
import { protect } from "../middleware/auth.js";
import { apiLimiter, publicLimiter } from "../middleware/rateLimiter.js";
import { body } from "express-validator";
import {
  validateRequest,
  validationRules,
} from "../middleware/validateRequest.js";

const router = express.Router();

router.post(
  "/",
  protect,
  apiLimiter,
  [
    body("launchId").custom(validationRules.mongoId("launchId").validator),
    body("customUrl")
      .optional()
      .isString()
      .trim()
      .isLength({ min: 3, max: 50 })
      .matches(/^[a-z0-9-]+$/)
      .withMessage(
        "Custom URL must be lowercase alphanumeric with hyphens only"
      ),
    validateRequest,
  ],
  createLaunchPage
);

// Public route - get by slug
router.get("/:slug", publicLimiter, getLaunchPageBySlug);

// Get by ID
router.get(
  "/id/:id",
  protect,
  apiLimiter,
  validationRules.mongoId("id"),
  validateRequest,
  getLaunchPage
);

router.patch(
  "/:id",
  protect,
  apiLimiter,
  validationRules.mongoId("id"),
  validateRequest,
  updateLaunchPage
);

router.post(
  "/:id/publish",
  protect,
  apiLimiter,
  validationRules.mongoId("id"),
  validateRequest,
  publishLaunchPage
);

// Public route - subscribe
router.post(
  "/:slug/subscribe",
  publicLimiter,
  [
    validationRules.email,
    body("name")
      .optional()
      .isString()
      .trim()
      .isLength({ min: 1, max: 100 })
      .withMessage("Name must be between 1 and 100 characters"),
    validateRequest,
  ],
  subscribePage
);

router.get(
  "/:id/subscribers",
  protect,
  apiLimiter,
  validationRules.mongoId("id"),
  validateRequest,
  getSubscribers
);

router.post(
  "/:id/notify",
  protect,
  apiLimiter,
  validationRules.mongoId("id"),
  validateRequest,
  notifyAllSubscribers
);

export default router;
