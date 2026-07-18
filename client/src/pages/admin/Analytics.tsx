import { FC } from 'react';
import Card from '../../components/Card';
import { BarChart3 } from 'lucide-react';

const Analytics: FC = () => {
  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
        Analytics & Reports
      </h1>
      <Card>
        <div className="text-center py-12">
          <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Analytics Dashboard
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Charts, graphs, and detailed analytics with Recharts visualizations.
          </p>
        </div>
      </Card>
    </div>
  );
};

export default Analytics;
