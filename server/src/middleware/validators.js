import { body, param, query, validationResult } from 'express-validator';
import { HTTP_STATUS, COMPLAINT_CATEGORIES, USER_ROLES } from '../config/constants.js';

// Validation error handler
export const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array().map(err => ({
        field: err.path,
        message: err.msg
      }))
    });
  }
  next();
};

// User registration validation
export const registerValidation = [
  body('name')
    .trim()
    .notEmpty().withMessage('Name is required')
    .isLength({ min: 2, max: 100 }).withMessage('Name must be between 2 and 100 characters'),
  
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please provide a valid email')
    .normalizeEmail(),
  
  body('password')
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  
  body('phone')
    .optional()
    .matches(/^[6-9]\d{9}$/).withMessage('Please provide a valid Indian phone number'),
  
  validate
];

// Login validation
export const loginValidation = [
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please provide a valid email')
    .normalizeEmail(),
  
  body('password')
    .notEmpty().withMessage('Password is required'),
  
  validate
];

// Complaint submission validation
export const complaintValidation = [
  body('title')
    .trim()
    .notEmpty().withMessage('Title is required')
    .isLength({ min: 10, max: 200 }).withMessage('Title must be between 10 and 200 characters'),
  
  body('description')
    .trim()
    .notEmpty().withMessage('Description is required')
    .isLength({ min: 20, max: 5000 }).withMessage('Description must be between 20 and 5000 characters'),
  
  body('category')
    .notEmpty().withMessage('Category is required')
    .isIn(Object.values(COMPLAINT_CATEGORIES)).withMessage('Invalid category'),
  
  body('location.coordinates')
    .isArray({ min: 2, max: 2 }).withMessage('Coordinates must be an array of [longitude, latitude]')
    .custom((value) => {
      const [lng, lat] = value;
      if (lng < -180 || lng > 180) throw new Error('Invalid longitude');
      if (lat < -90 || lat > 90) throw new Error('Invalid latitude');
      return true;
    }),
  
  body('location.address')
    .trim()
    .notEmpty().withMessage('Address is required'),
  
  body('location.district')
    .trim()
    .notEmpty().withMessage('District is required'),
  
  body('location.state')
    .trim()
    .notEmpty().withMessage('State is required'),
  
  validate
];

// Status update validation
export const statusUpdateValidation = [
  body('status')
    .notEmpty().withMessage('Status is required'),
  
  body('remarks')
    .optional()
    .trim()
    .isLength({ max: 1000 }).withMessage('Remarks cannot exceed 1000 characters'),
  
  validate
];

// Department creation validation
export const departmentValidation = [
  body('name')
    .trim()
    .notEmpty().withMessage('Department name is required'),
  
  body('code')
    .trim()
    .notEmpty().withMessage('Department code is required')
    .isLength({ min: 2, max: 10 }).withMessage('Code must be between 2 and 10 characters')
    .isAlphanumeric().withMessage('Code must be alphanumeric'),
  
  body('description')
    .trim()
    .notEmpty().withMessage('Description is required'),
  
  body('contactEmail')
    .trim()
    .notEmpty().withMessage('Contact email is required')
    .isEmail().withMessage('Please provide a valid email'),
  
  body('contactPhone')
    .trim()
    .notEmpty().withMessage('Contact phone is required')
    .matches(/^[6-9]\d{9}$/).withMessage('Please provide a valid Indian phone number'),
  
  validate
];

// MongoDB ObjectId validation
export const objectIdValidation = (paramName = 'id') => [
  param(paramName)
    .isMongoId().withMessage('Invalid ID format'),
  
  validate
];

// Pagination validation
export const paginationValidation = [
  query('page')
    .optional()
    .isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  
  validate
];

// Password reset request validation
export const forgotPasswordValidation = [
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please provide a valid email')
    .normalizeEmail(),
  
  validate
];

// Password reset validation
export const resetPasswordValidation = [
  body('token')
    .notEmpty().withMessage('Reset token is required'),
  
  body('password')
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  
  validate
];

// Message validation
export const messageValidation = [
  body('message')
    .trim()
    .notEmpty().withMessage('Message is required')
    .isLength({ max: 2000 }).withMessage('Message cannot exceed 2000 characters'),
  
  validate
];

export default {
  validate,
  registerValidation,
  loginValidation,
  complaintValidation,
  statusUpdateValidation,
  departmentValidation,
  objectIdValidation,
  paginationValidation,
  forgotPasswordValidation,
  resetPasswordValidation,
  messageValidation
};
