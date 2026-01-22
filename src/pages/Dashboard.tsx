import React from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  GraduationCap, Target, Clock, ArrowRight, 
  Activity, PlayCircle, Stethoscope 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const firstName = currentUser?.displayName?.split(' ')[0] || 'Dokter';

  // Component Kartu Statistik
  const StatCard = ({ icon: Icon, label, value, sub, color }: any) => (
    <div className="bg-white dark:bg-slate-800/50 border border-slate-100 dark:border-white/5 rounded-3xl p-6 relative overflow-hidden group hover:shadow-xl transition-all duration-300">
        <div className={`absolute top-0 right-0 w-24 h-24 rounded-full blur-2xl opacity-20 -mr-6 -mt-6 transition-transform group-hover:scale-150 ${color}`}></div>
        <div className="relative z-10">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 ${color} bg-opacity-10 text-current`}>
                <Icon size={24} className={color.replace('bg-', 'text-')} />
            </div>
            <h3 className="text-3xl font-black text-slate-800 dark:text-white mb-1">{value}</h3>
            <p className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">{label}</p>
            <p className="text-xs text-slate-400 mt-2">{sub}</p>
        </div>
    </div>
  );

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* HERO SECTION (Yang sebelumnya "Blank Biru", sekarang dipercantik) */}
      <div className="relative rounded-[2.5rem] bg-slate-900 dark:bg-black overflow-hidden p-8 md:p-12 mb-8 text-white shadow-2xl shadow-indigo-500/20">
          {/* Background Effects */}
          <div className="absolute top-0 right-0 w-[30rem] h-[30rem] bg-blue-600 rounded-full blur-[100px] opacity-30"></div>
          <div className="absolute bottom-0 left-0 w-[20rem] h-[20rem] bg-teal-500 rounded-full blur-[80px] opacity-20"></div>
          
          <div className="relative z-10 max-w-2xl">
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-1.5 rounded-full text-xs font-bold tracking-wider uppercase mb-6 border border-white/10">
                  <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse"></span> Medical OS v1.0
              </div>
              <h1 className="text-4xl md:text-6xl font-black leading-tight mb-6">
                  Halo, dr. {firstName} <br/>
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-300 to-blue-400">Siap Lulus UKMPPD?</span>
              </h1>
              <p className="text-lg text-slate-300 mb-8 font-light italic">
                  "Barangsiapa menempuh jalan untuk menuntut ilmu, Allah akan mudahkan jalannya menuju Surga."
              </p>
              
              <div className="flex flex-wrap gap-4">
                  <button 
                    onClick={() => navigate('/app/cbt')}
                    className="bg-white text-slate-900 px-8 py-4 rounded-2xl font-bold hover:bg-slate-200 transition-all flex items-center gap-2 shadow-lg shadow-white/10"
                  >
                      <PlayCircle size={20} /> Mulai Latihan
                  </button>
                  <button 
                    onClick={() => navigate('/app/flashcards')}
                    className="bg-white/10 backdrop-blur-md border border-white/20 text-white px-8 py-4 rounded-2xl font-bold hover:bg-white/20 transition-all"
                  >
                      Buka Flashcards
                  </button>
              </div>
          </div>
      </div>

      {/* STATS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <StatCard 
            icon={Target} value="12" label="Soal Hari Ini" sub="Target harian: 50 soal" color="bg-blue-500" 
          />
          <StatCard 
            icon={Activity} value="85%" label="Akurasi" sub="Meningkat +5% minggu ini" color="bg-teal-500" 
          />
          <StatCard 
            icon={Clock} value="45m" label="Waktu Belajar" sub="Fokus yang sangat baik!" color="bg-orange-500" 
          />
      </div>

      {/* QUICK ACCESS (Menu Cepat) */}
      <div className="grid md:grid-cols-2 gap-6">
          <div onClick={() => navigate('/app/cbt')} className="group cursor-pointer bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 rounded-[2rem] hover:border-indigo-500/50 transition-all relative overflow-hidden">
              <div className="absolute right-0 top-0 p-24 bg-indigo-500/5 rounded-full blur-2xl group-hover:bg-indigo-500/10 transition-all"></div>
              <div className="relative z-10">
                  <div className="w-14 h-14 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                      <GraduationCap size={28} />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Bank Soal UKMPPD</h3>
                  <p className="text-slate-500 mb-6">Ribuan soal terupdate per sistem organ.</p>
                  <span className="flex items-center gap-2 font-bold text-indigo-600 group-hover:gap-3 transition-all">
                      Akses Sekarang <ArrowRight size={18} />
                  </span>
              </div>
          </div>

          <div onClick={() => navigate('/app/osce')} className="group cursor-pointer bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 rounded-[2rem] hover:border-teal-500/50 transition-all relative overflow-hidden">
              <div className="absolute right-0 top-0 p-24 bg-teal-500/5 rounded-full blur-2xl group-hover:bg-teal-500/10 transition-all"></div>
              <div className="relative z-10">
                  <div className="w-14 h-14 bg-teal-50 dark:bg-teal-900/20 text-teal-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                      <Stethoscope size={28} />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">OSCE Center</h3>
                  <p className="text-slate-500 mb-6">Checklist & Video panduan klinis.</p>
                  <span className="flex items-center gap-2 font-bold text-teal-600 group-hover:gap-3 transition-all">
                      Pelajari Skill <ArrowRight size={18} />
                  </span>
              </div>
          </div>
      </div>

    </div>
  );
}