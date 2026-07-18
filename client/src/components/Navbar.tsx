import { FC, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, Moon, Sun } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { toggleTheme } from '../store/slices/uiSlice';
import Button from './Button';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar: FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isAuthenticated, user } = useAuth();
  const { theme } = useAppSelector((state) => state.ui);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleThemeToggle = () => {
    dispatch(toggleTheme());
  };

  const getDashboardLink = () => {
    if (!user) return '/login';
    
    const dashboardMap: Record<string, string> = {
      citizen: '/citizen/dashboard',
      officer: '/officer/dashboard',
      department_admin: '/admin/dashboard',
      super_admin: '/admin/dashboard',
    };
    
    return dashboardMap[user.role] || '/';
  };

  return (
    <nav className="sticky top-0 z-30 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-b border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-primary-600 to-secondary-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">N</span>
            </div>
            <span className="text-xl font-bold gradient-text hidden sm:block">
              Nagar Setu
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              to="/heatmap"
              className="text-gray-700 hover:text-primary-600 dark:text-gray-300 dark:hover:text-primary-400 transition-colors"
            >
              Live Map
            </Link>
            <Link
              to="/track"
              className="text-gray-700 hover:text-primary-600 dark:text-gray-300 dark:hover:text-primary-400 transition-colors"
            >
              Track Complaint
            </Link>

            {/* Theme Toggle */}
            <button
              onClick={handleThemeToggle}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? (
                <Sun className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              ) : (
                <Moon className="w-5 h-5 text-gray-600" />
              )}
            </button>

            {/* Auth Buttons */}
            {isAuthenticated ? (
              <Button onClick={() => navigate(getDashboardLink())} size="sm">
                Dashboard
              </Button>
            ) : (
              <div className="flex items-center space-x-3">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate('/login')}
                >
                  Login
                </Button>
                <Button size="sm" onClick={() => navigate('/register')}>
                  Register
                </Button>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-gray-200 dark:border-gray-800"
          >
            <div className="px-4 py-4 space-y-3">
              <Link
                to="/heatmap"
                className="block px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Live Map
              </Link>
              <Link
                to="/track"
                className="block px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Track Complaint
              </Link>

              <div className="pt-3 border-t border-gray-200 dark:border-gray-800">
                {isAuthenticated ? (
                  <Button
                    fullWidth
                    onClick={() => {
                      navigate(getDashboardLink());
                      setMobileMenuOpen(false);
                    }}
                  >
                    Dashboard
                  </Button>
                ) : (
                  <div className="space-y-2">
                    <Button
                      fullWidth
                      variant="outline"
                      onClick={() => {
                        navigate('/login');
                        setMobileMenuOpen(false);
                      }}
                    >
                      Login
                    </Button>
                    <Button
                      fullWidth
                      onClick={() => {
                        navigate('/register');
                        setMobileMenuOpen(false);
                      }}
                    >
                      Register
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
