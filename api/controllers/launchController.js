import Launch from "../models/Launch.js";
import LaunchPlan from "../models/LaunchPlan.js";
import mongoose from "mongoose";
import { generateAndSavePlan } from "../services/planService.js";
import { NotFoundError, AuthorizationError } from "../utils/errors.js";
import { isOwner, isAdmin } from "../middleware/authorization.js";

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
    // Optimize: Fetch launch and plan in parallel to avoid N+1 query
    const [launch, plan] = await Promise.all([
      Launch.findById(req.params.id),
      LaunchPlan.findOne({ launchId: req.params.id }),
    ]);

    if (!launch) {
      throw new NotFoundError("Launch");
    }

    // Check ownership or admin
    if (!isOwner(launch, req.user) && !isAdmin(req.user)) {
      throw new AuthorizationError("Not authorized to access this launch");
    }

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
      throw new NotFoundError("Launch");
    }

    // Check ownership
    if (!isOwner(launch, req.user) && !isAdmin(req.user)) {
      throw new AuthorizationError("Not authorized to update this launch");
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
      throw new NotFoundError("Launch");
    }

    // Check ownership
    if (!isOwner(launch, req.user) && !isAdmin(req.user)) {
      throw new AuthorizationError("Not authorized to delete this launch");
    }

    // Use transaction for launch and plan deletion
    const session = await mongoose.startSession();
    
    try {
      await session.withTransaction(async () => {
        // Delete associated plan and launch in transaction
        await Promise.all([
          LaunchPlan.findOneAndDelete({ launchId: launch._id }).session(session),
          Launch.findByIdAndDelete(req.params.id).session(session),
        ]);
      });
    } finally {
      await session.endSession();
    }

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
      throw new NotFoundError("Launch");
    }

    // Check ownership
    if (!isOwner(launch, req.user)) {
      throw new AuthorizationError("Not authorized to generate plan for this launch");
    }

    // Generate plan using shared service
    const userContext = {
      timezone: req.user.timezone,
      currency: req.user.currency,
      markets: launch.markets,
    };

    const result = await generateAndSavePlan(launch, userContext, false);

    res.json({
      success: true,
      message: "Launch plan generated successfully",
      data: result,
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
    const launch = await Launch.findById(req.params.id);

    if (!launch) {
      throw new NotFoundError("Launch");
    }

    if (!isOwner(launch, req.user)) {
      throw new AuthorizationError("Not authorized to regenerate plan for this launch");
    }

    // Generate plan using shared service (with regeneration flag)
    const userContext = {
      timezone: req.user.timezone,
      currency: req.user.currency,
      markets: launch.markets,
    };

    const result = await generateAndSavePlan(launch, userContext, true);

    res.json({
      success: true,
      message: "Launch plan regenerated successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};
