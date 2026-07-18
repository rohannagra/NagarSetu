// User Roles
export const USER_ROLES = {
  CITIZEN: 'citizen',
  OFFICER: 'officer',
  DEPARTMENT_ADMIN: 'department_admin',
  SUPER_ADMIN: 'super_admin'
};

// Complaint Status
export const COMPLAINT_STATUS = {
  SUBMITTED: 'submitted',
  VERIFIED: 'verified',
  ASSIGNED: 'assigned',
  ACCEPTED: 'accepted',
  IN_PROGRESS: 'in_progress',
  WAITING_FOR_CITIZEN: 'waiting_for_citizen',
  RESOLVED: 'resolved',
  REJECTED: 'rejected',
  CLOSED: 'closed',
  ESCALATED: 'escalated'
};

// Complaint Priority
export const COMPLAINT_PRIORITY = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  CRITICAL: 'critical'
};

// Complaint Categories
export const COMPLAINT_CATEGORIES = {
  INFRASTRUCTURE: 'infrastructure',
  ROADS: 'roads',
  ELECTRICITY: 'electricity',
  WATER_SUPPLY: 'water_supply',
  SANITATION: 'sanitation',
  DRAINAGE: 'drainage',
  STREET_LIGHTS: 'street_lights',
  GARBAGE: 'garbage',
  PUBLIC_TRANSPORT: 'public_transport',
  FIRE: 'fire',
  POLICE: 'police',
  HEALTH: 'health',
  BUILDING: 'building',
  REVENUE: 'revenue',
  CORRUPTION: 'corruption',
  NOISE_POLLUTION: 'noise_pollution',
  AIR_POLLUTION: 'air_pollution',
  ILLEGAL_CONSTRUCTION: 'illegal_construction',
  ENCROACHMENT: 'encroachment',
  PARKS_GARDENS: 'parks_gardens',
  OTHER: 'other'
};

// Departments
export const DEPARTMENTS = {
  PWD: 'Public Works Department',
  ELECTRICITY_BOARD: 'Electricity Board',
  WATER_WORKS: 'Water Works Department',
  HEALTH_SANITATION: 'Health & Sanitation',
  TRANSPORT: 'Transport Department',
  MUNICIPAL_CORPORATION: 'Municipal Corporation',
  POLICE: 'Police Department',
  POLLUTION_CONTROL: 'Pollution Control Board'
};

// Notification Types
export const NOTIFICATION_TYPES = {
  COMPLAINT_SUBMITTED: 'complaint_submitted',
  COMPLAINT_ASSIGNED: 'complaint_assigned',
  COMPLAINT_ACCEPTED: 'complaint_accepted',
  STATUS_UPDATED: 'status_updated',
  COMPLAINT_RESOLVED: 'complaint_resolved',
  COMPLAINT_ESCALATED: 'complaint_escalated',
  NEW_MESSAGE: 'new_message',
  OFFICER_REPLY: 'officer_reply'
};

// Escalation Levels
export const ESCALATION_LEVELS = {
  OFFICER: 'officer',
  DEPARTMENT_HEAD: 'department_head',
  DISTRICT_OFFICER: 'district_officer',
  SUPER_ADMIN: 'super_admin'
};

// File Upload Settings
export const FILE_SETTINGS = {
  MAX_SIZE: 10 * 1024 * 1024, // 10MB
  MAX_FILES: 5,
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/jpg'],
  ALLOWED_VIDEO_TYPES: ['video/mp4', 'video/mpeg'],
  ALLOWED_DOCUMENT_TYPES: ['application/pdf']
};

// Sentiment
export const SENTIMENT = {
  POSITIVE: 'positive',
  NEGATIVE: 'negative',
  NEUTRAL: 'neutral'
};

// Contact Preference
export const CONTACT_PREFERENCE = {
  EMAIL: 'email',
  PHONE: 'phone',
  SMS: 'sms',
  IN_APP: 'in_app'
};

// States of India
export const INDIAN_STATES = [
  'Andhra Pradesh',
  'Arunachal Pradesh',
  'Assam',
  'Bihar',
  'Chhattisgarh',
  'Goa',
  'Gujarat',
  'Haryana',
  'Himachal Pradesh',
  'Jharkhand',
  'Karnataka',
  'Kerala',
  'Madhya Pradesh',
  'Maharashtra',
  'Manipur',
  'Meghalaya',
  'Mizoram',
  'Nagaland',
  'Odisha',
  'Punjab',
  'Rajasthan',
  'Sikkim',
  'Tamil Nadu',
  'Telangana',
  'Tripura',
  'Uttar Pradesh',
  'Uttarakhand',
  'West Bengal',
  'Andaman and Nicobar Islands',
  'Chandigarh',
  'Dadra and Nagar Haveli and Daman and Diu',
  'Delhi',
  'Jammu and Kashmir',
  'Ladakh',
  'Lakshadweep',
  'Puducherry'
];

// Socket Events
export const SOCKET_EVENTS = {
  CONNECTION: 'connection',
  DISCONNECT: 'disconnect',
  JOIN_ROOM: 'join_room',
  LEAVE_ROOM: 'leave_room',
  NEW_COMPLAINT: 'new_complaint',
  COMPLAINT_UPDATE: 'complaint_update',
  NEW_MESSAGE: 'new_message',
  TYPING: 'typing',
  NOTIFICATION: 'notification',
  STATUS_CHANGE: 'status_change'
};

// HTTP Status Codes
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500
};

// Error Messages
export const ERROR_MESSAGES = {
  INVALID_CREDENTIALS: 'Invalid email or password',
  UNAUTHORIZED: 'Not authorized to access this resource',
  USER_NOT_FOUND: 'User not found',
  COMPLAINT_NOT_FOUND: 'Complaint not found',
  INVALID_TOKEN: 'Invalid or expired token',
  EMAIL_ALREADY_EXISTS: 'Email already registered',
  WEAK_PASSWORD: 'Password must be at least 8 characters with uppercase, lowercase, number and special character',
  FILE_TOO_LARGE: 'File size exceeds maximum limit',
  INVALID_FILE_TYPE: 'Invalid file type',
  SERVER_ERROR: 'Internal server error'
};

export default {
  USER_ROLES,
  COMPLAINT_STATUS,
  COMPLAINT_PRIORITY,
  COMPLAINT_CATEGORIES,
  DEPARTMENTS,
  NOTIFICATION_TYPES,
  ESCALATION_LEVELS,
  FILE_SETTINGS,
  SENTIMENT,
  CONTACT_PREFERENCE,
  INDIAN_STATES,
  SOCKET_EVENTS,
  HTTP_STATUS,
  ERROR_MESSAGES
};
