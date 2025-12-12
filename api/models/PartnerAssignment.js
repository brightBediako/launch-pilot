import mongoose from "mongoose";

const partnerAssignmentSchema = new mongoose.Schema(
  {
    launchId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Launch",
      required: true,
      index: true,
    },
    partnerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Partner",
      required: true,
      index: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    service: {
      type: String,
      enum: [
        "design",
        "marketing",
        "development",
        "content",
        "consulting",
        "other",
      ],
      required: true,
    },
    budget: {
      amount: {
        type: Number,
        required: true,
        min: 0,
      },
      currency: {
        type: String,
        enum: ["NGN", "GHS", "USD", "KES", "ZAR", "EGP"],
        default: "NGN",
      },
    },
    status: {
      type: String,
      enum: ["pending", "accepted", "in-progress", "completed", "cancelled"],
      default: "pending",
      index: true,
    },
    deliverables: [
      {
        title: String,
        description: String,
        completed: {
          type: Boolean,
          default: false,
        },
        completedAt: Date,
      },
    ],
    timeline: {
      startDate: Date,
      endDate: Date,
    },
    payment: {
      amount: Number,
      status: {
        type: String,
        enum: ["pending", "processing", "completed", "failed"],
        default: "pending",
      },
      paystackRef: String,
      flutterwaveRef: String,
      stripeRef: String,
      paidAt: Date,
    },
    communication: [
      {
        from: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        message: String,
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    review: {
      rating: {
        type: Number,
        min: 1,
        max: 5,
      },
      comment: String,
      createdAt: Date,
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
partnerAssignmentSchema.index({ launchId: 1, partnerId: 1 });
partnerAssignmentSchema.index({ userId: 1 });
partnerAssignmentSchema.index({ status: 1 });
partnerAssignmentSchema.index({ createdAt: -1 });

const PartnerAssignment = mongoose.model(
  "PartnerAssignment",
  partnerAssignmentSchema
);

export default PartnerAssignment;
