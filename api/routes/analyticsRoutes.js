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

/**
 * @swagger
 * /api/analytics/events:
 *   post:
 *     summary: Track analytics event
 *     tags: [Analytics]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - type
 *             properties:
 *               type:
 *                 type: string
 *                 enum: [page_view, email_signup, draft_generated, task_completed, plan_generated, partner_assigned, launch_published]
 *                 example: page_view
 *               launchId:
 *                 type: string
 *     responses:
 *       201:
 *         description: Event tracked successfully
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
 *                   example: Event tracked successfully
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */
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
    body("launchId").optional().custom(validationRules.mongoId.isMongoId),
    validateRequest,
  ],
  trackAnalyticsEvent
);

/**
 * @swagger
 * /api/analytics/launches/{id}:
 *   get:
 *     summary: Get analytics for a specific launch
 *     tags: [Analytics]
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
 *         description: Launch analytics retrieved
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     metrics:
 *                       $ref: '#/components/schemas/LaunchMetrics'
 *                     trends:
 *                       type: array
 *                       items:
 *                         type: object
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */
router.get(
  "/launches/:id",
  protect,
  apiLimiter,
  [param("id").custom(validationRules.mongoId.isMongoId)],
  validateRequest,
  getLaunchAnalytics
);

/**
 * @swagger
 * /api/analytics/dashboard:
 *   get:
 *     summary: Get overall dashboard analytics
 *     tags: [Analytics]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard analytics retrieved
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     totalLaunches:
 *                       type: integer
 *                     activeLaunches:
 *                       type: integer
 *                     totalPageViews:
 *                       type: integer
 *                     totalEmailSignups:
 *                       type: integer
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */
router.get("/dashboard", protect, apiLimiter, getDashboard);

export default router;
