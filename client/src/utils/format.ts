import { format, formatDistanceToNow, parseISO } from 'date-fns';

// Format date
export const formatDate = (date: string | Date, formatStr: string = 'MMM dd, yyyy'): string => {
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    return format(dateObj, formatStr);
  } catch (error) {
    return 'Invalid date';
  }
};

// Format relative time
export const formatRelativeTime = (date: string | Date): string => {
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    return formatDistanceToNow(dateObj, { addSuffix: true });
  } catch (error) {
    return 'Invalid date';
  }
};

// Format file size
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
};

// Format phone number
export const formatPhoneNumber = (phone: string): string => {
  // Remove all non-numeric characters
  const cleaned = phone.replace(/\D/g, '');
  
  // Format as XXX-XXX-XXXX
  if (cleaned.length === 10) {
    return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
  }
  
  return phone;
};

// Mask email
export const maskEmail = (email: string): string => {
  if (!email) return '';
  const [username, domain] = email.split('@');
  if (!username || !domain) return email;
  
  const maskedUsername = username[0] + '*'.repeat(username.length - 2) + username[username.length - 1];
  return `${maskedUsername}@${domain}`;
};

// Mask phone
export const maskPhone = (phone: string): string => {
  if (!phone) return '';
  const cleaned = phone.replace(/\D/g, '');
  
  if (cleaned.length >= 4) {
    return cleaned.slice(0, 2) + '*'.repeat(cleaned.length - 4) + cleaned.slice(-2);
  }
  
  return phone;
};

// Capitalize first letter
export const capitalize = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

// Convert snake_case to Title Case
export const snakeToTitle = (str: string): string => {
  return str
    .split('_')
    .map(word => capitalize(word))
    .join(' ');
};

// Truncate text
export const truncate = (text: string, length: number = 100): string => {
  if (text.length <= length) return text;
  return text.slice(0, length) + '...';
};

// Format number with commas
export const formatNumber = (num: number): string => {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

// Calculate percentage
export const calculatePercentage = (value: number, total: number): number => {
  if (total === 0) return 0;
  return Math.round((value / total) * 100);
};
