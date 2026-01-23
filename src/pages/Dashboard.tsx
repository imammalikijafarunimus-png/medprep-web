import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  GraduationCap, Target, Clock, ArrowRight, 
  Activity, PlayCircle, Stethoscope, Crown, Star, X
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore'; 
import { db } from '../lib/firebase'; 

export default function Dashboard() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  
  const [showOffer, setShowOffer] = useState(false);
  const [userProfile, setUserProfile] = useState<any>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      if (currentUser?.uid) {
        try {
          const docRef = doc(db, "users", currentUser.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) setUserProfile(docSnap.data());
        } catch(e) { console.error(e) }
      }
    };
    fetchProfile();
  }, [currentUser]);

  useEffect(() => {
      if (userProfile && userProfile.subscriptionStatus === 'free') {
          const timer = setTimeout(() => { setShowOffer(true); }, 1500);
          return () => clearTimeout(timer);
      }
  }, [userProfile]);

  const handleWhatsApp = (plan: string, price: string) => {
    const adminPhone = "628123456789"; 
    const univName = userProfile?.university || "Universitas";
    const text = `Halo Admin, saya ${userProfile?.name || currentUser?.displayName} (${univName}).\nSaya tertarik promo *${plan}* seharga *${price}*.\nMohon info pembayaran.`;
    window.open(`https://wa.me/${adminPhone}?text=${encodeURIComponent(text)}`, '_blank');
    setShowOffer(false);
  };

  const StatCard = ({ icon: Icon, label, value, sub, color }: any) => (
    <div className="bg-white dark:bg-slate-800/50 border border-slate-100 dark:border-white/5 rounded-2xl p-5 relative overflow-hidden group hover:shadow-lg transition-all duration-300">
        <div className={`absolute top-0 right-0 w-16 h-16 rounded-full blur-2xl opacity-20 -mr-4 -mt-4 transition-transform group-hover:scale-150 ${color}`}></div>
        <div className="relative z-10">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${color} bg-opacity-10 text-current`}>
                <Icon size={20} className={color.replace('bg-', 'text-')} />
            </div>
            <h3 className="text-2xl font-black text-slate-800 dark:text-white mb-0.5">{value}</h3>
            <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">{label}</p>
            <p className="text-[10px] text-slate-400 mt-1">{sub}</p>
        </div>
    </div>
  );

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 relative">
      
      {showOffer && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
              <div className="bg-white dark:bg-slate-900 w-full max-w-sm rounded-[2rem] p-6 relative shadow-2xl border border-white/20 animate-in zoom-in-95 slide-in-from-bottom-8 duration-500">
                  <button onClick={() => setShowOffer(false)} className="absolute top-4 right-4 p-1.5 bg-slate-100 dark:bg-slate-800 rounded-full text-slate-400 hover:text-red-500 transition-colors"><X size={16} /></button>
                  {userProfile?.segment === 'muhammadiyah' ? (
                      <div className="text-center">
                          <div className="w-16 h-16 mx-auto bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-amber-500/30"><Crown size={32} className="text-white" fill="currentColor" /></div>
                          <h2 className="text-lg font-black text-slate-900 dark:text-white mb-1">Halo, Sejawat {userProfile?.university?.split(' ')[0] || 'PTM'}!</h2>
                          <p className="text-slate-500 text-xs mb-4 leading-relaxed">Dapatkan modul <b className="text-amber-600 dark:text-amber-400">Insight Islami & OSCE</b> sesuai kurikulum FK Muhammadiyah.</p>
                          <div className="bg-slate-50 dark:bg-slate-800 p-3 rounded-xl mb-4 text-left border border-slate-100 dark:border-slate-700">
                              <div className="flex justify-between items-center mb-1"><span className="text-[10px] font-bold text-slate-400 uppercase">Expert 6 Bulan</span><span className="text-[10px] text-slate-400 line-through">Rp 150.000</span></div>
                              <div className="flex justify-between items-end"><span className="text-2xl font-black text-slate-900 dark:text-white">Rp 75rb</span><span className="bg-green-100 text-green-700 px-2 py-0.5 rounded text-[9px] font-bold">HEMAT 50%</span></div>
                          </div>
                          <button onClick={() => handleWhatsApp('EXPERT PTM', 'Rp 75.000')} className="w-full py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold rounded-xl shadow-lg hover:scale-[1.02] transition-transform text-sm">Ambil Promo Expert</button>
                      </div>
                  ) : (
                      <div className="text-center">
                          <div className="w-16 h-16 mx-auto bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-blue-500/30"><Star size={32} className="text-white" fill="currentColor" /></div>
                          <h2 className="text-lg font-black text-slate-900 dark:text-white mb-1">Rekomendasi Terbaik!</h2>
                          <p className="text-slate-500 text-xs mb-4 leading-relaxed">Buka kunci <b className="text-blue-600 dark:text-blue-400">Ribuan Soal Premium</b> dan Analisis Kasus untuk lulus UKMPPD.</p>
                          <div className="bg-slate-50 dark:bg-slate-800 p-3 rounded-xl mb-4 text-left border border-slate-100 dark:border-slate-700">
                              <div className="flex justify-between items-center mb-1"><span className="text-[10px] font-bold text-slate-400 uppercase">Basic 6 Bulan</span><span className="text-[10px] text-slate-400 line-through">Rp 90.000</span></div>
                              <div className="flex justify-between items-end"><span className="text-2xl font-black text-slate-900 dark:text-white">Rp 45rb</span><span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded text-[9px] font-bold">BEST DEAL</span></div>
                          </div>
                          <button onClick={() => handleWhatsApp('BASIC GENERAL', 'Rp 45.000')} className="w-full py-3 bg-blue-600 text-white font-bold rounded-xl shadow-lg hover:bg-blue-700 transition-transform text-sm">Aktifkan Paket Basic</button>
                      </div>
                  )}
              </div>
          </div>
      )}

      {/* HERO SECTION */}
      <div className="relative rounded-[2rem] bg-slate-900 dark:bg-black overflow-hidden p-8 mb-6 text-white shadow-xl shadow-indigo-500/10">
          <div className="absolute top-0 right-0 w-[20rem] h-[20rem] bg-blue-600 rounded-full blur-[80px] opacity-30"></div>
          <div className="absolute bottom-0 left-0 w-[15rem] h-[15rem] bg-teal-500 rounded-full blur-[60px] opacity-20"></div>
          <div className="relative z-10 max-w-xl">
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase mb-4 border border-white/10"><span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse"></span> Medical OS v1.0</div>
              <h1 className="text-3xl md:text-4xl font-black leading-tight mb-4">Halo, dr. {userProfile?.name?.split(' ')[0] || currentUser?.displayName?.split(' ')[0] || 'Sejawat'} <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-300 to-blue-400">Siap Lulus UKMPPD?</span></h1>
              <p className="text-sm text-slate-300 mb-6 font-light italic opacity-90 max-w-md">"Barangsiapa menempuh jalan untuk menuntut ilmu, Allah akan mudahkan jalannya menuju Surga."</p>
              <div className="flex flex-wrap gap-3">
                  <button onClick={() => navigate('/app/cbt')} className="bg-white text-slate-900 px-6 py-3 rounded-xl font-bold hover:bg-slate-200 transition-all flex items-center gap-2 shadow-lg text-sm"><PlayCircle size={18} /> Mulai Latihan</button>
                  <button onClick={() => navigate('/app/flashcards')} className="bg-white/10 backdrop-blur-md border border-white/20 text-white px-6 py-3 rounded-xl font-bold hover:bg-white/20 transition-all text-sm">Buka Flashcards</button>
              </div>
          </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <StatCard icon={Target} value="12" label="Soal Hari Ini" sub="Target: 50 soal" color="bg-blue-500" />
          <StatCard icon={Activity} value="85%" label="Akurasi" sub="Naik +5%" color="bg-teal-500" />
          <StatCard icon={Clock} value="45m" label="Waktu Belajar" sub="Fokus baik!" color="bg-orange-500" />
      </div>

      <div className="grid md:grid-cols-2 gap-4">
          <div onClick={() => navigate('/app/cbt')} className="group cursor-pointer bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-[2rem] hover:border-indigo-500/50 transition-all relative overflow-hidden">
              <div className="absolute right-0 top-0 p-16 bg-indigo-500/5 rounded-full blur-2xl group-hover:bg-indigo-500/10 transition-all"></div>
              <div className="relative z-10">
                  <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform"><GraduationCap size={24} /></div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">Bank Soal UKMPPD</h3>
                  <p className="text-xs text-slate-500 mb-4">Ribuan soal terupdate per sistem.</p>
                  <span className="flex items-center gap-2 font-bold text-indigo-600 text-xs group-hover:gap-3 transition-all">Akses Sekarang <ArrowRight size={14} /></span>
              </div>
          </div>
          <div onClick={() => navigate('/app/osce')} className="group cursor-pointer bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-[2rem] hover:border-teal-500/50 transition-all relative overflow-hidden">
              <div className="absolute right-0 top-0 p-16 bg-teal-500/5 rounded-full blur-2xl group-hover:bg-teal-500/10 transition-all"></div>
              <div className="relative z-10">
                  <div className="w-12 h-12 bg-teal-50 dark:bg-teal-900/20 text-teal-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform"><Stethoscope size={24} /></div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">OSCE Center</h3>
                  <p className="text-xs text-slate-500 mb-4">Checklist & Video panduan klinis.</p>
                  <span className="flex items-center gap-2 font-bold text-teal-600 text-xs group-hover:gap-3 transition-all">Pelajari Skill <ArrowRight size={14} /></span>
              </div>
          </div>
      </div>
    </div>
  );
}