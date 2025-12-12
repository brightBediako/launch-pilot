import Launch from "../models/Launch.js";
import LaunchPlan from "../models/LaunchPlan.js";
import { generateLaunchPlan } from "../services/aiService.js";

// @desc    Create new launch
// @route   POST /api/launches
// @access  Private
export const createLaunch = async (req, res, next) => {
  try {
    const {
      title,
      description,
      productType,
      targetDate,
      markets,
      budget,
      websiteUrl,
      tags,
    } = req.body;

    const launch = await Launch.create({
      userId: req.user._id,
      title,
      description,
      productType,
      targetDate,
      markets,
      budget,
      websiteUrl,
      tags,
    });

    res.status(201).json({
      success: true,
      message: "Launch created successfully",
      data: launch,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all launches (with filtering and pagination)
// @route   GET /api/launches
// @access  Private
export const getLaunches = async (req, res, next) => {
  try {
    const {
      status,
      market,
      page = 1,
      limit = 20,
      sort = "-createdAt",
    } = req.query;

    // Build filter
    const filter = { userId: req.user._id };
    if (status) filter.status = status;
    if (market) filter.markets = market;

    // Pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const launches = await Launch.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit))
      .select("-__v");

    const total = await Launch.countDocuments(filter);

    res.json({
      success: true,
      data: {
        launches,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / parseInt(limit)),
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single launch
// @route   GET /api/launches/:id
// @access  Private
export const getLaunch = async (req, res, next) => {
  try {
    const launch = await Launch.findById(req.params.id);

    if (!launch) {
      return res.status(404).json({
        success: false,
        message: "Launch not found",
      });
    }

    // Check ownership or admin
    if (
      launch.userId.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to access this launch",
      });
    }

    // Get associated plan if exists
    const plan = await LaunchPlan.findOne({ launchId: launch._id });

    res.json({
      success: true,
      data: {
        launch,
        plan,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update launch
// @route   PATCH /api/launches/:id
// @access  Private
export const updateLaunch = async (req, res, next) => {
  try {
    const launch = await Launch.findById(req.params.id);

    if (!launch) {
      return res.status(404).json({
        success: false,
        message: "Launch not found",
      });
    }

    // Check ownership
    if (
      launch.userId.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to update this launch",
      });
    }

    const updatedLaunch = await Launch.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      message: "Launch updated successfully",
      data: updatedLaunch,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete launch
// @route   DELETE /api/launches/:id
// @access  Private
export const deleteLaunch = async (req, res, next) => {
  try {
    const launch = await Launch.findById(req.params.id);

    if (!launch) {
      return res.status(404).json({
        success: false,
        message: "Launch not found",
      });
    }

    // Check ownership
    if (
      launch.userId.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to delete this launch",
      });
    }

    // Delete associated plan
    await LaunchPlan.findOneAndDelete({ launchId: launch._id });

    await launch.deleteOne();

    res.json({
      success: true,
      message: "Launch deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Generate launch plan using AI
// @route   POST /api/launches/:id/generate-plan
// @access  Private
export const generatePlan = async (req, res, next) => {
  try {
    const launch = await Launch.findById(req.params.id);

    if (!launch) {
      return res.status(404).json({
        success: false,
        message: "Launch not found",
      });
    }

    // Check ownership
    if (launch.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to generate plan for this launch",
      });
    }

    // Generate plan using AI
    const userContext = {
      timezone: req.user.timezone,
      currency: req.user.currency,
      markets: launch.markets,
    };

    const generatedPlan = await generateLaunchPlan(
      {
        title: launch.title,
        description: launch.description,
        productType: launch.productType,
        targetDate: launch.targetDate,
        markets: launch.markets,
        budget: launch.budget,
      },
      userContext
    );

    // Update launch with AI config
    launch.plan = {
      strategy: generatedPlan.strategy,
      timeline: generatedPlan.timeline,
      tactics: generatedPlan.tactics,
    };
    launch.generatedBy = "ai";
    launch.aiConfig = {
      provider: generatedPlan.aiProvider,
      model:
        generatedPlan.aiProvider === "gemini" ? "gemini-pro" : "gpt-3.5-turbo",
      temperature: 0.7,
      iterations: 1,
    };
    await launch.save();

    // Create or update launch plan
    const planData = {
      launchId: launch._id,
      phases: generatedPlan.timeline.map((phase) => ({
        name: phase.phase,
        duration: Math.ceil(
          (new Date(phase.endDate) - new Date(phase.startDate)) /
            (1000 * 60 * 60 * 24)
        ),
        startDate: phase.startDate,
        endDate: phase.endDate,
        tasks: phase.tasks.map((task) => ({
          title: task,
          priority: "medium",
          status: "pending",
        })),
      })),
      recommendations: {
        channels: [],
      },
      milestones: generatedPlan.milestones
        ? generatedPlan.milestones.map((m) => ({
            title: m,
            completed: false,
          }))
        : [],
    };

    const plan = await LaunchPlan.findOneAndUpdate(
      { launchId: launch._id },
      planData,
      { upsert: true, new: true }
    );

    res.json({
      success: true,
      message: "Launch plan generated successfully",
      data: {
        launch,
        plan,
        aiProvider: generatedPlan.aiProvider,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Regenerate launch plan
// @route   POST /api/launches/:id/regenerate-plan
// @access  Private
export const regeneratePlan = async (req, res, next) => {
  try {
    // Same as generatePlan but increments iteration count
    const launch = await Launch.findById(req.params.id);

    if (!launch) {
      return res.status(404).json({
        success: false,
        message: "Launch not found",
      });
    }

    if (launch.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to regenerate plan for this launch",
      });
    }

    const userContext = {
      timezone: req.user.timezone,
      currency: req.user.currency,
      markets: launch.markets,
    };

    const generatedPlan = await generateLaunchPlan(
      {
        title: launch.title,
        description: launch.description,
        productType: launch.productType,
        targetDate: launch.targetDate,
        markets: launch.markets,
        budget: launch.budget,
      },
      userContext
    );

    launch.plan = {
      strategy: generatedPlan.strategy,
      timeline: generatedPlan.timeline,
      tactics: generatedPlan.tactics,
    };
    launch.aiConfig = {
      provider: generatedPlan.aiProvider,
      model:
        generatedPlan.aiProvider === "gemini" ? "gemini-pro" : "gpt-3.5-turbo",
      temperature: 0.7,
      iterations: (launch.aiConfig?.iterations || 0) + 1,
    };
    await launch.save();

    const planData = {
      launchId: launch._id,
      phases: generatedPlan.timeline.map((phase) => ({
        name: phase.phase,
        duration: Math.ceil(
          (new Date(phase.endDate) - new Date(phase.startDate)) /
            (1000 * 60 * 60 * 24)
        ),
        startDate: phase.startDate,
        endDate: phase.endDate,
        tasks: phase.tasks.map((task) => ({
          title: task,
          priority: "medium",
          status: "pending",
        })),
      })),
      milestones: generatedPlan.milestones
        ? generatedPlan.milestones.map((m) => ({
            title: m,
            completed: false,
          }))
        : [],
    };

    const plan = await LaunchPlan.findOneAndUpdate(
      { launchId: launch._id },
      planData,
      { new: true }
    );

    res.json({
      success: true,
      message: "Launch plan regenerated successfully",
      data: {
        launch,
        plan,
        aiProvider: generatedPlan.aiProvider,
      },
    });
  } catch (error) {
    next(error);
  }
};
