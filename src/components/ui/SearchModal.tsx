/**
 * Search Modal Component
 * @module components/ui/SearchModal
 * 
 * Full-featured search with:
 * - Keyboard shortcuts (Cmd/Ctrl + K)
 * - Recent searches
 * - Category filters
 * - Instant results
 */

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, X, Clock, TrendingUp, FileQuestion, 
  FolderOpen, Stethoscope, Zap, ArrowRight, 
  Command, CornerDownLeft 
} from 'lucide-react';
import { cn } from '../../lib/utils';

interface SearchResult {
  id: string;
  type: 'question' | 'topic' | 'case' | 'station' | 'page';
  title: string;
  subtitle?: string;
  path: string;
  keywords?: string[];
}

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  results?: SearchResult[];
  onSearch?: (query: string) => void;
  recentSearches?: string[];
  onClearRecent?: () => void;
}

const TYPE_ICONS: Record<string, React.ReactNode> = {
  question: <FileQuestion size={16} />,
  topic: <FolderOpen size={16} />,
  case: <FolderOpen size={16} />,
  station: <Stethoscope size={16} />,
  page: <Zap size={16} />,
};

const TYPE_COLORS: Record<string, string> = {
  question: 'text-blue-500',
  topic: 'text-green-500',
  case: 'text-purple-500',
  station: 'text-amber-500',
  page: 'text-teal-500',
};

// Quick actions for search
const QUICK_ACTIONS: SearchResult[] = [
  { id: 'cbt', type: 'page', title: 'CBT Center', subtitle: 'Latihan soal ujian', path: '/app/cbt' },
  { id: 'osce', type: 'page', title: 'OSCE Center', subtitle: 'Praktik ujian skill', path: '/app/osce' },
  { id: 'flashcard', type: 'page', title: 'Flashcards', subtitle: 'Latihan cepat', path: '/app/flashcards' },
  { id: 'profile', type: 'page', title: 'Profil', subtitle: 'Pengaturan akun', path: '/app/profile' },
];

export function SearchModal({
  isOpen,
  onClose,
  results = [],
  onSearch,
  recentSearches = [],
  onClearRecent,
}: SearchModalProps) {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  // Focus input on open
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Reset state on close
  useEffect(() => {
    if (!isOpen) {
      setQuery('');
      setSelectedIndex(0);
    }
  }, [isOpen]);

  // Filter quick actions based on query
  const filteredActions = useMemo(() => {
    if (!query) return QUICK_ACTIONS;
    return QUICK_ACTIONS.filter(action =>
      action.title.toLowerCase().includes(query.toLowerCase()) ||
      action.subtitle?.toLowerCase().includes(query.toLowerCase())
    );
  }, [query]);

  // Combine results
  const allResults = query ? [...results, ...filteredActions] : [];

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setSelectedIndex(prev => 
            prev < allResults.length - 1 ? prev + 1 : prev
          );
          break;
        case 'ArrowUp':
          e.preventDefault();
          setSelectedIndex(prev => prev > 0 ? prev - 1 : prev);
          break;
        case 'Enter':
          e.preventDefault();
          if (allResults[selectedIndex]) {
            navigate(allResults[selectedIndex].path);
            onClose();
          } else if (query) {
            navigate(`/app/search?q=${encodeURIComponent(query)}`);
            onClose();
          }
          break;
        case 'Escape':
          e.preventDefault();
          onClose();
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, allResults, selectedIndex, query, navigate, onClose]);

  // Scroll selected item into view
  useEffect(() => {
    if (resultsRef.current) {
      const selectedElement = resultsRef.current.querySelector(`[data-index="${selectedIndex}"]`);
      if (selectedElement) {
        selectedElement.scrollIntoView({ block: 'nearest' });
      }
    }
  }, [selectedIndex]);

  const handleSearch = useCallback((q: string) => {
    setQuery(q);
    onSearch?.(q);
  }, [onSearch]);

  const handleResultClick = (result: SearchResult) => {
    navigate(result.path);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100]"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal */}
      <div 
        className="fixed inset-x-4 top-[10%] z-[101] max-w-2xl mx-auto"
        role="dialog"
        aria-label="Pencarian"
        aria-modal="true"
      >
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-4 duration-200">
          
          {/* Search Input */}
          <div className="relative flex items-center border-b border-slate-200 dark:border-slate-700">
            <Search 
              size={18} 
              className="absolute left-4 text-slate-400" 
              aria-hidden="true"
            />
            <input
              ref={inputRef}
              type="text"
              placeholder="Cari soal, materi, atau obat..."
              value={query}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full pl-12 pr-20 py-4 bg-transparent text-slate-800 dark:text-white placeholder:text-slate-400 focus:outline-none text-base"
              aria-label="Pencarian"
              aria-autocomplete="list"
              aria-controls="search-results"
              aria-activedescendant={`result-${selectedIndex}`}
            />
            <div className="absolute right-4 flex items-center gap-1 text-xs text-slate-400">
              <kbd className="px-1.5 py-0.5 bg-slate-100 dark:bg-slate-800 rounded font-mono">
                <Command size={10} className="inline" /> K
              </kbd>
            </div>
          </div>

          {/* Results */}
          <div 
            ref={resultsRef}
            id="search-results"
            className="max-h-[60vh] overflow-y-auto"
            role="listbox"
          >
            {/* Results */}
            {allResults.length > 0 && (
              <div className="p-2">
                <div className="px-2 py-1.5 text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Hasil Pencarian
                </div>
                {allResults.map((result, index) => (
                  <button
                    key={`${result.type}-${result.id}`}
                    data-index={index}
                    onClick={() => handleResultClick(result)}
                    className={cn(
                      'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors text-left',
                      index === selectedIndex
                        ? 'bg-teal-50 dark:bg-teal-900/20'
                        : 'hover:bg-slate-50 dark:hover:bg-slate-800'
                    )}
                    role="option"
                    id={`result-${index}`}
                    aria-selected={index === selectedIndex}
                  >
                    <span className={cn(TYPE_COLORS[result.type])}>
                      {TYPE_ICONS[result.type]}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-slate-800 dark:text-white text-sm truncate">
                        {result.title}
                      </p>
                      {result.subtitle && (
                        <p className="text-xs text-slate-500 truncate">
                          {result.subtitle}
                        </p>
                      )}
                    </div>
                    <ArrowRight size={14} className="text-slate-300" aria-hidden="true" />
                  </button>
                ))}
              </div>
            )}

            {/* Recent Searches */}
            {query === '' && recentSearches.length > 0 && (
              <div className="p-2">
                <div className="flex items-center justify-between px-2 py-1.5">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Pencarian Terakhir
                  </span>
                  {onClearRecent && (
                    <button
                      onClick={onClearRecent}
                      className="text-xs text-slate-400 hover:text-red-500"
                    >
                      Hapus
                    </button>
                  )}
                </div>
                {recentSearches.map((search, index) => (
                  <button
                    key={search}
                    onClick={() => handleSearch(search)}
                    className="w-full flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-left"
                  >
                    <Clock size={14} className="text-slate-400" />
                    <span className="text-sm text-slate-600 dark:text-slate-300">
                      {search}
                    </span>
                  </button>
                ))}
              </div>
            )}

            {/* Quick Actions (when no query) */}
            {query === '' && recentSearches.length === 0 && (
              <div className="p-2">
                <div className="px-2 py-1.5 text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Aksi Cepat
                </div>
                {QUICK_ACTIONS.map((action, index) => (
                  <button
                    key={action.id}
                    data-index={index}
                    onClick={() => handleResultClick(action)}
                    className={cn(
                      'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors text-left',
                      index === selectedIndex
                        ? 'bg-teal-50 dark:bg-teal-900/20'
                        : 'hover:bg-slate-50 dark:hover:bg-slate-800'
                    )}
                    role="option"
                  >
                    <span className={cn(TYPE_COLORS[action.type])}>
                      {TYPE_ICONS[action.type]}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-slate-800 dark:text-white text-sm truncate">
                        {action.title}
                      </p>
                      {action.subtitle && (
                        <p className="text-xs text-slate-500 truncate">
                          {action.subtitle}
                        </p>
                      )}
                    </div>
                    <ArrowRight size={14} className="text-slate-300" />
                  </button>
                ))}
              </div>
            )}

            {/* No results */}
            {query && allResults.length === 0 && (
              <div className="p-8 text-center">
                <Search size={40} className="mx-auto text-slate-300 dark:text-slate-600 mb-3" />
                <p className="font-medium text-slate-600 dark:text-slate-400 mb-1">
                  Tidak ada hasil
                </p>
                <p className="text-sm text-slate-400">
                  Coba kata kunci lain atau tekan Enter untuk pencarian penuh
                </p>
              </div>
            )}
          </div>

          {/* Footer hint */}
          <div className="flex items-center justify-between px-4 py-2 border-t border-slate-200 dark:border-slate-700 text-xs text-slate-400">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1">
                <kbd className="px-1 py-0.5 bg-slate-100 dark:bg-slate-800 rounded">↑↓</kbd>
                navigasi
              </span>
              <span className="flex items-center gap-1">
                <kbd className="px-1 py-0.5 bg-slate-100 dark:bg-slate-800 rounded">Enter</kbd>
                pilih
              </span>
              <span className="flex items-center gap-1">
                <kbd className="px-1 py-0.5 bg-slate-100 dark:bg-slate-800 rounded">Esc</kbd>
                tutup
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

/**
 * Search trigger button
 */
interface SearchTriggerProps {
  onClick: () => void;
  className?: string;
}

export function SearchTrigger({ onClick, className }: SearchTriggerProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'flex items-center gap-2 px-3 py-2 rounded-full',
        'bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700',
        'text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700',
        'transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500',
        className
      )}
      aria-label="Buka pencarian (Cmd+K)"
    >
      <Search size={14} />
      <span className="text-sm hidden sm:inline">Cari...</span>
      <kbd className="hidden sm:flex items-center gap-0.5 px-1.5 py-0.5 bg-slate-200 dark:bg-slate-700 rounded text-[10px]">
        <Command size={8} />K
      </kbd>
    </button>
  );
}

/**
 * Hook for keyboard shortcut
 */
export function useSearchShortcut(callback: () => void) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        callback();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [callback]);
}

export default SearchModal;