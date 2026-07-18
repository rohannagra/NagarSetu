import { FC, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Building2,
  Plus,
  Edit,
  Trash2,
  Users,
  Mail,
  Phone,
  MapPin,
  Search,
  RefreshCw,
  BarChart3,
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

interface Department {
  _id: string;
  name: string;
  code: string;
  description: string;
  contactEmail: string;
  contactPhone: string;
  address: string;
  officerCount: number;
  complaintCount: number;
  resolvedCount: number;
  createdAt: string;
}

const ManageDepartments: FC = () => {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Add/Edit Department Modal
  const [showDeptModal, setShowDeptModal] = useState(false);
  const [editingDept, setEditingDept] = useState<Department | null>(null);
  const [deptFormData, setDeptFormData] = useState({
    name: '',
    code: '',
    description: '',
    contactEmail: '',
    contactPhone: '',
    address: '',
  });
  const [savingDept, setSavingDept] = useState(false);

  useEffect(() => {
    loadDepartments();
  }, []);

  const loadDepartments = async () => {
    setIsLoading(true);
    try {
      // Mock data for now - replace with actual API call
      const mockDepartments: Department[] = [
        {
          _id: '1',
          name: 'Road and Transport Department',
          code: 'RTD',
          description: 'Handles all road maintenance and transport related complaints',
          contactEmail: 'rtd@gov.in',
          contactPhone: '+91 1234567890',
          address: 'Transport Bhawan, New Delhi',
          officerCount: 12,
          complaintCount: 245,
          resolvedCount: 189,
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 180).toISOString(),
        },
        {
          _id: '2',
          name: 'Fire Department',
          code: 'FIRE',
          description: 'Emergency fire services and fire safety complaints',
          contactEmail: 'fire@gov.in',
          contactPhone: '+91 1234567891',
          address: 'Fire Station, Central District',
          officerCount: 8,
          complaintCount: 67,
          resolvedCount: 59,
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 150).toISOString(),
        },
        {
          _id: '3',
          name: 'Police Department',
          code: 'POL',
          description: 'Law enforcement and public safety issues',
          contactEmail: 'police@gov.in',
          contactPhone: '100',
          address: 'Police Headquarters, City Center',
          officerCount: 25,
          complaintCount: 412,
          resolvedCount: 378,
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 200).toISOString(),
        },
        {
          _id: '4',
          name: 'Health Department',
          code: 'HEALTH',
          description: 'Public health, sanitation, and medical facility complaints',
          contactEmail: 'health@gov.in',
          contactPhone: '+91 1234567892',
          address: 'Health Ministry, Sector 5',
          officerCount: 15,
          complaintCount: 156,
          resolvedCount: 134,
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 120).toISOString(),
        },
      ];

      setDepartments(mockDepartments);
    } catch (error) {
      toast.error('Failed to load departments');
    } finally {
      setIsLoading(false);
    }
  };

  const openAddDeptModal = () => {
    setEditingDept(null);
    setDeptFormData({
      name: '',
      code: '',
      description: '',
      contactEmail: '',
      contactPhone: '',
      address: '',
    });
    setShowDeptModal(true);
  };

  const openEditDeptModal = (dept: Department) => {
    setEditingDept(dept);
    setDeptFormData({
      name: dept.name,
      code: dept.code,
      description: dept.description,
      contactEmail: dept.contactEmail,
      contactPhone: dept.contactPhone,
      address: dept.address,
    });
    setShowDeptModal(true);
  };

  const handleSaveDept = async () => {
    if (!deptFormData.name.trim()) {
      toast.error('Department name is required');
      return;
    }

    if (!deptFormData.code.trim()) {
      toast.error('Department code is required');
      return;
    }

    setSavingDept(true);
    try {
      if (editingDept) {
        await api.put(`/departments/${editingDept._id}`, deptFormData);
        toast.success('Department updated successfully');
      } else {
        await api.post('/departments', deptFormData);
        toast.success('Department created successfully');
      }

      setShowDeptModal(false);
      loadDepartments();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to save department');
    } finally {
      setSavingDept(false);
    }
  };

  const handleDeleteDept = async (deptId: string, deptName: string) => {
    if (!window.confirm(`Are you sure you want to delete department "${deptName}"?`)) {
      return;
    }

    try {
      await api.delete(`/departments/${deptId}`);
      toast.success('Department deleted successfully');
      loadDepartments();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to delete department');
    }
  };

  const filteredDepartments = departments.filter(dept =>
    dept.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    dept.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalOfficers = departments.reduce((sum, dept) => sum + dept.officerCount, 0);
  const totalComplaints = departments.reduce((sum, dept) => sum + dept.complaintCount, 0);
  const totalResolved = departments.reduce((sum, dept) => sum + dept.resolvedCount, 0);
  const avgResolutionRate = totalComplaints > 0 ? ((totalResolved / totalComplaints) * 100).toFixed(1) : 0;

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
              Manage Departments
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Create and manage government departments
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              icon={<RefreshCw className="w-4 h-4" />}
              onClick={loadDepartments}
              size="sm"
            >
              Refresh
            </Button>
            <Button
              variant="primary"
              icon={<Plus className="w-4 h-4" />}
              onClick={openAddDeptModal}
            >
              Add Department
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                <Building2 className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {departments.length}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Departments</p>
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {totalOfficers}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Officers</p>
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {totalComplaints}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Complaints</p>
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {avgResolutionRate}%
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Avg Resolution Rate</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Search */}
        <Card className="mb-6">
          <Input
            placeholder="Search departments by name or code..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            icon={<Search className="w-5 h-5" />}
          />
        </Card>

        {/* Departments Grid */}
        {isLoading ? (
          <Card>
            <div className="flex items-center justify-center py-12">
              <LoadingSpinner size="lg" />
            </div>
          </Card>
        ) : filteredDepartments.length === 0 ? (
          <Card>
            <div className="text-center py-12">
              <Building2 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                No departments found
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                {searchQuery
                  ? 'Try adjusting your search query'
                  : 'Get started by adding your first department'}
              </p>
              {!searchQuery && (
                <Button onClick={openAddDeptModal} icon={<Plus className="w-4 h-4" />}>
                  Add Department
                </Button>
              )}
            </div>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredDepartments.map((dept, index) => {
              const resolutionRate =
                dept.complaintCount > 0
                  ? ((dept.resolvedCount / dept.complaintCount) * 100).toFixed(1)
                  : 0;

              return (
                <motion.div
                  key={dept._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="hover:shadow-lg transition-shadow">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-start gap-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-lg">
                          {dept.code.substring(0, 2)}
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                            {dept.name}
                          </h3>
                          <Badge variant="info">{dept.code}</Badge>
                        </div>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => openEditDeptModal(dept)}
                          className="p-2 text-gray-400 hover:text-primary-600 transition-colors"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteDept(dept._id, dept.name)}
                          className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                      {dept.description}
                    </p>

                    {/* Contact Info */}
                    <div className="space-y-2 mb-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <Mail className="w-4 h-4" />
                        {dept.contactEmail}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <Phone className="w-4 h-4" />
                        {dept.contactPhone}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <MapPin className="w-4 h-4" />
                        {dept.address}
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                      <div>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">
                          {dept.officerCount}
                        </p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">Officers</p>
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">
                          {dept.complaintCount}
                        </p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">Complaints</p>
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-green-600">{resolutionRate}%</p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">Resolved</p>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        )}
      </motion.div>

      {/* Add/Edit Department Modal */}
      <Modal
        isOpen={showDeptModal}
        onClose={() => setShowDeptModal(false)}
        title={editingDept ? 'Edit Department' : 'Add New Department'}
      >
        <div className="space-y-4">
          <Input
            label="Department Name"
            value={deptFormData.name}
            onChange={e => setDeptFormData({ ...deptFormData, name: e.target.value })}
            placeholder="e.g., Road and Transport Department"
          />

          <Input
            label="Department Code"
            value={deptFormData.code}
            onChange={e =>
              setDeptFormData({ ...deptFormData, code: e.target.value.toUpperCase() })
            }
            placeholder="e.g., RTD"
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Description
            </label>
            <textarea
              value={deptFormData.description}
              onChange={e => setDeptFormData({ ...deptFormData, description: e.target.value })}
              className="input"
              rows={3}
              placeholder="Brief description of the department"
            />
          </div>

          <Input
            label="Contact Email"
            type="email"
            value={deptFormData.contactEmail}
            onChange={e => setDeptFormData({ ...deptFormData, contactEmail: e.target.value })}
            placeholder="dept@gov.in"
          />

          <Input
            label="Contact Phone"
            value={deptFormData.contactPhone}
            onChange={e => setDeptFormData({ ...deptFormData, contactPhone: e.target.value })}
            placeholder="+91 XXXXX XXXXX"
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Address
            </label>
            <textarea
              value={deptFormData.address}
              onChange={e => setDeptFormData({ ...deptFormData, address: e.target.value })}
              className="input"
              rows={2}
              placeholder="Department office address"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-4">
            <Button variant="outline" onClick={() => setShowDeptModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleSaveDept} loading={savingDept}>
              {editingDept ? 'Update Department' : 'Create Department'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ManageDepartments;
