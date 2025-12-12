import User from "../models/User.js";
import Profile from "../models/Profile.js";
import cloudinary from "../config/fileUpload.js";

// @desc    Get user by ID
// @route   GET /api/users/:id
// @access  Private
export const getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const profile = await Profile.findOne({ userId: user._id });

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

// @desc    Update user
// @route   PATCH /api/users/:id
// @access  Private
export const updateUser = async (req, res, next) => {
  try {
    const {
      name,
      timezone,
      currency,
      bio,
      company,
      website,
      social,
      expertise,
    } = req.body;

    // Check if user is updating their own profile or is admin
    if (
      req.user._id.toString() !== req.params.id &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to update this user",
      });
    }

    // Update user basic info
    const userUpdateData = {};
    if (name) userUpdateData.name = name;
    if (timezone) userUpdateData.timezone = timezone;
    if (currency) userUpdateData.currency = currency;

    const user = await User.findByIdAndUpdate(req.params.id, userUpdateData, {
      new: true,
      runValidators: true,
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Update profile if provided
    const profileUpdateData = {};
    if (bio !== undefined) profileUpdateData.bio = bio;
    if (company !== undefined) profileUpdateData.company = company;
    if (website !== undefined) profileUpdateData.website = website;
    if (social) profileUpdateData.social = social;
    if (expertise) profileUpdateData.expertise = expertise;

    const profile = await Profile.findOneAndUpdate(
      { userId: user._id },
      profileUpdateData,
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      message: "User updated successfully",
      data: {
        user,
        profile,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Upload user avatar
// @route   POST /api/users/:id/avatar
// @access  Private
export const uploadAvatar = async (req, res, next) => {
  try {
    // Check if user is updating their own avatar or is admin
    if (
      req.user._id.toString() !== req.params.id &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to update this user",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Please upload an image file",
      });
    }

    // Cloudinary URL is available in req.file.path
    const avatarUrl = req.file.path;

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { avatar: avatarUrl },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.json({
      success: true,
      message: "Avatar uploaded successfully",
      data: {
        avatar: avatarUrl,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private (Admin only)
export const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Delete associated profile
    await Profile.findOneAndDelete({ userId: user._id });

    // Delete user
    await user.deleteOne();

    res.json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};
