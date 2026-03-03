/**
 * Logo Component
 * @module components/ui/Logo
 * 
 * Consistent logo component for use across the app.
 * Single source of truth for branding.
 */

import React from 'react';
import { cn } from '../../lib/utils';

interface LogoProps {
  /** Logo size variant */
  size?: 'sm' | 'md' | 'lg' | 'xl';
  /** Show text label */
  showText?: boolean;
  /** Text subtitle */
  subtitle?: string;
  /** Additional classes */
  className?: string;
  /** Click handler */
  onClick?: () => void;
}

const SIZE_CONFIG = {
  sm: {
    container: 'w-8 h-8',
    text: 'text-lg',
    icon: 'text-sm',
    subtitle: 'text-[7px]',
  },
  md: {
    container: 'w-10 h-10',
    text: 'text-xl',
    icon: 'text-lg',
    subtitle: 'text-[9px]',
  },
  lg: {
    container: 'w-12 h-12',
    text: 'text-2xl',
    icon: 'text-xl',
    subtitle: 'text-[10px]',
  },
  xl: {
    container: 'w-16 h-16',
    text: 'text-3xl',
    icon: 'text-2xl',
    subtitle: 'text-xs',
  },
};

export function Logo({ 
  size = 'md', 
  showText = true, 
  subtitle = 'Medical OS',
  className,
  onClick 
}: LogoProps) {
  const config = SIZE_CONFIG[size];
  
  const Container = onClick ? 'button' : 'div';
  
  return (
    <Container
      className={cn(
        'flex items-center gap-3',
        onClick && 'cursor-pointer',
        className
      )}
      onClick={onClick}
      aria-label="MedPrep Logo"
    >
      {/* Logo Icon */}
      <div 
        className={cn(
          'rounded-xl flex items-center justify-center text-white font-black shadow-lg',
          'bg-gradient-to-tr from-teal-400 to-blue-600',
          'shadow-teal-500/20',
          config.container
        )}
        aria-hidden="true"
      >
        <span className={config.icon}>M</span>
      </div>
      
      {/* Logo Text */}
      {showText && (
        <div className="flex flex-col">
          <h1 
            className={cn(
              'font-bold tracking-tight leading-none text-slate-800 dark:text-white',
              config.text
            )}
          >
            MedPrep
          </h1>
          {subtitle && (
            <p 
              className={cn(
                'font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest',
                config.subtitle
              )}
            >
              {subtitle}
            </p>
          )}
        </div>
      )}
    </Container>
  );
}

/**
 * Logo for authentication pages (larger, centered)
 */
export function LogoAuth({ className }: { className?: string }) {
  return (
    <div className={cn('flex flex-col items-center', className)}>
      <Logo size="xl" showText={false} />
      <div className="mt-4 text-center">
        <h1 className="text-2xl font-black text-slate-900 dark:text-white">
          MedPrep
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Platform Belajar Kedokteran
        </p>
      </div>
    </div>
  );
}

/**
 * Compact logo for mobile header
 */
export function LogoCompact({ className }: { className?: string }) {
  return (
    <div 
      className={cn(
        'w-8 h-8 rounded-lg bg-gradient-to-tr from-teal-400 to-blue-600',
        'flex items-center justify-center text-white text-xs font-bold shadow-md',
        className
      )}
      aria-label="MedPrep"
    >
      M
    </div>
  );
}

export default Logo;