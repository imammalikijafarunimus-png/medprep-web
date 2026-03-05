/**
 * Authentication Types with Custom Claims Support
 * @module types/auth
 * 
 * Type definitions for Firebase Custom Claims-based role management.
 * This replaces the insecure admin_list.ts approach with server-side role validation.
 */

// ============================================
// USER ROLE DEFINITIONS
// ============================================

/**
 * User roles with hierarchy:
 * - student: Default role, can access learning content
 * - admin: Can manage content (questions, OSCE stations)
 * - superadmin: Full access, can manage user roles
 */
export type UserRole = 'student' | 'admin' | 'superadmin';

// ============================================
// USER INTERFACE
// ============================================

/**
 * Extended user interface with role information
 * Compatible with Firebase Custom Claims
 */
export interface MedPrepUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  role: UserRole;
  university?: string;
  segment?: 'muhammadiyah' | 'general';
  subscriptionStatus?: 'free' | 'basic' | 'expert' | 'premium';
  deviceId?: string;
  stats?: {
    totalAnswered: number;
    totalCorrect: number;
    streak: number;
    lastAnsweredAt: Date | null;
    systemProgress: Record<string, { answered: number; correct: number }>;
  };
}

// ============================================
// TOKEN CLAIMS INTERFACE
// ============================================

/**
 * Decoded Firebase ID Token with custom claims
 * These claims are set by Cloud Functions and verified server-side
 */
export interface MedPrepTokenClaims {
  role: UserRole;
  // Firebase default claims
  uid: string;
  email?: string;
  email_verified?: boolean;
  aud: string;
  iat: number;
  exp: number;
  auth_time?: number;
  sub?: string;
  iss?: string;
}

// ============================================
// ROLE HIERARCHY HELPER
// ============================================

/**
 * Role hierarchy levels for permission checks
 * Higher number = more permissions
 */
const ROLE_HIERARCHY: Record<UserRole, number> = {
  student: 0,
  admin: 1,
  superadmin: 2,
};

/**
 * Check if a user role meets the minimum required role
 * 
 * @param userRole - The user's current role
 * @param requiredRole - The minimum role required for access
 * @returns true if user has sufficient permissions
 * 
 * @example
 * // Check if user can access admin panel
 * if (hasMinimumRole(user.role, 'admin')) {
 *   // Allow access
 * }
 */
export const hasMinimumRole = (
  userRole: UserRole | undefined,
  requiredRole: UserRole
): boolean => {
  if (!userRole) return false;
  return ROLE_HIERARCHY[userRole] >= ROLE_HIERARCHY[requiredRole];
};

/**
 * Get the numeric level of a role for comparison
 * 
 * @param role - The role to get the level for
 * @returns The numeric level (0-2)
 */
export const getRoleLevel = (role: UserRole): number => {
  return ROLE_HIERARCHY[role];
};

/**
 * Get all roles that are at or above a certain level
 * 
 * @param minimumRole - The minimum role
 * @returns Array of roles that meet the requirement
 */
export const getRolesAtOrAbove = (minimumRole: UserRole): UserRole[] => {
  const minimumLevel = ROLE_HIERARCHY[minimumRole];
  return (Object.keys(ROLE_HIERARCHY) as UserRole[]).filter(
    role => ROLE_HIERARCHY[role] >= minimumLevel
  );
};

// ============================================
// ROLE LABELS & DISPLAY
// ============================================

/**
 * Display labels for each role (for UI)
 */
export const ROLE_LABELS: Record<UserRole, string> = {
  student: 'Student',
  admin: 'Admin',
  superadmin: 'Superadmin',
};

/**
 * Indonesian labels for each role
 */
export const ROLE_LABELS_ID: Record<UserRole, string> = {
  student: 'Mahasiswa',
  admin: 'Admin',
  superadmin: 'Superadmin',
};

/**
 * Role badge colors for UI components
 */
export const ROLE_COLORS: Record<UserRole, { bg: string; text: string }> = {
  student: { bg: 'bg-blue-100', text: 'text-blue-800' },
  admin: { bg: 'bg-yellow-100', text: 'text-yellow-800' },
  superadmin: { bg: 'bg-purple-100', text: 'text-purple-800' },
};

// ============================================
// VALIDATION HELPERS
// ============================================

/**
 * Type guard to check if a value is a valid UserRole
 * 
 * @param value - The value to check
 * @returns true if value is a valid UserRole
 */
export const isValidRole = (value: unknown): value is UserRole => {
  return (
    typeof value === 'string' &&
    ['student', 'admin', 'superadmin'].includes(value)
  );
};

/**
 * Parse and validate a role value with fallback
 * 
 * @param value - The value to parse
 * @param fallback - Default role if invalid (default: 'student')
 * @returns A valid UserRole
 */
export const parseRole = (value: unknown, fallback: UserRole = 'student'): UserRole => {
  if (isValidRole(value)) return value;
  return fallback;
};