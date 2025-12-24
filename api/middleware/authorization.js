import { AuthorizationError, NotFoundError } from "../utils/errors.js";
import logger from "../utils/logger.js";

/**
 * Check if user owns a resource
 * @param {Object} resource - Resource with userId field
 * @param {Object} user - Authenticated user
 * @returns {boolean}
 */
export const isOwner = (resource, user) => {
  if (!resource || !user) return false;
  return resource.userId?.toString() === user._id.toString();
};

/**
 * Check if user is admin
 * @param {Object} user - Authenticated user
 * @returns {boolean}
 */
export const isAdmin = (user) => {
  return user?.role === "admin";
};

/**
 * Check if user is collaborator on a resource
 * @param {Object} resource - Resource with collaborators array
 * @param {Object} user - Authenticated user
 * @returns {boolean}
 */
export const isCollaborator = (resource, user) => {
  if (!resource?.collaborators || !user) return false;
  return resource.collaborators.some(
    (c) => c.userId?.toString() === user._id.toString()
  );
};

/**
 * Middleware to check resource ownership
 * Expects resource to be attached to req.resource
 */
export const checkOwnership = (req, res, next) => {
  try {
    const resource = req.resource;
    const user = req.user;

    if (!resource) {
      throw new NotFoundError("Resource");
    }

    if (isOwner(resource, user) || isAdmin(user)) {
      return next();
    }

    throw new AuthorizationError("Not authorized to access this resource");
  } catch (error) {
    next(error);
  }
};

/**
 * Middleware to check if user owns resource or is collaborator
 */
export const checkOwnershipOrCollaboration = (req, res, next) => {
  try {
    const resource = req.resource;
    const user = req.user;

    if (!resource) {
      throw new NotFoundError("Resource");
    }

    if (
      isOwner(resource, user) ||
      isCollaborator(resource, user) ||
      isAdmin(user)
    ) {
      return next();
    }

    throw new AuthorizationError(
      "Not authorized to access this resource"
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Factory function to create ownership check middleware
 * Fetches resource from database first
 * @param {Model} Model - Mongoose model
 * @param {string} paramName - Route parameter name (default: 'id')
 * @param {Object} options - Options
 * @returns {Function} Express middleware
 */
export const requireOwnership = (Model, paramName = "id", options = {}) => {
  return async (req, res, next) => {
    try {
      const resourceId = req.params[paramName];
      const resource = await Model.findById(resourceId);

      if (!resource) {
        throw new NotFoundError(Model.modelName);
      }

      // Attach resource to request
      req.resource = resource;

      // Check ownership
      if (isOwner(resource, req.user) || isAdmin(req.user)) {
        return next();
      }

      throw new AuthorizationError("Not authorized to access this resource");
    } catch (error) {
      next(error);
    }
  };
};

/**
 * Factory function to create ownership or collaboration check middleware
 */
export const requireOwnershipOrCollaboration = (
  Model,
  paramName = "id"
) => {
  return async (req, res, next) => {
    try {
      const resourceId = req.params[paramName];
      const resource = await Model.findById(resourceId);

      if (!resource) {
        throw new NotFoundError(Model.modelName);
      }

      // Attach resource to request
      req.resource = resource;

      // Check ownership or collaboration
      if (
        isOwner(resource, req.user) ||
        isCollaborator(resource, req.user) ||
        isAdmin(req.user)
      ) {
        return next();
      }

      throw new AuthorizationError("Not authorized to access this resource");
    } catch (error) {
      next(error);
    }
  };
};

export default {
  isOwner,
  isAdmin,
  isCollaborator,
  checkOwnership,
  checkOwnershipOrCollaboration,
  requireOwnership,
  requireOwnershipOrCollaboration,
};

