import mongoose from "mongoose";

const profileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    bio: {
      type: String,
      maxlength: [500, "Bio cannot exceed 500 characters"],
      trim: true,
      default: "",
    },
    company: {
      type: String,
      maxlength: [100, "Company name cannot exceed 100 characters"],
      trim: true,
      default: "",
    },
    website: {
      type: String,
      validate: {
        validator: function (url) {
          if (!url) return true;
          return /^https?:\/\/.+/.test(url);
        },
        message: "Please provide a valid website URL",
      },
      default: "",
    },
    social: {
      twitter: {
        type: String,
        trim: true,
        default: "",
      },
      linkedin: {
        type: String,
        trim: true,
        default: "",
      },
      producthunt: {
        type: String,
        trim: true,
        default: "",
      },
    },
    expertise: [
      {
        type: String,
        trim: true,
      },
    ],
    launchHistory: [
      {
        launchId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Launch",
        },
        title: String,
        status: String,
        completedAt: Date,
      },
    ],
    preferences: {
      emailNotifications: {
        type: Boolean,
        default: true,
      },
      marketingEmails: {
        type: Boolean,
        default: false,
      },
      weeklyDigest: {
        type: Boolean,
        default: true,
      },
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: function (doc, ret) {
        delete ret.__v;
        return ret;
      },
    },
  }
);

// Index for faster queries
profileSchema.index({ userId: 1 });

const Profile = mongoose.model("Profile", profileSchema);

export default Profile;
