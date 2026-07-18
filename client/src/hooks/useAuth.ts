import { useAppSelector } from './redux';

export const useAuth = () => {
  const { user, isAuthenticated, isLoading } = useAppSelector((state) => state.auth);

  const isRole = (role: string | string[]) => {
    if (!user) return false;
    if (Array.isArray(role)) {
      return role.includes(user.role);
    }
    return user.role === role;
  };

  const isCitizen = user?.role === 'citizen';
  const isOfficer = user?.role === 'officer';
  const isDepartmentAdmin = user?.role === 'department_admin';
  const isSuperAdmin = user?.role === 'super_admin';
  const isAdmin = isDepartmentAdmin || isSuperAdmin;

  return {
    user,
    isAuthenticated,
    isLoading,
    isRole,
    isCitizen,
    isOfficer,
    isDepartmentAdmin,
    isSuperAdmin,
    isAdmin,
  };
};
