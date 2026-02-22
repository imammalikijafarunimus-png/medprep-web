// src/components/CBTCenter.tsx
import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  BookOpen, Brain, ArrowRight, LayoutGrid, 
  Zap, Folder, ChevronRight, Lock, ArrowLeft, History, PlayCircle,
  Trophy, Activity, Target, Flame
} from 'lucide-react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { SYSTEM_LIST } from '../data/osce_data'; 
import { useAuth } from '../context/AuthContext'; // Import Auth

export default function CBTCenter() {
  const navigate = useNavigate();
  const { currentUser } = useAuth(); // Ambil user data
  
  // State
  const [selectedSystem, setSelectedSystem] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'menu' | 'method' | 'latihan_type' | 'folder_list'>('menu');
  const [latihanCategory, setLatihanCategory] = useState<'drilling' | 'arsip' | null>(null);
  const [loading, setLoading] = useState(false);
  const [folders, setFolders] = useState<{name: string, year?: string, count: number, isPremium: boolean}[]>([]);

  // Get Stats from User
  const stats = currentUser?.stats;
  const accuracy = stats && stats.totalAnswered > 0 ? Math.round((stats.totalCorrect / stats.totalAnswered) * 100) : 0;

  // 1. SELECT SYSTEM
  const handleSelectSystem = (sys: string) => {
    setSelectedSystem(sys);
    setViewMode('method');
  };

  // 2. FETCH FOLDERS
  useEffect(() => {
    if (viewMode === 'folder_list' && selectedSystem && latihanCategory) {
        const fetchFolders = async () => {
            setLoading(true);
            try {
                // Query berdasarkan System Label (Pastikan data di Firestore 'system' pakai Label, bukan ID)
                const q = query(collection(db, "cbt_questions"), where("system", "==", selectedSystem));
                const snapshot = await getDocs(q);
                
                const groups: {[key: string]: any} = {};
                
                snapshot.docs.forEach(doc => {
                    const d = doc.data();
                    const hasYear = d.examYear && d.examYear.trim() !== '' && d.examYear !== '-';
                    const isArsip = hasYear;
                    const isDrilling = !hasYear;

                    // Filter berdasarkan kategori yang dipilih
                    if ((latihanCategory === 'arsip' && isArsip) || (latihanCategory === 'drilling' && isDrilling)) {
                        const batchName = d.examBatch || 'Latihan Umum';
                        const year = d.examYear || '';
                        const key = `${batchName}-${year}`;

                        if(!groups[key]) {
                            groups[key] = {
                                name: batchName,
                                year: year,
                                count: 0,
                                isPremium: d.type === 'premium'
                            };
                        }
                        groups[key].count += 1;
                    }
                });

                const result = Object.values(groups);
                if (latihanCategory === 'arsip') {
                    result.sort((a:any, b:any) => b.year - a.year);
                } else {
                    result.sort((a:any, b:any) => a.name.localeCompare(b.name));
                }
                
                setFolders(result);
            } catch (err) {
                console.error(err);
                toast.error("Gagal memuat data");
            } finally {
                setLoading(false);
            }
        };
        fetchFolders();
    }
  }, [viewMode, selectedSystem, latihanCategory]);

  // RESET FUNCTION
  const handleBack = () => {
      if (viewMode === 'folder_list') setViewMode('latihan_type');
      else if (viewMode === 'latihan_type') setViewMode('method');
      else if (viewMode === 'method') { setSelectedSystem(null); setViewMode('menu'); }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-24 max-w-5xl mx-auto px-4">
      
      {/* HERO HEADER - REALTIME STATS */}
      <div className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-black rounded-[2rem] p-6 overflow-hidden shadow-2xl border border-slate-700/50">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-[80px] opacity-50"></div>
        
        <div className="relative z-10">
            <div className="flex justify-between items-start mb-6">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <div className="p-2 bg-indigo-500/20 rounded-xl text-indigo-400"><Brain size={20} /></div>
                        <h1 className="text-2xl font-black text-white tracking-tight">CBT Center</h1>
                    </div>
                    <p className="text-slate-400 text-xs">Bank soal & simulasi ujian komprehensif.</p>
                </div>
                <button className="text-[10px] font-bold text-indigo-400 bg-indigo-500/10 px-3 py-1.5 rounded-full border border-indigo-500/20">
                    RANK #1
                </button>
            </div>

            {/* REALTIME STATS GRID */}
            <div className="grid grid-cols-3 gap-3">
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-3 text-center">
                    <h4 className="text-xl font-black text-white">{stats?.totalAnswered || 0}</h4>
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Total Soal</p>
                </div>
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-3 text-center">
                    <h4 className="text-xl font-black text-emerald-400">{accuracy}%</h4>
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Akurasi</p>
                </div>
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-3 text-center">
                    <div className="flex items-center justify-center gap-1">
                        <Flame size={16} className="text-orange-500" fill="currentColor"/>
                        <h4 className="text-xl font-black text-white">{stats?.streak || 0}</h4>
                    </div>
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Streak</p>
                </div>
            </div>
        </div>
      </div>

      {/* --- LEVEL 1: PILIH SISTEM --- */}
      {viewMode === 'menu' && (
        <div className="space-y-4">
            <h3 className="text-slate-800 dark:text-white font-bold text-sm mb-3 flex items-center gap-2 px-1">
              <span className="w-1 h-4 rounded-full bg-teal-500"></span> Pilih Sistem
            </h3>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {SYSTEM_LIST.map((sys) => {
               const sysProg = stats?.systemProgress?.[sys.id];
               const answered = sysProg?.answered || 0;
               
               return (
                <button
                    key={sys.id}
                    onClick={() => handleSelectSystem(sys.label)}
                    className="group relative bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 h-24 rounded-2xl flex flex-col justify-between text-left transition-all hover:shadow-lg hover:shadow-indigo-500/10 hover:-translate-y-0.5 hover:border-indigo-500/50 overflow-hidden"
                >
                    <div className="flex justify-between items-start">
                         <span className="text-xs font-bold text-slate-600 dark:text-slate-300 group-hover:text-indigo-600 transition-colors">
                            {sys.label}
                        </span>
                        <span className="text-[9px] font-bold text-slate-400 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded">
                            {sys.id === 'gadar' ? <Flame size={10} className="text-red-500"/> : (answered > 0 ? `${answered}` : 'Start')}
                        </span>
                    </div>
                    <div>
                        <span className="text-[10px] text-slate-400 font-medium">
                             {sys.id.toUpperCase()}
                        </span>
                    </div>
                </button>
              );
            })}
            </div>
        </div>
      )}

      {/* --- LEVEL 2: PILIH METODE --- */}
      {viewMode === 'method' && (
        <div className="space-y-4 animate-in zoom-in-95 duration-300">
            <button onClick={handleBack} className="flex items-center gap-2 text-[10px] font-bold text-slate-500 bg-white dark:bg-slate-900 px-3 py-1.5 rounded-full border border-slate-200 dark:border-slate-800">
                <ArrowLeft size={12} /> Kembali
            </button>
            
            <div className="grid md:grid-cols-2 gap-4">
                {/* Card Materi */}
                <div onClick={() => navigate(`/app/cbt/read?system=${encodeURIComponent(selectedSystem!)}`)} className="group bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl cursor-pointer hover:shadow-md hover:border-pink-500/30 transition-all relative overflow-hidden">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-pink-50 dark:bg-pink-900/20 text-pink-500 rounded-xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform"><BookOpen size={24} /></div>
                        <div className="flex-1">
                            <h3 className="font-bold text-slate-900 dark:text-white text-sm">Pelajari Materi</h3>
                            <p className="text-slate-500 text-[10px]">High-Yield Notes</p>
                        </div>
                        <ChevronRight size={18} className="text-slate-300 ml-auto group-hover:text-pink-500 transition-colors" />
                    </div>
                </div>

                {/* Card Soal */}
                <div onClick={() => setViewMode('latihan_type')} className="group bg-slate-900 dark:bg-black border border-slate-800 p-6 rounded-2xl cursor-pointer hover:shadow-md hover:shadow-indigo-500/10 transition-all relative overflow-hidden">
                     <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-white/10 text-white rounded-xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform"><Brain size={24} /></div>
                        <div className="flex-1">
                            <h3 className="font-bold text-white text-sm">Latihan Soal</h3>
                            <p className="text-slate-400 text-[10px]">Simulasi CBT</p>
                        </div>
                        <ChevronRight size={18} className="text-slate-700 ml-auto group-hover:text-indigo-400 transition-colors" />
                    </div>
                </div>
            </div>
        </div>
      )}

      {/* --- LEVEL 3: PILIH TIPE LATIHAN --- */}
      {viewMode === 'latihan_type' && (
        <div className="space-y-4 animate-in zoom-in-95 duration-300">
             <button onClick={handleBack} className="flex items-center gap-2 text-[10px] font-bold text-slate-500 bg-white dark:bg-slate-900 px-3 py-1.5 rounded-full border border-slate-200 dark:border-slate-800">
                <ArrowLeft size={12} /> Kembali
            </button>
            
            <div className="grid md:grid-cols-2 gap-4">
                <div onClick={() => { setLatihanCategory('drilling'); setViewMode('folder_list'); }} className="group bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl cursor-pointer hover:border-indigo-500 transition-all hover:shadow-md flex items-center gap-4">
                    <div className="w-10 h-10 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 rounded-xl flex items-center justify-center shrink-0"><Zap size={20} /></div>
                    <div className="flex-1">
                        <h3 className="font-bold text-sm text-slate-900 dark:text-white">Drilling Intensif</h3>
                        <p className="text-[10px] text-slate-500">Acak & berdasarkan topik.</p>
                    </div>
                    <ChevronRight size={18} className="text-slate-300 group-hover:text-indigo-500" />
                </div>

                <div onClick={() => { setLatihanCategory('arsip'); setViewMode('folder_list'); }} className="group bg-gradient-to-br from-amber-50 to-white dark:from-slate-900 dark:to-black border border-amber-200 dark:border-amber-900/30 p-5 rounded-2xl cursor-pointer hover:shadow-md transition-all flex items-center gap-4">
                    <div className="w-10 h-10 bg-amber-100 dark:bg-amber-900/20 text-amber-600 rounded-xl flex items-center justify-center shrink-0"><History size={20} /></div>
                    <div className="flex-1">
                        <h3 className="font-bold text-sm text-slate-900 dark:text-white">Arsip UKMPPD</h3>
                        <p className="text-[10px] text-slate-500">Soal tahun-tahun sebelumnya.</p>
                    </div>
                    <ChevronRight size={18} className="text-slate-300 group-hover:text-amber-500" />
                </div>
            </div>
        </div>
      )}

      {/* --- LEVEL 4: LIST FOLDER --- */}
      {viewMode === 'folder_list' && (
          <div className="space-y-4 animate-in slide-in-from-bottom-4 duration-500">
              <button onClick={handleBack} className="flex items-center gap-2 text-[10px] font-bold text-slate-500 bg-white dark:bg-slate-900 px-3 py-1.5 rounded-full border border-slate-200 dark:border-slate-800">
                  <ArrowLeft size={12} /> Kembali
              </button>
              
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-slate-800 dark:text-white font-bold text-sm flex items-center gap-2">
                    <Folder size={16} className={latihanCategory === 'arsip' ? "text-amber-500" : "text-indigo-500"} /> 
                    Folder {latihanCategory === 'arsip' ? 'Arsip' : 'Latihan'}
                </h3>
              </div>

              {loading ? (
                  <div className="grid gap-2">{[1,2,3].map(i => <div key={i} className="h-14 bg-slate-100 dark:bg-slate-800 rounded-xl animate-pulse"></div>)}</div>
              ) : (
                  <div className="grid gap-2">
                      {folders.length === 0 ? (
                          <div className="text-center py-10 text-xs text-slate-400 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-dashed">Folder kosong atau tidak ada data.</div>
                      ) : (
                        folders.map((folder, idx) => (
                            <div key={idx} onClick={() => navigate(`/app/cbt/quiz?system=${encodeURIComponent(selectedSystem!)}&batch=${folder.name}&year=${folder.year}`)} className="group bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-indigo-500/30 transition-all cursor-pointer flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center font-bold text-[10px] ${latihanCategory === 'arsip' ? 'bg-amber-100 dark:bg-amber-900/20 text-amber-600' : 'bg-indigo-100 dark:bg-indigo-900/20 text-indigo-600'}`}>
                                        {latihanCategory === 'arsip' ? folder.year : idx + 1}
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-sm text-slate-800 dark:text-white line-clamp-1">{folder.name}</h4>
                                        <div className="flex items-center gap-2">
                                            <span className="text-[10px] text-slate-500">{folder.count} Soal</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    {folder.isPremium && <Lock size={12} className="text-amber-500" />}
                                    <ChevronRight size={16} className="text-slate-300 group-hover:text-indigo-500" />
                                </div>
                            </div>
                        ))
                      )}
                  </div>
              )}
          </div>
      )}

    </div>
  );
}