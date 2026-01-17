import { useEffect, useState } from 'react';
import { Moon, Sun, User as UserIcon } from 'lucide-react';
import { useIslamicMode } from '../../context/IslamicModeContext';
import { useAuth } from '../../context/AuthContext';
import { doc, getDoc } from 'firebase/firestore'; // Import fungsi baca DB
import { db } from '../../lib/firebase';

export default function Header() {
  const { isIslamicMode, toggleIslamicMode } = useIslamicMode();
  const { user } = useAuth(); // Ambil data user yang sedang login
  const [userName, setUserName] = useState('Dokter Muda'); // Default name

  // Efek: Ambil data nama dari Firestore saat komponen muncul
  useEffect(() => {
    const fetchUserData = async () => {
      if (user?.uid) {
        const docRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setUserName(docSnap.data().name); // Set nama dari database
        }
      }
    };
    fetchUserData();
  }, [user]);

  return (
    <header className="h-16 bg-dark/80 backdrop-blur-md border-b border-slate-700 fixed top-0 right-0 left-0 lg:left-64 z-40 px-4 flex items-center justify-between">
      <div className="font-heading font-bold text-lg lg:hidden">MedPrep</div>

      {/* TAMPILKAN NAMA ASLI DI SINI */}
      <div className="hidden lg:block text-slate-300">
        Assalamu'alaikum,{' '}
        <span className="font-bold text-white">Dr. {userName}</span>
      </div>

      <div className="flex items-center gap-4">
        <button
          onClick={toggleIslamicMode}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-full border transition-all ${
            isIslamicMode
              ? 'bg-islamic/10 border-islamic text-islamic'
              : 'bg-slate-800 border-slate-600 text-slate-400'
          }`}
        >
          {isIslamicMode ? <Moon size={16} /> : <Sun size={16} />}
          <span className="text-xs font-bold">
            {isIslamicMode ? 'Mode Islam ON' : 'Mode Islam OFF'}
          </span>
        </button>

        {/* Ikon Profil */}
        <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-slate-400 border border-slate-600">
          <UserIcon size={16} />
        </div>
      </div>
    </header>
  );
}
