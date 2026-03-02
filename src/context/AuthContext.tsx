/**
 * Authentication Context with Enhanced Security
 * @module context/AuthContext
 * 
 * Security improvements:
 * - Rate limiting for auth operations
 * - Input validation & sanitization
 * - Enhanced session management
 * - Security event logging
 * - Better device fingerprinting
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

export interface AppUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  university?: string;
  segment?: 'muhammadiyah' | 'general';
  subscriptionStatus?: 'free' | 'basic' | 'expert' | 'premium';
  stats?: UserStats;
  role?: 'student' | 'admin';
}

export interface AuthErrorWithCode extends Error {
  code?: string;
  isRateLimited?: boolean;
}

interface AuthContextType {
  currentUser: AppUser | null;
  loading: boolean;
  isFirebaseReady: boolean;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  register: (email: string, password: string, name: string, university: string, segment: 'muhammadiyah' | 'general') => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  updateUserProfile: (name: string) => Promise<void>;
  updateGlobalStats: (systemId: string, isCorrect: boolean) => Promise<void>;
  getRateLimitStatus: (action: RateLimitAction) => { remainingAttempts: number; blockedFor?: number };
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
  const [loading, setLoading] = useState(true);
  const [deviceInfo, setDeviceInfo] = useState<DeviceInfo | null>(null);

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
          role: 'student',
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

        setCurrentUser({
          uid: userCredential.user.uid,
          email: sanitizedEmail,
          displayName: sanitizedName,
          photoURL: null,
          university: sanitizedUniversity,
          segment: segment,
          subscriptionStatus: 'free',
          stats: userDoc.stats
        });

        logSecurityEvent('REGISTER_SUCCESS', { uid: userCredential.user.uid, device: deviceId });
      }
    } catch (error) {
      rateLimiter.record('register');
      logSecurityEvent('REGISTER_FAILED', { email: sanitizedEmail, error });
      throw error;
    }
  }, [deviceInfo]);

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
  // AUTH STATE LISTENER
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

    const unsubscribe = onAuthStateChanged(currentAuth, async (firebaseUser) => {
      if (firebaseUser) {
        const docRef = doc(currentDb, "users", firebaseUser.uid);
        const docSnap = await getDoc(docRef);
        
        let userData: AppUser = {
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName,
          photoURL: firebaseUser.photoURL,
          university: undefined,
          segment: undefined,
          subscriptionStatus: 'free',
          stats: { 
            totalAnswered: 0, 
            totalCorrect: 0, 
            streak: 0, 
            lastAnsweredAt: null, 
            systemProgress: {} 
          }
        };

        if (docSnap.exists()) {
          const data = docSnap.data();

          // Single device check (only for premium users)
          const currentDeviceId = deviceInfo?.deviceId;
          const storedDeviceId = data.deviceId;
          
          const shouldEnforceSingleDevice = 
            storedDeviceId && 
            currentDeviceId && 
            storedDeviceId !== currentDeviceId &&
            ['basic', 'expert', 'premium'].includes(data.subscriptionStatus);

          if (shouldEnforceSingleDevice) {
            logSecurityEvent('MULTI_DEVICE_DETECTED', { uid: firebaseUser.uid });
            await signOut(currentAuth);
            invalidateSession();
            setCurrentUser(null);
            setLoading(false);
            return;
          }

          userData.subscriptionStatus = data.subscriptionStatus || 'free';
          userData.stats = data.stats || userData.stats;
          userData.university = data.university;
          userData.segment = data.segment;
          userData.role = data.role;
        } else {
          const deviceId = deviceInfo?.deviceId || 'unknown';
          await setDoc(docRef, { 
            ...userData, 
            deviceId,
            stats: userData.stats,
            createdAt: serverTimestamp() 
          }, { merge: true });
        }
        
        setCurrentUser(userData);
        logSecurityEvent('AUTH_STATE_CHANGED', { uid: firebaseUser.uid });
      } else {
        setCurrentUser(null);
      }
      
      setLoading(false);
    });

    return unsubscribe;
  }, [deviceInfo]);

  // ============================================
  // CONTEXT VALUE
  // ============================================

  const value: AuthContextType = {
    currentUser,
    loading,
    isFirebaseReady: firebaseReady,
    loginWithGoogle,
    logout,
    register,
    login,
    updateUserProfile,
    updateGlobalStats,
    getRateLimitStatus,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}