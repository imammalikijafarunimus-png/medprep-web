/**
 * Loading Components
 * @module components/ui/Loading
 * 
 * Various loading states for different use cases.
 * All components are accessible with proper ARIA attributes.
 */

import React from 'react';
import { cn } from '../../lib/utils';

// ============================================
// SPINNER COMPONENTS
// ============================================

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const SPINNER_SIZES = {
  sm: 'w-4 h-4 border-2',
  md: 'w-6 h-6 border-2',
  lg: 'w-10 h-10 border-3',
};

export function Spinner({ size = 'md', className }: SpinnerProps) {
  return (
    <div
      role="status"
      aria-label="Loading"
      className={cn(
        'rounded-full border-slate-200 dark:border-slate-700',
        'border-t-teal-500 animate-spin',
        SPINNER_SIZES[size],
        className
      )}
    />
  );
}

/**
 * Centered spinner for full-page loading
 */
export function LoadingScreen({ message = 'Memuat...' }: { message?: string }) {
  return (
    <div 
      className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900"
      role="status"
      aria-live="polite"
    >
      <div className="text-center">
        <Spinner size="lg" className="mx-auto" />
        <p className="mt-4 text-sm font-medium text-slate-500 dark:text-slate-400">
          {message}
        </p>
      </div>
    </div>
  );
}

/**
 * Inline loading for buttons and small areas
 */
export function LoadingInline({ text = 'Memuat...' }: { text?: string }) {
  return (
    <span 
      className="inline-flex items-center gap-2"
      role="status"
      aria-live="polite"
    >
      <Spinner size="sm" />
      <span className="text-sm">{text}</span>
    </span>
  );
}

// ============================================
// SKELETON COMPONENTS
// ============================================

interface SkeletonProps {
  className?: string;
  animate?: boolean;
}

export function Skeleton({ className, animate = true }: SkeletonProps) {
  return (
    <div
      className={cn(
        'bg-slate-200 dark:bg-slate-800 rounded-lg',
        animate && 'animate-pulse',
        className
      )}
      role="presentation"
      aria-hidden="true"
    />
  );
}

/**
 * Skeleton for text lines
 */
export function SkeletonText({ 
  lines = 3, 
  className 
}: { 
  lines?: number; 
  className?: string;
}) {
  return (
    <div className={cn('space-y-2', className)} aria-hidden="true">
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton 
          key={i}
          className={cn(
            'h-4',
            i === lines - 1 ? 'w-3/4' : 'w-full'
          )}
        />
      ))}
    </div>
  );
}

/**
 * Skeleton for avatar
 */
export function SkeletonAvatar({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const sizes = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-14 h-14',
  };
  
  return <Skeleton className={cn('rounded-full', sizes[size])} />;
}

/**
 * Skeleton for card component
 */
export function SkeletonCard() {
  return (
    <div 
      className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-100 dark:border-slate-800"
      aria-hidden="true"
    >
      <div className="flex items-start gap-4">
        <Skeleton className="w-12 h-12 rounded-xl shrink-0" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-1/3" />
          <Skeleton className="h-3 w-1/2" />
        </div>
      </div>
      <div className="mt-4 space-y-2">
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-4/5" />
      </div>
    </div>
  );
}

/**
 * Skeleton for stats grid
 */
export function SkeletonStats() {
  return (
    <div 
      className="grid grid-cols-1 md:grid-cols-3 gap-4"
      aria-hidden="true"
    >
      {[1, 2, 3].map((i) => (
        <div key={i} className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-100 dark:border-slate-800">
          <div className="flex items-center justify-between mb-4">
            <Skeleton className="w-12 h-12 rounded-2xl" />
            <Skeleton className="h-3 w-16" />
          </div>
          <Skeleton className="h-8 w-20 mb-1" />
          <Skeleton className="h-3 w-24" />
        </div>
      ))}
    </div>
  );
}

/**
 * Skeleton for table
 */
export function SkeletonTable({ rows = 5 }: { rows?: number }) {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-100 dark:border-slate-800" aria-hidden="true">
      {/* Header */}
      <div className="bg-slate-50 dark:bg-slate-800 p-4 flex gap-4">
        <Skeleton className="h-4 w-1/4" />
        <Skeleton className="h-4 w-1/4" />
        <Skeleton className="h-4 w-1/4" />
        <Skeleton className="h-4 w-1/4" />
      </div>
      {/* Rows */}
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="p-4 flex gap-4 border-t border-slate-100 dark:border-slate-800">
          <Skeleton className="h-4 w-1/4" />
          <Skeleton className="h-4 w-1/4" />
          <Skeleton className="h-4 w-1/4" />
          <Skeleton className="h-4 w-1/4" />
        </div>
      ))}
    </div>
  );
}

/**
 * Skeleton for CBT question
 */
export function SkeletonQuestion() {
  return (
    <div 
      className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-100 dark:border-slate-800"
      aria-hidden="true"
    >
      {/* Question header */}
      <div className="flex justify-between mb-6">
        <Skeleton className="h-4 w-40" />
        <Skeleton className="h-6 w-20 rounded-full" />
      </div>
      
      {/* Question text */}
      <div className="space-y-2 mb-6">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
      </div>
      
      {/* Options */}
      <div className="space-y-3">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="flex items-center gap-3 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
            <Skeleton className="w-6 h-6 rounded-full shrink-0" />
            <Skeleton className="h-4 flex-1" />
          </div>
        ))}
      </div>
    </div>
  );
}

// ============================================
// PAGE LOADING STATES
// ============================================

/**
 * Dashboard loading state
 */
export function LoadingDashboard() {
  return (
    <div className="space-y-6 animate-in fade-in duration-300" aria-hidden="true">
      {/* Hero skeleton */}
      <Skeleton className="h-64 rounded-[2.5rem]" />
      
      {/* Stats */}
      <SkeletonStats />
      
      {/* Quick access cards */}
      <div className="grid md:grid-cols-2 gap-6">
        <SkeletonCard />
        <SkeletonCard />
      </div>
    </div>
  );
}

/**
 * CBT Center loading state
 */
export function LoadingCBT() {
  return (
    <div className="space-y-6 animate-in fade-in duration-300" aria-hidden="true">
      {/* Header */}
      <Skeleton className="h-40 rounded-[2rem]" />
      
      {/* System grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-24 rounded-2xl" />
        ))}
      </div>
    </div>
  );
}

export default Spinner;