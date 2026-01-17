import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  BookOpen, Activity, Zap, ArrowRight, TrendingUp, 
  Calendar, Sparkles 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';

// Kita definisikan tipe data langsung di sini agar tidak perlu file external (mengurangi risiko error import)
interface UserProfile {
  name: string;
  university: string;
  segment: 'muhammadiyah' | 'general';
  preferences?: {
    showIslamicInsight: boolean;
  };
}

export default function Dashboard() {
  const { user } = useAuth();
  
  const [profile, setProfile] = useState<UserProfile | null>(null);
  
  // Default nilai 0 agar tidak error saat render awal
  const [stats, setStats] = useState({ osceCount: 0, osceAvg: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      // Cek apakah user sudah login & punya UID
      if (user?.uid) {
        try {
          // 1. Ambil Data Profil User
          const userDoc = await getDoc(doc(db, "users", user.uid));
          if (userDoc.exists()) {
            setProfile(userDoc.data() as UserProfile);
          }

          // 2. Ambil Riwayat Belajar (Cek apakah collection ada)
          const q = query(collection(db, "study_history"), where("userId", "==", user.uid));
          const querySnapshot = await getDocs(q);
          
          if (!querySnapshot.empty) {
            const history = querySnapshot.docs.map(doc => doc.data());
            
            // Filter hanya yang tipe OSCE
            const osceSessions = history.filter((h: any) => h.type === 'OSCE');
            
            // Hitung rata-rata (Safe Math)
            let avg = 0;
            if (osceSessions.length > 0) {
              const totalScore = osceSessions.reduce((acc: number, curr: any) => acc + (Number(curr.score) || 0), 0);
              avg = Math.round(totalScore / osceSessions.length);
            }

            setStats({
              osceCount: osceSessions.length,
              osceAvg: avg,
            });
          } else {
            // Jika data kosong, biarkan default 0
            console.log("Belum ada riwayat belajar (User Baru)");
          }

        } catch (err) {
          console.error("Error mengambil data dashboard:", err);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchData();
  }, [user]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-slate-500 animate-pulse space-y-4">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        <p>Sedang menyiapkan ruang belajarmu...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* HERO BANNER */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-900 to-slate-900 border border-slate-700 shadow-2xl p-8">
        <div className="absolute right-0 top-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
        
        <div className="relative z-10 grid md:grid-cols-2 gap-6 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-500/30 text-blue-300 text-xs font-bold mb-4">
              <TrendingUp size={14} /> Target: Lulus One Shot
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">
              Halo, {profile?.name || 'Sejawat'}!
            </h1>
            <p className="text-slate-300 mb-6 max-w-md text-sm leading-relaxed">
              Belum ada aktivitas hari ini. Yuk mulai cicil materi atau latihan OSCE biar nggak SKS (Sistem Kebut Semalam).
            </p>
            <div className="flex gap-3">
              <Link to="/app/materi" className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold text-sm transition-all shadow-lg shadow-blue-600/20">
                Mulai Belajar
              </Link>
              <Link to="/app/osce" className="px-6 py-2.5 bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 rounded-xl font-bold text-sm transition-all">
                Lanjut OSCE
              </Link>
            </div>
          </div>
          
          {/* Status Panel (Safe Render untuk data 0) */}
          <div className="hidden md:block bg-slate-950/50 backdrop-blur-md border border-slate-700/50 rounded-2xl p-6">
             <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="text-slate-400 text-xs">Rata-rata Skor OSCE</p>
                  <p className="text-3xl font-bold text-white">{stats.osceAvg || 0}<span className="text-sm text-slate-500 font-normal">/10</span></p>
                </div>
                <div className={`p-2 rounded-lg ${stats.osceAvg >= 7 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-700/50 text-slate-400'}`}>
                  <Activity size={20} />
                </div>
             </div>
             {/* Progress Bar (Cegah NaN) */}
             <div className="w-full bg-slate-800 rounded-full h-2 mb-2">
                <div 
                  className="bg-blue-500 h-2 rounded-full transition-all duration-1000" 
                  style={{ width: `${stats.osceAvg ? (stats.osceAvg / 10) * 100 : 0}%` }}
                ></div>
             </div>
             <p className="text-xs text-slate-500 text-right">{stats.osceCount} Sesi terselesaikan</p>
          </div>
        </div>
      </div>

      {/* QUICK STATS GRID */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Bank Soal', val: 'CBT', icon: BookOpen, color: 'text-blue-400', bg: 'bg-blue-500/10', link: '/app/materi' },
          { label: 'Flashcards', val: 'Drill', icon: Zap, color: 'text-amber-400', bg: 'bg-amber-500/10', link: '/app/flashcards' },
          { label: 'OSCE', val: 'Skill', icon: Activity, color: 'text-purple-400', bg: 'bg-purple-500/10', link: '/app/osce' },
          { label: 'Jadwal', val: 'Kalender', icon: Calendar, color: 'text-emerald-400', bg: 'bg-emerald-500/10', link: '#' },
        ].map((item, idx) => (
          <Link key={idx} to={item.link} className="bg-slate-900/50 border border-slate-800 hover:border-slate-600 p-5 rounded-2xl transition-all group hover:-translate-y-1">
            <div className={`w-10 h-10 ${item.bg} ${item.color} rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
              <item.icon size={20} />
            </div>
            <p className="text-slate-400 text-xs font-medium uppercase tracking-wider">{item.val}</p>
            <h3 className="text-white font-bold text-lg">{item.label}</h3>
          </Link>
        ))}
      </div>

      {/* INSIGHT MODE STATUS (Logic PTM/General) */}
      {(profile?.segment === 'muhammadiyah' || profile?.preferences?.showIslamicInsight) && (
        <div className="bg-emerald-900/10 border border-emerald-500/20 rounded-2xl p-6 flex items-start gap-4 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-32 bg-emerald-500/5 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2"></div>
          
          <div className="bg-emerald-500/20 p-3 rounded-xl text-emerald-400 shrink-0">
            <Sparkles size={24} />
          </div>
          <div>
            <h3 className="text-emerald-300 font-bold text-lg">Insight Mode: Aktif</h3>
            <p className="text-emerald-400/70 text-sm mb-3">
              Modul Fiqih Medis & Bioetika terintegrasi dalam materi belajarmu.
            </p>
            <div className="flex gap-2">
              <span className="text-[10px] bg-emerald-500/10 text-emerald-400 px-2 py-1 rounded border border-emerald-500/20">
                Fiqih Ibadah Pasien
              </span>
              <span className="text-[10px] bg-emerald-500/10 text-emerald-400 px-2 py-1 rounded border border-emerald-500/20">
                Adab Dokter Muslim
              </span>
            </div>
          </div>
        </div>
      )}

      {/* RECENT ACTIVITY (Placeholder jika kosong) */}
      <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-bold text-white text-lg">Lanjutkan Terakhir</h3>
        </div>
        
        {/* Tampilkan pesan jika belum ada data */}
        <div className="p-8 text-center border border-dashed border-slate-800 rounded-xl">
           <p className="text-slate-500 text-sm mb-2">Belum ada aktivitas belajar.</p>
           <Link to="/app/osce" className="text-blue-400 text-xs hover:underline">Coba latihan OSCE pertamamu &rarr;</Link>
        </div>
      </div>

    </div>
  );
}