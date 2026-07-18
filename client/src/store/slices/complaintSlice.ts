import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import complaintService from '../../services/complaintService';
import { Complaint, ComplaintFilters } from '../../types/complaint';

interface ComplaintState {
  complaints: Complaint[];
  selectedComplaint: Complaint | null;
  heatmapData: any[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  isLoading: boolean;
  error: string | null;
}

const initialState: ComplaintState = {
  complaints: [],
  selectedComplaint: null,
  heatmapData: [],
  total: 0,
  page: 1,
  limit: 20,
  totalPages: 0,
  isLoading: false,
  error: null,
};

// Async thunks
export const fetchComplaints = createAsyncThunk(
  'complaints/fetchComplaints',
  async (filters: ComplaintFilters = {}, { rejectWithValue }) => {
    try {
      const response = await complaintService.getComplaints(filters);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch complaints');
    }
  }
);

export const fetchMyComplaints = createAsyncThunk(
  'complaints/fetchMyComplaints',
  async (filters: ComplaintFilters = {}, { rejectWithValue }) => {
    try {
      const response = await complaintService.getMyComplaints(filters);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch complaints');
    }
  }
);

export const fetchComplaintById = createAsyncThunk(
  'complaints/fetchComplaintById',
  async ({ id, token }: { id: string; token?: string }, { rejectWithValue }) => {
    try {
      const response = await complaintService.getComplaintById(id, token);
      return response.data.complaint;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch complaint');
    }
  }
);

export const submitComplaint = createAsyncThunk(
  'complaints/submitComplaint',
  async (data: any, { rejectWithValue }) => {
    try {
      const response = await complaintService.submitComplaint(data);
      return response.data.complaint;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to submit complaint');
    }
  }
);

export const updateComplaintStatus = createAsyncThunk(
  'complaints/updateStatus',
  async ({ id, status, remarks }: { id: string; status: string; remarks?: string }, { rejectWithValue }) => {
    try {
      const response = await complaintService.updateStatus(id, status, remarks);
      return response.data.complaint;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update status');
    }
  }
);

export const assignComplaint = createAsyncThunk(
  'complaints/assign',
  async ({ id, officerId }: { id: string; officerId: string }, { rejectWithValue }) => {
    try {
      const response = await complaintService.assignComplaint(id, officerId);
      return response.data.complaint;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to assign complaint');
    }
  }
);

export const fetchHeatmapData = createAsyncThunk(
  'complaints/fetchHeatmapData',
  async (filters: any = {}, { rejectWithValue }) => {
    try {
      const response = await complaintService.getHeatmapData(filters);
      return response.data.complaints;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch heatmap data');
    }
  }
);

const complaintSlice = createSlice({
  name: 'complaints',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setSelectedComplaint: (state, action: PayloadAction<Complaint | null>) => {
      state.selectedComplaint = action.payload;
    },
    clearComplaints: (state) => {
      state.complaints = [];
      state.total = 0;
      state.page = 1;
    },
  },
  extraReducers: (builder) => {
    // Fetch Complaints
    builder
      .addCase(fetchComplaints.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchComplaints.fulfilled, (state, action) => {
        state.complaints = action.payload.data;
        state.total = action.payload.pagination.total;
        state.page = action.payload.pagination.page;
        state.limit = action.payload.pagination.limit;
        state.totalPages = action.payload.pagination.totalPages;
        state.isLoading = false;
      })
      .addCase(fetchComplaints.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Fetch My Complaints
    builder
      .addCase(fetchMyComplaints.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchMyComplaints.fulfilled, (state, action) => {
        state.complaints = action.payload.data;
        state.total = action.payload.pagination.total;
        state.page = action.payload.pagination.page;
        state.limit = action.payload.pagination.limit;
        state.totalPages = action.payload.pagination.totalPages;
        state.isLoading = false;
      })
      .addCase(fetchMyComplaints.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Fetch Complaint By ID
    builder
      .addCase(fetchComplaintById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchComplaintById.fulfilled, (state, action) => {
        state.selectedComplaint = action.payload;
        state.isLoading = false;
      })
      .addCase(fetchComplaintById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Submit Complaint
    builder
      .addCase(submitComplaint.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(submitComplaint.fulfilled, (state, action) => {
        state.complaints.unshift(action.payload);
        state.isLoading = false;
      })
      .addCase(submitComplaint.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Update Status
    builder
      .addCase(updateComplaintStatus.fulfilled, (state, action) => {
        const index = state.complaints.findIndex(c => c._id === action.payload._id);
        if (index !== -1) {
          state.complaints[index] = action.payload;
        }
        if (state.selectedComplaint?._id === action.payload._id) {
          state.selectedComplaint = action.payload;
        }
      });

    // Assign Complaint
    builder
      .addCase(assignComplaint.fulfilled, (state, action) => {
        const index = state.complaints.findIndex(c => c._id === action.payload._id);
        if (index !== -1) {
          state.complaints[index] = action.payload;
        }
        if (state.selectedComplaint?._id === action.payload._id) {
          state.selectedComplaint = action.payload;
        }
      });

    // Fetch Heatmap Data
    builder
      .addCase(fetchHeatmapData.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchHeatmapData.fulfilled, (state, action) => {
        state.heatmapData = action.payload;
        state.isLoading = false;
      })
      .addCase(fetchHeatmapData.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError, setSelectedComplaint, clearComplaints } = complaintSlice.actions;
export default complaintSlice.reducer;
