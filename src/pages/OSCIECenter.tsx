import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Moon, BookOpen, Heart, Shield, Lock, 
  Sparkles, ArrowRight, Construction, Scroll 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function OSCIECenter() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  // Cek Status (Hanya Expert/Premium yang bisa akses)
  const isLocked = currentUser?.subscriptionStatus !== 'expert' && currentUser?.subscriptionStatus !== 'premium';

  const handleModuleClick = (moduleName: string) => {
    toast.custom((t) => (
      <div className={`${t.visible ? 'animate-enter' : 'animate-leave'} max-w-md w-full bg-white dark:bg-slate-800 shadow-lg rounded-xl pointer-events-auto flex ring-1 ring-black ring-opacity-5`}>
        <div className="flex-1 w-0 p-4">
          <div className="flex items-start">
            <div className="flex-shrink-0 pt-0.5">
              <Construction className="h-10 w-10 text-amber-500" />
            </div>
            <div className="ml-3 flex-1">
              <p className="text-sm font-bold text-gray-900 dark:text-white">Modul Dalam Pengembangan</p>
              <p className="mt-1 text-xs text-gray-500">Materi "{moduleName}" sedang disusun oleh tim ahli sesuai HPT Tarjih.</p>
            </div>
          </div>
        </div>
      </div>
    ));
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-24 max-w-7xl mx-auto px-4 md:px-6">
      
      {/* HEADER HERO */}
      <div className="relative bg-emerald-900 dark:bg-black rounded-[2rem] p-8 overflow-hidden shadow-xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500/20 rounded-full blur-[80px]"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-emerald-500/20 rounded-full blur-[60px]"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
                <div className="flex items-center gap-2 mb-2">
                    <div className="p-2 bg-emerald-500/20 rounded-xl text-emerald-400 border border-emerald-500/30">
                        <Moon size={20} fill="currentColor" />
                    </div>
                    <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">Islamic Medicine</span>
                </div>
                <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight mb-2">
                    OSCIE Center
                </h1>
                <p className="text-emerald-100/80 text-xs md:text-sm max-w-xl leading-relaxed">
                   Integrasi Kedokteran & Keislaman. Panduan Ceklis OSCIE, Doa Medis, dan Fiqih Kedokteran sesuai Himpunan Putusan Tarjih (HPT).
                </p>
            </div>
        </div>
      </div>

      {/* CONTENT AREA */}
      {isLocked ? (
          // --- TAMPILAN TERKUNCI (UNTUK FREE/BASIC) ---
          <div className="flex flex-col items-center justify-center py-16 px-4 bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-white/5 text-center shadow-lg relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-amber-400 to-orange-500"></div>
              <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-6 text-slate-400 relative">
                  <Lock size={32} />
                  <div className="absolute -top-1 -right-1 bg-amber-500 text-white p-1.5 rounded-full shadow-lg">
                      <Sparkles size={12} fill="currentColor" />
                  </div>
              </div>
              <h2 className="text-xl font-black text-slate-900 dark:text-white mb-2">Fitur Eksklusif Expert</h2>
              <p className="text-slate-500 text-sm max-w-sm mb-8 leading-relaxed">
                  Akses modul OSCIE (Ceklis Islami, Fiqih Medis) khusus untuk mahasiswa PTM atau paket Expert.
              </p>
              <button 
                onClick={() => navigate('/app/subscription')}
                className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-8 py-3 rounded-2xl font-bold text-sm shadow-xl hover:scale-105 transition-transform flex items-center gap-2"
              >
                  Upgrade ke Expert <ArrowRight size={16} />
              </button>
          </div>
      ) : (
          // --- TAMPILAN TERBUKA (COMING SOON MODULES) ---
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              
              {/* MODUL 1: CEKLIS OSCIE */}
              <div onClick={() => handleModuleClick('Ceklis OSCIE')} className="group cursor-pointer bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 p-6 rounded-[2rem] hover:border-emerald-500/50 transition-all hover:shadow-lg relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-16 bg-emerald-500/5 rounded-full blur-2xl group-hover:bg-emerald-500/10 transition-all"></div>
                  <div className="relative z-10">
                      <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/20 text-emerald-600 rounded-2xl flex items-center justify-center mb-4">
                          <Scroll size={24} />
                      </div>
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">Ceklis OSCIE</h3>
                      <p className="text-xs text-slate-500 mb-4 leading-snug">
                          Panduan komunikasi Islam, Basmalah & Hamdalah di setiap prosedur, dan edukasi syariah.
                      </p>
                      <span className="inline-flex items-center gap-2 text-[10px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-900/30 px-3 py-1 rounded-full">
                          Coming Soon
                      </span>
                  </div>
              </div>

              {/* MODUL 2: DOA & DZIKIR */}
              <div onClick={() => handleModuleClick('Doa & Dzikir')} className="group cursor-pointer bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 p-6 rounded-[2rem] hover:border-teal-500/50 transition-all hover:shadow-lg relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-16 bg-teal-500/5 rounded-full blur-2xl group-hover:bg-teal-500/10 transition-all"></div>
                  <div className="relative z-10">
                      <div className="w-12 h-12 bg-teal-100 dark:bg-teal-900/20 text-teal-600 rounded-2xl flex items-center justify-center mb-4">
                          <Heart size={24} />
                      </div>
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">Doa & Dzikir Medis</h3>
                      <p className="text-xs text-slate-500 mb-4 leading-snug">
                          Kumpulan doa menengok orang sakit, doa minum obat, dan talqin sakaratul maut.
                      </p>
                      <span className="inline-flex items-center gap-2 text-[10px] font-bold text-teal-600 bg-teal-50 dark:bg-teal-900/30 px-3 py-1 rounded-full">
                          Coming Soon
                      </span>
                  </div>
              </div>

              {/* MODUL 3: FIQIH KESEHATAN */}
              <div onClick={() => handleModuleClick('Fiqih Kesehatan')} className="group cursor-pointer bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 p-6 rounded-[2rem] hover:border-indigo-500/50 transition-all hover:shadow-lg relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-16 bg-indigo-500/5 rounded-full blur-2xl group-hover:bg-indigo-500/10 transition-all"></div>
                  <div className="relative z-10">
                      <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/20 text-indigo-600 rounded-2xl flex items-center justify-center mb-4">
                          <BookOpen size={24} />
                      </div>
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">Fiqih Kesehatan (HPT)</h3>
                      <p className="text-xs text-slate-500 mb-4 leading-snug">
                          Hukum bersuci (tayamum) pasien, shalat orang sakit, dan etika aurat medis.
                      </p>
                      <span className="inline-flex items-center gap-2 text-[10px] font-bold text-indigo-600 bg-indigo-50 dark:bg-indigo-900/30 px-3 py-1 rounded-full">
                          Coming Soon
                      </span>
                  </div>
              </div>

          </div>
      )}

      {/* FOOTER NOTE */}
      <div className="text-center pt-8 opacity-60">
          <p className="text-[10px] text-slate-500 uppercase tracking-widest">
              Dikembangkan bersama LPPI & Majelis Tarjih
          </p>
      </div>

    </div>
  );
}