import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { HTTP_STATUS, ERROR_MESSAGES, USER_ROLES } from '../config/constants.js';

// Verify JWT token
export const protect = async (req, res, next) => {
  try {
    let token;

    // Get token from header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(HTTP_STATUS.UNAUTHORIZED).json({
        success: false,
        message: ERROR_MESSAGES.UNAUTHORIZED
      });
    }

    try {
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get user from token
      req.user = await User.findById(decoded.id).select('-password');

      if (!req.user) {
        return res.status(HTTP_STATUS.UNAUTHORIZED).json({
          success: false,
          message: ERROR_MESSAGES.USER_NOT_FOUND
        });
      }

      // Check if user is active
      if (!req.user.isActive) {
        return res.status(HTTP_STATUS.FORBIDDEN).json({
          success: false,
          message: 'Your account has been deactivated'
        });
      }

      next();
    } catch (error) {
      return res.status(HTTP_STATUS.UNAUTHORIZED).json({
        success: false,
        message: ERROR_MESSAGES.INVALID_TOKEN
      });
    }
  } catch (error) {
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message
    });
  }
};

// Role-based authorization
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(HTTP_STATUS.FORBIDDEN).json({
        success: false,
        message: `Role ${req.user.role} is not authorized to access this route`
      });
    }
    next();
  };
};

// Check if user owns the resource or is admin
export const checkOwnership = (model, paramId = 'id') => {
  return async (req, res, next) => {
    try {
      const resource = await model.findById(req.params[paramId]);

      if (!resource) {
        return res.status(HTTP_STATUS.NOT_FOUND).json({
          success: false,
          message: 'Resource not found'
        });
      }

      // Super admin can access anything
      if (req.user.role === USER_ROLES.SUPER_ADMIN) {
        return next();
      }

      // Check ownership based on model
      const isOwner = resource.citizen?.toString() === req.user.id ||
                      resource.user?.toString() === req.user.id ||
                      resource.assignedOfficer?.toString() === req.user.id;

      if (!isOwner) {
        return res.status(HTTP_STATUS.FORBIDDEN).json({
          success: false,
          message: 'Not authorized to access this resource'
        });
      }

      req.resource = resource;
      next();
    } catch (error) {
      return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: error.message
      });
    }
  };
};

// Optional authentication (for anonymous + authenticated access)
export const optionalAuth = async (req, res, next) => {
  try {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.id).select('-password');
      } catch (error) {
        // Invalid token, but continue as anonymous
        req.user = null;
      }
    }

    next();
  } catch (error) {
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message
    });
  }
};

export default {
  protect,
  authorize,
  checkOwnership,
  optionalAuth
};
