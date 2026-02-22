// src/pages/Dashboard.tsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  GraduationCap, Target, Clock, ArrowRight, 
  Activity, PlayCircle, Stethoscope, Crown, Star, X,
  Brain, Trophy, Flame
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';

// Array Kata-Kata Motivasi
const motivationalQuotes = [
  "Barangsiapa menempuh jalan untuk menuntut ilmu, Allah akan mudahkan jalannya menuju Surga.",
  "Ilmu adalah penuntun dan amal adalah pengiring.",
  "Tuntutlah ilmu walaupun di negeri China.",
  "Orang berilmu tanpa amal, bagaikan pohon tanpa buah.",
  "Cukuplah kebodohan seseorang, apabila ia tidak mengetahui nilai dirinya.",
  "Jadilah pintar, niscaya engkau akan disegani.",
  "Hikmah adalah barang dagangan Allah, barang siapa membelinya, ia mendapat keuntungan yang besar."
];

export default function Dashboard() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  
  const [showOffer, setShowOffer] = useState(false);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [currentQuote, setCurrentQuote] = useState("");

  // Fetch Profile & Set Random Quote
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

    // Set Random Quote
    const randomIndex = Math.floor(Math.random() * motivationalQuotes.length);
    setCurrentQuote(motivationalQuotes[randomIndex]);
  }, [currentUser]);

  // Popup Logic
  useEffect(() => {
      if (userProfile && userProfile.subscriptionStatus === 'free') {
          const timer = setTimeout(() => setShowOffer(true), 1500);
          return () => clearTimeout(timer);
      }
  }, [userProfile]);

  const handleWhatsApp = (plan: string, price: string) => {
    const adminPhone = "6285786456321"; 
    const univName = userProfile?.university || "Universitas";
    const text = `Halo Admin, saya ${userProfile?.name || currentUser?.displayName} (${univName}).\nTertarik promo *${plan}* (${price}).`;
    window.open(`https://wa.me/${adminPhone}?text=${encodeURIComponent(text)}`, '_blank');
    setShowOffer(false);
  };

  // REALTIME STATS FROM CONTEXT
  const stats = currentUser?.stats;
  const accuracy = stats && stats.totalAnswered > 0 ? Math.round((stats.totalCorrect / stats.totalAnswered) * 100) : 0;

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 relative">
      
      {/* Smart Offer Modal */}
      {showOffer && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
              <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-[2.5rem] p-8 relative shadow-2xl border border-slate-200">
                  <button onClick={() => setShowOffer(false)} className="absolute top-4 right-4 p-2 bg-slate-100 rounded-full text-slate-500"><X size={20} /></button>
                  <div className="text-center">
                     <Crown size={48} className="text-amber-500 mx-auto mb-4" />
                     <h2 className="text-xl font-black text-slate-900 dark:text-white mb-2">Upgrade ke Pro</h2>
                     <p className="text-slate-500 text-sm mb-6">Buka akses penuh semua fitur premium.</p>
                     <button onClick={() => handleWhatsApp('PRO', 'Rp 99.000')} className="w-full py-3 bg-slate-900 text-white font-bold rounded-2xl">Ambil Penawaran</button>
                  </div>
              </div>
          </div>
      )}

      {/* HERO SECTION */}
      <div className="relative rounded-[2.5rem] bg-slate-900 dark:bg-black overflow-hidden p-8 md:p-12 mb-8 text-white shadow-2xl shadow-indigo-500/20">
          <div className="absolute top-0 right-0 w-[30rem] h-[30rem] bg-blue-600 rounded-full blur-[100px] opacity-30"></div>
          <div className="absolute bottom-0 left-0 w-[20rem] h-[20rem] bg-teal-500 rounded-full blur-[80px] opacity-20"></div>
          
          <div className="relative z-10 max-w-2xl">
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-1.5 rounded-full text-xs font-bold tracking-wider uppercase mb-6 border border-white/10">
                  <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse"></span> Medical OS v2.0
              </div>
              <h1 className="text-4xl md:text-5xl font-black leading-tight mb-4">
                  Halo, dr. {userProfile?.name?.split(' ')[0] || currentUser?.displayName?.split(' ')[0] || 'Sejawat'} 
              </h1>
              {/* DYNAMIC QUOTE */}
              <p className="text-lg text-slate-300 mb-8 font-light italic">
                  "{currentQuote}"
              </p>
              
              <div className="flex flex-wrap gap-4">
                  <button onClick={() => navigate('/app/cbt')} className="bg-white text-slate-900 px-8 py-4 rounded-2xl font-bold hover:bg-slate-200 transition-all flex items-center gap-2 shadow-lg">
                      <PlayCircle size={20} /> Mulai Latihan
                  </button>
                  <button onClick={() => navigate('/app/osce')} className="bg-white/10 backdrop-blur-md border border-white/20 text-white px-8 py-4 rounded-2xl font-bold hover:bg-white/20 transition-all">
                      Buka OSCE
                  </button>
              </div>
          </div>
      </div>

      {/* REALTIME STATS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-6 hover:shadow-xl transition-all">
              <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-teal-50 dark:bg-teal-900/20 text-teal-600 flex items-center justify-center">
                      <Target size={24} />
                  </div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Total Answered</span>
              </div>
              <h3 className="text-3xl font-black text-slate-900 dark:text-white mb-1">{stats?.totalAnswered || 0}</h3>
              <p className="text-xs text-slate-500">Soal terselesaikan</p>
          </div>
          
          <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-6 hover:shadow-xl transition-all">
              <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-900/20 text-blue-600 flex items-center justify-center">
                      <Activity size={24} />
                  </div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Accuracy</span>
              </div>
              <h3 className="text-3xl font-black text-slate-900 dark:text-white mb-1">{accuracy}%</h3>
              <div className="mt-2 h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500 rounded-full" style={{ width: `${accuracy}%` }} />
              </div>
          </div>

          <div className="bg-gradient-to-br from-orange-500 to-amber-500 rounded-3xl p-6 text-white hover:shadow-xl transition-all relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-white/20 rounded-full blur-xl -mr-8 -mt-8"></div>
              <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                      <Flame size={24} />
                      <span className="text-[10px] font-bold uppercase bg-white/20 px-2 py-1 rounded-full">Streak</span>
                  </div>
                  <h3 className="text-3xl font-black mb-1">{stats?.streak || 0} Hari</h3>
                  <p className="text-xs opacity-90">Pertahankan semangat!</p>
              </div>
          </div>
      </div>

      {/* Quick Access Cards */}
      <div className="grid md:grid-cols-2 gap-6">
          <div onClick={() => navigate('/app/cbt')} className="group cursor-pointer bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 rounded-[2rem] hover:border-indigo-500/50 transition-all relative overflow-hidden">
              <div className="relative z-10">
                  <div className="w-14 h-14 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                      <Brain size={28} />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Bank Soal UKMPPD</h3>
                  <p className="text-slate-500 mb-6 text-sm">Progres kamu tersimpan real-time.</p>
                  <span className="flex items-center gap-2 font-bold text-indigo-600 group-hover:gap-3 transition-all">Akses Sekarang <ArrowRight size={18} /></span>
              </div>
          </div>

          <div onClick={() => navigate('/app/osce')} className="group cursor-pointer bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 rounded-[2rem] hover:border-teal-500/50 transition-all relative overflow-hidden">
              <div className="relative z-10">
                  <div className="w-14 h-14 bg-teal-50 dark:bg-teal-900/20 text-teal-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                      <Stethoscope size={28} />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">OSCE Center</h3>
                  <p className="text-slate-500 mb-6 text-sm">Simulasi klinis interaktif lengkap.</p>
                  <span className="flex items-center gap-2 font-bold text-teal-600 group-hover:gap-3 transition-all">Pelajari Skill <ArrowRight size={18} /></span>
              </div>
          </div>
      </div>

    </div>
  );
}