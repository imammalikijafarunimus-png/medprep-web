import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { 
  onAuthStateChanged, 
  User, 
  UserCredential, 
  GoogleAuthProvider, 
  signInWithPopup,
  signOut,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile // Pastikan ini diimport
} from 'firebase/auth';
import { auth } from '../lib/firebase'; // Sesuaikan path ini jika pakai folder lib

interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
  loginWithGoogle: () => Promise<UserCredential>;
  logout: () => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<UserCredential>;
  login: (email: string, password: string) => Promise<UserCredential>;
  
  // --- TAMBAHAN PENTING ---
  // Kita expose fungsi ini agar bisa dipakai di halaman Profile
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
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const loginWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    return await signInWithPopup(auth, provider);
  };

  const register = async (email: string, password: string, name: string) => {
    // 1. Buat Akun
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    
    // 2. Langsung Update Nama Lengkap ke Profil Firebase
    if (userCredential.user) {
        await updateProfile(userCredential.user, {
            displayName: name
        });
        // Update state lokal agar UI langsung berubah tanpa refresh
        setCurrentUser({ ...userCredential.user, displayName: name });
    }

    return userCredential;
  };

  const login = async (email: string, password: string) => {
    return await signInWithEmailAndPassword(auth, email, password);
  };

  const logout = async () => {
    await signOut(auth);
  };

  // --- FUNGSI BARU: UPDATE PROFIL (STANDALONE) ---
  const updateUserProfile = async (name: string) => {
    // Cek apakah ada user yang sedang login di Firebase
    if (auth.currentUser) {
        // Update di Server Firebase
        await updateProfile(auth.currentUser, {
            displayName: name
        });

        // Update di State Lokal React (PENTING)
        // Kita harus force update object currentUser agar React me-render ulang nama baru di Dashboard
        setCurrentUser({ ...auth.currentUser, displayName: name });
    } else {
        throw new Error("Tidak ada user yang login");
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
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
    updateUserProfile // Jangan lupa masukkan ke sini
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}