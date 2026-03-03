/**
 * User Stats Custom Hook
 * @module hooks/useUserStats
 * 
 * Centralized stats calculation - use this instead of duplicating logic.
 */

import { useMemo } from 'react';
import { useAuth } from '../context/AuthContext';

export interface UserStatsResult {
  /** Total questions answered */
  totalAnswered: number;
  /** Total correct answers */
  totalCorrect: number;
  /** Accuracy percentage (0-100) */
  accuracy: number;
  /** Current streak in days */
  streak: number;
  /** Progress per system */
  systemProgress: Record<string, { answered: number; correct: number; accuracy: number }>;
  /** Whether user has any activity */
  hasActivity: boolean;
  /** Average accuracy across all systems */
  averageSystemAccuracy: number;
  /** Total systems with progress */
  systemsStudied: number;
  /** Last activity date */
  lastActivityDate: Date | null;
}

/**
 * Hook for calculating and accessing user statistics
 * Single source of truth - use this instead of duplicating calculations
 */
export function useUserStats(): UserStatsResult {
  const { currentUser } = useAuth();

  return useMemo(() => {
    const stats = currentUser?.stats;

    // Basic stats with defaults
    const totalAnswered = stats?.totalAnswered ?? 0;
    const totalCorrect = stats?.totalCorrect ?? 0;
    const streak = stats?.streak ?? 0;
    const systemProgress = stats?.systemProgress ?? {};

    // Calculate accuracy
    const accuracy = totalAnswered > 0
      ? Math.round((totalCorrect / totalAnswered) * 100)
      : 0;

    // Has any activity
    const hasActivity = totalAnswered > 0;

    // Process system progress
    const processedSystemProgress: Record<string, { answered: number; correct: number; accuracy: number }> = {};
    let totalSystemAccuracy = 0;
    let systemsWithProgress = 0;

    for (const [systemId, progress] of Object.entries(systemProgress)) {
      const answered = progress.answered ?? 0;
      const correct = progress.correct ?? 0;
      const sysAccuracy = answered > 0 ? Math.round((correct / answered) * 100) : 0;

      processedSystemProgress[systemId] = {
        answered,
        correct,
        accuracy: sysAccuracy,
      };

      if (answered > 0) {
        totalSystemAccuracy += sysAccuracy;
        systemsWithProgress++;
      }
    }

    // Average accuracy across systems
    const averageSystemAccuracy = systemsWithProgress > 0
      ? Math.round(totalSystemAccuracy / systemsWithProgress)
      : 0;

    // Last activity date
    const lastActivityDate = stats?.lastAnsweredAt
      ? new Date(stats.lastAnsweredAt)
      : null;

    return {
      totalAnswered,
      totalCorrect,
      accuracy,
      streak,
      systemProgress: processedSystemProgress,
      hasActivity,
      averageSystemAccuracy,
      systemsStudied: systemsWithProgress,
      lastActivityDate,
    };
  }, [currentUser?.stats]);
}

/**
 * Get stats for a specific system
 */
export function useSystemStats(systemId: string): {
  answered: number;
  correct: number;
  accuracy: number;
  hasProgress: boolean;
} {
  const { systemProgress } = useUserStats();
  
  const progress = systemProgress[systemId];
  
  return {
    answered: progress?.answered ?? 0,
    correct: progress?.correct ?? 0,
    accuracy: progress?.accuracy ?? 0,
    hasProgress: (progress?.answered ?? 0) > 0,
  };
}

/**
 * Check if user has minimum required stats for features
 */
export function useStatsRequirements(): {
  canViewTrends: boolean;
  canCompareWithPeers: boolean;
  canAccessInsights: boolean;
} {
  const { totalAnswered, systemsStudied } = useUserStats();

  return {
    canViewTrends: totalAnswered >= 10,
    canCompareWithPeers: totalAnswered >= 50,
    canAccessInsights: totalAnswered >= 100 && systemsStudied >= 3,
  };
}

export default useUserStats;