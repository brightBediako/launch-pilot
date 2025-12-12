import express from "express";
import { body } from "express-validator";
import {
  register,
  login,
  refreshToken,
  getMe,
  forgotPassword,
  resetPassword,
  logout,
} from "../controllers/authController.js";
import { protect } from "../middleware/auth.js";
import {
  validateRequest,
  validationRules,
} from "../middleware/validateRequest.js";
import { authLimiter } from "../middleware/rateLimiter.js";

const router = express.Router();

// @route   POST /api/auth/register
router.post(
  "/register",
  authLimiter,
  [
    body("email").custom(validationRules.email.isEmail),
    body("password")
      .custom(validationRules.password.isLength)
      .custom(validationRules.password.matches),
    body("name").custom(validationRules.name.isLength).trim(),
    body("timezone").optional().custom(validationRules.timezone.isIn),
    body("currency").optional().custom(validationRules.currency.isIn),
  ],
  validateRequest,
  register
);

// @route   POST /api/auth/login
router.post(
  "/login",
  authLimiter,
  [
    body("email").isEmail().withMessage("Please provide a valid email"),
    body("password").notEmpty().withMessage("Password is required"),
  ],
  validateRequest,
  login
);

// @route   POST /api/auth/refresh-token
router.post(
  "/refresh-token",
  [body("refreshToken").notEmpty().withMessage("Refresh token is required")],
  validateRequest,
  refreshToken
);

// @route   GET /api/auth/me
router.get("/me", protect, getMe);

// @route   POST /api/auth/forgot-password
router.post(
  "/forgot-password",
  authLimiter,
  [body("email").isEmail().withMessage("Please provide a valid email")],
  validateRequest,
  forgotPassword
);

// @route   PATCH /api/auth/reset-password/:token
router.patch(
  "/reset-password/:token",
  [
    body("password")
      .isLength({ min: 8 })
      .withMessage("Password must be at least 8 characters long")
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
      .withMessage("Password must contain uppercase, lowercase, and number"),
  ],
  validateRequest,
  resetPassword
);

// @route   POST /api/auth/logout
router.post("/logout", protect, logout);

export default router;
