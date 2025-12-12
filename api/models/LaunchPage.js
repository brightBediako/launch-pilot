import mongoose from "mongoose";
import slugify from "slugify";

const launchPageSchema = new mongoose.Schema(
  {
    launchId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Launch",
      required: true,
      unique: true,
      index: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    customUrl: {
      type: String,
      unique: true,
      required: true,
      index: true,
      lowercase: true,
    },
    theme: {
      primaryColor: {
        type: String,
        default: "#3B82F6",
      },
      logo: String,
      hero: String,
      font: {
        type: String,
        default: "Inter",
      },
    },
    content: {
      headline: {
        type: String,
        required: true,
        maxlength: [100, "Headline cannot exceed 100 characters"],
      },
      subheadline: {
        type: String,
        maxlength: [200, "Subheadline cannot exceed 200 characters"],
      },
      features: [
        {
          title: String,
          description: String,
          icon: String,
        },
      ],
      testimonials: [
        {
          name: String,
          role: String,
          avatar: String,
          quote: String,
        },
      ],
      cta: {
        text: {
          type: String,
          default: "Get Early Access",
        },
        url: String,
      },
    },
    published: {
      type: Boolean,
      default: false,
    },
    publishedAt: {
      type: Date,
    },
    analytics: {
      views: {
        type: Number,
        default: 0,
      },
      signups: {
        type: Number,
        default: 0,
      },
      conversionRate: {
        type: Number,
        default: 0,
      },
    },
    seo: {
      title: String,
      description: String,
      keywords: [String],
      ogImage: String,
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

// Generate unique slug before saving
launchPageSchema.pre("save", async function (next) {
  if (this.isNew && !this.customUrl) {
    const launch = await mongoose.model("Launch").findById(this.launchId);
    let slug = slugify(launch.title, { lower: true, strict: true });

    // Check if slug exists
    let slugExists = await mongoose
      .model("LaunchPage")
      .findOne({ customUrl: slug });
    let counter = 1;

    while (slugExists) {
      slug = `${slugify(launch.title, {
        lower: true,
        strict: true,
      })}-${counter}`;
      slugExists = await mongoose
        .model("LaunchPage")
        .findOne({ customUrl: slug });
      counter++;
    }

    this.customUrl = slug;
  }
  next();
});

const LaunchPage = mongoose.model("LaunchPage", launchPageSchema);

export default LaunchPage;
