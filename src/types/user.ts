/**
 * User Type Definitions
 * @module types/user
 * 
 * Complete type definitions for user-related data structures
 */

// ============================================
// USER PREFERENCES
// ============================================

export interface UserPreferences {
  showIslamicInsight: boolean;
  showPrayerTimes: boolean;
  darkMode?: 'light' | 'dark' | 'system';
  notifications?: {
    email: boolean;
    push: boolean;
    studyReminders: boolean;
  };
  language?: 'id' | 'en';
}

// ============================================
// USER STATS
// ============================================

export interface SystemProgress {
  answered: number;
  correct: number;
}

export interface UserStats {
  totalAnswered: number;
  totalCorrect: number;
  streak: number;
  longestStreak?: number;
  lastAnsweredAt: Date | null;
  systemProgress: Record<string, SystemProgress>;
  weeklyGoal?: number;
  weeklyProgress?: number;
}

// ============================================
// SUBSCRIPTION TYPES
// ============================================

export type SubscriptionStatus = 'free' | 'basic' | 'expert' | 'premium';

export interface SubscriptionDetails {
  status: SubscriptionStatus;
  startDate?: Date;
  endDate?: Date;
  autoRenew?: boolean;
  paymentMethod?: string;
}

// ============================================
// USER ROLE
// ============================================

/**
 * User roles with hierarchy:
 * - student: Default role, can access learning content
 * - admin: Can manage content (questions, OSCE stations)
 * - superadmin: Full access, can manage user roles
 */
export type UserRole = 'student' | 'admin' | 'superadmin';

// ============================================
// USER SEGMENT
// ============================================

export type UserSegment = 'muhammadiyah' | 'general';

// ============================================
// MAIN USER PROFILE
// ============================================

export interface UserProfile {
  // Identity
  uid: string;
  name: string;
  displayName?: string;
  email: string;
  photoURL?: string | null;
  
  // Education
  university: string;
  segment: UserSegment;
  
  // Role & Access
  role: UserRole;
  subscriptionStatus: SubscriptionStatus;
  
  // Preferences
  preferences: UserPreferences;
  
  // Stats
  stats: UserStats;
  
  // Device & Security
  deviceId?: string;
  lastDeviceId?: string;
  lastLoginAt?: Date;
  lastLoginIp?: string;
  
  // Timestamps
  createdAt: Date;
  updatedAt?: Date;
}

// ============================================
// FIRESTORE USER DOCUMENT
// ============================================

export interface FirestoreUserDoc {
  uid: string;
  displayName: string | null;
  email: string | null;
  photoURL: string | null;
  university: string;
  segment: UserSegment;
  role: UserRole;
  subscriptionStatus: SubscriptionStatus;
  preferences: UserPreferences;
  stats: UserStats;
  deviceId?: string;
  lastDeviceId?: string;
  lastLoginAt?: Date | null;
  lastLoginIp?: string;
  createdAt: Date;
  updatedAt?: Date;
}

// ============================================
// API RESPONSE TYPES
// ============================================

export interface UserApiResponse {
  success: boolean;
  user?: UserProfile;
  error?: string;
  code?: string;
}

export interface UserListResponse {
  success: boolean;
  users?: UserProfile[];
  total?: number;
  page?: number;
  pageSize?: number;
  error?: string;
}

// ============================================
// FORM TYPES
// ============================================

export interface RegisterFormData {
  email: string;
  password: string;
  confirmPassword: string;
  name: string;
  university: string;
  segment: UserSegment;
  agreeToTerms: boolean;
}

export interface LoginFormData {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface ProfileUpdateFormData {
  name: string;
  university?: string;
  preferences?: Partial<UserPreferences>;
}

// ============================================
// VALIDATION TYPES
// ============================================

export interface FieldValidation {
  isValid: boolean;
  errors: string[];
}

export interface FormValidation<T> {
  isValid: boolean;
  fields: Partial<Record<keyof T, FieldValidation>>;
  generalErrors: string[];
}

// ============================================
// SESSION TYPES
// ============================================

export interface UserSession {
  sessionId: string;
  uid: string;
  deviceId: string;
  createdAt: Date;
  expiresAt: Date;
  isActive: boolean;
  lastActivity: Date;
}

// All types are already exported above with their definitions