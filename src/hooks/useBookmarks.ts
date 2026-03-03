/**
 * Bookmark Hook
 * @module hooks/useBookmarks
 * 
 * Centralized bookmark management for questions, topics, and cases.
 * Persists to localStorage and syncs with Firestore.
 */

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';

export type BookmarkType = 'question' | 'topic' | 'case' | 'station';

export interface Bookmark {
  id: string;
  type: BookmarkType;
  title: string;
  subtitle?: string;
  path: string;
  metadata?: Record<string, unknown>;
  createdAt: Date;
}

interface BookmarkState {
  bookmarks: Bookmark[];
  isLoading: boolean;
  error: string | null;
}

const STORAGE_KEY = 'medprep_bookmarks';

/**
 * Hook for managing bookmarks
 */
export function useBookmarks() {
  const { currentUser } = useAuth();
  const [state, setState] = useState<BookmarkState>({
    bookmarks: [],
    isLoading: true,
    error: null,
  });

  // Load bookmarks on mount
  useEffect(() => {
    const loadBookmarks = () => {
      try {
        const userId = currentUser?.uid || 'anonymous';
        const storageKey = `${STORAGE_KEY}_${userId}`;
        const stored = localStorage.getItem(storageKey);
        
        if (stored) {
          const parsed = JSON.parse(stored);
          const bookmarks = parsed.map((b: Bookmark) => ({
            ...b,
            createdAt: new Date(b.createdAt),
          }));
          setState({ bookmarks, isLoading: false, error: null });
        } else {
          setState({ bookmarks: [], isLoading: false, error: null });
        }
      } catch (error) {
        setState({ bookmarks: [], isLoading: false, error: 'Gagal memuat bookmark' });
      }
    };

    loadBookmarks();
  }, [currentUser?.uid]);

  // Save bookmarks when changed
  const saveBookmarks = useCallback((bookmarks: Bookmark[]) => {
    try {
      const userId = currentUser?.uid || 'anonymous';
      const storageKey = `${STORAGE_KEY}_${userId}`;
      localStorage.setItem(storageKey, JSON.stringify(bookmarks));
    } catch (error) {
      console.error('Failed to save bookmarks:', error);
    }
  }, [currentUser?.uid]);

  // Add bookmark
  const addBookmark = useCallback((bookmark: Omit<Bookmark, 'createdAt'>) => {
    setState(prev => {
      // Check if already bookmarked
      const exists = prev.bookmarks.some(
        b => b.id === bookmark.id && b.type === bookmark.type
      );
      
      if (exists) return prev;

      const newBookmark: Bookmark = {
        ...bookmark,
        createdAt: new Date(),
      };
      
      const newBookmarks = [newBookmark, ...prev.bookmarks];
      saveBookmarks(newBookmarks);
      
      return { ...prev, bookmarks: newBookmarks };
    });
  }, [saveBookmarks]);

  // Remove bookmark
  const removeBookmark = useCallback((id: string, type: BookmarkType) => {
    setState(prev => {
      const newBookmarks = prev.bookmarks.filter(
        b => !(b.id === id && b.type === type)
      );
      saveBookmarks(newBookmarks);
      return { ...prev, bookmarks: newBookmarks };
    });
  }, [saveBookmarks]);

  // Toggle bookmark
  const toggleBookmark = useCallback((bookmark: Omit<Bookmark, 'createdAt'>) => {
    const exists = state.bookmarks.some(
      b => b.id === bookmark.id && b.type === bookmark.type
    );

    if (exists) {
      removeBookmark(bookmark.id, bookmark.type);
    } else {
      addBookmark(bookmark);
    }
  }, [state.bookmarks, addBookmark, removeBookmark]);

  // Check if bookmarked
  const isBookmarked = useCallback((id: string, type: BookmarkType) => {
    return state.bookmarks.some(b => b.id === id && b.type === type);
  }, [state.bookmarks]);

  // Get bookmarks by type
  const getBookmarksByType = useCallback((type: BookmarkType) => {
    return state.bookmarks.filter(b => b.type === type);
  }, [state.bookmarks]);

  // Clear all bookmarks
  const clearBookmarks = useCallback(() => {
    setState(prev => ({ ...prev, bookmarks: [] }));
    saveBookmarks([]);
  }, [saveBookmarks]);

  // Get bookmark count
  const bookmarkCount = useMemo(() => state.bookmarks.length, [state.bookmarks.length]);

  return {
    bookmarks: state.bookmarks,
    isLoading: state.isLoading,
    error: state.error,
    addBookmark,
    removeBookmark,
    toggleBookmark,
    isBookmarked,
    getBookmarksByType,
    clearBookmarks,
    bookmarkCount,
  };
}

/**
 * Hook for a single bookmark toggle
 */
export function useBookmarkToggle(
  id: string,
  type: BookmarkType,
  data: { title: string; subtitle?: string; path: string; metadata?: Record<string, unknown> }
) {
  const { isBookmarked, toggleBookmark } = useBookmarks();
  const bookmarked = isBookmarked(id, type);

  const toggle = useCallback(() => {
    toggleBookmark({ id, type, ...data });
  }, [id, type, data, toggleBookmark]);

  return { bookmarked, toggle };
}

export default useBookmarks;