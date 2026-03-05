/**
 * Role Management Hook
 * @module hooks/useRoleManagement
 * 
 * Hook for calling Cloud Functions to manage user roles.
 * Only superadmin can use these functions.
 * 
 * Requirements:
 * - Cloud Functions must be deployed
 * - Caller must be superadmin for setUserRole
 * - Caller must be admin/superadmin for getUserRole
 */

import { useState, useCallback } from 'react';
import { getFunctions, httpsCallable, FunctionsError } from 'firebase/functions';
import { app } from '../lib/firebase';
import { UserRole } from '../types/auth';
import { useAuth } from '../context/AuthContext';

// ============================================
// TYPES
// ============================================

interface SetRolePayload {
  targetUid: string;
  role: UserRole;
}

interface SetRoleResult {
  success: boolean;
  message: string;
}

interface GetRolePayload {
  targetUid: string;
}

interface GetRoleResult {
  uid: string;
  role: UserRole;
}

interface UseRoleManagementReturn {
  /** Set a user's role (superadmin only) */
  setUserRole: (targetUid: string, role: UserRole) => Promise<boolean>;
  /** Get a user's current role (admin/superadmin only) */
  getUserRole: (targetUid: string) => Promise<UserRole | null>;
  /** Loading state for async operations */
  loading: boolean;
  /** Error message if operation failed */
  error: string | null;
  /** Clear error state */
  clearError: () => void;
}

// ============================================
// HOOK
// ============================================

/**
 * Hook for managing user roles via Cloud Functions
 * 
 * @example
 * const { setUserRole, loading, error } = useRoleManagement();
 * 
 * const handleSetRole = async () => {
 *   const success = await setUserRole('user-uid', 'admin');
 *   if (success) {
 *     toast.success('Role updated!');
 *   }
 * };
 */
export function useRoleManagement(): UseRoleManagementReturn {
  const { isSuperAdmin, isAdmin, refreshClaims, currentUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Set a user's role
   * Only callable by superadmin
   */
  const setUserRole = useCallback(async (
    targetUid: string, 
    role: UserRole
  ): Promise<boolean> => {
    // Validate permissions
    if (!isSuperAdmin) {
      setError('Hanya superadmin yang dapat mengubah role pengguna.');
      return false;
    }

    // Validate input
    if (!targetUid || typeof targetUid !== 'string') {
      setError('UID pengguna tidak valid.');
      return false;
    }

    const validRoles: UserRole[] = ['student', 'admin', 'superadmin'];
    if (!validRoles.includes(role)) {
      setError(`Role tidak valid. Gunakan: ${validRoles.join(', ')}`);
      return false;
    }

    // Prevent demoting self
    if (targetUid === currentUser?.uid && role !== 'superadmin') {
      setError('Anda tidak dapat menurunkan role diri sendiri dari superadmin.');
      return false;
    }

    setLoading(true);
    setError(null);

    try {
      const functions = getFunctions(app);
      const setRole = httpsCallable<SetRolePayload, SetRoleResult>(
        functions, 
        'setUserRole'
      );

      const result = await setRole({ targetUid, role });

      if (result.data.success) {
        // Refresh claims if changing own role
        if (targetUid === currentUser?.uid) {
          await refreshClaims();
        }
        return true;
      }

      setError(result.data.message || 'Gagal mengubah role.');
      return false;
    } catch (err) {
      const functionsError = err as FunctionsError;
      let errorMessage = 'Gagal mengubah role.';
      
      switch (functionsError.code) {
        case 'unauthenticated':
          errorMessage = 'Anda harus login terlebih dahulu.';
          break;
        case 'permission-denied':
          errorMessage = 'Hanya superadmin yang dapat mengubah role.';
          break;
        case 'invalid-argument':
          errorMessage = functionsError.message || 'Parameter tidak valid.';
          break;
        case 'not-found':
          errorMessage = 'Pengguna tidak ditemukan.';
          break;
        case 'internal':
          errorMessage = 'Terjadi kesalahan server. Coba lagi nanti.';
          break;
        default:
          errorMessage = functionsError.message || 'Gagal mengubah role.';
      }
      
      setError(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  }, [isSuperAdmin, currentUser, refreshClaims]);

  /**
   * Get a user's current role
   * Callable by admin or superadmin
   */
  const getUserRole = useCallback(async (
    targetUid: string
  ): Promise<UserRole | null> => {
    // Validate permissions
    if (!isAdmin) {
      setError('Hanya admin atau superadmin yang dapat melihat role pengguna.');
      return null;
    }

    // Validate input
    if (!targetUid || typeof targetUid !== 'string') {
      setError('UID pengguna tidak valid.');
      return null;
    }

    setLoading(true);
    setError(null);

    try {
      const functions = getFunctions(app);
      const getRole = httpsCallable<GetRolePayload, GetRoleResult>(
        functions, 
        'getUserRole'
      );

      const result = await getRole({ targetUid });
      return result.data.role;
    } catch (err) {
      const functionsError = err as FunctionsError;
      let errorMessage = 'Gagal mengambil role.';
      
      switch (functionsError.code) {
        case 'unauthenticated':
          errorMessage = 'Anda harus login terlebih dahulu.';
          break;
        case 'permission-denied':
          errorMessage = 'Anda tidak memiliki akses untuk melihat role.';
          break;
        case 'not-found':
          errorMessage = 'Pengguna tidak ditemukan.';
          break;
        default:
          errorMessage = functionsError.message || 'Gagal mengambil role.';
      }
      
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, [isAdmin]);

  /**
   * Clear error state
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    setUserRole,
    getUserRole,
    loading,
    error,
    clearError,
  };
}

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Check if Cloud Functions are available
 * Use this to show/hide role management features
 */
export async function checkFunctionsAvailability(): Promise<boolean> {
  try {
    const functions = getFunctions(app);
    // Try to get any function to check connectivity
    // This doesn't actually call the function, just checks if Functions is initialized
    return functions !== null;
  } catch {
    return false;
  }
}