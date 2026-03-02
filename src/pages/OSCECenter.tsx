import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Brain, Droplet, Wind, Heart, Utensils, Baby, Zap, Shield, 
  Activity, Sun, Smile, Eye, CheckCircle, ChevronRight, Mic, 
  BookOpen, Search, Flame, Stethoscope, LayoutGrid, 
  ChevronDown, Sparkles, Siren, BookmarkCheck, Info,
  Thermometer, Pill, FileText, ClipboardList, PenTool,
  BarChart2, Library, FolderOpen, Layers, Trophy, Play, RotateCcw, Award
} from 'lucide-react';
import { STATION_DATA, SYSTEM_LIST, CaseStudy } from '../data/osce_data';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext'; // Import useAuth untuk ambil nama user

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
  
  // --- NAVIGASI TRENDS ANALYSIS ---
  const navigate = useNavigate();

  // --- AUTH CONTEXT ---
  const { currentUser } = useAuth(); // Ambil data user yang login

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
                className={`group relative p-4 rounded-2xl cursor-pointer transition-all duration-300 border 
                  ${isChecked 
                    ? 'bg-teal-50 dark:bg-teal-900/20 border-teal-500/30 shadow-sm' 
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-teal-400 hover:shadow-md'
                  }
                `}
              >
                <div className="flex gap-4 items-start">
                  <div className={`mt-1 shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-300
                    ${isChecked 
                      ? 'bg-teal-500 border-teal-500 scale-100' 
                      : `${isCritical ? 'border-red-400' : 'border-slate-300 dark:border-slate-600'} scale-90 group-hover:scale-100`
                    }`}
                  >
                    {isChecked && <CheckCircle size={14} className="text-white" />}
                    {!isChecked && isCritical && <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className={`font-bold text-sm leading-tight transition-all ${isChecked ? 'text-slate-400 line-through' : 'text-slate-800 dark:text-slate-100'}`}>
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
      <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-24 max-w-7xl mx-auto px-4 md:px-6">
        
        <div className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-black rounded-[2.5rem] p-8 md:p-12 overflow-hidden shadow-2xl border border-slate-700/50">
          <div className="absolute top-0 right-0 w-80 h-80 bg-teal-500/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2"></div>
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
             <div>
                <div className="flex items-center gap-3 mb-3">
                    <div className="p-3 bg-gradient-to-br from-teal-400 to-teal-600 rounded-2xl text-white shadow-lg shadow-teal-500/30">
                        <Stethoscope size={28} />
                    </div>
                    <div>
                        <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight">OSCE Station</h1>
                        <p className="text-slate-400 text-xs font-medium">Clinical Skills Simulator</p>
                    </div>
                </div>
                <p className="text-slate-400 text-sm max-w-md leading-relaxed">
                  Latih keterampilan klinis dan reasoning dengan pendekatan simulasi interaktif.
                </p>
             </div>
             <div className="flex gap-6">
                <div className="text-center bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl px-6 py-4">
                   <h4 className="text-2xl font-black text-white">{completedCases.length}</h4>
                   <p className="text-[10px] text-slate-400 uppercase font-bold">Kasus Selesai</p>
                </div>
             </div>
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-slate-800 dark:text-white font-bold text-lg flex items-center gap-2 px-1">
              <span className="w-1.5 h-6 rounded-full bg-teal-500"></span> Pilih Stase Klinis
            </h3>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {SYSTEM_LIST.map((sys) => {
               const stationData = STATION_DATA[sys.id];
               const totalCases = stationData?.cases?.length || 0;
               const doneCases = stationData?.cases?.filter((c: any) => completedCases.includes(c.id)).length || 0;
               const percent = totalCases > 0 ? Math.round((doneCases/totalCases)*100) : 0;

               return (
                <button
                  key={sys.id}
                  onClick={() => { setActiveStationId(sys.id); setView('MODE_SELECT'); }}
                  className="group relative bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 h-36 rounded-[1.5rem] flex flex-col justify-between text-left transition-all duration-300 hover:shadow-xl hover:shadow-teal-500/10 hover:-translate-y-1 hover:border-teal-500/50 overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-teal-50/50 to-transparent dark:from-teal-900/10 opacity-0 group-hover:opacity-100 transition-opacity rounded-[1.5rem]"></div>
                  <div className="relative z-10 flex justify-between items-start">
                     <div className={`p-2 rounded-xl transition-colors ${sys.id === 'gadar' ? 'bg-red-50 dark:bg-red-900/20 text-red-500' : 'bg-slate-100 dark:bg-slate-800 text-slate-500 group-hover:bg-teal-500 group-hover:text-white'}`}>
                        {getIcon(sys.icon, 20)}
                     </div>
                     {percent > 0 && (
                        <div className="text-[9px] font-black text-teal-600 bg-teal-50 dark:bg-teal-900/20 px-2 py-1 rounded-full border border-teal-100 dark:border-teal-800">
                           {percent}%
                        </div>
                     )}
                  </div>
                  <div className="relative z-10">
                    <h3 className={`font-bold text-sm mb-1 transition-colors ${sys.id === 'gadar' ? 'text-red-700 dark:text-red-400' : 'text-slate-700 dark:text-slate-200 group-hover:text-teal-700 dark:group-hover:text-teal-400'}`}>
                        {sys.label}
                    </h3>
                    <p className="text-[10px] text-slate-400">{totalCases} Kasus</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* QUICK ACCESS TOOLS / RESOURCE TAMBAHAN */}
        <div className="grid md:grid-cols-3 gap-4">
           {[
             // Tambahkan properti 'path' untuk navigasi
             { icon: BarChart2, title: "Analisis Tren", desc: "Statistik kasus 10 tahun terakhir", color: 'indigo', path: '/app/trends' },
             { icon: FolderOpen, title: "Rekap Batch", desc: "Kasus sering muncul UKMPPD", color: 'slate', path: '#' }, // Belum ada halaman
             { icon: Award, title: "Leaderboard", desc: "Top performer minggu ini", color: 'amber', path: '#' } // Belum ada halaman
           ].map((item, i) => (
             <div 
                key={i} 
                onClick={() => item.path !== '#' && navigate(item.path)} // Hanya navigasi jika path bukan '#'
                className="group bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center gap-4 hover:border-indigo-500/50 hover:shadow-lg cursor-pointer transition-all"
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center bg-${item.color}-50 dark:bg-${item.color}-900/10 text-${item.color}-600`}>
                   <item.icon size={24} />
                </div>
                <div>
                   <h4 className="font-bold text-sm text-slate-800 dark:text-white">{item.title}</h4>
                   <p className="text-[10px] text-slate-500">{item.desc}</p>
                </div>
             </div>
           ))}
        </div>

      </div>
    );
  }

  // VIEW 2: MODE SELECT
  if (view === 'MODE_SELECT') {
    return (
      <div className="animate-in slide-in-from-right duration-500 px-4 pb-24 max-w-4xl mx-auto pt-6">
        <button onClick={() => setView('HOME')} className="mb-8 flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors bg-white dark:bg-slate-900 px-4 py-2 rounded-full w-fit border border-slate-200 dark:border-slate-800">
          <ArrowLeft size={14} /> Kembali
        </button>

        <div className="text-center mb-12">
          <div className="inline-flex p-5 rounded-[2rem] bg-gradient-to-br from-teal-500 to-emerald-600 text-white mb-6 shadow-2xl shadow-teal-500/20">
            {getIcon(currentStation.icon, 40)}
          </div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white mb-2 tracking-tight">{currentStation.title}</h1>
          <p className="text-slate-500 dark:text-slate-400 max-w-sm mx-auto text-sm">{currentStation.description}</p>
          
          {stationProgress > 0 && (
             <div className="mt-6 max-w-xs mx-auto">
                <div className="flex justify-between text-xs font-bold text-slate-500 mb-1">
                    <span>Progress Stase</span>
                    <span>{stationProgress}%</span>
                </div>
                <div className="h-2 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-teal-500 rounded-full transition-all" style={{ width: `${stationProgress}%` }} />
                </div>
             </div>
          )}
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div onClick={() => setView('CHECKLIST_TOPIC_SELECT')} className="group relative bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 rounded-[2rem] cursor-pointer transition-all hover:-translate-y-2 hover:shadow-2xl hover:shadow-teal-500/10 overflow-hidden">
            <div className="absolute top-0 right-0 w-40 h-40 bg-teal-500/5 rounded-full blur-3xl group-hover:bg-teal-500/10 transition-all"></div>
            <div className="relative z-10 flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-teal-50 dark:bg-teal-900/20 text-teal-600 rounded-2xl flex items-center justify-center mb-5 shadow-sm group-hover:bg-teal-500 group-hover:text-white transition-colors"><Play size={28} /></div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Simulasi Skill</h3>
              <p className="text-slate-500 text-xs mb-6 leading-relaxed">Latih keterampilan prosedural dengan panduan interaktif.</p>
              <span className="text-teal-600 font-bold text-xs flex items-center gap-2 group-hover:gap-3 transition-all">Mulai Simulasi <ChevronRight size={14} /></span>
            </div>
          </div>

          <div onClick={() => setView('CASE_LIBRARY')} className="group relative bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 rounded-[2rem] cursor-pointer transition-all hover:-translate-y-2 hover:shadow-2xl hover:shadow-orange-500/10 overflow-hidden">
            <div className="absolute top-0 right-0 w-40 h-40 bg-orange-500/5 rounded-full blur-3xl group-hover:bg-orange-500/10 transition-all"></div>
            <div className="relative z-10 flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-orange-50 dark:bg-orange-900/20 text-orange-600 rounded-2xl flex items-center justify-center mb-5 shadow-sm group-hover:bg-orange-500 group-hover:text-white transition-colors"><BookOpen size={28} /></div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Bedah Kasus</h3>
              <p className="text-slate-500 text-xs mb-6 leading-relaxed">Pelajari alur diagnosis dan tatalaksana kasus tersering.</p>
              <span className="text-orange-600 font-bold text-xs flex items-center gap-2 group-hover:gap-3 transition-all">Buka Library <ChevronRight size={14} /></span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // VIEW 3 & 4: CHECKLIST FLOW
  if (view === 'CHECKLIST_TOPIC_SELECT') {
    return (
        <div className="animate-in slide-in-from-right duration-500 px-4 pb-24 max-w-3xl mx-auto pt-6">
            <button onClick={() => setView('MODE_SELECT')} className="mb-6 flex items-center gap-2 text-xs font-bold text-slate-500 bg-white dark:bg-slate-900 px-4 py-2 rounded-full w-fit border border-slate-200 dark:border-slate-800">
                <ArrowLeft size={12} /> Kembali
            </button>
            <div className="mb-10">
                <h1 className="text-2xl font-black text-slate-900 dark:text-white mb-1">Pilih Prosedur</h1>
                <p className="text-slate-500 text-sm">Daftar tindakan klinis di stase {currentStation.title}</p>
            </div>

            <div className="grid gap-3">
                {currentStation.sections.length === 0 ? (
                    <div className="text-center py-16 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-dashed border-slate-300">
                        <p className="text-slate-400 text-sm">Materi checklist sedang disiapkan.</p>
                    </div>
                ) : (
                    currentStation.sections.map((section, idx) => (
                        <div 
                            key={idx}
                            onClick={() => { setActiveSectionIdx(idx); setCheckedItems([]); setView('CHECKLIST_RUN'); }}
                            className="group bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl cursor-pointer hover:border-teal-500/50 hover:shadow-md transition-all flex items-center justify-between"
                        >
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 bg-slate-100 dark:bg-slate-800 rounded-xl flex items-center justify-center font-bold text-slate-500 group-hover:bg-teal-500 group-hover:text-white transition-colors text-sm">
                                    {idx + 1}
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-800 dark:text-white group-hover:text-teal-600 transition-colors">{section.title}</h3>
                                    <p className="text-xs text-slate-400">
                                      {section.type === 'checklist' ? section.items.length : 0} Langkah
                                    </p>
                                </div>
                            </div>
                            <div className="w-8 h-8 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-400 group-hover:bg-teal-50 group-hover:text-teal-600 transition-all">
                                <ChevronRight size={18} />
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
  }

  if (view === 'CHECKLIST_RUN' && activeSectionIdx !== null) {
    const activeSectionData = currentStation.sections[activeSectionIdx];
    return (
      <div className="animate-in slide-in-from-right duration-500 h-full flex flex-col bg-slate-50 dark:bg-slate-950">
        <div className="px-4 pt-4 pb-2 sticky top-0 z-20 bg-slate-50/95 dark:bg-slate-950/95 backdrop-blur-lg border-b border-slate-100 dark:border-slate-800">
            <div className="flex justify-between items-center mb-2">
                <button onClick={() => setView('CHECKLIST_TOPIC_SELECT')} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"><ArrowLeft size={20} className="text-slate-600"/></button>
                <div className="flex gap-2">
                    <button onClick={resetChecklist} className="p-2 bg-slate-100 dark:bg-slate-800 rounded-full text-slate-500 hover:text-red-500 transition-colors"><RotateCcw size={18}/></button>
                    <button onClick={() => setScriptMode(!scriptMode)} className={`px-4 py-2 rounded-full text-xs font-bold border flex items-center gap-2 transition-all ${scriptMode ? 'bg-teal-500 text-white border-teal-500 shadow-md' : 'bg-white dark:bg-slate-900 border-slate-200 text-slate-500'}`}>
                        <Mic size={14} /> Script
                    </button>
                </div>
            </div>
            <h2 className="text-center font-bold text-slate-800 dark:text-white text-sm">{activeSectionData.title}</h2>
        </div>

        <div className="flex-1 overflow-y-auto p-4 md:p-6 custom-scrollbar pb-32 max-w-3xl mx-auto w-full">
           <InteractiveChecklist section={activeSectionData} sectionIdx={activeSectionIdx} />
           
           <div className="mt-12 text-center">
            <button onClick={() => setView('CHECKLIST_TOPIC_SELECT')} className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-10 py-4 rounded-2xl font-bold shadow-xl hover:scale-105 transition-all text-sm">
              Selesai Latihan
            </button>
           </div>
        </div>
      </div>
    );
  }

  // VIEW 5 & 6: CASE LIBRARY & DETAIL
  if (view === 'CASE_LIBRARY') {
    const cases = currentStation.cases || [];
    const filteredCases = cases.filter((c: any) => c.title.toLowerCase().includes(searchQuery.toLowerCase()));

    return (
      <div className="animate-in slide-in-from-right duration-500 h-full flex flex-col bg-slate-50 dark:bg-slate-950">
        <div className="px-4 pt-4 sticky top-0 z-20 pb-4 bg-slate-50/95 dark:bg-slate-950/95 backdrop-blur-lg border-b border-slate-100 dark:border-slate-800">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-3 mb-4">
                <button onClick={() => setView('MODE_SELECT')} className="p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-full hover:bg-slate-100 transition-colors"><ArrowLeft size={18} className="text-slate-600"/></button>
                <h1 className="text-xl font-black text-slate-900 dark:text-white">Perpustakaan Kasus</h1>
            </div>
            
            <div className="relative group">
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                  <Search size={20} className="text-slate-400 group-focus-within:text-teal-500 transition-colors" />
              </div>
              <input 
                  type="text" 
                  placeholder="Cari nama penyakit..." 
                  className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all shadow-sm text-sm" 
                  value={searchQuery} 
                  onChange={(e) => setSearchQuery(e.target.value)} 
              />
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-4 custom-scrollbar pb-24">
          <div className="max-w-4xl mx-auto space-y-3 pt-2">
            {filteredCases.length === 0 ? (
              <div className="text-center py-20 text-slate-400 text-sm">Tidak ada kasus ditemukan.</div>
            ) : filteredCases.map((cs: any) => {
               const isDone = completedCases.includes(cs.id);
               return (
                <div key={cs.id} onClick={() => { setActiveCase(cs); setView('CASE_DETAIL'); }} className="group bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl cursor-pointer hover:border-orange-500/50 hover:shadow-xl hover:shadow-orange-500/5 transition-all flex items-center gap-4">
                    
                    <div className={`w-3 h-3 rounded-full shrink-0 ${isDone ? 'bg-teal-500' : 'bg-slate-200 dark:bg-slate-700'}`}></div>

                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-1">
                        <h3 className="font-bold text-slate-800 dark:text-slate-200 group-hover:text-orange-600 transition-colors line-clamp-1">{cs.title}</h3>
                        <div className="flex items-center gap-1 bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider border border-orange-100 dark:border-orange-800">
                          <Flame size={10} fill="currentColor" /> {cs.frequency}
                        </div>
                      </div>
                      <p className="text-xs text-slate-500 line-clamp-1 leading-snug">{cs.summary}</p>
                    </div>
                    <ChevronRight size={18} className="text-slate-300 group-hover:text-orange-500 transition-colors" />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  if (view === 'CASE_DETAIL' && activeCase) {
    const hasNewFormat = activeCase.content.tatalaksana && activeCase.content.diagnosis;
    return (
      <div className="animate-in slide-in-from-bottom duration-500 h-full flex flex-col bg-slate-50 dark:bg-slate-950 overflow-hidden">
        
        {/* Header */}
        <div className="px-4 pt-3 sticky top-0 z-30 pb-3 bg-white/90 dark:bg-slate-900/90 backdrop-blur-lg border-b border-slate-100 dark:border-slate-800">
            <div className="max-w-3xl mx-auto flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <button onClick={() => setView('CASE_LIBRARY')} className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full text-slate-500"><ArrowLeft size={20} /></button>
                    <h2 className="text-sm font-bold text-slate-900 dark:text-white line-clamp-1">{activeCase.title}</h2>
                </div>
                <button onClick={toggleCaseCompletion} className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all active:scale-95 ${isCaseCompleted ? 'bg-teal-500 text-white shadow-md shadow-teal-500/20' : 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-800'}`}>
                    {isCaseCompleted ? <><Trophy size={14} /> Dikuasai</> : <><BookmarkCheck size={14} /> Tandai</>}
                </button>
            </div>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar pb-32 w-full pt-6">
          <div className="px-4 md:px-6 max-w-3xl mx-auto space-y-6">
            
            {/* HERO SUMMARY */}
            <div className="text-center mb-8 bg-white dark:bg-slate-900 p-8 rounded-[2rem] shadow-sm border border-slate-100 dark:border-slate-800">
                 <div className="flex justify-center gap-2 mb-3">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-orange-600 bg-orange-50 dark:bg-orange-900/20 px-3 py-1 rounded-full border border-orange-100 dark:border-orange-800">SKDI {activeCase.level_skdi || '4A'}</span>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-teal-600 bg-teal-50 dark:bg-teal-900/20 px-3 py-1 rounded-full border border-teal-100 dark:border-teal-800">Freq: {'⭐'.repeat(activeCase.frequency)}</span>
                 </div>
                 <h1 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white mb-3 leading-tight">{activeCase.title}</h1>
                 <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">{activeCase.summary}</p>
            </div>

            {hasNewFormat ? (
                <>
                    {/* ANAMNESIS & PHYSICAL EXAM GRID */}
                    <div className="grid md:grid-cols-2 gap-4">
                        <div className="bg-white dark:bg-slate-900 rounded-[2rem] p-6 border border-slate-100 dark:border-slate-800 shadow-sm">
                            <h3 className="text-xs font-black text-teal-600 uppercase tracking-widest mb-4 flex items-center gap-2">
                                <Mic size={16} /> Anamnesis Kunci
                            </h3>
                            <ul className="space-y-3">
                                {activeCase.content.anamnesis.list_pertanyaan?.map((q: string, i: number) => (
                                    <li key={i} className="flex gap-3 text-slate-700 dark:text-slate-300 text-sm leading-snug">
                                        <span className="text-teal-500 font-bold text-lg leading-none">•</span> 
                                        <span>{q}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="bg-white dark:bg-slate-900 rounded-[2rem] p-6 border border-slate-100 dark:border-slate-800 shadow-sm">
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

                    {/* DIAGNOSIS */}
                    <div className="bg-white dark:bg-slate-900 rounded-[2rem] p-6 border border-slate-100 dark:border-slate-800 shadow-sm">
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

                    {/* TATALAKSANA */}
                    <div className="bg-white dark:bg-slate-900 rounded-[2rem] p-6 border border-slate-100 dark:border-slate-800 shadow-sm">
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

                    {/* SIMULASI RESEP (REVISED) */}
                    <div className="bg-[#fffdf5] text-slate-900 rounded-[2rem] p-8 shadow-xl border border-amber-200 relative overflow-hidden">
                        {/* Header Resep */}
                        <div className="border-b-2 border-dashed border-red-200 pb-4 mb-6 relative z-10">
                            <div className="flex justify-between items-start">
                                <div>
                                    {/* Nama Dokter Dinamis */}
                                    <h3 className="font-serif font-bold text-lg text-slate-800 tracking-wide">
                                       dr. {currentUser?.displayName || 'MedPrep'}
                                    </h3>
                                    {/* Nama Stase Dinamis */}
                                    <p className="text-[9px] text-slate-400 uppercase font-bold mt-0.5">
                                       Stase {currentStation.title}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Konten Resep */}
                        <div className="font-serif text-base space-y-4 mb-6 relative z-10">
                             {activeCase.content.tatalaksana.farmakologi.map((rx: string, i: number) => (
                                // Menghapus R/ otomatis, menampilkan teks mentah
                                <p key={i} className="font-medium text-slate-800 border-b border-dashed border-slate-200 w-full pb-1">
                                    {rx}
                                </p>
                             ))}
                        </div>
                        
                        {/* Footer Resep (Dihilangkan Garis TTD & Pro Patient) */}
                        <div className="relative z-10 text-right">
                             <p className="text-[10px] text-slate-400 italic">{new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                        </div>
                    </div>

                    {/* OSCE PRO TIP */}
                    <div className="bg-gradient-to-br from-slate-900 to-slate-800 p-8 rounded-[2rem] border border-slate-700 relative overflow-hidden text-white shadow-2xl">
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
                </>
            ) : (
                <div className="text-center py-20 bg-slate-50 dark:bg-slate-900 rounded-[2rem] border border-dashed border-slate-300 dark:border-slate-700">
                    <p className="text-slate-500">Format data kasus lengkap belum tersedia.</p>
                </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return null;
}