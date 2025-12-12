import mongoose from "mongoose";

const launchSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: [true, "Launch title is required"],
      trim: true,
      minlength: [3, "Title must be at least 3 characters"],
      maxlength: [100, "Title cannot exceed 100 characters"],
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
      maxlength: [2000, "Description cannot exceed 2000 characters"],
    },
    productType: {
      type: String,
      enum: [
        "saas",
        "mobile-app",
        "web-app",
        "physical-product",
        "service",
        "other",
      ],
      required: [true, "Product type is required"],
    },
    targetDate: {
      type: Date,
      required: [true, "Target launch date is required"],
      validate: {
        validator: function (date) {
          return date > Date.now();
        },
        message: "Target date must be in the future",
      },
    },
    status: {
      type: String,
      enum: ["draft", "planning", "active", "completed", "cancelled"],
      default: "draft",
      index: true,
    },
    markets: [
      {
        type: String,
        enum: ["NG", "GH", "KE", "ZA", "EG", "global"],
      },
    ],
    budget: {
      amount: {
        type: Number,
        min: [0, "Budget cannot be negative"],
      },
      currency: {
        type: String,
        enum: ["NGN", "GHS", "USD", "KES", "ZAR", "EGP"],
        default: "NGN",
      },
    },
    plan: {
      strategy: {
        type: String,
        default: "",
      },
      timeline: [
        {
          phase: String,
          startDate: Date,
          endDate: Date,
          tasks: [String],
        },
      ],
      tactics: [String],
    },
    generatedBy: {
      type: String,
      enum: ["ai", "user", "hybrid"],
      default: "user",
    },
    aiConfig: {
      provider: {
        type: String,
        enum: ["gemini", "openai", "rule-based"],
      },
      model: String,
      temperature: Number,
      iterations: {
        type: Number,
        default: 1,
      },
    },
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
    websiteUrl: {
      type: String,
      validate: {
        validator: function (url) {
          if (!url) return true;
          return /^https?:\/\/.+/.test(url);
        },
        message: "Please provide a valid URL",
      },
    },
    collaborators: [
      {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        role: {
          type: String,
          enum: ["owner", "editor", "viewer"],
          default: "viewer",
        },
        addedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    metrics: {
      views: {
        type: Number,
        default: 0,
      },
      signups: {
        type: Number,
        default: 0,
      },
      conversions: {
        type: Number,
        default: 0,
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

// Indexes for faster queries
launchSchema.index({ userId: 1, status: 1 });
launchSchema.index({ targetDate: 1 });
launchSchema.index({ markets: 1 });
launchSchema.index({ createdAt: -1 });

const Launch = mongoose.model("Launch", launchSchema);

export default Launch;
