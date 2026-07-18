import { FC, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import {
  ArrowLeft,
  MapPin,
  Calendar,
  User,
  Building2,
  FileText,
  Image as ImageIcon,
  Video,
  File,
  Clock,
  MessageSquare,
  CheckCircle,
  XCircle,
  AlertCircle,
  Send,
  Paperclip,
  TrendingUp,
  Hash,
} from 'lucide-react';
import toast from 'react-hot-toast';

import Card from '../../components/Card';
import Badge from '../../components/Badge';
import Button from '../../components/Button';
import LoadingSpinner from '../../components/LoadingSpinner';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { fetchComplaintById } from '../../store/slices/complaintSlice';
import { STATUS_COLORS, PRIORITY_COLORS, COMPLAINT_CATEGORIES } from '../../constants';
import { formatDate, formatRelativeTime } from '../../utils/format';

// Fix leaflet default marker icon
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const ComplaintDetail: FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { selectedComplaint: complaint, isLoading } = useAppSelector(state => state.complaints);
  const { user } = useAppSelector(state => state.auth);

  const [chatMessage, setChatMessage] = useState('');
  const [sendingMessage, setSendingMessage] = useState(false);
  const [activeTab, setActiveTab] = useState<'details' | 'timeline' | 'chat'>('details');

  useEffect(() => {
    if (id) {
      dispatch(fetchComplaintById({ id }));
    }
  }, [id, dispatch]);

  const handleSendMessage = async () => {
    if (!chatMessage.trim()) return;

    setSendingMessage(true);
    try {
      // TODO: Implement chat service
      toast.success('Message sent successfully');
      setChatMessage('');
    } catch (error) {
      toast.error('Failed to send message');
    } finally {
      setSendingMessage(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!complaint) {
    return (
      <div className="max-w-4xl mx-auto">
        <Card>
          <div className="text-center py-12">
            <XCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Complaint Not Found
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              The complaint you're looking for doesn't exist or you don't have access to it.
            </p>
            <Button onClick={() => navigate('/citizen/my-complaints')}>
              Go to My Complaints
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  const statusColor = STATUS_COLORS[complaint.status as keyof typeof STATUS_COLORS];
  const priorityColor = PRIORITY_COLORS[complaint.priority as keyof typeof PRIORITY_COLORS];
  const categoryInfo = COMPLAINT_CATEGORIES.find(c => c.value === complaint.category);

  return (
    <div className="max-w-7xl mx-auto">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-6 transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
        <span>Back</span>
      </button>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                {complaint.title}
              </h1>
            </div>
            <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
              <span className="flex items-center gap-1">
                <Hash className="w-4 h-4" />
                {complaint.complaintId}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {formatDate(complaint.createdAt)}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {formatRelativeTime(complaint.createdAt)}
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Badge className={`${statusColor.bg} ${statusColor.text} ${statusColor.dark}`}>
              {complaint.status.replace(/_/g, ' ').toUpperCase()}
            </Badge>
            <Badge className={`${priorityColor.bg} ${priorityColor.text} ${priorityColor.dark}`}>
              {complaint.priority.toUpperCase()} PRIORITY
            </Badge>
            {categoryInfo && (
              <Badge variant="info">
                {categoryInfo.icon} {categoryInfo.label}
              </Badge>
            )}
          </div>
        </div>
      </motion.div>

      {/* Tabs */}
      <div className="flex gap-4 mb-6 border-b border-gray-200 dark:border-gray-700">
        {['details', 'timeline', 'chat'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab as any)}
            className={`px-4 py-2 font-medium capitalize transition-colors border-b-2 ${
              activeTab === tab
                ? 'border-primary-600 text-primary-600 dark:text-primary-400'
                : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {activeTab === 'details' && (
            <>
              {/* Description */}
              <Card>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  Description
                </h2>
                <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                  {complaint.description}
                </p>
              </Card>

              {/* AI Analysis */}
              {complaint.aiAnalysis && (
                <Card>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                    AI Analysis
                  </h2>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          Predicted Category
                        </span>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {complaint.aiAnalysis.predictedCategory}
                        </p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-600 dark:text-gray-400">Sentiment</span>
                        <p className="font-medium text-gray-900 dark:text-white capitalize">
                          {complaint.aiAnalysis.sentiment}
                        </p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          Urgency Score
                        </span>
                        <div className="flex items-center gap-2">
                          <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-primary-600"
                              style={{ width: `${complaint.aiAnalysis.urgencyScore}%` }}
                            />
                          </div>
                          <span className="text-sm font-medium text-gray-900 dark:text-white">
                            {complaint.aiAnalysis.urgencyScore}%
                          </span>
                        </div>
                      </div>
                      <div>
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          Confidence
                        </span>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {(complaint.aiAnalysis.confidence * 100).toFixed(1)}%
                        </p>
                      </div>
                    </div>

                    {complaint.aiAnalysis.summary && (
                      <div>
                        <span className="text-sm text-gray-600 dark:text-gray-400">Summary</span>
                        <p className="text-gray-900 dark:text-white">
                          {complaint.aiAnalysis.summary}
                        </p>
                      </div>
                    )}

                    {complaint.aiAnalysis.keywords && complaint.aiAnalysis.keywords.length > 0 && (
                      <div>
                        <span className="text-sm text-gray-600 dark:text-gray-400 block mb-2">
                          Keywords
                        </span>
                        <div className="flex flex-wrap gap-2">
                          {complaint.aiAnalysis.keywords.map((keyword, index) => (
                            <Badge key={index} variant="info">
                              {keyword}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </Card>
              )}

              {/* Media */}
              {complaint.media && (complaint.media.images?.length || complaint.media.videos?.length || complaint.media.documents?.length) ? (
                <Card>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                    Attachments
                  </h2>

                  {/* Images */}
                  {complaint.media.images && complaint.media.images.length > 0 && (
                    <div className="mb-6">
                      <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                        <ImageIcon className="w-4 h-4" />
                        Images ({complaint.media.images.length})
                      </h3>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {complaint.media.images.map((img, index) => (
                          <div
                            key={index}
                            className="aspect-video rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800"
                          >
                            <img
                              src={img.url}
                              alt={img.caption || `Image ${index + 1}`}
                              className="w-full h-full object-cover hover:scale-105 transition-transform cursor-pointer"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Videos */}
                  {complaint.media.videos && complaint.media.videos.length > 0 && (
                    <div className="mb-6">
                      <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                        <Video className="w-4 h-4" />
                        Videos ({complaint.media.videos.length})
                      </h3>
                      <div className="space-y-3">
                        {complaint.media.videos.map((video, index) => (
                          <video key={index} controls className="w-full rounded-lg">
                            <source src={video.url} type="video/mp4" />
                            Your browser does not support the video tag.
                          </video>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Documents */}
                  {complaint.media.documents && complaint.media.documents.length > 0 && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                        <File className="w-4 h-4" />
                        Documents ({complaint.media.documents.length})
                      </h3>
                      <div className="space-y-2">
                        {complaint.media.documents.map((doc, index) => (
                          <a
                            key={index}
                            href={doc.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                          >
                            <File className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                            <span className="text-gray-900 dark:text-white">{doc.filename}</span>
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </Card>
              ) : null}

              {/* Location Map */}
              <Card>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  Location
                </h2>
                <div className="space-y-4">
                  <div>
                    <p className="text-gray-900 dark:text-white">{complaint.location.address}</p>
                    <p className="text-gray-600 dark:text-gray-400">
                      {complaint.location.district}, {complaint.location.state}{' '}
                      {complaint.location.pincode}
                    </p>
                    {complaint.location.landmark && (
                      <p className="text-sm text-gray-500 dark:text-gray-500">
                        Near: {complaint.location.landmark}
                      </p>
                    )}
                  </div>

                  <div className="h-64 rounded-lg overflow-hidden">
                    <MapContainer
                      center={[complaint.location.coordinates[1], complaint.location.coordinates[0]]}
                      zoom={15}
                      style={{ height: '100%', width: '100%' }}
                    >
                      <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      />
                      <Marker
                        position={[
                          complaint.location.coordinates[1],
                          complaint.location.coordinates[0],
                        ]}
                      >
                        <Popup>{complaint.title}</Popup>
                      </Marker>
                    </MapContainer>
                  </div>
                </div>
              </Card>
            </>
          )}

          {activeTab === 'timeline' && (
            <Card>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                Status Timeline
              </h2>

              <div className="relative">
                {/* Timeline Line */}
                <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200 dark:bg-gray-700" />

                {/* Timeline Items */}
                <div className="space-y-6">
                  {complaint.statusHistory.map((history, index) => {
                    const isLatest = index === complaint.statusHistory.length - 1;
                    return (
                      <div key={index} className="relative flex gap-4">
                        <div
                          className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center border-2 z-10 ${
                            isLatest
                              ? 'bg-primary-600 border-primary-600'
                              : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600'
                          }`}
                        >
                          {isLatest ? (
                            <CheckCircle className="w-5 h-5 text-white" />
                          ) : (
                            <div className="w-2 h-2 rounded-full bg-gray-400 dark:bg-gray-600" />
                          )}
                        </div>

                        <div className="flex-1 pb-6">
                          <div className="flex items-center justify-between mb-1">
                            <h3 className="font-semibold text-gray-900 dark:text-white capitalize">
                              {history.status.replace(/_/g, ' ')}
                            </h3>
                            <span className="text-sm text-gray-500 dark:text-gray-400">
                              {formatRelativeTime(history.timestamp)}
                            </span>
                          </div>

                          {history.remarks && (
                            <p className="text-gray-600 dark:text-gray-400 mb-2">
                              {history.remarks}
                            </p>
                          )}

                          {history.updatedBy && (
                            <p className="text-sm text-gray-500 dark:text-gray-500">
                              Updated by {history.updatedBy.name}
                            </p>
                          )}

                          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                            {formatDate(history.timestamp)}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </Card>
          )}

          {activeTab === 'chat' && (
            <Card className="h-[600px] flex flex-col">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Communication
              </h2>

              {/* Chat Messages */}
              <div className="flex-1 overflow-y-auto mb-4 space-y-4">
                <div className="text-center py-8">
                  <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-600 dark:text-gray-400">
                    No messages yet. Start a conversation with the assigned officer.
                  </p>
                </div>

                {/* Example messages would go here */}
              </div>

              {/* Chat Input */}
              <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                <div className="flex gap-2">
                  <button
                    type="button"
                    className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                  >
                    <Paperclip className="w-5 h-5" />
                  </button>
                  <input
                    type="text"
                    value={chatMessage}
                    onChange={e => setChatMessage(e.target.value)}
                    onKeyPress={e => e.key === 'Enter' && handleSendMessage()}
                    placeholder="Type your message..."
                    className="flex-1 input"
                  />
                  <Button
                    onClick={handleSendMessage}
                    loading={sendingMessage}
                    disabled={!chatMessage.trim()}
                    icon={<Send className="w-4 h-4" />}
                  >
                    Send
                  </Button>
                </div>
              </div>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Citizen Info */}
          {!complaint.isAnonymous && complaint.citizen && (
            <Card>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <User className="w-5 h-5" />
                Citizen Information
              </h3>
              <div className="space-y-3">
                <div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">Name</span>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {complaint.citizen.name}
                  </p>
                </div>
                <div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">Email</span>
                  <p className="text-gray-900 dark:text-white">{complaint.citizen.email}</p>
                </div>
                {complaint.citizen.phone && (
                  <div>
                    <span className="text-sm text-gray-600 dark:text-gray-400">Phone</span>
                    <p className="text-gray-900 dark:text-white">{complaint.citizen.phone}</p>
                  </div>
                )}
              </div>
            </Card>
          )}

          {complaint.isAnonymous && (
            <Card>
              <div className="flex items-center gap-3 text-orange-600 dark:text-orange-400">
                <AlertCircle className="w-5 h-5" />
                <span className="font-medium">Anonymous Complaint</span>
              </div>
            </Card>
          )}

          {/* Department Info */}
          {complaint.department && (
            <Card>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <Building2 className="w-5 h-5" />
                Department
              </h3>
              <div className="space-y-3">
                <div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">Name</span>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {complaint.department.name}
                  </p>
                </div>
                <div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">Code</span>
                  <p className="text-gray-900 dark:text-white">{complaint.department.code}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">Contact</span>
                  <p className="text-gray-900 dark:text-white">
                    {complaint.department.contactEmail}
                  </p>
                </div>
              </div>
            </Card>
          )}

          {/* Officer Info */}
          {complaint.assignedOfficer && (
            <Card>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <User className="w-5 h-5" />
                Assigned Officer
              </h3>
              <div className="space-y-3">
                <div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">Name</span>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {complaint.assignedOfficer.name}
                  </p>
                </div>
                <div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">Designation</span>
                  <p className="text-gray-900 dark:text-white">
                    {complaint.assignedOfficer.designation}
                  </p>
                </div>
                <div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">Email</span>
                  <p className="text-gray-900 dark:text-white">
                    {complaint.assignedOfficer.email}
                  </p>
                </div>
              </div>
            </Card>
          )}

          {/* Stats */}
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Statistics
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Views</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {complaint.views}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Created</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {formatDate(complaint.createdAt)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Last Updated</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {formatRelativeTime(complaint.updatedAt)}
                </span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ComplaintDetail;
