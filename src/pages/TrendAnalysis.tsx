import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, TrendingUp, BarChart2, Calendar, 
  Target, AlertCircle, ChevronRight, Activity
} from 'lucide-react';

// --- DATA TREN (Disarikan dari Dokumen Analisis) ---
const TREND_DATA: { [key: string]: any } = {
  'Neurologi': {
    icon: 'brain',
    color: 'indigo',
    topCases: [
      { name: "Bell's Palsy", percent: 12.5, freq: 9 },
      { name: "BPPV (Vertigo)", percent: 11.1, freq: 8 },
      { name: "TTH (Nyeri Kepala)", percent: 11.1, freq: 8 },
    ],
    prediction: ["Bell's Palsy", "BPPV / Meniere", "Cluster Headache", "CTS (Carpal Tunnel)"],
    seasonalNote: "Kasus Bell's Palsy & BPPV sangat dominan di bulan November."
  },
  'Psikiatri': {
    icon: 'smile',
    color: 'pink',
    topCases: [
      { name: "PTSD", percent: 12.6, freq: 11 },
      { name: "Gangguan Cemas Menyeluruh", percent: 11.5, freq: 10 },
      { name: "Insomnia", percent: 11.5, freq: 10 },
    ],
    prediction: ["PTSD (Prediksi Terkuat)", "Skizofrenia / Waham", "GCM / Gangguan Panik", "Bipolar (Episode Depresi)"],
    seasonalNote: "November sangat dominan kasus PTSD & Psikotik."
  },
  'Indra (Mata & THT)': {
    icon: 'eye',
    color: 'cyan',
    topCases: [
      { name: "Rhinitis Alergi", percent: 10.4, freq: 11 },
      { name: "Corpus Alienum", percent: 10.4, freq: 11 },
      { name: "Otitis Media Akut (OMA)", percent: 8.5, freq: 9 },
    ],
    prediction: ["Glaukoma Akut", "Blefaritis / Kalazion", "Rhinitis Alergi", "OMA (Perforasi)"],
    seasonalNote: "Fokus pada kasus Mata (Glaukoma) dan THT umum (Rhinitis)."
  },
  'Kardiovaskular': {
    icon: 'heart',
    color: 'red',
    topCases: [
      { name: "Atrial Fibrilasi (AF)", percent: 16.5, freq: 13 },
      { name: "Syok Anafilaktik", percent: 11.4, freq: 9 },
      { name: "Syok Hipovolemik", percent: 10.1, freq: 8 },
    ],
    prediction: ["Atrial Fibrilasi (AF)", "Syok Hipovolemik / RJP", "ADHF (Gagal Jantung)", "SVT / VES"],
    seasonalNote: "November fokus pada Aritmia (AF) & Kegawatdaruratan (RJP)."
  },
  'Gastroenterohepatologi': {
    icon: 'utensils',
    color: 'amber',
    topCases: [
      { name: "Demam Tifoid", percent: 8.1, freq: 7 },
      { name: "Hepatitis A", percent: 7.0, freq: 6 },
      { name: "Apendisitis Akut", percent: 7.0, freq: 6 },
    ],
    prediction: ["Apendisitis Akut", "Ileus / Peritonitis (NGT)", "Abses Hepar", "Demam Tifoid"],
    seasonalNote: "Dominan kasus Bedah Akut (Apendisitis) & Kegawatdaruratan (NGT)."
  },
  'Kegawatdaruratan': {
    icon: 'siren',
    color: 'rose',
    topCases: [
      { name: "Trauma Kepala", percent: 15.0, freq: 10 }, // Estimasi
      { name: "Syok (Berbagai Jenis)", percent: 12.0, freq: 8 },
      { name: "Trauma Thoraks/Abdomen", percent: 10.0, freq: 7 },
    ],
    prediction: ["Trauma Kepala", "Syok Hipovolemik", "Tension Pneumothorax", "Cardiac Arrest (RJP)"],
    seasonalNote: "Skenario kritis selalu menjadi incaran penguji."
  },
  // Tambahkan sistem lain jika perlu...
};

// Helper untuk warna
const getColorClass = (color: string) => {
  const map: any = {
    indigo: { bg: 'bg-indigo-50 dark:bg-indigo-900/20', text: 'text-indigo-600 dark:text-indigo-400', bar: 'bg-indigo-500' },
    pink: { bg: 'bg-pink-50 dark:bg-pink-900/20', text: 'text-pink-600 dark:text-pink-400', bar: 'bg-pink-500' },
    cyan: { bg: 'bg-cyan-50 dark:bg-cyan-900/20', text: 'text-cyan-600 dark:text-cyan-400', bar: 'bg-cyan-500' },
    red: { bg: 'bg-red-50 dark:bg-red-900/20', text: 'text-red-600 dark:text-red-400', bar: 'bg-red-500' },
    amber: { bg: 'bg-amber-50 dark:bg-amber-900/20', text: 'text-amber-600 dark:text-amber-400', bar: 'bg-amber-500' },
    rose: { bg: 'bg-rose-50 dark:bg-rose-900/20', text: 'text-rose-600 dark:text-rose-400', bar: 'bg-rose-500' },
  };
  return map[color] || map.indigo;
};

export default function TrendAnalysis() {
  const navigate = useNavigate();
  const [selectedSystem, setSelectedSystem] = useState<string | null>(null);

  const systems = Object.keys(TREND_DATA);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-24">
      <div className="sticky top-0 z-40 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-100 dark:border-slate-800">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => selectedSystem ? setSelectedSystem(null) : navigate(-1)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
              <ArrowLeft size={20} className="text-slate-600 dark:text-slate-300" />
            </button>
            <div>
              <h1 className="text-lg font-black text-slate-900 dark:text-white tracking-tight">Analisis Tren OSCE</h1>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Data 2016-2025</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 pt-6 space-y-6">
        
        {!selectedSystem ? (
          // --- LIST SISTEM ---
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-2xl border border-indigo-100 dark:border-indigo-800/30 flex gap-3 items-start">
              <TrendingUp className="text-indigo-500 shrink-0 mt-0.5" size={20} />
              <p className="text-xs text-indigo-700 dark:text-indigo-300 leading-relaxed font-medium">
                Analisis frekuensi kemunculan kasus OSCE untuk memprediksi skenario ujian mendatang. Data disarikan dari dokumentasi 10 tahun terakhir.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {systems.map((sys) => {
                const data = TREND_DATA[sys];
                const colors = getColorClass(data.color);
                return (
                  <button
                    key={sys}
                    onClick={() => setSelectedSystem(sys)}
                    className={`group p-5 rounded-2xl border text-left transition-all hover:shadow-lg hover:-translate-y-1 ${colors.bg} border-transparent hover:border-slate-200 dark:hover:border-slate-700`}
                  >
                    <div className="flex justify-between items-center mb-3">
                       <span className="text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider">{sys}</span>
                       <ChevronRight size={16} className="text-slate-400 group-hover:text-slate-600 transition-colors" />
                    </div>
                    <h3 className={`font-bold text-sm ${colors.text} mb-1`}>
                      Top: {data.topCases[0]?.name}
                    </h3>
                    <p className="text-[10px] text-slate-500">{data.topCases[0]?.percent}% Kemunculan</p>
                  </button>
                );
              })}
            </div>
          </div>
        ) : (
          // --- DETAIL SISTEM ---
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            
            {/* Top Frequent Section */}
            <div className="bg-white dark:bg-slate-900 rounded-[2rem] p-6 border border-slate-100 dark:border-slate-800 shadow-sm">
              <div className="flex items-center gap-2 mb-5">
                <BarChart2 size={18} className="text-teal-500" />
                <h3 className="font-bold text-slate-800 dark:text-white text-sm uppercase tracking-wider">Top 3 Kasus Terpopuler</h3>
              </div>
              
              <div className="space-y-4">
                {TREND_DATA[selectedSystem].topCases.map((item: any, idx: number) => {
                  const colors = getColorClass(TREND_DATA[selectedSystem].color);
                  return (
                    <div key={idx} className="flex items-center gap-4">
                      <div className="text-right w-8">
                        <span className="text-lg font-black text-slate-200 dark:text-slate-700">{idx + 1}</span>
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-center mb-1">
                          <span className="font-bold text-sm text-slate-800 dark:text-slate-200">{item.name}</span>
                          <span className="text-xs font-bold text-slate-500">{item.percent}%</span>
                        </div>
                        <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                          <div className={`h-full rounded-full ${colors.bar}`} style={{ width: `${item.percent * 5}%` }} />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Prediction Section */}
            <div className="relative bg-gradient-to-br from-slate-900 to-slate-800 rounded-[2rem] p-6 text-white shadow-xl overflow-hidden border border-slate-700">
              <div className="absolute top-0 right-0 w-32 h-32 bg-teal-500/20 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2"></div>
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-4">
                  <Target size={18} className="text-teal-400" />
                  <h3 className="font-bold uppercase tracking-wider text-sm">Prediksi November 2025</h3>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {TREND_DATA[selectedSystem].prediction.map((p: string, idx: number) => (
                    <div key={idx} className="bg-white/5 border border-white/10 rounded-xl p-3 backdrop-blur-sm">
                      <span className="text-sm font-medium text-slate-200">{p}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Seasonal Note */}
            <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-800/30 rounded-2xl p-5 flex gap-4 items-start">
              <AlertCircle size={20} className="text-amber-500 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-sm text-amber-800 dark:text-amber-300 mb-1">Catatan Musiman</h4>
                <p className="text-xs text-amber-700 dark:text-amber-400 leading-relaxed">
                  {TREND_DATA[selectedSystem].seasonalNote}
                </p>
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}