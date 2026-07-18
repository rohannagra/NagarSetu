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
  Trash2,
} from 'lucide-react';
import toast from 'react-hot-toast';

import Card from '../../components/Card';
import Badge from '../../components/Badge';
import Button from '../../components/Button';
import Input from '../../components/Input';
import LoadingSpinner from '../../components/LoadingSpinner';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { fetchMyComplaints } from '../../store/slices/complaintSlice';
import { STATUS_COLORS, PRIORITY_COLORS, COMPLAINT_CATEGORIES, COMPLAINT_STATUS } from '../../constants';
import { formatDate, formatRelativeTime } from '../../utils/format';
import { useDebounce } from '../../hooks/useDebounce';
import complaintService from '../../services/complaintService';

const MyComplaints: FC = () => {
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

  const debouncedSearch = useDebounce(searchQuery, 500);

  useEffect(() => {
    loadComplaints();
  }, [debouncedSearch, statusFilter, categoryFilter, priorityFilter, page]);

  const loadComplaints = () => {
    dispatch(
      fetchMyComplaints({
        search: debouncedSearch,
        status: statusFilter as any,
        category: categoryFilter as any,
        priority: priorityFilter as any,
        page,
        limit: 20,
      })
    );
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

  const handleDelete = async (complaintId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (!window.confirm('Are you sure you want to delete this complaint? This action cannot be undone.')) {
      return;
    }

    try {
      await complaintService.deleteComplaint(complaintId);
      toast.success('Complaint deleted successfully');
      loadComplaints(); // Reload the list
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to delete complaint');
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
              My Complaints
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Track and manage all your submitted complaints
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
            <Button onClick={() => navigate('/citizen/submit-complaint')}>
              New Complaint
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
                  : "You haven't submitted any complaints yet"}
              </p>
              {!hasActiveFilters && (
                <Button onClick={() => navigate('/citizen/submit-complaint')}>
                  Submit Your First Complaint
                </Button>
              )}
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
                    onClick={() => navigate(`/citizen/complaints/${complaint._id}`)}
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

                          {complaint.assignedOfficer && (
                            <span className="flex items-center gap-1">
                              Assigned to {complaint.assignedOfficer.name}
                            </span>
                          )}

                          <span className="flex items-center gap-1">
                            <Eye className="w-4 h-4" />
                            {complaint.views} views
                          </span>
                        </div>
                      </div>

                      {/* Action Button */}
                      <div className="flex items-center gap-2">
                        {/* Delete button - only for pending complaints */}
                        {complaint.status === 'pending' && (
                          <Button
                            variant="outline"
                            size="sm"
                            icon={<Trash2 className="w-4 h-4" />}
                            onClick={e => handleDelete(complaint._id, e)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                          >
                            Delete
                          </Button>
                        )}
                        
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={e => {
                            e.stopPropagation();
                            navigate(`/citizen/complaints/${complaint._id}`);
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
    </div>
  );
};

export default MyComplaints;
