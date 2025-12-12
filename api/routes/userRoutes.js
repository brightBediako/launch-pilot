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

// @route   GET /api/users/:id
router.get(
  "/:id",
  [param("id").custom(validationRules.mongoId.isMongoId)],
  validateRequest,
  getUser
);

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
