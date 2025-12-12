import Task from "../models/Task.js";
import Launch from "../models/Launch.js";
import { emitTaskEvent, emitCommentEvent } from "../services/socketService.js";

/**
 * @desc    Create task
 * @route   POST /api/tasks
 * @access  Private
 */
export const createTask = async (req, res, next) => {
  try {
    const {
      launchId,
      title,
      description,
      assignedTo,
      priority,
      dueDate,
      attachments,
    } = req.body;

    // Verify launch exists and user has access
    const launch = await Launch.findById(launchId);
    if (!launch) {
      const error = new Error("Launch not found");
      error.statusCode = 404;
      return next(error);
    }

    // Check if user is launch owner or collaborator
    const isOwner = launch.userId.toString() === req.user._id.toString();
    const isCollaborator = launch.collaborators.some(
      (c) => c.userId.toString() === req.user._id.toString()
    );

    if (!isOwner && !isCollaborator && req.user.role !== "admin") {
      const error = new Error("Not authorized to create tasks for this launch");
      error.statusCode = 403;
      return next(error);
    }

    // Get the highest position for this launch
    const maxPositionTask = await Task.findOne({ launchId }).sort("-position");
    const position = maxPositionTask ? maxPositionTask.position + 1 : 0;

    const task = await Task.create({
      launchId,
      title,
      description,
      assignedTo,
      createdBy: req.user._id,
      priority,
      dueDate,
      attachments,
      position,
    });

    await task.populate([
      { path: "assignedTo", select: "name email avatar" },
      { path: "createdBy", select: "name email avatar" },
    ]);

    // Emit Socket.IO event
    try {
      emitTaskEvent(launchId, "created", task);
    } catch (socketError) {
      console.error("Socket.IO error:", socketError);
    }

    res.status(201).json({
      success: true,
      message: "Task created successfully",
      data: task,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get tasks for a launch
 * @route   GET /api/tasks?launchId=xxx&status=xxx
 * @access  Private
 */
export const getTasks = async (req, res, next) => {
  try {
    const { launchId, status, assignedTo, page = 1, limit = 50 } = req.query;

    if (!launchId) {
      const error = new Error("launchId query parameter is required");
      error.statusCode = 400;
      return next(error);
    }

    // Verify launch exists and user has access
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
      const error = new Error("Not authorized to view tasks for this launch");
      error.statusCode = 403;
      return next(error);
    }

    // Build filter
    const filter = { launchId };

    if (status) {
      filter.status = status;
    }

    if (assignedTo) {
      filter.assignedTo = assignedTo;
    }

    // Pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const tasks = await Task.find(filter)
      .populate("assignedTo", "name email avatar")
      .populate("createdBy", "name email avatar")
      .populate("comments.userId", "name avatar")
      .sort("position")
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Task.countDocuments(filter);

    res.json({
      success: true,
      data: tasks,
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
 * @desc    Get single task
 * @route   GET /api/tasks/:id
 * @access  Private
 */
export const getTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate("assignedTo", "name email avatar")
      .populate("createdBy", "name email avatar")
      .populate("comments.userId", "name avatar");

    if (!task) {
      const error = new Error("Task not found");
      error.statusCode = 404;
      return next(error);
    }

    // Verify access
    const launch = await Launch.findById(task.launchId);
    const isOwner = launch.userId.toString() === req.user._id.toString();
    const isCollaborator = launch.collaborators.some(
      (c) => c.userId.toString() === req.user._id.toString()
    );

    if (!isOwner && !isCollaborator && req.user.role !== "admin") {
      const error = new Error("Not authorized to view this task");
      error.statusCode = 403;
      return next(error);
    }

    res.json({
      success: true,
      data: task,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update task
 * @route   PATCH /api/tasks/:id
 * @access  Private
 */
export const updateTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      const error = new Error("Task not found");
      error.statusCode = 404;
      return next(error);
    }

    // Verify access
    const launch = await Launch.findById(task.launchId);
    const isOwner = launch.userId.toString() === req.user._id.toString();
    const isCollaborator = launch.collaborators.some(
      (c) => c.userId.toString() === req.user._id.toString()
    );

    if (!isOwner && !isCollaborator && req.user.role !== "admin") {
      const error = new Error("Not authorized to update this task");
      error.statusCode = 403;
      return next(error);
    }

    // Update fields
    const {
      title,
      description,
      status,
      assignedTo,
      priority,
      dueDate,
      attachments,
    } = req.body;

    if (title) task.title = title;
    if (description) task.description = description;
    if (status) task.status = status;
    if (assignedTo !== undefined) task.assignedTo = assignedTo;
    if (priority) task.priority = priority;
    if (dueDate) task.dueDate = dueDate;
    if (attachments) task.attachments = attachments;

    await task.save();

    await task.populate([
      { path: "assignedTo", select: "name email avatar" },
      { path: "createdBy", select: "name email avatar" },
      { path: "comments.userId", select: "name avatar" },
    ]);

    // Emit Socket.IO event
    try {
      emitTaskEvent(task.launchId, "updated", task);
    } catch (socketError) {
      console.error("Socket.IO error:", socketError);
    }

    res.json({
      success: true,
      message: "Task updated successfully",
      data: task,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete task
 * @route   DELETE /api/tasks/:id
 * @access  Private
 */
export const deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      const error = new Error("Task not found");
      error.statusCode = 404;
      return next(error);
    }

    // Verify access (only owner or admin can delete)
    const launch = await Launch.findById(task.launchId);
    const isOwner = launch.userId.toString() === req.user._id.toString();

    if (!isOwner && req.user.role !== "admin") {
      const error = new Error("Not authorized to delete this task");
      error.statusCode = 403;
      return next(error);
    }

    const launchId = task.launchId;
    await task.deleteOne();

    // Emit Socket.IO event
    try {
      emitTaskEvent(launchId, "deleted", { _id: req.params.id });
    } catch (socketError) {
      console.error("Socket.IO error:", socketError);
    }

    res.json({
      success: true,
      message: "Task deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Reorder task (update position)
 * @route   PATCH /api/tasks/:id/position
 * @access  Private
 */
export const reorderTask = async (req, res, next) => {
  try {
    const { position } = req.body;

    const task = await Task.findById(req.params.id);

    if (!task) {
      const error = new Error("Task not found");
      error.statusCode = 404;
      return next(error);
    }

    // Verify access
    const launch = await Launch.findById(task.launchId);
    const isOwner = launch.userId.toString() === req.user._id.toString();
    const isCollaborator = launch.collaborators.some(
      (c) => c.userId.toString() === req.user._id.toString()
    );

    if (!isOwner && !isCollaborator && req.user.role !== "admin") {
      const error = new Error("Not authorized to reorder this task");
      error.statusCode = 403;
      return next(error);
    }

    task.position = position;
    await task.save();

    await task.populate([
      { path: "assignedTo", select: "name email avatar" },
      { path: "createdBy", select: "name email avatar" },
    ]);

    // Emit Socket.IO event
    try {
      emitTaskEvent(task.launchId, "updated", task);
    } catch (socketError) {
      console.error("Socket.IO error:", socketError);
    }

    res.json({
      success: true,
      message: "Task position updated successfully",
      data: task,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Add comment to task
 * @route   POST /api/tasks/:id/comments
 * @access  Private
 */
export const addComment = async (req, res, next) => {
  try {
    const { text } = req.body;

    const task = await Task.findById(req.params.id);

    if (!task) {
      const error = new Error("Task not found");
      error.statusCode = 404;
      return next(error);
    }

    // Verify access
    const launch = await Launch.findById(task.launchId);
    const isOwner = launch.userId.toString() === req.user._id.toString();
    const isCollaborator = launch.collaborators.some(
      (c) => c.userId.toString() === req.user._id.toString()
    );

    if (!isOwner && !isCollaborator && req.user.role !== "admin") {
      const error = new Error("Not authorized to comment on this task");
      error.statusCode = 403;
      return next(error);
    }

    const comment = {
      userId: req.user._id,
      text,
    };

    task.comments.push(comment);
    await task.save();

    await task.populate("comments.userId", "name avatar");

    // Get the newly added comment
    const newComment = task.comments[task.comments.length - 1];

    // Emit Socket.IO event
    try {
      emitCommentEvent(task.launchId, task._id, newComment);
    } catch (socketError) {
      console.error("Socket.IO error:", socketError);
    }

    res.json({
      success: true,
      message: "Comment added successfully",
      data: task,
    });
  } catch (error) {
    next(error);
  }
};

export default {
  createTask,
  getTasks,
  getTask,
  updateTask,
  deleteTask,
  reorderTask,
  addComment,
};
