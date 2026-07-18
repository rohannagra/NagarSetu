export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'citizen' | 'officer' | 'department_admin' | 'super_admin';
  phone?: string;
  avatar?: string;
  address?: {
    street?: string;
    city?: string;
    district?: string;
    state?: string;
    pincode?: string;
  };
  department?: {
    _id: string;
    name: string;
    code: string;
  };
  isEmailVerified: boolean;
  isActive: boolean;
  metadata?: {
    totalComplaints: number;
    resolvedComplaints: number;
    averageResolutionTime: number;
  };
  createdAt: string;
  updatedAt: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  phone?: string;
  address?: {
    city?: string;
    district?: string;
    state?: string;
    pincode?: string;
  };
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
    accessToken: string;
    refreshToken: string;
  };
}
