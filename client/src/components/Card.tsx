import { FC, ReactNode } from 'react';
import clsx from 'clsx';

interface CardProps {
  children: ReactNode;
  className?: string;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  hover?: boolean;
}

const Card: FC<CardProps> = ({ children, className, padding = 'md', hover = false }) => {
  const baseClasses = 'bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 transition-all';

  const paddingClasses = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };

  const hoverClasses = hover ? 'hover:shadow-lg hover:border-primary-300 dark:hover:border-primary-700 cursor-pointer' : 'shadow-sm';

  return (
    <div className={clsx(baseClasses, paddingClasses[padding], hoverClasses, className)}>
      {children}
    </div>
  );
};

export default Card;
