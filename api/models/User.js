import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      validate: {
        validator: function (email) {
          return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
        },
        message: "Please provide a valid email address",
      },
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [8, "Password must be at least 8 characters"],
      select: false, // Don't return password by default
    },
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: [2, "Name must be at least 2 characters"],
      maxlength: [50, "Name cannot exceed 50 characters"],
    },
    avatar: {
      type: String,
      default: null,
    },
    role: {
      type: String,
      enum: ["user", "admin", "partner"],
      default: "user",
    },
    timezone: {
      type: String,
      enum: ["Africa/Lagos", "Africa/Accra", "UTC"],
      default: "Africa/Lagos",
    },
    currency: {
      type: String,
      enum: ["NGN", "GHS", "USD"],
      default: "NGN",
    },
    refreshToken: {
      type: String,
      select: false,
    },
    passwordResetToken: {
      type: String,
      select: false,
    },
    passwordResetExpires: {
      type: Date,
      select: false,
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    emailVerificationToken: {
      type: String,
      select: false,
    },
    lastLogin: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: function (doc, ret) {
        delete ret.password;
        delete ret.refreshToken;
        delete ret.passwordResetToken;
        delete ret.passwordResetExpires;
        delete ret.emailVerificationToken;
        delete ret.__v;
        return ret;
      },
    },
  }
);

// Index for faster queries
// Note: email index is automatically created by unique: true
userSchema.index({ role: 1 });
userSchema.index({ createdAt: -1 });

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Note: refreshToken is now hashed using setRefreshToken method
// We don't hash it in pre-save to avoid double hashing

// Method to compare passwords
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Method to hash and save refresh token
userSchema.methods.setRefreshToken = async function (refreshToken) {
  const salt = await bcrypt.genSalt(12);
  this.refreshToken = await bcrypt.hash(refreshToken, salt);
  await this.save();
};

// Method to compare refresh token
userSchema.methods.compareRefreshToken = async function (candidateToken) {
  if (!this.refreshToken) return false;
  return await bcrypt.compare(candidateToken, this.refreshToken);
};

// Method to generate password reset token
userSchema.methods.createPasswordResetToken = function () {
  const resetToken = require("crypto").randomBytes(32).toString("hex");

  this.passwordResetToken = require("crypto")
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  this.passwordResetExpires = Date.now() + 10 * 60 * 1000; // 10 minutes

  return resetToken;
};

const User = mongoose.model("User", userSchema);

export default User;
