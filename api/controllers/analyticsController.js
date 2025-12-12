import {
  trackEvent,
  getEventsByLaunch,
  getAnalyticsSummary,
} from "../services/analyticsService.js";
import Launch from "../models/Launch.js";

/**
 * @desc    Track analytics event
 * @route   POST /api/analytics/events
 * @access  Private
 */
export const trackAnalyticsEvent = async (req, res, next) => {
  try {
    const { type, launchId, metadata } = req.body;

    // Verify launch exists and user has access
    if (launchId) {
      const launch = await Launch.findById(launchId);
      if (!launch) {
        const error = new Error("Launch not found");
        error.statusCode = 404;
        return next(error);
      }

      const isOwner = launch.userId.toString() === req.user._id.toString();
      const isCollaborator = launch.collaborators.some(
        (c) => c.userId.toString() === req.user._id.toString()
      );

      if (!isOwner && !isCollaborator && req.user.role !== "admin") {
        const error = new Error(
          "Not authorized to track events for this launch"
        );
        error.statusCode = 403;
        return next(error);
      }
    }

    const event = await trackEvent(type, launchId, req.user._id, metadata);

    res.status(201).json({
      success: true,
      message: "Event tracked successfully",
      data: event,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get analytics for a launch
 * @route   GET /api/analytics/launches/:id
 * @access  Private
 */
export const getLaunchAnalytics = async (req, res, next) => {
  try {
    const { days = 30, groupBy = "day" } = req.query;

    const launch = await Launch.findById(req.params.id);
    if (!launch) {
      const error = new Error("Launch not found");
      error.statusCode = 404;
      return next(error);
    }

    // Verify ownership
    const isOwner = launch.userId.toString() === req.user._id.toString();
    const isCollaborator = launch.collaborators.some(
      (c) => c.userId.toString() === req.user._id.toString()
    );

    if (!isOwner && !isCollaborator && req.user.role !== "admin") {
      const error = new Error(
        "Not authorized to view analytics for this launch"
      );
      error.statusCode = 403;
      return next(error);
    }

    // Get analytics summary
    const analytics = await getAnalyticsSummary(req.params.id, {
      days: parseInt(days),
      groupBy,
    });

    res.json({
      success: true,
      data: analytics,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get dashboard analytics (all user's launches)
 * @route   GET /api/analytics/dashboard
 * @access  Private
 */
export const getDashboard = async (req, res, next) => {
  try {
    const { days = 30 } = req.query;

    // Get all user's launches
    const launches = await Launch.find({ userId: req.user._id }).select(
      "_id title"
    );

    if (launches.length === 0) {
      return res.json({
        success: true,
        data: {
          launches: [],
          totals: {
            views: 0,
            signups: 0,
            tasksCompleted: 0,
            draftsGenerated: 0,
            conversionRate: 0,
          },
          launches: [],
        },
      });
    }

    // Get analytics for each launch
    const launchAnalytics = await Promise.all(
      launches.map(async (launch) => {
        const analytics = await getAnalyticsSummary(launch._id, {
          days: parseInt(days),
        });
        return {
          launchId: launch._id,
          title: launch.title,
          ...analytics.totals,
        };
      })
    );

    // Calculate totals across all launches
    const totals = launchAnalytics.reduce(
      (acc, analytics) => ({
        views: acc.views + (analytics.views || 0),
        signups: acc.signups + (analytics.signups || 0),
        tasksCompleted: acc.tasksCompleted + (analytics.tasksCompleted || 0),
        draftsGenerated: acc.draftsGenerated + (analytics.draftsGenerated || 0),
        socialShares: {
          twitter:
            acc.socialShares.twitter + (analytics.socialShares?.twitter || 0),
          linkedin:
            acc.socialShares.linkedin + (analytics.socialShares?.linkedin || 0),
          producthunt:
            acc.socialShares.producthunt +
            (analytics.socialShares?.producthunt || 0),
        },
      }),
      {
        views: 0,
        signups: 0,
        tasksCompleted: 0,
        draftsGenerated: 0,
        socialShares: { twitter: 0, linkedin: 0, producthunt: 0 },
      }
    );

    // Calculate overall conversion rate
    totals.conversionRate =
      totals.views > 0 ? ((totals.signups / totals.views) * 100).toFixed(2) : 0;

    res.json({
      success: true,
      data: {
        totals,
        launches: launchAnalytics,
      },
    });
  } catch (error) {
    next(error);
  }
};

export default {
  trackAnalyticsEvent,
  getLaunchAnalytics,
  getDashboard,
};
