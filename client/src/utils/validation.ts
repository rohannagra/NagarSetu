// Email validation
export const isValidEmail = (email: string): boolean => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

// Phone validation (Indian format)
export const isValidPhone = (phone: string): boolean => {
  const cleaned = phone.replace(/\D/g, '');
  return /^[6-9]\d{9}$/.test(cleaned);
};

// Password validation
export const isValidPassword = (password: string): boolean => {
  // At least 6 characters
  return password.length >= 6;
};

// Pincode validation (Indian 6-digit)
export const isValidPincode = (pincode: string): boolean => {
  return /^\d{6}$/.test(pincode);
};

// File validation
export const validateFile = (
  file: File,
  allowedTypes: string[],
  maxSize: number
): { valid: boolean; error?: string } => {
  // Check file type
  if (!allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: `File type not allowed. Allowed types: ${allowedTypes.join(', ')}`,
    };
  }

  // Check file size
  if (file.size > maxSize) {
    const maxSizeMB = Math.round(maxSize / (1024 * 1024));
    return {
      valid: false,
      error: `File size exceeds ${maxSizeMB}MB limit`,
    };
  }

  return { valid: true };
};

// Coordinates validation
export const isValidCoordinates = (lat: number, lng: number): boolean => {
  return lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180;
};

// URL validation
export const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

// Required field validation
export const isRequired = (value: any): boolean => {
  if (value === null || value === undefined) return false;
  if (typeof value === 'string') return value.trim().length > 0;
  if (Array.isArray(value)) return value.length > 0;
  return true;
};

// Min length validation
export const minLength = (value: string, min: number): boolean => {
  return value.trim().length >= min;
};

// Max length validation
export const maxLength = (value: string, max: number): boolean => {
  return value.trim().length <= max;
};

// Number range validation
export const inRange = (value: number, min: number, max: number): boolean => {
  return value >= min && value <= max;
};
