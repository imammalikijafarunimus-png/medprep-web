import React from 'react';
import { 
  Check, X, Star, Shield, Crown, Heart, 
  Zap, ArrowRight, School, Building2,
  Clock, BookOpenCheck, Award // Icon baru
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Subscription() {
  const { currentUser } = useAuth();
  
  const handleSubscribe = (plan: string, price: string) => {
    const adminPhone = "628123456789"; 
    const text = `Halo Admin MedPrep, saya dokter *${currentUser?.displayName}* (${currentUser?.email}).\nIngin berlangganan paket *${plan}* seharga *${price}*.\n\nMohon info pembayaran. Terima kasih!`;
    window.open(`https://wa.me/${adminPhone}?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-24 max-w-7xl mx-auto px-4 md:px-6">
      
      {/* HEADER HERO */}
      <div className="relative bg-slate-900 dark:bg-black rounded-[2.5rem] p-10 md:p-14 overflow-hidden shadow-2xl shadow-slate-200/50 dark:shadow-none text-center border border-slate-800">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/20 rounded-full blur-[80px]"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-teal-500/20 rounded-full blur-[80px]"></div>
        
        <div className="relative z-10 max-w-3xl mx-auto">
           <div className="inline-flex items-center gap-2 bg-pink-500/10 border border-pink-500/20 text-pink-400 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-6 backdrop-blur-md">
                <Heart size={12} fill="currentColor" /> Amal Jariyah
           </div>
           <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-6 leading-tight">
             Investasi Cerdas <br/>
             <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-300 to-indigo-400">Masa Depan Sejawat</span>
           </h1>
           <p className="text-slate-400 text-base md:text-lg leading-relaxed">
             <span className="text-white font-bold">30% biaya langganan</span> didonasikan untuk kegiatan sosial. Pilih paket sesuai target kelulusanmu.
           </p>
        </div>
      </div>

      {/* PRICING GRID */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start pt-4">
        
        {/* 1. FREE TIER */}
        <div className="group relative bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 p-8 rounded-[2.5rem] hover:shadow-xl transition-all duration-300 opacity-80 hover:opacity-100 mt-2">
            <div className="mb-6">
                <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800 text-slate-500 rounded-2xl flex items-center justify-center mb-4">
                    <Shield size={24} />
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">Starter</h3>
                <p className="text-slate-500 text-sm mt-1">Akses terbatas untuk mencoba.</p>
            </div>
            
            <div className="mb-8">
                <span className="text-4xl font-black text-slate-900 dark:text-white">Rp 0</span>
            </div>

            <button disabled className="w-full py-4 rounded-2xl font-bold bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed mb-8 text-sm">
                Paket Saat Ini
            </button>

            <div className="space-y-4">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Fitur Tersedia</p>
                <ul className="space-y-3 text-sm text-slate-600 dark:text-slate-400">
                    <li className="flex gap-3"><Check size={18} className="text-teal-500 shrink-0"/> Akses Soal Terbatas</li>
                    <li className="flex gap-3"><Check size={18} className="text-teal-500 shrink-0"/> Ceklis OSCE Dasar</li>
                </ul>
                
                <div className="h-px bg-slate-100 dark:bg-slate-800 my-4"></div>
                
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Terkunci</p>
                <ul className="space-y-3 text-sm text-slate-400 opacity-60">
                    <li className="flex gap-3"><X size={18} /> Analisis & Rekap Soal</li>
                    <li className="flex gap-3"><X size={18} /> Bank Kasus OSCE Lengkap</li>
                    <li className="flex gap-3"><X size={18} /> Insight & Perpustakaan</li>
                </ul>
            </div>
        </div>

        {/* 2. BASIC TIER (45rb) */}
        {/* Wrapper Relative untuk Badge */}
        <div className="relative group z-10 hover:-translate-y-2 transition-transform duration-300">
            {/* BADGE (Di luar overflow card agar tidak terpotong) */}
            <div className="absolute inset-x-0 -top-4 flex justify-center z-20">
                <span className="bg-blue-600 text-white text-[10px] font-bold px-4 py-1.5 rounded-full uppercase tracking-wider shadow-lg flex items-center gap-2 ring-4 ring-slate-50 dark:ring-slate-950">
                    <School size={12} /> Rekomendasi Mhs PTN
                </span>
            </div>

            {/* CARD CONTENT */}
            <div className="bg-white dark:bg-slate-900 border-2 border-blue-500/20 dark:border-blue-500/30 p-8 rounded-[2.5rem] shadow-2xl shadow-blue-500/10 h-full">
                <div className="mb-6 mt-2">
                    <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/20 text-blue-600 rounded-2xl flex items-center justify-center mb-4">
                        <Star size={24} fill="currentColor" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">Basic</h3>
                    <p className="text-slate-500 text-sm mt-1">Lulus UKMPPD dengan efisien.</p>
                </div>
                
                <div className="mb-8 flex items-baseline gap-1">
                    <span className="text-5xl font-black text-slate-900 dark:text-white">45rb</span>
                    <span className="text-sm font-medium text-slate-400">/ 6 bulan</span>
                </div>

                <button 
                    onClick={() => handleSubscribe('BASIC (45rb)', 'Rp 45.000')}
                    className="w-full py-4 rounded-2xl font-bold bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-500/20 transition-all mb-8 flex items-center justify-center gap-2"
                >
                    Pilih Basic <ArrowRight size={16} />
                </button>

                <div className="space-y-4">
                    <p className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest">Fitur Unggulan</p>
                    <ul className="space-y-3 text-sm text-slate-700 dark:text-slate-300 font-medium">
                        <li className="flex gap-3"><Check size={18} className="text-blue-500 shrink-0"/> <span>Buka Gembok <b>Semua Soal</b></span></li>
                        <li className="flex gap-3"><Check size={18} className="text-blue-500 shrink-0"/> <span>Akses <b>Stase & Ceklis OSCE</b></span></li>
                        <li className="flex gap-3"><Check size={18} className="text-blue-500 shrink-0"/> <span>Analisis & Rekap Soal</span></li>
                    </ul>

                    <div className="h-px bg-slate-100 dark:bg-slate-800 my-4"></div>

                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Masih Terkunci</p>
                    <ul className="space-y-3 text-sm text-slate-400">
                        <li className="flex gap-3 items-center"><X size={18} className="text-red-400"/> <span>Insight Klinis & Tips</span></li>
                        <li className="flex gap-3 items-center"><X size={18} className="text-red-400"/> <span>Data Statistik OSCE (Rekap)</span></li>
                        <li className="flex gap-3 items-center"><X size={18} className="text-red-400"/> <span>Perpustakaan Digital</span></li>
                    </ul>
                </div>
            </div>
        </div>

        {/* 3. EXPERT TIER (75rb) - REKOMENDASI PTS/PTM */}
        {/* Wrapper Relative untuk Badge */}
        <div className="relative group z-10 hover:-translate-y-2 transition-transform duration-300">
            {/* BADGE (Di luar overflow card) */}
            <div className="absolute inset-x-0 -top-4 flex justify-center z-20">
                <span className="bg-gradient-to-r from-amber-400 to-orange-500 text-white text-[10px] font-bold px-4 py-1.5 rounded-full uppercase tracking-wider shadow-lg flex items-center gap-2 ring-4 ring-slate-50 dark:ring-slate-950">
                    <Building2 size={12} /> Rekomendasi Mhs PTS / PTM
                </span>
            </div>

            {/* CARD CONTENT (Dengan Overflow Hidden untuk Background Blob) */}
            <div className="relative bg-slate-900 dark:bg-black border border-amber-500/30 p-8 rounded-[2.5rem] shadow-2xl shadow-amber-500/20 h-full overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-[60px] translate-x-1/3 -translate-y-1/3 pointer-events-none"></div>
                
                <div className="relative z-10">
                    <div className="mb-6 mt-2">
                        <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-orange-500 text-white rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-amber-500/30">
                            <Crown size={24} fill="currentColor" />
                        </div>
                        <h3 className="text-xl font-bold text-white">Expert</h3>
                        <p className="text-slate-400 text-sm mt-1">Full Akses: Insight & Data Lengkap.</p>
                    </div>
                    
                    <div className="mb-8 flex items-baseline gap-1">
                        <span className="text-5xl font-black text-white">75rb</span>
                        <span className="text-sm font-medium text-slate-500">/ 6 bulan</span>
                    </div>

                    <button 
                        onClick={() => handleSubscribe('EXPERT (75rb)', 'Rp 75.000')}
                        className="w-full py-4 rounded-2xl font-bold bg-gradient-to-r from-amber-400 to-orange-500 text-white hover:shadow-xl hover:shadow-amber-500/20 transition-all mb-8 flex items-center justify-center gap-2"
                    >
                        Upgrade Full Akses <Zap size={16} fill="currentColor" />
                    </button>

                    <div className="space-y-4">
                        <p className="text-xs font-bold text-amber-500 uppercase tracking-widest">Semua Fitur Basic, Ditambah:</p>
                        <ul className="space-y-3 text-sm text-slate-200 font-medium">
                            <li className="flex gap-3"><div className="bg-amber-500/20 p-1 rounded-full"><Check size={12} className="text-amber-400"/></div> <span>Buka Kunci <b>Insight Klinis</b></span></li>
                            <li className="flex gap-3"><div className="bg-amber-500/20 p-1 rounded-full"><Check size={12} className="text-amber-400"/></div> <span>Akses <b>Rekap & Statistik OSCE</b></span></li>
                            <li className="flex gap-3"><div className="bg-amber-500/20 p-1 rounded-full"><Check size={12} className="text-amber-400"/></div> <span>Perpustakaan Digital</span></li>
                            <li className="flex gap-3"><div className="bg-amber-500/20 p-1 rounded-full"><Check size={12} className="text-amber-400"/></div> <span>Prioritas Support Admin</span></li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>

      </div>

      {/* ADDITIONAL FEATURES (Aktivasi, Materi, Garansi) */}
      {/* HAPUS class 'border-t border-slate-200 dark:border-slate-800' di sini */}
      <div className="grid md:grid-cols-3 gap-6 pt-10 mt-8">
          
          <div className="flex flex-col items-center text-center p-4">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400 rounded-2xl flex items-center justify-center mb-4 shadow-sm">
                  <Clock size={24} />
              </div>
              <h4 className="font-bold text-slate-900 dark:text-white mb-1">Aktivasi Cepat</h4>
              <p className="text-xs text-slate-500 max-w-[200px]">
                  Akun aktif &lt; 10 menit setelah bukti transfer dikirim.
              </p>
          </div>

          {/* HAPUS class 'border-l border-r ...' di div tengah ini */}
          <div className="flex flex-col items-center text-center p-4">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-2xl flex items-center justify-center mb-4 shadow-sm">
                  <BookOpenCheck size={24} />
              </div>
              <h4 className="font-bold text-slate-900 dark:text-white mb-1">Materi Terupdate</h4>
              <p className="text-xs text-slate-500 max-w-[200px]">
                  Sesuai SKDI terbaru dan guideline PPK terkini.
              </p>
          </div>

          <div className="flex flex-col items-center text-center p-4">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 rounded-2xl flex items-center justify-center mb-4 shadow-sm">
                  <Award size={24} />
              </div>
              <h4 className="font-bold text-slate-900 dark:text-white mb-1">Garansi Kualitas</h4>
              <p className="text-xs text-slate-500 max-w-[200px]">
                  Dibuat oleh dokter terbaik untuk calon sejawat.
              </p>
          </div>

      </div>

    </div>
  );
}