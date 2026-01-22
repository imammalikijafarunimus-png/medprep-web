import React from 'react';
import { Lock, Star, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom'; // 1. Import Navigate

export default function PremiumLock() {
  const navigate = useNavigate(); // 2. Init Hook

  const handleUpgrade = (e: React.MouseEvent) => {
    e.stopPropagation(); // Mencegah event bubbling (agar kartu flashcard tdk terbalik lagi)
    // 3. Langsung arahkan ke halaman Harga/Subscription
    navigate('/app/subscription'); 
  };

  return (
    <div className="relative w-full py-12 overflow-hidden rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/50 flex flex-col items-center justify-center text-center p-6 group">
      
      {/* Background Blur */}
      <div className="absolute inset-0 backdrop-blur-sm z-0"></div>
      
      <div className="relative z-10 flex flex-col items-center animate-in fade-in zoom-in duration-500">
        <div className="w-20 h-20 bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl flex items-center justify-center text-white mb-6 shadow-xl shadow-orange-500/30 transform group-hover:scale-110 transition-transform duration-300">
          <Lock size={32} />
        </div>

        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
          Konten Premium
        </h3>
        
        <p className="text-slate-500 dark:text-slate-400 text-sm max-w-sm mb-8 leading-relaxed">
          Materi ini mengandung pembahasan mendalam (High Yield) yang khusus untuk member PRO.
        </p>

        <button 
          onClick={handleUpgrade}
          className="group relative inline-flex items-center gap-3 px-8 py-3.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all hover:-translate-y-1"
        >
          <Star className="text-yellow-400 dark:text-orange-500" fill="currentColor" size={18} />
          <span>Lihat Paket PRO</span>
          <ChevronRight size={16} className="opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
        </button>
      </div>
    </div>
  );
}