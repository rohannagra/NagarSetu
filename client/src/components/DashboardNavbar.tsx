import { FC } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, Bell, Moon, Sun, LogOut, User } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { toggleSidebar, toggleTheme } from '../store/slices/uiSlice';
import { logout } from '../store/slices/authSlice';
import toast from 'react-hot-toast';

const DashboardNavbar: FC = () => {
  const { user } = useAuth();
  const { theme } = useAppSelector((state) => state.ui);
  const { unreadCount } = useAppSelector((state) => state.notifications);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      // Clear local storage immediately
      localStorage.removeItem('token');
      
      // Try to notify backend (don't wait for it)
      dispatch(logout()).catch(() => {
        // Ignore backend errors during logout
      });
      
      toast.success('Logged out successfully');
      
      // Force navigation and reload
      navigate('/login');
      
      // Reload page to clear all state
      setTimeout(() => {
        window.location.reload();
      }, 100);
    } catch (error) {
      // Even if dispatch fails, still logout locally
      localStorage.removeItem('token');
      navigate('/login');
      window.location.reload();
    }
  };

  const getNotificationPath = () => {
    if (user?.role === 'citizen') return '/citizen/notifications';
    if (user?.role === 'officer') return '/officer/notifications';
    return '/admin/notifications';
  };

  const getProfilePath = () => {
    if (user?.role === 'citizen') return '/citizen/profile';
    if (user?.role === 'officer') return '/officer/profile';
    return '/admin/profile';
  };

  return (
    <nav className="sticky top-0 z-30 bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg border-b border-gray-200 dark:border-gray-700">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Left Side */}
          <div className="flex items-center space-x-4">
            <button
              onClick={() => dispatch(toggleSidebar())}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              aria-label="Toggle sidebar"
            >
              <Menu className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </button>

            <div className="hidden sm:flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-primary-600 to-secondary-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">N</span>
              </div>
              <span className="text-xl font-bold gradient-text">Nagar Setu</span>
            </div>
          </div>

          {/* Right Side */}
          <div className="flex items-center space-x-2">
            {/* Theme Toggle */}
            <button
              onClick={() => dispatch(toggleTheme())}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? (
                <Sun className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              ) : (
                <Moon className="w-5 h-5 text-gray-600" />
              )}
            </button>

            {/* Notifications */}
            <button
              onClick={() => navigate(getNotificationPath())}
              className="relative p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              aria-label="Notifications"
            >
              <Bell className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>

            {/* Profile Menu */}
            <div className="relative group">
              <button
                className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                aria-label="Profile menu"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-600 to-secondary-600 flex items-center justify-center text-white font-semibold text-sm">
                  {user?.name?.charAt(0).toUpperCase()}
                </div>
                <span className="hidden md:block text-sm font-medium text-gray-700 dark:text-gray-300">
                  {user?.name}
                </span>
              </button>

              {/* Dropdown Menu */}
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                <div className="p-2">
                  <button
                    onClick={() => navigate(getProfilePath())}
                    className="flex items-center w-full px-3 py-2 text-sm text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    <User className="w-4 h-4 mr-2" />
                    Profile
                  </button>
                  <button
                    onClick={handleLogout}
                    className="flex items-center w-full px-3 py-2 text-sm text-red-600 dark:text-red-400 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default DashboardNavbar;
