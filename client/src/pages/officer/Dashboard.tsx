import { FC, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ClipboardList,
  Clock,
  CheckCircle,
  AlertTriangle,
  TrendingUp,
  Calendar,
  MapPin,
  Eye,
} from 'lucide-react';
import toast from 'react-hot-toast';

import Card from '../../components/Card';
import Badge from '../../components/Badge';
import Button from '../../components/Button';
import LoadingSpinner from '../../components/LoadingSpinner';
import { useAppSelector } from '../../hooks/redux';
import { STATUS_COLORS, PRIORITY_COLORS, COMPLAINT_CATEGORIES } from '../../constants';
import { formatRelativeTime } from '../../utils/format';
import api from '../../services/api';

interface Complaint {
  _id: string;
  complaintId: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  category: string;
  location: {
    district: string;
    state: string;
  };
  createdAt: string;
  views: number;
}

const OfficerDashboard: FC = () => {
  const navigate = useNavigate();
  const { user } = useAppSelector(state => state.auth);

  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    inProgress: 0,
    resolved: 0,
  });

  useEffect(() => {
    loadComplaints();
  }, []);

  const loadComplaints = async () => {
    setIsLoading(true);
    try {
      const response = await api.get('/complaints', {
        params: { limit: 10, page: 1 }
      });
      
      if (response.data.success) {
        const fetchedComplaints = response.data.data || [];
        setComplaints(fetchedComplaints);
        
        // Calculate stats
        setStats({
          total: fetchedComplaints.length,
          pending: fetchedComplaints.filter((c: Complaint) => 
            c.status === 'assigned' || c.status === 'accepted' || c.status === 'submitted'
          ).length,
          inProgress: fetchedComplaints.filter((c: Complaint) => 
            c.status === 'in_progress'
          ).length,
          resolved: fetchedComplaints.filter((c: Complaint) => 
            c.status === 'resolved'
          ).length,
        });
      }
    } catch (error: any) {
      console.error('Error loading complaints:', error);
      // Use mock data if API fails
      const mockComplaints: Complaint[] = [
        {
          _id: '1',
          complaintId: 'NGS2026000001',
          title: 'Street light not working',
          description: 'The street light on Main Road has been broken for 2 weeks',
          status: 'assigned',
          priority: 'high',
          category: 'infrastructure',
          location: { district: 'Central', state: 'Madhya Pradesh' },
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
          views: 12,
        },
        {
          _id: '2',
          complaintId: 'NGS2026000002',
          title: 'Pothole on highway',
          description: 'Large pothole causing accidents near toll plaza',
          status: 'in_progress',
          priority: 'critical',
          category: 'roads',
          location: { district: 'North', state: 'Madhya Pradesh' },
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
          views: 25,
        },
        {
          _id: '3',
          complaintId: 'NGS2026000003',
          title: 'Garbage not collected',
          description: 'Garbage has not been collected for 3 days',
          status: 'accepted',
          priority: 'medium',
          category: 'sanitation',
          location: { district: 'South', state: 'Madhya Pradesh' },
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
          views: 8,
        },
      ];
      
      setComplaints(mockComplaints);
      setStats({
        total: mockComplaints.length,
        pending: 2,
        inProgress: 1,
        resolved: 0,
      });
      
      toast.error('Using demo data. Please setup MongoDB for real data.');
    } finally {
      setIsLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Total Assigned',
      value: stats.total,
      icon: ClipboardList,
      color: 'text-blue-600 dark:text-blue-400',
      bg: 'bg-blue-100 dark:bg-blue-900/30',
    },
    {
      title: 'Pending Action',
      value: stats.pending,
      icon: Clock,
      color: 'text-yellow-600 dark:text-yellow-400',
      bg: 'bg-yellow-100 dark:bg-yellow-900/30',
    },
    {
      title: 'In Progress',
      value: stats.inProgress,
      icon: TrendingUp,
      color: 'text-orange-600 dark:text-orange-400',
      bg: 'bg-orange-100 dark:bg-orange-900/30',
    },
    {
      title: 'Resolved',
      value: stats.resolved,
      icon: CheckCircle,
      color: 'text-green-600 dark:text-green-400',
      bg: 'bg-green-100 dark:bg-green-900/30',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Officer Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Welcome back, {user?.name || 'Officer'}! Here's your complaint overview.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statCards.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="hover:shadow-lg transition-shadow">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                        {stat.title}
                      </p>
                      <p className="text-3xl font-bold text-gray-900 dark:text-white">
                        {stat.value}
                      </p>
                    </div>
                    <div className={`p-3 rounded-lg ${stat.bg}`}>
                      <Icon className={`w-8 h-8 ${stat.color}`} />
                    </div>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Recent Complaints */}
        <Card>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Recently Assigned Complaints
            </h2>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/officer/complaints')}
            >
              View All
            </Button>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <LoadingSpinner size="lg" />
            </div>
          ) : complaints.length === 0 ? (
            <div className="text-center py-12">
              <ClipboardList className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                No Assigned Complaints
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                You don't have any complaints assigned to you yet.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {complaints.slice(0, 5).map((complaint, index) => {
                const statusColor = STATUS_COLORS[complaint.status as keyof typeof STATUS_COLORS] || 
                  { bg: 'bg-gray-100', text: 'text-gray-600', dark: 'dark:bg-gray-800' };
                const priorityColor = PRIORITY_COLORS[complaint.priority as keyof typeof PRIORITY_COLORS] ||
                  { bg: 'bg-gray-100', text: 'text-gray-600', dark: 'dark:bg-gray-800' };
                const categoryInfo = COMPLAINT_CATEGORIES.find(c => c.value === complaint.category);

                return (
                  <motion.div
                    key={complaint._id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => navigate(`/officer/complaints/${complaint._id}`)}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
                            {complaint.title}
                          </h3>
                          <Badge
                            className={`${priorityColor.bg} ${priorityColor.text} ${priorityColor.dark}`}
                          >
                            {complaint.priority.toUpperCase()}
                          </Badge>
                        </div>

                        <p className="text-gray-700 dark:text-gray-300 line-clamp-2 mb-3">
                          {complaint.description}
                        </p>

                        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                          <span>ID: {complaint.complaintId}</span>

                          {categoryInfo && (
                            <span className="flex items-center gap-1">
                              <span>{categoryInfo.icon}</span>
                              <span>{categoryInfo.label}</span>
                            </span>
                          )}

                          <span className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            {complaint.location.district}
                          </span>

                          <span className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {formatRelativeTime(complaint.createdAt)}
                          </span>

                          <span className="flex items-center gap-1">
                            <Eye className="w-4 h-4" />
                            {complaint.views} views
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-col items-end gap-2">
                        <Badge
                          className={`${statusColor.bg} ${statusColor.text} ${statusColor.dark}`}
                        >
                          {complaint.status.replace(/_/g, ' ').toUpperCase()}
                        </Badge>
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
                  </motion.div>
                );
              })}
            </div>
          )}
        </Card>

        {/* Quick Actions */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <div className="text-center py-6">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <ClipboardList className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                View All Complaints
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Access complete list of assigned complaints
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/officer/complaints')}
                fullWidth
              >
                Go to Complaints
              </Button>
            </div>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <div className="text-center py-6">
              <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Urgent Complaints
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                View high priority complaints needing attention
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/officer/complaints?priority=critical,high')}
                fullWidth
              >
                View Urgent
              </Button>
            </div>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <div className="text-center py-6">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Resolved Cases
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                View your successfully resolved complaints
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/officer/complaints?status=resolved')}
                fullWidth
              >
                View Resolved
              </Button>
            </div>
          </Card>
        </div>
      </motion.div>
    </div>
  );
};

export default OfficerDashboard;
