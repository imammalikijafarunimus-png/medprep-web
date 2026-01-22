import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { 
  onAuthStateChanged, 
  User as FirebaseUser, // 1. Kita ganti nama import Firebase jadi 'FirebaseUser' biar gak bentrok
  UserCredential, 
  GoogleAuthProvider, 
  signInWithPopup,
  signOut,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile 
} from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../lib/firebase'; 

// 2. Gunakan nama 'AppUser' untuk interface aplikasi kita
export interface AppUser {
  uid: string;
  email: string | null;
  displayName: string | null; // Izinkan null agar sesuai dengan Firebase
  photoURL: string | null;    // Izinkan null
  subscriptionStatus?: 'free' | 'premium';
}

interface AuthContextType {
  currentUser: AppUser | null;
  loading: boolean;
  loginWithGoogle: () => Promise<UserCredential>;
  logout: () => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<UserCredential>;
  login: (email: string, password: string) => Promise<UserCredential>;
  updateUserProfile: (name: string) => Promise<void>; 
}

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

  const loginWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    return await signInWithPopup(auth, provider);
  };

  const register = async (email: string, password: string, name: string) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    
    if (userCredential.user) {
        await updateProfile(userCredential.user, {
            displayName: name
        });
        
        // Update state manual agar sesuai tipe AppUser
        setCurrentUser({
            uid: userCredential.user.uid,
            email: userCredential.user.email,
            displayName: name,
            photoURL: userCredential.user.photoURL,
            subscriptionStatus: 'free'
        });
    }
    return userCredential;
  };

  const login = async (email: string, password: string) => {
    return await signInWithEmailAndPassword(auth, email, password);
  };

  const logout = async () => {
    await signOut(auth);
  };

  const updateUserProfile = async (name: string) => {
    if (auth.currentUser) {
        await updateProfile(auth.currentUser, {
            displayName: name
        });
        // Update state lokal
        setCurrentUser((prev) => prev ? { ...prev, displayName: name } : null);
    } else {
        throw new Error("Tidak ada user yang login");
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
         // Cek status subscription di Firestore
         let subStatus: 'free' | 'premium' = 'free';
         try {
            const docRef = doc(db, "users", firebaseUser.uid);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
               const data = docSnap.data();
               if (data.subscriptionStatus === 'premium') {
                   subStatus = 'premium';
               }
            }
         } catch (err) {
             console.error("Gagal ambil status user", err);
         }

         // Mapping dari FirebaseUser ke AppUser
         const userForState: AppUser = {
             uid: firebaseUser.uid,
             email: firebaseUser.email,
             displayName: firebaseUser.displayName,
             photoURL: firebaseUser.photoURL,
             subscriptionStatus: subStatus
         };
         
         setCurrentUser(userForState);
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
    updateUserProfile 
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}