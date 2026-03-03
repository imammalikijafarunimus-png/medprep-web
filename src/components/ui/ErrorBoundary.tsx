/**
 * Error Boundary Component
 * @module components/ui/ErrorBoundary
 * 
 * Catches JavaScript errors anywhere in the child component tree,
 * logs those errors, and displays a fallback UI.
 */

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home, Bug } from 'lucide-react';

interface Props {
  children: ReactNode;
  /** Custom fallback UI */
  fallback?: ReactNode;
  /** Called when an error is caught */
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  /** Show reset button */
  showReset?: boolean;
  /** Show home button */
  showHome?: boolean;
  /** Show report button */
  showReport?: boolean;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    this.setState({ errorInfo });
    
    // Log error to console in development
    if (process.env.NODE_ENV === 'development') {
      console.group('🚨 Error Boundary Caught');
      console.error('Error:', error);
      console.error('Component Stack:', errorInfo.componentStack);
      console.groupEnd();
    }
    
    // Call custom error handler
    this.props.onError?.(error, errorInfo);
    
    // Log to error tracking service (e.g., Sentry)
    // logErrorToService(error, errorInfo);
  }

  handleReset = (): void => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  handleGoHome = (): void => {
    window.location.href = '/app/dashboard';
  };

  handleReport = (): void => {
    const { error, errorInfo } = this.state;
    const report = {
      error: error?.message,
      stack: error?.stack,
      componentStack: errorInfo?.componentStack,
      timestamp: new Date().toISOString(),
      url: window.location.href,
      userAgent: navigator.userAgent,
    };
    
    // Copy to clipboard
    navigator.clipboard.writeText(JSON.stringify(report, null, 2));
    alert('Error report copied to clipboard. Please send to support.');
  };

  render(): ReactNode {
    const { 
      children, 
      fallback, 
      showReset = true, 
      showHome = true,
      showReport = true 
    } = this.props;
    const { hasError, error } = this.state;

    if (hasError) {
      // Use custom fallback if provided
      if (fallback) {
        return fallback;
      }

      // Default error UI
      return (
        <div 
          className="min-h-[400px] flex items-center justify-center p-6"
          role="alert"
          aria-live="assertive"
        >
          <div className="max-w-md w-full text-center">
            {/* Error Icon */}
            <div className="mx-auto w-16 h-16 rounded-2xl bg-red-100 dark:bg-red-900/20 flex items-center justify-center mb-6">
              <AlertTriangle 
                size={32} 
                className="text-red-500" 
                aria-hidden="true"
              />
            </div>

            {/* Error Message */}
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
              Oops! Terjadi Kesalahan
            </h2>
            <p className="text-slate-500 dark:text-slate-400 mb-6">
              Halaman yang Anda akses mengalami error. 
              Silakan coba lagi atau kembali ke halaman utama.
            </p>

            {/* Error Details (Development Only) */}
            {process.env.NODE_ENV === 'development' && error && (
              <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/10 rounded-xl text-left">
                <p className="text-xs font-mono text-red-600 dark:text-red-400 break-all">
                  {error.message}
                </p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              {showReset && (
                <button
                  onClick={this.handleReset}
                  className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl font-semibold text-sm hover:bg-slate-800 dark:hover:bg-slate-100 transition-colors"
                  aria-label="Coba lagi"
                >
                  <RefreshCw size={16} aria-hidden="true" />
                  Coba Lagi
                </button>
              )}
              
              {showHome && (
                <button
                  onClick={this.handleGoHome}
                  className="inline-flex items-center justify-center gap-2 px-5 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl font-semibold text-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                  aria-label="Kembali ke beranda"
                >
                  <Home size={16} aria-hidden="true" />
                  Ke Dashboard
                </button>
              )}
              
              {showReport && process.env.NODE_ENV === 'development' && (
                <button
                  onClick={this.handleReport}
                  className="inline-flex items-center justify-center gap-2 px-5 py-2.5 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 font-medium text-sm transition-colors"
                  aria-label="Laporkan error"
                >
                  <Bug size={16} aria-hidden="true" />
                  Laporkan
                </button>
              )}
            </div>
          </div>
        </div>
      );
    }

    return children;
  }
}

/**
 * Page-level Error Boundary with simplified UI
 */
export class PageErrorBoundary extends ErrorBoundary {
  static defaultProps = {
    showReset: true,
    showHome: true,
    showReport: false,
  };
}

/**
 * Section-level Error Boundary for smaller errors
 */
export function SectionErrorBoundary({ 
  children,
  title = "Tidak dapat memuat konten"
}: { 
  children: ReactNode;
  title?: string;
}) {
  return (
    <ErrorBoundary
      fallback={
        <div className="p-6 bg-red-50 dark:bg-red-900/10 rounded-xl text-center">
          <AlertTriangle 
            size={24} 
            className="mx-auto text-red-400 mb-3" 
            aria-hidden="true"
          />
          <p className="text-sm font-medium text-red-600 dark:text-red-400">
            {title}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="mt-3 text-xs text-red-500 hover:text-red-600 underline"
          >
            Muat ulang halaman
          </button>
        </div>
      }
    >
      {children}
    </ErrorBoundary>
  );
}

export default ErrorBoundary;