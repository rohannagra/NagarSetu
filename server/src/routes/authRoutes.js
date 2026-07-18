import express from 'express';
import {
  register,
  login,
  getMe,
  refreshToken,
  logout,
  forgotPassword,
  resetPassword,
  updateProfile,
  changePassword
} from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';
import {
  registerValidation,
  loginValidation,
  forgotPasswordValidation,
  resetPasswordValidation
} from '../middleware/validators.js';
import { authLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

// Public routes
router.post('/register', authLimiter, registerValidation, register);
router.post('/login', authLimiter, loginValidation, login);
router.post('/refresh', refreshToken);
router.post('/forgot-password', authLimiter, forgotPasswordValidation, forgotPassword);
router.post('/reset-password', authLimiter, resetPasswordValidation, resetPassword);

// Protected routes
router.get('/me', protect, getMe);
router.post('/logout', protect, logout);
router.put('/profile', protect, updateProfile);
router.put('/change-password', protect, changePassword);

export default router;
