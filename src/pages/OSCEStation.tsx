import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, Brain, Droplet, Wind, Heart, Utensils, Baby, Zap, Shield, 
  Activity, Sun, Smile, Eye, CheckCircle, ChevronRight, Mic, 
  BookOpen, Search, Flame, Stethoscope, LayoutGrid, 
  ChevronDown, Sparkles, Siren, BookmarkCheck, Info,
  Thermometer, Pill, FileText, ClipboardList, PenTool
} from 'lucide-react';
import { STATION_DATA, SYSTEM_LIST, CaseStudy, OSCESection } from '../data/osce_data';
import toast from 'react-hot-toast';

type ViewState = 'HOME' | 'MENU' | 'CHECKLIST_MODE' | 'CASE_LIBRARY' | 'CASE_DETAIL';

export default function OSCEStation() {
  // --- STATE ---
  const [view, setView] = useState<ViewState>('HOME');
  const [activeStationId, setActiveStationId] = useState<string | null>(null);
  const [activeCase, setActiveCase] = useState<CaseStudy | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [scriptMode, setScriptMode] = useState(true);
  const [expandedSections, setExpandedSections] = useState<{[key:number]: boolean}>({});
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

  // --- SUB-COMPONENTS (LEGO BLOCKS) ---

  // 1. Checklist Renderer
  const RenderChecklist = ({ section }: { section: any }) => (
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

  // 2. Standard Anamnesis
  const RenderStandardAnamnesis = ({ data }: { data: any }) => (
    <div className="grid md:grid-cols-2 gap-4">
      <div className="bg-blue-50 dark:bg-blue-900/20 p-5 rounded-3xl border border-blue-100 dark:border-blue-800/30">
        <h4 className="font-black text-blue-700 dark:text-blue-300 text-sm mb-3 flex items-center gap-2 uppercase tracking-wide">
          <Activity size={16} /> RPS (Sacred Seven)
        </h4>
        <div className="bg-white dark:bg-blue-950/50 p-3 rounded-xl border border-blue-100 dark:border-blue-900/20 mb-3">
            <p className="font-bold text-slate-800 dark:text-slate-100 text-base">"{data.keluhan_utama}"</p>
        </div>
        <ul className="list-disc list-inside text-sm text-slate-700 dark:text-slate-300 space-y-1 pl-1">
          {data.rps?.map((item: string, i: number) => <li key={i}>{item}</li>)}
        </ul>
      </div>
      <div className="space-y-4">
        <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200 dark:border-slate-800">
          <h4 className="font-bold text-slate-400 text-xs mb-3 uppercase tracking-widest">Riwayat Dahulu</h4>
          <div className="flex flex-wrap gap-2">
            {data.rpd?.map((item: string, i: number) => (
              <span key={i} className="text-xs bg-slate-100 dark:bg-slate-800 border dark:border-slate-700 px-3 py-1.5 rounded-lg text-slate-700 dark:text-slate-300 font-medium">{item}</span>
            ))}
          </div>
        </div>
        <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200 dark:border-slate-800">
           <h4 className="font-bold text-slate-400 text-xs mb-3 uppercase tracking-widest">Riwayat Keluarga</h4>
           <p className="text-sm text-slate-700 dark:text-slate-300 font-medium">{data.rpk?.join(', ')}</p>
        </div>
      </div>
      {scriptMode && data.script && (
         <div className="md:col-span-2 bg-amber-50 dark:bg-amber-900/10 p-4 rounded-2xl text-sm italic text-amber-800 dark:text-amber-200 border border-amber-100 dark:border-amber-900/30 flex gap-3 shadow-sm">
            <Mic size={18} className="shrink-0 mt-0.5" /> 
            <span><strong>Contoh:</strong> "{data.script}"</span>
         </div>
      )}
    </div>
  );

  // 3. Psychiatry
  const RenderPsychiatry = ({ data }: { data: any }) => (
    <div className="bg-violet-50 dark:bg-violet-900/10 border border-violet-100 dark:border-violet-800/30 rounded-3xl p-5">
       <div className="flex items-center gap-2 mb-4 text-violet-700 dark:text-violet-300 font-bold">
         <Brain size={20} /> Status Mental
       </div>
       <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="p-3 bg-white dark:bg-slate-900 rounded-2xl border border-violet-100 dark:border-violet-900/30">
             <span className="block font-bold text-violet-500 text-xs uppercase mb-1">Penampilan</span>
             <p className="text-slate-700 dark:text-slate-300">{data.penampilan?.join(', ')}</p>
          </div>
          <div className="p-3 bg-white dark:bg-slate-900 rounded-2xl border border-violet-100 dark:border-violet-900/30">
             <span className="block font-bold text-violet-500 text-xs uppercase mb-1">Persepsi</span>
             <p className="text-slate-700 dark:text-slate-300">{data.persepsi?.join(', ')}</p>
          </div>
          <div className="p-3 bg-white dark:bg-slate-900 rounded-2xl border border-violet-100 dark:border-violet-900/30 col-span-2">
             <span className="block font-bold text-violet-500 text-xs uppercase mb-1">Isi Pikir</span>
             <p className="text-slate-700 dark:text-slate-300">{data.pikiran?.join(', ')}</p>
          </div>
       </div>
    </div>
  );

  // 4. Pediatric
  const RenderPediatric = ({ data }: { data: any }) => (
    <div className="bg-pink-50 dark:bg-pink-900/10 border border-pink-100 dark:border-pink-800/30 rounded-3xl p-5">
       <div className="flex items-center gap-2 mb-4 text-pink-600 dark:text-pink-300 font-bold">
         <Baby size={20} /> Riwayat Kehamilan & Anak
       </div>
       <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
         <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-pink-100 dark:border-pink-900/20">
            <p className="text-xs font-bold text-pink-500 uppercase mb-2">Prenatal</p>
            <ul className="list-disc list-inside text-slate-700 dark:text-slate-300 space-y-1">
               {data.prenatal?.map((x:string, i:number) => <li key={i}>{x}</li>)}
            </ul>
         </div>
         <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-pink-100 dark:border-pink-900/20">
            <p className="text-xs font-bold text-pink-500 uppercase mb-2">Imunisasi</p>
            <ul className="list-disc list-inside text-slate-700 dark:text-slate-300 space-y-1">
               {data.postnatal?.map((x:string, i:number) => <li key={i}>{x}</li>)}
            </ul>
         </div>
       </div>
    </div>
  );

  const renderSectionContent = (section: OSCESection) => {
    switch (section.type) {
      case 'standard_anamnesis': return <RenderStandardAnamnesis data={section.data} />;
      case 'psychiatry_status': return <RenderPsychiatry data={section.data} />;
      case 'pediatric_history': return <RenderPediatric data={section.data} />;
      case 'checklist': return <RenderChecklist section={section} />;
      default: return <div className="text-red-500">Tipe data tidak dikenali</div>;
    }
  };

  // ==========================================
  // VIEW 1: HOME
  // ==========================================
  if (view === 'HOME') {
    return (
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-24 max-w-7xl mx-auto px-4 md:px-6">
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
               Simulasi ujian keterampilan klinis (OSCE) dengan panduan lengkap, checklist interaktif, dan skenario kasus nyata.
             </p>
          </div>
        </div>

        <div>
          <h3 className="text-slate-800 dark:text-white font-bold text-lg mb-6 flex items-center gap-2 px-1">
            <span className="w-1.5 h-6 rounded-full bg-teal-500"></span> Pilih Stase Klinis
          </h3>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {SYSTEM_LIST.map((sys) => (
              <button
                key={sys.id}
                onClick={() => { setActiveStationId(sys.id); setView('MENU'); }}
                className="group relative bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 p-6 h-40 rounded-[2rem] flex flex-col items-center justify-center text-center transition-all duration-300 hover:shadow-xl hover:shadow-teal-500/10 hover:-translate-y-1 hover:border-teal-500/30"
              >
                <div className={`w-16 h-16 rounded-3xl flex items-center justify-center transition-all duration-300 mb-4 shadow-sm group-hover:scale-110 
                    ${sys.id === 'gadar' 
                        ? 'bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400' 
                        : 'bg-slate-50 text-slate-500 group-hover:bg-teal-50 group-hover:text-teal-600 dark:bg-slate-800 dark:text-slate-400 dark:group-hover:bg-teal-900/20 dark:group-hover:text-teal-400'}`
                }>
                  {getIcon(sys.icon, 32)}
                </div>
                <h3 className="font-bold text-slate-700 dark:text-slate-300 text-sm group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                    {sys.label}
                </h3>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // VIEW 2: MENU (Big Cards)
  // ==========================================
  if (view === 'MENU') {
    return (
      <div className="animate-in slide-in-from-right duration-500 px-4 pb-24 max-w-5xl mx-auto pt-6">
        
        <button onClick={() => setView('HOME')} className="mb-8 flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors bg-white dark:bg-white/5 px-4 py-2 rounded-full w-fit border border-slate-200 dark:border-white/10">
          <ArrowLeft size={16} /> Kembali ke Stase
        </button>

        <div className="text-center mb-12">
          <div className="inline-flex p-6 rounded-[2rem] bg-white dark:bg-slate-900 text-teal-600 mb-6 shadow-xl shadow-teal-500/10 border border-slate-100 dark:border-white/10">
            {getIcon(currentStation.icon, 48)}
          </div>
          <h1 className="text-4xl font-black text-slate-900 dark:text-white mb-3 tracking-tight">{currentStation.title}</h1>
          <p className="text-slate-500 dark:text-slate-400 max-w-lg mx-auto text-lg leading-relaxed">{currentStation.description}</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div onClick={() => setView('CHECKLIST_MODE')} className="group relative bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 p-10 rounded-[2.5rem] cursor-pointer transition-all hover:-translate-y-2 hover:shadow-2xl hover:shadow-teal-500/10 overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500/5 rounded-full blur-3xl group-hover:bg-teal-500/10 transition-all"></div>
            <div className="relative z-10">
              <div className="w-16 h-16 bg-teal-50 dark:bg-teal-900/20 text-teal-600 rounded-2xl flex items-center justify-center mb-6 shadow-sm"><CheckCircle size={32} /></div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Latihan Ceklis</h3>
              <p className="text-slate-500 text-sm mb-8 leading-relaxed">Simulasi ujian step-by-step dengan panduan script anamnesis.</p>
              <span className="text-teal-600 font-bold text-sm flex items-center gap-2 group-hover:gap-3 transition-all">Mulai Latihan <ChevronRight size={16} /></span>
            </div>
          </div>

          <div onClick={() => setView('CASE_LIBRARY')} className="group relative bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 p-10 rounded-[2.5rem] cursor-pointer transition-all hover:-translate-y-2 hover:shadow-2xl hover:shadow-orange-500/10 overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/5 rounded-full blur-3xl group-hover:bg-orange-500/10 transition-all"></div>
            <div className="relative z-10">
              <div className="w-16 h-16 bg-orange-50 dark:bg-orange-900/20 text-orange-600 rounded-2xl flex items-center justify-center mb-6 shadow-sm"><BookOpen size={32} /></div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Perpustakaan Kasus</h3>
              <p className="text-slate-500 text-sm mb-8 leading-relaxed">Pelajari daftar penyakit, diagnosis banding, dan tatalaksana.</p>
              <span className="text-orange-600 font-bold text-sm flex items-center gap-2 group-hover:gap-3 transition-all">Buka Materi <ChevronRight size={16} /></span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // VIEW 3: CHECKLIST MODE
  // ==========================================
  if (view === 'CHECKLIST_MODE') {
    return (
      <div className="animate-in slide-in-from-right duration-500 h-full flex flex-col bg-slate-50 dark:bg-slate-950">
        <div className="px-4 pt-4 pb-2 sticky top-0 z-20">
            <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200 dark:border-white/10 p-3 rounded-full flex justify-between items-center shadow-lg">
                <div className="flex items-center gap-3 pl-2">
                    <button onClick={() => setView('MENU')} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"><ArrowLeft size={20} /></button>
                    <div>
                        <h2 className="font-bold text-slate-900 dark:text-white text-sm line-clamp-1">{currentStation.title}</h2>
                        <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Checklist Mode</p>
                    </div>
                </div>
                <button onClick={() => setScriptMode(!scriptMode)} className={`px-4 py-2 rounded-full text-xs font-bold border flex items-center gap-2 transition-all ${scriptMode ? 'bg-teal-500 text-white border-teal-500 shadow-md shadow-teal-500/30' : 'bg-transparent border-slate-200 text-slate-500'}`}>
                    <Mic size={14} /> {scriptMode ? 'Script ON' : 'Script OFF'}
                </button>
            </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar pb-32 max-w-4xl mx-auto w-full">
           {currentStation.sections.length === 0 ? (
             <div className="flex flex-col items-center justify-center py-20 text-slate-400">
                 <Info size={40} className="mb-4 opacity-50"/>
                 <p>Belum ada data ceklis.</p>
             </div>
           ) : (
             <div className="space-y-8">
                {currentStation.sections.map((section, idx) => {
                  const isExpanded = expandedSections[idx] ?? true;
                  return (
                    <div key={idx} className="relative">
                       {idx !== currentStation.sections.length - 1 && <div className="absolute left-[22px] top-12 bottom-[-40px] w-0.5 bg-slate-200 dark:bg-slate-800 -z-10"></div>}
                       <div onClick={() => setExpandedSections(prev => ({...prev, [idx]: !isExpanded}))} className="flex items-center gap-6 cursor-pointer mb-6 group">
                          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-lg border-4 border-slate-50 dark:border-slate-950 z-10 transition-all shadow-sm ${isExpanded ? 'bg-teal-500 text-white shadow-teal-500/30 scale-110' : 'bg-white text-slate-400 dark:bg-slate-800'}`}>
                              {idx + 1}
                          </div>
                          <div className="flex-1">
                             <h3 className={`font-bold text-xl transition-colors ${isExpanded ? 'text-slate-900 dark:text-white' : 'text-slate-400'}`}>{section.title}</h3>
                             <p className="text-xs text-slate-400 font-medium">Klik untuk {isExpanded ? 'tutup' : 'buka'}</p>
                          </div>
                          <div className={`w-10 h-10 rounded-full bg-white dark:bg-slate-900 flex items-center justify-center border border-slate-100 dark:border-slate-800 shadow-sm transition-transform ${isExpanded ? 'rotate-180 text-teal-500' : 'text-slate-300'}`}>
                              <ChevronDown size={20} />
                          </div>
                       </div>
                       {isExpanded && <div className="pl-[4.5rem] animate-in slide-in-from-top-4 duration-300">{renderSectionContent(section)}</div>}
                    </div>
                  );
                })}
             </div>
           )}
           
           <div className="mt-16 text-center pl-16">
            <button onClick={() => setView('MENU')} className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-10 py-4 rounded-2xl font-bold shadow-xl hover:scale-105 transition-all">Selesai Latihan</button>
           </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // VIEW 4: CASE LIBRARY
  // ==========================================
  if (view === 'CASE_LIBRARY') {
    const cases = currentStation.cases || [];
    const filteredCases = cases.filter((c: any) => c.title.toLowerCase().includes(searchQuery.toLowerCase()));

    return (
      <div className="animate-in slide-in-from-right duration-500 h-full flex flex-col bg-slate-50 dark:bg-slate-950">
        <div className="px-4 pt-4 sticky top-0 z-20 pb-4 bg-slate-50 dark:bg-slate-950/90 backdrop-blur-md">
          <div className="max-w-4xl mx-auto">
            <button onClick={() => setView('MENU')} className="mb-4 flex items-center gap-2 text-slate-500 hover:text-teal-600 text-xs font-bold uppercase tracking-wider transition-colors">
              <ArrowLeft size={16} /> Kembali
            </button>
            <h1 className="text-2xl font-black text-slate-900 dark:text-white mb-6">Kasus: {currentStation.title}</h1>
            <div className="relative group">
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                  <Search size={20} className="text-slate-400 group-focus-within:text-teal-500 transition-colors" />
              </div>
              <input type="text" placeholder="Cari penyakit atau gejala..." className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all shadow-sm" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
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
  // VIEW 5: CASE DETAIL (FINAL REVISI STRUCTURE)
  // ==========================================
  if (view === 'CASE_DETAIL' && activeCase) {
    const hasNewFormat = activeCase.content.tatalaksana && activeCase.content.diagnosis;
    return (
      <div className="animate-in slide-in-from-bottom duration-500 h-full flex flex-col bg-slate-50 dark:bg-slate-950 overflow-hidden">
        
        {/* Header Sticky (Fix Header Issue) */}
        <div className="px-4 pt-4 sticky top-0 z-30 pb-2 bg-slate-50/90 dark:bg-slate-950/90 backdrop-blur-md border-b border-slate-100 dark:border-white/5">
            <div className="max-w-4xl mx-auto flex justify-between items-center">
                <div className="flex flex-col gap-1">
                    <button onClick={() => setView('CASE_LIBRARY')} className="flex items-center gap-2 text-[10px] font-bold text-slate-500 hover:text-slate-800 dark:hover:text-white uppercase tracking-widest transition-colors">
                        <ArrowLeft size={12} /> Kembali
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
                    {isCompleted ? <><CheckCircle size={14}/> Selesai</> : <><BookmarkCheck size={14}/> Tandai Selesai</>}
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
                    {/* 1. ETIOLOGI & FAKTOR RISIKO (Kondisional) */}
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

                    {/* 4. PEMERIKSAAN PENUNJANG (Kondisional) */}
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

                    {/* 5. TATALAKSANA (Split Layout) */}
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
                    <div className="bg-gradient-to-br from-slate-900 to-black p-8 rounded-[2rem] border border-slate-800 relative overflow-hidden text-white shadow-2xl">
                        <div className="absolute top-0 right-0 p-32 bg-orange-500/10 rounded-full blur-3xl"></div>
                        <div className="relative z-10">
                            <div className="flex items-center gap-3 mb-4 text-orange-400">
                                <Flame size={20} fill="currentColor" />
                                <h4 className="font-black uppercase text-xs tracking-widest">OSCE Pro Tip</h4>
                            </div>
                            <p className="text-lg font-medium italic leading-relaxed text-slate-300">
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