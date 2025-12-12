import mongoose from "mongoose";

const partnerSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    services: [
      {
        type: String,
        enum: [
          "design",
          "marketing",
          "development",
          "content",
          "consulting",
          "other",
        ],
      },
    ],
    pricing: {
      hourly: {
        type: Number,
        min: 0,
      },
      project: {
        type: Number,
        min: 0,
      },
      currency: {
        type: String,
        enum: ["NGN", "GHS", "USD", "KES", "ZAR", "EGP"],
        default: "NGN",
      },
    },
    portfolio: [
      {
        title: String,
        url: String,
        image: String,
        description: String,
      },
    ],
    location: {
      country: {
        type: String,
        enum: ["NG", "GH", "KE", "ZA", "EG", "other"],
        required: true,
      },
      city: {
        type: String,
        trim: true,
      },
    },
    availability: {
      type: String,
      enum: ["available", "busy", "unavailable"],
      default: "available",
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    totalReviews: {
      type: Number,
      default: 0,
    },
    reviews: [
      {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        rating: {
          type: Number,
          min: 1,
          max: 5,
          required: true,
        },
        comment: String,
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    verified: {
      type: Boolean,
      default: false,
    },
    completedProjects: {
      type: Number,
      default: 0,
    },
    skills: [
      {
        type: String,
        trim: true,
      },
    ],
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
partnerSchema.index({ "location.country": 1 });
partnerSchema.index({ services: 1 });
partnerSchema.index({ availability: 1 });
partnerSchema.index({ rating: -1 });
partnerSchema.index({ verified: 1 });

// Method to calculate average rating
partnerSchema.methods.calculateRating = function () {
  if (this.reviews.length === 0) {
    this.rating = 0;
    this.totalReviews = 0;
  } else {
    const sum = this.reviews.reduce((acc, review) => acc + review.rating, 0);
    this.rating = sum / this.reviews.length;
    this.totalReviews = this.reviews.length;
  }
  return this.rating;
};

const Partner = mongoose.model("Partner", partnerSchema);

export default Partner;
