import { FC, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Shield,
  Bell,
  Lock,
  Camera,
  Save,
  X,
} from 'lucide-react';
import toast from 'react-hot-toast';

import Card from '../../components/Card';
import Button from '../../components/Button';
import Input from '../../components/Input';
import Badge from '../../components/Badge';
import { useAppSelector } from '../../hooks/redux';
import { formatDate } from '../../utils/format';
import api from '../../services/api';

const Profile: FC = () => {
  const { user } = useAppSelector(state => state.auth);

  // Profile Tab
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
  });
  const [updatingProfile, setUpdatingProfile] = useState(false);

  // Password Tab
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [updatingPassword, setUpdatingPassword] = useState(false);

  // Notification Preferences Tab
  const [notificationPrefs, setNotificationPrefs] = useState({
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    complaintUpdates: true,
    statusChanges: true,
    newMessages: true,
    weeklyDigest: false,
  });
  const [updatingPrefs, setUpdatingPrefs] = useState(false);

  const [activeTab, setActiveTab] = useState<'profile' | 'security' | 'notifications'>('profile');

  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
      });
    }
  }, [user]);

  const handleProfileUpdate = async () => {
    if (!profileData.name.trim()) {
      toast.error('Name is required');
      return;
    }

    if (!profileData.email.trim()) {
      toast.error('Email is required');
      return;
    }

    setUpdatingProfile(true);
    try {
      await api.put('/auth/profile', profileData);
      toast.success('Profile updated successfully');
      setIsEditingProfile(false);
      // Reload user data
      window.location.reload();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setUpdatingProfile(false);
    }
  };

  const handlePasswordChange = async () => {
    if (!passwordData.currentPassword) {
      toast.error('Current password is required');
      return;
    }

    if (!passwordData.newPassword) {
      toast.error('New password is required');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    setUpdatingPassword(true);
    try {
      await api.put('/auth/change-password', {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });
      toast.success('Password changed successfully');
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to change password');
    } finally {
      setUpdatingPassword(false);
    }
  };

  const handleNotificationPrefsUpdate = async () => {
    setUpdatingPrefs(true);
    try {
      // This would call an API endpoint to update preferences
      await api.put('/auth/notification-preferences', notificationPrefs);
      toast.success('Notification preferences updated');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update preferences');
    } finally {
      setUpdatingPrefs(false);
    }
  };

  const getRoleBadge = (role: string) => {
    const roleMap: Record<string, { label: string; variant: any }> = {
      citizen: { label: 'Citizen', variant: 'primary' },
      officer: { label: 'Officer', variant: 'info' },
      department_admin: { label: 'Department Admin', variant: 'warning' },
      super_admin: { label: 'Super Admin', variant: 'danger' },
    };

    const roleInfo = roleMap[role] || { label: role, variant: 'default' };
    return <Badge variant={roleInfo.variant}>{roleInfo.label}</Badge>;
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'security', label: 'Security', icon: Lock },
    { id: 'notifications', label: 'Notifications', icon: Bell },
  ];

  return (
    <div className="max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Profile Settings</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage your account settings and preferences
          </p>
        </div>

        {/* Profile Summary Card */}
        <Card className="mb-6">
          <div className="flex items-start gap-6">
            {/* Avatar */}
            <div className="relative">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center text-white text-3xl font-bold">
                {user?.name?.charAt(0).toUpperCase() || 'U'}
              </div>
              <button className="absolute bottom-0 right-0 w-8 h-8 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center shadow-lg border-2 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                <Camera className="w-4 h-4 text-gray-600 dark:text-gray-300" />
              </button>
            </div>

            {/* User Info */}
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{user?.name}</h2>
                {user?.role && getRoleBadge(user.role)}
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                  <Mail className="w-4 h-4" />
                  <span>{user?.email}</span>
                </div>

                {user?.phone && (
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                    <Phone className="w-4 h-4" />
                    <span>{user.phone}</span>
                  </div>
                )}

                {user?.createdAt && (
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                    <Calendar className="w-4 h-4" />
                    <span>Member since {formatDate(user.createdAt)}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </Card>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 border-b border-gray-200 dark:border-gray-700">
          {tabs.map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-3 font-medium transition-colors relative ${
                  isActive
                    ? 'text-primary-600 dark:text-primary-400'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                <Icon className="w-5 h-5" />
                {tab.label}
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-600"
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <Card>
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Personal Information
                  </h3>
                  {!isEditingProfile ? (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setIsEditingProfile(true)}
                    >
                      Edit Profile
                    </Button>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        icon={<X className="w-4 h-4" />}
                        onClick={() => {
                          setIsEditingProfile(false);
                          setProfileData({
                            name: user?.name || '',
                            email: user?.email || '',
                            phone: user?.phone || '',
                          });
                        }}
                      >
                        Cancel
                      </Button>
                      <Button
                        variant="primary"
                        size="sm"
                        icon={<Save className="w-4 h-4" />}
                        onClick={handleProfileUpdate}
                        loading={updatingProfile}
                      >
                        Save Changes
                      </Button>
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  <Input
                    label="Full Name"
                    value={profileData.name}
                    onChange={e => setProfileData({ ...profileData, name: e.target.value })}
                    disabled={!isEditingProfile}
                    icon={<User className="w-5 h-5" />}
                  />

                  <Input
                    label="Email Address"
                    type="email"
                    value={profileData.email}
                    onChange={e => setProfileData({ ...profileData, email: e.target.value })}
                    disabled={!isEditingProfile}
                    icon={<Mail className="w-5 h-5" />}
                  />

                  <Input
                    label="Phone Number"
                    value={profileData.phone}
                    onChange={e => setProfileData({ ...profileData, phone: e.target.value })}
                    disabled={!isEditingProfile}
                    icon={<Phone className="w-5 h-5" />}
                    placeholder="+91 XXXXX XXXXX"
                  />

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Role
                    </label>
                    <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      {getRoleBadge(user?.role || 'citizen')}
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          )}

          {/* Security Tab */}
          {activeTab === 'security' && (
            <Card>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                    Change Password
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Update your password to keep your account secure
                  </p>
                </div>

                <div className="space-y-4">
                  <Input
                    label="Current Password"
                    type="password"
                    value={passwordData.currentPassword}
                    onChange={e =>
                      setPasswordData({ ...passwordData, currentPassword: e.target.value })
                    }
                    icon={<Lock className="w-5 h-5" />}
                    placeholder="Enter current password"
                  />

                  <Input
                    label="New Password"
                    type="password"
                    value={passwordData.newPassword}
                    onChange={e =>
                      setPasswordData({ ...passwordData, newPassword: e.target.value })
                    }
                    icon={<Lock className="w-5 h-5" />}
                    placeholder="Enter new password (min. 6 characters)"
                  />

                  <Input
                    label="Confirm New Password"
                    type="password"
                    value={passwordData.confirmPassword}
                    onChange={e =>
                      setPasswordData({ ...passwordData, confirmPassword: e.target.value })
                    }
                    icon={<Lock className="w-5 h-5" />}
                    placeholder="Re-enter new password"
                  />

                  <Button
                    variant="primary"
                    onClick={handlePasswordChange}
                    loading={updatingPassword}
                    fullWidth
                  >
                    Change Password
                  </Button>
                </div>
              </div>
            </Card>
          )}

          {/* Notifications Tab */}
          {activeTab === 'notifications' && (
            <Card>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                    Notification Preferences
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Choose how you want to receive updates
                  </p>
                </div>

                <div className="space-y-4">
                  {/* Email Notifications */}
                  <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Mail className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">
                          Email Notifications
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Receive updates via email
                        </p>
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={notificationPrefs.emailNotifications}
                      onChange={e =>
                        setNotificationPrefs({
                          ...notificationPrefs,
                          emailNotifications: e.target.checked,
                        })
                      }
                      className="w-5 h-5 text-primary-600 rounded"
                    />
                  </div>

                  {/* SMS Notifications */}
                  <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Phone className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">
                          SMS Notifications
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Receive updates via SMS
                        </p>
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={notificationPrefs.smsNotifications}
                      onChange={e =>
                        setNotificationPrefs({
                          ...notificationPrefs,
                          smsNotifications: e.target.checked,
                        })
                      }
                      className="w-5 h-5 text-primary-600 rounded"
                    />
                  </div>

                  {/* Push Notifications */}
                  <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Bell className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">
                          Push Notifications
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Receive browser notifications
                        </p>
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={notificationPrefs.pushNotifications}
                      onChange={e =>
                        setNotificationPrefs({
                          ...notificationPrefs,
                          pushNotifications: e.target.checked,
                        })
                      }
                      className="w-5 h-5 text-primary-600 rounded"
                    />
                  </div>

                  <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                    <h4 className="font-medium text-gray-900 dark:text-white mb-3">
                      Notification Types
                    </h4>

                    <div className="space-y-3">
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={notificationPrefs.complaintUpdates}
                          onChange={e =>
                            setNotificationPrefs({
                              ...notificationPrefs,
                              complaintUpdates: e.target.checked,
                            })
                          }
                          className="w-4 h-4 text-primary-600 rounded"
                        />
                        <span className="text-sm text-gray-700 dark:text-gray-300">
                          Complaint updates and assignments
                        </span>
                      </label>

                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={notificationPrefs.statusChanges}
                          onChange={e =>
                            setNotificationPrefs({
                              ...notificationPrefs,
                              statusChanges: e.target.checked,
                            })
                          }
                          className="w-4 h-4 text-primary-600 rounded"
                        />
                        <span className="text-sm text-gray-700 dark:text-gray-300">
                          Status changes
                        </span>
                      </label>

                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={notificationPrefs.newMessages}
                          onChange={e =>
                            setNotificationPrefs({
                              ...notificationPrefs,
                              newMessages: e.target.checked,
                            })
                          }
                          className="w-4 h-4 text-primary-600 rounded"
                        />
                        <span className="text-sm text-gray-700 dark:text-gray-300">
                          New messages and replies
                        </span>
                      </label>

                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={notificationPrefs.weeklyDigest}
                          onChange={e =>
                            setNotificationPrefs({
                              ...notificationPrefs,
                              weeklyDigest: e.target.checked,
                            })
                          }
                          className="w-4 h-4 text-primary-600 rounded"
                        />
                        <span className="text-sm text-gray-700 dark:text-gray-300">
                          Weekly digest email
                        </span>
                      </label>
                    </div>
                  </div>

                  <Button
                    variant="primary"
                    onClick={handleNotificationPrefsUpdate}
                    loading={updatingPrefs}
                    fullWidth
                  >
                    Save Preferences
                  </Button>
                </div>
              </div>
            </Card>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Profile;
