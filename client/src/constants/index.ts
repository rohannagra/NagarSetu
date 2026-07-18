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
  ESCALATED: 'escalated',
} as const;

// Status Colors
export const STATUS_COLORS = {
  submitted: { bg: 'bg-blue-100', text: 'text-blue-800', dark: 'dark:bg-blue-900/30 dark:text-blue-300' },
  verified: { bg: 'bg-cyan-100', text: 'text-cyan-800', dark: 'dark:bg-cyan-900/30 dark:text-cyan-300' },
  assigned: { bg: 'bg-purple-100', text: 'text-purple-800', dark: 'dark:bg-purple-900/30 dark:text-purple-300' },
  accepted: { bg: 'bg-indigo-100', text: 'text-indigo-800', dark: 'dark:bg-indigo-900/30 dark:text-indigo-300' },
  in_progress: { bg: 'bg-yellow-100', text: 'text-yellow-800', dark: 'dark:bg-yellow-900/30 dark:text-yellow-300' },
  waiting_for_citizen: { bg: 'bg-orange-100', text: 'text-orange-800', dark: 'dark:bg-orange-900/30 dark:text-orange-300' },
  resolved: { bg: 'bg-green-100', text: 'text-green-800', dark: 'dark:bg-green-900/30 dark:text-green-300' },
  rejected: { bg: 'bg-red-100', text: 'text-red-800', dark: 'dark:bg-red-900/30 dark:text-red-300' },
  closed: { bg: 'bg-gray-100', text: 'text-gray-800', dark: 'dark:bg-gray-700/30 dark:text-gray-300' },
  escalated: { bg: 'bg-red-100', text: 'text-red-800', dark: 'dark:bg-red-900/30 dark:text-red-300' },
};

// Priority Colors
export const PRIORITY_COLORS = {
  low: { bg: 'bg-gray-100', text: 'text-gray-800', dark: 'dark:bg-gray-700/30 dark:text-gray-300' },
  medium: { bg: 'bg-blue-100', text: 'text-blue-800', dark: 'dark:bg-blue-900/30 dark:text-blue-300' },
  high: { bg: 'bg-orange-100', text: 'text-orange-800', dark: 'dark:bg-orange-900/30 dark:text-orange-300' },
  critical: { bg: 'bg-red-100', text: 'text-red-800', dark: 'dark:bg-red-900/30 dark:text-red-300' },
};

// Categories
export const COMPLAINT_CATEGORIES = [
  { value: 'infrastructure', label: 'Road and Transport', icon: '🛣️' },
  { value: 'electricity', label: 'Electricity Department', icon: '⚡' },
  { value: 'water_supply', label: 'Water Supply Department', icon: '💧' },
  { value: 'sanitation', label: 'Sanitation Department', icon: '🚽' },
  { value: 'drainage', label: 'Drainage and Sewerage', icon: '🌊' },
  { value: 'street_lights', label: 'Street Lighting Department', icon: '💡' },
  { value: 'garbage', label: 'Solid Waste Management', icon: '🗑️' },
  { value: 'public_transport', label: 'Transport Department', icon: '🚌' },
  { value: 'fire', label: 'Fire Department', icon: '🚒' },
  { value: 'police', label: 'Police Department', icon: '👮' },
  { value: 'health', label: 'Health Department', icon: '🏥' },
  { value: 'building', label: 'Building Department', icon: '🏛️' },
  { value: 'revenue', label: 'Revenue Department', icon: '💰' },
  { value: 'corruption', label: 'Anti-Corruption Bureau', icon: '⚖️' },
  { value: 'noise_pollution', label: 'Pollution Control Board', icon: '🔊' },
  { value: 'air_pollution', label: 'Environment Department', icon: '🏭' },
  { value: 'illegal_construction', label: 'Town Planning Authority', icon: '🏗️' },
  { value: 'encroachment', label: 'Municipal Enforcement', icon: '🚧' },
  { value: 'parks_gardens', label: 'Parks and Gardens Department', icon: '🌳' },
  { value: 'other', label: 'General Administration', icon: '📋' },
];

// Indian States
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
  'Puducherry',
];

// Contact Preferences
export const CONTACT_PREFERENCES = [
  { value: 'email', label: 'Email' },
  { value: 'phone', label: 'Phone' },
  { value: 'sms', label: 'SMS' },
  { value: 'in_app', label: 'In-App Notification' },
];

// File Upload Limits
export const FILE_LIMITS = {
  MAX_SIZE: 10 * 1024 * 1024, // 10MB
  MAX_FILES: 5,
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/jpg'],
  ALLOWED_VIDEO_TYPES: ['video/mp4', 'video/mpeg'],
  ALLOWED_DOCUMENT_TYPES: ['application/pdf'],
};

// API Configuration
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api',
  SOCKET_URL: import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000',
  AI_SERVICE_URL: import.meta.env.VITE_AI_SERVICE_URL || 'http://localhost:8000',
};

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 20,
  LIMITS: [10, 20, 50, 100],
};

// Date Formats
export const DATE_FORMATS = {
  DISPLAY: 'MMM dd, yyyy',
  DISPLAY_WITH_TIME: 'MMM dd, yyyy hh:mm a',
  API: 'yyyy-MM-dd',
  FULL: 'MMMM dd, yyyy hh:mm:ss a',
};

// Map Configuration
export const MAP_CONFIG = {
  DEFAULT_CENTER: [20.5937, 78.9629] as [number, number], // India center
  DEFAULT_ZOOM: 5,
  MARKER_ZOOM: 15,
};
