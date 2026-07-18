import Complaint from '../models/Complaint.js';
import User from '../models/User.js';
import Department from '../models/Department.js';
import Notification from '../models/Notification.js';
import Chat from '../models/Chat.js';
import AuditLog from '../models/AuditLog.js';
import { HTTP_STATUS, COMPLAINT_STATUS, NOTIFICATION_TYPES, USER_ROLES } from '../config/constants.js';
import { generateAnonymousToken, getPagination, paginationResponse } from '../utils/helpers.js';
import { sendEmail, emailTemplates } from '../config/email.js';
import { isUsingFileStorage } from '../config/database.js';
import fileStorage from '../utils/fileStorage.js';
import axios from 'axios';

// @desc    Submit new complaint
// @route   POST /api/complaints
// @access  Public (with optional auth)
export const submitComplaint = async (req, res) => {
  try {
    console.log('=== Submit Complaint Request ===');
    console.log('User:', req.user ? req.user.id : 'Not authenticated');
    console.log('Body:', req.body);
    console.log('Files:', req.files ? req.files.length : 0);
    
    const {
      title,
      description,
      category,
      subCategory,
      expectedOutcome,
      contactPreference,
      isAnonymous,
      media,
      tags
    } = req.body;

    // Parse location from FormData structure
    let location;
    if (req.body['location[coordinates][0]'] && req.body['location[coordinates][1]']) {
      // Location is sent as separate fields
      location = {
        type: 'Point',
        coordinates: [
          parseFloat(req.body['location[coordinates][0]']),
          parseFloat(req.body['location[coordinates][1]'])
        ],
        address: req.body['location[address]'],
        district: req.body['location[district]'],
        state: req.body['location[state]'],
        pincode: req.body['location[pincode]'] || '',
        landmark: req.body['location[landmark]'] || ''
      };
    } else if (req.body.location) {
      // Location is sent as JSON
      location = typeof req.body.location === 'string' 
        ? JSON.parse(req.body.location) 
        : req.body.location;
    } else {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        message: 'Location data is required'
      });
    }

    // Parse anonymousContact from FormData structure
    let anonymousContact;
    if (req.body['anonymousContact[email]'] || req.body['anonymousContact[phone]']) {
      anonymousContact = {
        email: req.body['anonymousContact[email]'],
        phone: req.body['anonymousContact[phone]']
      };
    } else if (req.body.anonymousContact) {
      anonymousContact = typeof req.body.anonymousContact === 'string'
        ? JSON.parse(req.body.anonymousContact)
        : req.body.anonymousContact;
    }

    console.log('Parsed location:', location);
    console.log('Parsed anonymousContact:', anonymousContact);

    // Parse isAnonymous properly from FormData
    const parsedIsAnonymous = isAnonymous === 'true' || isAnonymous === true;
    
    // Generate complaintId manually (pre-save hook doesn't work with file storage)
    const year = new Date().getFullYear();
    let count;
    
    // Get count based on storage type
    if (isUsingFileStorage()) {
      count = fileStorage.count('complaints');
    } else {
      count = await Complaint.countDocuments();
    }
    
    const generatedComplaintId = `NGS${year}${String(count + 1).padStart(6, '0')}`;

    console.log('Generated complaintId:', generatedComplaintId);

    // Prepare complaint data
    const complaintData = {
      complaintId: generatedComplaintId,
      title,
      description,
      category,
      subCategory,
      location,
      expectedOutcome,
      contactPreference,
      isAnonymous: parsedIsAnonymous || !req.user, // Auto-anonymous if not logged in
      media: media || {},
      tags: tags || []
    };

    // Handle anonymous vs authenticated
    if (complaintData.isAnonymous) {
      complaintData.anonymousToken = generateAnonymousToken();
      complaintData.anonymousContact = anonymousContact;
      console.log('Creating anonymous complaint');
    } else if (req.user) {
      // Only set citizen if user is authenticated and not anonymous
      complaintData.citizen = req.user.id;
      console.log('Creating authenticated complaint for user:', req.user.id);
    } else {
      // If no user and not explicitly anonymous, throw error
      console.log('ERROR: No user and not anonymous');
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        message: 'You must be logged in to submit non-anonymous complaints'
      });
    }

    console.log('Creating complaint with data keys:', Object.keys(complaintData));

    // Create complaint using appropriate storage
    let complaint;
    if (isUsingFileStorage()) {
      complaint = fileStorage.create('complaints', complaintData);
      console.log('Complaint created in file storage:', complaint.complaintId);
    } else {
      complaint = await Complaint.create(complaintData);
      console.log('Complaint created in MongoDB:', complaint.complaintId);
    }

    // Call AI service for classification
    try {
      const aiResponse = await axios.post(`${process.env.AI_SERVICE_URL}/classify`, {
        title: complaint.title,
        description: complaint.description,
        category: complaint.category,
        location: complaint.location
      });

      // Update complaint with AI analysis
      const aiAnalysis = {
        predictedCategory: aiResponse.data.category,
        predictedDepartment: aiResponse.data.department,
        sentiment: aiResponse.data.sentiment,
        urgencyScore: aiResponse.data.urgency_score,
        summary: aiResponse.data.summary,
        keywords: aiResponse.data.keywords,
        confidence: aiResponse.data.confidence,
        abusiveLanguageDetected: aiResponse.data.abusive_detected || false,
        duplicateScore: aiResponse.data.duplicate_score || 0,
        similarComplaints: aiResponse.data.similar_complaints || [],
        processedAt: new Date()
      };

      // Set priority based on urgency score
      let priority = 'medium';
      if (aiResponse.data.urgency_score >= 80) {
        priority = 'critical';
      } else if (aiResponse.data.urgency_score >= 60) {
        priority = 'high';
      } else if (aiResponse.data.urgency_score >= 40) {
        priority = 'medium';
      } else {
        priority = 'low';
      }

      // Update complaint with AI data
      if (isUsingFileStorage()) {
        complaint.aiAnalysis = aiAnalysis;
        complaint.priority = priority;
        fileStorage.update('complaints', complaint._id, {
          aiAnalysis,
          priority
        });
      } else {
        complaint.aiAnalysis = aiAnalysis;
        complaint.priority = priority;

        // Find and assign department
        if (aiResponse.data.department) {
          const department = await Department.findOne({ 
            name: { $regex: aiResponse.data.department, $options: 'i' } 
          });
          if (department) {
            complaint.department = department._id;
          }
        }

        await complaint.save();
      }

    } catch (aiError) {
      console.error('AI service error:', aiError.message);
      // Continue without AI analysis
    }

    // Add status history
    const statusHistory = [{
      status: COMPLAINT_STATUS.SUBMITTED,
      remarks: 'Complaint submitted successfully',
      timestamp: new Date()
    }];

    if (isUsingFileStorage()) {
      complaint.statusHistory = statusHistory;
      fileStorage.update('complaints', complaint._id, { statusHistory });
    } else {
      complaint.statusHistory.push(statusHistory[0]);
      await complaint.save();
    }

    // Create chat for the complaint
    if (isUsingFileStorage()) {
      const chatParticipants = [];
      if (!parsedIsAnonymous && req.user) {
        chatParticipants.push({
          user: req.user.id,
          role: req.user.role
        });
      }

      fileStorage.create('chats', {
        complaint: complaint._id,
        participants: chatParticipants
      });
    } else {
      const chatParticipants = [];
      if (!parsedIsAnonymous && req.user) {
        chatParticipants.push({
          user: req.user.id,
          role: req.user.role
        });
      }

      await Chat.create({
        complaint: complaint._id,
        participants: chatParticipants
      });
    }

    // Send notification and email to citizen
    if (!parsedIsAnonymous && req.user) {
      // Create notification
      if (isUsingFileStorage()) {
        fileStorage.create('notifications', {
          recipient: req.user.id,
          type: NOTIFICATION_TYPES.COMPLAINT_SUBMITTED,
          title: 'Complaint Submitted',
          message: `Your complaint "${title}" has been submitted successfully`,
          data: {
            complaintId: complaint._id.toString(),
            complaintNumber: complaint.complaintId,
            status: complaint.status,
            link: `/complaints/${complaint._id}`
          }
        });
      } else {
        await Notification.create({
          recipient: req.user.id,
          type: NOTIFICATION_TYPES.COMPLAINT_SUBMITTED,
          title: 'Complaint Submitted',
          message: `Your complaint "${title}" has been submitted successfully`,
          data: {
            complaintId: complaint._id.toString(),
            complaintNumber: complaint.complaintId,
            status: complaint.status,
            link: `/complaints/${complaint._id}`
          }
        });
      }

      // Send email (optional, may fail if email service not configured)
      try {
        const emailContent = emailTemplates.complaintSubmitted(
          req.user.name,
          complaint.complaintId,
          complaint.title
        );
        await sendEmail({
          to: req.user.email,
          subject: emailContent.subject,
          html: emailContent.html,
          text: emailContent.text
        });
      } catch (emailError) {
        console.error('Email error:', emailError.message);
        // Continue without email
      }

      // Update user metadata
      if (isUsingFileStorage()) {
        const user = fileStorage.findById('users', req.user.id);
        if (user) {
          user.metadata = user.metadata || {};
          user.metadata.totalComplaints = (user.metadata.totalComplaints || 0) + 1;
          fileStorage.update('users', req.user.id, user);
        }
      } else {
        await User.findByIdAndUpdate(req.user.id, {
          $inc: { 'metadata.totalComplaints': 1 }
        });
      }
    }

    // Log audit (optional)
    try {
      if (isUsingFileStorage()) {
        fileStorage.create('auditLogs', {
          user: req.user?.id,
          action: 'complaint_created',
          entityType: 'complaint',
          entityId: complaint._id,
          metadata: {
            ip: req.ip,
            userAgent: req.get('user-agent')
          },
          description: `New complaint created: ${complaint.complaintId}`
        });
      } else {
        await AuditLog.create({
          user: req.user?.id,
          action: 'complaint_created',
          entityType: 'complaint',
          entityId: complaint._id,
          metadata: {
            ip: req.ip,
            userAgent: req.get('user-agent')
          },
          description: `New complaint created: ${complaint.complaintId}`
        });
      }
    } catch (auditError) {
      console.error('Audit log error:', auditError.message);
      // Continue without audit log
    }

    res.status(HTTP_STATUS.CREATED).json({
      success: true,
      message: 'Complaint submitted successfully',
      data: {
        complaint,
        trackingToken: parsedIsAnonymous ? complaint.anonymousToken : null
      }
    });

  } catch (error) {
    console.error('Submit complaint error:', error);
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get all complaints (with filters)
// @route   GET /api/complaints
// @access  Private (Officer, Admin)
export const getComplaints = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      status,
      priority,
      category,
      department,
      search,
      startDate,
      endDate,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    // Build query
    const query = {};

    // Role-based filtering
    if (req.user.role === USER_ROLES.OFFICER) {
      query.assignedOfficer = req.user.id;
    } else if (req.user.role === USER_ROLES.DEPARTMENT_ADMIN) {
      query.department = req.user.department;
    }

    if (status) query.status = status;
    if (priority) query.priority = priority;
    if (category) query.category = category;
    if (department) query.department = department;

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { complaintId: { $regex: search, $options: 'i' } }
      ];
    }

    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }

    // Pagination
    const { skip, limit: limitNum } = getPagination(page, limit);

    // Execute query
    const complaints = await Complaint.find(query)
      .populate('citizen', 'name email phone')
      .populate('department', 'name code')
      .populate('assignedOfficer', 'name email designation')
      .sort({ [sortBy]: sortOrder === 'desc' ? -1 : 1 })
      .skip(skip)
      .limit(limitNum);

    const total = await Complaint.countDocuments(query);

    res.status(HTTP_STATUS.OK).json({
      success: true,
      ...paginationResponse(complaints, total, page, limitNum)
    });

  } catch (error) {
    console.error('Get complaints error:', error);
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get single complaint
// @route   GET /api/complaints/:id
// @access  Public (with token for anonymous) / Private
export const getComplaint = async (req, res) => {
  try {
    const { id } = req.params;
    const { token } = req.query;

    const complaint = await Complaint.findById(id)
      .populate('citizen', 'name email phone avatar')
      .populate('department', 'name code contactEmail contactPhone')
      .populate('assignedOfficer', 'name email designation phone')
      .populate('statusHistory.updatedBy', 'name role')
      .populate('resolution.resolvedBy', 'name designation');

    if (!complaint) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({
        success: false,
        message: 'Complaint not found'
      });
    }

    // Check access permissions
    if (complaint.isAnonymous) {
      // Anonymous complaint - verify token
      if (token !== complaint.anonymousToken && req.user?.role !== USER_ROLES.SUPER_ADMIN) {
        return res.status(HTTP_STATUS.FORBIDDEN).json({
          success: false,
          message: 'Invalid access token'
        });
      }
    } else {
      // Non-anonymous - check user access
      if (req.user) {
        const hasAccess = 
          req.user.id === complaint.citizen?.toString() ||
          req.user.id === complaint.assignedOfficer?.toString() ||
          req.user.role === USER_ROLES.SUPER_ADMIN ||
          (req.user.role === USER_ROLES.DEPARTMENT_ADMIN && req.user.department?.toString() === complaint.department?.toString());

        if (!hasAccess) {
          return res.status(HTTP_STATUS.FORBIDDEN).json({
            success: false,
            message: 'Not authorized to view this complaint'
          });
        }
      } else {
        return res.status(HTTP_STATUS.UNAUTHORIZED).json({
          success: false,
          message: 'Authentication required'
        });
      }
    }

    // Increment view count
    complaint.views += 1;
    await complaint.save();

    res.status(HTTP_STATUS.OK).json({
      success: true,
      data: { complaint }
    });

  } catch (error) {
    console.error('Get complaint error:', error);
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get user's complaints
// @route   GET /api/complaints/user/my-complaints
// @access  Private (Citizen)
export const getMyComplaints = async (req, res) => {
  try {
    const { page = 1, limit = 20, status } = req.query;

    const query = { citizen: req.user.id };
    if (status) query.status = status;

    const { skip, limit: limitNum } = getPagination(page, limit);

    const complaints = await Complaint.find(query)
      .populate('department', 'name code')
      .populate('assignedOfficer', 'name designation')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    const total = await Complaint.countDocuments(query);

    res.status(HTTP_STATUS.OK).json({
      success: true,
      ...paginationResponse(complaints, total, page, limitNum)
    });

  } catch (error) {
    console.error('Get my complaints error:', error);
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update complaint status
// @route   PATCH /api/complaints/:id/status
// @access  Private (Officer, Admin)
export const updateComplaintStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, remarks } = req.body;

    const complaint = await Complaint.findById(id)
      .populate('citizen', 'name email')
      .populate('assignedOfficer', 'name');

    if (!complaint) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({
        success: false,
        message: 'Complaint not found'
      });
    }

    // Check authorization
    const canUpdate = 
      req.user.id === complaint.assignedOfficer?._id.toString() ||
      req.user.role === USER_ROLES.SUPER_ADMIN ||
      (req.user.role === USER_ROLES.DEPARTMENT_ADMIN && req.user.department?.toString() === complaint.department?.toString());

    if (!canUpdate) {
      return res.status(HTTP_STATUS.FORBIDDEN).json({
        success: false,
        message: 'Not authorized to update this complaint'
      });
    }

    const oldStatus = complaint.status;
    complaint.status = status;

    // Add to status history
    complaint.statusHistory.push({
      status,
      remarks,
      updatedBy: req.user.id,
      timestamp: new Date()
    });

    await complaint.save();

    // Send notification to citizen
    if (complaint.citizen) {
      await Notification.create({
        recipient: complaint.citizen._id,
        type: NOTIFICATION_TYPES.STATUS_UPDATED,
        title: 'Complaint Status Updated',
        message: `Your complaint "${complaint.title}" status changed to ${status}`,
        data: {
          complaintId: complaint._id.toString(),
          complaintNumber: complaint.complaintId,
          status: status,
          link: `/complaints/${complaint._id}`
        }
      });

      // Send email
      const emailContent = emailTemplates.statusUpdate(
        complaint.citizen.name,
        complaint.complaintId,
        oldStatus,
        status,
        remarks
      );
      await sendEmail({
        to: complaint.citizen.email,
        subject: emailContent.subject,
        html: emailContent.html,
        text: emailContent.text
      });
    }

    // Log audit
    await AuditLog.create({
      user: req.user.id,
      action: 'status_changed',
      entityType: 'complaint',
      entityId: complaint._id,
      changes: {
        before: { status: oldStatus },
        after: { status: status }
      },
      metadata: {
        ip: req.ip,
        userAgent: req.get('user-agent')
      },
      description: `Complaint ${complaint.complaintId} status changed from ${oldStatus} to ${status}`
    });

    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: 'Status updated successfully',
      data: { complaint }
    });

  } catch (error) {
    console.error('Update status error:', error);
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Assign complaint to officer
// @route   PATCH /api/complaints/:id/assign
// @access  Private (Department Admin, Super Admin)
export const assignComplaint = async (req, res) => {
  try {
    const { id } = req.params;
    const { officerId } = req.body;

    const complaint = await Complaint.findById(id);
    if (!complaint) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({
        success: false,
        message: 'Complaint not found'
      });
    }

    const officer = await User.findById(officerId);
    if (!officer || officer.role !== USER_ROLES.OFFICER) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        message: 'Invalid officer'
      });
    }

    complaint.assignedOfficer = officerId;
    complaint.status = COMPLAINT_STATUS.ASSIGNED;
    complaint.statusHistory.push({
      status: COMPLAINT_STATUS.ASSIGNED,
      remarks: `Assigned to ${officer.name}`,
      updatedBy: req.user.id,
      timestamp: new Date()
    });

    await complaint.save();

    // Add officer to chat
    const chat = await Chat.findOne({ complaint: complaint._id });
    if (chat) {
      chat.participants.push({
        user: officerId,
        role: USER_ROLES.OFFICER
      });
      await chat.save();
    }

    // Notify officer
    await Notification.create({
      recipient: officerId,
      type: NOTIFICATION_TYPES.COMPLAINT_ASSIGNED,
      title: 'New Complaint Assigned',
      message: `You have been assigned complaint "${complaint.title}"`,
      data: {
        complaintId: complaint._id.toString(),
        complaintNumber: complaint.complaintId,
        priority: complaint.priority,
        link: `/officer/complaints/${complaint._id}`
      }
    });

    // Send email to officer
    const emailContent = emailTemplates.officerAssignment(
      officer.name,
      complaint.complaintId,
      complaint.title,
      complaint.priority
    );
    await sendEmail({
      to: officer.email,
      subject: emailContent.subject,
      html: emailContent.html,
      text: emailContent.text
    });

    // Log audit
    await AuditLog.create({
      user: req.user.id,
      action: 'complaint_assigned',
      entityType: 'complaint',
      entityId: complaint._id,
      metadata: {
        ip: req.ip,
        userAgent: req.get('user-agent'),
        assignedTo: officerId
      },
      description: `Complaint ${complaint.complaintId} assigned to ${officer.name}`
    });

    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: 'Complaint assigned successfully',
      data: { complaint }
    });

  } catch (error) {
    console.error('Assign complaint error:', error);
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Add internal note
// @route   POST /api/complaints/:id/notes
// @access  Private (Officer, Admin)
export const addInternalNote = async (req, res) => {
  try {
    const { id } = req.params;
    const { note, isPrivate = true } = req.body;

    const complaint = await Complaint.findById(id);
    if (!complaint) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({
        success: false,
        message: 'Complaint not found'
      });
    }

    complaint.internalNotes.push({
      note,
      addedBy: req.user.id,
      isPrivate,
      timestamp: new Date()
    });

    await complaint.save();

    res.status(HTTP_STATUS.CREATED).json({
      success: true,
      message: 'Note added successfully',
      data: { complaint }
    });

  } catch (error) {
    console.error('Add note error:', error);
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get complaints heatmap data
// @route   GET /api/complaints/heatmap
// @access  Public
export const getHeatmapData = async (req, res) => {
  try {
    const { category, status, priority, startDate, endDate } = req.query;

    const query = {};
    if (category) query.category = category;
    if (status) query.status = status;
    if (priority) query.priority = priority;
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }

    const complaints = await Complaint.find(query)
      .select('location.coordinates complaintId title category priority status createdAt')
      .lean();

    const heatmapData = complaints.map(complaint => ({
      id: complaint._id,
      complaintId: complaint.complaintId,
      title: complaint.title,
      category: complaint.category,
      priority: complaint.priority,
      status: complaint.status,
      coordinates: complaint.location.coordinates,
      lat: complaint.location.coordinates[1],
      lng: complaint.location.coordinates[0],
      createdAt: complaint.createdAt
    }));

    res.status(HTTP_STATUS.OK).json({
      success: true,
      data: {
        complaints: heatmapData,
        total: heatmapData.length
      }
    });

  } catch (error) {
    console.error('Get heatmap error:', error);
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message
    });
  }
};

export default {
  submitComplaint,
  getComplaints,
  getComplaint,
  getMyComplaints,
  updateComplaintStatus,
  assignComplaint,
  addInternalNote,
  getHeatmapData
};


// @desc    Delete complaint (only if pending and owned by user)
// @route   DELETE /api/complaints/:id
// @access  Private (Citizen only)
export const deleteComplaint = async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({
        success: false,
        message: 'Complaint not found'
      });
    }

    // Check if user owns this complaint
    if (!complaint.citizen || complaint.citizen.toString() !== req.user.id) {
      return res.status(HTTP_STATUS.FORBIDDEN).json({
        success: false,
        message: 'You can only delete your own complaints'
      });
    }

    // Check if complaint is in pending status
    if (complaint.status !== COMPLAINT_STATUS.PENDING) {
      return res.status(HTTP_STATUS.FORBIDDEN).json({
        success: false,
        message: 'Only pending complaints can be deleted. This complaint has already been processed.'
      });
    }

    // Delete related data
    await Chat.deleteMany({ complaint: complaint._id });
    await Notification.deleteMany({ 
      relatedComplaint: complaint._id,
      recipient: req.user.id 
    });

    // Delete the complaint
    await complaint.deleteOne();

    // Create audit log
    await AuditLog.create({
      user: req.user.id,
      action: 'DELETE_COMPLAINT',
      entityType: 'Complaint',
      entityId: complaint._id,
      details: {
        complaintId: complaint.complaintId,
        title: complaint.title,
        category: complaint.category,
        reason: 'Deleted by user'
      }
    });

    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: 'Complaint deleted successfully'
    });

  } catch (error) {
    console.error('Delete complaint error:', error);
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Failed to delete complaint',
      error: error.message
    });
  }
};
