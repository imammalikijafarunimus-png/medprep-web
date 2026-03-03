/**
 * Bookmark Button Component
 * @module components/ui/BookmarkButton
 * 
 * Reusable bookmark toggle button with animations.
 */

import React from 'react';
import { Bookmark, BookmarkCheck } from 'lucide-react';
import { cn } from '../../lib/utils';

interface BookmarkButtonProps {
  isBookmarked: boolean;
  onToggle: () => void;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'icon' | 'button' | 'minimal';
  className?: string;
  showLabel?: boolean;
}

const SIZE_CONFIG = {
  sm: { icon: 14, button: 'w-7 h-7' },
  md: { icon: 18, button: 'w-9 h-9' },
  lg: { icon: 22, button: 'w-11 h-11' },
};

export function BookmarkButton({
  isBookmarked,
  onToggle,
  size = 'md',
  variant = 'icon',
  className,
  showLabel = false,
}: BookmarkButtonProps) {
  const config = SIZE_CONFIG[size];

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onToggle();
  };

  if (variant === 'button') {
    return (
      <button
        onClick={handleClick}
        className={cn(
          'flex items-center gap-2 px-3 py-1.5 rounded-full font-medium text-sm transition-all',
          isBookmarked
            ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
            : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700',
          'focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2',
          className
        )}
        aria-label={isBookmarked ? 'Hapus dari bookmark' : 'Tambah ke bookmark'}
        aria-pressed={isBookmarked}
      >
        {isBookmarked ? (
          <BookmarkCheck size={config.icon} aria-hidden="true" />
        ) : (
          <Bookmark size={config.icon} aria-hidden="true" />
        )}
        {showLabel && (
          <span>{isBookmarked ? 'Tersimpan' : 'Simpan'}</span>
        )}
      </button>
    );
  }

  if (variant === 'minimal') {
    return (
      <button
        onClick={handleClick}
        className={cn(
          'p-1 rounded transition-all',
          isBookmarked
            ? 'text-amber-500 hover:text-amber-600'
            : 'text-slate-400 hover:text-amber-500 dark:text-slate-500 dark:hover:text-amber-400',
          'focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-1',
          className
        )}
        aria-label={isBookmarked ? 'Hapus dari bookmark' : 'Tambah ke bookmark'}
        aria-pressed={isBookmarked}
      >
        {isBookmarked ? (
          <BookmarkCheck size={config.icon} fill="currentColor" aria-hidden="true" />
        ) : (
          <Bookmark size={config.icon} aria-hidden="true" />
        )}
      </button>
    );
  }

  // Default icon variant
  return (
    <button
      onClick={handleClick}
      className={cn(
        'flex items-center justify-center rounded-xl transition-all duration-200',
        config.button,
        isBookmarked
          ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 shadow-sm'
          : 'bg-white dark:bg-slate-800 text-slate-400 hover:text-amber-500 border border-slate-200 dark:border-slate-700 hover:border-amber-300 dark:hover:border-amber-700',
        'focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2',
        'active:scale-95',
        className
      )}
      aria-label={isBookmarked ? 'Hapus dari bookmark' : 'Tambah ke bookmark'}
      aria-pressed={isBookmarked}
    >
      {isBookmarked ? (
        <BookmarkCheck size={config.icon} fill="currentColor" aria-hidden="true" />
      ) : (
        <Bookmark size={config.icon} aria-hidden="true" />
      )}
    </button>
  );
}

export default BookmarkButton;