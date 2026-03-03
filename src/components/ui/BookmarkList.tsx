/**
 * Bookmark List Component
 * @module components/ui/BookmarkList
 * 
 * Displays user's saved bookmarks with filtering and actions.
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Bookmark, FileQuestion, FolderOpen, Stethoscope, 
  Trash2, Search, Filter, SortAsc 
} from 'lucide-react';
import { useBookmarks, BookmarkType } from '../../hooks/useBookmarks';
import { cn } from '../../lib/utils';

const TYPE_ICONS: Record<BookmarkType, React.ReactNode> = {
  question: <FileQuestion size={16} />,
  topic: <FolderOpen size={16} />,
  case: <Bookmark size={16} />,
  station: <Stethoscope size={16} />,
};

const TYPE_LABELS: Record<BookmarkType, string> = {
  question: 'Soal',
  topic: 'Topik',
  case: 'Kasus',
  station: 'Station',
};

interface BookmarkListProps {
  filterType?: BookmarkType;
  maxItems?: number;
  showHeader?: boolean;
  className?: string;
}

export function BookmarkList({
  filterType,
  maxItems,
  showHeader = true,
  className,
}: BookmarkListProps) {
  const navigate = useNavigate();
  const { bookmarks, removeBookmark, clearBookmarks, isLoading } = useBookmarks();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<BookmarkType | 'all'>(filterType || 'all');

  // Filter bookmarks
  const filteredBookmarks = bookmarks
    .filter(b => selectedType === 'all' || b.type === selectedType)
    .filter(b => 
      b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.subtitle?.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .slice(0, maxItems);

  // Group by type
  const groupedBookmarks = filteredBookmarks.reduce((acc, bookmark) => {
    const type = bookmark.type;
    if (!acc[type]) acc[type] = [];
    acc[type].push(bookmark);
    return acc;
  }, {} as Record<BookmarkType, typeof bookmarks>);

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-3">
        {[1, 2, 3].map(i => (
          <div key={i} className="h-16 bg-slate-200 dark:bg-slate-800 rounded-xl" />
        ))}
      </div>
    );
  }

  if (bookmarks.length === 0) {
    return (
      <div className={cn('text-center py-8', className)}>
        <Bookmark size={40} className="mx-auto text-slate-300 dark:text-slate-600 mb-3" />
        <h3 className="font-medium text-slate-600 dark:text-slate-400 mb-1">
          Belum ada bookmark
        </h3>
        <p className="text-sm text-slate-400 dark:text-slate-500">
          Simpan soal atau materi untuk akses cepat
        </p>
      </div>
    );
  }

  return (
    <div className={cn('space-y-4', className)}>
      {/* Header */}
      {showHeader && (
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            Bookmark ({bookmarks.length})
          </h2>
          {bookmarks.length > 0 && (
            <button
              onClick={() => {
                if (confirm('Hapus semua bookmark?')) {
                  clearBookmarks();
                }
              }}
              className="text-xs text-red-500 hover:text-red-600 font-medium flex items-center gap-1"
            >
              <Trash2 size={12} />
              Hapus Semua
            </button>
          )}
        </div>
      )}

      {/* Search & Filter */}
      {bookmarks.length > 3 && !filterType && (
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Cari bookmark..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value as BookmarkType | 'all')}
            className="px-3 py-2 text-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
          >
            <option value="all">Semua</option>
            {Object.entries(TYPE_LABELS).map(([value, label]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
        </div>
      )}

      {/* Bookmark Groups */}
      {selectedType === 'all' && !filterType ? (
        Object.entries(groupedBookmarks).map(([type, items]) => (
          <div key={type} className="space-y-2">
            <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-2">
              {TYPE_ICONS[type as BookmarkType]}
              {TYPE_LABELS[type as BookmarkType]} ({items.length})
            </h3>
            <div className="space-y-1">
              {items.map((bookmark) => (
                <BookmarkItem
                  key={`${bookmark.type}-${bookmark.id}`}
                  bookmark={bookmark}
                  onNavigate={() => navigate(bookmark.path)}
                  onRemove={() => removeBookmark(bookmark.id, bookmark.type)}
                />
              ))}
            </div>
          </div>
        ))
      ) : (
        <div className="space-y-1">
          {filteredBookmarks.map((bookmark) => (
            <BookmarkItem
              key={`${bookmark.type}-${bookmark.id}`}
              bookmark={bookmark}
              onNavigate={() => navigate(bookmark.path)}
              onRemove={() => removeBookmark(bookmark.id, bookmark.type)}
            />
          ))}
        </div>
      )}

      {/* No results */}
      {filteredBookmarks.length === 0 && bookmarks.length > 0 && (
        <div className="text-center py-6 text-slate-500 dark:text-slate-400">
          <Search size={24} className="mx-auto mb-2 opacity-50" />
          <p className="text-sm">Tidak ditemukan bookmark "{searchQuery}"</p>
        </div>
      )}
    </div>
  );
}

// Individual bookmark item
function BookmarkItem({
  bookmark,
  onNavigate,
  onRemove,
}: {
  bookmark: {
    id: string;
    type: BookmarkType;
    title: string;
    subtitle?: string;
    path: string;
    createdAt: Date;
  };
  onNavigate: () => void;
  onRemove: () => void;
}) {
  const [showDelete, setShowDelete] = useState(false);

  return (
    <div
      className={cn(
        'group flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all',
        'bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700',
        'hover:border-teal-200 dark:hover:border-teal-800 hover:shadow-sm'
      )}
      onClick={onNavigate}
      onMouseEnter={() => setShowDelete(true)}
      onMouseLeave={() => setShowDelete(false)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter') onNavigate();
        if (e.key === 'Delete') onRemove();
      }}
    >
      {/* Icon */}
      <div className="w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
        {TYPE_ICONS[bookmark.type]}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p className="font-medium text-slate-800 dark:text-white truncate text-sm">
          {bookmark.title}
        </p>
        {bookmark.subtitle && (
          <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
            {bookmark.subtitle}
          </p>
        )}
      </div>

      {/* Delete button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onRemove();
        }}
        className={cn(
          'p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all',
          showDelete ? 'opacity-100' : 'opacity-0'
        )}
        aria-label="Hapus bookmark"
      >
        <Trash2 size={14} />
      </button>
    </div>
  );
}

export default BookmarkList;