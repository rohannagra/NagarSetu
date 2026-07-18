import { FC } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  MapPin,
  Zap,
  Shield,
  BarChart3,
  CheckCircle,
  Clock,
  Users,
  TrendingUp,
  FileText,
  Bell,
  MessageSquare,
  ChevronRight,
} from 'lucide-react';
import Button from '../components/Button';
import Card from '../components/Card';

const LandingPage: FC = () => {
  const navigate = useNavigate();

  const stats = [
    { label: 'Complaints Resolved', value: '10,000+', icon: CheckCircle },
    { label: 'Active Users', value: '50,000+', icon: Users },
    { label: 'Average Resolution Time', value: '48 hrs', icon: Clock },
    { label: 'Success Rate', value: '94%', icon: TrendingUp },
  ];

  const features = [
    {
      icon: Zap,
      title: 'AI-Powered Classification',
      description: 'Automatic complaint categorization and routing using advanced AI algorithms',
    },
    {
      icon: MapPin,
      title: 'Geospatial Tracking',
      description: 'Real-time heatmaps showing complaint hotspots across your city',
    },
    {
      icon: Shield,
      title: 'Anonymous Reporting',
      description: 'Submit complaints anonymously with complete privacy protection',
    },
    {
      icon: BarChart3,
      title: 'Advanced Analytics',
      description: 'Comprehensive dashboards with actionable insights for administrators',
    },
    {
      icon: Bell,
      title: 'Real-Time Updates',
      description: 'Instant notifications on complaint status changes via email and in-app',
    },
    {
      icon: MessageSquare,
      title: 'Direct Communication',
      description: 'Chat directly with assigned officers for quick resolution',
    },
  ];

  const steps = [
    {
      number: '01',
      title: 'Submit Complaint',
      description: 'Describe your civic issue with photos, location, and details',
    },
    {
      number: '02',
      title: 'AI Processing',
      description: 'Our AI automatically classifies and routes to the right department',
    },
    {
      number: '03',
      title: 'Assignment',
      description: 'Complaint is assigned to a responsible officer in your area',
    },
    {
      number: '04',
      title: 'Resolution',
      description: 'Track progress and receive updates until complete resolution',
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-50 via-secondary-50 to-white dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="absolute inset-0 bg-grid-pattern opacity-5" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white leading-tight">
                Smart Complaint
                <span className="gradient-text"> Redressal System</span>
              </h1>
              <p className="mt-6 text-xl text-gray-600 dark:text-gray-300">
                AI-powered platform for transparent civic issue resolution. Submit complaints,
                track progress, and make your city better.
              </p>

              <div className="mt-8 flex flex-col sm:flex-row gap-4">
                <Button
                  size="lg"
                  onClick={() => navigate('/register')}
                  icon={<ChevronRight className="w-5 h-5" />}
                >
                  Get Started
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => navigate('/track')}
                  icon={<FileText className="w-5 h-5" />}
                >
                  Track Complaint
                </Button>
              </div>

              {/* Quick Stats */}
              <div className="mt-12 grid grid-cols-2 gap-6">
                {stats.slice(0, 2).map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 + index * 0.1 }}
                  >
                    <div className="flex items-center space-x-2">
                      <stat.icon className="w-5 h-5 text-primary-600" />
                      <div>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">
                          {stat.value}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {stat.label}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Right Content - Hero Image/Illustration */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="relative"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-primary-600 to-secondary-600 rounded-3xl blur-3xl opacity-20" />
                <div className="relative bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-2xl">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/30 rounded-xl flex items-center justify-center">
                        <MapPin className="w-6 h-6 text-primary-600" />
                      </div>
                      <div className="flex-1">
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
                        <div className="h-3 bg-gray-100 dark:bg-gray-800 rounded w-1/2 mt-2" />
                      </div>
                    </div>
                    
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="flex items-center space-x-3 opacity-50">
                        <div className="w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-xl" />
                        <div className="flex-1">
                          <div className="h-4 bg-gray-100 dark:bg-gray-700 rounded w-2/3" />
                          <div className="h-3 bg-gray-50 dark:bg-gray-800 rounded w-1/2 mt-2" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <stat.icon className="w-8 h-8 text-primary-600 mx-auto mb-3" />
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  {stat.value}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  {stat.label}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white">
              Powerful Features
            </h2>
            <p className="mt-4 text-xl text-gray-600 dark:text-gray-400">
              Everything you need for efficient complaint management
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card hover className="h-full">
                  <feature.icon className="w-12 h-12 text-primary-600 mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    {feature.description}
                  </p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white">
              How It Works
            </h2>
            <p className="mt-4 text-xl text-gray-600 dark:text-gray-400">
              Simple, transparent, and effective
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="relative"
              >
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-12 left-full w-full h-0.5 bg-gradient-to-r from-primary-600 to-secondary-600 -translate-x-1/2" />
                )}
                
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-primary-600 to-secondary-600 text-white text-2xl font-bold mb-4">
                    {step.number}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    {step.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-primary-600 to-secondary-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-white mb-6">
              Ready to Make a Difference?
            </h2>
            <p className="text-xl text-primary-100 mb-8">
              Join thousands of citizens working towards a better city
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                variant="secondary"
                onClick={() => navigate('/register')}
              >
                Register Now
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => navigate('/login')}
                className="!text-white !border-white hover:!bg-white/10"
              >
                Login
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
