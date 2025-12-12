import mongoose from "mongoose";

const eventSchema = new mongoose.Schema(
  {
    launchId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Launch",
      index: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      index: true,
    },
    type: {
      type: String,
      enum: [
        "page_view",
        "email_signup",
        "draft_generated",
        "task_completed",
        "plan_generated",
        "partner_assigned",
        "launch_published",
      ],
      required: true,
      index: true,
    },
    metadata: {
      platform: String,
      device: String,
      location: String,
      duration: Number,
      value: mongoose.Schema.Types.Mixed,
    },
    timestamp: {
      type: Date,
      default: Date.now,
      index: true,
    },
  },
  {
    timestamps: false,
    toJSON: {
      transform: function (doc, ret) {
        delete ret.__v;
        return ret;
      },
    },
  }
);

// Indexes for analytics queries
eventSchema.index({ launchId: 1, type: 1, timestamp: -1 });
eventSchema.index({ userId: 1, timestamp: -1 });
eventSchema.index({ timestamp: -1 });

const Event = mongoose.model("Event", eventSchema);

export default Event;
