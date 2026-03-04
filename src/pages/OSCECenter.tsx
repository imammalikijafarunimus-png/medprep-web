import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Brain, Droplet, Wind, Heart, Utensils, Baby, Zap, Shield, 
  Activity, Sun, Smile, Eye, CheckCircle, ChevronRight, Mic, 
  BookOpen, Search, Flame, Stethoscope, 
  ChevronDown, Sparkles, Siren, BookmarkCheck, Info,
  Thermometer, Pill, FileText, ClipboardList, PenTool,
  BarChart2, Library, FolderOpen, Layers, Trophy, Play, RotateCcw, Award,
  Bookmark
} from 'lucide-react';
import { STATION_DATA, SYSTEM_LIST, CaseStudy } from '../data/osce_data';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

// Phase 1 & 2 Components
import { PageTransition, LoadingWrapper, AnimateIn } from '../components/ui/PageTransition';
import { SkeletonCard } from '../components/ui/Loading';
import { EmptyFolder, EmptyQuestions, ErrorState } from '../components/ui/EmptyState';
import { useUserStats } from '../hooks/useUserStats';
import { useBookmarks } from '../hooks/useBookmarks';
import { cn } from '../lib/utils';

// --- TYPE DEFINITIONS ---
type ViewState = 'HOME' | 'MODE_SELECT' | 'CHECKLIST_TOPIC_SELECT' | 'CHECKLIST_RUN' | 'CASE_LIBRARY' | 'CASE_DETAIL';

// --- HELPER: CUSTOM HOOK FOR LOCAL STORAGE ---
function useLocalStorageState(key: string, initialValue: any) {
  const [state, setState] = useState(() => {
    try {
      const stored = localStorage.getItem(key);
      return stored ? JSON.parse(stored) : initialValue;
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(state));
  }, [key, state]);

  return [state, setState];
}

export default function OSCEStation() {
  // --- STATE MANAGEMENT ---
  const [view, setView] = useState<ViewState>('HOME');
  const [activeStationId, setActiveStationId] = useState<string | null>(null);
  const [activeCase, setActiveCase] = useState<CaseStudy | null>(null);
  const [activeSectionIdx, setActiveSectionIdx] = useState<number | null>(null);
  
  // Interaction States
  const [searchQuery, setSearchQuery] = useState('');
  const [scriptMode, setScriptMode] = useState(true);
  const [completedCases, setCompletedCases] = useLocalStorageState('medprep_osce_completed_cases', []);
  const [checkedItems, setCheckedItems] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  
  // --- NAVIGASI ---
  const navigate = useNavigate();

  // --- AUTH CONTEXT ---
  const { currentUser } = useAuth();
  
  // Phase 1: Stats from hook
  const { totalAnswered, accuracy, streak } = useUserStats();
  
  // Phase 2: Bookmarks
  const { isBookmarked, toggleBookmark, getBookmarksByType } = useBookmarks();
  const bookmarkedCases = getBookmarksByType('case');

  // --- COMPUTED VALUES ---
  const currentStation = activeStationId && STATION_DATA[activeStationId] 
    ? STATION_DATA[activeStationId] 
    : { id: '', title: 'Stase', description: '', icon: 'activity', sections: [], cases: [] };

  const isCaseCompleted = activeCase ? completedCases.includes(activeCase.id) : false;
  
  const stationProgress = useMemo(() => {
    if (!activeStationId) return 0;
    const total = currentStation.cases?.length || 0;
    if (total === 0) return 0;
    const done = currentStation.cases?.filter((c: any) => completedCases.includes(c.id)).length || 0;
    return Math.round((done / total) * 100);
  }, [activeStationId, completedCases, currentStation.cases]);

  // Total OSCE progress
  const totalOSCECases = useMemo(() => {
    return SYSTEM_LIST.reduce((acc, sys) => {
      const stationData = STATION_DATA[sys.id];
      return acc + (stationData?.cases?.length || 0);
    }, 0);
  }, []);

  // --- HANDLERS ---
  const toggleCaseCompletion = () => {
    if (!activeCase) return;
    const newCompleted = isCaseCompleted 
      ? completedCases.filter((id: string) => id !== activeCase.id)
      : [...completedCases, activeCase.id];
    
    setCompletedCases(newCompleted);
    
    if (!isCaseCompleted) {
      toast.success("Kasus dikuasai!", { 
        icon: '🏆',
        style: { borderRadius: '12px', background: '#1e293b', color: '#fff', fontWeight: 'bold' } 
      });
    }
  };

  const handleCheckItem = (itemId: string) => {
    setCheckedItems(prev => 
      prev.includes(itemId) ? prev.filter(id => id !== itemId) : [...prev, itemId]
    );
  };

  const resetChecklist = () => {
    setCheckedItems([]);
    toast("Simulasi direset", { icon: '🔄', duration: 1500 });
  };

  // Toggle bookmark for station/case
  const handleToggleBookmark = (id: string, type: 'station' | 'case', title: string, path: string) => {
    toggleBookmark({
      id,
      type: type === 'station' ? 'topic' : 'case',
      title,
      subtitle: type === 'station' ? 'OSCE Station' : 'OSCE Case',
      path,
    });
    
    const isNowBookmarked = !isBookmarked(id, type === 'station' ? 'topic' : 'case');
    toast.success(
      isNowBookmarked ? 'Bookmark Ditambahkan' : 'Bookmark Dihapus',
      { icon: isNowBookmarked ? '📌' : '🗑️' }
    );
  };

  const getIcon = (name: string, size = 24) => {
    const icons: any = { brain: Brain, droplet: Droplet, wind: Wind, heart: Heart, utensils: Utensils, baby: Baby, zap: Zap, shield: Shield, activity: Activity, sun: Sun, smile: Smile, eye: Eye, siren: Siren };
    const Icon = icons[name] || Activity;
    return <Icon size={size} />;
  };

  // --- RENDER SUB-COMPONENTS ---

  const InteractiveChecklist = ({ section, sectionIdx }: { section: any, sectionIdx: number }) => {
    const totalItems = section.items?.length || 0;
    const doneItems = checkedItems.length;
    const progress = totalItems > 0 ? (doneItems / totalItems) * 100 : 0;

    return (
      <div className="space-y-4">
        {/* Progress Bar Header */}
        <div className="sticky top-0 z-10 py-3 bg-slate-50/80 dark:bg-slate-950/80 backdrop-blur-lg -mx-4 px-4 mb-2 border-b border-slate-200 dark:border-slate-800">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
              Progress Tindakan
            </span>
            <span className="text-sm font-black text-teal-600 dark:text-teal-400">
              {doneItems} / {totalItems}
            </span>
          </div>
          <div className="h-2 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-teal-500 to-emerald-500 transition-all duration-500 ease-out rounded-full"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Items List */}
        <div className="space-y-3">
          {section.items?.map((item: any, idx: number) => {
            const itemId = `${sectionIdx}-${idx}`;
            const isChecked = checkedItems.includes(itemId);
            const isCritical = item.isCritical;

            return (
              <div 
                key={idx} 
                onClick={() => handleCheckItem(itemId)}
                className={cn(
                  "group relative p-4 rounded-2xl cursor-pointer transition-all duration-300 border",
                  isChecked 
                    ? 'bg-teal-50 dark:bg-teal-900/20 border-teal-500/30 shadow-sm' 
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-teal-400 hover:shadow-md'
                )}
              >
                <div className="flex gap-4 items-start">
                  <div className={cn(
                    "mt-1 shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-300",
                    isChecked 
                      ? 'bg-teal-500 border-teal-500 scale-100' 
                      : cn(
                          "scale-90 group-hover:scale-100",
                          isCritical ? "border-red-400" : "border-slate-300 dark:border-slate-600"
                        )
                  )}>
                    {isChecked && <CheckCircle size={14} className="text-white" />}
                    {!isChecked && isCritical && <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className={cn(
                        "font-bold text-sm leading-tight transition-all",
                        isChecked ? 'text-slate-400 line-through' : 'text-slate-800 dark:text-slate-100'
                      )}>
                        {item.label}
                      </span>
                      {isCritical && !isChecked && (
                        <span className="text-[9px] bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-400 px-2 py-0.5 rounded-full font-black tracking-wider animate-pulse">
                          KRITIS
                        </span>
                      )}
                    </div>
                    
                    {!isChecked && item.description && (
                      <p className="text-xs text-slate-500 dark:text-slate-400 leading-snug mb-3">{item.description}</p>
                    )}

                    {scriptMode && !isChecked && (
                      <div className="mt-2 space-y-2">
                        {item.script && (
                          <div className="bg-slate-100 dark:bg-slate-800/50 p-3 rounded-xl text-xs italic text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 flex gap-3 items-start">
                            <Mic size={14} className="shrink-0 mt-0.5 text-teal-500" /> 
                            <span>"{item.script}"</span>
                          </div>
                        )}
                        {item.insight && (
                          <div className="bg-amber-50 dark:bg-amber-900/10 p-3 rounded-xl text-xs text-amber-700 dark:text-amber-400 flex gap-3 border border-amber-100 dark:border-amber-800/30 items-start">
                            <Sparkles size={14} className="shrink-0 mt-0.5 text-amber-500" /> 
                            <span className="font-medium">{item.insight}</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // ==========================================
  // VIEWS RENDER
  // ==========================================

  // VIEW 1: HOME
  if (view === 'HOME') {
    return (
      <PageTransition variant="fade">
        <div className="space-y-6 pb-24 max-w-7xl mx-auto">
          
          {/* Hero Header with Stats */}
          <AnimateIn animation="slide-up" delay={0}>
            <div className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-black rounded-[2.5rem] p-6 md:p-8 overflow-hidden shadow-2xl border border-slate-700/50">
              <div className="absolute top-0 right-0 w-80 h-80 bg-teal-500/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2"></div>
              <div className="relative z-10">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-gradient-to-br from-teal-400 to-teal-600 rounded-2xl text-white shadow-lg shadow-teal-500/30">
                      <Stethoscope size={28} />
                    </div>
                    <div>
                      <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight">OSCE Station</h1>
                      <p className="text-slate-400 text-xs font-medium">Clinical Skills Simulator</p>
                    </div>
                  </div>
                  
                  {/* Bookmark Badge */}
                  {bookmarkedCases.length > 0 && (
                    <button 
                      onClick={() => navigate('/app/bookmarks')}
                      className="flex items-center gap-1.5 text-[10px] font-bold text-amber-400 bg-amber-500/10 px-3 py-1.5 rounded-full border border-amber-500/20 hover:bg-amber-500/20 transition-colors"
                    >
                      <Bookmark size={12} fill="currentColor" />
                      {bookmarkedCases.length} Tersimpan
                    </button>
                  )}
                </div>
                
                {/* Stats Grid */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-3 text-center">
                    <h4 className="text-xl font-black text-white">{completedCases.length}</h4>
                    <p className="text-[9px] text-slate-400 uppercase font-bold">Kasus Selesai</p>
                  </div>
                  <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-3 text-center">
                    <h4 className="text-xl font-black text-white">{totalOSCECases}</h4>
                    <p className="text-[9px] text-slate-400 uppercase font-bold">Total Kasus</p>
                  </div>
                  <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-3 text-center">
                    <div className="flex items-center justify-center gap-1">
                      <Flame size={14} className="text-orange-500" fill="currentColor" />
                      <h4 className="text-xl font-black text-white">{streak}</h4>
                    </div>
                    <p className="text-[9px] text-slate-400 uppercase font-bold">Streak</p>
                  </div>
                </div>
              </div>
            </div>
          </AnimateIn>

          {/* Station List */}
          <AnimateIn animation="slide-up" delay={100}>
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-slate-800 dark:text-white font-bold text-sm flex items-center gap-2 px-1">
                  <span className="w-1 h-4 rounded-full bg-teal-500"></span> 
                  Pilih Stase Klinis
                  <span className="text-[10px] font-normal text-slate-400 ml-auto">
                    {SYSTEM_LIST.length} stase
                  </span>
                </h3>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {SYSTEM_LIST.map((sys, idx) => {
                  const stationData = STATION_DATA[sys.id];
                  const totalCases = stationData?.cases?.length || 0;
                  const doneCases = stationData?.cases?.filter((c: any) => completedCases.includes(c.id)).length || 0;
                  const percent = totalCases > 0 ? Math.round((doneCases/totalCases)*100) : 0;
                  const isStationBookmarked = isBookmarked(sys.id, 'topic');

                  return (
                    <div
                      key={sys.id}
                      className="group relative bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 h-32 rounded-2xl flex flex-col justify-between text-left transition-all duration-300 hover:shadow-xl hover:shadow-teal-500/10 hover:-translate-y-1 hover:border-teal-500/50 overflow-hidden cursor-pointer"
                    >
                      {/* Bookmark indicator */}
                      {isStationBookmarked && (
                        <div className="absolute top-2 right-2 z-20">
                          <Bookmark size={10} className="text-amber-500" fill="currentColor" />
                        </div>
                      )}
                      
                      <div className="absolute inset-0 bg-gradient-to-br from-teal-50/50 to-transparent dark:from-teal-900/10 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl"></div>
                      
                      <div 
                        className="relative z-10 flex justify-between items-start flex-1"
                        onClick={() => { setActiveStationId(sys.id); setView('MODE_SELECT'); }}
                      >
                        <div className={cn(
                          "p-2 rounded-xl transition-colors",
                          sys.id === 'gadar' 
                            ? 'bg-red-50 dark:bg-red-900/20 text-red-500' 
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-500 group-hover:bg-teal-500 group-hover:text-white'
                        )}>
                          {getIcon(sys.icon, 18)}
                        </div>
                        {percent > 0 && (
                          <div className="text-[9px] font-black text-teal-600 bg-teal-50 dark:bg-teal-900/20 px-2 py-1 rounded-full border border-teal-100 dark:border-teal-800">
                            {percent}%
                          </div>
                        )}
                      </div>
                      
                      <div className="relative z-10 flex items-center justify-between">
                        <div 
                          className="flex-1"
                          onClick={() => { setActiveStationId(sys.id); setView('MODE_SELECT'); }}
                        >
                          <h3 className={cn(
                            "font-bold text-xs mb-0.5 transition-colors",
                            sys.id === 'gadar' 
                              ? 'text-red-700 dark:text-red-400' 
                              : 'text-slate-700 dark:text-slate-200 group-hover:text-teal-700 dark:group-hover:text-teal-400'
                          )}>
                            {sys.label}
                          </h3>
                          <p className="text-[10px] text-slate-400">{totalCases} Kasus</p>
                        </div>
                        
                        {/* Bookmark button */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleToggleBookmark(sys.id, 'station', sys.label, `/app/osce?station=${sys.id}`);
                          }}
                          className={cn(
                            "p-1.5 rounded-lg transition-colors",
                            isStationBookmarked 
                              ? "text-amber-500" 
                              : "text-slate-300 hover:text-amber-500"
                          )}
                        >
                          <Bookmark size={14} fill={isStationBookmarked ? "currentColor" : "none"} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </AnimateIn>

          {/* Quick Access Tools */}
          <AnimateIn animation="slide-up" delay={200}>
            <div className="grid md:grid-cols-3 gap-4">
              {[
                { icon: BarChart2, title: "Analisis Tren", desc: "Statistik kasus 10 tahun terakhir", color: 'indigo', path: '/app/trends' },
                { icon: FolderOpen, title: "Rekap Batch", desc: "Kasus sering muncul UKMPPD", color: 'slate', path: '#' },
                { icon: Award, title: "Leaderboard", desc: "Top performer minggu ini", color: 'amber', path: '#' }
              ].map((item, i) => (
                <div 
                  key={i} 
                  onClick={() => item.path !== '#' && navigate(item.path)}
                  className="group bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center gap-4 hover:border-indigo-500/50 hover:shadow-lg cursor-pointer transition-all"
                >
                  <div className={cn(
                    "w-12 h-12 rounded-xl flex items-center justify-center",
                    item.color === 'indigo' && "bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600",
                    item.color === 'slate' && "bg-slate-100 dark:bg-slate-800 text-slate-600",
                    item.color === 'amber' && "bg-amber-50 dark:bg-amber-900/20 text-amber-600"
                  )}>
                    <item.icon size={22} />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-slate-800 dark:text-white">{item.title}</h4>
                    <p className="text-[10px] text-slate-500">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </AnimateIn>
        </div>
      </PageTransition>
    );
  }

  // VIEW 2: MODE SELECT
  if (view === 'MODE_SELECT') {
    return (
      <PageTransition variant="slide">
        <div className="px-4 pb-24 max-w-4xl mx-auto pt-4">
          <AnimateIn animation="fade" delay={0}>
            <button 
              onClick={() => setView('HOME')} 
              className="mb-6 flex items-center gap-2 text-[10px] font-bold text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors bg-white dark:bg-slate-900 px-3 py-1.5 rounded-full border border-slate-200 dark:border-slate-800"
            >
              <ArrowLeft size={12} /> Kembali
            </button>
          </AnimateIn>

          <AnimateIn animation="slide-up" delay={50}>
            <div className="text-center mb-10">
              <div className="inline-flex p-4 rounded-[2rem] bg-gradient-to-br from-teal-500 to-emerald-600 text-white mb-5 shadow-2xl shadow-teal-500/20">
                {getIcon(currentStation.icon, 36)}
              </div>
              <h1 className="text-2xl font-black text-slate-900 dark:text-white mb-2 tracking-tight">{currentStation.title}</h1>
              <p className="text-slate-500 dark:text-slate-400 max-w-sm mx-auto text-sm">{currentStation.description}</p>
              
              {stationProgress > 0 && (
                <div className="mt-5 max-w-xs mx-auto">
                  <div className="flex justify-between text-xs font-bold text-slate-500 mb-1">
                    <span>Progress Stase</span>
                    <span>{stationProgress}%</span>
                  </div>
                  <div className="h-2 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-teal-500 rounded-full transition-all duration-500" style={{ width: `${stationProgress}%` }} />
                  </div>
                </div>
              )}
            </div>
          </AnimateIn>

          <div className="grid md:grid-cols-2 gap-4">
            <AnimateIn animation="slide-up" delay={100}>
              <div 
                onClick={() => setView('CHECKLIST_TOPIC_SELECT')} 
                className="group relative bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl cursor-pointer transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-teal-500/10 overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-teal-500/5 rounded-full blur-3xl group-hover:bg-teal-500/10 transition-all"></div>
                <div className="relative z-10 flex flex-col items-center text-center">
                  <div className="w-14 h-14 bg-teal-50 dark:bg-teal-900/20 text-teal-600 rounded-2xl flex items-center justify-center mb-4 shadow-sm group-hover:bg-teal-500 group-hover:text-white transition-colors">
                    <Play size={24} />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Simulasi Skill</h3>
                  <p className="text-slate-500 text-xs mb-4 leading-relaxed">Latih keterampilan prosedural dengan panduan interaktif.</p>
                  <span className="text-teal-600 font-bold text-xs flex items-center gap-2 group-hover:gap-3 transition-all">Mulai Simulasi <ChevronRight size={14} /></span>
                </div>
              </div>
            </AnimateIn>

            <AnimateIn animation="slide-up" delay={150}>
              <div 
                onClick={() => setView('CASE_LIBRARY')} 
                className="group relative bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl cursor-pointer transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-orange-500/10 overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/5 rounded-full blur-3xl group-hover:bg-orange-500/10 transition-all"></div>
                <div className="relative z-10 flex flex-col items-center text-center">
                  <div className="w-14 h-14 bg-orange-50 dark:bg-orange-900/20 text-orange-600 rounded-2xl flex items-center justify-center mb-4 shadow-sm group-hover:bg-orange-500 group-hover:text-white transition-colors">
                    <BookOpen size={24} />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Bedah Kasus</h3>
                  <p className="text-slate-500 text-xs mb-4 leading-relaxed">Pelajari alur diagnosis dan tatalaksana kasus tersering.</p>
                  <span className="text-orange-600 font-bold text-xs flex items-center gap-2 group-hover:gap-3 transition-all">Buka Library <ChevronRight size={14} /></span>
                </div>
              </div>
            </AnimateIn>
          </div>
        </div>
      </PageTransition>
    );
  }

  // VIEW 3: CHECKLIST TOPIC SELECT
  if (view === 'CHECKLIST_TOPIC_SELECT') {
    return (
      <PageTransition variant="slide">
        <div className="px-4 pb-24 max-w-3xl mx-auto pt-4">
          <AnimateIn animation="fade" delay={0}>
            <button 
              onClick={() => setView('MODE_SELECT')} 
              className="mb-6 flex items-center gap-2 text-[10px] font-bold text-slate-500 bg-white dark:bg-slate-900 px-3 py-1.5 rounded-full border border-slate-200 dark:border-slate-800"
            >
              <ArrowLeft size={12} /> Kembali
            </button>
          </AnimateIn>
          
          <AnimateIn animation="slide-up" delay={50}>
            <div className="mb-8">
              <h1 className="text-xl font-black text-slate-900 dark:text-white mb-1">Pilih Prosedur</h1>
              <p className="text-slate-500 text-sm">Daftar tindakan klinis di stase {currentStation.title}</p>
            </div>
          </AnimateIn>

          <AnimateIn animation="slide-up" delay={100}>
            <LoadingWrapper 
              isLoading={loading} 
              skeleton={<div className="space-y-3">{[1,2,3].map(i => <SkeletonCard key={i} />)}</div>}
            >
              {currentStation.sections.length === 0 ? (
                <EmptyQuestions onSelectOther={() => setView('MODE_SELECT')} />
              ) : (
                <div className="grid gap-3">
                  {currentStation.sections.map((section, idx) => (
                    <div 
                      key={idx}
                      onClick={() => { setActiveSectionIdx(idx); setCheckedItems([]); setView('CHECKLIST_RUN'); }}
                      className="group bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl cursor-pointer hover:border-teal-500/50 hover:shadow-md transition-all flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-slate-100 dark:bg-slate-800 rounded-xl flex items-center justify-center font-bold text-slate-500 group-hover:bg-teal-500 group-hover:text-white transition-colors text-sm">
                          {idx + 1}
                        </div>
                        <div>
                          <h3 className="font-bold text-slate-800 dark:text-white group-hover:text-teal-600 transition-colors">{section.title}</h3>
                          <p className="text-xs text-slate-400">{('items' in section ? (section as any).items?.length : 0) || 0} Langkah</p>
                        </div>
                      </div>
                      <ChevronRight size={18} className="text-slate-300 group-hover:text-teal-500" />
                    </div>
                  ))}
                </div>
              )}
            </LoadingWrapper>
          </AnimateIn>
        </div>
      </PageTransition>
    );
  }

  // VIEW 4: CHECKLIST RUN
  if (view === 'CHECKLIST_RUN' && activeSectionIdx !== null) {
    const activeSectionData = currentStation.sections[activeSectionIdx];
    return (
      <PageTransition variant="fade">
        <div className="h-full flex flex-col bg-slate-50 dark:bg-slate-950">
          <div className="px-4 pt-4 pb-2 sticky top-0 z-20 bg-slate-50/95 dark:bg-slate-950/95 backdrop-blur-lg border-b border-slate-100 dark:border-slate-800">
            <div className="flex justify-between items-center mb-2">
              <button 
                onClick={() => setView('CHECKLIST_TOPIC_SELECT')} 
                className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
              >
                <ArrowLeft size={20} className="text-slate-600"/>
              </button>
              <div className="flex gap-2">
                <button 
                  onClick={resetChecklist} 
                  className="p-2 bg-slate-100 dark:bg-slate-800 rounded-full text-slate-500 hover:text-red-500 transition-colors"
                >
                  <RotateCcw size={18}/>
                </button>
                <button 
                  onClick={() => setScriptMode(!scriptMode)} 
                  className={cn(
                    "px-3 py-2 rounded-full text-xs font-bold border flex items-center gap-2 transition-all",
                    scriptMode 
                      ? 'bg-teal-500 text-white border-teal-500 shadow-md' 
                      : 'bg-white dark:bg-slate-900 border-slate-200 text-slate-500'
                  )}
                >
                  <Mic size={14} /> Script
                </button>
              </div>
            </div>
            <h2 className="text-center font-bold text-slate-800 dark:text-white text-sm">{activeSectionData.title}</h2>
          </div>

          <div className="flex-1 overflow-y-auto p-4 md:p-6 custom-scrollbar pb-32 max-w-3xl mx-auto w-full">
            <InteractiveChecklist section={activeSectionData} sectionIdx={activeSectionIdx} />
            
            <div className="mt-12 text-center">
              <button 
                onClick={() => setView('CHECKLIST_TOPIC_SELECT')} 
                className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-8 py-3 rounded-2xl font-bold shadow-xl hover:scale-105 transition-all text-sm"
              >
                Selesai Latihan
              </button>
            </div>
          </div>
        </div>
      </PageTransition>
    );
  }

  // VIEW 5: CASE LIBRARY
  if (view === 'CASE_LIBRARY') {
    const cases = currentStation.cases || [];
    const filteredCases = cases.filter((c: any) => c.title.toLowerCase().includes(searchQuery.toLowerCase()));

    return (
      <PageTransition variant="slide">
        <div className="h-full flex flex-col bg-slate-50 dark:bg-slate-950">
          <div className="px-4 pt-4 sticky top-0 z-20 pb-4 bg-slate-50/95 dark:bg-slate-950/95 backdrop-blur-lg border-b border-slate-100 dark:border-slate-800">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center gap-3 mb-4">
                <button 
                  onClick={() => setView('MODE_SELECT')} 
                  className="p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-full hover:bg-slate-100 transition-colors"
                >
                  <ArrowLeft size={18} className="text-slate-600"/>
                </button>
                <h1 className="text-lg font-black text-slate-900 dark:text-white">Perpustakaan Kasus</h1>
              </div>
              
              <div className="relative group">
                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                  <Search size={20} className="text-slate-400 group-focus-within:text-teal-500 transition-colors" />
                </div>
                <input 
                  type="text" 
                  placeholder="Cari nama penyakit..." 
                  className="w-full pl-12 pr-4 py-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all shadow-sm text-sm" 
                  value={searchQuery} 
                  onChange={(e) => setSearchQuery(e.target.value)} 
                />
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-4 custom-scrollbar pb-24">
            <div className="max-w-4xl mx-auto space-y-3 pt-2">
              <LoadingWrapper 
                isLoading={loading} 
                skeleton={<div className="space-y-3">{[1,2,3].map(i => <SkeletonCard key={i} />)}</div>}
              >
                {filteredCases.length === 0 ? (
                  <EmptyFolder folderName={currentStation.title} />
                ) : (
                  filteredCases.map((cs: any) => {
                    const isDone = completedCases.includes(cs.id);
                    const isCaseBookmarked = isBookmarked(cs.id, 'case');
                    
                    return (
                      <div 
                        key={cs.id} 
                        className="group bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl hover:border-orange-500/50 hover:shadow-xl hover:shadow-orange-500/5 transition-all"
                      >
                        <div 
                          className="flex items-center gap-3 flex-1"
                          onClick={() => { setActiveCase(cs); setView('CASE_DETAIL'); }}
                        >
                          <div className={cn(
                            "w-3 h-3 rounded-full shrink-0",
                            isDone ? 'bg-teal-500' : 'bg-slate-200 dark:bg-slate-700'
                          )}></div>

                          <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-start mb-1 gap-2">
                              <h3 className="font-bold text-slate-800 dark:text-slate-200 group-hover:text-orange-600 transition-colors truncate">
                                {cs.title}
                              </h3>
                              <div className="flex items-center gap-1 bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider border border-orange-100 dark:border-orange-800 shrink-0">
                                <Flame size={10} fill="currentColor" /> {cs.frequency}
                              </div>
                            </div>
                            <p className="text-xs text-slate-500 truncate">{cs.summary}</p>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleToggleBookmark(cs.id, 'case', cs.title, `/app/osce?case=${cs.id}`);
                              }}
                              className={cn(
                                "p-1.5 rounded-lg transition-colors shrink-0",
                                isCaseBookmarked 
                                  ? "text-amber-500" 
                                  : "text-slate-300 hover:text-amber-500 opacity-0 group-hover:opacity-100"
                              )}
                            >
                              <Bookmark size={14} fill={isCaseBookmarked ? "currentColor" : "none"} />
                            </button>
                            <ChevronRight size={18} className="text-slate-300 group-hover:text-orange-500 transition-colors shrink-0" />
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </LoadingWrapper>
            </div>
          </div>
        </div>
      </PageTransition>
    );
  }

  // VIEW 6: CASE DETAIL
  if (view === 'CASE_DETAIL' && activeCase) {
    const hasNewFormat = activeCase.content.tatalaksana && activeCase.content.diagnosis;
    const isCaseBookmarked = isBookmarked(activeCase.id, 'case');
    
    return (
      <PageTransition variant="slide">
        <div className="h-full flex flex-col bg-slate-50 dark:bg-slate-950 overflow-hidden">
          
          {/* Header */}
          <div className="px-4 pt-3 sticky top-0 z-30 pb-3 bg-white/90 dark:bg-slate-900/90 backdrop-blur-lg border-b border-slate-100 dark:border-slate-800">
            <div className="max-w-3xl mx-auto flex justify-between items-center">
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => setView('CASE_LIBRARY')} 
                  className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full text-slate-500"
                >
                  <ArrowLeft size={20} />
                </button>
                <h2 className="text-sm font-bold text-slate-900 dark:text-white truncate max-w-[200px]">{activeCase.title}</h2>
              </div>
              <div className="flex items-center gap-2">
                {/* Bookmark button */}
                <button
                  onClick={() => handleToggleBookmark(activeCase.id, 'case', activeCase.title, `/app/osce?case=${activeCase.id}`)}
                  className={cn(
                    "p-2 rounded-full transition-colors",
                    isCaseBookmarked 
                      ? "bg-amber-100 dark:bg-amber-900/20 text-amber-600" 
                      : "bg-slate-100 dark:bg-slate-800 text-slate-400"
                  )}
                >
                  <Bookmark size={16} fill={isCaseBookmarked ? "currentColor" : "none"} />
                </button>
                
                {/* Complete button */}
                <button 
                  onClick={toggleCaseCompletion} 
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all active:scale-95",
                    isCaseCompleted 
                      ? 'bg-teal-500 text-white shadow-md shadow-teal-500/20' 
                      : 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-800'
                  )}
                >
                  {isCaseCompleted ? <><Trophy size={14} /> Dikuasai</> : <><BookmarkCheck size={14} /> Tandai</>}
                </button>
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar pb-32 w-full pt-6">
            <div className="px-4 md:px-6 max-w-3xl mx-auto space-y-6">
              
              {/* HERO SUMMARY */}
              <AnimateIn animation="fade" delay={0}>
                <div className="text-center bg-white dark:bg-slate-900 p-6 rounded-[2rem] shadow-sm border border-slate-100 dark:border-slate-800">
                  <div className="flex justify-center gap-2 mb-3">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-orange-600 bg-orange-50 dark:bg-orange-900/20 px-3 py-1 rounded-full border border-orange-100 dark:border-orange-800">SKDI {activeCase.level_skdi || '4A'}</span>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-teal-600 bg-teal-50 dark:bg-teal-900/20 px-3 py-1 rounded-full border border-teal-100 dark:border-teal-800">Freq: {'⭐'.repeat(activeCase.frequency)}</span>
                  </div>
                  <h1 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white mb-3 leading-tight">{activeCase.title}</h1>
                  <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">{activeCase.summary}</p>
                </div>
              </AnimateIn>

              {hasNewFormat ? (
                <>
                  {/* ANAMNESIS & PHYSICAL EXAM GRID */}
                  <AnimateIn animation="slide-up" delay={50}>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="bg-white dark:bg-slate-900 rounded-[2rem] p-5 border border-slate-100 dark:border-slate-800 shadow-sm">
                        <h3 className="text-xs font-black text-teal-600 uppercase tracking-widest mb-4 flex items-center gap-2">
                          <Mic size={16} /> Anamnesis Kunci
                        </h3>
                        <ul className="space-y-2">
                          {activeCase.content.anamnesis.list_pertanyaan?.map((q: string, i: number) => (
                            <li key={i} className="flex gap-3 text-slate-700 dark:text-slate-300 text-sm leading-snug">
                              <span className="text-teal-500 font-bold leading-none">•</span> 
                              <span>{q}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="bg-white dark:bg-slate-900 rounded-[2rem] p-5 border border-slate-100 dark:border-slate-800 shadow-sm">
                        <h3 className="text-xs font-black text-blue-600 uppercase tracking-widest mb-4 flex items-center gap-2">
                          <Activity size={16} /> Pemeriksaan Fisik
                        </h3>
                        <div className="grid gap-2">
                          {activeCase.content.pemeriksaan_fisik.map((item: string, i: number) => (
                            <div key={i} className="flex gap-3 items-start bg-blue-50/50 dark:bg-blue-900/10 p-3 rounded-xl border border-blue-100 dark:border-blue-800/20">
                              <CheckCircle size={14} className="text-blue-500 shrink-0 mt-0.5" />
                              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{item}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </AnimateIn>

                  {/* DIAGNOSIS */}
                  <AnimateIn animation="slide-up" delay={100}>
                    <div className="bg-white dark:bg-slate-900 rounded-[2rem] p-5 border border-slate-100 dark:border-slate-800 shadow-sm">
                      <h3 className="text-xs font-black text-purple-600 uppercase tracking-widest mb-4 flex items-center gap-2">
                        <Search size={16} /> Diagnosis & Penunjang
                      </h3>
                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <h4 className="text-[10px] font-bold text-slate-400 uppercase mb-2">Working DD</h4>
                          <p className="text-sm text-slate-700">{activeCase.content.diagnosis.working_diagnosis}</p>
                          <div className="mt-3 flex flex-wrap gap-2">
                            {activeCase.content.diagnosis.differential_diagnosis.map((d: string, i: number) => (
                              <span key={i} className="text-[10px] bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 px-2 py-1 rounded-full border border-purple-100 dark:border-purple-800">{d}</span>
                            ))}
                          </div>
                        </div>
                        <div>
                          <h4 className="text-[10px] font-bold text-slate-400 uppercase mb-2">Penunjang</h4>
                          <ul className="list-disc list-inside space-y-1 text-sm text-slate-700 marker:text-teal-500">
                            {activeCase.content.diagnosis.penunjang.map((p: string, i: number) => <li key={i}>{p}</li>)}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </AnimateIn>

                  {/* TATALAKSANA */}
                  <AnimateIn animation="slide-up" delay={150}>
                    <div className="bg-white dark:bg-slate-900 rounded-[2rem] p-5 border border-slate-100 dark:border-slate-800 shadow-sm">
                      <h3 className="text-xs font-black text-emerald-600 uppercase tracking-widest mb-4 flex items-center gap-2">
                        <Pill size={16} /> Tatalaksana & Edukasi
                      </h3>
                      <div className="space-y-4">
                        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
                          <h4 className="font-bold text-xs text-slate-500 mb-2 uppercase">Farmakologi</h4>
                          <ul className="space-y-1.5">
                            {activeCase.content.tatalaksana.farmakologi.map((rx: string, i: number) => (
                              <li key={i} className="text-sm text-slate-800 dark:text-slate-200 font-medium">{rx}</li>
                            ))}
                          </ul>
                        </div>
                        <div className="p-4 rounded-xl bg-orange-50/50 dark:bg-orange-900/10 border border-orange-100 dark:border-orange-800/20">
                          <h4 className="font-bold text-xs text-orange-600 mb-2 uppercase">Non-Farmakologi</h4>
                          <ul className="space-y-1.5">
                            {activeCase.content.tatalaksana.non_farmakologi.map((edu: string, i: number) => (
                              <li key={i} className="text-sm text-slate-700 dark:text-slate-300">{edu}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </AnimateIn>

                  {/* SIMULASI RESEP */}
                  <AnimateIn animation="slide-up" delay={200}>
                    <div className="bg-[#fffdf5] text-slate-900 rounded-[2rem] p-6 shadow-xl border border-amber-200 relative overflow-hidden">
                      <div className="border-b-2 border-dashed border-red-200 pb-4 mb-6 relative z-10">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-serif font-bold text-lg text-slate-800 tracking-wide">
                              dr. {currentUser?.displayName || 'MedPrep'}
                            </h3>
                            <p className="text-[9px] text-slate-400 uppercase font-bold mt-0.5">
                              Stase {currentStation.title}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="font-serif text-base space-y-4 mb-6 relative z-10">
                        {activeCase.content.tatalaksana.farmakologi.map((rx: string, i: number) => (
                          <p key={i} className="font-medium text-slate-800 border-b border-dashed border-slate-200 w-full pb-1">
                            {rx}
                          </p>
                        ))}
                      </div>
                      
                      <div className="relative z-10 text-right">
                        <p className="text-[10px] text-slate-400 italic">{new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                      </div>
                    </div>
                  </AnimateIn>

                  {/* OSCE PRO TIP */}
                  <AnimateIn animation="slide-up" delay={250}>
                    <div className="bg-gradient-to-br from-slate-900 to-slate-800 p-6 rounded-[2rem] border border-slate-700 relative overflow-hidden text-white shadow-2xl">
                      <div className="absolute top-0 right-0 p-40 bg-gradient-to-br from-teal-500/20 to-transparent rounded-full blur-3xl"></div>
                      <div className="relative z-10">
                        <div className="flex items-center gap-2 mb-4 text-teal-400">
                          <Sparkles size={20} className="text-teal-400" />
                          <h4 className="font-black uppercase text-xs tracking-widest">MedPrep Insight</h4>
                        </div>
                        <p className="text-base font-serif leading-relaxed text-slate-200 italic">
                          "{activeCase.content.osce_tip}"
                        </p>
                      </div>
                    </div>
                  </AnimateIn>
                </>
              ) : (
                <ErrorState message="Format data kasus lengkap belum tersedia." onRetry={() => setView('CASE_LIBRARY')} />
              )}
            </div>
          </div>
        </div>
      </PageTransition>
    );
  }

  return null;
}