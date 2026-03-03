import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  BookOpen, Brain, ArrowRight, 
  Zap, Folder, ChevronRight, Lock, ArrowLeft, History,
  Trophy, Flame, Bookmark
} from 'lucide-react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db, isFirebaseInitialized } from '../lib/firebase';
import { SYSTEM_LIST } from '../data/osce_data'; 
import { useAuth } from '../context/AuthContext';

// Phase 1 & 2 Components
import { PageTransition, LoadingWrapper, AnimateIn } from '../components/ui/PageTransition';
import { LoadingCBT, SkeletonCard } from '../components/ui/Loading';
import { EmptyFolder, ErrorState } from '../components/ui/EmptyState';
import { useUserStats, useSystemStats } from '../hooks/useUserStats';
import { useBookmarks } from '../hooks/useBookmarks';
import { cn } from '../lib/utils';

export default function CBTCenter() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  
  // Phase 1: Centralized stats
  const { totalAnswered, accuracy, streak, systemProgress } = useUserStats();
  
  // Phase 2: Bookmarks
  const { isBookmarked, toggleBookmark, getBookmarksByType } = useBookmarks();
  const bookmarkedQuestions = getBookmarksByType('question');
  
  // State
  const [selectedSystem, setSelectedSystem] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'menu' | 'method' | 'latihan_type' | 'folder_list'>('menu');
  const [latihanCategory, setLatihanCategory] = useState<'drilling' | 'arsip' | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [folders, setFolders] = useState<{name: string, year?: string, count: number, isPremium: boolean}[]>([]);
  
  // Track if we already fetched for current view
  const [fetchedKey, setFetchedKey] = useState<string | null>(null);

  // 1. SELECT SYSTEM
  const handleSelectSystem = (sys: string) => {
    setSelectedSystem(sys);
    setViewMode('method');
  };

  // 2. FETCH FOLDERS - FIXED: No toast spam
  useEffect(() => {
    // Only fetch if in folder_list mode and have required params
    if (viewMode !== 'folder_list' || !selectedSystem || !latihanCategory) {
      return;
    }
    
    // Create unique key for this fetch
    const currentKey = `${selectedSystem}-${latihanCategory}`;
    
    // Skip if already fetched this exact combination
    if (fetchedKey === currentKey) {
      return;
    }
    
    const fetchFolders = async () => {
      setLoading(true);
      setError(null);
      
      if (!isFirebaseInitialized() || !db) {
        setError("Firebase belum siap. Periksa konfigurasi .env.local");
        setLoading(false);
        return;
      }
      
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
        setFetchedKey(currentKey); // Mark as fetched
        
      } catch (err) {
        console.error(err);
        setError("Gagal memuat data");
      } finally {
        setLoading(false);
      }
    };
    
    fetchFolders();
  }, [viewMode, selectedSystem, latihanCategory, fetchedKey]);

  // RESET FUNCTION
  const handleBack = () => {
    if (viewMode === 'folder_list') {
      setViewMode('latihan_type');
      setFetchedKey(null); // Reset fetch key
    }
    else if (viewMode === 'latihan_type') setViewMode('method');
    else if (viewMode === 'method') { 
      setSelectedSystem(null); 
      setViewMode('menu'); 
    }
  };

  // Toggle bookmark for system
  const handleToggleBookmark = (sysId: string, sysLabel: string) => {
    toggleBookmark({
      id: sysId,
      type: 'topic',
      title: sysLabel,
      subtitle: 'CBT System',
      path: `/app/cbt?system=${sysId}`,
    });
  };

  // Handle folder click
  const handleFolderClick = (folder: {name: string, year?: string, isPremium: boolean}) => {
    if (folder.isPremium && currentUser?.subscriptionStatus === 'free') {
      // Use toast from react-hot-toast for premium warning
      import('react-hot-toast').then(toast => {
        toast.default('Upgrade ke Premium untuk akses folder ini', {
          icon: '🔒',
          style: { borderRadius: '10px' }
        });
      });
      return;
    }
    
    navigate(`/app/cbt/quiz?system=${encodeURIComponent(selectedSystem!)}&batch=${folder.name}&year=${folder.year}`);
  };

  return (
    <PageTransition variant="fade">
      <div className="space-y-6 pb-24 max-w-5xl mx-auto">
        
        {/* HERO HEADER - REALTIME STATS */}
        <AnimateIn animation="slide-up" delay={0}>
          <div className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-black rounded-[2rem] p-6 overflow-hidden shadow-2xl border border-slate-700/50">
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-[80px] opacity-50"></div>
            
            <div className="relative z-10">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <div className="p-2 bg-indigo-500/20 rounded-xl text-indigo-400">
                      <Brain size={20} />
                    </div>
                    <h1 className="text-2xl font-black text-white tracking-tight">CBT Center</h1>
                  </div>
                  <p className="text-slate-400 text-xs">Bank soal & simulasi ujian komprehensif.</p>
                </div>
                
                {/* Bookmark count badge */}
                {bookmarkedQuestions.length > 0 && (
                  <button 
                    onClick={() => navigate('/app/bookmarks')}
                    className="flex items-center gap-1.5 text-[10px] font-bold text-amber-400 bg-amber-500/10 px-3 py-1.5 rounded-full border border-amber-500/20 hover:bg-amber-500/20 transition-colors"
                  >
                    <Bookmark size={12} fill="currentColor" />
                    {bookmarkedQuestions.length} Tersimpan
                  </button>
                )}
              </div>

              {/* REALTIME STATS GRID */}
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-3 text-center">
                  <h4 className="text-xl font-black text-white">{totalAnswered}</h4>
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Total Soal</p>
                </div>
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-3 text-center">
                  <h4 className="text-xl font-black text-emerald-400">{accuracy}%</h4>
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Akurasi</p>
                </div>
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-3 text-center">
                  <div className="flex items-center justify-center gap-1">
                    <Flame size={16} className="text-orange-500" fill="currentColor"/>
                    <h4 className="text-xl font-black text-white">{streak}</h4>
                  </div>
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Streak</p>
                </div>
              </div>
            </div>
          </div>
        </AnimateIn>

        {/* --- LEVEL 1: PILIH SISTEM --- */}
        {viewMode === 'menu' && (
          <AnimateIn animation="slide-up" delay={100}>
            <div className="space-y-4">
              <h3 className="text-slate-800 dark:text-white font-bold text-sm mb-3 flex items-center gap-2">
                <span className="w-1 h-4 rounded-full bg-teal-500"></span> 
                Pilih Sistem
                <span className="text-[10px] font-normal text-slate-400 ml-auto">
                  {SYSTEM_LIST.length} sistem tersedia
                </span>
              </h3>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {SYSTEM_LIST.map((sys) => {
                  const sysProg = systemProgress?.[sys.id];
                  const answered = sysProg?.answered || 0;
                  const isBookmarkedSystem = isBookmarked(sys.id, 'topic');
                  
                  return (
                    <div
                      key={sys.id}
                      className="group relative bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 h-24 rounded-2xl flex flex-col justify-between text-left transition-all hover:shadow-lg hover:shadow-indigo-500/10 hover:-translate-y-0.5 hover:border-indigo-500/50 overflow-hidden cursor-pointer"
                    >
                      {/* Bookmark indicator */}
                      {isBookmarkedSystem && (
                        <div className="absolute top-2 right-2">
                          <Bookmark size={10} className="text-amber-500" fill="currentColor" />
                        </div>
                      )}
                      
                      <div 
                        className="flex-1"
                        onClick={() => handleSelectSystem(sys.label)}
                      >
                        <div className="flex justify-between items-start">
                          <span className="text-xs font-bold text-slate-600 dark:text-slate-300 group-hover:text-indigo-600 transition-colors">
                            {sys.label}
                          </span>
                          <span className={cn(
                            "text-[9px] font-bold px-1.5 py-0.5 rounded",
                            sys.id === 'gadar' 
                              ? "text-red-500 bg-red-100 dark:bg-red-900/20"
                              : answered > 0 
                                ? "text-teal-600 bg-teal-100 dark:bg-teal-900/20"
                                : "text-slate-400 bg-slate-100 dark:bg-slate-800"
                          )}>
                            {sys.id === 'gadar' ? <Flame size={10} className="inline"/> : (answered > 0 ? `${answered}` : 'Start')}
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] text-slate-400 font-medium">
                          {sys.id.toUpperCase()}
                        </span>
                        
                        {/* Bookmark button */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleToggleBookmark(sys.id, sys.label);
                          }}
                          className={cn(
                            "p-1 rounded transition-colors",
                            isBookmarkedSystem 
                              ? "text-amber-500" 
                              : "text-slate-300 hover:text-amber-500"
                          )}
                        >
                          <Bookmark size={12} fill={isBookmarkedSystem ? "currentColor" : "none"} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </AnimateIn>
        )}

        {/* --- LEVEL 2: PILIH METODE --- */}
        {viewMode === 'method' && (
          <AnimateIn animation="slide-up" delay={50}>
            <div className="space-y-4">
              <button 
                onClick={handleBack} 
                className="flex items-center gap-2 text-[10px] font-bold text-slate-500 bg-white dark:bg-slate-900 px-3 py-1.5 rounded-full border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
              >
                <ArrowLeft size={12} /> Kembali
              </button>
              
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2 py-1 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-lg text-xs font-bold">
                  {selectedSystem}
                </span>
              </div>
              
              <div className="grid md:grid-cols-2 gap-4">
                {/* Card Materi */}
                <div 
                  onClick={() => navigate(`/app/cbt/read?system=${encodeURIComponent(selectedSystem!)}`)} 
                  className="group bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl cursor-pointer hover:shadow-md hover:border-pink-500/30 transition-all relative overflow-hidden"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-pink-50 dark:bg-pink-900/20 text-pink-500 rounded-xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                      <BookOpen size={24} />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-slate-900 dark:text-white text-sm">Pelajari Materi</h3>
                      <p className="text-slate-500 text-[10px]">High-Yield Notes</p>
                    </div>
                    <ChevronRight size={18} className="text-slate-300 ml-auto group-hover:text-pink-500 transition-colors" />
                  </div>
                </div>

                {/* Card Soal */}
                <div 
                  onClick={() => setViewMode('latihan_type')} 
                  className="group bg-slate-900 dark:bg-black border border-slate-800 p-6 rounded-2xl cursor-pointer hover:shadow-md hover:shadow-indigo-500/10 transition-all relative overflow-hidden"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white/10 text-white rounded-xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                      <Brain size={24} />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-white text-sm">Latihan Soal</h3>
                      <p className="text-slate-400 text-[10px]">Simulasi CBT</p>
                    </div>
                    <ChevronRight size={18} className="text-slate-700 ml-auto group-hover:text-indigo-400 transition-colors" />
                  </div>
                </div>
              </div>
            </div>
          </AnimateIn>
        )}

        {/* --- LEVEL 3: PILIH TIPE LATIHAN --- */}
        {viewMode === 'latihan_type' && (
          <AnimateIn animation="slide-up" delay={50}>
            <div className="space-y-4">
              <button 
                onClick={handleBack} 
                className="flex items-center gap-2 text-[10px] font-bold text-slate-500 bg-white dark:bg-slate-900 px-3 py-1.5 rounded-full border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
              >
                <ArrowLeft size={12} /> Kembali
              </button>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div 
                  onClick={() => { 
                    setLatihanCategory('drilling'); 
                    setViewMode('folder_list'); 
                  }} 
                  className="group bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl cursor-pointer hover:border-indigo-500 transition-all hover:shadow-md flex items-center gap-4"
                >
                  <div className="w-10 h-10 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 rounded-xl flex items-center justify-center shrink-0">
                    <Zap size={20} />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-sm text-slate-900 dark:text-white">Drilling Intensif</h3>
                    <p className="text-[10px] text-slate-500">Acak & berdasarkan topik.</p>
                  </div>
                  <ChevronRight size={18} className="text-slate-300 group-hover:text-indigo-500" />
                </div>

                <div 
                  onClick={() => { 
                    setLatihanCategory('arsip'); 
                    setViewMode('folder_list'); 
                  }} 
                  className="group bg-gradient-to-br from-amber-50 to-white dark:from-slate-900 dark:to-black border border-amber-200 dark:border-amber-900/30 p-5 rounded-2xl cursor-pointer hover:shadow-md transition-all flex items-center gap-4"
                >
                  <div className="w-10 h-10 bg-amber-100 dark:bg-amber-900/20 text-amber-600 rounded-xl flex items-center justify-center shrink-0">
                    <History size={20} />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-sm text-slate-900 dark:text-white">Arsip UKMPPD</h3>
                    <p className="text-[10px] text-slate-500">Soal tahun-tahun sebelumnya.</p>
                  </div>
                  <ChevronRight size={18} className="text-slate-300 group-hover:text-amber-500" />
                </div>
              </div>
            </div>
          </AnimateIn>
        )}

        {/* --- LEVEL 4: LIST FOLDER --- */}
        {viewMode === 'folder_list' && (
          <AnimateIn animation="slide-up" delay={50}>
            <div className="space-y-4">
              <button 
                onClick={handleBack} 
                className="flex items-center gap-2 text-[10px] font-bold text-slate-500 bg-white dark:bg-slate-900 px-3 py-1.5 rounded-full border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
              >
                <ArrowLeft size={12} /> Kembali
              </button>
              
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-slate-800 dark:text-white font-bold text-sm flex items-center gap-2">
                  <Folder size={16} className={latihanCategory === 'arsip' ? "text-amber-500" : "text-indigo-500"} /> 
                  Folder {latihanCategory === 'arsip' ? 'Arsip' : 'Latihan'}
                </h3>
                <span className="text-[10px] text-slate-400">
                  {folders.length} folder
                </span>
              </div>

              <LoadingWrapper 
                isLoading={loading} 
                skeleton={
                  <div className="grid gap-2">
                    {[1,2,3].map(i => (
                      <div key={i} className="h-14 bg-slate-100 dark:bg-slate-800 rounded-xl animate-pulse" />
                    ))}
                  </div>
                }
              >
                {error ? (
                  <ErrorState message={error} onRetry={handleBack} />
                ) : folders.length === 0 ? (
                  <EmptyFolder 
                    folderName={selectedSystem || undefined}
                    onUpload={() => navigate('/app/cbt')}
                  />
                ) : (
                  <div className="grid gap-2">
                    {folders.map((folder, idx) => (
                      <div 
                        key={idx} 
                        onClick={() => handleFolderClick(folder)} 
                        className="group bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-indigo-500/30 transition-all cursor-pointer flex items-center justify-between"
                      >
                        <div className="flex items-center gap-3">
                          <div className={cn(
                            "w-9 h-9 rounded-lg flex items-center justify-center font-bold text-[10px]",
                            latihanCategory === 'arsip' 
                              ? 'bg-amber-100 dark:bg-amber-900/20 text-amber-600' 
                              : 'bg-indigo-100 dark:bg-indigo-900/20 text-indigo-600'
                          )}>
                            {latihanCategory === 'arsip' ? folder.year : idx + 1}
                          </div>
                          <div>
                            <h4 className="font-bold text-sm text-slate-800 dark:text-white line-clamp-1">
                              {folder.name}
                            </h4>
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] text-slate-500">{folder.count} Soal</span>
                              {folder.isPremium && (
                                <span className="text-[9px] text-amber-500 font-bold">PREMIUM</span>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {folder.isPremium && currentUser?.subscriptionStatus === 'free' && (
                            <Lock size={12} className="text-amber-500" />
                          )}
                          <ChevronRight size={16} className="text-slate-300 group-hover:text-indigo-500" />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </LoadingWrapper>
            </div>
          </AnimateIn>
        )}
      </div>
    </PageTransition>
  );
}