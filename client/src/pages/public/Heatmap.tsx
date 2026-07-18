import { FC, useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Icon } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { fetchHeatmapData } from '../../store/slices/complaintSlice';
import Card from '../../components/Card';
import Badge from '../../components/Badge';
import LoadingSpinner from '../../components/LoadingSpinner';
import { COMPLAINT_CATEGORIES, MAP_CONFIG } from '../../constants';
import { snakeToTitle } from '../../utils/format';
import { motion } from 'framer-motion';

// Fix Leaflet default icon issue
delete (Icon.Default.prototype as any)._getIconUrl;
Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom marker icons based on priority (using emojis)
const getMarkerIcon = (priority: string) => {
  const colors: Record<string, string> = {
    low: '🟢',
    medium: '🟡',
    high: '🟠',
    critical: '🔴',
  };
  
  return new Icon({
    iconUrl: `data:image/svg+xml;base64,${btoa(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="32" height="32">
        <text x="12" y="16" font-size="20" text-anchor="middle">${colors[priority] || '🔵'}</text>
      </svg>
    `)}`,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  });
};

const HeatmapPage: FC = () => {
  const dispatch = useAppDispatch();
  const { heatmapData, isLoading } = useAppSelector((state) => state.complaints);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedPriority, setSelectedPriority] = useState<string>('');

  useEffect(() => {
    dispatch(fetchHeatmapData({ category: selectedCategory, priority: selectedPriority }));
  }, [dispatch, selectedCategory, selectedPriority]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
              Live Complaint Heatmap
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Real-time visualization of civic complaints across the region
            </p>
          </div>

          {/* Filters */}
          <Card className="mb-6">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-2">
                  Filter by Category
                </label>
                <select
                  className="input"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                >
                  <option value="">All Categories</option>
                  {COMPLAINT_CATEGORIES.map((cat) => (
                    <option key={cat.value} value={cat.value}>
                      {cat.icon} {cat.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-2">
                  Filter by Priority
                </label>
                <select
                  className="input"
                  value={selectedPriority}
                  onChange={(e) => setSelectedPriority(e.target.value)}
                >
                  <option value="">All Priorities</option>
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="critical">Critical</option>
                </select>
              </div>
            </div>

            {/* Legend */}
            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Priority Legend:
              </p>
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-xl">🟢</span>
                  <span className="text-sm text-gray-600 dark:text-gray-400">Low</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xl">🟡</span>
                  <span className="text-sm text-gray-600 dark:text-gray-400">Medium</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xl">🟠</span>
                  <span className="text-sm text-gray-600 dark:text-gray-400">High</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xl">🔴</span>
                  <span className="text-sm text-gray-600 dark:text-gray-400">Critical</span>
                </div>
              </div>
            </div>
          </Card>

          {/* Map */}
          <Card padding="none" className="overflow-hidden">
            {isLoading ? (
              <div className="h-[600px] flex items-center justify-center">
                <LoadingSpinner size="lg" text="Loading map data..." />
              </div>
            ) : (
              <div className="h-[600px] relative">
                <MapContainer
                  center={MAP_CONFIG.DEFAULT_CENTER}
                  zoom={MAP_CONFIG.DEFAULT_ZOOM}
                  style={{ height: '100%', width: '100%' }}
                  className="z-0"
                >
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />

                  {heatmapData.map((complaint: any) => (
                    <Marker
                      key={complaint.id}
                      position={[complaint.lat, complaint.lng]}
                      icon={getMarkerIcon(complaint.priority)}
                    >
                      <Popup>
                        <div className="p-2 min-w-[200px]">
                          <h3 className="font-semibold text-gray-900 mb-2">
                            {complaint.title}
                          </h3>
                          <div className="space-y-1 text-sm">
                            <div className="flex items-center gap-2">
                              <Badge
                                variant={
                                  complaint.priority === 'critical' ? 'danger' :
                                  complaint.priority === 'high' ? 'warning' :
                                  'info'
                                }
                                size="sm"
                              >
                                {complaint.priority}
                              </Badge>
                              <Badge variant="info" size="sm">
                                {snakeToTitle(complaint.status)}
                              </Badge>
                            </div>
                            <p className="text-gray-600">
                              ID: {complaint.complaintId}
                            </p>
                            <p className="text-gray-600 capitalize">
                              {complaint.category.replace('_', ' ')}
                            </p>
                          </div>
                        </div>
                      </Popup>
                    </Marker>
                  ))}
                </MapContainer>
              </div>
            )}
          </Card>

          {/* Stats */}
          <Card className="mt-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  {heatmapData.length}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Total Complaints
                </p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-red-600">
                  {heatmapData.filter((c: any) => c.priority === 'critical').length}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Critical</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-orange-600">
                  {heatmapData.filter((c: any) => c.priority === 'high').length}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">High</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-yellow-600">
                  {heatmapData.filter((c: any) => c.priority === 'medium').length}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Medium</p>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default HeatmapPage;
