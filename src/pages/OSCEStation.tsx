import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, Brain, Droplet, Wind, Heart, Utensils, Baby, Zap, Shield, 
  Activity, Sun, Smile, Eye, CheckCircle, ChevronRight, Mic, 
  BookOpen, Search, Flame, Stethoscope, LayoutGrid, 
  ChevronDown, Sparkles, Siren, BookmarkCheck, Info,
  Thermometer, Pill, FileText, ClipboardList, PenTool,
  BarChart2, Library, FolderOpen, Layers
} from 'lucide-react';
import { STATION_DATA, SYSTEM_LIST, CaseStudy } from '../data/osce_data'; // Pastikan path import benar
import toast from 'react-hot-toast';

// VIEW STATE NAVIGATION
type ViewState = 'HOME' | 'MODE_SELECT' | 'CHECKLIST_TOPIC_SELECT' | 'CHECKLIST_RUN' | 'CASE_LIBRARY' | 'CASE_DETAIL';

export default function OSCEStation() {
  // --- STATE ---
  const [view, setView] = useState<ViewState>('HOME');
  const [activeStationId, setActiveStationId] = useState<string | null>(null);
  const [activeCase, setActiveCase] = useState<CaseStudy | null>(null);
  const [activeSectionIdx, setActiveSectionIdx] = useState<number | null>(null); 
  
  const [searchQuery, setSearchQuery] = useState('');
  const [scriptMode, setScriptMode] = useState(true);
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
      toast.success("Kasus selesai!", { style: { borderRadius: '12px', background: '#333', color: '#fff', fontSize: '12px' } });
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

  // --- RENDERERS (COMPACT CHECKLIST) ---
  const RenderChecklistItems = ({ section }: { section: any }) => (
    <div className="space-y-3">
      {section.items?.map((item: any, idx: number) => (
        <div key={idx} className="group bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 p-4 rounded-xl flex gap-3 hover:border-teal-500/30 transition-all">
           <div className={`mt-0.5 shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${item.isCritical ? 'border-red-500 bg-red-50 dark:bg-red-900/20' : 'border-slate-300 dark:border-slate-700 group-hover:border-teal-400'}`}>
             {item.isCritical && <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>}
           </div>
           <div className="flex-1">
             <div className="flex items-center gap-2 flex-wrap mb-1">
               <span className={`font-bold text-sm leading-tight ${item.isCritical ? 'text-red-600 dark:text-red-400' : 'text-slate-800 dark:text-slate-200'}`}>{item.label}</span>
               {item.isCritical && <span className="text-[8px] bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-300 px-1.5 py-0.5 rounded-full font-black tracking-wider">CRITICAL</span>}
             </div>
             {item.description && <p className="text-xs text-slate-500 leading-snug">{item.description}</p>}
             
             {scriptMode && (
               <div className="mt-2 space-y-1.5">
                 {item.script && (
                    <div className="bg-slate-50 dark:bg-slate-800/50 p-2 rounded-lg text-xs italic text-slate-600 dark:text-slate-300 border border-slate-100 dark:border-white/5 flex gap-2">
                     <Mic size={12} className="shrink-0 mt-0.5 text-teal-500" /> 
                     <span>"{item.script}"</span>
                   </div>
                 )}
                 {item.insight && (
                   <div className="bg-emerald-50 dark:bg-emerald-900/10 p-2 rounded-lg text-xs text-emerald-700 dark:text-emerald-400 flex gap-2 border border-emerald-100 dark:border-emerald-900/30">
                      <Sparkles size={12} className="shrink-0 mt-0.5" /> 
                      <span className="font-medium">{item.insight}</span>
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
  // VIEW 1: HOME (Compact)
  // ==========================================
  if (view === 'HOME') {
    return (
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-24 max-w-7xl mx-auto px-4 md:px-6">
        
        {/* HERO COMPACT */}
        <div className="relative bg-slate-900 dark:bg-black rounded-[2rem] p-6 overflow-hidden shadow-xl">
          <div className="absolute top-0 right-0 w-48 h-48 bg-teal-500/20 rounded-full blur-[60px]"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-600/20 rounded-full blur-[40px]"></div>
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
             <div>
                <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-teal-500/20 rounded-xl text-teal-400"><Stethoscope size={24} /></div>
                    <h1 className="text-2xl font-black text-white tracking-tight">OSCE Center</h1>
                </div>
                <p className="text-slate-400 text-xs md:text-sm max-w-lg leading-snug">Pusat simulasi klinis. Pilih stase untuk akses checklist tindakan & bedah kasus.</p>
             </div>
          </div>
        </div>

        {/* GRID STASE COMPACT */}
        <div>
          <h3 className="text-slate-800 dark:text-white font-bold text-sm mb-4 flex items-center gap-2 px-1">
            <span className="w-1 h-4 rounded-full bg-teal-500"></span> Pilih Stase Klinis
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {SYSTEM_LIST.map((sys) => (
              <button
                key={sys.id}
                onClick={() => { setActiveStationId(sys.id); setView('MODE_SELECT'); }}
                className="group relative bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 p-3 h-20 rounded-2xl flex flex-col items-center justify-center text-center transition-all hover:border-teal-500/50 hover:shadow-md active:scale-95"
              >
                <div className="absolute inset-0 bg-teal-50/50 dark:bg-teal-900/10 opacity-0 group-hover:opacity-100 rounded-2xl transition-opacity"></div>
                <h3 className={`font-bold text-xs transition-colors relative z-10 ${sys.id === 'gadar' ? 'text-red-600 dark:text-red-400' : 'text-slate-600 dark:text-slate-300 group-hover:text-teal-600 dark:group-hover:text-teal-400'}`}>
                    {sys.label}
                </h3>
              </button>
            ))}
          </div>
        </div>

        {/* RESOURCES COMPACT */}
        <div>
            <h3 className="text-slate-800 dark:text-white font-bold text-sm mb-4 flex items-center gap-2 px-1">
                <span className="w-1 h-4 rounded-full bg-indigo-500"></span> Resource Tambahan
            </h3>
            <div className="grid md:grid-cols-3 gap-4">
                {[
                    { icon: FolderOpen, color: 'text-indigo-600', bg: 'bg-indigo-50 dark:bg-indigo-900/20', title: 'Rekap Kasus', desc: 'Daftar kasus per batch UKMPPD.' },
                    { icon: BarChart2, color: 'text-amber-500', bg: 'bg-amber-50 dark:bg-amber-900/20', title: 'Statistik 10 Tahun', desc: 'Tren penyakit tersering 2016-2025.' },
                    { icon: Library, color: 'text-teal-600', bg: 'bg-teal-50 dark:bg-teal-900/20', title: 'Perpustakaan', desc: 'Guideline & Video skill lab.' }
                ].map((item, i) => (
                    <div key={i} className="group bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-white/5 hover:border-indigo-500/30 transition-all cursor-pointer flex items-center gap-4">
                        <div className={`w-10 h-10 ${item.bg} ${item.color} rounded-xl flex items-center justify-center shrink-0`}><item.icon size={20} /></div>
                        <div><h4 className="text-sm font-bold text-slate-900 dark:text-white">{item.title}</h4><p className="text-[10px] text-slate-500 leading-snug">{item.desc}</p></div>
                    </div>
                ))}
            </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // VIEW 2: MODE SELECT
  // ==========================================
  if (view === 'MODE_SELECT') {
    return (
      <div className="animate-in slide-in-from-right duration-500 px-4 pb-24 max-w-4xl mx-auto pt-4">
        <button onClick={() => setView('HOME')} className="mb-6 flex items-center gap-2 text-[10px] font-bold text-slate-500 hover:text-slate-900 dark:hover:text-white bg-white dark:bg-white/5 px-3 py-1.5 rounded-full w-fit border border-slate-200 dark:border-white/10">
          <ArrowLeft size={12} /> HOME
        </button>

        <div className="text-center mb-8">
          <div className="inline-flex p-4 rounded-2xl bg-white dark:bg-slate-900 text-teal-600 mb-3 shadow-lg border border-slate-100 dark:border-white/10">{getIcon(currentStation.icon, 32)}</div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white mb-1">{currentStation.title}</h1>
          <p className="text-slate-500 text-xs md:text-sm max-w-md mx-auto leading-snug">{currentStation.description}</p>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div onClick={() => setView('CHECKLIST_TOPIC_SELECT')} className="group bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 p-6 rounded-[2rem] cursor-pointer hover:border-teal-500/30 hover:shadow-lg transition-all relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-teal-500/5 rounded-full blur-2xl group-hover:bg-teal-500/10"></div>
            <div className="relative z-10 flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-teal-50 dark:bg-teal-900/20 text-teal-600 rounded-xl flex items-center justify-center mb-3"><CheckCircle size={24} /></div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">Latihan Skill</h3>
              <p className="text-slate-500 text-xs mb-4 leading-snug">Checklist prosedural langkah demi langkah.</p>
              <span className="text-teal-600 font-bold text-xs flex items-center gap-1">Mulai <ChevronRight size={14} /></span>
            </div>
          </div>

          <div onClick={() => setView('CASE_LIBRARY')} className="group bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 p-6 rounded-[2rem] cursor-pointer hover:border-orange-500/30 hover:shadow-lg transition-all relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/5 rounded-full blur-2xl group-hover:bg-orange-500/10"></div>
            <div className="relative z-10 flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-orange-50 dark:bg-orange-900/20 text-orange-600 rounded-xl flex items-center justify-center mb-3"><BookOpen size={24} /></div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">Bedah Kasus</h3>
              <p className="text-slate-500 text-xs mb-4 leading-snug">Alur diagnosis & tatalaksana penyakit.</p>
              <span className="text-orange-600 font-bold text-xs flex items-center gap-1">Buka <ChevronRight size={14} /></span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // VIEW 3: CHECKLIST TOPIC (Compact List)
  // ==========================================
  if (view === 'CHECKLIST_TOPIC_SELECT') {
    return (
        <div className="animate-in slide-in-from-right duration-500 px-4 pb-24 max-w-3xl mx-auto pt-4">
            <button onClick={() => setView('MODE_SELECT')} className="mb-6 flex items-center gap-2 text-[10px] font-bold text-slate-500 bg-white dark:bg-white/5 px-3 py-1.5 rounded-full w-fit border border-slate-200">
                <ArrowLeft size={12} /> KEMBALI
            </button>
            <h1 className="text-xl font-black text-slate-900 dark:text-white mb-4">Daftar Tindakan</h1>
            <div className="grid gap-3">
                {currentStation.sections.length === 0 ? (
                    <div className="text-center py-10 bg-slate-50 border border-dashed border-slate-300 rounded-xl text-xs text-slate-400">Belum ada data.</div>
                ) : (
                    currentStation.sections.map((section, idx) => (
                        <div key={idx} onClick={() => { setActiveSectionIdx(idx); setView('CHECKLIST_RUN'); }} className="group bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 p-4 rounded-xl cursor-pointer hover:border-teal-500/50 hover:shadow-md transition-all flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="w-8 h-8 bg-slate-100 dark:bg-slate-800 rounded-lg flex items-center justify-center font-bold text-xs text-slate-500 group-hover:bg-teal-500 group-hover:text-white transition-colors">{idx + 1}</div>
                                <h3 className="font-bold text-sm text-slate-800 dark:text-white group-hover:text-teal-600 transition-colors">{section.title}</h3>
                            </div>
                            <ChevronRight size={16} className="text-slate-300 group-hover:text-teal-500" />
                        </div>
                    ))
                )}
            </div>
        </div>
    );
  }

  // ==========================================
  // VIEW 4: CHECKLIST RUNNER
  // ==========================================
  if (view === 'CHECKLIST_RUN' && activeSectionIdx !== null) {
    const activeSectionData = currentStation.sections[activeSectionIdx];
    return (
      <div className="animate-in slide-in-from-right duration-500 h-full flex flex-col bg-slate-50 dark:bg-slate-950">
        <div className="px-4 pt-4 pb-2 sticky top-0 z-20">
            <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border border-slate-200 dark:border-white/10 p-2 rounded-full flex justify-between items-center shadow-sm">
                <div className="flex items-center gap-3 pl-1">
                    <button onClick={() => setView('CHECKLIST_TOPIC_SELECT')} className="p-1.5 hover:bg-slate-100 rounded-full"><ArrowLeft size={18} /></button>
                    <div><h2 className="font-bold text-slate-900 dark:text-white text-xs line-clamp-1">{activeSectionData.title}</h2></div>
                </div>
                <button onClick={() => setScriptMode(!scriptMode)} className={`px-3 py-1.5 rounded-full text-[10px] font-bold border flex items-center gap-1 transition-all ${scriptMode ? 'bg-teal-500 text-white border-teal-500' : 'bg-transparent border-slate-200 text-slate-500'}`}>
                    <Mic size={12} /> {scriptMode ? 'Script ON' : 'OFF'}
                </button>
            </div>
        </div>
        <div className="flex-1 overflow-y-auto p-4 custom-scrollbar pb-32 max-w-3xl mx-auto w-full">
           <RenderChecklistItems section={activeSectionData} />
           <div className="mt-8 text-center">
              <button onClick={() => setView('CHECKLIST_TOPIC_SELECT')} className="bg-slate-900 text-white px-8 py-3 rounded-xl font-bold text-xs shadow-lg hover:scale-105 transition-all">Selesai Latihan</button>
           </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // VIEW 5: CASE LIBRARY (Compact)
  // ==========================================
  if (view === 'CASE_LIBRARY') {
    const cases = currentStation.cases || [];
    const filteredCases = cases.filter((c: any) => c.title.toLowerCase().includes(searchQuery.toLowerCase()));

    return (
      <div className="animate-in slide-in-from-right duration-500 h-full flex flex-col bg-slate-50 dark:bg-slate-950">
        <div className="px-4 pt-4 sticky top-0 z-20 pb-2 bg-slate-50/95 dark:bg-slate-950/95 backdrop-blur-md border-b border-slate-100 dark:border-white/5">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-3 mb-4">
                <button onClick={() => setView('MODE_SELECT')} className="p-2 bg-white border border-slate-200 rounded-full hover:bg-slate-100"><ArrowLeft size={16} /></button>
                <h1 className="text-lg font-black text-slate-900 dark:text-white">Perpustakaan Kasus</h1>
            </div>
            <div className="relative group">
              <Search size={16} className="absolute left-4 top-3.5 text-slate-400 group-focus-within:text-teal-500 transition-colors" />
              <input type="text" placeholder="Cari penyakit..." className="w-full pl-10 pr-4 py-3 rounded-xl bg-white border border-slate-200 text-sm focus:outline-none focus:border-teal-500 transition-all shadow-sm" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-4 custom-scrollbar pb-24 pt-4">
          <div className="max-w-4xl mx-auto space-y-3">
            {filteredCases.length === 0 ? <div className="text-center py-10 text-xs text-slate-400">Tidak ditemukan.</div> : filteredCases.map((cs: any) => (
              <div key={cs.id} onClick={() => { setActiveCase(cs); setView('CASE_DETAIL'); }} className="group bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 p-4 rounded-2xl cursor-pointer hover:border-orange-500/50 hover:shadow-md transition-all">
                <div className="flex justify-between items-start mb-1">
                  <h3 className="font-bold text-sm text-slate-800 dark:text-slate-200 group-hover:text-orange-500 transition-colors line-clamp-1">{cs.title}</h3>
                  <div className="flex items-center gap-1 bg-orange-50 text-orange-600 px-2 py-0.5 rounded text-[9px] font-bold border border-orange-100"><Flame size={8} fill="currentColor" /> {cs.frequency}</div>
                </div>
                <p className="text-xs text-slate-500 line-clamp-2 leading-snug">{cs.summary}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // VIEW 6: CASE DETAIL (SKIMMABLE & COMPACT)
  // ==========================================
  if (view === 'CASE_DETAIL' && activeCase) {
    const hasNewFormat = activeCase.content.tatalaksana && activeCase.content.diagnosis;
    
    return (
      <div className="animate-in slide-in-from-bottom duration-500 h-full flex flex-col bg-slate-50 dark:bg-slate-950 overflow-hidden">
        
        {/* Header Sticky */}
        <div className="px-4 pt-3 sticky top-0 z-30 pb-3 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-100 dark:border-white/5">
            <div className="max-w-3xl mx-auto flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <button onClick={() => setView('CASE_LIBRARY')} className="p-1.5 hover:bg-slate-100 rounded-full text-slate-500"><ArrowLeft size={18} /></button>
                    <h2 className="text-sm font-black text-slate-900 dark:text-white line-clamp-1">{activeCase.title}</h2>
                </div>
                <button onClick={markAsCompleted} disabled={isCompleted} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-bold transition-all active:scale-95 ${isCompleted ? 'bg-green-100 text-green-700 border border-green-200' : 'bg-slate-900 text-white hover:bg-slate-800'}`}>
                    {isCompleted ? <><CheckCircle size={12}/> Selesai</> : <><BookmarkCheck size={12}/> Tandai</>}
                </button>
            </div>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar pb-32 w-full pt-4">
          <div className="px-4 max-w-3xl mx-auto space-y-4">
            
            {/* 0. SUMMARY HERO (Smaller) */}
            <div className="text-center mb-6 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-100">
                 <div className="flex justify-center gap-2 mb-2">
                    <span className="text-[9px] font-bold uppercase tracking-widest text-orange-600 bg-orange-50 px-2 py-0.5 rounded border border-orange-100">SKDI {activeCase.level_skdi || '4A'}</span>
                    <span className="text-[9px] font-bold uppercase tracking-widest text-teal-600 bg-teal-50 px-2 py-0.5 rounded border border-teal-100">Freq: {activeCase.frequency}/5</span>
                 </div>
                 <h1 className="text-xl font-black text-slate-900 dark:text-white mb-2 leading-tight">{activeCase.title}</h1>
                 <p className="text-slate-500 text-xs leading-snug">{activeCase.summary}</p>
            </div>

            {hasNewFormat ? (
                <>
                    {/* 1. ETIOLOGI */}
                    {(activeCase.content as any).etiologi && (
                        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 shadow-sm border border-slate-100">
                           <h3 className="text-xs font-black text-rose-500 uppercase tracking-widest mb-3 flex items-center gap-2"><Siren size={14} /> Etiologi</h3>
                           <div className="text-slate-700 dark:text-slate-300 text-xs leading-snug whitespace-pre-line">{(activeCase.content as any).etiologi}</div>
                        </div>
                    )}

                    {/* 2. ANAMNESIS */}
                    <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 shadow-sm border border-slate-100">
                        <h3 className="text-xs font-black text-teal-500 uppercase tracking-widest mb-3 flex items-center gap-2"><Mic size={14} /> Anamnesis Kunci</h3>
                        <ul className="space-y-1.5">
                            {activeCase.content.anamnesis.list_pertanyaan?.map((q: string, i: number) => (
                                <li key={i} className="flex gap-2 text-slate-700 dark:text-slate-300 text-xs leading-snug">
                                    <span className="text-teal-500 font-bold">•</span> {q}
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* 3. PEMERIKSAAN FISIK */}
                    <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 shadow-sm border border-slate-100">
                        <h3 className="text-xs font-black text-blue-500 uppercase tracking-widest mb-3 flex items-center gap-2"><Activity size={14} /> Pemeriksaan Fisik</h3>
                        <div className="space-y-1.5">
                           {activeCase.content.pemeriksaan_fisik.map((item: string, i: number) => (
                                <div key={i} className="flex gap-2 items-start text-xs font-medium text-slate-700 bg-blue-50/50 p-2 rounded-lg border border-blue-50">
                                    <CheckCircle size={12} className="text-blue-500 shrink-0 mt-0.5" />
                                    <span>{item}</span>
                                </div>
                           ))}
                        </div>
                    </div>

                    {/* 4. PENUNJANG */}
                    {(activeCase.content as any).pemeriksaan_penunjang && (
                        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 shadow-sm border border-slate-100">
                            <h3 className="text-xs font-black text-purple-500 uppercase tracking-widest mb-3 flex items-center gap-2"><Search size={14} /> Penunjang</h3>
                            <ul className="list-disc list-inside space-y-1 text-slate-700 text-xs marker:text-purple-500">
                                {Array.isArray((activeCase.content as any).pemeriksaan_penunjang) 
                                    ? (activeCase.content as any).pemeriksaan_penunjang.map((item: string, i: number) => <li key={i}>{item}</li>)
                                    : <li>{(activeCase.content as any).pemeriksaan_penunjang}</li>
                                }
                            </ul>
                        </div>
                    )}

                    {/* 5. TATALAKSANA (Split Grid) */}
                    <div className="grid md:grid-cols-2 gap-4">
                        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 shadow-sm border border-slate-100">
                            <h3 className="text-xs font-black text-emerald-600 uppercase tracking-widest mb-3 flex items-center gap-2"><Pill size={14} /> Farmakologi</h3>
                            <ul className="space-y-1.5">
                                {activeCase.content.tatalaksana.farmakologi.map((rx: string, i: number) => (
                                    <li key={i} className="text-xs text-slate-700 bg-emerald-50 p-2 rounded-lg border border-emerald-100">{rx}</li>
                                ))}
                            </ul>
                        </div>
                        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 shadow-sm border border-slate-100">
                            <h3 className="text-xs font-black text-orange-600 uppercase tracking-widest mb-3 flex items-center gap-2"><ClipboardList size={14} /> Edukasi</h3>
                            <ul className="space-y-1.5">
                                {activeCase.content.tatalaksana.non_farmakologi.map((edu: string, i: number) => (
                                    <li key={i} className="text-xs text-slate-700 bg-orange-50 p-2 rounded-lg border border-orange-100">{edu}</li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/* 6. RESEP (Compact Medical Paper) */}
                    <div className="bg-white text-slate-900 rounded-2xl p-5 shadow-lg border border-slate-200 relative">
                        <div className="flex justify-between items-start border-b border-slate-200 pb-2 mb-3">
                            <div><h3 className="font-serif font-bold text-sm text-slate-800">dr. MedPrep</h3><p className="text-[8px] text-slate-400 uppercase tracking-widest">SIP: 123/456</p></div>
                            <div className="text-right"><PenTool size={16} className="text-slate-300 ml-auto" /></div>
                        </div>
                        <div className="font-serif text-sm space-y-2 mb-4">
                             {activeCase.content.tatalaksana.farmakologi.map((rx: string, i: number) => (
                                <div key={i} className="flex gap-1 items-start"><span className="font-bold text-slate-900 italic">R/</span><p className="font-medium text-slate-800 border-b border-dashed border-slate-200 w-full pb-0.5">{rx}</p></div>
                             ))}
                        </div>
                        <div className="flex justify-between items-end pt-2 border-t border-slate-200">
                           <p className="text-[10px] text-slate-400">Pro: Pasien</p>
                           <div className="h-8 w-20 border-b border-slate-300"></div>
                        </div>
                    </div>

                    {/* 7. PRO TIP */}
                    <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 text-white shadow-lg relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-20 bg-orange-500/10 rounded-full blur-2xl"></div>
                        <div className="relative z-10">
                            <div className="flex items-center gap-2 mb-2 text-orange-400">
                                <Flame size={16} fill="currentColor" />
                                <h4 className="font-black uppercase text-[10px] tracking-widest">OSCE Pro Tip</h4>
                            </div>
                            <p className="text-sm font-medium italic leading-snug text-slate-300">"{activeCase.content.osce_tip}"</p>
                        </div>
                    </div>
                </>
            ) : (
                <div className="text-center py-10 bg-slate-50 rounded-2xl border border-dashed border-slate-300"><p className="text-xs text-slate-500">Data belum lengkap.</p></div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return null;
}