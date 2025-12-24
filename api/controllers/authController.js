import User from "../models/User.js";
import Profile from "../models/Profile.js";
import mongoose from "mongoose";
import {
  generateToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "../middleware/auth.js";
import { sendPasswordResetEmail } from "../services/emailService.js";
import logger from "../utils/logger.js";
import crypto from "crypto";

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
export const register = async (req, res, next) => {
  try {
    const { email, password, name, timezone, currency } = req.body;

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: "User with this email already exists",
      });
    }

    // Use transaction for user and profile creation
    const session = await mongoose.startSession();
    let user;

    try {
      await session.withTransaction(async () => {
        // Create user
        const createdUsers = await User.create(
          [
            {
              email,
              password,
              name,
              timezone: timezone || "Africa/Lagos",
              currency: currency || "NGN",
            },
          ],
          { session }
        );
        user = createdUsers[0];

        // Create associated profile
        await Profile.create(
          [
            {
              userId: user._id,
            },
          ],
          { session }
        );
      });

      // Generate tokens (outside transaction)
      const token = generateToken(user._id);
      const refreshToken = generateRefreshToken(user._id);

      // Save hashed refresh token to user (outside transaction)
      await user.setRefreshToken(refreshToken);

      res.status(201).json({
        success: true,
        message: "User registered successfully",
        data: {
          user: {
            id: user._id,
            email: user.email,
            name: user.name,
            role: user.role,
            timezone: user.timezone,
            currency: user.currency,
          },
          token,
          refreshToken,
        },
      });
    } finally {
      await session.endSession();
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Check if user exists and get password
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // Update last login
    user.lastLogin = Date.now();

    // Generate tokens
    const token = generateToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    // Save hashed refresh token
    await user.setRefreshToken(refreshToken);

    res.json({
      success: true,
      message: "Login successful",
      data: {
        user: {
          id: user._id,
          email: user.email,
          name: user.name,
          role: user.role,
          timezone: user.timezone,
          currency: user.currency,
          avatar: user.avatar,
        },
        token,
        refreshToken,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Refresh access token
// @route   POST /api/auth/refresh-token
// @access  Public
export const refreshToken = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({
        success: false,
        message: "Refresh token is required",
      });
    }

    // Verify refresh token
    const decoded = verifyRefreshToken(refreshToken);

    // Get user and check if refresh token matches
    const user = await User.findById(decoded.id).select("+refreshToken");

    if (!user || !(await user.compareRefreshToken(refreshToken))) {
      return res.status(401).json({
        success: false,
        message: "Invalid refresh token",
      });
    }

    // Generate new tokens (token rotation)
    const newToken = generateToken(user._id);
    const newRefreshToken = generateRefreshToken(user._id);

    // Update hashed refresh token
    await user.setRefreshToken(newRefreshToken);

    res.json({
      success: true,
      message: "Token refreshed successfully",
      data: {
        token: newToken,
        refreshToken: newRefreshToken,
      },
    });
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired refresh token",
    });
  }
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    const profile = await Profile.findOne({ userId: req.user._id });

    res.json({
      success: true,
      data: {
        user,
        profile,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Forgot password
// @route   POST /api/auth/forgot-password
// @access  Public
export const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "No user found with this email",
      });
    }

    // Generate reset token
    const resetToken = user.createPasswordResetToken();
    await user.save({ validateBeforeSave: false });

    // Send password reset email
    try {
      await sendPasswordResetEmail(user.email, resetToken);
    } catch (emailError) {
      // Log error but don't reveal if user exists
      // Still return success to prevent user enumeration
      logger.error(`Error sending password reset email: ${emailError.message}`);
    }

    // Security: Never return token in response or reveal if user exists
    res.json({
      success: true,
      message:
        "If an account exists with this email, a password reset link has been sent.",
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Reset password
// @route   PATCH /api/auth/reset-password/:token
// @access  Public
export const resetPassword = async (req, res, next) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    // Hash token from params
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    // Find user with valid token
    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() },
    }).select("+passwordResetToken +passwordResetExpires");

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired reset token",
      });
    }

    // Set new password
    user.password = password;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    // Generate new tokens
    const newToken = generateToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    // Save hashed refresh token
    await user.setRefreshToken(refreshToken);

    res.json({
      success: true,
      message: "Password reset successful",
      data: {
        token: newToken,
        refreshToken,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Logout user
// @route   POST /api/auth/logout
// @access  Private
export const logout = async (req, res, next) => {
  try {
    // Clear refresh token
    await User.findByIdAndUpdate(req.user._id, {
      refreshToken: null,
    });

    res.json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    next(error);
  }
};
