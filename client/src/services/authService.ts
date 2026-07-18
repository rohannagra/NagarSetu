import api from './api';
import { LoginCredentials, RegisterData, AuthResponse, User } from '../types/auth';

const authService = {
  // Register new user
  register: async (data: RegisterData) => {
    const response = await api.post<AuthResponse>('/auth/register', data);
    return response.data;
  },

  // Login user
  login: async (credentials: LoginCredentials) => {
    const response = await api.post<AuthResponse>('/auth/login', credentials);
    return response.data;
  },

  // Get current user
  getMe: async () => {
    const response = await api.get<{ success: boolean; data: { user: User } }>('/auth/me');
    return response.data;
  },

  // Logout user
  logout: async () => {
    const response = await api.post('/auth/logout');
    return response.data;
  },

  // Refresh token
  refreshToken: async (refreshToken: string) => {
    const response = await api.post('/auth/refresh', { refreshToken });
    return response.data;
  },

  // Forgot password
  forgotPassword: async (email: string) => {
    const response = await api.post('/auth/forgot-password', { email });
    return response.data;
  },

  // Reset password
  resetPassword: async (token: string, password: string) => {
    const response = await api.post('/auth/reset-password', { token, password });
    return response.data;
  },

  // Update profile
  updateProfile: async (data: Partial<User>) => {
    const response = await api.put<{ success: boolean; data: { user: User } }>('/auth/profile', data);
    return response.data;
  },

  // Change password
  changePassword: async (currentPassword: string, newPassword: string) => {
    const response = await api.put('/auth/change-password', {
      currentPassword,
      newPassword,
    });
    return response.data;
  },
};

export default authService;
