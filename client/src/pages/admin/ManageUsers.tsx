import { FC, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Users,
  Search,
  Plus,
  Edit,
  Trash2,
  Shield,
  Mail,
  Phone,
  Calendar,
  Filter,
  Download,
  RefreshCw,
  CheckCircle,
  XCircle,
} from 'lucide-react';
import toast from 'react-hot-toast';

import Card from '../../components/Card';
import Button from '../../components/Button';
import Input from '../../components/Input';
import Badge from '../../components/Badge';
import Modal from '../../components/Modal';
import LoadingSpinner from '../../components/LoadingSpinner';
import { formatDate } from '../../utils/format';
import api from '../../services/api';

interface User {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  role: string;
  isActive: boolean;
  createdAt: string;
}

const ManageUsers: FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  // Add/Edit User Modal
  const [showUserModal, setShowUserModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [userFormData, setUserFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    role: 'citizen',
  });
  const [savingUser, setSavingUser] = useState(false);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    setIsLoading(true);
    try {
      // Mock data for now - replace with actual API call
      const mockUsers: User[] = [
        {
          _id: '1',
          name: 'Rahul Kumar',
          email: 'rahul@example.com',
          phone: '+91 9876543210',
          role: 'citizen',
          isActive: true,
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30).toISOString(),
        },
        {
          _id: '2',
          name: 'Priya Sharma',
          email: 'priya@officer.gov.in',
          phone: '+91 9876543211',
          role: 'officer',
          isActive: true,
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 20).toISOString(),
        },
        {
          _id: '3',
          name: 'Amit Patel',
          email: 'amit@admin.gov.in',
          phone: '+91 9876543212',
          role: 'department_admin',
          isActive: true,
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 15).toISOString(),
        },
        {
          _id: '4',
          name: 'Sneha Reddy',
          email: 'sneha@example.com',
          role: 'citizen',
          isActive: false,
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(),
        },
      ];

      setUsers(mockUsers);
    } catch (error) {
      toast.error('Failed to load users');
    } finally {
      setIsLoading(false);
    }
  };

  const openAddUserModal = () => {
    setEditingUser(null);
    setUserFormData({
      name: '',
      email: '',
      phone: '',
      password: '',
      role: 'citizen',
    });
    setShowUserModal(true);
  };

  const openEditUserModal = (user: User) => {
    setEditingUser(user);
    setUserFormData({
      name: user.name,
      email: user.email,
      phone: user.phone || '',
      password: '',
      role: user.role,
    });
    setShowUserModal(true);
  };

  const handleSaveUser = async () => {
    if (!userFormData.name.trim()) {
      toast.error('Name is required');
      return;
    }

    if (!userFormData.email.trim()) {
      toast.error('Email is required');
      return;
    }

    if (!editingUser && !userFormData.password) {
      toast.error('Password is required for new users');
      return;
    }

    setSavingUser(true);
    try {
      if (editingUser) {
        // Update user
        await api.put(`/users/${editingUser._id}`, userFormData);
        toast.success('User updated successfully');
      } else {
        // Create user
        await api.post('/users', userFormData);
        toast.success('User created successfully');
      }

      setShowUserModal(false);
      loadUsers();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to save user');
    } finally {
      setSavingUser(false);
    }
  };

  const handleDeleteUser = async (userId: string, userName: string) => {
    if (!window.confirm(`Are you sure you want to delete user "${userName}"?`)) {
      return;
    }

    try {
      await api.delete(`/users/${userId}`);
      toast.success('User deleted successfully');
      loadUsers();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to delete user');
    }
  };

  const handleToggleUserStatus = async (userId: string, currentStatus: boolean) => {
    try {
      await api.put(`/users/${userId}/status`, {
        isActive: !currentStatus,
      });
      toast.success(`User ${!currentStatus ? 'activated' : 'deactivated'} successfully`);
      loadUsers();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update user status');
    }
  };

  const exportUsers = () => {
    const csvContent = [
      ['Name', 'Email', 'Phone', 'Role', 'Status', 'Created At'].join(','),
      ...filteredUsers.map(user =>
        [
          user.name,
          user.email,
          user.phone || '',
          user.role,
          user.isActive ? 'Active' : 'Inactive',
          formatDate(user.createdAt),
        ].join(',')
      ),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `users-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    toast.success('Users exported successfully');
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

  const filteredUsers = users.filter(user => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesRole = roleFilter === 'all' || user.role === roleFilter;

    const matchesStatus =
      statusFilter === 'all' ||
      (statusFilter === 'active' && user.isActive) ||
      (statusFilter === 'inactive' && !user.isActive);

    return matchesSearch && matchesRole && matchesStatus;
  });

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
              Manage Users
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Create, edit, and manage system users and their roles
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              icon={<RefreshCw className="w-4 h-4" />}
              onClick={loadUsers}
              size="sm"
            >
              Refresh
            </Button>
            <Button
              variant="outline"
              icon={<Download className="w-4 h-4" />}
              onClick={exportUsers}
              size="sm"
            >
              Export
            </Button>
            <Button
              variant="primary"
              icon={<Plus className="w-4 h-4" />}
              onClick={openAddUserModal}
            >
              Add User
            </Button>
          </div>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input
              placeholder="Search by name or email..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              icon={<Search className="w-5 h-5" />}
            />

            <select
              value={roleFilter}
              onChange={e => setRoleFilter(e.target.value)}
              className="input"
            >
              <option value="all">All Roles</option>
              <option value="citizen">Citizen</option>
              <option value="officer">Officer</option>
              <option value="department_admin">Department Admin</option>
              <option value="super_admin">Super Admin</option>
            </select>

            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className="input"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{users.length}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Users</p>
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {users.filter(u => u.isActive).length}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Active</p>
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {users.filter(u => u.role === 'officer').length}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Officers</p>
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {users.filter(u => u.role === 'citizen').length}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Citizens</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Users Table */}
        {isLoading ? (
          <Card>
            <div className="flex items-center justify-center py-12">
              <LoadingSpinner size="lg" />
            </div>
          </Card>
        ) : filteredUsers.length === 0 ? (
          <Card>
            <div className="text-center py-12">
              <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                No users found
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                {searchQuery || roleFilter !== 'all' || statusFilter !== 'all'
                  ? 'Try adjusting your filters'
                  : 'Get started by adding your first user'}
              </p>
              {!searchQuery && roleFilter === 'all' && statusFilter === 'all' && (
                <Button onClick={openAddUserModal} icon={<Plus className="w-4 h-4" />}>
                  Add User
                </Button>
              )}
            </div>
          </Card>
        ) : (
          <Card>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">
                      User
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">
                      Contact
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">
                      Role
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">
                      Status
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">
                      Created
                    </th>
                    <th className="text-right py-3 px-4 font-semibold text-gray-900 dark:text-white">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user, index) => (
                    <motion.tr
                      key={user._id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: index * 0.05 }}
                      className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50"
                    >
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                            {user.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white">
                              {user.name}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                            <Mail className="w-4 h-4" />
                            {user.email}
                          </div>
                          {user.phone && (
                            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                              <Phone className="w-4 h-4" />
                              {user.phone}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-4">{getRoleBadge(user.role)}</td>
                      <td className="py-3 px-4">
                        {user.isActive ? (
                          <Badge variant="success">Active</Badge>
                        ) : (
                          <Badge variant="danger">Inactive</Badge>
                        )}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400">
                        {formatDate(user.createdAt)}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleToggleUserStatus(user._id, user.isActive)}
                            className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                            title={user.isActive ? 'Deactivate' : 'Activate'}
                          >
                            {user.isActive ? (
                              <XCircle className="w-4 h-4" />
                            ) : (
                              <CheckCircle className="w-4 h-4" />
                            )}
                          </button>
                          <button
                            onClick={() => openEditUserModal(user)}
                            className="p-2 text-gray-400 hover:text-primary-600 transition-colors"
                            title="Edit"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteUser(user._id, user.name)}
                            className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )}
      </motion.div>

      {/* Add/Edit User Modal */}
      <Modal
        isOpen={showUserModal}
        onClose={() => setShowUserModal(false)}
        title={editingUser ? 'Edit User' : 'Add New User'}
      >
        <div className="space-y-4">
          <Input
            label="Full Name"
            value={userFormData.name}
            onChange={e => setUserFormData({ ...userFormData, name: e.target.value })}
            placeholder="Enter full name"
          />

          <Input
            label="Email Address"
            type="email"
            value={userFormData.email}
            onChange={e => setUserFormData({ ...userFormData, email: e.target.value })}
            placeholder="user@example.com"
          />

          <Input
            label="Phone Number"
            value={userFormData.phone}
            onChange={e => setUserFormData({ ...userFormData, phone: e.target.value })}
            placeholder="+91 XXXXX XXXXX"
          />

          <Input
            label={editingUser ? 'Password (leave blank to keep current)' : 'Password'}
            type="password"
            value={userFormData.password}
            onChange={e => setUserFormData({ ...userFormData, password: e.target.value })}
            placeholder="Enter password"
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Role
            </label>
            <select
              value={userFormData.role}
              onChange={e => setUserFormData({ ...userFormData, role: e.target.value })}
              className="input"
            >
              <option value="citizen">Citizen</option>
              <option value="officer">Officer</option>
              <option value="department_admin">Department Admin</option>
              <option value="super_admin">Super Admin</option>
            </select>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4">
            <Button variant="outline" onClick={() => setShowUserModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleSaveUser} loading={savingUser}>
              {editingUser ? 'Update User' : 'Create User'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ManageUsers;
