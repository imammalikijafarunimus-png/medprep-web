/**
 * Empty State Components
 * @module components/ui/EmptyState
 * 
 * Meaningful empty states for when there's no data to display.
 * All with proper accessibility and actionable suggestions.
 */

import React from 'react';
import { 
  Inbox, 
  Search, 
  FileQuestion, 
  FolderOpen,
  AlertCircle,
  CheckCircle2,
  BookOpen,
  Trophy
} from 'lucide-react';
import { cn } from '../../lib/utils';

interface EmptyStateProps {
  /** Icon to display */
  icon?: React.ReactNode;
  /** Title text */
  title: string;
  /** Description text */
  description?: string;
  /** Action button */
  action?: {
    label: string;
    onClick: () => void;
  };
  /** Secondary action */
  secondaryAction?: {
    label: string;
    onClick: () => void;
  };
  /** Additional classes */
  className?: string;
  /** Size variant */
  size?: 'sm' | 'md' | 'lg';
}

const SIZE_CONFIG = {
  sm: {
    container: 'py-8 px-4',
    icon: 'w-12 h-12',
    title: 'text-base',
    description: 'text-xs',
  },
  md: {
    container: 'py-12 px-6',
    icon: 'w-16 h-16',
    title: 'text-lg',
    description: 'text-sm',
  },
  lg: {
    container: 'py-16 px-8',
    icon: 'w-20 h-20',
    title: 'text-xl',
    description: 'text-base',
  },
};

/**
 * Base empty state component
 */
export function EmptyState({
  icon,
  title,
  description,
  action,
  secondaryAction,
  className,
  size = 'md',
}: EmptyStateProps) {
  const config = SIZE_CONFIG[size];

  return (
    <div 
      className={cn(
        'flex flex-col items-center justify-center text-center',
        config.container,
        className
      )}
      role="status"
      aria-live="polite"
    >
      {/* Icon */}
      {icon && (
        <div 
          className={cn(
            'mb-4 rounded-2xl bg-slate-100 dark:bg-slate-800',
            'flex items-center justify-center text-slate-400',
            config.icon
          )}
          aria-hidden="true"
        >
          {icon}
        </div>
      )}

      {/* Title */}
      <h3 className={cn(
        'font-bold text-slate-900 dark:text-white mb-2',
        config.title
      )}>
        {title}
      </h3>

      {/* Description */}
      {description && (
        <p className={cn(
          'text-slate-500 dark:text-slate-400 max-w-sm',
          config.description
        )}>
          {description}
        </p>
      )}

      {/* Actions */}
      {(action || secondaryAction) && (
        <div className="mt-6 flex flex-col sm:flex-row gap-3">
          {action && (
            <button
              onClick={action.onClick}
              className="px-5 py-2.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl font-semibold text-sm hover:bg-slate-800 dark:hover:bg-slate-100 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
            >
              {action.label}
            </button>
          )}
          {secondaryAction && (
            <button
              onClick={secondaryAction.onClick}
              className="px-5 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl font-semibold text-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
            >
              {secondaryAction.label}
            </button>
          )}
        </div>
      )}
    </div>
  );
}

// ============================================
// PRESET EMPTY STATES
// ============================================

/**
 * No search results
 */
export function EmptySearchResults({ 
  query,
  onClear 
}: { 
  query?: string;
  onClear?: () => void;
}) {
  return (
    <EmptyState
      icon={<Search className="w-7 h-7" />}
      title="Tidak ada hasil"
      description={
        query 
          ? `Tidak ditemukan hasil untuk "${query}". Coba kata kunci lain.`
          : 'Masukkan kata kunci untuk mencari materi atau soal.'
      }
      action={onClear ? { label: 'Hapus Pencarian', onClick: onClear } : undefined}
    />
  );
}

/**
 * No questions available
 */
export function EmptyQuestions({ 
  onSelectOther 
}: { 
  onSelectOther?: () => void;
}) {
  return (
    <EmptyState
      icon={<FileQuestion className="w-7 h-7" />}
      title="Belum ada soal"
      description="Folder ini masih kosong. Pilih folder lain atau coba sistem yang berbeda."
      action={onSelectOther ? { label: 'Pilih Folder Lain', onClick: onSelectOther } : undefined}
    />
  );
}

/**
 * No data in folder
 */
export function EmptyFolder({ 
  folderName,
  onUpload 
}: { 
  folderName?: string;
  onUpload?: () => void;
}) {
  return (
    <EmptyState
      icon={<FolderOpen className="w-7 h-7" />}
      title="Folder kosong"
      description={
        folderName
          ? `Folder "${folderName}" tidak memiliki konten.`
          : 'Folder ini masih kosong.'
      }
      action={onUpload ? { label: 'Tambah Konten', onClick: onUpload } : undefined}
    />
  );
}

/**
 * No notifications
 */
export function EmptyNotifications() {
  return (
    <EmptyState
      icon={<Inbox className="w-7 h-7" />}
      title="Tidak ada notifikasi"
      description="Kamu sudah membaca semua notifikasi. Bagus!"
      size="sm"
    />
  );
}

/**
 * No progress yet
 */
export function EmptyProgress({ onStartLearning }: { onStartLearning?: () => void }) {
  return (
    <EmptyState
      icon={<Trophy className="w-8 h-8" />}
      title="Belum ada progress"
      description="Mulai latihan soal untuk melihat statistik performamu di sini."
      action={onStartLearning ? { label: 'Mulai Belajar', onClick: onStartLearning } : undefined}
    />
  );
}

/**
 * No study materials
 */
export function EmptyMaterials({ onBrowse }: { onBrowse?: () => void }) {
  return (
    <EmptyState
      icon={<BookOpen className="w-7 h-7" />}
      title="Belum ada materi"
      description="Materi untuk topik ini sedang disiapkan. Coba topik lain sementara."
      action={onBrowse ? { label: 'Jelajahi Topik Lain', onClick: onBrowse } : undefined}
    />
  );
}

/**
 * Error state
 */
export function ErrorState({ 
  message,
  onRetry 
}: { 
  message?: string;
  onRetry?: () => void;
}) {
  return (
    <EmptyState
      icon={<AlertCircle className="w-7 h-7" />}
      title="Gagal memuat data"
      description={message || 'Terjadi kesalahan. Silakan coba lagi.'}
      action={onRetry ? { label: 'Coba Lagi', onClick: onRetry } : undefined}
    />
  );
}

/**
 * Success/complete state
 */
export function CompleteState({ 
  message,
  onContinue 
}: { 
  message?: string;
  onContinue?: () => void;
}) {
  return (
    <EmptyState
      icon={<CheckCircle2 className="w-8 h-8 text-green-500" />}
      title="Selesai!"
      description={message || 'Kamu telah menyelesaikan semua soal di folder ini.'}
      action={onContinue ? { label: 'Lanjut Berikutnya', onClick: onContinue } : undefined}
    />
  );
}

/**
 * Feature locked (premium)
 */
export function LockedState({ 
  featureName,
  onUpgrade 
}: { 
  featureName?: string;
  onUpgrade?: () => void;
}) {
  return (
    <EmptyState
      icon={
        <div className="relative">
          <Inbox className="w-7 h-7" />
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-amber-500 rounded-full flex items-center justify-center">
            <span className="text-[10px]">🔒</span>
          </div>
        </div>
      }
      title="Fitur Terkunci"
      description={
        featureName
          ? `Fitur "${featureName}" hanya tersedia untuk pengguna Premium.`
          : 'Upgrade ke Premium untuk mengakses fitur ini.'
      }
      action={onUpgrade ? { label: 'Upgrade Premium', onClick: onUpgrade } : undefined}
    />
  );
}

/**
 * Offline state
 */
export function OfflineState({ onRetry }: { onRetry?: () => void }) {
  return (
    <EmptyState
      icon={<AlertCircle className="w-7 h-7 text-orange-500" />}
      title="Tidak ada koneksi"
      description="Periksa koneksi internet Anda dan coba lagi."
      action={onRetry ? { label: 'Coba Lagi', onClick: onRetry } : undefined}
    />
  );
}

export default EmptyState;