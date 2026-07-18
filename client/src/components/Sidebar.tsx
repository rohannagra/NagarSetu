import { FC } from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  FileText,
  Plus,
  Bell,
  User,
  Users,
  Building2,
  BarChart3,
  X,
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { setSidebarOpen } from '../store/slices/uiSlice';
import clsx from 'clsx';

const Sidebar: FC = () => {
  const { user, isCitizen, isOfficer, isAdmin } = useAuth();
  const { sidebarOpen } = useAppSelector((state) => state.ui);
  const dispatch = useAppDispatch();

  const getNavigationItems = () => {
    const baseRoute = isCitizen ? '/citizen' : isOfficer ? '/officer' : '/admin';

    const citizenNav = [
      { icon: LayoutDashboard, label: 'Dashboard', path: `${baseRoute}/dashboard` },
      { icon: Plus, label: 'Submit Complaint', path: `${baseRoute}/submit` },
      { icon: FileText, label: 'My Complaints', path: `${baseRoute}/complaints` },
      { icon: Bell, label: 'Notifications', path: `${baseRoute}/notifications` },
      { icon: User, label: 'Profile', path: `${baseRoute}/profile` },
    ];

    const officerNav = [
      { icon: LayoutDashboard, label: 'Dashboard', path: `${baseRoute}/dashboard` },
      { icon: FileText, label: 'Complaints', path: `${baseRoute}/complaints` },
      { icon: Bell, label: 'Notifications', path: `${baseRoute}/notifications` },
      { icon: User, label: 'Profile', path: `${baseRoute}/profile` },
    ];

    const adminNav = [
      { icon: LayoutDashboard, label: 'Dashboard', path: `${baseRoute}/dashboard` },
      { icon: Users, label: 'Manage Users', path: `${baseRoute}/users` },
      { icon: Building2, label: 'Departments', path: `${baseRoute}/departments` },
      { icon: BarChart3, label: 'Analytics', path: `${baseRoute}/analytics` },
      { icon: Bell, label: 'Notifications', path: `${baseRoute}/notifications` },
      { icon: User, label: 'Profile', path: `${baseRoute}/profile` },
    ];

    if (isCitizen) return citizenNav;
    if (isOfficer) return officerNav;
    if (isAdmin) return adminNav;
    return [];
  };

  const navItems = getNavigationItems();

  return (
    <>
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => dispatch(setSidebarOpen(false))}
        />
      )}

      {/* Sidebar */}
      <aside
        className={clsx(
          'fixed top-0 left-0 z-50 h-screen w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-transform duration-300',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full',
          'lg:translate-x-0 lg:top-16'
        )}
      >
        <div className="h-full flex flex-col">
          {/* Header (Mobile) */}
          <div className="lg:hidden flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-primary-600 to-secondary-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">N</span>
              </div>
              <span className="font-semibold text-gray-900 dark:text-white">
                Nagar Setu
              </span>
            </div>
            <button
              onClick={() => dispatch(setSidebarOpen(false))}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* User Info */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-600 to-secondary-600 flex items-center justify-center text-white font-semibold">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                  {user?.name}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate capitalize">
                  {user?.role?.replace('_', ' ')}
                </p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto p-4 space-y-1">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => {
                  // Close sidebar on mobile after clicking
                  if (window.innerWidth < 1024) {
                    dispatch(setSidebarOpen(false));
                  }
                }}
                className={({ isActive }) =>
                  clsx(
                    'flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-colors',
                    isActive
                      ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    <item.icon
                      className={clsx(
                        'w-5 h-5',
                        isActive
                          ? 'text-primary-600 dark:text-primary-400'
                          : 'text-gray-500 dark:text-gray-400'
                      )}
                    />
                    <span className="font-medium">{item.label}</span>
                  </>
                )}
              </NavLink>
            ))}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <p className="text-xs text-center text-gray-500 dark:text-gray-400">
              Nagar Setu v1.0.0
            </p>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
