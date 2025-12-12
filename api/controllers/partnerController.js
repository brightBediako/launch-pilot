import Partner from "../models/Partner.js";
import User from "../models/User.js";
import PartnerAssignment from "../models/PartnerAssignment.js";

/**
 * @desc    Create partner profile
 * @route   POST /api/partners
 * @access  Private
 */
export const createPartnerProfile = async (req, res, next) => {
  try {
    const { services, pricing, portfolio, location, skills, bio } = req.body;

    // Check if partner profile already exists
    const existingPartner = await Partner.findOne({ userId: req.user._id });
    if (existingPartner) {
      const error = new Error("Partner profile already exists");
      error.statusCode = 400;
      return next(error);
    }

    // Create partner profile
    const partner = await Partner.create({
      userId: req.user._id,
      services,
      pricing,
      portfolio,
      location,
      skills,
      bio,
    });

    // Populate user details
    await partner.populate("userId", "name email avatar");

    res.status(201).json({
      success: true,
      message: "Partner profile created successfully",
      data: partner,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all partners with filters
 * @route   GET /api/partners
 * @access  Public
 */
export const getPartners = async (req, res, next) => {
  try {
    const {
      service,
      country,
      minRating,
      availability,
      verified,
      page = 1,
      limit = 10,
      sort = "-createdAt",
    } = req.query;

    // Build filter
    const filter = {};

    if (service) {
      filter.services = service;
    }

    if (country) {
      filter["location.country"] = country;
    }

    if (minRating) {
      filter.rating = { $gte: parseFloat(minRating) };
    }

    if (availability) {
      filter.availability = availability;
    }

    if (verified !== undefined) {
      filter.verified = verified === "true";
    }

    // Pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Get partners
    const partners = await Partner.find(filter)
      .populate("userId", "name email avatar")
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Partner.countDocuments(filter);

    res.json({
      success: true,
      data: partners,
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
 * @desc    Get single partner
 * @route   GET /api/partners/:id
 * @access  Public
 */
export const getPartner = async (req, res, next) => {
  try {
    const partner = await Partner.findById(req.params.id).populate(
      "userId",
      "name email avatar"
    );

    if (!partner) {
      const error = new Error("Partner not found");
      error.statusCode = 404;
      return next(error);
    }

    res.json({
      success: true,
      data: partner,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update partner profile
 * @route   PATCH /api/partners/:id
 * @access  Private
 */
export const updatePartner = async (req, res, next) => {
  try {
    const partner = await Partner.findById(req.params.id);

    if (!partner) {
      const error = new Error("Partner not found");
      error.statusCode = 404;
      return next(error);
    }

    // Check ownership
    if (
      partner.userId.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      const error = new Error("Not authorized to update this profile");
      error.statusCode = 403;
      return next(error);
    }

    // Update fields
    const {
      services,
      pricing,
      portfolio,
      location,
      skills,
      bio,
      availability,
    } = req.body;

    if (services) partner.services = services;
    if (pricing) partner.pricing = pricing;
    if (portfolio) partner.portfolio = portfolio;
    if (location) partner.location = location;
    if (skills) partner.skills = skills;
    if (bio) partner.bio = bio;
    if (availability) partner.availability = availability;

    await partner.save();
    await partner.populate("userId", "name email avatar");

    res.json({
      success: true,
      message: "Partner profile updated successfully",
      data: partner,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Add review to partner
 * @route   POST /api/partners/:id/review
 * @access  Private
 */
export const addReview = async (req, res, next) => {
  try {
    const { rating, comment } = req.body;

    const partner = await Partner.findById(req.params.id);

    if (!partner) {
      const error = new Error("Partner not found");
      error.statusCode = 404;
      return next(error);
    }

    // Check if user has completed assignment with this partner
    const completedAssignment = await PartnerAssignment.findOne({
      partnerId: partner._id,
      launchId: { $in: req.user.launches || [] },
      status: "completed",
    });

    if (!completedAssignment) {
      const error = new Error(
        "You can only review partners you've worked with"
      );
      error.statusCode = 403;
      return next(error);
    }

    // Check if user already reviewed
    const existingReview = partner.reviews.find(
      (review) => review.userId.toString() === req.user._id.toString()
    );

    if (existingReview) {
      const error = new Error("You have already reviewed this partner");
      error.statusCode = 400;
      return next(error);
    }

    // Add review
    partner.reviews.push({
      userId: req.user._id,
      rating,
      comment,
    });

    // Update average rating
    partner.calculateRating();

    await partner.save();
    await partner.populate("reviews.userId", "name avatar");

    res.json({
      success: true,
      message: "Review added successfully",
      data: partner,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete partner profile
 * @route   DELETE /api/partners/:id
 * @access  Private (Admin or Owner)
 */
export const deletePartner = async (req, res, next) => {
  try {
    const partner = await Partner.findById(req.params.id);

    if (!partner) {
      const error = new Error("Partner not found");
      error.statusCode = 404;
      return next(error);
    }

    // Check ownership
    if (
      partner.userId.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      const error = new Error("Not authorized to delete this profile");
      error.statusCode = 403;
      return next(error);
    }

    await partner.deleteOne();

    res.json({
      success: true,
      message: "Partner profile deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

export default {
  createPartnerProfile,
  getPartners,
  getPartner,
  updatePartner,
  addReview,
  deletePartner,
};
