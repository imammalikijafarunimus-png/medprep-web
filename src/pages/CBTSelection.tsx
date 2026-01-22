import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  BookOpen, Brain, ArrowRight, LayoutGrid, 
  Zap, Folder, ChevronRight, Lock, ArrowLeft, Layers, History 
} from 'lucide-react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { SYSTEM_LIST } from '../data/osce_data'; 

export default function CBTCenter() {
  const navigate = useNavigate();
  
  // STATE
  const [selectedSystem, setSelectedSystem] = useState<string | null>(null);
  // View Mode: 'menu' (pilih sistem), 'method' (materi/soal), 'latihan_type' (acak/asli), 'folder_list'
  const [viewMode, setViewMode] = useState<'menu' | 'method' | 'latihan_type' | 'folder_list'>('menu');
  const [latihanCategory, setLatihanCategory] = useState<'drilling' | 'arsip' | null>(null);
  
  // DATA
  const [loading, setLoading] = useState(false);
  const [folders, setFolders] = useState<{name: string, year?: string, count: number, isPremium: boolean}[]>([]);

  // 1. SELECT SYSTEM
  const handleSelectSystem = (sys: string) => {
    setSelectedSystem(sys);
    setViewMode('method'); // Lanjut pilih Materi vs Soal
  };

  // 2. FETCH FOLDERS (Dipanggil saat masuk list folder)
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
                    
                    // FILTER LOGIC:
                    // Jika kategori 'arsip', hanya ambil yg punya Tahun.
                    // Jika kategori 'drilling', hanya ambil yg TIDAK punya Tahun.
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

                // Sort: Arsip berdasarkan tahun (desc), Drilling berdasarkan nama
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
    <div className="space-y-8 animate-in fade-in duration-500 pb-24 max-w-5xl mx-auto p-6">
      
      {/* HEADER DINAMIS */}
      <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 p-40 bg-blue-500/10 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2"></div>
        <div className="relative z-10">
            <h1 className="text-3xl font-black text-white mb-2">
                {selectedSystem ? selectedSystem : 'CBT Center'}
            </h1>
            <p className="text-slate-400 text-sm max-w-xl">
               {selectedSystem ? `Modul Pembelajaran & Bank Soal ${selectedSystem}` : 'Pilih sistem organ untuk memulai belajar.'}
            </p>
        </div>
      </div>

      {/* TOMBOL BACK */}
      {selectedSystem && (
          <button onClick={handleBack} className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-indigo-600 transition-colors">
              <ArrowLeft size={16} /> Kembali
          </button>
      )}

      {/* --- LEVEL 1: PILIH SISTEM --- */}
      {viewMode === 'menu' && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {SYSTEM_LIST.map((sys) => (
              <button
                key={sys.id}
                onClick={() => handleSelectSystem(sys.label)}
                className="p-3 rounded-xl text-xs md:text-sm font-bold transition-all border flex items-center justify-center text-center h-16 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-indigo-500 hover:text-indigo-500 hover:shadow-md"
              >
                {sys.label}
              </button>
          ))}
        </div>
      )}

      {/* --- LEVEL 2: PILIH METODE (MATERI vs SOAL) --- */}
      {viewMode === 'method' && (
        <div className="grid md:grid-cols-2 gap-6">
            <div onClick={() => navigate(`/app/cbt/read?system=${encodeURIComponent(selectedSystem!)}`)} className="group bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-pink-500 p-6 rounded-3xl cursor-pointer transition-all hover:-translate-y-1 shadow-sm">
                <div className="w-12 h-12 bg-pink-50 text-pink-500 rounded-xl flex items-center justify-center mb-4"><BookOpen size={24} /></div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Pelajari Materi</h3>
                <p className="text-slate-500 text-sm">Rangkuman High Yield & Insight.</p>
            </div>

            <div onClick={() => setViewMode('latihan_type')} className="group bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-500 p-6 rounded-3xl cursor-pointer transition-all hover:-translate-y-1 shadow-sm">
                <div className="w-12 h-12 bg-indigo-50 text-indigo-500 rounded-xl flex items-center justify-center mb-4"><Brain size={24} /></div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Latihan Soal (MCQ)</h3>
                <p className="text-slate-500 text-sm">Uji pemahaman dengan soal vignette.</p>
            </div>
        </div>
      )}

      {/* --- LEVEL 3: PILIH TIPE LATIHAN (DRILLING vs ARSIP) --- */}
      {viewMode === 'latihan_type' && (
        <div className="grid md:grid-cols-2 gap-6">
            {/* Opsi Drilling (Folder Custom) */}
            <div onClick={() => { setLatihanCategory('drilling'); setViewMode('folder_list'); }} className="relative bg-gradient-to-br from-indigo-500 to-purple-600 p-1 rounded-3xl cursor-pointer hover:scale-[1.01] transition-transform">
                <div className="bg-white dark:bg-slate-900 p-6 rounded-[22px] h-full relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-16 bg-indigo-500/10 rounded-full blur-2xl translate-x-1/3 -translate-y-1/3"></div>
                    <div className="flex items-center gap-3 mb-4 text-indigo-600 font-bold"><Zap size={24} /> MODE LATIHAN</div>
                    <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-2">Drilling Folder</h3>
                    <p className="text-slate-500 text-sm mb-4">Kumpulan soal latihan per topik (Fase Intensif, Harian, dll).</p>
                    <span className="text-indigo-600 font-bold text-sm flex items-center gap-2">Buka Folder <ArrowRight size={16}/></span>
                </div>
            </div>

            {/* Opsi Arsip (Folder Tahun) */}
            <div onClick={() => { setLatihanCategory('arsip'); setViewMode('folder_list'); }} className="relative bg-gradient-to-br from-amber-400 to-orange-500 p-1 rounded-3xl cursor-pointer hover:scale-[1.01] transition-transform">
                <div className="bg-white dark:bg-slate-900 p-6 rounded-[22px] h-full relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-16 bg-amber-500/10 rounded-full blur-2xl translate-x-1/3 -translate-y-1/3"></div>
                    <div className="flex items-center gap-3 mb-4 text-amber-600 font-bold"><History size={24} /> MODE ARSIP</div>
                    <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-2">Bank Soal UKMPPD</h3>
                    <p className="text-slate-500 text-sm mb-4">Soal asli dikelompokkan berdasarkan Tahun & Batch ujian.</p>
                    <span className="text-amber-600 font-bold text-sm flex items-center gap-2">Pilih Tahun <ArrowRight size={16}/></span>
                </div>
            </div>
        </div>
      )}

      {/* --- LEVEL 4: LIST FOLDER --- */}
      {viewMode === 'folder_list' && (
          <div>
              <h3 className="text-slate-900 dark:text-white font-bold text-lg mb-6 flex items-center gap-2">
                  <Folder size={20} className={latihanCategory === 'arsip' ? "text-amber-500" : "text-indigo-500"} /> 
                  Pilih Folder {latihanCategory === 'arsip' ? 'Arsip' : 'Latihan'}
              </h3>

              {loading && <div className="text-center py-12 text-slate-400 animate-pulse">Memuat folder...</div>}

              {!loading && folders.length === 0 && (
                  <div className="text-center py-12 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-3xl">
                      <p className="text-slate-400">Belum ada folder soal di kategori ini.</p>
                  </div>
              )}

              <div className="space-y-3">
                  {folders.map((folder, idx) => (
                      <div 
                        key={idx}
                        onClick={() => navigate(`/app/cbt/quiz?system=${encodeURIComponent(selectedSystem!)}&batch=${folder.name}&year=${folder.year}`)}
                        className={`group bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 transition-all cursor-pointer flex items-center justify-between ${latihanCategory === 'arsip' ? 'hover:border-amber-500' : 'hover:border-indigo-500'}`}
                      >
                          <div className="flex items-center gap-4">
                              <div className={`w-12 h-12 rounded-xl flex flex-col items-center justify-center font-bold text-xs shadow-sm transition-colors ${latihanCategory === 'arsip' ? 'bg-blue-50 text-blue-600 group-hover:bg-amber-50 group-hover:text-amber-600' : 'bg-indigo-50 text-indigo-600 group-hover:bg-indigo-100'}`}>
                                  {latihanCategory === 'arsip' ? (
                                      <>
                                        <span className="text-[10px] opacity-70">THN</span>
                                        {folder.year}
                                      </>
                                  ) : (
                                      <Zap size={20} />
                                  )}
                              </div>
                              <div>
                                  <h4 className="font-bold text-slate-900 dark:text-white text-lg">{folder.name}</h4>
                                  <p className="text-slate-500 text-sm flex items-center gap-2">
                                      {folder.count} Soal 
                                      {folder.isPremium && <span className="bg-amber-100 text-amber-700 text-[10px] px-1.5 rounded border border-amber-200 flex items-center gap-1"><Lock size={8}/> PRO</span>}
                                  </p>
                              </div>
                          </div>
                          <div className="w-10 h-10 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-400 group-hover:bg-slate-200 dark:group-hover:bg-slate-700 transition-all">
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