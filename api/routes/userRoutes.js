import express from "express";
import { param, body } from "express-validator";
import {
  getUser,
  updateUser,
  uploadAvatar,
  deleteUser,
} from "../controllers/userController.js";
import { protect } from "../middleware/auth.js";
import { authorize } from "../middleware/roleCheck.js";
import {
  validateRequest,
  validationRules,
} from "../middleware/validateRequest.js";
import upload from "../config/fileUpload.js";

const router = express.Router();

// All routes require authentication
router.use(protect);

/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     summary: Get user profile by ID
 *     tags: [Users]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     responses:
 *       200:
 *         description: User retrieved successfully
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
 *                     user:
 *                       $ref: '#/components/schemas/User'
 *                     profile:
 *                       $ref: '#/components/schemas/Profile'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */
// @route   GET /api/users/:id
router.get(
  "/:id",
  [param("id").custom(validationRules.mongoId.isMongoId)],
  validateRequest,
  getUser
);

/**
 * @swagger
 * /api/users/{id}:
 *   patch:
 *     summary: Update user profile
 *     tags: [Users]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: John Doe
 *               timezone:
 *                 type: string
 *                 enum: [Africa/Lagos, Africa/Accra, Africa/Nairobi]
 *               currency:
 *                 type: string
 *                 enum: [NGN, GHS, USD, KES, ZAR, EGP]
 *               bio:
 *                 type: string
 *                 maxLength: 500
 *               company:
 *                 type: string
 *                 maxLength: 100
 *               website:
 *                 type: string
 *                 format: uri
 *     responses:
 *       200:
 *         description: User updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Success'
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */
// @route   PATCH /api/users/:id
router.patch(
  "/:id",
  [
    param("id").custom(validationRules.mongoId.isMongoId),
    body("name").optional().custom(validationRules.name.isLength).trim(),
    body("timezone").optional().custom(validationRules.timezone.isIn),
    body("currency").optional().custom(validationRules.currency.isIn),
    body("bio")
      .optional()
      .isLength({ max: 500 })
      .withMessage("Bio cannot exceed 500 characters"),
    body("company")
      .optional()
      .isLength({ max: 100 })
      .withMessage("Company name cannot exceed 100 characters"),
    body("website").optional().custom(validationRules.url.isURL),
  ],
  validateRequest,
  updateUser
);

// @route   POST /api/users/:id/avatar
router.post(
  "/:id/avatar",
  [param("id").custom(validationRules.mongoId.isMongoId)],
  validateRequest,
  upload.single("avatar"),
  uploadAvatar
);

// @route   DELETE /api/users/:id (Admin only)
router.delete(
  "/:id",
  authorize("admin"),
  [param("id").custom(validationRules.mongoId.isMongoId)],
  validateRequest,
  deleteUser
);

export default router;
