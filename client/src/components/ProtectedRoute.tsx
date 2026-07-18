import { FC, ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import LoadingSpinner from './LoadingSpinner';

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRole?: string | string[];
}

const ProtectedRoute: FC<ProtectedRouteProps> = ({ children, requiredRole }) => {
  const { isAuthenticated, isLoading, user } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading..." />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Check role if specified
  if (requiredRole && user) {
    const roles = Array.isArray(requiredRole) ? requiredRole : [requiredRole];
    
    if (!roles.includes(user.role)) {
      // Redirect to appropriate dashboard based on user role
      const redirectMap: Record<string, string> = {
        citizen: '/citizen/dashboard',
        officer: '/officer/dashboard',
        department_admin: '/admin/dashboard',
        super_admin: '/admin/dashboard',
      };
      
      return <Navigate to={redirectMap[user.role] || '/'} replace />;
    }
  }

  return <>{children}</>;
};

export default ProtectedRoute;
