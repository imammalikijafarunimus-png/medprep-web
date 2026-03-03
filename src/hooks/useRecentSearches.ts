/**
 * Recent Searches Hook
 * @module hooks/useRecentSearches
 * 
 * Manages recent search history with localStorage persistence.
 */

import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'medprep_recent_searches';
const MAX_RECENT = 10;

export function useRecentSearches(maxItems: number = MAX_RECENT) {
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  // Load from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setRecentSearches(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Failed to load recent searches:', error);
    }
  }, []);

  // Save to localStorage
  const saveToStorage = useCallback((searches: string[]) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(searches));
    } catch (error) {
      console.error('Failed to save recent searches:', error);
    }
  }, []);

  // Add search
  const addSearch = useCallback((query: string) => {
    if (!query.trim()) return;

    setRecentSearches(prev => {
      // Remove duplicate and add to front
      const filtered = prev.filter(s => s.toLowerCase() !== query.toLowerCase());
      const updated = [query, ...filtered].slice(0, maxItems);
      saveToStorage(updated);
      return updated;
    });
  }, [maxItems, saveToStorage]);

  // Remove search
  const removeSearch = useCallback((query: string) => {
    setRecentSearches(prev => {
      const updated = prev.filter(s => s !== query);
      saveToStorage(updated);
      return updated;
    });
  }, [saveToStorage]);

  // Clear all
  const clearRecent = useCallback(() => {
    setRecentSearches([]);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  return {
    recentSearches,
    addSearch,
    removeSearch,
    clearRecent,
  };
}

export default useRecentSearches;