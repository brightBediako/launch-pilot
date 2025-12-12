import mongoose from "mongoose";

const contentDraftSchema = new mongoose.Schema(
  {
    launchId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Launch",
      required: true,
      index: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    platform: {
      type: String,
      enum: ["producthunt", "twitter", "linkedin"],
      required: true,
    },
    content: {
      title: {
        type: String,
        trim: true,
      },
      body: {
        type: String,
        trim: true,
      },
      hashtags: [
        {
          type: String,
          trim: true,
        },
      ],
      mediaUrls: [
        {
          type: String,
        },
      ],
      cta: {
        type: String,
        trim: true,
      },
    },
    status: {
      type: String,
      enum: ["draft", "scheduled", "published"],
      default: "draft",
    },
    scheduledFor: {
      type: Date,
    },
    publishedAt: {
      type: Date,
    },
    metrics: {
      views: {
        type: Number,
        default: 0,
      },
      clicks: {
        type: Number,
        default: 0,
      },
      conversions: {
        type: Number,
        default: 0,
      },
      engagement: {
        type: Number,
        default: 0,
      },
    },
    aiProvider: {
      type: String,
      enum: ["gemini", "openai", "manual"],
      default: "manual",
    },
    version: {
      type: Number,
      default: 1,
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

// Indexes
contentDraftSchema.index({ launchId: 1, platform: 1 });
contentDraftSchema.index({ userId: 1 });
contentDraftSchema.index({ status: 1 });
contentDraftSchema.index({ createdAt: -1 });

const ContentDraft = mongoose.model("ContentDraft", contentDraftSchema);

export default ContentDraft;
