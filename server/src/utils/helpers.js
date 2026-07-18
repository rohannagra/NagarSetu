import crypto from 'crypto';

// Generate random string
export const generateRandomString = (length = 32) => {
  return crypto.randomBytes(length).toString('hex');
};

// Generate anonymous tracking token
export const generateAnonymousToken = () => {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 15);
  return `ANO-${timestamp}-${random}`.toUpperCase();
};

// Calculate distance between two coordinates (Haversine formula)
export const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Earth's radius in km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  
  return distance; // in km
};

const toRad = (value) => {
  return (value * Math.PI) / 180;
};

// Format date to readable string
export const formatDate = (date, format = 'long') => {
  const options = {
    short: { year: 'numeric', month: '2-digit', day: '2-digit' },
    medium: { year: 'numeric', month: 'short', day: 'numeric' },
    long: { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }
  };
  
  return new Date(date).toLocaleString('en-IN', options[format] || options.long);
};

// Sanitize string for URLs
export const slugify = (text) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-');
};

// Mask email for privacy
export const maskEmail = (email) => {
  if (!email) return '';
  const [username, domain] = email.split('@');
  const maskedUsername = username[0] + '*'.repeat(username.length - 2) + username[username.length - 1];
  return `${maskedUsername}@${domain}`;
};

// Mask phone for privacy
export const maskPhone = (phone) => {
  if (!phone) return '';
  return phone.substring(0, 2) + '*'.repeat(phone.length - 4) + phone.substring(phone.length - 2);
};

// Pagination helper
export const getPagination = (page = 1, limit = 20) => {
  const pageNum = parseInt(page);
  const limitNum = parseInt(limit);
  
  const skip = (pageNum - 1) * limitNum;
  
  return {
    skip,
    limit: limitNum,
    page: pageNum
  };
};

// Build pagination response
export const paginationResponse = (data, total, page, limit) => {
  const totalPages = Math.ceil(total / limit);
  
  return {
    data,
    pagination: {
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1
    }
  };
};

// Check if coordinate is in India (approximate bounding box)
export const isInIndia = (lat, lng) => {
  // India's approximate bounding box
  const indiaBounds = {
    north: 35.5,
    south: 6.5,
    east: 97.5,
    west: 68.0
  };
  
  return (
    lat >= indiaBounds.south &&
    lat <= indiaBounds.north &&
    lng >= indiaBounds.west &&
    lng <= indiaBounds.east
  );
};

// Generate OTP
export const generateOTP = (length = 6) => {
  const digits = '0123456789';
  let otp = '';
  for (let i = 0; i < length; i++) {
    otp += digits[Math.floor(Math.random() * 10)];
  }
  return otp;
};

// Time difference in human readable format
export const timeDifference = (date) => {
  const now = new Date();
  const diff = now - new Date(date);
  
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const months = Math.floor(days / 30);
  const years = Math.floor(days / 365);
  
  if (years > 0) return `${years} year${years > 1 ? 's' : ''} ago`;
  if (months > 0) return `${months} month${months > 1 ? 's' : ''} ago`;
  if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
  if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  return 'Just now';
};

// Validate Indian pincode
export const isValidPincode = (pincode) => {
  return /^\d{6}$/.test(pincode);
};

// Validate Indian phone number
export const isValidIndianPhone = (phone) => {
  return /^[6-9]\d{9}$/.test(phone);
};

// Extract file extension
export const getFileExtension = (filename) => {
  return filename.slice((filename.lastIndexOf('.') - 1 >>> 0) + 2);
};

// Generate complaint receipt
export const generateComplaintReceipt = (complaint) => {
  return {
    receiptId: `RCP-${complaint.complaintId}`,
    complaintId: complaint.complaintId,
    title: complaint.title,
    category: complaint.category,
    status: complaint.status,
    submittedAt: complaint.createdAt,
    trackingUrl: `${process.env.CLIENT_URL}/complaints/${complaint.complaintId}`,
    generatedAt: new Date()
  };
};

export default {
  generateRandomString,
  generateAnonymousToken,
  calculateDistance,
  formatDate,
  slugify,
  maskEmail,
  maskPhone,
  getPagination,
  paginationResponse,
  isInIndia,
  generateOTP,
  timeDifference,
  isValidPincode,
  isValidIndianPhone,
  getFileExtension,
  generateComplaintReceipt
};
