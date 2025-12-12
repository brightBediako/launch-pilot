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
import { body, param } from "express-validator";
import {
  validateRequest,
  validationRules,
} from "../middleware/validateRequest.js";

const router = express.Router();

/**
 * @swagger
 * /api/launch-pages:
 *   post:
 *     summary: Create a new launch page
 *     tags: [Launch Pages]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - launchId
 *             properties:
 *               launchId:
 *                 type: string
 *               customUrl:
 *                 type: string
 *                 pattern: ^[a-z0-9-]+$
 *                 minLength: 3
 *                 maxLength: 50
 *                 example: ecotech-app-launch
 *     responses:
 *       201:
 *         description: Launch page created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/LaunchPage'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */
router.post(
  "/",
  protect,
  apiLimiter,
  [
    body("launchId").custom(validationRules.mongoId.isMongoId),
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

/**
 * @swagger
 * /api/launch-pages/{slug}:
 *   get:
 *     summary: Get launch page by slug (public)
 *     tags: [Launch Pages]
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *         description: Launch page slug
 *         example: ecotech-app-launch
 *     responses:
 *       200:
 *         description: Launch page retrieved
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/LaunchPage'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 */
// Public route - get by slug
router.get("/:slug", publicLimiter, getLaunchPageBySlug);

// Get by ID
router.get(
  "/id/:id",
  protect,
  apiLimiter,
  [param("id").custom(validationRules.mongoId.isMongoId)],
  validateRequest,
  getLaunchPage
);

router.patch(
  "/:id",
  protect,
  apiLimiter,
  [param("id").custom(validationRules.mongoId.isMongoId)],
  validateRequest,
  updateLaunchPage
);

router.post(
  "/:id/publish",
  protect,
  apiLimiter,
  [param("id").custom(validationRules.mongoId.isMongoId)],
  validateRequest,
  publishLaunchPage
);

// Public route - subscribe
router.post(
  "/:slug/subscribe",
  publicLimiter,
  [
    body("email")
      .isEmail()
      .withMessage("Please provide a valid email address")
      .normalizeEmail(),
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
  [param("id").custom(validationRules.mongoId.isMongoId)],
  validateRequest,
  getSubscribers
);

router.post(
  "/:id/notify",
  protect,
  apiLimiter,
  [param("id").custom(validationRules.mongoId.isMongoId)],
  validateRequest,
  notifyAllSubscribers
);

export default router;
