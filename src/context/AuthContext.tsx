// src/context/AuthContext.tsx
import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { 
  onAuthStateChanged, 
  User as FirebaseUser, 
  GoogleAuthProvider, 
  signInWithPopup,
  signOut,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile 
} from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc, increment, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../lib/firebase'; 
import { getDeviceId } from '../utils/device';

// Interface untuk Stats User
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
  subscriptionStatus?: 'free' | 'basic' | 'expert' | 'premium';   // ← UPDATE INI
  stats?: UserStats;
}

interface AuthContextType {
  currentUser: AppUser | null;
  loading: boolean;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  register: (email: string, password: string, name: string, university: string, segment: 'muhammadiyah' | 'general') => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  updateUserProfile: (name: string) => Promise<void>;
  updateGlobalStats: (systemId: string, isCorrect: boolean) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) throw new Error('useAuth must be used within an AuthProvider');
  return context;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);

  // ... (updateGlobalStats, loginWithGoogle, login, logout, updateUserProfile tetap sama)

  const updateGlobalStats = async (systemId: string, isCorrect: boolean) => {
    // (kode lama kamu tetap sama, tidak diubah)
    if (!currentUser) return;
    const userRef = doc(db, "users", currentUser.uid);
    
    const today = new Date().toDateString();
    const lastDate = currentUser.stats?.lastAnsweredAt ? new Date(currentUser.stats.lastAnsweredAt).toDateString() : null;
    
    let newStreak = currentUser.stats?.streak || 0;
    
    if (lastDate !== today) {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        if (lastDate === yesterday.toDateString()) {
            newStreak++;
        } else if (lastDate !== today) {
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
        const prevStats = prev.stats || { totalAnswered: 0, totalCorrect: 0, streak: 0, lastAnsweredAt: null, systemProgress: {} };
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
      console.error("Error updating stats:", error);
    }
  };

  const loginWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
  };

  // ================== REGISTER BARU (FIX UTAMA) ==================
  const register = async (
    email: string, 
    password: string, 
    name: string, 
    university: string, 
    segment: 'muhammadiyah' | 'general'
  ) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    
    if (userCredential.user) {
        await updateProfile(userCredential.user, { displayName: name });
        
        const userDoc = {
            displayName: name,
            email: email,
            university: university,
            segment: segment,
            subscriptionStatus: 'free' as const,
            role: 'student',
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

        // Update state langsung
        setCurrentUser({
            uid: userCredential.user.uid,
            email: email,
            displayName: name,
            photoURL: null,
            subscriptionStatus: 'free',
            stats: userDoc.stats
        });
    }
  };

  const login = async (email: string, password: string) => {
    const userCredential = await signInWithEmailAndPassword(auth, email.trim(), password);
    
    if (userCredential.user) {
      await updateDoc(doc(db, "users", userCredential.user.uid), {
        lastDeviceId: getDeviceId(),
        lastLoginAt: serverTimestamp()
      });
    }
  };

  const logout = () => signOut(auth);

  const updateUserProfile = async (name: string) => {
    if (auth.currentUser) {
        await updateProfile(auth.currentUser, { displayName: name });
        setCurrentUser((prev) => prev ? { ...prev, displayName: name } : null);
    }
  };

// ================== ON AUTH STATE CHANGED (PENGECEKAN STRICT) ==================
useEffect(() => {
  const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
    if (firebaseUser) {
      const docRef = doc(db, "users", firebaseUser.uid);
      const docSnap = await getDoc(docRef);
      
      let userData: AppUser = {
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        displayName: firebaseUser.displayName,
        photoURL: firebaseUser.photoURL,
        university: undefined,
        segment: undefined,
        subscriptionStatus: 'free' as 'free' | 'premium',
        stats: { totalAnswered: 0, totalCorrect: 0, streak: 0, lastAnsweredAt: null, systemProgress: {} }
      };

      if (docSnap.exists()) {
        const data = docSnap.data();

        // SINGLE DEVICE CHECK
        const currentDeviceId = getDeviceId();
        if (data.lastDeviceId && data.lastDeviceId !== currentDeviceId) {
          await signOut(auth);
          localStorage.removeItem('medprep_device_id');
          alert("Akun Anda sedang digunakan di perangkat lain.\nAnda telah dikeluarkan secara otomatis.");
          setCurrentUser(null);
          return;
        }

        userData.subscriptionStatus = data.subscriptionStatus === 'premium' ? 'premium' : 'free';
        userData.stats = data.stats || userData.stats;
        userData.university = data.university;
        userData.segment = data.segment;
      } else {
        await setDoc(docRef, { ...userData, stats: userData.stats }, { merge: true });
      }
      
      setCurrentUser(userData);
    } else {
      setCurrentUser(null);
    }
    setLoading(false);
  });
  return unsubscribe;
}, []);

  const value = {
    currentUser,
    loading,
    loginWithGoogle,
    logout,
    register,
    login,
    updateUserProfile,
    updateGlobalStats
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}