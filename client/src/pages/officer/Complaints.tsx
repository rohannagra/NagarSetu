import { FC, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Search,
  Filter,
  Calendar,
  MapPin,
  Eye,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  XCircle,
  Clock,
} from 'lucide-react';
import toast from 'react-hot-toast';

import Card from '../../components/Card';
import Badge from '../../components/Badge';
import Button from '../../components/Button';
import Input from '../../components/Input';
import LoadingSpinner from '../../components/LoadingSpinner';
import Modal from '../../components/Modal';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { fetchMyComplaints } from '../../store/slices/complaintSlice';
import { STATUS_COLORS, PRIORITY_COLORS, COMPLAINT_CATEGORIES, COMPLAINT_STATUS } from '../../constants';
import { formatDate, formatRelativeTime } from '../../utils/format';
import { useDebounce } from '../../hooks/useDebounce';
import api from '../../services/api';

const OfficerComplaints: FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { complaints, isLoading, total, page, totalPages } = useAppSelector(
    state => state.complaints
  );

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [categoryFilter, setCategoryFilter] = useState<string>('');
  const [priorityFilter, setPriorityFilter] = useState<string>('');
  const [showFilters, setShowFilters] = useState(false);

  // Status Update Modal
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [selectedComplaint, setSelectedComplaint] = useState<any>(null);
  const [newStatus, setNewStatus] = useState('');
  const [statusRemarks, setStatusRemarks] = useState('');
  const [updatingStatus, setUpdatingStatus] = useState(false);

  const debouncedSearch = useDebounce(searchQuery, 500);

  useEffect(() => {
    loadComplaints();
  }, [debouncedSearch, statusFilter, categoryFilter, priorityFilter, page]);

  const loadComplaints = async () => {
    try {
      // For officer, we fetch all complaints (they see assigned ones via backend filter)
      const response = await api.get('/complaints', {
        params: {
          search: debouncedSearch,
          status: statusFilter,
          category: categoryFilter,
          priority: priorityFilter,
          page,
          limit: 20,
        },
      });

      // Update the store manually since we're using a custom endpoint
      dispatch({
        type: 'complaints/setComplaints',
        payload: response.data,
      });
    } catch (error) {
      toast.error('Failed to load complaints');
    }
  };

  const handlePageChange = (newPage: number) => {
    dispatch(
      fetchMyComplaints({
        search: debouncedSearch,
        status: statusFilter as any,
        category: categoryFilter as any,
        priority: priorityFilter as any,
        page: newPage,
        limit: 20,
      })
    );
  };

  const clearFilters = () => {
    setSearchQuery('');
    setStatusFilter('');
    setCategoryFilter('');
    setPriorityFilter('');
  };

  const openStatusModal = (complaint: any, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedComplaint(complaint);
    setNewStatus(complaint.status);
    setStatusRemarks('');
    setShowStatusModal(true);
  };

  const handleStatusUpdate = async () => {
    if (!selectedComplaint || !newStatus) return;

    if (!statusRemarks.trim()) {
      toast.error('Please provide remarks for the status update');
      return;
    }

    setUpdatingStatus(true);
    try {
      await api.patch(`/complaints/${selectedComplaint._id}/status`, {
        status: newStatus,
        remarks: statusRemarks,
      });

      toast.success('Status updated successfully');
      setShowStatusModal(false);
      loadComplaints();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update status');
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleAccept = async (complaintId: string, e: React.MouseEvent) => {
    e.stopPropagation();

    try {
      await api.patch(`/complaints/${complaintId}/status`, {
        status: 'accepted',
        remarks: 'Complaint accepted by officer',
      });

      toast.success('Complaint accepted');
      loadComplaints();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to accept complaint');
    }
  };

  const handleReject = async (complaintId: string, e: React.MouseEvent) => {
    e.stopPropagation();

    const reason = window.prompt('Please provide a reason for rejection:');
    if (!reason) return;

    try {
      await api.patch(`/complaints/${complaintId}/status`, {
        status: 'rejected',
        remarks: reason,
      });

      toast.success('Complaint rejected');
      loadComplaints();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to reject complaint');
    }
  };

  const hasActiveFilters = searchQuery || statusFilter || categoryFilter || priorityFilter;

  return (
    <div className="max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Assigned Complaints
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Manage and resolve complaints assigned to you
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              icon={<RefreshCw className="w-4 h-4" />}
              onClick={loadComplaints}
            >
              Refresh
            </Button>
          </div>
        </div>

        {/* Search and Filters */}
        <Card className="mb-6">
          <div className="space-y-4">
            {/* Search Bar */}
            <div className="flex flex-col md:flex-row gap-3">
              <div className="flex-1">
                <Input
                  placeholder="Search by title, ID, or description..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  icon={<Search className="w-5 h-5" />}
                />
              </div>

              <Button
                variant="outline"
                icon={<Filter className="w-4 h-4" />}
                onClick={() => setShowFilters(!showFilters)}
              >
                Filters
                {hasActiveFilters && (
                  <Badge variant="primary" className="ml-2">
                    Active
                  </Badge>
                )}
              </Button>
            </div>

            {/* Filter Options */}
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-gray-200 dark:border-gray-700"
              >
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Status
                  </label>
                  <select
                    value={statusFilter}
                    onChange={e => setStatusFilter(e.target.value)}
                    className="input"
                  >
                    <option value="">All Statuses</option>
                    {Object.entries(COMPLAINT_STATUS).map(([key, value]) => (
                      <option key={value} value={value}>
                        {key.replace(/_/g, ' ')}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Category
                  </label>
                  <select
                    value={categoryFilter}
                    onChange={e => setCategoryFilter(e.target.value)}
                    className="input"
                  >
                    <option value="">All Categories</option>
                    {COMPLAINT_CATEGORIES.map(cat => (
                      <option key={cat.value} value={cat.value}>
                        {cat.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Priority
                  </label>
                  <select
                    value={priorityFilter}
                    onChange={e => setPriorityFilter(e.target.value)}
                    className="input"
                  >
                    <option value="">All Priorities</option>
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="critical">Critical</option>
                  </select>
                </div>
              </motion.div>
            )}

            {/* Active Filters Summary */}
            {hasActiveFilters && (
              <div className="flex items-center justify-between pt-3 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Active filters:
                  </span>
                  {statusFilter && (
                    <Badge variant="info">Status: {statusFilter.replace(/_/g, ' ')}</Badge>
                  )}
                  {categoryFilter && (
                    <Badge variant="info">
                      Category:{' '}
                      {COMPLAINT_CATEGORIES.find(c => c.value === categoryFilter)?.label}
                    </Badge>
                  )}
                  {priorityFilter && (
                    <Badge variant="info">Priority: {priorityFilter}</Badge>
                  )}
                  {searchQuery && <Badge variant="info">Search: "{searchQuery}"</Badge>}
                </div>
                <Button variant="ghost" size="sm" onClick={clearFilters}>
                  Clear All
                </Button>
              </div>
            )}
          </div>
        </Card>

        {/* Results Summary */}
        <div className="mb-4 flex items-center justify-between">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {isLoading ? (
              'Loading...'
            ) : (
              <>
                Showing {complaints.length} of {total} complaint{total !== 1 ? 's' : ''}
              </>
            )}
          </p>
        </div>

        {/* Complaints List */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <LoadingSpinner size="lg" />
          </div>
        ) : complaints.length === 0 ? (
          <Card>
            <div className="text-center py-12">
              <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                No complaints found
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                {hasActiveFilters
                  ? 'Try adjusting your filters or search query'
                  : 'No complaints have been assigned to you yet'}
              </p>
            </div>
          </Card>
        ) : (
          <div className="space-y-4">
            {complaints.map((complaint, index) => {
              const statusColor = STATUS_COLORS[complaint.status as keyof typeof STATUS_COLORS];
              const priorityColor =
                PRIORITY_COLORS[complaint.priority as keyof typeof PRIORITY_COLORS];
              const categoryInfo = COMPLAINT_CATEGORIES.find(c => c.value === complaint.category);

              return (
                <motion.div
                  key={complaint._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <Card
                    className="hover:shadow-lg transition-shadow cursor-pointer"
                    onClick={() => navigate(`/officer/complaints/${complaint._id}`)}
                  >
                    <div className="flex flex-col md:flex-row md:items-start gap-4">
                      {/* Main Content */}
                      <div className="flex-1 min-w-0">
                        {/* Header */}
                        <div className="flex items-start justify-between gap-4 mb-3">
                          <div className="flex-1 min-w-0">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1 truncate">
                              {complaint.title}
                            </h3>
                            <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                              <span>ID: {complaint.complaintId}</span>
                              <span>•</span>
                              <span className="flex items-center gap-1">
                                <Calendar className="w-4 h-4" />
                                {formatRelativeTime(complaint.createdAt)}
                              </span>
                            </div>
                          </div>

                          {/* Badges */}
                          <div className="flex flex-wrap items-center gap-2">
                            <Badge
                              className={`${statusColor.bg} ${statusColor.text} ${statusColor.dark}`}
                            >
                              {complaint.status.replace(/_/g, ' ').toUpperCase()}
                            </Badge>
                            <Badge
                              className={`${priorityColor.bg} ${priorityColor.text} ${priorityColor.dark}`}
                            >
                              {complaint.priority.toUpperCase()}
                            </Badge>
                          </div>
                        </div>

                        {/* Description Preview */}
                        <p className="text-gray-700 dark:text-gray-300 line-clamp-2 mb-3">
                          {complaint.description}
                        </p>

                        {/* Footer Info */}
                        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                          {categoryInfo && (
                            <span className="flex items-center gap-1">
                              <span>{categoryInfo.icon}</span>
                              <span>{categoryInfo.label}</span>
                            </span>
                          )}

                          <span className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            {complaint.location.district}, {complaint.location.state}
                          </span>

                          {complaint.citizen && (
                            <span className="flex items-center gap-1">
                              By: {complaint.citizen.name}
                            </span>
                          )}

                          <span className="flex items-center gap-1">
                            <Eye className="w-4 h-4" />
                            {complaint.views} views
                          </span>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex flex-col sm:flex-row items-center gap-2">
                        {complaint.status === 'assigned' && (
                          <>
                            <Button
                              variant="success"
                              size="sm"
                              icon={<CheckCircle className="w-4 h-4" />}
                              onClick={e => handleAccept(complaint._id, e)}
                            >
                              Accept
                            </Button>
                            <Button
                              variant="danger"
                              size="sm"
                              icon={<XCircle className="w-4 h-4" />}
                              onClick={e => handleReject(complaint._id, e)}
                            >
                              Reject
                            </Button>
                          </>
                        )}

                        {['accepted', 'in_progress'].includes(complaint.status) && (
                          <Button
                            variant="primary"
                            size="sm"
                            icon={<Clock className="w-4 h-4" />}
                            onClick={e => openStatusModal(complaint, e)}
                          >
                            Update Status
                          </Button>
                        )}

                        <Button
                          variant="outline"
                          size="sm"
                          onClick={e => {
                            e.stopPropagation();
                            navigate(`/officer/complaints/${complaint._id}`);
                          }}
                        >
                          View Details
                        </Button>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* Pagination */}
        {!isLoading && totalPages > 1 && (
          <div className="mt-6 flex items-center justify-between">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Page {page} of {totalPages}
            </p>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                icon={<ChevronLeft className="w-4 h-4" />}
                onClick={() => handlePageChange(page - 1)}
                disabled={page === 1}
              >
                Previous
              </Button>

              {/* Page Numbers */}
              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (page <= 3) {
                    pageNum = i + 1;
                  } else if (page >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = page - 2 + i;
                  }

                  return (
                    <button
                      key={pageNum}
                      onClick={() => handlePageChange(pageNum)}
                      className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${
                        page === pageNum
                          ? 'bg-primary-600 text-white'
                          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>

              <Button
                variant="outline"
                size="sm"
                icon={<ChevronRight className="w-4 h-4" />}
                onClick={() => handlePageChange(page + 1)}
                disabled={page === totalPages}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </motion.div>

      {/* Status Update Modal */}
      <Modal
        isOpen={showStatusModal}
        onClose={() => setShowStatusModal(false)}
        title="Update Complaint Status"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              New Status
            </label>
            <select
              value={newStatus}
              onChange={e => setNewStatus(e.target.value)}
              className="input"
            >
              <option value="accepted">Accepted</option>
              <option value="in_progress">In Progress</option>
              <option value="waiting_for_citizen">Waiting for Citizen</option>
              <option value="resolved">Resolved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Remarks <span className="text-red-500">*</span>
            </label>
            <textarea
              value={statusRemarks}
              onChange={e => setStatusRemarks(e.target.value)}
              className="input"
              rows={4}
              placeholder="Provide details about this status update..."
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-4">
            <Button variant="outline" onClick={() => setShowStatusModal(false)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleStatusUpdate}
              loading={updatingStatus}
              disabled={!statusRemarks.trim()}
            >
              Update Status
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default OfficerComplaints;
