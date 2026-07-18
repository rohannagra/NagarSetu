import { FC, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Lock, Eye, EyeOff, CheckCircle } from 'lucide-react';
import authService from '../../services/authService';
import Button from '../../components/Button';
import Input from '../../components/Input';
import Card from '../../components/Card';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

interface ResetPasswordFormData {
  password: string;
  confirmPassword: string;
}

const ResetPasswordPage: FC = () => {
  const [searchParams] = useSearchParams();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);
  const navigate = useNavigate();

  const token = searchParams.get('token');

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ResetPasswordFormData>();

  const password = watch('password');

  const onSubmit = async (data: ResetPasswordFormData) => {
    if (!token) {
      toast.error('Invalid reset token');
      return;
    }

    setIsLoading(true);
    try {
      await authService.resetPassword(token, data.password);
      setResetSuccess(true);
      toast.success('Password reset successfully');
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to reset password');
    } finally {
      setIsLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <Card className="max-w-md w-full text-center">
          <p className="text-red-600 dark:text-red-400">
            Invalid or missing reset token. Please request a new password reset link.
          </p>
          <Button className="mt-4" onClick={() => navigate('/forgot-password')}>
            Request New Link
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 via-secondary-50 to-white dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card>
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary-600 to-secondary-600 rounded-2xl mb-4">
              {resetSuccess ? (
                <CheckCircle className="w-8 h-8 text-white" />
              ) : (
                <Lock className="w-8 h-8 text-white" />
              )}
            </div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
              {resetSuccess ? 'Password Reset!' : 'Reset Password'}
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              {resetSuccess
                ? 'Redirecting to login...'
                : 'Choose a new password for your account'}
            </p>
          </div>

          {resetSuccess ? (
            <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
              <p className="text-sm text-green-800 dark:text-green-300 text-center">
                Your password has been reset successfully. You can now login with your new
                password.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div className="relative">
                <Input
                  label="New Password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  icon={<Lock className="w-5 h-5" />}
                  helperText="Minimum 6 characters"
                  error={errors.password?.message}
                  {...register('password', {
                    required: 'Password is required',
                    minLength: {
                      value: 6,
                      message: 'Password must be at least 6 characters',
                    },
                  })}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-9 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>

              <div className="relative">
                <Input
                  label="Confirm New Password"
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  icon={<Lock className="w-5 h-5" />}
                  error={errors.confirmPassword?.message}
                  {...register('confirmPassword', {
                    required: 'Please confirm your password',
                    validate: (value) =>
                      value === password || 'Passwords do not match',
                  })}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-9 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>

              <Button type="submit" fullWidth loading={isLoading} size="lg">
                Reset Password
              </Button>
            </form>
          )}
        </Card>
      </motion.div>
    </div>
  );
};

export default ResetPasswordPage;
