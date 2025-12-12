import mongoose from "mongoose";

const launchMetricsSchema = new mongoose.Schema(
  {
    launchId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Launch",
      required: true,
      index: true,
    },
    date: {
      type: Date,
      required: true,
      index: true,
    },
    views: {
      type: Number,
      default: 0,
    },
    signups: {
      type: Number,
      default: 0,
    },
    tasksCompleted: {
      type: Number,
      default: 0,
    },
    draftsGenerated: {
      type: Number,
      default: 0,
    },
    socialShares: {
      twitter: {
        type: Number,
        default: 0,
      },
      linkedin: {
        type: Number,
        default: 0,
      },
      producthunt: {
        type: Number,
        default: 0,
      },
    },
    conversionRate: {
      type: Number,
      default: 0,
    },
    calculatedDaily: {
      type: Boolean,
      default: false,
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

// Compound index for unique daily metrics per launch
launchMetricsSchema.index({ launchId: 1, date: 1 }, { unique: true });

const LaunchMetrics = mongoose.model("LaunchMetrics", launchMetricsSchema);

export default LaunchMetrics;
