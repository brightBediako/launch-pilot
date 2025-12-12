import Event from "../models/Event.js";
import LaunchMetrics from "../models/LaunchMetrics.js";
import { startOfDay, subDays } from "date-fns";
import logger from "../utils/logger.js";

/**
 * Track an event
 * @param {string} type - Event type
 * @param {string} launchId - Launch ID (optional)
 * @param {string} userId - User ID (optional)
 * @param {object} metadata - Additional event data
 * @returns {Promise}
 */
export const trackEvent = async (
  type,
  launchId = null,
  userId = null,
  metadata = {}
) => {
  try {
    const event = await Event.create({
      type,
      launchId,
      userId,
      metadata,
      timestamp: new Date(),
    });

    logger.info(`Event tracked: ${type} for launch ${launchId}`);
    return event;
  } catch (error) {
    logger.error(`Error tracking event: ${error.message}`);
    throw error;
  }
};

/**
 * Get events for a launch
 * @param {string} launchId - Launch ID
 * @param {object} options - Query options
 * @returns {Promise}
 */
export const getEventsByLaunch = async (launchId, options = {}) => {
  const { type, startDate, endDate, limit = 100 } = options;

  const query = { launchId };
  if (type) query.type = type;
  if (startDate || endDate) {
    query.timestamp = {};
    if (startDate) query.timestamp.$gte = new Date(startDate);
    if (endDate) query.timestamp.$lte = new Date(endDate);
  }

  const events = await Event.find(query).sort({ timestamp: -1 }).limit(limit);

  return events;
};

/**
 * Aggregate daily metrics for a launch
 * @param {string} launchId - Launch ID
 * @param {Date} date - Date to aggregate (defaults to yesterday)
 * @returns {Promise}
 */
export const aggregateDailyMetrics = async (launchId = null, date = null) => {
  try {
    const targetDate = date || subDays(new Date(), 1);
    const startDate = startOfDay(targetDate);
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + 1);

    // Build query
    const query = {
      timestamp: { $gte: startDate, $lt: endDate },
    };

    if (launchId) {
      query.launchId = launchId;
    }

    // Aggregate events by launch
    const aggregation = await Event.aggregate([
      { $match: query },
      {
        $group: {
          _id: "$launchId",
          views: {
            $sum: { $cond: [{ $eq: ["$type", "page_view"] }, 1, 0] },
          },
          signups: {
            $sum: { $cond: [{ $eq: ["$type", "email_signup"] }, 1, 0] },
          },
          tasksCompleted: {
            $sum: { $cond: [{ $eq: ["$type", "task_completed"] }, 1, 0] },
          },
          draftsGenerated: {
            $sum: { $cond: [{ $eq: ["$type", "draft_generated"] }, 1, 0] },
          },
        },
      },
    ]);

    // Save or update metrics
    for (const metrics of aggregation) {
      if (!metrics._id) continue; // Skip if no launchId

      const conversionRate =
        metrics.views > 0 ? (metrics.signups / metrics.views) * 100 : 0;

      await LaunchMetrics.findOneAndUpdate(
        {
          launchId: metrics._id,
          date: startDate,
        },
        {
          ...metrics,
          conversionRate,
          calculatedDaily: true,
        },
        { upsert: true, new: true }
      );

      logger.info(
        `Daily metrics aggregated for launch ${metrics._id} on ${startDate}`
      );
    }

    return aggregation;
  } catch (error) {
    logger.error(`Error aggregating daily metrics: ${error.message}`);
    throw error;
  }
};

/**
 * Get analytics summary for a launch
 * @param {string} launchId - Launch ID
 * @param {object} options - Query options
 * @returns {Promise}
 */
export const getAnalyticsSummary = async (launchId, options = {}) => {
  const { days = 30 } = options;

  const startDate = subDays(startOfDay(new Date()), days);

  // Get daily metrics
  const dailyMetrics = await LaunchMetrics.find({
    launchId,
    date: { $gte: startDate },
  }).sort({ date: 1 });

  // Calculate totals
  const totals = dailyMetrics.reduce(
    (acc, day) => ({
      views: acc.views + day.views,
      signups: acc.signups + day.signups,
      tasksCompleted: acc.tasksCompleted + day.tasksCompleted,
      draftsGenerated: acc.draftsGenerated + day.draftsGenerated,
    }),
    {
      views: 0,
      signups: 0,
      tasksCompleted: 0,
      draftsGenerated: 0,
    }
  );

  const avgConversionRate =
    dailyMetrics.length > 0
      ? dailyMetrics.reduce((acc, day) => acc + day.conversionRate, 0) /
        dailyMetrics.length
      : 0;

  return {
    totals,
    avgConversionRate,
    dailyMetrics,
    period: {
      start: startDate,
      end: new Date(),
      days,
    },
  };
};

export default {
  trackEvent,
  getEventsByLaunch,
  aggregateDailyMetrics,
  getAnalyticsSummary,
};
