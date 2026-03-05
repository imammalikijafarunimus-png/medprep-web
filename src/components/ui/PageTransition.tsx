/**
 * Page Transition Component
 * @module components/ui/PageTransition
 * 
 * Smooth page transitions with loading states.
 */

import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { cn } from '../../lib/utils';

interface PageTransitionProps {
  children: React.ReactNode;
  className?: string;
  /** Animation variant */
  variant?: 'fade' | 'slide' | 'scale' | 'none';
  /** Animation duration in ms */
  duration?: number;
  /** Show loading indicator during transition */
  showLoading?: boolean;
}

export function PageTransition({
  children,
  className,
  variant = 'fade',
  duration = 300,
  showLoading = false,
}: PageTransitionProps) {
  const location = useLocation();
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [displayChildren, setDisplayChildren] = useState(children);

  useEffect(() => {
    setIsTransitioning(true);
    
    const timer = setTimeout(() => {
      setDisplayChildren(children);
      setIsTransitioning(false);
    }, duration / 2);

    return () => clearTimeout(timer);
  }, [location.pathname, children, duration]);

  const getAnimationClass = () => {
    if (variant === 'none') return '';
    
    const baseClass = 'transition-all';
    // Duration is applied via style prop instead of Tailwind class for dynamic values
    const _durationClass = `duration-${duration}`;
    
    if (isTransitioning) {
      switch (variant) {
        case 'fade':
          return `${baseClass} opacity-0`;
        case 'slide':
          return `${baseClass} opacity-0 translate-y-4`;
        case 'scale':
          return `${baseClass} opacity-0 scale-[0.98]`;
        default:
          return '';
      }
    }
    
    return `${baseClass} opacity-100 translate-y-0 scale-100`;
  };

  return (
    <div className={cn('relative', className)}>
      {/* Loading indicator */}
      {showLoading && isTransitioning && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm">
          <div className="w-8 h-8 border-2 border-teal-500 border-t-transparent rounded-full animate-spin" />
        </div>
      )}
      
      {/* Content */}
      <div className={cn(getAnimationClass())}>
        {displayChildren}
      </div>
    </div>
  );
}

/**
 * Stagger children animation wrapper
 */
interface StaggerContainerProps {
  children: React.ReactNode;
  className?: string;
  staggerDelay?: number;
}

export function StaggerContainer({
  children,
  className,
  staggerDelay = 50,
}: StaggerContainerProps) {
  return (
    <div className={cn('contents', className)}>
      {React.Children.map(children, (child, index) => (
        <div
          className="animate-in fade-in slide-in-from-bottom-4"
          style={{ animationDelay: `${index * staggerDelay}ms` }}
        >
          {child}
        </div>
      ))}
    </div>
  );
}

/**
 * Animate on mount component
 */
interface AnimateInProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  animation?: 'fade' | 'slide-up' | 'slide-down' | 'scale' | 'bounce';
}

export function AnimateIn({
  children,
  className,
  delay = 0,
  animation = 'fade',
}: AnimateInProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  const getAnimationClass = () => {
    const baseClasses = 'transition-all duration-300 ease-out';
    
    if (!isVisible) {
      switch (animation) {
        case 'fade':
          return `${baseClasses} opacity-0`;
        case 'slide-up':
          return `${baseClasses} opacity-0 translate-y-4`;
        case 'slide-down':
          return `${baseClasses} opacity-0 -translate-y-4`;
        case 'scale':
          return `${baseClasses} opacity-0 scale-95`;
        case 'bounce':
          return `${baseClasses} opacity-0 scale-90`;
        default:
          return `${baseClasses} opacity-0`;
      }
    }
    
    return `${baseClasses} opacity-100 translate-y-0 scale-100`;
  };

  return (
    <div className={cn(getAnimationClass(), className)}>
      {children}
    </div>
  );
}

/**
 * Skeleton wrapper for loading states
 */
interface LoadingWrapperProps {
  isLoading: boolean;
  skeleton: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export function LoadingWrapper({
  isLoading,
  skeleton,
  children,
  className,
}: LoadingWrapperProps) {
  if (isLoading) {
    return <div className={className}>{skeleton}</div>;
  }
  
  return (
    <div className={cn('animate-in fade-in duration-300', className)}>
      {children}
    </div>
  );
}

export default PageTransition;