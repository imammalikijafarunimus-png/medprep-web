import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  BookOpen, Brain, ArrowRight, LayoutGrid, 
  Zap, Folder, ChevronRight, Lock, ArrowLeft, History, PlayCircle 
} from 'lucide-react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { SYSTEM_LIST } from '../data/osce_data'; 

export default function CBTCenter() {
  const navigate = useNavigate();
  
  // STATE LOGIC (TETAP SAMA)
  const [selectedSystem, setSelectedSystem] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'menu' | 'method' | 'latihan_type' | 'folder_list'>('menu');
  const [latihanCategory, setLatihanCategory] = useState<'drilling' | 'arsip' | null>(null);
  const [loading, setLoading] = useState(false);
  const [folders, setFolders] = useState<{name: string, year?: string, count: number, isPremium: boolean}[]>([]);

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
                const q = query(collection(db, "cbt_questions"), where("system", "==", selectedSystem));
                const snapshot = await getDocs(q);
                
                const groups: {[key: string]: any} = {};
                
                snapshot.docs.forEach(doc => {
                    const d = doc.data();
                    const hasYear = d.examYear && d.examYear.trim() !== '' && d.examYear !== '-';
                    const isArsip = hasYear;
                    const isDrilling = !hasYear;

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
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-24 max-w-7xl mx-auto px-4 md:px-6">
      
      {/* HEADER HERO (Glassmorphism Dark) */}
      <div className="relative bg-slate-900 dark:bg-black rounded-[2.5rem] p-8 md:p-10 overflow-hidden shadow-2xl shadow-slate-200/50 dark:shadow-none">
        {/* Background Effects */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500 rounded-full blur-[80px] opacity-20"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-teal-500 rounded-full blur-[60px] opacity-20"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
                {/* Breadcrumb Navigation */}
                {selectedSystem && (
                    <button 
                        onClick={handleBack} 
                        className="mb-3 flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-white transition-colors bg-white/5 px-3 py-1.5 rounded-full w-fit backdrop-blur-md"
                    >
                        <ArrowLeft size={12} /> Kembali
                    </button>
                )}
                
                <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight mb-2">
                    {selectedSystem ? selectedSystem : 'CBT Center'}
                </h1>
                <p className="text-slate-400 text-sm max-w-xl leading-relaxed">
                   {selectedSystem 
                        ? `Akses modul pembelajaran dan bank soal khusus sistem ${selectedSystem}.` 
                        : 'Pilih sistem organ di bawah ini untuk memulai sesi belajar.'}
                </p>
            </div>
            
            {/* Decoration Icon */}
            <div className="hidden md:flex w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl items-center justify-center text-white shadow-lg shadow-indigo-500/30">
                <LayoutGrid size={32} />
            </div>
        </div>
      </div>

      {/* --- LEVEL 1: PILIH SISTEM (Grid ala App Icon) --- */}
      {viewMode === 'menu' && (
        <div className="animate-in slide-in-from-bottom-8 duration-500">
            <h3 className="text-slate-800 dark:text-white font-bold text-lg mb-6 flex items-center gap-2 px-1">
              <span className="w-1.5 h-6 rounded-full bg-teal-500"></span> Pilih Sistem Organ
            </h3>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {SYSTEM_LIST.map((sys) => (
                <button
                    key={sys.id}
                    onClick={() => handleSelectSystem(sys.label)}
                    className="group relative bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 p-4 h-24 rounded-3xl flex flex-col items-center justify-center text-center transition-all duration-300 hover:shadow-xl hover:shadow-indigo-500/10 hover:-translate-y-1 hover:border-indigo-500/30"
                >
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/50 to-transparent dark:from-indigo-900/20 opacity-0 group-hover:opacity-100 rounded-3xl transition-opacity"></div>
                    <span className="text-sm font-bold text-slate-600 dark:text-slate-300 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 relative z-10 transition-colors">
                        {sys.label}
                    </span>
                </button>
            ))}
            </div>
        </div>
      )}

      {/* --- LEVEL 2: PILIH METODE (Large Cards) --- */}
      {viewMode === 'method' && (
        <div className="grid md:grid-cols-2 gap-6 animate-in zoom-in-95 duration-300">
            {/* CARD 1: MATERI */}
            <div 
                onClick={() => navigate(`/app/cbt/read?system=${encodeURIComponent(selectedSystem!)}`)} 
                className="group relative cursor-pointer bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 p-8 rounded-[2.5rem] hover:shadow-2xl hover:shadow-pink-500/10 transition-all duration-500 overflow-hidden"
            >
                <div className="absolute top-0 right-0 w-64 h-64 bg-pink-500/10 rounded-full blur-[60px] translate-x-1/3 -translate-y-1/3 group-hover:bg-pink-500/20 transition-all"></div>
                <div className="relative z-10">
                    <div className="w-16 h-16 bg-pink-50 dark:bg-pink-900/20 text-pink-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-sm">
                        <BookOpen size={32} />
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Pelajari Materi</h3>
                    <p className="text-slate-500 text-sm mb-8 max-w-xs">Akses rangkuman High Yield, Clinical Pearls, dan Guideline terbaru.</p>
                    <span className="inline-flex items-center gap-2 font-bold text-pink-500 group-hover:gap-3 transition-all">
                        Buka Materi <ArrowRight size={18} />
                    </span>
                </div>
            </div>

            {/* CARD 2: SOAL */}
            <div 
                onClick={() => setViewMode('latihan_type')} 
                className="group relative cursor-pointer bg-slate-900 dark:bg-black border border-slate-800 dark:border-white/10 p-8 rounded-[2.5rem] hover:shadow-2xl hover:shadow-indigo-500/20 transition-all duration-500 overflow-hidden"
            >
                <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/20 rounded-full blur-[60px] translate-x-1/3 -translate-y-1/3 group-hover:bg-indigo-500/30 transition-all"></div>
                <div className="relative z-10">
                    <div className="w-16 h-16 bg-white/10 text-white rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg backdrop-blur-md border border-white/10">
                        <Brain size={32} />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2">Latihan Soal (MCQ)</h3>
                    <p className="text-slate-400 text-sm mb-8 max-w-xs">Uji pemahaman klinis dengan ribuan soal vignette standar UKMPPD.</p>
                    <span className="inline-flex items-center gap-2 font-bold text-indigo-400 group-hover:gap-3 transition-all">
                        Pilih Mode Latihan <ArrowRight size={18} />
                    </span>
                </div>
            </div>
        </div>
      )}

      {/* --- LEVEL 3: PILIH TIPE LATIHAN (Drilling vs Arsip) --- */}
      {viewMode === 'latihan_type' && (
        <div className="grid md:grid-cols-2 gap-6 animate-in zoom-in-95 duration-300">
            
            {/* OPSI 1: DRILLING */}
            <div 
                onClick={() => { setLatihanCategory('drilling'); setViewMode('folder_list'); }} 
                className="group relative cursor-pointer bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 p-8 rounded-[2.5rem] hover:border-indigo-500 transition-all hover:shadow-xl hover:shadow-indigo-500/10 overflow-hidden"
            >
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/50 to-transparent dark:from-indigo-900/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative z-10 flex flex-col h-full justify-between">
                    <div>
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-3 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-2xl">
                                <Zap size={24} fill="currentColor" />
                            </div>
                            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 dark:bg-indigo-900/20 px-3 py-1 rounded-full">Free / Premium</span>
                        </div>
                        <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-2">Drilling Custom</h3>
                        <p className="text-slate-500 text-sm">Latihan acak, fase intensif, dan drilling harian untuk melatih kecepatan.</p>
                    </div>
                    <div className="mt-8 flex justify-end">
                        <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                            <ChevronRight size={24} />
                        </div>
                    </div>
                </div>
            </div>

            {/* OPSI 2: ARSIP UKMPPD */}
            <div 
                onClick={() => { setLatihanCategory('arsip'); setViewMode('folder_list'); }} 
                className="group relative cursor-pointer bg-gradient-to-br from-amber-50 to-white dark:from-slate-900 dark:to-black border border-amber-200 dark:border-amber-900/30 p-8 rounded-[2.5rem] hover:shadow-2xl hover:shadow-amber-500/10 transition-all overflow-hidden"
            >
                <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-[60px] translate-x-1/3 -translate-y-1/3 group-hover:bg-amber-500/20 transition-all"></div>
                <div className="relative z-10 flex flex-col h-full justify-between">
                    <div>
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-3 bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 rounded-2xl">
                                <History size={24} />
                            </div>
                            <span className="text-xs font-bold uppercase tracking-wider text-amber-700 bg-amber-100 px-3 py-1 rounded-full flex items-center gap-1">
                                <Lock size={10} /> Premium
                            </span>
                        </div>
                        <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-2">Arsip UKMPPD</h3>
                        <p className="text-slate-500 text-sm">Kumpulan soal asli (Recall) dikelompokkan berdasarkan Tahun & Batch.</p>
                    </div>
                    <div className="mt-8 flex justify-end">
                        <div className="w-12 h-12 rounded-full bg-amber-100/50 dark:bg-slate-800 flex items-center justify-center text-amber-600 group-hover:bg-amber-500 group-hover:text-white transition-all">
                            <PlayCircle size={24} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
      )}

      {/* --- LEVEL 4: LIST FOLDER (Floating List) --- */}
      {viewMode === 'folder_list' && (
          <div className="animate-in slide-in-from-bottom-8 duration-500">
              <div className="flex items-center justify-between mb-6 px-2">
                <h3 className="text-slate-800 dark:text-white font-bold text-lg flex items-center gap-2">
                    <Folder size={20} className={latihanCategory === 'arsip' ? "text-amber-500" : "text-indigo-500"} /> 
                    Folder {latihanCategory === 'arsip' ? 'Arsip' : 'Latihan'}
                </h3>
              </div>

              {loading && (
                  <div className="space-y-3">
                      {[1,2,3].map(i => <div key={i} className="h-20 bg-slate-100 dark:bg-slate-800/50 rounded-3xl animate-pulse"></div>)}
                  </div>
              )}

              {!loading && folders.length === 0 && (
                  <div className="flex flex-col items-center justify-center py-16 bg-slate-50 dark:bg-slate-900/50 rounded-[2.5rem] border border-dashed border-slate-300 dark:border-slate-700 text-center">
                      <div className="w-16 h-16 bg-slate-200 dark:bg-slate-800 rounded-full flex items-center justify-center text-slate-400 mb-4">
                          <Folder size={32} />
                      </div>
                      <p className="text-slate-500 font-medium">Belum ada folder soal.</p>
                  </div>
              )}

              <div className="grid gap-3">
                  {folders.map((folder, idx) => (
                      <div 
                        key={idx}
                        onClick={() => navigate(`/app/cbt/quiz?system=${encodeURIComponent(selectedSystem!)}&batch=${folder.name}&year=${folder.year}`)}
                        className={`group relative bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-100 dark:border-white/5 hover:border-transparent transition-all cursor-pointer flex items-center justify-between overflow-hidden
                            ${latihanCategory === 'arsip' 
                                ? 'hover:shadow-lg hover:shadow-amber-500/10' 
                                : 'hover:shadow-lg hover:shadow-indigo-500/10'}`
                        }
                      >
                          {/* Hover Gradient Overlay */}
                          <div className={`absolute inset-0 bg-gradient-to-r opacity-0 group-hover:opacity-10 transition-opacity ${latihanCategory === 'arsip' ? 'from-amber-500 to-orange-500' : 'from-indigo-500 to-purple-500'}`}></div>

                          <div className="relative z-10 flex items-center gap-5">
                              {/* Icon Box */}
                              <div className={`w-14 h-14 rounded-2xl flex flex-col items-center justify-center font-bold text-xs shadow-sm transition-transform group-hover:scale-110 
                                  ${latihanCategory === 'arsip' 
                                    ? 'bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400' 
                                    : 'bg-indigo-50 text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-400'}`
                              }>
                                  {latihanCategory === 'arsip' ? (
                                      <>
                                        <span className="text-[9px] opacity-60 uppercase tracking-widest">THN</span>
                                        <span className="text-sm">{folder.year}</span>
                                      </>
                                  ) : (
                                      <Zap size={24} fill="currentColor" />
                                  )}
                              </div>
                              
                              <div>
                                  <h4 className="font-bold text-slate-900 dark:text-white text-lg group-hover:text-indigo-600 dark:group-hover:text-amber-400 transition-colors">{folder.name}</h4>
                                  <div className="flex items-center gap-3 mt-1">
                                      <span className="text-xs text-slate-500 font-medium bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md">
                                          {folder.count} Soal
                                      </span>
                                      {folder.isPremium && (
                                          <span className="text-[10px] font-bold text-amber-600 bg-amber-50 dark:bg-amber-900/30 px-2 py-0.5 rounded-md flex items-center gap-1 border border-amber-100 dark:border-amber-800">
                                              <Lock size={8} /> PRO
                                          </span>
                                      )}
                                  </div>
                              </div>
                          </div>

                          <div className="relative z-10 w-10 h-10 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-400 group-hover:bg-white dark:group-hover:bg-slate-700 group-hover:text-slate-800 dark:group-hover:text-white transition-all shadow-sm">
                              <ChevronRight size={20} />
                          </div>
                      </div>
                  ))}
              </div>
          </div>
      )}

    </div>
  );
}