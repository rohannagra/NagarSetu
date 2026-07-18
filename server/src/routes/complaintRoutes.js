import express from 'express';
import {
  submitComplaint,
  getComplaints,
  getComplaint,
  getMyComplaints,
  updateComplaintStatus,
  assignComplaint,
  addInternalNote,
  getHeatmapData,
  deleteComplaint
} from '../controllers/complaintController.js';
import { protect, authorize, optionalAuth } from '../middleware/auth.js';
import { 
  complaintValidation,
  statusUpdateValidation,
  objectIdValidation
} from '../middleware/validators.js';
import { complaintLimiter } from '../middleware/rateLimiter.js';
import { USER_ROLES } from '../config/constants.js';
import { uploadMultiple } from '../middleware/upload.js';

const router = express.Router();

// Public/optional auth routes - use multer for file uploads, skip validation for FormData
router.post('/', optionalAuth, complaintLimiter, uploadMultiple, submitComplaint);
router.get('/heatmap', getHeatmapData);
router.get('/:id', optionalAuth, getComplaint);

// Citizen routes
router.get('/user/my-complaints', protect, authorize(USER_ROLES.CITIZEN), getMyComplaints);
router.delete('/:id', protect, authorize(USER_ROLES.CITIZEN), objectIdValidation('id'), deleteComplaint);

// Officer/Admin routes
router.get('/', protect, authorize(USER_ROLES.OFFICER, USER_ROLES.DEPARTMENT_ADMIN, USER_ROLES.SUPER_ADMIN), getComplaints);
router.patch('/:id/status', protect, authorize(USER_ROLES.OFFICER, USER_ROLES.DEPARTMENT_ADMIN, USER_ROLES.SUPER_ADMIN), objectIdValidation('id'), statusUpdateValidation, updateComplaintStatus);
router.patch('/:id/assign', protect, authorize(USER_ROLES.DEPARTMENT_ADMIN, USER_ROLES.SUPER_ADMIN), objectIdValidation('id'), assignComplaint);
router.post('/:id/notes', protect, authorize(USER_ROLES.OFFICER, USER_ROLES.DEPARTMENT_ADMIN, USER_ROLES.SUPER_ADMIN), objectIdValidation('id'), addInternalNote);

export default router;
