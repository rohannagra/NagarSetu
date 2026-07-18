import { FC, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, FileText, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { fetchMyComplaints } from '../../store/slices/complaintSlice';
import Card from '../../components/Card';
import Button from '../../components/Button';
import Badge from '../../components/Badge';
import LoadingSpinner from '../../components/LoadingSpinner';
import { formatRelativeTime, snakeToTitle } from '../../utils/format';
import { motion } from 'framer-motion';
import { STATUS_COLORS, PRIORITY_COLORS } from '../../constants';

const CitizenDashboard: FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { user } = useAppSelector((state) => state.auth);
  const { complaints, isLoading } = useAppSelector((state) => state.complaints);

  useEffect(() => {
    dispatch(fetchMyComplaints({ limit: 5 }));
  }, [dispatch]);

  const stats = [
    {
      label: 'Total Complaints',
      value: user?.metadata?.totalComplaints || 0,
      icon: FileText,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100 dark:bg-blue-900/30',
    },
    {
      label: 'Resolved',
      value: user?.metadata?.resolvedComplaints || 0,
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-100 dark:bg-green-900/30',
    },
    {
      label: 'In Progress',
      value: complaints.filter((c) => ['in_progress', 'assigned', 'accepted'].includes(c.status)).length,
      icon: Clock,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100 dark:bg-yellow-900/30',
    },
    {
      label: 'Pending',
      value: complaints.filter((c) => ['submitted', 'verified'].includes(c.status)).length,
      icon: AlertCircle,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100 dark:bg-orange-900/30',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Welcome back, {user?.name?.split(' ')[0]}!
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Track and manage your civic complaints
          </p>
        </div>
        <Button
          icon={<Plus className="w-5 h-5" />}
          onClick={() => navigate('/citizen/submit')}
        >
          Submit New Complaint
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card hover className="cursor-pointer">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                    {stat.label}
                  </p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">
                    {stat.value}
                  </p>
                </div>
                <div className={`p-3 rounded-full ${stat.bgColor}`}>
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Recent Complaints */}
      <Card>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Recent Complaints
          </h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/citizen/complaints')}
          >
            View All
          </Button>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner size="lg" />
          </div>
        ) : complaints.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              No complaints yet
            </p>
            <Button onClick={() => navigate('/citizen/submit')}>
              Submit Your First Complaint
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {complaints.slice(0, 5).map((complaint) => (
              <motion.div
                key={complaint._id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-primary-300 dark:hover:border-primary-700 transition-colors cursor-pointer"
                onClick={() => navigate(`/citizen/complaints/${complaint._id}`)}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-medium text-gray-900 dark:text-white truncate">
                        {complaint.title}
                      </h3>
                      <Badge
                        variant={
                          complaint.priority === 'critical' ? 'danger' :
                          complaint.priority === 'high' ? 'warning' :
                          complaint.priority === 'medium' ? 'info' : 'default'
                        }
                        size="sm"
                      >
                        {complaint.priority}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-2">
                      {complaint.description}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                      <span>{complaint.complaintId}</span>
                      <span>•</span>
                      <span>{formatRelativeTime(complaint.createdAt)}</span>
                      {complaint.department && (
                        <>
                          <span>•</span>
                          <span>{complaint.department.name}</span>
                        </>
                      )}
                    </div>
                  </div>
                  <Badge
                    variant={
                      ['resolved', 'closed'].includes(complaint.status) ? 'success' :
                      ['in_progress', 'accepted'].includes(complaint.status) ? 'warning' :
                      'info'
                    }
                  >
                    {snakeToTitle(complaint.status)}
                  </Badge>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </Card>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card hover className="cursor-pointer" onClick={() => navigate('/heatmap')}>
          <div className="flex items-center gap-4">
            <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-full">
              <FileText className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">
                View Heatmap
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                See complaint hotspots in your area
              </p>
            </div>
          </div>
        </Card>

        <Card hover className="cursor-pointer" onClick={() => navigate('/track')}>
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-full">
              <FileText className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">
                Track Complaint
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Track any complaint by ID or token
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default CitizenDashboard;
