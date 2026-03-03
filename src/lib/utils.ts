/**
 * Utility Functions
 * @module lib/utils
 * 
 * Common utility functions used across the app.
 */

import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Merge Tailwind CSS classes with proper conflict resolution
 * Uses clsx for conditional classes and tailwind-merge for deduplication
 * 
 * @example
 * cn('px-4 py-2', isActive && 'bg-blue-500', className)
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format a number with locale-specific separators
 */
export function formatNumber(num: number, locale = 'id-ID'): string {
  return new Intl.NumberFormat(locale).format(num);
}

/**
 * Format a percentage value
 */
export function formatPercent(value: number, decimals = 0): string {
  return `${value.toFixed(decimals)}%`;
}

/**
 * Truncate text with ellipsis
 */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength - 3) + '...';
}

/**
 * Capitalize first letter
 */
export function capitalize(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

/**
 * Generate initials from a name
 */
export function getInitials(name: string, maxLength = 2): string {
  return name
    .split(' ')
    .slice(0, maxLength)
    .map(part => part.charAt(0).toUpperCase())
    .join('');
}

/**
 * Debounce function
 */
export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout>;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

/**
 * Sleep utility for async operations
 */
export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Check if we're in a browser environment
 */
export const isBrowser = typeof window !== 'undefined';

/**
 * Safe localStorage access
 */
export const storage = {
  get: <T>(key: string, defaultValue: T): T => {
    if (!isBrowser) return defaultValue;
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch {
      return defaultValue;
    }
  },
  
  set: <T>(key: string, value: T): void => {
    if (!isBrowser) return;
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // Ignore storage errors
    }
  },
  
  remove: (key: string): void => {
    if (!isBrowser) return;
    localStorage.removeItem(key);
  },
};