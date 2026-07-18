import { FC, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Users,
  ClipboardList,
  Building2,
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

import Card from '../../components/Card';
import Badge from '../../components/Badge';
import Button from '../../components/Button';
import LoadingSpinner from '../../components/LoadingSpinner';
import { useAppSelector } from '../../hooks/redux';

const AdminDashboard: FC = () => {
  const navigate = useNavigate();
  const { user } = useAppSelector(state => state.auth);

  const [loading, setLoading] = useState(false);

  // Mock data for charts (in production, this would come from API)
  const stats = [
    {
      title: 'Total Complaints',
      value: '1,234',
      change: '+12%',
      icon: ClipboardList,
      color: 'text-blue-600 dark:text-blue-400',
      bg: 'bg-blue-100 dark:bg-blue-900/30',
    },
    {
      title: 'Active Users',
      value: '856',
      change: '+8%',
      icon: Users,
      color: 'text-green-600 dark:text-green-400',
      bg: 'bg-green-100 dark:bg-green-900/30',
    },
    {
      title: 'Departments',
      value: '24',
      change: '+2',
      icon: Building2,
      color: 'text-purple-600 dark:text-purple-400',
      bg: 'bg-purple-100 dark:bg-purple-900/30',
    },
    {
      title: 'Avg Resolution Time',
      value: '4.2 days',
      change: '-15%',
      icon: Clock,
      color: 'text-orange-600 dark:text-orange-400',
      bg: 'bg-orange-100 dark:bg-orange-900/30',
    },
  ];

  // Mock data for charts
  const monthlyData = [
    { month: 'Jan', complaints: 65, resolved: 52 },
    { month: 'Feb', complaints: 78, resolved: 68 },
    { month: 'Mar', complaints: 90, resolved: 82 },
    { month: 'Apr', complaints: 81, resolved: 75 },
    { month: 'May', complaints: 95, resolved: 89 },
    { month: 'Jun', complaints: 102, resolved: 96 },
  ];

  const categoryData = [
    { name: 'Roads', value: 245, color: '#3b82f6' },
    { name: 'Water', value: 189, color: '#06b6d4' },
    { name: 'Electricity', value: 156, color: '#f59e0b' },
    { name: 'Garbage', value: 134, color: '#10b981' },
    { name: 'Other', value: 98, color: '#8b5cf6' },
  ];

  const statusData = [
    { name: 'Resolved', value: 456, color: '#10b981' },
    { name: 'In Progress', value: 234, color: '#f59e0b' },
    { name: 'Pending', value: 178, color: '#ef4444' },
    { name: 'Closed', value: 124, color: '#6b7280' },
  ];

  return (
    <div className="max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Admin Dashboard
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Welcome back, {user?.name || 'Admin'}! Here's your system overview.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button variant="outline" onClick={() => navigate('/admin/analytics')}>
              View Analytics
            </Button>
            <Button onClick={() => navigate('/admin/users')}>Manage Users</Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="hover:shadow-lg transition-shadow">
                  <div className="flex items-center justify-between mb-3">
                    <div className={`p-3 rounded-lg ${stat.bg}`}>
                      <Icon className={`w-6 h-6 ${stat.color}`} />
                    </div>
                    <Badge variant={stat.change.startsWith('+') ? 'success' : 'info'}>
                      {stat.change}
                    </Badge>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                    {stat.value}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{stat.title}</p>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Charts Row 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Monthly Trend */}
          <Card>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
              Monthly Complaint Trend
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} />
                <XAxis dataKey="month" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1f2937',
                    border: 'none',
                    borderRadius: '8px',
                    color: '#fff',
                  }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="complaints"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  name="Complaints"
                />
                <Line
                  type="monotone"
                  dataKey="resolved"
                  stroke="#10b981"
                  strokeWidth={2}
                  name="Resolved"
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>

          {/* Category Distribution */}
          <Card>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
              Complaints by Category
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1f2937',
                    border: 'none',
                    borderRadius: '8px',
                    color: '#fff',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </div>

        {/* Charts Row 2 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Status Distribution */}
          <Card>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
              Complaint Status Distribution
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={statusData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} />
                <XAxis dataKey="name" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1f2937',
                    border: 'none',
                    borderRadius: '8px',
                    color: '#fff',
                  }}
                />
                <Bar dataKey="value" fill="#3b82f6" radius={[8, 8, 0, 0]}>
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </Card>

          {/* Quick Stats */}
          <Card>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
              System Health
            </h2>
            <div className="space-y-6">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Resolution Rate
                  </span>
                  <span className="text-sm font-semibold text-green-600 dark:text-green-400">
                    87%
                  </span>
                </div>
                <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div className="h-full bg-green-500" style={{ width: '87%' }} />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Officer Utilization
                  </span>
                  <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">
                    72%
                  </span>
                </div>
                <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500" style={{ width: '72%' }} />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Citizen Satisfaction
                  </span>
                  <span className="text-sm font-semibold text-yellow-600 dark:text-yellow-400">
                    68%
                  </span>
                </div>
                <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div className="h-full bg-yellow-500" style={{ width: '68%' }} />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    SLA Compliance
                  </span>
                  <span className="text-sm font-semibold text-purple-600 dark:text-purple-400">
                    91%
                  </span>
                </div>
                <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div className="h-full bg-purple-500" style={{ width: '91%' }} />
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card
            className="hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => navigate('/admin/users')}
          >
            <div className="text-center py-6">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                Manage Users
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Add, edit, or remove users
              </p>
            </div>
          </Card>

          <Card
            className="hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => navigate('/admin/departments')}
          >
            <div className="text-center py-6">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <Building2 className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                Departments
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Manage departments
              </p>
            </div>
          </Card>

          <Card
            className="hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => navigate('/admin/analytics')}
          >
            <div className="text-center py-6">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                Analytics
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                View detailed reports
              </p>
            </div>
          </Card>

          <Card
            className="hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => navigate('/complaints')}
          >
            <div className="text-center py-6">
              <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <ClipboardList className="w-6 h-6 text-orange-600 dark:text-orange-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                All Complaints
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                View all complaints
              </p>
            </div>
          </Card>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminDashboard;
