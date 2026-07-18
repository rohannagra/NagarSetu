export interface Complaint {
  _id: string;
  complaintId: string;
  title: string;
  description: string;
  category: string;
  subCategory?: string;
  status: ComplaintStatus;
  priority: ComplaintPriority;
  citizen?: {
    _id: string;
    name: string;
    email: string;
    phone?: string;
    avatar?: string;
  };
  isAnonymous: boolean;
  anonymousToken?: string;
  location: {
    coordinates: [number, number];
    address: string;
    district: string;
    state: string;
    pincode?: string;
    landmark?: string;
  };
  department?: {
    _id: string;
    name: string;
    code: string;
    contactEmail: string;
    contactPhone: string;
  };
  assignedOfficer?: {
    _id: string;
    name: string;
    email: string;
    designation: string;
    phone?: string;
  };
  media?: {
    images?: Array<{
      url: string;
      caption?: string;
      uploadedAt: string;
    }>;
    videos?: Array<{
      url: string;
      caption?: string;
      uploadedAt: string;
    }>;
    documents?: Array<{
      url: string;
      filename: string;
      uploadedAt: string;
    }>;
  };
  aiAnalysis?: {
    predictedCategory: string;
    predictedDepartment: string;
    sentiment: 'positive' | 'negative' | 'neutral';
    urgencyScore: number;
    summary: string;
    keywords: string[];
    confidence: number;
    abusiveLanguageDetected: boolean;
    duplicateScore: number;
    similarComplaints: any[];
    processedAt: string;
  };
  statusHistory: Array<{
    status: string;
    remarks?: string;
    updatedBy?: {
      _id: string;
      name: string;
      role: string;
    };
    timestamp: string;
  }>;
  internalNotes?: Array<{
    note: string;
    addedBy: {
      _id: string;
      name: string;
    };
    timestamp: string;
    isPrivate: boolean;
  }>;
  resolution?: {
    description: string;
    resolvedBy: {
      _id: string;
      name: string;
      designation: string;
    };
    resolvedAt: string;
    media?: {
      images?: string[];
      documents?: string[];
    };
    citizenSatisfaction?: {
      rating: number;
      feedback: string;
      submittedAt: string;
    };
  };
  timeTracking: {
    submittedAt: string;
    verifiedAt?: string;
    assignedAt?: string;
    acceptedAt?: string;
    inProgressAt?: string;
    resolvedAt?: string;
    closedAt?: string;
    totalResolutionTime?: number;
  };
  views: number;
  createdAt: string;
  updatedAt: string;
}

export type ComplaintStatus =
  | 'submitted'
  | 'verified'
  | 'assigned'
  | 'accepted'
  | 'in_progress'
  | 'waiting_for_citizen'
  | 'resolved'
  | 'rejected'
  | 'closed'
  | 'escalated';

export type ComplaintPriority = 'low' | 'medium' | 'high' | 'critical';

export type ComplaintCategory =
  | 'roads'
  | 'electricity'
  | 'water_supply'
  | 'sanitation'
  | 'drainage'
  | 'street_lights'
  | 'garbage'
  | 'public_transport'
  | 'corruption'
  | 'noise_pollution'
  | 'air_pollution'
  | 'illegal_construction'
  | 'encroachment'
  | 'parks_gardens'
  | 'other';

export interface ComplaintFilters {
  page?: number;
  limit?: number;
  status?: ComplaintStatus;
  priority?: ComplaintPriority;
  category?: ComplaintCategory;
  department?: string;
  search?: string;
  startDate?: string;
  endDate?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface ComplaintSubmitData {
  title: string;
  description: string;
  category: string;
  subCategory?: string;
  location: {
    coordinates: [number, number];
    address: string;
    district: string;
    state: string;
    pincode?: string;
    landmark?: string;
  };
  expectedOutcome?: string;
  contactPreference?: 'email' | 'phone' | 'sms' | 'in_app';
  isAnonymous?: boolean;
  anonymousContact?: {
    email?: string;
    phone?: string;
  };
  tags?: string[];
}
