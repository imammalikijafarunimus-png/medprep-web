import React, { useState } from 'react';
import { 
  ArrowLeft, Brain, Droplet, Wind, Heart, Utensils, Baby, Zap, Shield, 
  Activity, Sun, Smile, Eye, CheckCircle, ChevronRight, Mic, 
  BookOpen, Search, Flame, Stethoscope, LayoutGrid, 
  ChevronDown, Sparkles, Siren
} from 'lucide-react';
import { STATION_DATA, SYSTEM_LIST, CaseStudy, OSCESection } from '../data/osce_data';

type ViewState = 'HOME' | 'MENU' | 'CHECKLIST_MODE' | 'CASE_LIBRARY' | 'CASE_DETAIL';

export default function OSCEStation() {
  // --- STATE ---
  const [view, setView] = useState<ViewState>('HOME');
  const [activeStationId, setActiveStationId] = useState<string | null>(null);
  const [activeCase, setActiveCase] = useState<CaseStudy | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [scriptMode, setScriptMode] = useState(true);
  const [expandedSections, setExpandedSections] = useState<{[key:number]: boolean}>({});

  // --- HELPERS ---
  const currentStation = activeStationId && STATION_DATA[activeStationId] 
    ? STATION_DATA[activeStationId] 
    : { id: '', title: 'Stase', description: '', icon: 'activity', sections: [], cases: [] };

  const getIcon = (name: string) => {
    const icons: any = { brain: Brain, droplet: Droplet, wind: Wind, heart: Heart, utensils: Utensils, baby: Baby, zap: Zap, shield: Shield, activity: Activity, sun: Sun, smile: Smile, eye: Eye, siren: Siren };
    const Icon = icons[name] || Activity;
    return <Icon size={24} />;
  };

  const getBigIcon = (name: string) => {
    const icons: any = { brain: Brain, droplet: Droplet, wind: Wind, heart: Heart, utensils: Utensils, baby: Baby, zap: Zap, shield: Shield, activity: Activity, sun: Sun, smile: Smile, eye: Eye, siren: Siren };
    const Icon = icons[name] || Activity;
    return <Icon size={40} />;
  };

  // --- SUB-COMPONENTS: LEGO RENDERERS (YANG HILANG DIKEMBALIKAN) ---

  // 1. Lego: Checklist Biasa
  const RenderChecklist = ({ section }: { section: any }) => (
    <div className="space-y-3">
      {section.items?.map((item: any, idx: number) => (
        <div key={idx} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-xl flex gap-3 hover:border-teal-500/30 transition-colors">
           <div className={`mt-1 shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center ${item.isCritical ? 'border-red-500' : 'border-slate-300'}`}>
             {item.isCritical && <div className="w-2.5 h-2.5 bg-red-500 rounded-full"></div>}
           </div>
           <div className="flex-1">
             <div className="flex items-center gap-2">
               <span className={`font-bold text-sm ${item.isCritical ? 'text-red-600' : 'text-slate-800 dark:text-slate-200'}`}>{item.label}</span>
               {item.isCritical && <span className="text-[10px] bg-red-100 text-red-600 px-1.5 py-0.5 rounded font-bold">CRITICAL</span>}
             </div>
             {item.description && <p className="text-xs text-slate-500 mt-1">{item.description}</p>}
             
             {scriptMode && (
               <div className="mt-2 space-y-2">
                 {item.script && (
                   <div className="bg-slate-50 dark:bg-slate-950 p-3 rounded-lg text-xs italic text-slate-600 dark:text-slate-400 border border-slate-100 dark:border-slate-800 flex gap-2">
                     <Mic size={14} className="shrink-0 mt-0.5 text-teal-500" /> "{item.script}"
                   </div>
                 )}
                 {item.insight && (
                    <div className="bg-emerald-50 dark:bg-emerald-900/10 p-2 rounded-lg text-xs text-emerald-600 dark:text-emerald-400 flex gap-2 border border-emerald-100 dark:border-emerald-900/30">
                      <Sparkles size={14} className="shrink-0 mt-0.5" /> Insight: {item.insight}
                    </div>
                 )}
               </div>
             )}
           </div>
        </div>
      ))}
    </div>
  );

  // 2. Lego: Anamnesis Standar (DIKEMBALIKAN)
  const RenderStandardAnamnesis = ({ data }: { data: any }) => (
    <div className="grid md:grid-cols-2 gap-4">
      <div className="bg-blue-50 dark:bg-blue-900/10 p-4 rounded-xl border border-blue-100 dark:border-blue-900/30">
        <h4 className="font-bold text-blue-700 dark:text-blue-400 text-sm mb-2 flex items-center gap-2">
          <Activity size={16} /> RPS (Sacred Seven)
        </h4>
        <p className="font-bold text-slate-800 dark:text-slate-200 text-sm mb-2">"{data.keluhan_utama}"</p>
        <ul className="list-disc list-inside text-xs text-slate-600 dark:text-slate-400 space-y-1">
          {data.rps?.map((item: string, i: number) => <li key={i}>{item}</li>)}
        </ul>
      </div>
      <div className="space-y-4">
        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
          <h4 className="font-bold text-slate-700 dark:text-slate-300 text-xs mb-2 uppercase">Riwayat Dahulu (RPD)</h4>
          <div className="flex flex-wrap gap-2">
            {data.rpd?.map((item: string, i: number) => (
              <span key={i} className="text-xs bg-slate-100 dark:bg-slate-800 border px-2 py-1 rounded text-slate-600 dark:text-slate-400">{item}</span>
            ))}
          </div>
        </div>
        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
           <h4 className="font-bold text-slate-700 dark:text-slate-300 text-xs mb-2 uppercase">Riwayat Keluarga (RPK)</h4>
           <p className="text-xs text-slate-600 dark:text-slate-400">{data.rpk?.join(', ')}</p>
        </div>
      </div>
      {scriptMode && data.script && (
         <div className="md:col-span-2 bg-yellow-50 dark:bg-yellow-900/10 p-3 rounded-lg text-xs italic text-yellow-800 dark:text-yellow-200 border border-yellow-200 flex gap-2">
            <Mic size={14} className="shrink-0 mt-0.5" /> Contoh Pertanyaan: {data.script}
         </div>
      )}
    </div>
  );

  // 3. Lego: Psikiatri (DIKEMBALIKAN)
  const RenderPsychiatry = ({ data }: { data: any }) => (
    <div className="bg-violet-50 dark:bg-violet-900/10 border border-violet-100 dark:border-violet-800 rounded-xl p-4">
       <div className="flex items-center gap-2 mb-4 text-violet-600 dark:text-violet-400 font-bold">
         <Brain size={18} /> Status Mental
       </div>
       <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="p-2 bg-white dark:bg-slate-900 rounded border border-violet-100 dark:border-violet-900/50">
             <span className="block font-bold text-violet-500 mb-1">Penampilan</span>
             {data.penampilan?.join(', ')}
          </div>
          <div className="p-2 bg-white dark:bg-slate-900 rounded border border-violet-100 dark:border-violet-900/50">
             <span className="block font-bold text-violet-500 mb-1">Persepsi</span>
             {data.persepsi?.join(', ')}
          </div>
          <div className="p-2 bg-white dark:bg-slate-900 rounded border border-violet-100 dark:border-violet-900/50 col-span-2">
             <span className="block font-bold text-violet-500 mb-1">Isi Pikir</span>
             {data.pikiran?.join(', ')}
          </div>
       </div>
    </div>
  );

  // 4. Lego: Pediatri (DIKEMBALIKAN)
  const RenderPediatric = ({ data }: { data: any }) => (
    <div className="bg-pink-50 dark:bg-pink-900/10 border border-pink-100 dark:border-pink-800 rounded-xl p-4">
       <div className="flex items-center gap-2 mb-4 text-pink-600 dark:text-pink-400 font-bold">
         <Baby size={18} /> Riwayat Kehamilan & Anak
       </div>
       <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
         <div>
            <p className="text-xs font-bold text-pink-500 uppercase mb-1">Prenatal</p>
            <ul className="list-disc list-inside text-xs text-slate-600 dark:text-slate-400">
               {data.prenatal?.map((x:string, i:number) => <li key={i}>{x}</li>)}
            </ul>
         </div>
         <div>
            <p className="text-xs font-bold text-pink-500 uppercase mb-1">Imunisasi</p>
            <ul className="list-disc list-inside text-xs text-slate-600 dark:text-slate-400">
               {data.postnatal?.map((x:string, i:number) => <li key={i}>{x}</li>)}
            </ul>
         </div>
       </div>
    </div>
  );

  // LOGIKA SWITCHER (PENTING AGAR TIDAK BLANK)
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
      <div className="animate-in fade-in pb-20">
        <div className="bg-slate-900 text-white p-8 rounded-3xl relative overflow-hidden mb-8 mx-4 md:mx-0 shadow-xl shadow-slate-200 dark:shadow-none">
          <div className="absolute top-0 right-0 p-32 bg-teal-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4"></div>
          <h1 className="text-3xl font-bold mb-2 relative z-10">OSCE Center</h1>
          <p className="text-slate-300 text-sm max-w-xl relative z-10">
            Pusat pelatihan keterampilan klinis. Pilih stase untuk memulai simulasi.
          </p>
        </div>
        <div className="px-4 md:px-0">
          <h3 className="text-slate-900 dark:text-white font-bold text-lg mb-4 flex items-center gap-2">
            <LayoutGrid size={20} className="text-teal-500" /> Pilih Stase / Sistem
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {SYSTEM_LIST.map((sys) => (
              <button
                key={sys.id}
                onClick={() => { setActiveStationId(sys.id); setView('MENU'); }}
                className="group bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl hover:border-teal-500 hover:shadow-lg transition-all text-left flex flex-col items-center justify-center text-center gap-4"
              >
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${sys.id === 'gadar' ? 'bg-red-50 text-red-600 dark:bg-red-900/20' : 'bg-slate-100 text-slate-500 group-hover:bg-teal-50 group-hover:text-teal-600 dark:bg-slate-800 dark:text-slate-400'}`}>
                  {getIcon(sys.icon)}
                </div>
                <h3 className="font-bold text-slate-800 dark:text-slate-200 text-sm group-hover:text-teal-700 dark:group-hover:text-teal-400">{sys.label}</h3>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // VIEW 2: MENU
  // ==========================================
  if (view === 'MENU') {
    return (
      <div className="animate-in slide-in-from-right px-4 pb-20 max-w-5xl mx-auto">
        <button onClick={() => setView('HOME')} className="mb-6 flex items-center gap-2 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors">
          <ArrowLeft size={20} /> Kembali
        </button>
        <div className="text-center mb-10">
          <div className="inline-flex p-4 rounded-full bg-slate-100 dark:bg-slate-800 text-teal-600 mb-4 shadow-sm border border-slate-200 dark:border-slate-700">
            {getBigIcon(currentStation.icon)}
          </div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">{currentStation.title}</h1>
          <p className="text-slate-500 max-w-lg mx-auto">{currentStation.description}</p>
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          <div onClick={() => setView('CHECKLIST_MODE')} className="group relative bg-slate-900/5 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-teal-500/50 p-8 rounded-3xl cursor-pointer transition-all hover:-translate-y-1">
            <div className="relative z-10">
              <div className="w-14 h-14 bg-teal-500/10 text-teal-600 rounded-2xl flex items-center justify-center mb-6"><CheckCircle size={32} /></div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">Latihan Ceklis</h3>
              <p className="text-slate-500 text-sm mb-8 leading-relaxed">Simulasi ujian langkah demi langkah.</p>
              <span className="text-teal-600 font-bold text-sm flex items-center gap-2">Mulai Latihan <ChevronRight size={16} /></span>
            </div>
          </div>
          <div onClick={() => setView('CASE_LIBRARY')} className="group relative bg-slate-900/5 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-orange-500/50 p-8 rounded-3xl cursor-pointer transition-all hover:-translate-y-1">
            <div className="relative z-10">
              <div className="w-14 h-14 bg-orange-500/10 text-orange-600 rounded-2xl flex items-center justify-center mb-6"><BookOpen size={32} /></div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">Perpustakaan Kasus</h3>
              <p className="text-slate-500 text-sm mb-8 leading-relaxed">Pelajari penyakit tersering.</p>
              <span className="text-orange-600 font-bold text-sm flex items-center gap-2">Buka Materi <ChevronRight size={16} /></span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // VIEW 3: CHECKLIST MODE (FIXED)
  // ==========================================
  if (view === 'CHECKLIST_MODE') {
    return (
      <div className="animate-in slide-in-from-right h-full flex flex-col bg-slate-50 dark:bg-slate-950">
        <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 p-4 sticky top-0 z-20 flex justify-between items-center shadow-sm">
          <div className="flex items-center gap-3">
            <button onClick={() => setView('MENU')} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full"><ArrowLeft size={20} /></button>
            <div>
              <h2 className="font-bold text-slate-900 dark:text-white text-sm">Mode Ceklis</h2>
              <p className="text-xs text-slate-500">{currentStation.title}</p>
            </div>
          </div>
          <button onClick={() => setScriptMode(!scriptMode)} className={`px-4 py-2 rounded-xl text-xs font-bold border flex items-center gap-2 transition-all ${scriptMode ? 'bg-teal-50 border-teal-200 text-teal-700' : 'bg-white border-slate-200 text-slate-500'}`}>
            <Mic size={14} /> {scriptMode ? 'Script: ON' : 'Script: OFF'}
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar pb-24 max-w-4xl mx-auto w-full">
           {currentStation.sections.length === 0 ? (
             <div className="text-center py-20 text-slate-400">Belum ada data ceklis.</div>
           ) : (
             <div className="space-y-6">
                {currentStation.sections.map((section, idx) => {
                  const isExpanded = expandedSections[idx] ?? true;
                  return (
                    <div key={idx} className="relative">
                       {idx !== currentStation.sections.length - 1 && <div className="absolute left-6 top-10 bottom-[-24px] w-0.5 bg-slate-200 dark:bg-slate-800 -z-10"></div>}
                       <div onClick={() => setExpandedSections(prev => ({...prev, [idx]: !isExpanded}))} className="flex items-center gap-4 cursor-pointer mb-4">
                          <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg border-4 border-slate-50 dark:border-slate-950 z-10 transition-colors ${isExpanded ? 'bg-teal-500 text-white shadow-lg shadow-teal-500/30' : 'bg-slate-200 text-slate-500 dark:bg-slate-800'}`}>{idx + 1}</div>
                          <div className="flex-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-xl shadow-sm flex justify-between items-center hover:border-teal-500 transition-colors">
                            <h3 className={`font-bold text-lg ${isExpanded ? 'text-teal-700 dark:text-teal-400' : 'text-slate-500'}`}>{section.title}</h3>
                            <ChevronDown className={`transition-transform text-slate-400 ${isExpanded ? 'rotate-180' : ''}`} />
                          </div>
                       </div>
                       {isExpanded && <div className="pl-16 animate-in fade-in">{renderSectionContent(section)}</div>}
                    </div>
                  );
                })}
             </div>
           )}
           
           <div className="mt-12 text-center pl-16">
            <button onClick={() => setView('MENU')} className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-8 py-3 rounded-xl font-bold shadow-lg hover:opacity-90 transition-all">
              Selesai Latihan
            </button>
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
      <div className="animate-in slide-in-from-right h-full flex flex-col bg-slate-950">
        <div className="bg-slate-900 border-b border-slate-800 p-4 sticky top-0 z-20">
          <div className="max-w-4xl mx-auto">
            <button onClick={() => setView('MENU')} className="mb-4 flex items-center gap-2 text-slate-500 hover:text-teal-400 text-xs font-bold uppercase tracking-wider transition-colors">
              <ArrowLeft size={16} /> Kembali
            </button>
            <h1 className="text-xl font-bold text-white mb-4">Kasus: {currentStation.title}</h1>
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
              <input type="text" placeholder="Cari penyakit..." className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-600 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
            </div>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-4 custom-scrollbar pb-20">
          <div className="max-w-4xl mx-auto space-y-3">
            {filteredCases.length === 0 ? <div className="text-center py-20 text-slate-600 text-sm">Belum ada data kasus.</div> : filteredCases.map((cs: any) => (
              <div key={cs.id} onClick={() => { setActiveCase(cs); setView('CASE_DETAIL'); }} className="bg-slate-900 border border-slate-800 p-6 rounded-2xl cursor-pointer hover:border-orange-500/50 hover:bg-slate-800 transition-all group">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-bold text-lg text-slate-200 group-hover:text-orange-400 transition-colors">{cs.title}</h3>
                  <div className="flex items-center gap-1 bg-slate-800 text-slate-400 px-2 py-1 rounded-lg text-xs font-bold border border-slate-700">
                    <Flame size={12} className="text-orange-500" fill="currentColor" /> {cs.frequency}
                  </div>
                </div>
                <p className="text-sm text-slate-500 line-clamp-1">{cs.summary}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // VIEW 5: CASE DETAIL
  // ==========================================
  if (view === 'CASE_DETAIL' && activeCase) {
    const hasNewFormat = activeCase.content.tatalaksana && activeCase.content.diagnosis;

    return (
      <div className="animate-in slide-in-from-bottom h-full flex flex-col bg-slate-950 overflow-hidden">
        <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-900 sticky top-0 z-30">
          <button onClick={() => setView('CASE_LIBRARY')} className="p-2 bg-slate-800 rounded-full hover:bg-slate-700 text-slate-400 hover:text-white transition-colors">
            <ArrowLeft size={20} />
          </button>
          <h2 className="text-sm font-bold text-slate-200 line-clamp-1">{activeCase.title}</h2>
          <div className="w-10"></div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 md:p-10 custom-scrollbar pb-24 max-w-3xl mx-auto w-full space-y-10">
          
          {/* HEADER */}
          <div className="text-center">
             <div className="flex justify-center gap-2 mb-4">
                <span className="text-[10px] font-bold uppercase tracking-widest text-orange-400 bg-orange-500/10 px-3 py-1 rounded-full border border-orange-500/20">SKDI {activeCase.level_skdi || '4A'}</span>
                <span className="text-[10px] font-bold uppercase tracking-widest text-teal-400 bg-teal-500/10 px-3 py-1 rounded-full border border-teal-500/20">Freq: {'⭐'.repeat(activeCase.frequency)}</span>
             </div>
             <h1 className="text-3xl md:text-4xl font-black text-white mb-4 leading-tight">{activeCase.title}</h1>
             <p className="text-lg text-slate-400 leading-relaxed max-w-2xl mx-auto">{activeCase.summary}</p>
          </div>

          {/* JIKA FORMAT BARU (Word Convert) */}
          {hasNewFormat ? (
             <>
                <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800">
                  <h3 className="text-xs font-bold text-teal-500 uppercase tracking-widest mb-4 flex items-center gap-2"><Mic size={14} /> Anamnesis</h3>
                  <ul className="list-disc list-inside text-sm text-slate-300 space-y-2 marker:text-teal-500">
                    {activeCase.content.anamnesis.list_pertanyaan?.map((q: string, i: number) => <li key={i}>{q}</li>)}
                  </ul>
                </div>

                <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800">
                  <h3 className="text-xs font-bold text-blue-500 uppercase tracking-widest mb-4 flex items-center gap-2"><Activity size={14} /> Pemeriksaan Fisik</h3>
                  {activeCase.content.pemeriksaan_fisik.map((item: string, i: number) => (
                    <div key={i} className="flex gap-3 text-sm text-slate-300 mb-2">
                       <CheckCircle size={16} className="text-blue-500 shrink-0 mt-0.5" /><span>{item}</span>
                    </div>
                  ))}
                </div>

                {/* KERTAS RESEP */}
                <div className="bg-[#fff9c4] text-slate-900 rounded-2xl p-6 border-l-8 border-yellow-400 relative shadow-lg transform rotate-1">
                   <div className="absolute top-4 right-4 opacity-10"><Brain size={64} className="text-slate-900" /></div>
                   <h3 className="text-xs font-bold text-slate-800 uppercase tracking-widest mb-4 flex items-center gap-2 border-b border-slate-800/10 pb-2"><Stethoscope size={14} /> Resep & Edukasi</h3>
                   <div className="font-mono text-sm space-y-1 mb-6">
                      {activeCase.content.tatalaksana.farmakologi.map((rx: string, i: number) => <p key={i} className="leading-relaxed font-bold">{rx}</p>)}
                   </div>
                   <div className="bg-white/50 p-3 rounded-lg">
                      <p className="text-xs font-bold uppercase mb-1 text-slate-600">Edukasi:</p>
                      <ul className="list-disc list-inside text-xs text-slate-800">
                         {activeCase.content.tatalaksana.non_farmakologi.map((edu: string, i: number) => <li key={i}>{edu}</li>)}
                      </ul>
                   </div>
                </div>

                <div className="bg-gradient-to-br from-slate-900 to-black p-6 rounded-2xl border border-slate-800 relative overflow-hidden">
                   <div className="absolute top-0 right-0 p-20 bg-orange-500/5 rounded-full blur-3xl"></div>
                   <div className="relative z-10">
                      <div className="flex items-center gap-3 mb-3 text-orange-400"><Flame size={18} fill="currentColor" /><h4 className="font-bold uppercase text-xs tracking-widest">OSCE Pro Tip</h4></div>
                      <p className="text-slate-300 leading-relaxed text-sm italic">"{activeCase.content.osce_tip}"</p>
                   </div>
                </div>
             </>
          ) : (
             <div className="text-center py-10 text-slate-500">
                <p>Format data kasus belum diupdate.</p>
             </div>
          )}
        </div>
      </div>
    );
  }

  return null;
}