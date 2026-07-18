import { FC, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bell,
  CheckCheck,
  Trash2,
  Filter,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  Info,
  MessageSquare,
  FileText,
  X,
} from 'lucide-react';
import toast from 'react-hot-toast';

import Card from '../../components/Card';
import Badge from '../../components/Badge';
import Button from '../../components/Button';
import LoadingSpinner from '../../components/LoadingSpinner';
import { useAppSelector } from '../../hooks/redux';
import { formatRelativeTime } from '../../utils/format';
import api from '../../services/api';

interface Notification {
  _id: string;
  type: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  data?: {
    complaintId?: string;
    complaintNumber?: string;
    link?: string;
  };
}

const Notifications: FC = () => {
  const navigate = useNavigate();
  const { user } = useAppSelector(state => state.auth);

  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all');
  const [selectedType, setSelectedType] = useState<string>('all');

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    setIsLoading(true);
    try {
      // Mock data for now - replace with actual API call
      const mockNotifications: Notification[] = [
        {
          _id: '1',
          type: 'complaint_submitted',
          title: 'Complaint Submitted',
          message: 'Your complaint "Street light not working" has been submitted successfully',
          isRead: false,
          createdAt: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
          data: {
            complaintId: '123',
            complaintNumber: 'NGS2026000001',
            link: '/citizen/complaints/123',
          },
        },
        {
          _id: '2',
          type: 'status_updated',
          title: 'Status Updated',
          message: 'Your complaint status changed to "In Progress"',
          isRead: false,
          createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
          data: {
            complaintId: '122',
            complaintNumber: 'NGS2026000002',
            link: '/citizen/complaints/122',
          },
        },
        {
          _id: '3',
          type: 'new_message',
          title: 'New Message',
          message: 'Officer replied to your complaint',
          isRead: true,
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
          data: {
            complaintId: '121',
            link: '/citizen/complaints/121',
          },
        },
        {
          _id: '4',
          type: 'complaint_resolved',
          title: 'Complaint Resolved',
          message: 'Your complaint "Pothole on Main Road" has been marked as resolved',
          isRead: true,
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
          data: {
            complaintId: '120',
            complaintNumber: 'NGS2026000003',
            link: '/citizen/complaints/120',
          },
        },
      ];

      setNotifications(mockNotifications);
    } catch (error) {
      toast.error('Failed to load notifications');
    } finally {
      setIsLoading(false);
    }
  };

  const markAsRead = async (notificationId: string) => {
    try {
      // API call would go here
      setNotifications(prev =>
        prev.map(notif =>
          notif._id === notificationId ? { ...notif, isRead: true } : notif
        )
      );
      toast.success('Marked as read');
    } catch (error) {
      toast.error('Failed to mark as read');
    }
  };

  const markAllAsRead = async () => {
    try {
      // API call would go here
      setNotifications(prev => prev.map(notif => ({ ...notif, isRead: true })));
      toast.success('All notifications marked as read');
    } catch (error) {
      toast.error('Failed to mark all as read');
    }
  };

  const deleteNotification = async (notificationId: string) => {
    try {
      // API call would go here
      setNotifications(prev => prev.filter(notif => notif._id !== notificationId));
      toast.success('Notification deleted');
    } catch (error) {
      toast.error('Failed to delete notification');
    }
  };

  const clearAll = async () => {
    if (!window.confirm('Are you sure you want to delete all notifications?')) {
      return;
    }

    try {
      // API call would go here
      setNotifications([]);
      toast.success('All notifications cleared');
    } catch (error) {
      toast.error('Failed to clear notifications');
    }
  };

  const handleNotificationClick = (notification: Notification) => {
    if (!notification.isRead) {
      markAsRead(notification._id);
    }

    if (notification.data?.link) {
      navigate(notification.data.link);
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'complaint_submitted':
        return <FileText className="w-5 h-5 text-blue-600" />;
      case 'status_updated':
        return <Info className="w-5 h-5 text-yellow-600" />;
      case 'complaint_resolved':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'new_message':
        return <MessageSquare className="w-5 h-5 text-purple-600" />;
      case 'complaint_assigned':
        return <AlertCircle className="w-5 h-5 text-orange-600" />;
      default:
        return <Bell className="w-5 h-5 text-gray-600" />;
    }
  };

  const filteredNotifications = notifications.filter(notif => {
    if (filter === 'unread' && notif.isRead) return false;
    if (filter === 'read' && !notif.isRead) return false;
    if (selectedType !== 'all' && notif.type !== selectedType) return false;
    return true;
  });

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div className="max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Notifications</h1>
              {unreadCount > 0 && (
                <Badge variant="danger" className="text-sm">
                  {unreadCount} new
                </Badge>
              )}
            </div>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Stay updated with your complaint activities
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              icon={<RefreshCw className="w-4 h-4" />}
              onClick={loadNotifications}
              size="sm"
            >
              Refresh
            </Button>
            {unreadCount > 0 && (
              <Button
                variant="outline"
                icon={<CheckCheck className="w-4 h-4" />}
                onClick={markAllAsRead}
                size="sm"
              >
                Mark All Read
              </Button>
            )}
            {notifications.length > 0 && (
              <Button
                variant="outline"
                icon={<Trash2 className="w-4 h-4" />}
                onClick={clearAll}
                size="sm"
                className="text-red-600 hover:text-red-700"
              >
                Clear All
              </Button>
            )}
          </div>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Read/Unread Filter */}
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Show:
              </span>
              <div className="flex items-center gap-1">
                {(['all', 'unread', 'read'] as const).map(f => (
                  <button
                    key={f}
                    onClick={() => setFilter(f)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                      filter === f
                        ? 'bg-primary-600 text-white'
                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                    }`}
                  >
                    {f.charAt(0).toUpperCase() + f.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Type Filter */}
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Type:
              </span>
              <select
                value={selectedType}
                onChange={e => setSelectedType(e.target.value)}
                className="input py-1.5 text-sm"
              >
                <option value="all">All Types</option>
                <option value="complaint_submitted">Complaint Submitted</option>
                <option value="status_updated">Status Updated</option>
                <option value="complaint_resolved">Complaint Resolved</option>
                <option value="new_message">New Message</option>
                <option value="complaint_assigned">Complaint Assigned</option>
              </select>
            </div>
          </div>
        </Card>

        {/* Notifications List */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <LoadingSpinner size="lg" />
          </div>
        ) : filteredNotifications.length === 0 ? (
          <Card>
            <div className="text-center py-12">
              <Bell className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                No notifications
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {filter === 'unread'
                  ? "You're all caught up! No unread notifications."
                  : notifications.length === 0
                  ? "You don't have any notifications yet"
                  : 'No notifications match your filters'}
              </p>
            </div>
          </Card>
        ) : (
          <div className="space-y-3">
            <AnimatePresence>
              {filteredNotifications.map((notification, index) => (
                <motion.div
                  key={notification._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <Card
                    className={`cursor-pointer hover:shadow-lg transition-all ${
                      !notification.isRead
                        ? 'border-l-4 border-l-primary-600 bg-primary-50/30 dark:bg-primary-900/10'
                        : ''
                    }`}
                    onClick={() => handleNotificationClick(notification)}
                  >
                    <div className="flex items-start gap-4">
                      {/* Icon */}
                      <div
                        className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                          !notification.isRead
                            ? 'bg-primary-100 dark:bg-primary-900/30'
                            : 'bg-gray-100 dark:bg-gray-800'
                        }`}
                      >
                        {getNotificationIcon(notification.type)}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-4 mb-1">
                          <h4
                            className={`font-semibold ${
                              !notification.isRead
                                ? 'text-gray-900 dark:text-white'
                                : 'text-gray-700 dark:text-gray-300'
                            }`}
                          >
                            {notification.title}
                          </h4>
                          <span className="text-xs text-gray-500 dark:text-gray-500 whitespace-nowrap">
                            {formatRelativeTime(notification.createdAt)}
                          </span>
                        </div>

                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                          {notification.message}
                        </p>

                        {notification.data?.complaintNumber && (
                          <Badge variant="info" className="text-xs">
                            {notification.data.complaintNumber}
                          </Badge>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2">
                        {!notification.isRead && (
                          <button
                            onClick={e => {
                              e.stopPropagation();
                              markAsRead(notification._id);
                            }}
                            className="p-2 text-gray-400 hover:text-primary-600 transition-colors"
                            title="Mark as read"
                          >
                            <CheckCheck className="w-4 h-4" />
                          </button>
                        )}

                        <button
                          onClick={e => {
                            e.stopPropagation();
                            deleteNotification(notification._id);
                          }}
                          className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                          title="Delete"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default Notifications;
