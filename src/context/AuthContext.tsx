/**
 * Authentication Context with Custom Claims Support
 * @module context/AuthContext
 * 
 * Security improvements:
 * - Role-based access via Firebase Custom Claims (server-side validation)
 * - Rate limiting for auth operations
 * - Input validation & sanitization
 * - Enhanced session management
 * - Security event logging
 * - Better device fingerprinting
 * 
 * CHANGES FROM PREVIOUS VERSION:
 * ❌ REMOVED: admin_list.ts dependency (insecure client-side check)
 * ✅ ADDED: Role read from Firebase ID Token Custom Claims
 * ✅ ADDED: refreshClaims() for token refresh after role change
 * ✅ ADDED: Role helper properties (isAdmin, isSuperAdmin)
 */

import React, { createContext, useContext, useEffect, useState, ReactNode, useCallback } from 'react';
import { 
  onAuthStateChanged, 
  User as FirebaseUser, 
  GoogleAuthProvider, 
  signInWithPopup,
  signOut,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  getIdTokenResult,
  AuthError
} from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc, increment, serverTimestamp } from 'firebase/firestore';
import { auth, db, isFirebaseInitialized } from '../lib/firebase';
import { 
  getDeviceInfo, 
  createSession, 
  invalidateSession,
  getSecurityReport,
  DeviceInfo 
} from '../utils/device';
import { rateLimiter, RateLimitAction } from '../lib/rateLimiter';
import { 
  validateEmail, 
  validatePassword, 
  validateName, 
  validateUniversity
} from '../lib/validation';
import { 
  UserRole, 
  MedPrepUser, 
  hasMinimumRole, 
  parseRole 
} from '../types/auth';

// Check if Firebase is available
const firebaseReady = isFirebaseInitialized();

// ============================================
// TYPES
// ============================================

export interface UserStats {
  totalAnswered: number;
  totalCorrect: number;
  streak: number;
  lastAnsweredAt: Date | null;
  systemProgress: { [key: string]: { answered: number; correct: number } };
}

/**
 * @deprecated Use MedPrepUser from types/auth instead
 * Kept for backward compatibility
 */
export interface AppUser extends MedPrepUser {
  segment?: 'muhammadiyah' | 'general';
}

export interface AuthErrorWithCode extends Error {
  code?: string;
  isRateLimited?: boolean;
}

interface AuthContextType {
  /** Current logged-in user with role information */
  currentUser: AppUser | null;
  /** Raw Firebase User object for advanced operations */
  firebaseUser: FirebaseUser | null;
  /** Loading state during initial auth check */
  loading: boolean;
  /** Whether Firebase is properly initialized */
  isFirebaseReady: boolean;
  /** Current user's role from Custom Claims */
  role: UserRole | null;
  /** Shortcut: true if user has admin or superadmin role */
  isAdmin: boolean;
  /** Shortcut: true if user has superadmin role */
  isSuperAdmin: boolean;
  
  // Auth methods
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  register: (email: string, password: string, name: string, university: string, segment: 'muhammadiyah' | 'general') => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  updateUserProfile: (name: string) => Promise<void>;
  updateGlobalStats: (systemId: string, isCorrect: boolean) => Promise<void>;
  getRateLimitStatus: (action: RateLimitAction) => { remainingAttempts: number; blockedFor?: number };
  
  // Custom Claims methods
  /** Force refresh token to get latest claims (call after role change) */
  refreshClaims: () => Promise<void>;
}

// ============================================
// SECURITY LOGGING
// ============================================

const logSecurityEvent = (event: string, data?: Record<string, unknown>) => {
  const timestamp = new Date().toISOString();
  const logEntry = { timestamp, event, ...data };
  
  if (import.meta.env.DEV) {
    console.log('[Security]', logEntry);
  }
};

// ============================================
// CONTEXT
// ============================================

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<AppUser | null>(null);
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [deviceInfo, setDeviceInfo] = useState<DeviceInfo | null>(null);

  // ============================================
  // BUILD USER WITH CUSTOM CLAIMS
  // ============================================

  /**
   * Build MedPrepUser from Firebase User with Custom Claims
   * This is the core function for reading role from server-side token
   * 
   * @param user - Firebase User object
   * @param forceRefresh - Force refresh token to get latest claims
   */
  const buildMedPrepUser = useCallback(async (
    user: FirebaseUser, 
    forceRefresh: boolean = false
  ): Promise<AppUser> => {
    // Get ID token with custom claims
    const tokenResult = await getIdTokenResult(user, forceRefresh);
    
    // Extract role from claims (set by Cloud Functions)
    const role = parseRole(tokenResult.claims.role, 'student');

    // Get additional user data from Firestore
    const userDocRef = doc(db!, "users", user.uid);
    const userDocSnap = await getDoc(userDocRef);
    
    let userData: Partial<AppUser> = {};
    
    if (userDocSnap.exists()) {
      const data = userDocSnap.data();
      userData = {
        university: data.university,
        segment: data.segment,
        subscriptionStatus: data.subscriptionStatus || 'free',
        stats: data.stats || {
          totalAnswered: 0,
          totalCorrect: 0,
          streak: 0,
          lastAnsweredAt: null,
          systemProgress: {}
        }
      };
    }

    return {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      role, // Role from Custom Claims (server-side)
      ...userData
    };
  }, []);

  /**
   * Force refresh the token to get latest Custom Claims
   * Call this after admin changes user's role
   */
  const refreshClaims = useCallback(async () => {
    if (!firebaseUser) return;
    
    try {
      const updatedUser = await buildMedPrepUser(firebaseUser, true);
      setCurrentUser(updatedUser);
      logSecurityEvent('CLAIMS_REFRESHED', { uid: firebaseUser.uid, role: updatedUser.role });
    } catch (error) {
      console.error('[Auth] Failed to refresh claims:', error);
    }
  }, [firebaseUser, buildMedPrepUser]);

  // ============================================
  // DEVICE INITIALIZATION
  // ============================================

  useEffect(() => {
    const initDevice = async () => {
      try {
        const info = await getDeviceInfo();
        setDeviceInfo(info);
        
        const report = getSecurityReport();
        if (report.isAutomation) {
          logSecurityEvent('AUTOMATION_DETECTED', { report });
        }
      } catch (error) {
        console.error('[Auth] Failed to initialize device info:', error);
      }
    };
    
    initDevice();
  }, []);

  // ============================================
  // STATS UPDATE
  // ============================================

  const updateGlobalStats = useCallback(async (systemId: string, isCorrect: boolean) => {
    if (!currentUser || !db || !firebaseReady) return;
    
    const userRef = doc(db, "users", currentUser.uid);
    
    const today = new Date().toDateString();
    const lastDate = currentUser.stats?.lastAnsweredAt 
      ? new Date(currentUser.stats.lastAnsweredAt).toDateString() 
      : null;
    
    let newStreak = currentUser.stats?.streak || 0;
    
    if (lastDate !== today) {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      if (lastDate === yesterday.toDateString()) {
        newStreak++;
      } else {
        newStreak = 1;
      }
    }

    try {
      await updateDoc(userRef, {
        'stats.totalAnswered': increment(1),
        'stats.totalCorrect': increment(isCorrect ? 1 : 0),
        'stats.streak': newStreak,
        'stats.lastAnsweredAt': serverTimestamp(),
        [`stats.systemProgress.${systemId}.answered`]: increment(1),
        [`stats.systemProgress.${systemId}.correct`]: increment(isCorrect ? 1 : 0),
      });

      setCurrentUser(prev => {
        if (!prev) return prev;
        const prevStats = prev.stats || { 
          totalAnswered: 0, 
          totalCorrect: 0, 
          streak: 0, 
          lastAnsweredAt: null, 
          systemProgress: {} 
        };
        const sysProgress = prevStats.systemProgress[systemId] || { answered: 0, correct: 0 };
        
        return {
          ...prev,
          stats: {
            ...prevStats,
            totalAnswered: prevStats.totalAnswered + 1,
            totalCorrect: prevStats.totalCorrect + (isCorrect ? 1 : 0),
            streak: newStreak,
            lastAnsweredAt: new Date(),
            systemProgress: {
              ...prevStats.systemProgress,
              [systemId]: {
                answered: sysProgress.answered + 1,
                correct: sysProgress.correct + (isCorrect ? 1 : 0)
              }
            }
          }
        };
      });
    } catch (error) {
      console.error("[Auth] Error updating stats:", error);
    }
  }, [currentUser]);

  // ============================================
  // GOOGLE SIGN IN
  // ============================================

  const loginWithGoogle = useCallback(async () => {
    if (!auth || !firebaseReady) {
      throw new Error('Firebase belum siap. Periksa konfigurasi .env.local');
    }

    const rateCheck = rateLimiter.check('google_signin');
    if (!rateCheck.allowed) {
      const error = new Error(rateCheck.message) as AuthErrorWithCode;
      error.isRateLimited = true;
      throw error;
    }

    try {
      const provider = new GoogleAuthProvider();
      provider.addScope('email');
      provider.addScope('profile');
      
      await signInWithPopup(auth, provider);
      
      logSecurityEvent('GOOGLE_SIGNIN_SUCCESS', { device: deviceInfo?.deviceId });
    } catch (error) {
      rateLimiter.record('google_signin');
      logSecurityEvent('GOOGLE_SIGNIN_FAILED', { error });
      throw error;
    }
  }, [deviceInfo]);

  // ============================================
  // EMAIL/PASSWORD REGISTER
  // ============================================

  const register = useCallback(async (
    email: string, 
    password: string, 
    name: string, 
    university: string, 
    segment: 'muhammadiyah' | 'general'
  ) => {
    if (!auth || !db || !firebaseReady) {
      throw new Error('Firebase belum siap. Periksa konfigurasi .env.local');
    }

    const rateCheck = rateLimiter.check('register');
    if (!rateCheck.allowed) {
      const error = new Error(rateCheck.message) as AuthErrorWithCode;
      error.isRateLimited = true;
      throw error;
    }

    // Validate inputs
    const emailValidation = validateEmail(email);
    if (!emailValidation.isValid) throw new Error(emailValidation.errors[0]);

    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) throw new Error(passwordValidation.errors[0]);

    const nameValidation = validateName(name);
    if (!nameValidation.isValid) throw new Error(nameValidation.errors[0]);

    const universityValidation = validateUniversity(university);
    if (!universityValidation.isValid) throw new Error(universityValidation.errors[0]);

    const sanitizedEmail = emailValidation.sanitized!;
    const sanitizedName = nameValidation.sanitized!;
    const sanitizedUniversity = universityValidation.sanitized!;

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, sanitizedEmail, password);
      
      if (userCredential.user) {
        await updateProfile(userCredential.user, { displayName: sanitizedName });
        
        const deviceId = deviceInfo?.deviceId || 'unknown';
        createSession(deviceId);
        
        const userDoc = {
          displayName: sanitizedName,
          email: sanitizedEmail,
          university: sanitizedUniversity,
          segment: segment,
          subscriptionStatus: 'free' as const,
          role: 'student' as UserRole, // Default role - will be overwritten by Cloud Function
          deviceId: deviceId,
          preferences: {
            showIslamicInsight: false,
            showPrayerTimes: segment === 'muhammadiyah'
          },
          createdAt: serverTimestamp(),
          stats: { 
            totalAnswered: 0, 
            totalCorrect: 0, 
            streak: 0, 
            systemProgress: {}, 
            lastAnsweredAt: null 
          }
        };

        await setDoc(doc(db, "users", userCredential.user.uid), userDoc);

        // Build user with claims (will have 'student' role initially)
        const medPrepUser = await buildMedPrepUser(userCredential.user);
        setCurrentUser(medPrepUser);

        logSecurityEvent('REGISTER_SUCCESS', { uid: userCredential.user.uid, device: deviceId });
      }
    } catch (error) {
      rateLimiter.record('register');
      logSecurityEvent('REGISTER_FAILED', { email: sanitizedEmail, error });
      throw error;
    }
  }, [deviceInfo, buildMedPrepUser]);

  // ============================================
  // EMAIL/PASSWORD LOGIN
  // ============================================

  const login = useCallback(async (email: string, password: string) => {
    if (!auth || !db || !firebaseReady) {
      throw new Error('Firebase belum siap. Periksa konfigurasi .env.local');
    }

    const rateCheck = rateLimiter.check('login');
    if (!rateCheck.allowed) {
      const error = new Error(rateCheck.message) as AuthErrorWithCode;
      error.isRateLimited = true;
      throw error;
    }

    const emailValidation = validateEmail(email);
    if (!emailValidation.isValid) throw new Error(emailValidation.errors[0]);

    const sanitizedEmail = emailValidation.sanitized!;

    try {
      const userCredential = await signInWithEmailAndPassword(auth, sanitizedEmail, password);
      
      if (userCredential.user) {
        const deviceId = deviceInfo?.deviceId || 'unknown';
        createSession(deviceId);
        
        await updateDoc(doc(db, "users", userCredential.user.uid), {
          deviceId: deviceId,
          lastLoginAt: serverTimestamp(),
        });

        logSecurityEvent('LOGIN_SUCCESS', { uid: userCredential.user.uid, device: deviceId });
      }
    } catch (error) {
      rateLimiter.record('login');
      logSecurityEvent('LOGIN_FAILED', { email: sanitizedEmail, error });
      throw error;
    }
  }, [deviceInfo]);

  // ============================================
  // LOGOUT
  // ============================================

  const logout = useCallback(async () => {
    if (!auth) return;
    
    try {
      logSecurityEvent('LOGOUT', { uid: currentUser?.uid });
      invalidateSession();
      await signOut(auth);
    } catch (error) {
      console.error('[Auth] Logout error:', error);
      throw error;
    }
  }, [currentUser]);

  // ============================================
  // UPDATE PROFILE
  // ============================================

  const updateUserProfile = useCallback(async (name: string) => {
    if (!auth) return;

    const nameValidation = validateName(name);
    if (!nameValidation.isValid) throw new Error(nameValidation.errors[0]);

    const sanitizedName = nameValidation.sanitized!;

    if (auth.currentUser) {
      await updateProfile(auth.currentUser, { displayName: sanitizedName });
      setCurrentUser((prev) => prev ? { ...prev, displayName: sanitizedName } : null);
      
      logSecurityEvent('PROFILE_UPDATED', { uid: currentUser?.uid, newName: sanitizedName });
    }
  }, [currentUser]);

  // ============================================
  // RATE LIMIT STATUS HELPER
  // ============================================

  const getRateLimitStatus = useCallback((action: RateLimitAction) => {
    const result = rateLimiter.check(action);
    return {
      remainingAttempts: result.remainingAttempts,
      blockedFor: result.blockedFor,
    };
  }, []);

  // ============================================
  // AUTH STATE LISTENER WITH CUSTOM CLAIMS
  // ============================================

  useEffect(() => {
    // If Firebase is not ready, just finish loading
    if (!auth || !db || !firebaseReady) {
      console.log('[Auth] Firebase not initialized, skipping auth state listener');
      setLoading(false);
      return;
    }

    // Store references for use in callback (TypeScript null safety)
    const currentAuth = auth;
    const currentDb = db;

    const unsubscribe = onAuthStateChanged(currentAuth, async (fbUser) => {
      setFirebaseUser(fbUser);
      
      if (fbUser) {
        try {
          // Build user with Custom Claims
          const medPrepUser = await buildMedPrepUser(fbUser);
          
          // Single device check (only for premium users)
          const currentDeviceId = deviceInfo?.deviceId;
          const storedDeviceId = medPrepUser.deviceId;
          
          const shouldEnforceSingleDevice = 
            storedDeviceId && 
            currentDeviceId && 
            storedDeviceId !== currentDeviceId &&
            ['basic', 'expert', 'premium'].includes(medPrepUser.subscriptionStatus || 'free');

          if (shouldEnforceSingleDevice) {
            logSecurityEvent('MULTI_DEVICE_DETECTED', { uid: fbUser.uid });
            await signOut(currentAuth);
            invalidateSession();
            setCurrentUser(null);
            setFirebaseUser(null);
            setLoading(false);
            return;
          }

          setCurrentUser(medPrepUser);
          logSecurityEvent('AUTH_STATE_CHANGED', { uid: fbUser.uid, role: medPrepUser.role });
        } catch (error) {
          console.error('[Auth] Error building user:', error);
          // Fallback to basic user info
          setCurrentUser({
            uid: fbUser.uid,
            email: fbUser.email,
            displayName: fbUser.displayName,
            photoURL: fbUser.photoURL,
            role: 'student',
            subscriptionStatus: 'free',
            stats: {
              totalAnswered: 0,
              totalCorrect: 0,
              streak: 0,
              lastAnsweredAt: null,
              systemProgress: {}
            }
          });
        }
      } else {
        setCurrentUser(null);
        setFirebaseUser(null);
      }
      
      setLoading(false);
    });

    return unsubscribe;
  }, [deviceInfo, buildMedPrepUser]);

  // ============================================
  // COMPUTED PROPERTIES
  // ============================================

  const role = currentUser?.role ?? null;
  const isAdmin = hasMinimumRole(role ?? undefined, 'admin');
  const isSuperAdmin = hasMinimumRole(role ?? undefined, 'superadmin');

  // ============================================
  // CONTEXT VALUE
  // ============================================

  const value: AuthContextType = {
    currentUser,
    firebaseUser,
    loading,
    isFirebaseReady: firebaseReady,
    role,
    isAdmin,
    isSuperAdmin,
    loginWithGoogle,
    logout,
    register,
    login,
    updateUserProfile,
    updateGlobalStats,
    getRateLimitStatus,
    refreshClaims,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}