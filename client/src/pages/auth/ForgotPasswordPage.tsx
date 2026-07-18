import { FC, useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Mail, ArrowLeft } from 'lucide-react';
import authService from '../../services/authService';
import Button from '../../components/Button';
import Input from '../../components/Input';
import Card from '../../components/Card';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

interface ForgotPasswordFormData {
  email: string;
}

const ForgotPasswordPage: FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>();

  const onSubmit = async (data: ForgotPasswordFormData) => {
    setIsLoading(true);
    try {
      await authService.forgotPassword(data.email);
      setEmailSent(true);
      toast.success('Password reset link sent to your email');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to send reset link');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 via-secondary-50 to-white dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card>
          {/* Back Button */}
          <Link
            to="/login"
            className="inline-flex items-center text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400 mb-6"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back to login
          </Link>

          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary-600 to-secondary-600 rounded-2xl mb-4">
              <Mail className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
              Forgot Password?
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              {emailSent
                ? 'Check your email for reset instructions'
                : 'Enter your email to receive a reset link'}
            </p>
          </div>

          {emailSent ? (
            <div className="space-y-4">
              <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                <p className="text-sm text-green-800 dark:text-green-300">
                  We've sent a password reset link to your email address. Please check your
                  inbox and follow the instructions.
                </p>
              </div>

              <div className="text-center text-sm text-gray-600 dark:text-gray-400">
                Didn't receive the email?{' '}
                <button
                  onClick={() => setEmailSent(false)}
                  className="text-primary-600 hover:text-primary-700 dark:text-primary-400 font-medium"
                >
                  Try again
                </button>
              </div>

              <Button fullWidth onClick={() => window.location.href = '/login'}>
                Back to Login
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <Input
                label="Email Address"
                type="email"
                placeholder="you@example.com"
                icon={<Mail className="w-5 h-5" />}
                error={errors.email?.message}
                {...register('email', {
                  required: 'Email is required',
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: 'Invalid email address',
                  },
                })}
              />

              <Button type="submit" fullWidth loading={isLoading} size="lg">
                Send Reset Link
              </Button>
            </form>
          )}
        </Card>
      </motion.div>
    </div>
  );
};

export default ForgotPasswordPage;
