// Role-based access control middleware
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Not authorized. Please login first.",
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `User role '${req.user.role}' is not authorized to access this resource.`,
      });
    }

    next();
  };
};

// Check if user owns the resource
export const checkOwnership = (resourceModel, resourceIdParam = "id") => {
  return async (req, res, next) => {
    try {
      const resourceId = req.params[resourceIdParam];
      const resource = await resourceModel.findById(resourceId);

      if (!resource) {
        return res.status(404).json({
          success: false,
          message: "Resource not found.",
        });
      }

      // Check if user is admin or owns the resource
      if (
        req.user.role === "admin" ||
        resource.userId?.toString() === req.user._id.toString()
      ) {
        req.resource = resource;
        return next();
      }

      return res.status(403).json({
        success: false,
        message: "You are not authorized to access this resource.",
      });
    } catch (error) {
      console.error("Ownership check error:", error);
      return res.status(500).json({
        success: false,
        message: "Server error while checking resource ownership.",
      });
    }
  };
};
