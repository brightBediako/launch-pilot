import express from "express";
import {
  trackAnalyticsEvent,
  getLaunchAnalytics,
  getDashboard,
} from "../controllers/analyticsController.js";
import { protect } from "../middleware/auth.js";
import { apiLimiter } from "../middleware/rateLimiter.js";
import { body, param } from "express-validator";
import {
  validateRequest,
  validationRules,
} from "../middleware/validateRequest.js";

const router = express.Router();

router.post(
  "/events",
  protect,
  apiLimiter,
  [
    body("type")
      .isIn([
        "page_view",
        "email_signup",
        "draft_generated",
        "task_completed",
        "plan_generated",
        "partner_assigned",
        "launch_published",
      ])
      .withMessage("Invalid event type"),
    body("launchId")
      .optional()
      .custom(validationRules.mongoId("launchId").validator),
    validateRequest,
  ],
  trackAnalyticsEvent
);

router.get(
  "/launches/:id",
  protect,
  apiLimiter,
  validationRules.mongoId("id"),
  validateRequest,
  getLaunchAnalytics
);

router.get("/dashboard", protect, apiLimiter, getDashboard);

export default router;
