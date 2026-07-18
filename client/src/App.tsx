import { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useAppDispatch, useAppSelector } from './hooks/redux';
import { checkAuth } from './store/slices/authSlice';

// Layouts
import MainLayout from './layouts/MainLayout';
import DashboardLayout from './layouts/DashboardLayout';

// Public Pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';
import ResetPasswordPage from './pages/auth/ResetPasswordPage';

// Citizen Pages
import CitizenDashboard from './pages/citizen/Dashboard';
import SubmitComplaint from './pages/citizen/SubmitComplaint';
import MyComplaints from './pages/citizen/MyComplaints';
import ComplaintDetail from './pages/citizen/ComplaintDetail';
import TrackComplaint from './pages/public/TrackComplaint';

// Officer Pages
import OfficerDashboard from './pages/officer/Dashboard';
import OfficerComplaints from './pages/officer/Complaints';

// Admin Pages
import AdminDashboard from './pages/admin/Dashboard';
import ManageUsers from './pages/admin/ManageUsers';
import ManageDepartments from './pages/admin/ManageDepartments';
import Analytics from './pages/admin/Analytics';

// Common Pages
import ProfilePage from './pages/common/Profile';
import NotificationsPage from './pages/common/Notifications';
import HeatmapPage from './pages/public/Heatmap';
import NotFoundPage from './pages/NotFoundPage';

// Components
import ProtectedRoute from './components/ProtectedRoute';
import LoadingSpinner from './components/LoadingSpinner';

function App() {
  const dispatch = useAppDispatch();
  const { isLoading, isAuthenticated } = useAppSelector((state) => state.auth);

  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<MainLayout />}>
          <Route index element={<LandingPage />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />
          <Route path="forgot-password" element={<ForgotPasswordPage />} />
          <Route path="reset-password" element={<ResetPasswordPage />} />
          <Route path="track" element={<TrackComplaint />} />
          <Route path="heatmap" element={<HeatmapPage />} />
        </Route>

        {/* Citizen Routes */}
        <Route
          path="/citizen"
          element={
            <ProtectedRoute requiredRole="citizen">
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/citizen/dashboard" replace />} />
          <Route path="dashboard" element={<CitizenDashboard />} />
          <Route path="submit" element={<SubmitComplaint />} />
          <Route path="submit-complaint" element={<SubmitComplaint />} />
          <Route path="complaints" element={<MyComplaints />} />
          <Route path="my-complaints" element={<MyComplaints />} />
          <Route path="complaints/:id" element={<ComplaintDetail />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="notifications" element={<NotificationsPage />} />
        </Route>

        {/* Officer Routes */}
        <Route
          path="/officer"
          element={
            <ProtectedRoute requiredRole="officer">
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/officer/dashboard" replace />} />
          <Route path="dashboard" element={<OfficerDashboard />} />
          <Route path="complaints" element={<OfficerComplaints />} />
          <Route path="complaints/:id" element={<ComplaintDetail />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="notifications" element={<NotificationsPage />} />
        </Route>

        {/* Admin Routes */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute requiredRole={['department_admin', 'super_admin']}>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="users" element={<ManageUsers />} />
          <Route path="departments" element={<ManageDepartments />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="notifications" element={<NotificationsPage />} />
        </Route>

        {/* 404 Route */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>

      {/* Global Toast Notifications */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
          },
          success: {
            duration: 3000,
            iconTheme: {
              primary: '#10b981',
              secondary: '#fff',
            },
          },
          error: {
            duration: 4000,
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
          },
        }}
      />
    </>
  );
}

export default App;
