import React, { useState, useEffect } from 'react';
import { 
  Stethoscope, Activity, ArrowRight, ChevronRight, 
  ArrowLeft, BookOpen, AlertCircle, Sparkles, CheckCircle, 
  Thermometer, User, FileText, Lightbulb
} from 'lucide-react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../lib/firebase';

// --- TIPE DATA ---
interface OSCEContent {
  id: string;
  system: string;
  type: 'checklist' | 'case';
  title: string;
  
  // Field Khusus Checklist
  steps?: {
    text: string;
    isCritical?: boolean;
    insight?: string; // Insight Islam per langkah
  }[];

  // Field Khusus Cases
  definition?: string;
  anamnesis?: string[]; // Clue anamnesis
  physicalExam?: string[]; // Clue pemfis
  supportingExam?: string[]; // Penunjang
  diagnosis?: string;
  management?: string[];
  osceTips?: string; // Notes/Tips lulus station ini
  caseInsight?: string; // Insight Islam umum untuk kasus ini
}

const SYSTEMS = [
  "Neurologi", "Kardiovaskular", "Respirasi", "Gastrointestinal",
  "Muskuloskeletal", "Indra", "Psikiatri", "Reproduksi", "Endokrin"
];

export default function OSCEStation() {
  // State Navigasi
  const [stage, setStage] = useState<'system' | 'mode' | 'list' | 'reader'>('system');
  const [selectedSystem, setSelectedSystem] = useState<string | null>(null);
  const [selectedMode, setSelectedMode] = useState<'checklist' | 'case' | null>(null);
  const [activeContent, setActiveContent] = useState<OSCEContent | null>(null);
  
  // State Data & UI
  const [contents, setContents] = useState<OSCEContent[]>([]);
  const [loading, setLoading] = useState(false);
  const [showInsight, setShowInsight] = useState(true); // Default ON

  // Fetch Data saat System & Mode terpilih
  useEffect(() => {
    const fetchData = async () => {
      if (stage === 'list' && selectedSystem && selectedMode) {
        setLoading(true);
        try {
          // Query ke koleksi 'osce_materials' (Kita buat koleksi baru biar rapi)
          const q = query(
            collection(db, "osce_materials"), 
            where("system", "==", selectedSystem),
            where("type", "==", selectedMode)
          );
          const snapshot = await getDocs(q);
          const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as OSCEContent[];
          
          // DUMMY DATA FALLBACK (Agar Anda bisa langsung lihat tampilan tanpa upload dulu)
          if (data.length === 0) {
             const dummy: OSCEContent[] = generateDummyData(selectedSystem, selectedMode);
             setContents(dummy);
          } else {
             setContents(data);
          }
        } catch (err) {
          console.error(err);
        } finally {
          setLoading(false);
        }
      }
    };
    fetchData();
  }, [stage, selectedSystem, selectedMode]);

  // --- NAVIGASI HELPERS ---
  const goBack = () => {
    if (stage === 'reader') setStage('list');
    else if (stage === 'list') setStage('mode');
    else if (stage === 'mode') setStage('system');
  };

  // --- RENDER COMPONENT: 1. PILIH SISTEM ---
  const renderSystemSelect = () => (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-white mb-2">OSCE Center</h1>
        <p className="text-slate-400">Pilih sistem tubuh untuk memulai belajar keterampilan klinis.</p>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {SYSTEMS.map(sys => (
          <button
            key={sys}
            onClick={() => { setSelectedSystem(sys); setStage('mode'); }}
            className="bg-slate-900/50 border border-slate-800 hover:border-blue-500 hover:bg-slate-800 p-6 rounded-2xl transition-all group text-left"
          >
            <div className="w-10 h-10 bg-blue-900/30 rounded-lg flex items-center justify-center text-blue-400 mb-3 group-hover:text-white group-hover:bg-blue-600 transition-colors">
              <Activity size={20} />
            </div>
            <h3 className="font-bold text-slate-200 group-hover:text-white">{sys}</h3>
          </button>
        ))}
      </div>
    </div>
  );

  // --- RENDER COMPONENT: 2. PILIH MODE ---
  const renderModeSelect = () => (
    <div className="animate-in fade-in slide-in-from-right duration-500 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold text-white mb-8 text-center">
        Sistem: <span className="text-blue-400">{selectedSystem}</span>
      </h2>
      <div className="grid md:grid-cols-2 gap-6">
        {/* Mode Checklist */}
        <div 
          onClick={() => { setSelectedMode('checklist'); setStage('list'); }}
          className="bg-slate-900/50 border border-slate-800 hover:border-emerald-500/50 p-8 rounded-3xl cursor-pointer hover:-translate-y-1 transition-all group relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <div className="w-14 h-14 bg-emerald-900/30 rounded-2xl flex items-center justify-center text-emerald-400 mb-6">
            <CheckCircle size={32} />
          </div>
          <h3 className="text-2xl font-bold text-white mb-2">Mode Checklist</h3>
          <p className="text-slate-400 leading-relaxed">
            Pelajari <strong>tata cara pemeriksaan</strong> step-by-step. Mulai dari anamnesis, pemeriksaan fisik, hingga edukasi pasien.
          </p>
        </div>

        {/* Mode Cases */}
        <div 
          onClick={() => { setSelectedMode('case'); setStage('list'); }}
          className="bg-slate-900/50 border border-slate-800 hover:border-purple-500/50 p-8 rounded-3xl cursor-pointer hover:-translate-y-1 transition-all group relative overflow-hidden"
        >
           <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <div className="w-14 h-14 bg-purple-900/30 rounded-2xl flex items-center justify-center text-purple-400 mb-6">
            <Stethoscope size={32} />
          </div>
          <h3 className="text-2xl font-bold text-white mb-2">Mode Kasus</h3>
          <p className="text-slate-400 leading-relaxed">
            Pelajari <strong>skenario penyakit</strong>. Kenali clue anamnesis, temuan klinis khas, dan alur tatalaksana yang tepat.
          </p>
        </div>
      </div>
    </div>
  );

  // --- RENDER COMPONENT: 3. PILIH LIST TOPIK ---
  const renderList = () => (
    <div className="animate-in fade-in duration-500 max-w-3xl mx-auto">
      <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
        <span className="text-slate-400 font-normal">{selectedSystem} /</span> 
        {selectedMode === 'checklist' ? 'Daftar Keterampilan' : 'Daftar Penyakit'}
      </h2>
      
      {loading ? (
        <div className="text-center text-slate-500 py-10 animate-pulse">Memuat materi...</div>
      ) : contents.length === 0 ? (
        <div className="text-center p-10 border border-dashed border-slate-800 rounded-2xl text-slate-500">
          Belum ada materi untuk bagian ini.
        </div>
      ) : (
        <div className="space-y-3">
          {contents.map((item) => (
            <div 
              key={item.id}
              onClick={() => { setActiveContent(item); setStage('reader'); }}
              className="bg-slate-900 border border-slate-800 hover:border-blue-500 p-5 rounded-xl cursor-pointer flex justify-between items-center group transition-all"
            >
              <div className="flex items-center gap-4">
                <div className={`w-2 h-10 rounded-full ${selectedMode === 'checklist' ? 'bg-emerald-500' : 'bg-purple-500'}`}></div>
                <span className="font-bold text-slate-200 group-hover:text-white text-lg">{item.title}</span>
              </div>
              <ChevronRight className="text-slate-600 group-hover:text-blue-400" />
            </div>
          ))}
        </div>
      )}
    </div>
  );

  // --- RENDER COMPONENT: 4. READER (KONTEN UTAMA) ---
  const renderReader = () => {
    if (!activeContent) return null;

    return (
      <div className="animate-in slide-in-from-right duration-500 pb-20">
        
        {/* Header Reader */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 border-b border-slate-800 pb-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider mb-2">
              <span className="text-slate-500">{activeContent.system}</span>
              <span className="text-slate-700">•</span>
              <span className={activeContent.type === 'checklist' ? 'text-emerald-400' : 'text-purple-400'}>
                {activeContent.type === 'checklist' ? 'Skill Checklist' : 'Clinical Case'}
              </span>
            </div>
            <h1 className="text-3xl font-bold text-white">{activeContent.title}</h1>
          </div>

          {/* Toggle Insight */}
          <div 
            onClick={() => setShowInsight(!showInsight)}
            className={`cursor-pointer px-4 py-2 rounded-full border flex items-center gap-2 text-sm font-bold transition-all ${
              showInsight 
                ? 'bg-emerald-900/30 border-emerald-500/50 text-emerald-400' 
                : 'bg-slate-900 border-slate-700 text-slate-500'
            }`}
          >
            <Sparkles size={16} />
            Insight Islam {showInsight ? 'ON' : 'OFF'}
          </div>
        </div>

        {/* --- READER: VIEW CHECKLIST --- */}
        {activeContent.type === 'checklist' && activeContent.steps && (
          <div className="space-y-4 max-w-4xl mx-auto">
             {activeContent.steps.map((step, idx) => (
               <div key={idx} className={`p-4 rounded-xl border ${step.isCritical ? 'bg-red-900/10 border-red-900/30' : 'bg-slate-900/50 border-slate-800'}`}>
                 <div className="flex gap-4">
                   <div className="w-8 h-8 bg-slate-800 rounded-lg flex items-center justify-center font-bold text-slate-500 shrink-0 text-sm">
                     {idx + 1}
                   </div>
                   <div className="flex-1">
                     <p className={`text-slate-200 ${step.isCritical ? 'font-bold' : ''}`}>
                       {step.text}
                       {step.isCritical && <span className="ml-2 text-[10px] bg-red-500 text-white px-1.5 py-0.5 rounded">CRITICAL</span>}
                     </p>
                     
                     {/* Insight Section */}
                     {showInsight && step.insight && (
                       <div className="mt-3 flex gap-2 text-emerald-400 text-sm bg-emerald-900/20 p-3 rounded-lg border border-emerald-500/20">
                          <Sparkles size={16} className="shrink-0 mt-0.5" />
                          <span className="italic">"{step.insight}"</span>
                       </div>
                     )}
                   </div>
                 </div>
               </div>
             ))}
          </div>
        )}

        {/* --- READER: VIEW CASES --- */}
        {activeContent.type === 'case' && (
          <div className="max-w-4xl mx-auto grid md:grid-cols-3 gap-8">
            
            {/* Kolom Kiri: Definisi & Temuan */}
            <div className="md:col-span-2 space-y-8">
               
               {/* Definisi */}
               <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-2xl">
                 <h3 className="text-white font-bold text-lg mb-3 flex items-center gap-2">
                   <BookOpen size={20} className="text-blue-500" /> Definisi
                 </h3>
                 <p className="text-slate-300 leading-relaxed">{activeContent.definition}</p>
               </div>

               {/* Anamnesis Clue */}
               <div className="relative pl-6 border-l-2 border-slate-700 space-y-6">
                 <div>
                    <h4 className="text-slate-400 font-bold text-sm uppercase mb-2 flex items-center gap-2">
                      <User size={16} /> Anamnesis (Key Findings)
                    </h4>
                    <ul className="list-disc pl-4 space-y-1 text-slate-200">
                      {activeContent.anamnesis?.map((item, i) => <li key={i}>{item}</li>)}
                    </ul>
                 </div>

                 <div>
                    <h4 className="text-slate-400 font-bold text-sm uppercase mb-2 flex items-center gap-2">
                      <Thermometer size={16} /> Pemeriksaan Fisik
                    </h4>
                    <ul className="list-disc pl-4 space-y-1 text-slate-200">
                      {activeContent.physicalExam?.map((item, i) => <li key={i}>{item}</li>)}
                    </ul>
                 </div>
               </div>

               {/* Tatalaksana */}
               <div className="bg-blue-900/10 border border-blue-500/20 p-6 rounded-2xl">
                 <h3 className="text-blue-400 font-bold text-lg mb-3 flex items-center gap-2">
                   <FileText size={20} /> Tatalaksana & Edukasi
                 </h3>
                 <ul className="space-y-2">
                    {activeContent.management?.map((item, i) => (
                      <li key={i} className="flex gap-2 text-slate-300">
                        <span className="text-blue-500 font-bold">•</span> {item}
                      </li>
                    ))}
                 </ul>
               </div>
            </div>

            {/* Kolom Kanan: Tips & Notes */}
            <div className="space-y-6">
              
              {/* OSCE Tips */}
              <div className="bg-amber-900/10 border border-amber-500/20 p-6 rounded-2xl">
                 <h3 className="text-amber-400 font-bold text-sm uppercase mb-3 flex items-center gap-2">
                   <Lightbulb size={18} /> OSCE Pro Tips
                 </h3>
                 <p className="text-slate-300 text-sm leading-relaxed">
                   {activeContent.osceTips}
                 </p>
              </div>

              {/* Islamic Insight (Global Case) */}
              {showInsight && activeContent.caseInsight && (
                <div className="bg-emerald-900/10 border border-emerald-500/20 p-6 rounded-2xl relative overflow-hidden">
                   <div className="absolute top-0 right-0 p-12 bg-emerald-500/10 rounded-full blur-xl translate-x-1/2 -translate-y-1/2"></div>
                   <h3 className="text-emerald-400 font-bold text-sm uppercase mb-3 flex items-center gap-2 relative z-10">
                     <Sparkles size={18} /> Integrasi Islam
                   </h3>
                   <p className="text-slate-300 text-sm leading-relaxed italic relative z-10">
                     "{activeContent.caseInsight}"
                   </p>
                </div>
              )}

            </div>

          </div>
        )}

      </div>
    );
  };

  // --- MAIN RENDER ---
  return (
    <div className="pb-10">
      {/* Tombol Back Global */}
      {stage !== 'system' && (
        <button 
          onClick={goBack}
          className="mb-6 flex items-center gap-2 text-slate-500 hover:text-white transition-colors"
        >
          <ArrowLeft size={20} /> Kembali
        </button>
      )}

      {/* State Machine View */}
      {stage === 'system' && renderSystemSelect()}
      {stage === 'mode' && renderModeSelect()}
      {stage === 'list' && renderList()}
      {stage === 'reader' && renderReader()}

    </div>
  );
}

// --- DUMMY DATA GENERATOR (Untuk Demo) ---
// Ini yang membuat halaman Anda TIDAK KOSONG walaupun belum upload JSON
function generateDummyData(system: string | null, mode: string | null): OSCEContent[] {
  if (system === 'Neurologi' && mode === 'case') {
    return [{
      id: 'bppv-1',
      system: 'Neurologi',
      type: 'case',
      title: 'Benign Paroxysmal Positional Vertigo (BPPV)',
      definition: 'Gangguan vestibular perifer yang ditandai dengan serangan vertigo singkat (<1 menit) yang dipicu oleh perubahan posisi kepala.',
      anamnesis: [
        'Pusing berputar (vertigo) mendadak saat bangun tidur/menoleh.',
        'Durasi singkat (< 1 menit).',
        'Mual dan muntah (+).',
        'Tidak ada gangguan pendengaran atau tinnitus (membedakan dengan Meniere).',
        'Tidak ada defisit neurologis fokal.'
      ],
      physicalExam: [
        'Kesadaran CM, TTV stabil.',
        'Pemeriksaan Dix-Hallpike: Positif (Muncul nistagmus rotatoar/upbeating).',
        'Romberg Test: Bisa positif (jatuh ke sisi lesi).',
        'Pemeriksaan Neurologis lain: Normal.'
      ],
      management: [
        'Manuver Epley (Reposisi kanalith).',
        'Simptomatik: Betahistine mesylate 3x6-12 mg.',
        'Edukasi: Hindari gerakan kepala mendadak, tidur dengan bantal tinggi.',
        'Rujuk jika: Tidak respon manuver atau ada tanda sentral (Red Flag).'
      ],
      osceTips: 'Jangan lupa Informed Consent sebelum melakukan Dix-Hallpike karena manuver ini akan memprovokasi pusing hebat dan muntah pada pasien.',
      caseInsight: 'Anjurkan pasien untuk shalat dengan gerakan perlahan atau dalam posisi duduk jika vertigo masih sering kambuh (Rukhsah).'
    }];
  }

  if (system === 'Neurologi' && mode === 'checklist') {
    return [{
      id: 'neuro-check-1',
      system: 'Neurologi',
      type: 'checklist',
      title: 'Pemeriksaan Rangsang Meningeal',
      steps: [
        { text: 'Mengucapkan salam dan memperkenalkan diri.', insight: 'Senyum, Salam, Sapa (Sunnah).' },
        { text: 'Cuci tangan 6 langkah & pakai handscoon.', isCritical: true, insight: 'Kebersihan sebagian dari iman.' },
        { text: 'Pemeriksaan Kaku Kuduk (Neck Stiffness).', isCritical: true },
        { text: 'Pemeriksaan Tanda Brudzinski I & II.' },
        { text: 'Pemeriksaan Tanda Kernig.' },
        { text: 'Interpretasi hasil dan sampaikan ke pasien.' },
        { text: 'Cuci tangan pasca tindakan.' }
      ]
    }];
  }

  // Default fallback kosong
  return [];
}