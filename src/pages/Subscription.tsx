import React from 'react';
import { Check, Star, Zap, Shield, Crown, MessageCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Subscription() {
  const { currentUser } = useAuth();

  const handleSubscribe = (plan: string, price: string) => {
    const adminPhone = "6285786456321"; 
    
    const text = `Halo Admin MedPrep, saya dokter *${currentUser?.displayName || 'User'}* (${currentUser?.email}) ingin berlangganan paket *${plan}* seharga *${price}*.\n\nMohon info rekening pembayaran. Terima kasih!`;
    
    const url = `https://wa.me/${adminPhone}?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="p-6 pb-24 animate-in fade-in max-w-6xl mx-auto">
      
      {/* HEADER */}
      <div className="text-center mb-12 space-y-4 pt-8">
        <h1 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white">
          Investasi Masa Depan <span className="text-indigo-600">Sejawat</span> 🚀
        </h1>
        <p className="text-lg text-slate-500 max-w-2xl mx-auto leading-relaxed">
          Upgrade ke <span className="text-amber-500 font-bold">MedPrep PRO</span> untuk akses tanpa batas ke Bank Soal, Materi High Yield, dan Fitur Eksklusif lainnya.
        </p>
      </div>

      {/* PRICING CARDS */}
      <div className="grid md:grid-cols-3 gap-8 items-start relative z-10">
        
        {/* 1. PAKET FREE */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-sm relative opacity-70 hover:opacity-100 transition-opacity">
          <h3 className="text-xl font-bold text-slate-500 mb-2">Starter</h3>
          <div className="text-4xl font-black text-slate-900 dark:text-white mb-6">Rp 0</div>
          <button disabled className="w-full py-3 rounded-xl font-bold bg-slate-100 dark:bg-slate-800 text-slate-400 mb-8 cursor-not-allowed border border-slate-200 dark:border-slate-700">
            Paket Saat Ini
          </button>
          <ul className="space-y-4 text-sm text-slate-600 dark:text-slate-400">
            <li className="flex gap-3"><Check size={18} className="text-teal-500 shrink-0" /> Akses Soal-soal Dasar</li>
            <li className="flex gap-3"><Check size={18} className="text-teal-500 shrink-0" /> Flashcard (Mode Terbatas)</li>
            <li className="flex gap-3"><Check size={18} className="text-teal-500 shrink-0" /> OSCE Center (Full Akses)</li>
            <li className="flex gap-3 opacity-40"><Shield size={18} /> <span className="line-through">Pembahasan Mendalam</span></li>
            <li className="flex gap-3 opacity-40"><Shield size={18} /> <span className="line-through">Materi High Yield</span></li>
          </ul>
        </div>

        {/* 2. PAKET PRO BULANAN (BEST VALUE) */}
        <div className="bg-slate-900 dark:bg-slate-800 text-white rounded-3xl p-8 border-4 border-amber-500 shadow-2xl relative transform md:-translate-y-4">
          <div className="absolute top-0 right-0 bg-amber-500 text-slate-900 text-xs font-bold px-4 py-1.5 rounded-bl-xl rounded-tr-lg">
            PALING LARIS
          </div>
          <h3 className="text-xl font-bold text-amber-400 mb-2 flex items-center gap-2">
            <Crown size={24} fill="currentColor" /> Pro Bulanan
          </h3>
          <div className="flex items-end gap-2 mb-6">
            <span className="text-5xl font-black">Rp 99rb</span>
            <span className="text-slate-400 font-medium mb-1">/ bulan</span>
          </div>
          <button 
            onClick={() => handleSubscribe('PRO BULANAN', 'Rp 99.000')}
            className="w-full py-4 rounded-xl font-bold bg-gradient-to-r from-amber-400 to-orange-500 text-slate-900 hover:shadow-lg hover:shadow-orange-500/20 hover:scale-[1.02] transition-all mb-8 flex items-center justify-center gap-2"
          >
            <MessageCircle size={20} /> Beli via WhatsApp
          </button>
          <ul className="space-y-4 text-sm text-slate-200 font-medium">
            <li className="flex gap-3"><div className="bg-amber-500/20 p-1 rounded-full"><Check size={14} className="text-amber-400" /></div> Akses SEMUA Bank Soal</li>
            <li className="flex gap-3"><div className="bg-amber-500/20 p-1 rounded-full"><Check size={14} className="text-amber-400" /></div> Materi High Yield & Insight</li>
            <li className="flex gap-3"><div className="bg-amber-500/20 p-1 rounded-full"><Check size={14} className="text-amber-400" /></div> Flashcard Tanpa Gembok</li>
            <li className="flex gap-3"><div className="bg-amber-500/20 p-1 rounded-full"><Check size={14} className="text-amber-400" /></div> Bebas Iklan</li>
          </ul>
        </div>

        {/* 3. PAKET PRO 6 BULAN (HEMAT) */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-sm relative hover:border-indigo-500 transition-colors group">
          <h3 className="text-xl font-bold text-indigo-500 mb-2">UKMPPD Ready</h3>
          <div className="flex items-end gap-2 mb-6">
             <div>
                <span className="text-sm text-slate-400 line-through">Rp 594rb</span>
                <div className="text-4xl font-black text-slate-900 dark:text-white">Rp 299rb</div>
             </div>
          </div>
          <p className="text-xs text-slate-500 mb-4 font-bold uppercase tracking-wider bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded w-fit">Akses Penuh 6 Bulan</p>
          <button 
            onClick={() => handleSubscribe('PRO 6 BULAN', 'Rp 299.000')}
            className="w-full py-3 rounded-xl font-bold bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-900/40 transition-colors mb-8 border border-indigo-200 dark:border-indigo-800"
          >
            Pilih Paket Hemat
          </button>
          <ul className="space-y-4 text-sm text-slate-600 dark:text-slate-400">
            <li className="flex gap-3"><Check size={18} className="text-indigo-500 group-hover:scale-110 transition-transform" /> Semua Fitur Pro Member</li>
            <li className="flex gap-3"><Check size={18} className="text-indigo-500 group-hover:scale-110 transition-transform" /> Hemat 50% Biaya</li>
            <li className="flex gap-3"><Check size={18} className="text-indigo-500 group-hover:scale-110 transition-transform" /> Sekali bayar sampai lulus</li>
          </ul>
        </div>

      </div>

      {/* JAMINAN / FOOTER */}
      <div className="mt-16 grid md:grid-cols-3 gap-6 text-center text-slate-500">
        <div className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-2xl">
            <Zap className="mx-auto text-amber-500 mb-3" size={28} />
            <h4 className="font-bold text-slate-900 dark:text-white mb-1">Aktivasi Cepat</h4>
            {/* FIX: Gunakan &lt; untuk simbol kurang dari */}
            <p className="text-xs">Akun aktif &lt; 10 menit setelah bukti transfer dikirim.</p>
        </div>
        <div className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-2xl">
            <Shield className="mx-auto text-teal-500 mb-3" size={28} />
            <h4 className="font-bold text-slate-900 dark:text-white mb-1">Materi Terupdate</h4>
            <p className="text-xs">Sesuai SKDI terbaru dan guideline PPK terkini.</p>
        </div>
        <div className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-2xl">
            <Star className="mx-auto text-indigo-500 mb-3" size={28} />
            <h4 className="font-bold text-slate-900 dark:text-white mb-1">Garansi Kualitas</h4>
            <p className="text-xs">Dibuat oleh dokter terbaik untuk calon sejawat.</p>
        </div>
      </div>
    </div>
  );
}