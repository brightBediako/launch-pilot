import ContentDraft from "../models/ContentDraft.js";
import Launch from "../models/Launch.js";
import {
  generateProductHuntDraft,
  generateTwitterDraft,
  generateLinkedInDraft,
} from "../services/contentGenerator.js";

// @desc    Create draft for a launch
// @route   POST /api/launches/:launchId/drafts
// @access  Private
export const createDraft = async (req, res, next) => {
  try {
    const { launchId } = req.params;
    const { platform, generateWithAI = false } = req.body;

    // Check if launch exists and user owns it
    const launch = await Launch.findById(launchId);
    if (!launch) {
      return res.status(404).json({
        success: false,
        message: "Launch not found",
      });
    }

    if (launch.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to create draft for this launch",
      });
    }

    let draftContent = {};
    if (generateWithAI) {
      // Generate content using AI
      const userContext = {
        timezone: req.user.timezone,
        currency: req.user.currency,
        markets: launch.markets,
      };

      const launchData = {
        title: launch.title,
        description: launch.description,
        markets: launch.markets,
        websiteUrl: launch.websiteUrl,
      };

      if (platform === "producthunt") {
        draftContent = await generateProductHuntDraft(launchData, userContext);
      } else if (platform === "twitter") {
        draftContent = await generateTwitterDraft(launchData, userContext);
      } else if (platform === "linkedin") {
        draftContent = await generateLinkedInDraft(launchData, userContext);
      }
    } else {
      // Manual draft
      draftContent = req.body.content || {};
    }

    const draft = await ContentDraft.create({
      launchId,
      userId: req.user._id,
      platform,
      content: draftContent,
      aiProvider: draftContent.aiProvider || "manual",
    });

    res.status(201).json({
      success: true,
      message: "Draft created successfully",
      data: draft,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all drafts for a launch
// @route   GET /api/launches/:launchId/drafts
// @access  Private
export const getDraftsByLaunch = async (req, res, next) => {
  try {
    const { launchId } = req.params;

    const launch = await Launch.findById(launchId);
    if (!launch) {
      return res.status(404).json({
        success: false,
        message: "Launch not found",
      });
    }

    if (launch.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to view drafts for this launch",
      });
    }

    const drafts = await ContentDraft.find({ launchId }).sort("-createdAt");

    res.json({
      success: true,
      data: drafts,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single draft
// @route   GET /api/drafts/:id
// @access  Private
export const getDraft = async (req, res, next) => {
  try {
    const draft = await ContentDraft.findById(req.params.id);

    if (!draft) {
      return res.status(404).json({
        success: false,
        message: "Draft not found",
      });
    }

    if (draft.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to view this draft",
      });
    }

    res.json({
      success: true,
      data: draft,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update draft
// @route   PATCH /api/drafts/:id
// @access  Private
export const updateDraft = async (req, res, next) => {
  try {
    const draft = await ContentDraft.findById(req.params.id);

    if (!draft) {
      return res.status(404).json({
        success: false,
        message: "Draft not found",
      });
    }

    if (draft.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to update this draft",
      });
    }

    const updatedDraft = await ContentDraft.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      message: "Draft updated successfully",
      data: updatedDraft,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete draft
// @route   DELETE /api/drafts/:id
// @access  Private
export const deleteDraft = async (req, res, next) => {
  try {
    const draft = await ContentDraft.findById(req.params.id);

    if (!draft) {
      return res.status(404).json({
        success: false,
        message: "Draft not found",
      });
    }

    if (draft.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to delete this draft",
      });
    }

    await draft.deleteOne();

    res.json({
      success: true,
      message: "Draft deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Regenerate draft content using AI
// @route   POST /api/drafts/:id/regenerate
// @access  Private
export const regenerateDraft = async (req, res, next) => {
  try {
    const draft = await ContentDraft.findById(req.params.id);

    if (!draft) {
      return res.status(404).json({
        success: false,
        message: "Draft not found",
      });
    }

    if (draft.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to regenerate this draft",
      });
    }

    const launch = await Launch.findById(draft.launchId);
    const userContext = {
      timezone: req.user.timezone,
      currency: req.user.currency,
      markets: launch.markets,
    };

    const launchData = {
      title: launch.title,
      description: launch.description,
      markets: launch.markets,
      websiteUrl: launch.websiteUrl,
    };

    let newContent = {};
    if (draft.platform === "producthunt") {
      newContent = await generateProductHuntDraft(launchData, userContext);
    } else if (draft.platform === "twitter") {
      newContent = await generateTwitterDraft(launchData, userContext);
    } else if (draft.platform === "linkedin") {
      newContent = await generateLinkedInDraft(launchData, userContext);
    }

    draft.content = newContent;
    draft.aiProvider = newContent.aiProvider;
    draft.version += 1;
    await draft.save();

    res.json({
      success: true,
      message: "Draft regenerated successfully",
      data: draft,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Publish draft
// @route   POST /api/drafts/:id/publish
// @access  Private
export const publishDraft = async (req, res, next) => {
  try {
    const draft = await ContentDraft.findById(req.params.id);

    if (!draft) {
      return res.status(404).json({
        success: false,
        message: "Draft not found",
      });
    }

    if (draft.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to publish this draft",
      });
    }

    draft.status = "published";
    draft.publishedAt = new Date();
    await draft.save();

    res.json({
      success: true,
      message: "Draft marked as published",
      data: draft,
    });
  } catch (error) {
    next(error);
  }
};
