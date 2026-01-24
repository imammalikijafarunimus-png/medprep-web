import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { 
  onAuthStateChanged, 
  User as FirebaseUser, 
  UserCredential, 
  GoogleAuthProvider, 
  signInWithPopup,
  signOut,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile 
} from 'firebase/auth';
// TAMBAHAN: Import onSnapshot untuk real-time update
import { doc, getDoc, onSnapshot } from 'firebase/firestore'; 
import { auth, db } from '../lib/firebase';
import { getDeviceId } from '../utils/device'; // <-- Import helper tadi

export interface AppUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
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
        setCurrentUser((prev) => prev ? { ...prev, displayName: name } : null);
    } else {
        throw new Error("Tidak ada user yang login");
    }
  };

  useEffect(() => {
    let unsubscribeSnapshot: () => void;

    const unsubscribeAuth = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
         // 1. Setup User State Awal
         let subStatus: 'free' | 'premium' = 'free';
         
         // Ambil data awal (untuk subscription, dll)
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

         const userForState: AppUser = {
             uid: firebaseUser.uid,
             email: firebaseUser.email,
             displayName: firebaseUser.displayName,
             photoURL: firebaseUser.photoURL,
             subscriptionStatus: subStatus
         };
         setCurrentUser(userForState);

         // 2. LOGIKA KICK DEVICE (Real-time Listener)
         // Kita pantau dokumen user ini terus menerus
         const userDocRef = doc(db, "users", firebaseUser.uid);
         unsubscribeSnapshot = onSnapshot(userDocRef, (snapshot) => {
            if (snapshot.exists()) {
                const data = snapshot.data();
                const currentDeviceId = getDeviceId();
                const serverDeviceId = data.lastDeviceId;

                // Jika di database ada ID device, tapi beda dengan ID browser ini
                // Maka force logout
                if (serverDeviceId && serverDeviceId !== currentDeviceId) {
                    // Cek agar tidak looping logout terus menerus
                    alert("Akun Anda telah login di perangkat lain. Sesi ini akan diakhiri.");
                    signOut(auth).then(() => {
                        window.location.href = '/login'; // Redirect paksa
                    });
                }
            }
         });

      } else {
         setCurrentUser(null);
         // Bersihkan listener snapshot jika user logout
         if (unsubscribeSnapshot) unsubscribeSnapshot();
      }
      setLoading(false);
    });

    return () => {
        unsubscribeAuth();
        if (unsubscribeSnapshot) unsubscribeSnapshot();
    };
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