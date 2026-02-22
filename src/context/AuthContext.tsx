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
  subscriptionStatus?: 'free' | 'premium';
  stats?: UserStats;
}

interface AuthContextType {
  currentUser: AppUser | null;
  loading: boolean;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>; // Diperbaiki: Promise<void>
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

  const updateGlobalStats = async (systemId: string, isCorrect: boolean) => {
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

  const register = async (email: string, password: string, name: string) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    if (userCredential.user) {
        await updateProfile(userCredential.user, { displayName: name });
        await setDoc(doc(db, "users", userCredential.user.uid), {
            displayName: name,
            email: email,
            subscriptionStatus: 'free',
            // PERBAIKAN 1: Menambahkan lastAnsweredAt: null
            stats: { totalAnswered: 0, totalCorrect: 0, streak: 0, systemProgress: {}, lastAnsweredAt: null }
        });
        setCurrentUser({
            uid: userCredential.user.uid,
            email: email,
            displayName: name,
            photoURL: null,
            subscriptionStatus: 'free',
            stats: { totalAnswered: 0, totalCorrect: 0, streak: 0, systemProgress: {}, lastAnsweredAt: null }
        });
    }
  };

  // PERBAIKAN 2: Menambahkan 'async' dan menghapus return value agar cocok dengan Promise<void>
  const login = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
  };

  const logout = () => signOut(auth);

  const updateUserProfile = async (name: string) => {
    if (auth.currentUser) {
        await updateProfile(auth.currentUser, { displayName: name });
        setCurrentUser((prev) => prev ? { ...prev, displayName: name } : null);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
         const docRef = doc(db, "users", firebaseUser.uid);
         const docSnap = await getDoc(docRef);
         
         let userData = {
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            displayName: firebaseUser.displayName,
            photoURL: firebaseUser.photoURL,
            subscriptionStatus: 'free' as 'free' | 'premium',
            stats: { totalAnswered: 0, totalCorrect: 0, streak: 0, lastAnsweredAt: null, systemProgress: {} }
         };

         if (docSnap.exists()) {
            const data = docSnap.data();
            userData.subscriptionStatus = data.subscriptionStatus === 'premium' ? 'premium' : 'free';
            userData.stats = data.stats || userData.stats;
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