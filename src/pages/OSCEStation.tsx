import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, Brain, Droplet, Wind, Heart, Utensils, Baby, Zap, Shield, 
  Activity, Sun, Smile, Eye, CheckCircle, ChevronRight, Mic, 
  BookOpen, Search, Flame, Stethoscope, LayoutGrid, 
  ChevronDown, Sparkles, Siren, BookmarkCheck, Info,
  Thermometer, Pill, FileText, ClipboardList, PenTool,
  BarChart2, Library, FolderOpen, Layers
} from 'lucide-react';
import { STATION_DATA, SYSTEM_LIST, CaseStudy, OSCESection } from '../data/osce_data';
import toast from 'react-hot-toast';

// VIEW STATE NAVIGATION
type ViewState = 'HOME' | 'MODE_SELECT' | 'CHECKLIST_TOPIC_SELECT' | 'CHECKLIST_RUN' | 'CASE_LIBRARY' | 'CASE_DETAIL';

export default function OSCEStation() {
  // --- STATE ---
  const [view, setView] = useState<ViewState>('HOME');
  const [activeStationId, setActiveStationId] = useState<string | null>(null);
  const [activeCase, setActiveCase] = useState<CaseStudy | null>(null);
  const [activeSectionIdx, setActiveSectionIdx] = useState<number | null>(null); // Untuk pilih topik ceklis
  
  const [searchQuery, setSearchQuery] = useState('');
  const [scriptMode, setScriptMode] = useState(true);
  const [expandedSections, setExpandedSections] = useState<{[key:number]: boolean}>({}); // Utk checklist items
  const [isCompleted, setIsCompleted] = useState(false);

  // --- EFEK PROGRESS ---
  useEffect(() => {
    if (activeCase) {
      const completedList = JSON.parse(localStorage.getItem('medprep_osce_completed') || '[]');
      setIsCompleted(completedList.includes(activeCase.id));
    }
  }, [activeCase]);

  const markAsCompleted = () => {
    if (!activeCase) return;
    const completedList = JSON.parse(localStorage.getItem('medprep_osce_completed') || '[]');
    if (!completedList.includes(activeCase.id)) {
      completedList.push(activeCase.id);
      localStorage.setItem('medprep_osce_completed', JSON.stringify(completedList));
      setIsCompleted(true);
      toast.success("Kasus ditandai selesai!", { style: { borderRadius: '12px', background: '#333', color: '#fff' } });
    }
  };

  // --- HELPERS ---
  const currentStation = activeStationId && STATION_DATA[activeStationId] 
    ? STATION_DATA[activeStationId] 
    : { id: '', title: 'Stase', description: '', icon: 'activity', sections: [], cases: [] };

  const getIcon = (name: string, size = 24) => {
    const icons: any = { brain: Brain, droplet: Droplet, wind: Wind, heart: Heart, utensils: Utensils, baby: Baby, zap: Zap, shield: Shield, activity: Activity, sun: Sun, smile: Smile, eye: Eye, siren: Siren };
    const Icon = icons[name] || Activity;
    return <Icon size={size} />;
  };

  // --- RENDERERS (SUB-COMPONENTS) ---

  const RenderChecklistItems = ({ section }: { section: any }) => (
    <div className="space-y-4">
      {section.items?.map((item: any, idx: number) => (
        <div key={idx} className="group bg-white dark:bg-slate-900 border border-slate-100 dark:border-white/5 p-5 rounded-2xl flex gap-4 hover:border-teal-500/30 hover:shadow-lg hover:shadow-teal-500/5 transition-all">
           <div className={`mt-1 shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${item.isCritical ? 'border-red-500 bg-red-50 dark:bg-red-900/20' : 'border-slate-300 dark:border-slate-700 group-hover:border-teal-400'}`}>
             {item.isCritical && <div className="w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse"></div>}
           </div>
           <div className="flex-1">
             <div className="flex items-center gap-2 flex-wrap">
               <span className={`font-bold text-base ${item.isCritical ? 'text-red-600 dark:text-red-400' : 'text-slate-800 dark:text-slate-200'}`}>{item.label}</span>
               {item.isCritical && <span className="text-[9px] bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-300 px-2 py-0.5 rounded-full font-black tracking-wider">CRITICAL</span>}
             </div>
             {item.description && <p className="text-sm text-slate-500 mt-1 leading-relaxed">{item.description}</p>}
             
             {scriptMode && (
               <div className="mt-3 space-y-2">
                 {item.script && (
                   <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl text-sm italic text-slate-600 dark:text-slate-300 border border-slate-100 dark:border-white/5 flex gap-3">
                     <Mic size={16} className="shrink-0 mt-0.5 text-teal-500" /> 
                     <span>"{item.script}"</span>
                   </div>
                 )}
                 {item.insight && (
                   <div className="bg-emerald-50 dark:bg-emerald-900/10 p-3 rounded-xl text-sm text-emerald-700 dark:text-emerald-400 flex gap-3 border border-emerald-100 dark:border-emerald-900/30">
                      <Sparkles size={16} className="shrink-0 mt-0.5" /> 
                      <span className="font-medium">Insight: {item.insight}</span>
                    </div>
                 )}
               </div>
             )}
           </div>
        </div>
      ))}
    </div>
  );

  // ==========================================
  // VIEW 1: HOME (iOS Clean Style + Special Sections)
  // ==========================================
  if (view === 'HOME') {
    return (
      <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-24 max-w-7xl mx-auto px-4 md:px-6">
        
        {/* HERO HEADER */}
        <div className="relative bg-slate-900 dark:bg-black rounded-[2.5rem] p-8 md:p-10 overflow-hidden shadow-2xl shadow-slate-200/50 dark:shadow-none">
          <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500/20 rounded-full blur-[80px]"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-600/20 rounded-full blur-[60px]"></div>
          
          <div className="relative z-10">
             <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-teal-500/20 rounded-2xl text-teal-400">
                    <Stethoscope size={32} />
                </div>
                <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight">OSCE Center</h1>
             </div>
             <p className="text-slate-400 text-sm md:text-base max-w-xl leading-relaxed">
               Pusat simulasi klinis. Pilih stase untuk mengakses checklist tindakan dan bedah kasus komprehensif.
             </p>
          </div>
        </div>

        {/* GRID STASE (CLEAN STYLE) */}
        <div>
          <h3 className="text-slate-800 dark:text-white font-bold text-lg mb-6 flex items-center gap-2 px-1">
            <span className="w-1.5 h-6 rounded-full bg-teal-500"></span> Pilih Stase Klinis
          </h3>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {SYSTEM_LIST.map((sys) => (
              <button
                key={sys.id}
                onClick={() => { setActiveStationId(sys.id); setView('MODE_SELECT'); }}
                className="group relative bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 p-4 h-24 rounded-[1.5rem] flex flex-col items-center justify-center text-center transition-all duration-300 hover:shadow-xl hover:shadow-teal-500/10 hover:-translate-y-1 hover:border-teal-500/30"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-teal-50/50 to-transparent dark:from-teal-900/10 opacity-0 group-hover:opacity-100 rounded-[1.5rem] transition-opacity"></div>
                
                {/* No Big Icon, Just Text for Clean Look as requested */}
                <h3 className={`font-bold text-sm transition-colors relative z-10 ${sys.id === 'gadar' ? 'text-red-600 dark:text-red-400' : 'text-slate-600 dark:text-slate-300 group-hover:text-teal-600 dark:group-hover:text-teal-400'}`}>
                    {sys.label}
                </h3>
              </button>
            ))}
          </div>
        </div>

        {/* SPECIAL SECTIONS (3 KOTAK BAWAH) */}
        <div>
            <h3 className="text-slate-800 dark:text-white font-bold text-lg mb-6 flex items-center gap-2 px-1">
                <span className="w-1.5 h-6 rounded-full bg-indigo-500"></span> Resource Tambahan
            </h3>
            <div className="grid md:grid-cols-3 gap-6">
                
                {/* Card 1: Rekap Kasus */}
                <div className="group relative bg-white dark:bg-slate-900 p-6 rounded-[2rem] border border-slate-200 dark:border-white/5 hover:border-indigo-500/30 transition-all cursor-pointer overflow-hidden shadow-sm hover:shadow-xl">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2"></div>
                    <div className="relative z-10">
                        <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 rounded-2xl flex items-center justify-center mb-4">
                            <FolderOpen size={24} />
                        </div>
                        <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Rekap Kasus Batch</h4>
                        <p className="text-slate-500 text-sm">Daftar kasus OSCE yang keluar di setiap periode UKMPPD.</p>
                    </div>
                </div>

                {/* Card 2: Analisis 10 Tahun */}
                <div className="group relative bg-slate-900 dark:bg-black p-6 rounded-[2rem] border border-slate-800 dark:border-white/10 hover:border-amber-500/30 transition-all cursor-pointer overflow-hidden shadow-md hover:shadow-2xl">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/20 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2"></div>
                    <div className="relative z-10">
                        <div className="w-12 h-12 bg-white/10 text-amber-400 rounded-2xl flex items-center justify-center mb-4 backdrop-blur-md">
                            <BarChart2 size={24} />
                        </div>
                        <h4 className="text-lg font-bold text-white mb-2">Analisis 2016-2025</h4>
                        <p className="text-slate-400 text-sm">Data analitik tren penyakit tersering selama 10 tahun terakhir.</p>
                    </div>
                </div>

                {/* Card 3: E-Book & Materi */}
                <div className="group relative bg-white dark:bg-slate-900 p-6 rounded-[2rem] border border-slate-200 dark:border-white/5 hover:border-teal-500/30 transition-all cursor-pointer overflow-hidden shadow-sm hover:shadow-xl">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-teal-500/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2"></div>
                    <div className="relative z-10">
                        <div className="w-12 h-12 bg-teal-50 dark:bg-teal-900/20 text-teal-600 rounded-2xl flex items-center justify-center mb-4">
                            <Library size={24} />
                        </div>
                        <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Perpustakaan Digital</h4>
                        <p className="text-slate-500 text-sm">Kumpulan E-Book, guideline, dan video pembelajaran OSCE.</p>
                    </div>
                </div>

            </div>
        </div>

      </div>
    );
  }

  // ==========================================
  // VIEW 2: MODE SELECT (Checklist vs Case)
  // ==========================================
  if (view === 'MODE_SELECT') {
    return (
      <div className="animate-in slide-in-from-right duration-500 px-4 pb-24 max-w-5xl mx-auto pt-6">
        
        <button onClick={() => setView('HOME')} className="mb-8 flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors bg-white dark:bg-white/5 px-4 py-2 rounded-full w-fit border border-slate-200 dark:border-white/10">
          <ArrowLeft size={16} /> Kembali ke Home
        </button>

        <div className="text-center mb-12">
          <div className="inline-flex p-6 rounded-[2rem] bg-white dark:bg-slate-900 text-teal-600 mb-6 shadow-xl shadow-teal-500/10 border border-slate-100 dark:border-white/10">
            {getIcon(currentStation.icon, 48)}
          </div>
          <h1 className="text-4xl font-black text-slate-900 dark:text-white mb-3 tracking-tight">{currentStation.title}</h1>
          <p className="text-slate-500 dark:text-slate-400 max-w-lg mx-auto text-lg leading-relaxed">{currentStation.description}</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Card Checklist */}
          <div onClick={() => setView('CHECKLIST_TOPIC_SELECT')} className="group relative bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 p-10 rounded-[2.5rem] cursor-pointer transition-all hover:-translate-y-2 hover:shadow-2xl hover:shadow-teal-500/10 overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500/5 rounded-full blur-3xl group-hover:bg-teal-500/10 transition-all"></div>
            <div className="relative z-10">
              <div className="w-16 h-16 bg-teal-50 dark:bg-teal-900/20 text-teal-600 rounded-2xl flex items-center justify-center mb-6 shadow-sm"><CheckCircle size={32} /></div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Latihan Skill</h3>
              <p className="text-slate-500 text-sm mb-8 leading-relaxed">Panduan langkah demi langkah untuk tindakan prosedural (Ceklis).</p>
              <span className="text-teal-600 font-bold text-sm flex items-center gap-2 group-hover:gap-3 transition-all">Pilih Tindakan <ChevronRight size={16} /></span>
            </div>
          </div>

          {/* Card Bedah Kasus */}
          <div onClick={() => setView('CASE_LIBRARY')} className="group relative bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 p-10 rounded-[2.5rem] cursor-pointer transition-all hover:-translate-y-2 hover:shadow-2xl hover:shadow-orange-500/10 overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/5 rounded-full blur-3xl group-hover:bg-orange-500/10 transition-all"></div>
            <div className="relative z-10">
              <div className="w-16 h-16 bg-orange-50 dark:bg-orange-900/20 text-orange-600 rounded-2xl flex items-center justify-center mb-6 shadow-sm"><BookOpen size={32} /></div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Bedah Kasus</h3>
              <p className="text-slate-500 text-sm mb-8 leading-relaxed">Pelajari alur diagnosis dan tatalaksana penyakit tersering.</p>
              <span className="text-orange-600 font-bold text-sm flex items-center gap-2 group-hover:gap-3 transition-all">Buka Perpustakaan <ChevronRight size={16} /></span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // VIEW 3: CHECKLIST TOPIC SELECT (NEW LAYER!)
  // ==========================================
  if (view === 'CHECKLIST_TOPIC_SELECT') {
    return (
        <div className="animate-in slide-in-from-right duration-500 px-4 pb-24 max-w-4xl mx-auto pt-6">
            <button onClick={() => setView('MODE_SELECT')} className="mb-8 flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors bg-white dark:bg-white/5 px-4 py-2 rounded-full w-fit border border-slate-200 dark:border-white/10">
                <ArrowLeft size={16} /> Kembali ke Mode
            </button>

            <div className="mb-10">
                <h1 className="text-3xl font-black text-slate-900 dark:text-white mb-2">Pilih Tindakan</h1>
                <p className="text-slate-500">Daftar keterampilan klinis untuk stase {currentStation.title}</p>
            </div>

            <div className="grid gap-4">
                {currentStation.sections.length === 0 ? (
                    <div className="text-center py-20 bg-slate-50 dark:bg-slate-900/50 rounded-[2rem] border border-dashed border-slate-300">
                        <p className="text-slate-400">Belum ada data checklist untuk stase ini.</p>
                    </div>
                ) : (
                    currentStation.sections.map((section, idx) => (
                        <div 
                            key={idx}
                            onClick={() => { setActiveSectionIdx(idx); setView('CHECKLIST_RUN'); }}
                            className="group bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 p-6 rounded-[1.5rem] cursor-pointer hover:border-teal-500/50 hover:shadow-lg transition-all flex items-center justify-between"
                        >
                            <div className="flex items-center gap-6">
                                <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center font-bold text-slate-500 group-hover:bg-teal-500 group-hover:text-white transition-colors">
                                    {idx + 1}
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg text-slate-900 dark:text-white group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">{section.title}</h3>
                                    <p className="text-xs text-slate-400">Klik untuk mulai latihan</p>
                                </div>
                            </div>
                            <div className="w-10 h-10 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-400 group-hover:bg-white dark:group-hover:bg-slate-700 transition-all">
                                <ChevronRight size={20} />
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
  }

  // ==========================================
  // VIEW 4: CHECKLIST RUNNER (THE ACTUAL CHECKLIST)
  // ==========================================
  if (view === 'CHECKLIST_RUN' && activeSectionIdx !== null) {
    const activeSectionData = currentStation.sections[activeSectionIdx];
    return (
      <div className="animate-in slide-in-from-right duration-500 h-full flex flex-col bg-slate-50 dark:bg-slate-950">
        
        {/* Floating Header */}
        <div className="px-4 pt-4 pb-2 sticky top-0 z-20">
            <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200 dark:border-white/10 p-3 rounded-full flex justify-between items-center shadow-lg">
                <div className="flex items-center gap-3 pl-2">
                    <button onClick={() => setView('CHECKLIST_TOPIC_SELECT')} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"><ArrowLeft size={20} /></button>
                    <div>
                        <h2 className="font-bold text-slate-900 dark:text-white text-sm line-clamp-1">{activeSectionData.title}</h2>
                        <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Checklist Mode</p>
                    </div>
                </div>
                <button onClick={() => setScriptMode(!scriptMode)} className={`px-4 py-2 rounded-full text-xs font-bold border flex items-center gap-2 transition-all ${scriptMode ? 'bg-teal-500 text-white border-teal-500 shadow-md shadow-teal-500/30' : 'bg-transparent border-slate-200 text-slate-500'}`}>
                    <Mic size={14} /> {scriptMode ? 'Script ON' : 'Script OFF'}
                </button>
            </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar pb-32 max-w-4xl mx-auto w-full">
           <RenderChecklistItems section={activeSectionData} />
           
           <div className="mt-16 text-center">
            <button onClick={() => setView('CHECKLIST_TOPIC_SELECT')} className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-10 py-4 rounded-2xl font-bold shadow-xl hover:scale-105 transition-all">
              Selesai Latihan
            </button>
           </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // VIEW 5: CASE LIBRARY
  // ==========================================
  if (view === 'CASE_LIBRARY') {
    const cases = currentStation.cases || [];
    const filteredCases = cases.filter((c: any) => c.title.toLowerCase().includes(searchQuery.toLowerCase()));

    return (
      <div className="animate-in slide-in-from-right duration-500 h-full flex flex-col bg-slate-50 dark:bg-slate-950">
        <div className="px-4 pt-4 sticky top-0 z-20 pb-4 bg-slate-50 dark:bg-slate-950/90 backdrop-blur-md">
          <div className="max-w-4xl mx-auto">
            <button onClick={() => setView('MODE_SELECT')} className="mb-4 flex items-center gap-2 text-slate-500 hover:text-teal-600 text-xs font-bold uppercase tracking-wider transition-colors">
              <ArrowLeft size={16} /> Kembali
            </button>
            <h1 className="text-2xl font-black text-slate-900 dark:text-white mb-6">Perpustakaan Kasus</h1>
            
            {/* Search Bar iOS Style */}
            <div className="relative group">
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                  <Search size={20} className="text-slate-400 group-focus-within:text-teal-500 transition-colors" />
              </div>
              <input 
                  type="text" 
                  placeholder="Cari penyakit atau gejala..." 
                  className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all shadow-sm" 
                  value={searchQuery} 
                  onChange={(e) => setSearchQuery(e.target.value)} 
              />
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-4 custom-scrollbar pb-24">
          <div className="max-w-4xl mx-auto space-y-4">
            {filteredCases.length === 0 ? <div className="text-center py-20 text-slate-400 text-sm">Tidak ditemukan kasus yang cocok.</div> : filteredCases.map((cs: any) => (
              <div key={cs.id} onClick={() => { setActiveCase(cs); setView('CASE_DETAIL'); }} className="group bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-3xl cursor-pointer hover:border-orange-500/30 hover:shadow-xl hover:shadow-orange-500/5 transition-all">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="font-bold text-lg text-slate-800 dark:text-slate-200 group-hover:text-orange-500 transition-colors line-clamp-1">{cs.title}</h3>
                  <div className="flex items-center gap-1 bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 px-2 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider border border-orange-100 dark:border-orange-900/30">
                    <Flame size={10} fill="currentColor" /> {cs.frequency}
                  </div>
                </div>
                <p className="text-sm text-slate-500 line-clamp-2 leading-relaxed">{cs.summary}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // VIEW 6: CASE DETAIL (CLINICAL FLOW FIXED)
  // ==========================================
  if (view === 'CASE_DETAIL' && activeCase) {
    const hasNewFormat = activeCase.content.tatalaksana && activeCase.content.diagnosis;
    return (
      <div className="animate-in slide-in-from-bottom duration-500 h-full flex flex-col bg-slate-50 dark:bg-slate-950 overflow-hidden">
        
        {/* Header Sticky */}
        <div className="px-4 pt-4 sticky top-0 z-30 pb-2 bg-slate-50/90 dark:bg-slate-950/90 backdrop-blur-md border-b border-slate-100 dark:border-white/5">
            <div className="max-w-4xl mx-auto flex justify-between items-center">
                <div className="flex flex-col gap-1">
                    {/* TOMBOL KEMBALI DI ATAS JUDUL (SESUAI REQUEST) */}
                    <button onClick={() => setView('CASE_LIBRARY')} className="flex items-center gap-2 text-[10px] font-bold text-slate-500 hover:text-slate-800 dark:hover:text-white uppercase tracking-widest transition-colors w-fit">
                        <ArrowLeft size={12} /> Kembali ke Library
                    </button>
                    <h2 className="text-sm font-black text-slate-900 dark:text-white line-clamp-1">{activeCase.title}</h2>
                </div>
                
                <button 
                    onClick={markAsCompleted}
                    disabled={isCompleted}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all active:scale-95 shadow-sm ${
                    isCompleted 
                        ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border border-green-200 dark:border-green-800 cursor-default' 
                        : 'bg-indigo-600 text-white hover:bg-indigo-700'
                    }`}
                >
                    {isCompleted ? <><CheckCircle size={14}/> Selesai</> : <><BookmarkCheck size={14}/> Tandai</>}
                </button>
            </div>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar pb-32 w-full pt-6">
          <div className="px-4 md:px-10 max-w-4xl mx-auto space-y-8">
            
            {/* 0. SUMMARY HERO */}
            <div className="text-center mb-8">
                 <div className="flex justify-center gap-2 mb-4">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-orange-600 bg-orange-50 dark:bg-orange-900/30 dark:text-orange-400 px-3 py-1 rounded-full border border-orange-100 dark:border-orange-800">SKDI {activeCase.level_skdi || '4A'}</span>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-teal-600 bg-teal-50 dark:bg-teal-900/30 dark:text-teal-400 px-3 py-1 rounded-full border border-teal-100 dark:border-teal-800">Freq: {'⭐'.repeat(activeCase.frequency)}</span>
                 </div>
                 <h1 className="text-2xl md:text-4xl font-black text-slate-900 dark:text-white mb-3 leading-tight">{activeCase.title}</h1>
                 <p className="text-slate-500 dark:text-slate-400 text-sm md:text-lg leading-relaxed">{activeCase.summary}</p>
            </div>

            {hasNewFormat ? (
                <>
                    {/* 1. ETIOLOGI & FAKTOR RISIKO */}
                    {(activeCase.content as any).etiologi && (
                        <div className="bg-white dark:bg-slate-900 rounded-[2rem] p-8 shadow-sm border border-slate-100 dark:border-white/5">
                            <h3 className="text-sm font-black text-rose-500 uppercase tracking-widest mb-4 flex items-center gap-2 border-b border-slate-100 dark:border-white/5 pb-4">
                                <Siren size={18} /> Etiologi & Faktor Risiko
                            </h3>
                            <div className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed whitespace-pre-line">
                                {(activeCase.content as any).etiologi}
                            </div>
                        </div>
                    )}

                    {/* 2. ANAMNESIS */}
                    <div className="bg-white dark:bg-slate-900 rounded-[2rem] p-8 shadow-sm border border-slate-100 dark:border-white/5">
                        <h3 className="text-sm font-black text-teal-500 uppercase tracking-widest mb-4 flex items-center gap-2 border-b border-slate-100 dark:border-white/5 pb-4">
                            <Mic size={18} /> Anamnesis Kunci
                        </h3>
                        <ul className="space-y-3">
                            {activeCase.content.anamnesis.list_pertanyaan?.map((q: string, i: number) => (
                                <li key={i} className="flex gap-3 text-slate-700 dark:text-slate-300 text-sm leading-relaxed">
                                    <span className="text-teal-500 font-bold">•</span> {q}
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* 3. PEMERIKSAAN FISIK */}
                    <div className="bg-white dark:bg-slate-900 rounded-[2rem] p-8 shadow-sm border border-slate-100 dark:border-white/5">
                        <h3 className="text-sm font-black text-blue-500 uppercase tracking-widest mb-4 flex items-center gap-2 border-b border-slate-100 dark:border-white/5 pb-4">
                            <Activity size={18} /> Pemeriksaan Fisik
                        </h3>
                        <div className="space-y-3">
                            {activeCase.content.pemeriksaan_fisik.map((item: string, i: number) => (
                                <div key={i} className="flex gap-3 items-start bg-blue-50 dark:bg-blue-900/10 p-3 rounded-xl border border-blue-100 dark:border-blue-800/20">
                                    <CheckCircle size={16} className="text-blue-500 shrink-0 mt-0.5" />
                                    <span className="text-slate-700 dark:text-slate-200 text-sm font-medium">{item}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* 4. PEMERIKSAAN PENUNJANG */}
                    {(activeCase.content as any).pemeriksaan_penunjang && (
                        <div className="bg-white dark:bg-slate-900 rounded-[2rem] p-8 shadow-sm border border-slate-100 dark:border-white/5">
                            <h3 className="text-sm font-black text-purple-500 uppercase tracking-widest mb-4 flex items-center gap-2 border-b border-slate-100 dark:border-white/5 pb-4">
                                <Search size={18} /> Pemeriksaan Penunjang
                            </h3>
                            <ul className="list-disc list-inside space-y-2 text-slate-700 dark:text-slate-300 text-sm marker:text-purple-500">
                                {Array.isArray((activeCase.content as any).pemeriksaan_penunjang) 
                                    ? (activeCase.content as any).pemeriksaan_penunjang.map((item: string, i: number) => <li key={i}>{item}</li>)
                                    : <li>{(activeCase.content as any).pemeriksaan_penunjang}</li>
                                }
                            </ul>
                        </div>
                    )}

                    {/* 5. TATALAKSANA */}
                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="bg-white dark:bg-slate-900 rounded-[2rem] p-6 shadow-sm border border-slate-100 dark:border-white/5">
                            <h3 className="text-sm font-black text-emerald-600 uppercase tracking-widest mb-4 flex items-center gap-2">
                                <Pill size={18} /> Farmakologi
                            </h3>
                            <ul className="space-y-2">
                                {activeCase.content.tatalaksana.farmakologi.map((rx: string, i: number) => (
                                    <li key={i} className="text-sm text-slate-700 dark:text-slate-300 bg-emerald-50 dark:bg-emerald-900/10 p-3 rounded-xl border border-emerald-100 dark:border-emerald-800/20">
                                        {rx}
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="bg-white dark:bg-slate-900 rounded-[2rem] p-6 shadow-sm border border-slate-100 dark:border-white/5">
                            <h3 className="text-sm font-black text-orange-600 uppercase tracking-widest mb-4 flex items-center gap-2">
                                <ClipboardList size={18} /> Non-Farmako & Edukasi
                            </h3>
                            <ul className="space-y-2">
                                {activeCase.content.tatalaksana.non_farmakologi.map((edu: string, i: number) => (
                                    <li key={i} className="text-sm text-slate-700 dark:text-slate-300 bg-orange-50 dark:bg-orange-900/10 p-3 rounded-xl border border-orange-100 dark:border-orange-800/20">
                                        {edu}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/* 6. SIMULASI RESEP (Clean Medical Paper) */}
                    <div className="bg-white text-slate-900 rounded-[1.5rem] p-8 shadow-xl border border-slate-200 relative overflow-hidden">
                        {/* Header Kertas Resep */}
                        <div className="flex justify-between items-start border-b-2 border-slate-100 pb-4 mb-6">
                            <div>
                                <h3 className="font-serif font-bold text-xl text-slate-800">dr. MedPrep</h3>
                                <p className="text-[10px] text-slate-400 uppercase tracking-widest mt-1">SIP: 123/456/789</p>
                            </div>
                            <div className="text-right">
                                <PenTool size={20} className="text-slate-300 ml-auto mb-1" />
                                <p className="text-xs text-slate-400">Surakarta, {new Date().toLocaleDateString()}</p>
                            </div>
                        </div>

                        {/* Isi Resep */}
                        <div className="font-serif text-base space-y-4 mb-8 min-h-[150px]">
                            {activeCase.content.tatalaksana.farmakologi.map((rx: string, i: number) => (
                                <div key={i} className="flex gap-2 items-start group">
                                    <span className="font-bold text-slate-900 text-xl italic select-none">R/</span>
                                    <p className="font-medium text-slate-800 mt-1 border-b border-transparent group-hover:border-slate-200 transition-colors w-full pb-1">{rx}</p>
                                </div>
                            ))}
                        </div>

                        {/* Footer Kertas */}
                        <div className="flex justify-between items-end pt-4 border-t-2 border-slate-100">
                            <div className="text-xs text-slate-400">
                                <p>Pro: Pasien (Usia)</p>
                            </div>
                            <div className="h-16 w-32 border-b border-slate-300"></div>
                        </div>
                    </div>

                    {/* 7. OSCE PRO TIP */}
                    <div className="bg-gradient-to-br from-slate-800 to-black p-8 rounded-[2rem] border border-slate-700 relative overflow-hidden text-white shadow-2xl">
                        <div className="absolute top-0 right-0 p-32 bg-orange-500/20 rounded-full blur-3xl"></div>
                        <div className="relative z-10">
                            <div className="flex items-center gap-3 mb-4 text-orange-400">
                                <Flame size={20} fill="currentColor" />
                                <h4 className="font-black uppercase text-xs tracking-widest">OSCE Pro Tip</h4>
                            </div>
                            <p className="text-lg font-medium italic leading-relaxed text-slate-200">
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