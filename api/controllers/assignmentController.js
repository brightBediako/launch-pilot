import PartnerAssignment from "../models/PartnerAssignment.js";
import Launch from "../models/Launch.js";
import Partner from "../models/Partner.js";

/**
 * @desc    Create partner assignment
 * @route   POST /api/partners/:partnerId/assignments
 * @access  Private
 */
export const createAssignment = async (req, res, next) => {
  try {
    const { launchId, service, budget, deliverables, timeline } = req.body;
    const { partnerId } = req.params;

    // Verify launch exists and user owns it
    const launch = await Launch.findById(launchId);
    if (!launch) {
      const error = new Error("Launch not found");
      error.statusCode = 404;
      return next(error);
    }

    if (launch.userId.toString() !== req.user._id.toString()) {
      const error = new Error(
        "Not authorized to assign partners to this launch"
      );
      error.statusCode = 403;
      return next(error);
    }

    // Verify partner exists
    const partner = await Partner.findById(partnerId);
    if (!partner) {
      const error = new Error("Partner not found");
      error.statusCode = 404;
      return next(error);
    }

    // Create assignment
    const assignment = await PartnerAssignment.create({
      launchId,
      partnerId,
      service,
      budget,
      deliverables,
      timeline,
    });

    await assignment.populate([
      { path: "launchId", select: "title description" },
      { path: "partnerId", populate: { path: "userId", select: "name email" } },
    ]);

    res.status(201).json({
      success: true,
      message: "Partner assignment created successfully",
      data: assignment,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get assignments with filters
 * @route   GET /api/assignments
 * @access  Private
 */
export const getAssignments = async (req, res, next) => {
  try {
    const { launchId, partnerId, status, page = 1, limit = 10 } = req.query;

    // Build filter
    const filter = {};

    if (launchId) {
      filter.launchId = launchId;
    }

    if (partnerId) {
      filter.partnerId = partnerId;
    }

    if (status) {
      filter.status = status;
    }

    // Pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Get assignments (only show user's own assignments unless admin)
    if (req.user.role !== "admin") {
      const launches = await Launch.find({ userId: req.user._id }).select(
        "_id"
      );
      const launchIds = launches.map((l) => l._id);
      filter.launchId = { $in: launchIds };
    }

    const assignments = await PartnerAssignment.find(filter)
      .populate("launchId", "title description")
      .populate({
        path: "partnerId",
        populate: { path: "userId", select: "name email avatar" },
      })
      .sort("-createdAt")
      .skip(skip)
      .limit(parseInt(limit));

    const total = await PartnerAssignment.countDocuments(filter);

    res.json({
      success: true,
      data: assignments,
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
 * @desc    Update assignment status
 * @route   PATCH /api/assignments/:id/status
 * @access  Private
 */
export const updateAssignmentStatus = async (req, res, next) => {
  try {
    const { status } = req.body;

    const assignment = await PartnerAssignment.findById(req.params.id);
    if (!assignment) {
      const error = new Error("Assignment not found");
      error.statusCode = 404;
      return next(error);
    }

    // Verify authorization
    const launch = await Launch.findById(assignment.launchId);
    const partner = await Partner.findById(assignment.partnerId);

    const isLaunchOwner = launch.userId.toString() === req.user._id.toString();
    const isPartner = partner.userId.toString() === req.user._id.toString();

    if (!isLaunchOwner && !isPartner && req.user.role !== "admin") {
      const error = new Error("Not authorized to update this assignment");
      error.statusCode = 403;
      return next(error);
    }

    assignment.status = status;
    await assignment.save();

    await assignment.populate([
      { path: "launchId", select: "title description" },
      { path: "partnerId", populate: { path: "userId", select: "name email" } },
    ]);

    res.json({
      success: true,
      message: "Assignment status updated successfully",
      data: assignment,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Add communication to assignment
 * @route   POST /api/assignments/:id/communication
 * @access  Private
 */
export const addCommunication = async (req, res, next) => {
  try {
    const { message } = req.body;

    const assignment = await PartnerAssignment.findById(req.params.id);
    if (!assignment) {
      const error = new Error("Assignment not found");
      error.statusCode = 404;
      return next(error);
    }

    // Verify authorization
    const launch = await Launch.findById(assignment.launchId);
    const partner = await Partner.findById(assignment.partnerId);

    const isLaunchOwner = launch.userId.toString() === req.user._id.toString();
    const isPartner = partner.userId.toString() === req.user._id.toString();

    if (!isLaunchOwner && !isPartner) {
      const error = new Error(
        "Not authorized to add communication to this assignment"
      );
      error.statusCode = 403;
      return next(error);
    }

    assignment.communication.push({
      userId: req.user._id,
      message,
    });

    await assignment.save();

    await assignment.populate([
      { path: "launchId", select: "title description" },
      { path: "partnerId", populate: { path: "userId", select: "name email" } },
      { path: "communication.userId", select: "name avatar" },
    ]);

    res.json({
      success: true,
      message: "Communication added successfully",
      data: assignment,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Submit assignment review
 * @route   POST /api/assignments/:id/review
 * @access  Private (Launch Owner)
 */
export const submitReview = async (req, res, next) => {
  try {
    const { rating, comment } = req.body;

    const assignment = await PartnerAssignment.findById(req.params.id);
    if (!assignment) {
      const error = new Error("Assignment not found");
      error.statusCode = 404;
      return next(error);
    }

    // Verify launch owner
    const launch = await Launch.findById(assignment.launchId);
    if (launch.userId.toString() !== req.user._id.toString()) {
      const error = new Error("Only launch owner can submit review");
      error.statusCode = 403;
      return next(error);
    }

    // Check if assignment is completed
    if (assignment.status !== "completed") {
      const error = new Error("Can only review completed assignments");
      error.statusCode = 400;
      return next(error);
    }

    assignment.review = { rating, comment };
    await assignment.save();

    await assignment.populate([
      { path: "launchId", select: "title description" },
      { path: "partnerId", populate: { path: "userId", select: "name email" } },
    ]);

    res.json({
      success: true,
      message: "Review submitted successfully",
      data: assignment,
    });
  } catch (error) {
    next(error);
  }
};

export default {
  createAssignment,
  getAssignments,
  updateAssignmentStatus,
  addCommunication,
  submitReview,
};
