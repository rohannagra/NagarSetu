import User from '../models/User.js';
import AuditLog from '../models/AuditLog.js';
import { sendTokenResponse, verifyRefreshToken, generateAccessToken } from '../utils/jwt.js';
import { sendEmail, emailTemplates } from '../config/email.js';
import { HTTP_STATUS, ERROR_MESSAGES, USER_ROLES } from '../config/constants.js';
import { isUsingFileStorage } from '../config/database.js';
import fileStorage from '../utils/fileStorage.js';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
export const register = async (req, res) => {
  try {
    const { name, email, password, phone, address, role } = req.body;

    // Only allow citizen registration through public route
    const userRole = role && role !== USER_ROLES.CITIZEN ? USER_ROLES.CITIZEN : (role || USER_ROLES.CITIZEN);

    // Use file storage if MongoDB is not available
    if (isUsingFileStorage()) {
      // Check if user already exists
      const existingUser = fileStorage.findOne('users', { email });
      if (existingUser) {
        return res.status(HTTP_STATUS.CONFLICT).json({
          success: false,
          message: ERROR_MESSAGES.EMAIL_ALREADY_EXISTS
        });
      }

      // Hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // Create user object
      const user = fileStorage.create('users', {
        name,
        email,
        password: hashedPassword,
        phone: phone || '',
        address: address || {},
        role: userRole,
        isEmailVerified: false,
        isActive: true
      });

      // Create response user (without password)
      const responseUser = {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        isEmailVerified: user.isEmailVerified
      };

      // Generate tokens
      const jwt = await import('jsonwebtoken');
      const accessToken = jwt.default.sign(
        { id: user._id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRE || '7d' }
      );

      const refreshToken = jwt.default.sign(
        { id: user._id },
        process.env.JWT_REFRESH_SECRET,
        { expiresIn: process.env.JWT_REFRESH_EXPIRE || '30d' }
      );

      return res.status(HTTP_STATUS.CREATED).json({
        success: true,
        message: 'Registration successful',
        data: {
          user: responseUser,
          accessToken,
          refreshToken
        }
      });
    }

    // MongoDB path
    // Check if user already exists
    const existingUser = await User.findOne({ email }).maxTimeMS(5000);
    if (existingUser) {
      return res.status(HTTP_STATUS.CONFLICT).json({
        success: false,
        message: ERROR_MESSAGES.EMAIL_ALREADY_EXISTS
      });
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password,
      phone,
      address,
      role: userRole
    });

    // Generate email verification token
    const verificationToken = user.createEmailVerificationToken();
    await user.save({ validateBeforeSave: false });

    // Send welcome email (skip if email not configured)
    try {
      const emailContent = emailTemplates.welcome(user.name);
      await sendEmail({
        to: user.email,
        subject: emailContent.subject,
        html: emailContent.html,
        text: emailContent.text
      });
    } catch (emailError) {
      console.log('Email sending skipped:', emailError.message);
    }

    // Log audit
    try {
      await AuditLog.create({
        user: user._id,
        action: 'user_created',
        entityType: 'user',
        entityId: user._id,
        metadata: {
          ip: req.ip,
          userAgent: req.get('user-agent')
        },
        description: `New user registered: ${user.email}`
      });
    } catch (auditError) {
      console.log('Audit log skipped:', auditError.message);
    }

    // Send token response
    sendTokenResponse(user, HTTP_STATUS.CREATED, res, 'Registration successful');

  } catch (error) {
    console.error('Register error:', error);
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message || ERROR_MESSAGES.SERVER_ERROR
    });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Use file storage if MongoDB is not available
    if (isUsingFileStorage()) {
      // Find user
      const user = fileStorage.findOne('users', { email });

      if (!user) {
        return res.status(HTTP_STATUS.UNAUTHORIZED).json({
          success: false,
          message: ERROR_MESSAGES.INVALID_CREDENTIALS
        });
      }

      // Verify password
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(HTTP_STATUS.UNAUTHORIZED).json({
          success: false,
          message: ERROR_MESSAGES.INVALID_CREDENTIALS
        });
      }

      // Update last login
      fileStorage.update('users', user._id, {
        lastLogin: new Date().toISOString()
      });

      // Create response user (without password)
      const responseUser = {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        isEmailVerified: user.isEmailVerified
      };

      // Generate tokens
      const jwt = await import('jsonwebtoken');
      const accessToken = jwt.default.sign(
        { id: user._id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRE || '7d' }
      );

      const refreshToken = jwt.default.sign(
        { id: user._id },
        process.env.JWT_REFRESH_SECRET,
        { expiresIn: process.env.JWT_REFRESH_EXPIRE || '30d' }
      );

      return res.status(HTTP_STATUS.OK).json({
        success: true,
        message: 'Login successful',
        data: {
          user: responseUser,
          accessToken,
          refreshToken
        }
      });
    }

    // MongoDB path
    // Find user and include password
    const user = await User.findOne({ email }).select('+password').populate('department', 'name code').maxTimeMS(5000);

    if (!user) {
      return res.status(HTTP_STATUS.UNAUTHORIZED).json({
        success: false,
        message: ERROR_MESSAGES.INVALID_CREDENTIALS
      });
    }

    // Check if user is active
    if (!user.isActive) {
      return res.status(HTTP_STATUS.FORBIDDEN).json({
        success: false,
        message: 'Your account has been deactivated. Please contact support.'
      });
    }

    // Verify password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(HTTP_STATUS.UNAUTHORIZED).json({
        success: false,
        message: ERROR_MESSAGES.INVALID_CREDENTIALS
      });
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save({ validateBeforeSave: false });

    // Log audit
    try {
      await AuditLog.create({
        user: user._id,
        action: 'user_login',
        entityType: 'user',
        entityId: user._id,
        metadata: {
          ip: req.ip,
          userAgent: req.get('user-agent')
        },
        description: `User logged in: ${user.email}`
      });
    } catch (auditError) {
      console.log('Audit log skipped:', auditError.message);
    }

    // Send token response
    sendTokenResponse(user, HTTP_STATUS.OK, res, 'Login successful');

  } catch (error) {
    console.error('Login error:', error);
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message || ERROR_MESSAGES.SERVER_ERROR
    });
  }
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('department', 'name code contactEmail contactPhone');

    res.status(HTTP_STATUS.OK).json({
      success: true,
      data: { user }
    });
  } catch (error) {
    console.error('Get me error:', error);
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message || ERROR_MESSAGES.SERVER_ERROR
    });
  }
};

// @desc    Refresh access token
// @route   POST /api/auth/refresh
// @access  Public
export const refreshToken = async (req, res) => {
  try {
    const { refreshToken: token } = req.body;

    if (!token) {
      return res.status(HTTP_STATUS.UNAUTHORIZED).json({
        success: false,
        message: 'Refresh token is required'
      });
    }

    // Verify refresh token
    const decoded = verifyRefreshToken(token);

    // Find user
    const user = await User.findById(decoded.id);
    if (!user || user.refreshToken !== token) {
      return res.status(HTTP_STATUS.UNAUTHORIZED).json({
        success: false,
        message: ERROR_MESSAGES.INVALID_TOKEN
      });
    }

    // Generate new access token
    const accessToken = generateAccessToken(user._id);

    res.status(HTTP_STATUS.OK).json({
      success: true,
      data: { accessToken }
    });

  } catch (error) {
    console.error('Refresh token error:', error);
    res.status(HTTP_STATUS.UNAUTHORIZED).json({
      success: false,
      message: ERROR_MESSAGES.INVALID_TOKEN
    });
  }
};

// @desc    Logout user
// @route   POST /api/auth/logout
// @access  Private
export const logout = async (req, res) => {
  try {
    // Clear refresh token
    req.user.refreshToken = undefined;
    await req.user.save({ validateBeforeSave: false });

    // Log audit
    await AuditLog.create({
      user: req.user._id,
      action: 'user_logout',
      entityType: 'user',
      entityId: req.user._id,
      metadata: {
        ip: req.ip,
        userAgent: req.get('user-agent')
      },
      description: `User logged out: ${req.user.email}`
    });

    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: 'Logged out successfully'
    });

  } catch (error) {
    console.error('Logout error:', error);
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message || ERROR_MESSAGES.SERVER_ERROR
    });
  }
};

// @desc    Forgot password
// @route   POST /api/auth/forgot-password
// @access  Public
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({
        success: false,
        message: ERROR_MESSAGES.USER_NOT_FOUND
      });
    }

    // Generate reset token
    const resetToken = user.createPasswordResetToken();
    await user.save({ validateBeforeSave: false });

    // Send reset email
    const emailContent = emailTemplates.passwordReset(user.name, resetToken);
    await sendEmail({
      to: user.email,
      subject: emailContent.subject,
      html: emailContent.html,
      text: emailContent.text
    });

    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: 'Password reset link sent to your email'
    });

  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message || ERROR_MESSAGES.SERVER_ERROR
    });
  }
};

// @desc    Reset password
// @route   POST /api/auth/reset-password
// @access  Public
export const resetPassword = async (req, res) => {
  try {
    const { token, password } = req.body;

    // Find user with valid reset token
    const users = await User.find({
      passwordResetExpires: { $gt: Date.now() }
    });

    let user = null;
    for (const u of users) {
      const isValid = bcrypt.compareSync(token, u.passwordResetToken || '');
      if (isValid) {
        user = u;
        break;
      }
    }

    if (!user) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        message: 'Invalid or expired reset token'
      });
    }

    // Set new password
    user.password = password;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    // Log audit
    await AuditLog.create({
      user: user._id,
      action: 'password_reset',
      entityType: 'user',
      entityId: user._id,
      metadata: {
        ip: req.ip,
        userAgent: req.get('user-agent')
      },
      description: `Password reset for user: ${user.email}`
    });

    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: 'Password reset successful. Please login with your new password.'
    });

  } catch (error) {
    console.error('Reset password error:', error);
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message || ERROR_MESSAGES.SERVER_ERROR
    });
  }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
export const updateProfile = async (req, res) => {
  try {
    const { name, phone, address, contactPreference, notificationSettings } = req.body;

    const user = await User.findById(req.user.id);

    if (name) user.name = name;
    if (phone) user.phone = phone;
    if (address) user.address = { ...user.address, ...address };
    if (contactPreference) user.contactPreference = contactPreference;
    if (notificationSettings) user.notificationSettings = { ...user.notificationSettings, ...notificationSettings };

    await user.save();

    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: 'Profile updated successfully',
      data: { user }
    });

  } catch (error) {
    console.error('Update profile error:', error);
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message || ERROR_MESSAGES.SERVER_ERROR
    });
  }
};

// @desc    Change password
// @route   PUT /api/auth/change-password
// @access  Private
export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(req.user.id).select('+password');

    // Verify current password
    const isValid = await user.comparePassword(currentPassword);
    if (!isValid) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        message: 'Current password is incorrect'
      });
    }

    // Set new password
    user.password = newPassword;
    await user.save();

    // Log audit
    await AuditLog.create({
      user: user._id,
      action: 'password_reset',
      entityType: 'user',
      entityId: user._id,
      metadata: {
        ip: req.ip,
        userAgent: req.get('user-agent')
      },
      description: `Password changed for user: ${user.email}`
    });

    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: 'Password changed successfully'
    });

  } catch (error) {
    console.error('Change password error:', error);
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message || ERROR_MESSAGES.SERVER_ERROR
    });
  }
};

export default {
  register,
  login,
  getMe,
  refreshToken,
  logout,
  forgotPassword,
  resetPassword,
  updateProfile,
  changePassword
};
