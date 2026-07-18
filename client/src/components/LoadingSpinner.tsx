import { FC } from 'react';
import clsx from 'clsx';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  text?: string;
}

const LoadingSpinner: FC<LoadingSpinnerProps> = ({ size = 'md', className, text }) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
  };

  return (
    <div className={clsx('flex flex-col items-center justify-center gap-3', className)}>
      <div
        className={clsx(
          'spinner border-2 border-gray-300 dark:border-gray-600 border-t-primary-600',
          sizeClasses[size]
        )}
      />
      {text && (
        <p className="text-sm text-gray-600 dark:text-gray-400 animate-pulse">{text}</p>
      )}
    </div>
  );
};

export default LoadingSpinner;
