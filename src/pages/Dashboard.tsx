import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  GraduationCap, Stethoscope, Zap, TrendingUp, 
  ArrowRight, Brain 
} from 'lucide-react';
import { Link } from 'react-router-dom';

// Data Dummy Motivasi
const QUOTES = [
  "Barangsiapa menempuh jalan untuk menuntut ilmu, Allah akan mudahkan jalannya menuju Surga.",
  "Dokter yang hebat bukan yang paling pintar, tapi yang paling gigih belajar.",
  "Setiap satu diagnosis yang kamu pelajari hari ini, bisa menyelamatkan satu nyawa di masa depan."
];

export default function Dashboard() {
  const { currentUser } = useAuth();
  const [quote, setQuote] = useState('');
  
  // STATE PROGRESS
  const [stats, setStats] = useState({
    cbtCount: 0,
    osceCount: 0,
    flashcardMastered: 0
  });

  useEffect(() => {
    // 1. Random Quote
    setQuote(QUOTES[Math.floor(Math.random() * QUOTES.length)]);

    // 2. Load Stats dari LocalStorage
    const cbt = parseInt(localStorage.getItem('medprep_cbt_counter') || '0');
    const osce = JSON.parse(localStorage.getItem('medprep_osce_completed') || '[]').length;
    const flashcardProgress = JSON.parse(localStorage.getItem('medprep_flashcard_progress') || '{}');
    const flashcard = Object.values(flashcardProgress).filter((item: any) => item.status === 'review').length;

    setStats({ cbtCount: cbt, osceCount: osce, flashcardMastered: flashcard });
  }, []);

  // --- LOGIKA SAPAAN (Revisi Greeting) ---
  const getFirstName = () => {
    if (currentUser?.displayName) {
      // Pecah spasi, ambil kata pertama
      return currentUser.displayName.split(' ')[0];
    }
    // Fallback: Ambil dari email jika nama kosong
    return currentUser?.email?.split('@')[0] || 'Sejawat';
  };

  return (
    <div className="p-6 pb-24 animate-in fade-in space-y-8 max-w-6xl mx-auto">
      
      {/* 1. GREETING SECTION (DENGAN NAMA DEPAN) */}
      <div className="bg-gradient-to-r from-indigo-600 to-indigo-800 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-32 bg-white/10 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2"></div>
        <div className="relative z-10">
          <h1 className="text-3xl font-bold mb-2">
            {/* PANGGIL FUNGSI getFirstName() DI SINI */}
            Assalamu'alaikum, <span className="text-indigo-200">dr. {getFirstName()}</span> 👋
          </h1>
          <p className="text-indigo-100 max-w-xl text-lg leading-relaxed opacity-90">
            "{quote}"
          </p>
          
          <div className="mt-8 flex gap-4">
            <Link to="/app/cbt" className="bg-white text-indigo-700 px-6 py-3 rounded-xl font-bold hover:bg-indigo-50 transition-colors shadow-lg flex items-center gap-2">
              <GraduationCap size={20} /> Latihan Soal
            </Link>
            <Link to="/app/flashcards" className="bg-indigo-500/30 text-white border border-white/20 px-6 py-3 rounded-xl font-bold hover:bg-indigo-500/50 transition-colors flex items-center gap-2">
              <Zap size={20} /> Hafalan Cepat
            </Link>
          </div>
        </div>
      </div>

      {/* 2. PROGRESS TRACKER */}
      <div>
        <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
          <TrendingUp className="text-indigo-500" /> Progress Belajar Anda
        </h2>
        
        <div className="grid md:grid-cols-3 gap-6">
          {/* STAT 1: CBT */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:border-indigo-500 transition-all group">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-blue-50 dark:bg-blue-900/20 text-blue-600 rounded-xl group-hover:bg-blue-600 group-hover:text-white transition-colors">
                <Brain size={24} />
              </div>
              <span className="text-xs font-bold uppercase text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">Total</span>
            </div>
            <h3 className="text-4xl font-black text-slate-900 dark:text-white mb-1">{stats.cbtCount}</h3>
            <p className="text-slate-500 text-sm font-medium">Soal Telah Dikerjakan</p>
            <div className="w-full bg-slate-100 h-1.5 rounded-full mt-4 overflow-hidden">
              <div className="bg-blue-500 h-full rounded-full" style={{ width: `${Math.min(stats.cbtCount, 100)}%` }}></div>
            </div>
          </div>

          {/* STAT 2: FLASHCARD */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:border-yellow-500 transition-all group">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 text-yellow-600 rounded-xl group-hover:bg-yellow-500 group-hover:text-white transition-colors">
                <Zap size={24} />
              </div>
              <span className="text-xs font-bold uppercase text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">Mastery</span>
            </div>
            <h3 className="text-4xl font-black text-slate-900 dark:text-white mb-1">{stats.flashcardMastered}</h3>
            <p className="text-slate-500 text-sm font-medium">Kartu Hafal Mati (Review)</p>
             <div className="w-full bg-slate-100 h-1.5 rounded-full mt-4 overflow-hidden">
              <div className="bg-yellow-500 h-full rounded-full" style={{ width: `${Math.min(stats.flashcardMastered * 2, 100)}%` }}></div>
            </div>
          </div>

          {/* STAT 3: OSCE */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:border-emerald-500 transition-all group">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 rounded-xl group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                <Stethoscope size={24} />
              </div>
              <span className="text-xs font-bold uppercase text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">Read</span>
            </div>
            <h3 className="text-4xl font-black text-slate-900 dark:text-white mb-1">{stats.osceCount}</h3>
            <p className="text-slate-500 text-sm font-medium">Station OSCE Dipelajari</p>
             <div className="w-full bg-slate-100 h-1.5 rounded-full mt-4 overflow-hidden">
              <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${Math.min(stats.osceCount * 5, 100)}%` }}></div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. MENU AKSES CEPAT */}
      <div className="grid md:grid-cols-2 gap-6">
         <Link to="/app/cbt" className="group relative bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-xl hover:shadow-indigo-500/10 transition-all overflow-hidden">
           <div className="absolute right-0 top-0 p-24 bg-indigo-50 dark:bg-indigo-900/10 rounded-full blur-2xl translate-x-1/2 -translate-y-1/2 group-hover:bg-indigo-100 transition-colors"></div>
           <div className="relative z-10">
              <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <GraduationCap size={24} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">CBT Center</h3>
              <p className="text-slate-500 text-sm mb-6">Latihan soal UKMPPD dengan mode sistem, pembahasan lengkap, dan insight klinis.</p>
              <span className="text-indigo-600 font-bold flex items-center gap-2 text-sm group-hover:gap-3 transition-all">Mulai Latihan <ArrowRight size={16}/></span>
           </div>
         </Link>

         <Link to="/app/osce" className="group relative bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-xl hover:shadow-emerald-500/10 transition-all overflow-hidden">
           <div className="absolute right-0 top-0 p-24 bg-emerald-50 dark:bg-emerald-900/10 rounded-full blur-2xl translate-x-1/2 -translate-y-1/2 group-hover:bg-emerald-100 transition-colors"></div>
           <div className="relative z-10">
              <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Stethoscope size={24} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">OSCE Center</h3>
              <p className="text-slate-500 text-sm mb-6">Panduan stase OSCE lengkap dari anamnesis hingga tatalaksana dengan checklist.</p>
              <span className="text-emerald-600 font-bold flex items-center gap-2 text-sm group-hover:gap-3 transition-all">Pelajari Stase <ArrowRight size={16}/></span>
           </div>
         </Link>
      </div>

    </div>
  );
}