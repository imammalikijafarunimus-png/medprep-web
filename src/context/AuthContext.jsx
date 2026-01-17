import { createContext, useContext, useEffect, useState } from 'react';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth';
import { auth } from '../lib/firebase';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  // Ubah default loading jadi FALSE dulu biar UI muncul (untuk debugging)
  // Nanti kembalikan ke TRUE kalau firebase sudah connect lancar
  const [loading, setLoading] = useState(true);

  const login = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  const register = (email, password) => {
    return createUserWithEmailAndPassword(auth, email, password);
  };

  const logout = () => {
    return signOut(auth);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      console.log('Status User Berubah:', currentUser); // Cek Console browser (F12)
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // --- PERBAIKAN: Tampilkan Loading Spinner daripada Blank ---
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center text-white space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        <p>Menghubungkan ke Firebase...</p>
        <p className="text-xs text-slate-500 max-w-md text-center">
          Jika macet di sini, cek file <code>src/lib/firebase.js</code>. <br />
          Pastikan API Key sudah benar.
        </p>
      </div>
    );
  }
  // -----------------------------------------------------------

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
