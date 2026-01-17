import React, { useEffect, useState } from 'react';
import { Bell, Search, Menu } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { UserProfile } from '../../types/user'; // Import tipe data

export default function Header() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      if (user?.uid) {
        const docSnap = await getDoc(doc(db, "users", user.uid));
        if (docSnap.exists()) {
          setProfile(docSnap.data() as UserProfile);
        }
      }
    };
    fetchProfile();
  }, [user]);

  return (
    <header className="h-20 fixed top-0 right-0 left-0 lg:left-72 z-40 px-6 flex items-center justify-between backdrop-blur-md bg-slate-950/80 border-b border-slate-800/50">
      
      {/* Mobile Menu Trigger (Placeholder) */}
      <div className="lg:hidden text-white">
        <Menu />
      </div>

      {/* Greetings (Desktop) */}
      <div className="hidden lg:block">
        <h2 className="text-white font-bold text-lg">
          Assalamu'alaikum, <span className="text-blue-400">Dr. {profile?.name || 'Sejawat'}</span> 👋
        </h2>
        <p className="text-xs text-slate-500 truncate max-w-md">
          {profile?.university || 'Mahasiswa Kedokteran Indonesia'}
        </p>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-4">
        {/* Search Bar (Visual Only) */}
        <div className="hidden md:flex items-center bg-slate-900 border border-slate-800 rounded-full px-4 py-2 w-64">
          <Search size={16} className="text-slate-500 mr-2" />
          <input type="text" placeholder="Cari materi..." className="bg-transparent border-none focus:outline-none text-sm text-slate-200 w-full placeholder:text-slate-600" />
        </div>

        {/* Notif */}
        <button className="w-10 h-10 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:border-slate-600 transition-all relative">
          <Bell size={18} />
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
        </button>

        {/* Avatar */}
        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 p-[2px]">
           <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center text-xs font-bold text-white">
              {profile?.name?.charAt(0) || 'U'}
           </div>
        </div>
      </div>
    </header>
  );
}