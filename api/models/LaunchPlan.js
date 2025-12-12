import mongoose from "mongoose";

const launchPlanSchema = new mongoose.Schema(
  {
    launchId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Launch",
      required: true,
      unique: true,
    },
    phases: [
      {
        name: {
          type: String,
          required: true,
          trim: true,
        },
        duration: {
          type: Number, // in days
          required: true,
          min: 1,
        },
        startDate: Date,
        endDate: Date,
        description: {
          type: String,
          trim: true,
        },
        tasks: [
          {
            title: {
              type: String,
              required: true,
              trim: true,
            },
            description: String,
            priority: {
              type: String,
              enum: ["low", "medium", "high"],
              default: "medium",
            },
            estimatedHours: Number,
            dependencies: [String],
            assignedTo: {
              type: mongoose.Schema.Types.ObjectId,
              ref: "User",
            },
            status: {
              type: String,
              enum: ["pending", "in-progress", "completed"],
              default: "pending",
            },
            completedAt: Date,
          },
        ],
        budget: {
          amount: Number,
          currency: {
            type: String,
            enum: ["NGN", "GHS", "USD", "KES", "ZAR", "EGP"],
            default: "NGN",
          },
        },
        marketSpecific: {
          NG: {
            strategy: String,
            channels: [String],
            budget: Number,
          },
          GH: {
            strategy: String,
            channels: [String],
            budget: Number,
          },
          KE: {
            strategy: String,
            channels: [String],
            budget: Number,
          },
        },
      },
    ],
    recommendations: {
      channels: [
        {
          name: String,
          platform: String,
          priority: {
            type: String,
            enum: ["high", "medium", "low"],
          },
          estimatedCost: Number,
          expectedReach: Number,
        },
      ],
      partnerships: [
        {
          type: String,
          description: String,
        },
      ],
      resources: [
        {
          title: String,
          url: String,
          type: {
            type: String,
            enum: ["article", "video", "template", "tool"],
          },
        },
      ],
    },
    milestones: [
      {
        title: String,
        date: Date,
        description: String,
        completed: {
          type: Boolean,
          default: false,
        },
        completedAt: Date,
      },
    ],
    notes: {
      type: String,
      maxlength: [5000, "Notes cannot exceed 5000 characters"],
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
launchPlanSchema.index({ launchId: 1 });

const LaunchPlan = mongoose.model("LaunchPlan", launchPlanSchema);

export default LaunchPlan;
