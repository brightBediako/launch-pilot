import LaunchPage from "../models/LaunchPage.js";
import EmailSubscriber from "../models/EmailSubscriber.js";
import Launch from "../models/Launch.js";
import {
  sendWelcomeEmail,
  sendLaunchNotification,
} from "../services/emailService.js";
import { trackEvent } from "../services/analyticsService.js";

/**
 * @desc    Create launch page
 * @route   POST /api/launch-pages
 * @access  Private
 */
export const createLaunchPage = async (req, res, next) => {
  try {
    const { launchId, customUrl, theme, content, seo } = req.body;

    // Verify launch exists and user owns it
    const launch = await Launch.findById(launchId);
    if (!launch) {
      const error = new Error("Launch not found");
      error.statusCode = 404;
      return next(error);
    }

    if (
      launch.userId.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      const error = new Error(
        "Not authorized to create launch page for this launch"
      );
      error.statusCode = 403;
      return next(error);
    }

    // Check if launch page already exists
    const existingPage = await LaunchPage.findOne({ launchId });
    if (existingPage) {
      const error = new Error("Launch page already exists for this launch");
      error.statusCode = 400;
      return next(error);
    }

    const launchPage = await LaunchPage.create({
      launchId,
      customUrl,
      theme,
      content,
      seo,
    });

    await launchPage.populate("launchId", "title description targetDate");

    res.status(201).json({
      success: true,
      message: "Launch page created successfully",
      data: launchPage,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get launch page by slug (public)
 * @route   GET /api/launch-pages/:slug
 * @access  Public
 */
export const getLaunchPageBySlug = async (req, res, next) => {
  try {
    const launchPage = await LaunchPage.findOne({
      customUrl: req.params.slug,
    }).populate("launchId", "title description targetDate productType");

    if (!launchPage) {
      const error = new Error("Launch page not found");
      error.statusCode = 404;
      return next(error);
    }

    if (!launchPage.published) {
      const error = new Error("Launch page is not published");
      error.statusCode = 403;
      return next(error);
    }

    // Track page view
    try {
      await trackEvent("page_view", launchPage.launchId, null, {
        pageSlug: launchPage.customUrl,
      });

      // Update analytics
      launchPage.analytics.views += 1;
      await launchPage.save();
    } catch (analyticsError) {
      console.error("Analytics tracking error:", analyticsError);
    }

    res.json({
      success: true,
      data: launchPage,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get launch page by ID
 * @route   GET /api/launch-pages/id/:id
 * @access  Private
 */
export const getLaunchPage = async (req, res, next) => {
  try {
    const launchPage = await LaunchPage.findById(req.params.id).populate(
      "launchId",
      "title description targetDate userId"
    );

    if (!launchPage) {
      const error = new Error("Launch page not found");
      error.statusCode = 404;
      return next(error);
    }

    // Verify ownership
    if (
      launchPage.launchId.userId.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      const error = new Error("Not authorized to view this launch page");
      error.statusCode = 403;
      return next(error);
    }

    res.json({
      success: true,
      data: launchPage,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update launch page
 * @route   PATCH /api/launch-pages/:id
 * @access  Private
 */
export const updateLaunchPage = async (req, res, next) => {
  try {
    const launchPage = await LaunchPage.findById(req.params.id).populate(
      "launchId"
    );

    if (!launchPage) {
      const error = new Error("Launch page not found");
      error.statusCode = 404;
      return next(error);
    }

    // Verify ownership
    if (
      launchPage.launchId.userId.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      const error = new Error("Not authorized to update this launch page");
      error.statusCode = 403;
      return next(error);
    }

    // Update fields
    const { customUrl, theme, content, seo } = req.body;

    if (customUrl) launchPage.customUrl = customUrl;
    if (theme) launchPage.theme = { ...launchPage.theme, ...theme };
    if (content) launchPage.content = { ...launchPage.content, ...content };
    if (seo) launchPage.seo = { ...launchPage.seo, ...seo };

    await launchPage.save();
    await launchPage.populate("launchId", "title description targetDate");

    res.json({
      success: true,
      message: "Launch page updated successfully",
      data: launchPage,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Publish launch page
 * @route   POST /api/launch-pages/:id/publish
 * @access  Private
 */
export const publishLaunchPage = async (req, res, next) => {
  try {
    const launchPage = await LaunchPage.findById(req.params.id).populate(
      "launchId"
    );

    if (!launchPage) {
      const error = new Error("Launch page not found");
      error.statusCode = 404;
      return next(error);
    }

    // Verify ownership
    if (
      launchPage.launchId.userId.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      const error = new Error("Not authorized to publish this launch page");
      error.statusCode = 403;
      return next(error);
    }

    launchPage.published = true;
    launchPage.publishedAt = new Date();
    await launchPage.save();

    // Track event
    try {
      await trackEvent(
        "launch_published",
        launchPage.launchId._id,
        req.user._id,
        {
          pageSlug: launchPage.customUrl,
        }
      );
    } catch (analyticsError) {
      console.error("Analytics tracking error:", analyticsError);
    }

    res.json({
      success: true,
      message: "Launch page published successfully",
      data: launchPage,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Subscribe to launch page (public)
 * @route   POST /api/launch-pages/:slug/subscribe
 * @access  Public
 */
export const subscribePage = async (req, res, next) => {
  try {
    const { email, name } = req.body;

    const launchPage = await LaunchPage.findOne({
      customUrl: req.params.slug,
    }).populate("launchId", "title description");

    if (!launchPage) {
      const error = new Error("Launch page not found");
      error.statusCode = 404;
      return next(error);
    }

    if (!launchPage.published) {
      const error = new Error("Launch page is not published");
      error.statusCode = 403;
      return next(error);
    }

    // Check if already subscribed
    const existingSubscriber = await EmailSubscriber.findOne({
      launchPageId: launchPage._id,
      email,
    });

    if (existingSubscriber) {
      const error = new Error("Email already subscribed");
      error.statusCode = 400;
      return next(error);
    }

    // Create subscriber
    const metadata = {
      referrer: req.headers.referer || req.headers.referrer,
      userAgent: req.headers["user-agent"],
      ipAddress: req.ip,
    };

    const subscriber = await EmailSubscriber.create({
      launchPageId: launchPage._id,
      email,
      name,
      metadata,
    });

    // Update analytics
    launchPage.analytics.signups += 1;
    if (launchPage.analytics.views > 0) {
      launchPage.analytics.conversionRate =
        (launchPage.analytics.signups / launchPage.analytics.views) * 100;
    }
    await launchPage.save();

    // Track event
    try {
      await trackEvent("email_signup", launchPage.launchId._id, null, {
        pageSlug: launchPage.customUrl,
        email,
      });
    } catch (analyticsError) {
      console.error("Analytics tracking error:", analyticsError);
    }

    // Send welcome email
    try {
      await sendWelcomeEmail(subscriber, launchPage);
    } catch (emailError) {
      console.error("Welcome email error:", emailError);
      // Don't fail the request if email fails
    }

    res.status(201).json({
      success: true,
      message: "Subscribed successfully",
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get subscribers for launch page
 * @route   GET /api/launch-pages/:id/subscribers
 * @access  Private
 */
export const getSubscribers = async (req, res, next) => {
  try {
    const { page = 1, limit = 50 } = req.query;

    const launchPage = await LaunchPage.findById(req.params.id).populate(
      "launchId"
    );

    if (!launchPage) {
      const error = new Error("Launch page not found");
      error.statusCode = 404;
      return next(error);
    }

    // Verify ownership
    if (
      launchPage.launchId.userId.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      const error = new Error("Not authorized to view subscribers");
      error.statusCode = 403;
      return next(error);
    }

    // Pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const subscribers = await EmailSubscriber.find({
      launchPageId: launchPage._id,
    })
      .sort("-createdAt")
      .skip(skip)
      .limit(parseInt(limit));

    const total = await EmailSubscriber.countDocuments({
      launchPageId: launchPage._id,
    });

    res.json({
      success: true,
      data: subscribers,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Notify all subscribers
 * @route   POST /api/launch-pages/:id/notify
 * @access  Private
 */
export const notifyAllSubscribers = async (req, res, next) => {
  try {
    const launchPage = await LaunchPage.findById(req.params.id).populate(
      "launchId"
    );

    if (!launchPage) {
      const error = new Error("Launch page not found");
      error.statusCode = 404;
      return next(error);
    }

    // Verify ownership
    if (
      launchPage.launchId.userId.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      const error = new Error("Not authorized to notify subscribers");
      error.statusCode = 403;
      return next(error);
    }

    // Get all subscribers who haven't been notified and haven't unsubscribed
    const subscribers = await EmailSubscriber.find({
      launchPageId: launchPage._id,
      notified: false,
      unsubscribed: false,
    });

    if (subscribers.length === 0) {
      return res.json({
        success: true,
        message: "No subscribers to notify",
        data: { sent: 0, failed: 0 },
      });
    }

    // Send notifications
    const result = await sendLaunchNotification(
      subscribers,
      launchPage.launchId,
      launchPage
    );

    // Mark subscribers as notified
    await EmailSubscriber.updateMany(
      {
        launchPageId: launchPage._id,
        email: { $in: result.sent },
      },
      { notified: true }
    );

    res.json({
      success: true,
      message: `Notified ${result.sent.length} subscribers`,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export default {
  createLaunchPage,
  getLaunchPageBySlug,
  getLaunchPage,
  updateLaunchPage,
  publishLaunchPage,
  subscribePage,
  getSubscribers,
  notifyAllSubscribers,
};
