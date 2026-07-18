import api from './api';
import { Complaint, ComplaintFilters, ComplaintSubmitData } from '../types/complaint';

interface ComplaintResponse {
  success: boolean;
  message: string;
  data: {
    complaint: Complaint;
    trackingToken?: string;
  };
}

interface ComplaintsListResponse {
  success: boolean;
  data: Complaint[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

interface HeatmapResponse {
  success: boolean;
  data: {
    complaints: any[];
    total: number;
  };
}

const complaintService = {
  // Submit new complaint
  submitComplaint: async (data: FormData | ComplaintSubmitData) => {
    const response = await api.post<ComplaintResponse>('/complaints', data, {
      headers: data instanceof FormData ? { 'Content-Type': 'multipart/form-data' } : {},
    });
    return response.data;
  },

  // Get all complaints with filters
  getComplaints: async (filters: ComplaintFilters = {}) => {
    const response = await api.get<ComplaintsListResponse>('/complaints', {
      params: filters,
    });
    return response.data;
  },

  // Get user's complaints
  getMyComplaints: async (filters: ComplaintFilters = {}) => {
    const response = await api.get<ComplaintsListResponse>('/complaints/user/my-complaints', {
      params: filters,
    });
    return response.data;
  },

  // Get single complaint by ID
  getComplaintById: async (id: string, token?: string) => {
    const response = await api.get<{ success: boolean; data: { complaint: Complaint } }>(
      `/complaints/${id}`,
      { params: token ? { token } : {} }
    );
    return response.data;
  },

  // Update complaint status
  updateStatus: async (id: string, status: string, remarks?: string) => {
    const response = await api.patch<ComplaintResponse>(`/complaints/${id}/status`, {
      status,
      remarks,
    });
    return response.data;
  },

  // Assign complaint to officer
  assignComplaint: async (id: string, officerId: string) => {
    const response = await api.patch<ComplaintResponse>(`/complaints/${id}/assign`, {
      officerId,
    });
    return response.data;
  },

  // Add internal note
  addInternalNote: async (id: string, note: string, isPrivate: boolean = true) => {
    const response = await api.post<ComplaintResponse>(`/complaints/${id}/notes`, {
      note,
      isPrivate,
    });
    return response.data;
  },

  // Get heatmap data
  getHeatmapData: async (filters: any = {}) => {
    const response = await api.get<HeatmapResponse>('/complaints/heatmap', {
      params: filters,
    });
    return response.data;
  },

  // Track complaint by ID (public)
  trackComplaint: async (complaintId: string, token?: string) => {
    const response = await api.get<{ success: boolean; data: { complaint: Complaint } }>(
      `/complaints/track/${complaintId}`,
      { params: token ? { token } : {} }
    );
    return response.data;
  },

  // Delete complaint (only pending complaints)
  deleteComplaint: async (id: string) => {
    const response = await api.delete<{ success: boolean; message: string }>(
      `/complaints/${id}`
    );
    return response.data;
  },
};

export default complaintService;
