import { FC, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Mail, Lock, User, Phone, MapPin, Eye, EyeOff } from 'lucide-react';
import { useAppDispatch } from '../../hooks/redux';
import { register as registerUser } from '../../store/slices/authSlice';
import Button from '../../components/Button';
import Input from '../../components/Input';
import Card from '../../components/Card';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { INDIAN_STATES } from '../../constants';

interface RegisterFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone?: string;
  city?: string;
  state?: string;
}

const RegisterPage: FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterFormData>();

  const password = watch('password');

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true);
    try {
      const { confirmPassword, ...registerData } = data;
      await dispatch(registerUser(registerData)).unwrap();
      toast.success('Registration successful! Welcome to Nagar Setu.');
      navigate('/citizen/dashboard');
    } catch (error: any) {
      toast.error(error || 'Registration failed');
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
        className="w-full max-w-2xl"
      >
        <Card>
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary-600 to-secondary-600 rounded-2xl mb-4">
              <span className="text-white font-bold text-2xl">N</span>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
              Create Account
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Join Nagar Setu to make your city better
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Personal Information */}
            <div className="grid md:grid-cols-2 gap-5">
              <Input
                label="Full Name"
                type="text"
                placeholder="John Doe"
                icon={<User className="w-5 h-5" />}
                error={errors.name?.message}
                {...register('name', {
                  required: 'Name is required',
                  minLength: {
                    value: 2,
                    message: 'Name must be at least 2 characters',
                  },
                })}
              />

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
            </div>

            {/* Phone (Optional) */}
            <Input
              label="Phone Number (Optional)"
              type="tel"
              placeholder="9876543210"
              icon={<Phone className="w-5 h-5" />}
              helperText="Indian format: 10 digits starting with 6-9"
              error={errors.phone?.message}
              {...register('phone', {
                pattern: {
                  value: /^[6-9]\d{9}$/,
                  message: 'Invalid Indian phone number',
                },
              })}
            />

            {/* Location */}
            <div className="grid md:grid-cols-2 gap-5">
              <Input
                label="City (Optional)"
                type="text"
                placeholder="Mumbai"
                icon={<MapPin className="w-5 h-5" />}
                error={errors.city?.message}
                {...register('city')}
              />

              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-1.5">
                  State (Optional)
                </label>
                <select
                  className="input"
                  {...register('state')}
                >
                  <option value="">Select State</option>
                  {INDIAN_STATES.map((state) => (
                    <option key={state} value={state}>
                      {state}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Password */}
            <div className="grid md:grid-cols-2 gap-5">
              <div className="relative">
                <Input
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  icon={<Lock className="w-5 h-5" />}
                  error={errors.password?.message}
                  helperText="Minimum 6 characters"
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
                  label="Confirm Password"
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
            </div>

            {/* Terms */}
            <div className="flex items-start">
              <input
                type="checkbox"
                required
                className="w-4 h-4 mt-1 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
              />
              <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
                I agree to the{' '}
                <a href="#" className="text-primary-600 hover:text-primary-700">
                  Terms of Service
                </a>{' '}
                and{' '}
                <a href="#" className="text-primary-600 hover:text-primary-700">
                  Privacy Policy
                </a>
              </span>
            </div>

            <Button type="submit" fullWidth loading={isLoading} size="lg">
              Create Account
            </Button>
          </form>

          {/* Footer */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Already have an account?{' '}
              <Link
                to="/login"
                className="font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400"
              >
                Sign in
              </Link>
            </p>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};

export default RegisterPage;
