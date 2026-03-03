/**
 * Toast Context
 * @module context/ToastContext
 * 
 * Global toast notification system with queue and animations.
 */

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { 
  CheckCircle, XCircle, AlertTriangle, Info, X, 
  Sparkles, AlertCircle, CheckCircle2 
} from 'lucide-react';
import { cn } from '../lib/utils';

export type ToastType = 'success' | 'error' | 'warning' | 'info' | 'premium';

export interface Toast {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
  icon?: React.ReactNode;
}

interface ToastContextType {
  toasts: Toast[];
  addToast: (toast: Omit<Toast, 'id'>) => string;
  removeToast: (id: string) => void;
  clearToasts: () => void;
  // Convenience methods
  success: (title: string, message?: string) => string;
  error: (title: string, message?: string) => string;
  warning: (title: string, message?: string) => string;
  info: (title: string, message?: string) => string;
  premium: (title: string, message?: string) => string;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

const TOAST_CONFIG: Record<ToastType, {
  icon: React.ReactNode;
  className: string;
  iconBg: string;
}> = {
  success: {
    icon: <CheckCircle2 size={18} />,
    className: 'border-green-200 dark:border-green-800',
    iconBg: 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400',
  },
  error: {
    icon: <XCircle size={18} />,
    className: 'border-red-200 dark:border-red-800',
    iconBg: 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400',
  },
  warning: {
    icon: <AlertTriangle size={18} />,
    className: 'border-amber-200 dark:border-amber-800',
    iconBg: 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400',
  },
  info: {
    icon: <Info size={18} />,
    className: 'border-blue-200 dark:border-blue-800',
    iconBg: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400',
  },
  premium: {
    icon: <Sparkles size={18} />,
    className: 'border-purple-200 dark:border-purple-800 bg-gradient-to-r from-purple-50 to-amber-50 dark:from-purple-900/20 dark:to-amber-900/20',
    iconBg: 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400',
  },
};

const DEFAULT_DURATION = 4000;

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const addToast = useCallback((toast: Omit<Toast, 'id'>): string => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
    const newToast: Toast = { ...toast, id };

    setToasts(prev => [...prev, newToast]);

    // Auto remove
    const duration = toast.duration ?? DEFAULT_DURATION;
    if (duration > 0) {
      setTimeout(() => removeToast(id), duration);
    }

    return id;
  }, [removeToast]);

  const clearToasts = useCallback(() => {
    setToasts([]);
  }, []);

  // Convenience methods
  const success = useCallback((title: string, message?: string) => 
    addToast({ type: 'success', title, message }), [addToast]);

  const error = useCallback((title: string, message?: string) => 
    addToast({ type: 'error', title, message, duration: 6000 }), [addToast]);

  const warning = useCallback((title: string, message?: string) => 
    addToast({ type: 'warning', title, message, duration: 5000 }), [addToast]);

  const info = useCallback((title: string, message?: string) => 
    addToast({ type: 'info', title, message }), [addToast]);

  const premium = useCallback((title: string, message?: string) => 
    addToast({ type: 'premium', title, message, duration: 5000 }), [addToast]);

  return (
    <ToastContext.Provider
      value={{
        toasts,
        addToast,
        removeToast,
        clearToasts,
        success,
        error,
        warning,
        info,
        premium,
      }}
    >
      {children}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </ToastContext.Provider>
  );
}

function ToastContainer({ 
  toasts, 
  removeToast 
}: { 
  toasts: Toast[]; 
  removeToast: (id: string) => void;
}) {
  return (
    <div
      className="fixed bottom-4 right-4 z-[9999] flex flex-col gap-2 max-w-sm w-full pointer-events-none"
      aria-live="polite"
      aria-label="Notifikasi"
    >
      {toasts.map((toast, index) => (
        <ToastItem
          key={toast.id}
          toast={toast}
          onClose={() => removeToast(toast.id)}
          style={{ 
            animationDelay: `${index * 50}ms`,
            zIndex: 9999 - index 
          }}
        />
      ))}
    </div>
  );
}

function ToastItem({ 
  toast, 
  onClose,
  style,
}: { 
  toast: Toast; 
  onClose: () => void;
  style?: React.CSSProperties;
}) {
  const config = TOAST_CONFIG[toast.type];

  return (
    <div
      className={cn(
        'pointer-events-auto flex items-start gap-3 p-4 rounded-2xl border bg-white dark:bg-slate-800 shadow-xl',
        'animate-in slide-in-from-right-full fade-in duration-300',
        config.className
      )}
      style={style}
      role="alert"
    >
      {/* Icon */}
      <div className={cn('shrink-0 w-8 h-8 rounded-full flex items-center justify-center', config.iconBg)}>
        {toast.icon || config.icon}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p className="font-bold text-slate-800 dark:text-white text-sm">
          {toast.title}
        </p>
        {toast.message && (
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            {toast.message}
          </p>
        )}
        {toast.action && (
          <button
            onClick={toast.action.onClick}
            className="mt-2 text-xs font-bold text-teal-600 dark:text-teal-400 hover:underline"
          >
            {toast.action.label}
          </button>
        )}
      </div>

      {/* Close button */}
      <button
        onClick={onClose}
        className="shrink-0 p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
        aria-label="Tutup notifikasi"
      >
        <X size={14} />
      </button>
    </div>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}

export default ToastProvider;