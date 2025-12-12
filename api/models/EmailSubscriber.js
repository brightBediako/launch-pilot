import mongoose from "mongoose";

const emailSubscriberSchema = new mongoose.Schema(
  {
    launchPageId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "LaunchPage",
      required: true,
      index: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      validate: {
        validator: function (email) {
          return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
        },
        message: "Please provide a valid email address",
      },
      index: true,
    },
    name: {
      type: String,
      trim: true,
    },
    source: {
      type: String,
      enum: ["direct", "social", "referral", "other"],
      default: "direct",
    },
    metadata: {
      referrer: String,
      location: String,
      userAgent: String,
      ipAddress: String,
    },
    notified: {
      type: Boolean,
      default: false,
    },
    notifiedAt: {
      type: Date,
    },
    unsubscribed: {
      type: Boolean,
      default: false,
    },
    unsubscribedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: function (doc, ret) {
        delete ret.__v;
        delete ret.metadata?.ipAddress;
        return ret;
      },
    },
  }
);

// Compound index to prevent duplicate subscriptions
emailSubscriberSchema.index({ launchPageId: 1, email: 1 }, { unique: true });
emailSubscriberSchema.index({ createdAt: -1 });

const EmailSubscriber = mongoose.model(
  "EmailSubscriber",
  emailSubscriberSchema
);

export default EmailSubscriber;
