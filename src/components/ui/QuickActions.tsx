/**
 * Quick Actions Component
 * @module components/ui/QuickActions
 * 
 * Floating action button with quick actions menu.
 */

import React, { useState, useRef, useEffect } from 'react';
import { Plus, X, Search, BookOpen, Stethoscope, Zap, Bookmark } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cn } from '../../lib/utils';

interface QuickAction {
  icon: React.ReactNode;
  label: string;
  path?: string;
  onClick?: () => void;
  badge?: string;
  color?: string;
}

const DEFAULT_ACTIONS: QuickAction[] = [
  { icon: <Search size={18} />, label: 'Cari', path: '/app/search', color: 'bg-blue-500' },
  { icon: <BookOpen size={18} />, label: 'CBT', path: '/app/cbt', color: 'bg-teal-500' },
  { icon: <Stethoscope size={18} />, label: 'OSCE', path: '/app/osce', color: 'bg-purple-500' },
  { icon: <Zap size={18} />, label: 'Flashcard', path: '/app/flashcards', color: 'bg-amber-500' },
  { icon: <Bookmark size={18} />, label: 'Bookmark', path: '/app/bookmarks', color: 'bg-rose-500' },
];

interface QuickActionsProps {
  actions?: QuickAction[];
  className?: string;
  position?: 'bottom-right' | 'bottom-left' | 'bottom-center';
}

export function QuickActions({
  actions = DEFAULT_ACTIONS,
  className,
  position = 'bottom-right',
}: QuickActionsProps) {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  // Close on escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen]);

  const handleAction = (action: QuickAction) => {
    if (action.onClick) {
      action.onClick();
    } else if (action.path) {
      navigate(action.path);
    }
    setIsOpen(false);
  };

  const positionClasses = {
    'bottom-right': 'right-4',
    'bottom-left': 'left-4',
    'bottom-center': 'left-1/2 -translate-x-1/2',
  };

  return (
    <div
      ref={containerRef}
      className={cn(
        'fixed bottom-20 md:bottom-6 z-40',
        positionClasses[position],
        className
      )}
    >
      {/* Actions Menu */}
      {isOpen && (
        <div 
          className={cn(
            'absolute bottom-16 mb-2 flex flex-col gap-2',
            'animate-in fade-in slide-in-from-bottom-4 duration-200'
          )}
          role="menu"
        >
          {actions.map((action, index) => (
            <button
              key={action.label}
              onClick={() => handleAction(action)}
              className={cn(
                'flex items-center gap-3 px-4 py-2.5 rounded-full',
                'bg-white dark:bg-slate-800 shadow-lg border border-slate-100 dark:border-slate-700',
                'hover:scale-105 transition-all duration-200',
                'focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2',
                'animate-in fade-in slide-in-from-right-4'
              )}
              style={{ animationDelay: `${index * 50}ms` }}
              role="menuitem"
            >
              <span className={cn(
                'w-7 h-7 rounded-full flex items-center justify-center text-white',
                action.color || 'bg-slate-500'
              )}>
                {action.icon}
              </span>
              <span className="font-medium text-sm text-slate-700 dark:text-slate-200 pr-1">
                {action.label}
              </span>
              {action.badge && (
                <span className="px-2 py-0.5 text-[10px] font-bold bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400 rounded-full">
                  {action.badge}
                </span>
              )}
            </button>
          ))}
        </div>
      )}

      {/* Main FAB Button */}
      <button
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'w-14 h-14 rounded-full flex items-center justify-center',
          'bg-gradient-to-tr from-teal-500 to-blue-600 text-white shadow-xl',
          'hover:shadow-2xl hover:scale-105 active:scale-95 transition-all duration-200',
          'focus:outline-none focus:ring-4 focus:ring-teal-500/30',
          isOpen && 'rotate-45'
        )}
        aria-label={isOpen ? 'Tutup menu' : 'Buka menu aksi cepat'}
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        {isOpen ? (
          <X size={24} className="transition-transform duration-200" aria-hidden="true" />
        ) : (
          <Plus size={24} className="transition-transform duration-200" aria-hidden="true" />
        )}
      </button>
    </div>
  );
}

/**
 * Compact quick actions for header
 */
interface QuickActionsBarProps {
  className?: string;
}

export function QuickActionsBar({ className }: QuickActionsBarProps) {
  const navigate = useNavigate();

  return (
    <div className={cn('flex items-center gap-1', className)}>
      {DEFAULT_ACTIONS.slice(0, 3).map((action) => (
        <button
          key={action.label}
          onClick={() => action.path && navigate(action.path)}
          className={cn(
            'p-2 rounded-xl text-slate-500 dark:text-slate-400',
            'hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-teal-600 dark:hover:text-teal-400',
            'transition-all duration-200',
            'focus:outline-none focus:ring-2 focus:ring-teal-500'
          )}
          title={action.label}
          aria-label={action.label}
        >
          {action.icon}
        </button>
      ))}
    </div>
  );
}

export default QuickActions;