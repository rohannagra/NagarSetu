import { FC } from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';
import Button from '../components/Button';

const NotFoundPage: FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
      <div className="text-center">
        <div className="mb-8">
          <h1 className="text-9xl font-bold gradient-text">404</h1>
          <p className="text-2xl font-semibold text-gray-900 dark:text-white mt-4">
            Page Not Found
          </p>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            The page you're looking for doesn't exist or has been moved.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button
            variant="outline"
            icon={<ArrowLeft className="w-4 h-4" />}
            onClick={() => navigate(-1)}
          >
            Go Back
          </Button>
          <Button
            icon={<Home className="w-4 h-4" />}
            onClick={() => navigate('/')}
          >
            Go Home
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
