import React, { useState } from 'react';
import { 
  Check, X, Star, Shield, Crown, Heart, 
  Zap, ArrowRight, School, Building2,
  Clock, BookOpenCheck, Award
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getRecommendedPackage } from '../data/universities';

export default function Subscription() {
  const { currentUser } = useAuth();
  
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'midyear' | 'lifetime'>('midyear');

  const currentPlan = currentUser?.subscriptionStatus || 'free';
  const recommended = getRecommendedPackage(currentUser?.university);

  const isRecommendedBasic = recommended.name.toLowerCase().includes('basic');
  const isRecommendedExpert = recommended.name.toLowerCase().includes('expert');

  // LOGIC HARGA
  const getPrice = (plan: 'basic' | 'expert') => {
    if (plan === 'basic') {
      if (billingCycle === 'monthly') return '15.000';
      if (billingCycle === 'midyear') return '45.000';
      return '99.000';
    } else {
      if (billingCycle === 'monthly') return '25.000';
      if (billingCycle === 'midyear') return '75.000';
      return '149.000';
    }
  };

  const getDurationLabel = () => {
    if (billingCycle === 'monthly') return '/ bulan';
    if (billingCycle === 'midyear') return '/ 6 bulan';
    return '/ selamanya';
  };

  const handleSubscribe = (plan: string, price: string) => {
    const adminPhone = "6285786456321";
    const text = `Halo Admin MedPrep, saya *${currentUser?.displayName}* (${currentUser?.email}).\nIngin berlangganan paket *${plan}* seharga *Rp ${price}* (${billingCycle}).\n\nMohon info pembayaran. Terima kasih!`;
    window.open(`https://wa.me/${adminPhone}?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="space-y-16 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-24 max-w-7xl mx-auto px-4 md:px-6">
      
      {/* STATUS SUDAH BERLANGGANAN */}
      {currentPlan !== 'free' && (
        <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-2xl p-5 text-center">
          <p className="font-bold text-emerald-700 dark:text-emerald-400 flex items-center justify-center gap-2">
            ✅ Kamu sudah berlangganan <span className="uppercase font-black">{currentPlan}</span>
          </p>
        </div>
      )}

      {/* HEADER HERO */}
      <div className="relative bg-slate-900 dark:bg-black rounded-[2.5rem] p-10 md:p-14 overflow-hidden shadow-2xl text-center border border-slate-800">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/20 rounded-full blur-[80px]"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-teal-500/20 rounded-full blur-[80px]"></div>
        
        <div className="relative z-10 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-pink-500/10 border border-pink-500/20 text-pink-400 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-6">
            <Heart size={12} fill="currentColor" /> Amal Jariyah
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-6 leading-tight">
            Investasi Cerdas <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-300 to-indigo-400">Masa Depan Sejawat</span>
          </h1>
          <p className="text-slate-400 text-base md:text-lg leading-relaxed mb-8">
            <span className="text-white font-bold">30% biaya langganan</span> didonasikan untuk kegiatan sosial.
          </p>

          {/* PRICING TOGGLE */}
          <div className="inline-flex bg-slate-800/50 backdrop-blur border border-slate-700 p-1 rounded-full">
            {(['monthly', 'midyear', 'lifetime'] as const).map((cycle) => (
              <button 
                key={cycle}
                onClick={() => setBillingCycle(cycle)}
                className={`px-6 py-2 rounded-full text-xs font-bold transition-all duration-300 ${billingCycle === cycle 
                  ? 'bg-white text-slate-900 shadow-lg' 
                  : 'text-slate-400 hover:text-white'
                }`}
              >
                {cycle === 'monthly' ? 'Bulanan' : cycle === 'midyear' ? '6 Bulan' : 'Selamanya'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* PRICING GRID */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start pt-4">
        
        {/* FREE TIER */}
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
                <span className="text-sm font-medium text-slate-400 block mt-1">Selamanya</span>
            </div>

            <button disabled className="w-full py-4 rounded-2xl font-bold bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed mb-8 text-sm">
                Paket Saat Ini
            </button>

            <div className="space-y-4">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Fitur Tersedia</p>
                <ul className="space-y-3 text-sm text-slate-600 dark:text-slate-400">
                    <li className="flex gap-3"><Check size={18} className="text-teal-500 shrink-0"/> 50 Soal Latihan</li>
                    <li className="flex gap-3"><Check size={18} className="text-teal-500 shrink-0"/> Ceklis OSCE Dasar</li>
                </ul>
                
                <div className="h-px bg-slate-100 dark:bg-slate-800 my-4"></div>
                
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Terkunci</p>
                <ul className="space-y-3 text-sm text-slate-400 opacity-60">
                    <li className="flex gap-3"><X size={18} /> Analisis & Rekap Soal</li>
                    <li className="flex gap-3"><X size={18} /> Bank Kasus OSCE Lengkap</li>
                    <li className="flex gap-3"><X size={18} /> Insight Klinis</li>
                    <li className="flex gap-3"><X size={18} /> Fiqih Medis & Doa</li>
                </ul>
            </div>
        </div>

        {/* BASIC TIER */}
        <div className={`relative group z-10 hover:-translate-y-2 transition-transform duration-300 ${isRecommendedBasic ? 'ring-4 ring-blue-500/30' : ''}`}>
          {isRecommendedBasic && (
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-[10px] font-bold px-5 py-1 rounded-full shadow-lg">
              ⭐ Rekomendasi Kampusmu
            </div>
          )}
          <div className="bg-white dark:bg-slate-900 border-2 border-blue-500/20 p-8 rounded-[2.5rem] shadow-2xl h-full">
                <div className="mb-6 mt-2">
                    <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/20 text-blue-600 rounded-2xl flex items-center justify-center mb-4">
                        <Star size={24} fill="currentColor" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">Basic</h3>
                    <p className="text-slate-500 text-sm mt-1">Lulus UKMPPD dengan efisien.</p>
                </div>
                
                <div className="mb-8 flex items-baseline gap-1">
                    <span className="text-5xl font-black text-slate-900 dark:text-white">Rp {getPrice('basic')}</span>
                    <span className="text-sm font-medium text-slate-400 ml-1">{getDurationLabel()}</span>
                </div>

                <button 
              onClick={() => handleSubscribe('BASIC', getPrice('basic'))}
              disabled={currentPlan === 'basic'}
              className={`w-full py-4 rounded-2xl font-bold transition-all mb-8 flex items-center justify-center gap-2 ${
                currentPlan === 'basic' 
                  ? 'bg-emerald-100 text-emerald-700 cursor-not-allowed' 
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              {currentPlan === 'basic' ? '✅ Paket Saat Ini' : 'Pilih Basic'}
            </button>

                <div className="space-y-4">
                    <p className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest">Fitur Unggulan</p>
                    <ul className="space-y-3 text-sm text-slate-700 dark:text-slate-300 font-medium">
                        <li className="flex gap-3"><Check size={18} className="text-blue-500 shrink-0"/> <span>Unlock <b>Semua Soal</b></span></li>
                        <li className="flex gap-3"><Check size={18} className="text-blue-500 shrink-0"/> <span>Unlock <b>Stase & Ceklis OSCE</b></span></li>
                        <li className="flex gap-3"><Check size={18} className="text-blue-500 shrink-0"/> <span>Analisis & Rekap Soal</span></li>
                    </ul>

                    <div className="h-px bg-slate-100 dark:bg-slate-800 my-4"></div>

                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Masih Terkunci</p>
                    <ul className="space-y-3 text-sm text-slate-400">
                        <li className="flex gap-3 items-center"><X size={18} className="text-red-400"/> <span>Insight Klinis</span></li>
                        <li className="flex gap-3 items-center"><X size={18} className="text-red-400"/> <span>Data Statistik OSCE</span></li>
                        <li className="flex gap-3 items-center"><X size={18} className="text-red-400"/> <span>Fiqih Medis & Doa</span></li>
                    </ul>
                </div>
            </div>
        </div>

        {/* EXPERT TIER */}
        <div className={`relative group z-10 hover:-translate-y-2 transition-transform duration-300 ${isRecommendedExpert ? 'ring-4 ring-amber-500/30' : ''}`}>
          {isRecommendedExpert && (
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-amber-500 text-white text-[10px] font-bold px-5 py-1 rounded-full shadow-lg">
              ⭐ Rekomendasi Kampusmu
            </div>
          )}
          <div className="bg-slate-900 border border-amber-500/30 p-8 rounded-[2.5rem] shadow-2xl h-full overflow-hidden">
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
                        <span className="text-5xl font-black text-white">Rp {getPrice('expert')}</span>
                        <span className="text-sm font-medium text-slate-500 ml-1">{getDurationLabel()}</span>
                    </div>

                    <button 
              onClick={() => handleSubscribe('EXPERT', getPrice('expert'))}
              disabled={currentPlan === 'expert'}
              className={`w-full py-4 rounded-2xl font-bold transition-all mb-8 flex items-center justify-center gap-2 ${
                currentPlan === 'expert' 
                  ? 'bg-emerald-100 text-emerald-700 cursor-not-allowed' 
                  : 'bg-gradient-to-r from-amber-400 to-orange-500 text-white'
              }`}
            >
              {currentPlan === 'expert' ? '✅ Paket Saat Ini' : 'Upgrade ke Expert'}
            </button>

                    <div className="space-y-4">
                        <p className="text-xs font-bold text-amber-500 uppercase tracking-widest">Semua Fitur Basic, Ditambah:</p>
                        <ul className="space-y-3 text-sm text-slate-200 font-medium">
                            <li className="flex gap-3"><div className="bg-amber-500/20 p-1 rounded-full"><Check size={12} className="text-amber-400"/></div> <span>Unlock <b>Insight Klinis</b></span></li>
                            <li className="flex gap-3"><div className="bg-amber-500/20 p-1 rounded-full"><Check size={12} className="text-amber-400"/></div> <span>Unlock <b>Statistik OSCE</b></span></li>
                            <li className="flex gap-3"><div className="bg-amber-500/20 p-1 rounded-full"><Check size={12} className="text-amber-400"/></div> <span>Perpustakaan Digital</span></li>
                            <li className="flex gap-3"><div className="bg-amber-500/20 p-1 rounded-full"><Check size={12} className="text-amber-400"/></div> <span>Fiqih Medis & Doa</span></li>
                            <li className="flex gap-3"><div className="bg-amber-500/20 p-1 rounded-full"><Check size={12} className="text-amber-400"/></div> <span>Prioritas Support</span></li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>

      </div>

      {/* TABEL PERBANDINGAN (BARU) */}
      <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 md:p-12 border border-slate-200 dark:border-white/5 shadow-xl overflow-hidden">
          <h3 className="text-2xl font-black text-center mb-10 text-slate-900 dark:text-white">Bandingkan Fitur</h3>
          
          <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[600px]">
                  <thead>
                      <tr className="border-b border-slate-100 dark:border-slate-800">
                          <th className="py-4 px-4 font-bold text-slate-500 text-sm uppercase tracking-wider">Fitur</th>
                          <th className="py-4 px-4 font-bold text-slate-500 text-sm uppercase tracking-wider text-center">Starter</th>
                          <th className="py-4 px-4 font-bold text-blue-600 dark:text-blue-400 text-sm uppercase tracking-wider text-center bg-blue-50/50 dark:bg-blue-900/10">Basic</th>
                          <th className="py-4 px-4 font-bold text-amber-500 text-sm uppercase tracking-wider text-center bg-amber-50/50 dark:bg-amber-900/10">Expert</th>
                      </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                      {[
                          { name: "Bank Soal Latihan", free: "50 Soal", basic: "Unlimited", expert: "Unlimited" },
                          { name: "Ceklis OSCE", free: "Dasar", basic: "Lengkap", expert: "Lengkap + Update" },
                          { name: "Analisis & Rekap Nilai", free: <X size={16} className="mx-auto text-slate-400" />, basic: <Check size={16} className="mx-auto text-blue-500" />, expert: <Check size={16} className="mx-auto text-amber-500" /> },
                          { name: "Insight Klinis & Tips", free: <X size={16} className="mx-auto text-slate-400" />, basic: <X size={16} className="mx-auto text-slate-400" />, expert: <Check size={16} className="mx-auto text-amber-500" /> },
                          { name: "Statistik OSCE", free: <X size={16} className="mx-auto text-slate-400" />, basic: <X size={16} className="mx-auto text-slate-400" />, expert: <Check size={16} className="mx-auto text-amber-500" /> },
                          { name: "Fiqih Medis & Doa", free: <X size={16} className="mx-auto text-slate-400" />, basic: <X size={16} className="mx-auto text-slate-400" />, expert: <Check size={16} className="mx-auto text-amber-500" /> },
                          { name: "Support Admin", free: "Normal", basic: "Normal", expert: "Prioritas" },
                      ].map((item, idx) => (
                          <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                              <td className="py-4 px-4 text-sm font-medium text-slate-700 dark:text-slate-300">{item.name}</td>
                              <td className="py-4 px-4 text-sm text-center text-slate-500">{typeof item.free === 'string' ? item.free : item.free}</td>
                              <td className="py-4 px-4 text-sm text-center text-blue-600 dark:text-blue-400 font-medium bg-blue-50/30 dark:bg-blue-900/5">{typeof item.basic === 'string' ? item.basic : item.basic}</td>
                              <td className="py-4 px-4 text-sm text-center text-amber-500 font-bold bg-amber-50/30 dark:bg-amber-900/5">{typeof item.expert === 'string' ? item.expert : item.expert}</td>
                          </tr>
                      ))}
                  </tbody>
              </table>
          </div>
      </div>

      {/* ADDITIONAL FEATURES (Aktivasi, Materi, Garansi) */}
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