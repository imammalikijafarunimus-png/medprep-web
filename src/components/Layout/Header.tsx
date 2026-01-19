import React, { useEffect, useState } from 'react';
import { Bell, Search, Menu, LogOut, Sun, Moon } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext'; // Import Hook Theme
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase'; // Pastikan path import ini benar (sesuai file firebase.ts Anda)

// Definisi tipe data state lokal (bisa dipisah ke file types jika mau)
interface UserProfileData {
  university?: string;
}

export default function Header() {
  // 1. FIX: Ganti 'user' menjadi 'currentUser'
  const { currentUser, logout } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme(); // <--- Pakai Hook Theme 
  
  const [profileData, setProfileData] = useState<UserProfileData | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      // 2. FIX: Gunakan currentUser
      if (currentUser?.uid) {
        try {
          const docRef = doc(db, "users", currentUser.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            setProfileData(docSnap.data() as UserProfileData);
          }
        } catch (error) {
          console.error("Error fetching header data:", error);
        }
      }
    };
    fetchProfile();
  }, [currentUser]); // Dependency array juga ke currentUser

  // 3. LOGIKA NAMA PINTAR (Sama seperti Dashboard)
  // Ambil nama dari Auth dulu (paling akurat), kalau kosong baru cari dari email
  const rawName = currentUser?.displayName || currentUser?.email?.split('@')[0] || 'Sejawat';
  const cleanName = rawName.replace(/[0-9]/g, ''); 
  const firstName = cleanName.split(' ')[0];
  const displayName = firstName.charAt(0).toUpperCase() + firstName.slice(1);

  return (
    <header className="h-20 fixed top-0 right-0 left-0 lg:left-72 z-40 px-6 flex items-center justify-between backdrop-blur-md bg-white/80 dark:bg-slate-950/80 border-b border-slate-200 dark:border-slate-800 transition-colors">
      
      {/* Mobile Menu Trigger */}
      <div className="lg:hidden text-slate-500 dark:text-white">
        <Menu />
      </div>

      {/* Greetings (Desktop) */}
      <div className="hidden lg:block">
        <h2 className="text-slate-800 dark:text-white font-bold text-lg">
          Assalamu'alaikum, <span className="text-teal-600 dark:text-teal-400">dr. {displayName}</span> 👋
        </h2>
        <p className="text-xs text-slate-500 truncate max-w-md font-medium">
          {profileData?.university || 'Mahasiswa Kedokteran Indonesia'}
        </p>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-3 md:gap-4">
        {/* Search Bar */}
        <div className="hidden md:flex items-center bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-full px-4 py-2 w-64 focus-within:ring-2 ring-teal-500/20 transition-all">
          <Search size={16} className="text-slate-400 mr-2" />
          <input 
            type="text" 
            placeholder="Cari materi..." 
            className="bg-transparent border-none focus:outline-none text-sm text-slate-700 dark:text-slate-200 w-full placeholder:text-slate-400" 
          />
        </div>

        {/* TOMBOL DARK MODE (BARU) */}
        <button 
          onClick={toggleTheme}
          className="w-10 h-10 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-center text-slate-500 hover:text-teal-600 dark:text-slate-400 dark:hover:text-yellow-400 transition-all"
        >
          {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>

        {/* Notif */}
        <button className="w-10 h-10 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-center text-slate-400 hover:text-teal-600 dark:hover:text-white hover:border-teal-500 transition-all relative shadow-sm">
          <Bell size={18} />
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
        </button>

        {/* Avatar */}
        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-teal-400 to-blue-500 p-[2px] shadow-md cursor-pointer group relative">
           <img 
              src={currentUser?.photoURL || `https://ui-avatars.com/api/?name=${displayName}&background=0D9488&color=fff`} 
              alt="User"
              className="w-full h-full rounded-full object-cover border-2 border-white dark:border-slate-900"
           />
           
           {/* Tooltip Logout Sederhana */}
           <div className="absolute right-0 top-12 w-32 bg-white dark:bg-slate-900 shadow-xl rounded-xl border border-slate-100 dark:border-slate-800 p-2 hidden group-hover:block animate-in fade-in slide-in-from-top-2">
              <button onClick={() => logout()} className="flex items-center gap-2 text-xs text-red-500 w-full p-2 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-lg transition-colors font-bold">
                <LogOut size={14} /> Keluar
              </button>
           </div>
        </div>
      </div>
    </header>
  );
}