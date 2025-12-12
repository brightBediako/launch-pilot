import express from "express";
import {
  createTask,
  getTasks,
  getTask,
  updateTask,
  deleteTask,
  reorderTask,
  addComment,
} from "../controllers/taskController.js";
import { protect } from "../middleware/auth.js";
import { apiLimiter } from "../middleware/rateLimiter.js";
import { body, query, param } from "express-validator";
import {
  validateRequest,
  validationRules,
} from "../middleware/validateRequest.js";

const router = express.Router();

/**
 * @swagger
 * /api/tasks:
 *   post:
 *     summary: Create a new task
 *     tags: [Tasks]
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
 *               - title
 *             properties:
 *               launchId:
 *                 type: string
 *               title:
 *                 type: string
 *                 minLength: 1
 *                 maxLength: 200
 *                 example: Design launch banner
 *               description:
 *                 type: string
 *                 maxLength: 1000
 *               priority:
 *                 type: string
 *                 enum: [low, medium, high]
 *                 example: high
 *     responses:
 *       201:
 *         description: Task created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Task'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */
router.post(
  "/",
  protect,
  apiLimiter,
  [
    body("launchId").custom(validationRules.mongoId.isMongoId),
    body("title")
      .isString()
      .trim()
      .isLength({ min: 1, max: 200 })
      .withMessage("Title must be between 1 and 200 characters"),
    body("description")
      .optional()
      .isString()
      .trim()
      .isLength({ max: 1000 })
      .withMessage("Description must not exceed 1000 characters"),
    body("priority")
      .optional()
      .isIn(["low", "medium", "high"])
      .withMessage("Invalid priority"),
    validateRequest,
  ],
  createTask
);

router.get(
  "/",
  protect,
  apiLimiter,
  [
    query("launchId").notEmpty().withMessage("launchId is required"),
    validateRequest,
  ],
  getTasks
);

router.get(
  "/:id",
  protect,
  apiLimiter,
  [param("id").custom(validationRules.mongoId.isMongoId)],
  validateRequest,
  getTask
);

router.patch(
  "/:id",
  protect,
  apiLimiter,
  [
    param("id").custom(validationRules.mongoId.isMongoId),
    body("status")
      .optional()
      .isIn(["todo", "in-progress", "review", "done"])
      .withMessage("Invalid status"),
    body("priority")
      .optional()
      .isIn(["low", "medium", "high"])
      .withMessage("Invalid priority"),
    validateRequest,
  ],
  updateTask
);

router.delete(
  "/:id",
  protect,
  apiLimiter,
  [param("id").custom(validationRules.mongoId.isMongoId)],
  validateRequest,
  deleteTask
);

router.patch(
  "/:id/position",
  protect,
  apiLimiter,
  [
    param("id").custom(validationRules.mongoId.isMongoId),
    body("position")
      .isInt({ min: 0 })
      .withMessage("Position must be a non-negative integer"),
    validateRequest,
  ],
  reorderTask
);

router.post(
  "/:id/comments",
  protect,
  apiLimiter,
  [
    param("id").custom(validationRules.mongoId.isMongoId),
    body("text")
      .isString()
      .trim()
      .isLength({ min: 1, max: 500 })
      .withMessage("Comment must be between 1 and 500 characters"),
    validateRequest,
  ],
  addComment
);

export default router;
