import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import logger from "../utils/logger.js";

let io = null;

/**
 * Initialize Socket.IO
 * @param {object} server - HTTP server instance
 * @returns {object} Socket.IO instance
 */
export const initializeSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: process.env.FRONTEND_URL || "http://localhost:3000",
      credentials: true,
    },
  });

  // Authentication middleware for Socket.IO
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token || socket.handshake.query.token;

      if (!token) {
        return next(new Error("Authentication error: No token provided"));
      }

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_KEY);
      socket.userId = decoded.id;

      next();
    } catch (error) {
      next(new Error("Authentication error: Invalid token"));
    }
  });

  // Connection handling
  io.on("connection", (socket) => {
    logger.info(`Socket connected: ${socket.id} (User: ${socket.userId})`);

    // Join launch room
    socket.on("join:launch", (launchId) => {
      socket.join(`launch-${launchId}`);
      logger.info(`User ${socket.userId} joined launch-${launchId}`);
    });

    // Leave launch room
    socket.on("leave:launch", (launchId) => {
      socket.leave(`launch-${launchId}`);
      logger.info(`User ${socket.userId} left launch-${launchId}`);
    });

    // Disconnect
    socket.on("disconnect", () => {
      logger.info(`Socket disconnected: ${socket.id}`);
    });
  });

  return io;
};

/**
 * Get Socket.IO instance
 * @returns {object} Socket.IO instance
 */
export const getIO = () => {
  if (!io) {
    throw new Error("Socket.IO not initialized");
  }
  return io;
};

/**
 * Emit task event to launch room
 * @param {string} launchId - Launch ID
 * @param {string} eventType - Event type (created, updated, deleted)
 * @param {object} task - Task data
 */
export const emitTaskEvent = (launchId, eventType, task) => {
  if (io) {
    io.to(`launch-${launchId}`).emit(`task:${eventType}`, task);
  }
};

/**
 * Emit comment event to launch room
 * @param {string} launchId - Launch ID
 * @param {string} taskId - Task ID
 * @param {object} comment - Comment data
 */
export const emitCommentEvent = (launchId, taskId, comment) => {
  if (io) {
    io.to(`launch-${launchId}`).emit("comment:added", {
      taskId,
      comment,
    });
  }
};

/**
 * Emit launch update event
 * @param {string} launchId - Launch ID
 * @param {object} data - Update data
 */
export const emitLaunchUpdate = (launchId, data) => {
  if (io) {
    io.to(`launch-${launchId}`).emit("launch:updated", data);
  }
};

export default {
  initializeSocket,
  getIO,
  emitTaskEvent,
  emitCommentEvent,
  emitLaunchUpdate,
};
