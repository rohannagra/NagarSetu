import { FC, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Search, FileText } from 'lucide-react';
import Card from '../../components/Card';
import Button from '../../components/Button';
import Input from '../../components/Input';
import Badge from '../../components/Badge';
import { motion } from 'framer-motion';
import complaintService from '../../services/complaintService';
import { Complaint } from '../../types/complaint';
import { formatDate, snakeToTitle } from '../../utils/format';
import toast from 'react-hot-toast';

interface TrackFormData {
  identifier: string;
}

const TrackComplaint: FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [complaint, setComplaint] = useState<Complaint | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TrackFormData>();

  const onSubmit = async (data: TrackFormData) => {
    setIsLoading(true);
    setComplaint(null);
    
    try {
      const response = await complaintService.trackComplaint(data.identifier);
      setComplaint(response.data.complaint);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Complaint not found');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Track Your Complaint
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Enter your complaint ID or tracking token to view status
            </p>
          </div>

          {/* Search Form */}
          <Card className="mb-8">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <Input
                label="Complaint ID or Tracking Token"
                placeholder="e.g., NGS2024000001 or ANO-xxxxx"
                icon={<Search className="w-5 h-5" />}
                error={errors.identifier?.message}
                {...register('identifier', {
                  required: 'Please enter a complaint ID or token',
                  minLength: {
                    value: 5,
                    message: 'Invalid ID format',
                  },
                })}
              />
              <Button type="submit" fullWidth loading={isLoading}>
                Track Complaint
              </Button>
            </form>
          </Card>

          {/* Complaint Details */}
          {complaint && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card>
                <div className="space-y-6">
                  {/* Header */}
                  <div className="flex items-start justify-between">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                        {complaint.title}
                      </h2>
                      <div className="flex items-center gap-3">
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          {complaint.complaintId}
                        </span>
                        <Badge
                          variant={
                            complaint.priority === 'critical' ? 'danger' :
                            complaint.priority === 'high' ? 'warning' :
                            complaint.priority === 'medium' ? 'info' : 'default'
                          }
                        >
                          {complaint.priority}
                        </Badge>
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
                    </div>
                  </div>

                  {/* Details */}
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Category
                      </h3>
                      <p className="text-gray-900 dark:text-white capitalize">
                        {complaint.category.replace('_', ' ')}
                      </p>
                    </div>

                    <div>
                      <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Submitted On
                      </h3>
                      <p className="text-gray-900 dark:text-white">
                        {formatDate(complaint.createdAt, 'MMM dd, yyyy hh:mm a')}
                      </p>
                    </div>

                    {complaint.department && (
                      <div>
                        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                          Department
                        </h3>
                        <p className="text-gray-900 dark:text-white">
                          {complaint.department.name}
                        </p>
                      </div>
                    )}

                    {complaint.assignedOfficer && (
                      <div>
                        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                          Assigned Officer
                        </h3>
                        <p className="text-gray-900 dark:text-white">
                          {complaint.assignedOfficer.name}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Description */}
                  <div>
                    <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Description
                    </h3>
                    <p className="text-gray-900 dark:text-white">
                      {complaint.description}
                    </p>
                  </div>

                  {/* Location */}
                  <div>
                    <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Location
                    </h3>
                    <p className="text-gray-900 dark:text-white">
                      {complaint.location.address}, {complaint.location.district},{' '}
                      {complaint.location.state}
                    </p>
                  </div>

                  {/* Status Timeline */}
                  {complaint.statusHistory && complaint.statusHistory.length > 0 && (
                    <div>
                      <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">
                        Status Timeline
                      </h3>
                      <div className="space-y-4">
                        {complaint.statusHistory.map((history, index) => (
                          <div key={index} className="flex gap-4">
                            <div className="flex flex-col items-center">
                              <div className="w-3 h-3 rounded-full bg-primary-600" />
                              {index < complaint.statusHistory.length - 1 && (
                                <div className="w-0.5 h-full bg-gray-300 dark:bg-gray-600 mt-1" />
                              )}
                            </div>
                            <div className="flex-1 pb-4">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="font-medium text-gray-900 dark:text-white">
                                  {snakeToTitle(history.status)}
                                </span>
                                <span className="text-sm text-gray-500 dark:text-gray-400">
                                  {formatDate(history.timestamp, 'MMM dd, yyyy hh:mm a')}
                                </span>
                              </div>
                              {history.remarks && (
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                  {history.remarks}
                                </p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </Card>
            </motion.div>
          )}

          {/* Info Card */}
          {!complaint && (
            <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
              <div className="flex items-start gap-3">
                <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-blue-800 dark:text-blue-300">
                  <p className="font-medium mb-1">How to track?</p>
                  <ul className="space-y-1 list-disc list-inside">
                    <li>Use your complaint ID (e.g., NGS2024000001)</li>
                    <li>Or use your anonymous tracking token if you submitted anonymously</li>
                    <li>You can find this information in your email confirmation</li>
                  </ul>
                </div>
              </div>
            </Card>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default TrackComplaint;
