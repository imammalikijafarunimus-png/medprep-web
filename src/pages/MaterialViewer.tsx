import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, ChevronDown, ChevronUp, Sparkles, 
  AlertCircle, BookOpen, Star, Bookmark 
} from 'lucide-react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';
import ReactMarkdown from 'react-markdown'; // Library untuk baca **bold** dan ## header

interface Material {
  id: string;
  topic: string;
  content: string; 
  category: string; // "Must Know" atau "Nice to Know"
  insight?: string;
}

export default function MaterialViewer() {
  const [searchParams] = useSearchParams();
  const system = searchParams.get('system');
  const navigate = useNavigate();
  
  const [materials, setMaterials] = useState<Material[]>([]);
  const [loading, setLoading] = useState(true);
  // Default expanded: Buka materi pertama otomatis biar user langsung baca
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    const fetchMaterials = async () => {
      if (!system) return;
      try {
        const q = query(collection(db, "study_materials"), where("system", "==", system));
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Material[];
        
        // Urutkan: Must Know di atas, Nice to Know di bawah
        const sortedData = data.sort((a, b) => {
            if (a.category === 'Must Know') return -1;
            if (b.category === 'Must Know') return 1;
            return 0;
        });

        setMaterials(sortedData);
        if (sortedData.length > 0) setExpandedId(sortedData[0].id); // Buka yg pertama
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchMaterials();
  }, [system]);

  // --- HELPER: BADGE COLOR ---
  const getBadgeStyle = (cat: string) => {
    const category = cat?.toLowerCase() || '';
    if (category.includes('must') || category.includes('esensial')) {
      return 'bg-rose-500/10 text-rose-500 border-rose-500/20'; // Merah (Penting)
    }
    if (category.includes('nice') || category.includes('tambahan')) {
      return 'bg-teal-500/10 text-teal-500 border-teal-500/20'; // Teal (Santai)
    }
    return 'bg-slate-500/10 text-slate-400 border-slate-500/20'; // Default
  };

  return (
    <div className="animate-in slide-in-from-right duration-500 pb-20 min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors">
      
      {/* HEADER GRADIENT (Teal Accent) */}
      <div className="relative bg-gradient-to-r from-teal-900 via-slate-900 to-slate-900 pb-12 pt-8 px-6 rounded-b-[2.5rem] shadow-2xl overflow-hidden mb-8">
        {/* Dekorasi Background */}
        <div className="absolute top-0 right-0 p-40 bg-teal-500/10 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 left-0 p-20 bg-emerald-500/10 rounded-full blur-2xl -translate-x-1/2 translate-y-1/2"></div>

        <div className="relative z-10 max-w-4xl mx-auto">
          <button 
            onClick={() => navigate(-1)} 
            className="mb-6 p-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full text-white transition-all w-fit"
          >
            <ArrowLeft size={20} />
          </button>
          
          <div className="flex flex-col gap-2">
            <span className="text-teal-300 font-bold uppercase tracking-wider text-xs flex items-center gap-2">
              <BookOpen size={14} /> Materi Esensial
            </span>
            <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
              {system || 'Memuat Sistem...'}
            </h1>
            <p className="text-slate-300 text-sm max-w-xl leading-relaxed mt-2">
              Rangkuman poin kunci (Must Know) dan wawasan tambahan (Nice to Know) yang disesuaikan dengan SKDI terbaru.
            </p>
          </div>
        </div>
      </div>

      {/* CONTENT LIST */}
      <div className="max-w-4xl mx-auto px-4 space-y-4">
        
        {loading && (
          <div className="text-center py-20">
            <div className="w-10 h-10 border-4 border-teal-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-slate-500 animate-pulse">Menyiapkan materi...</p>
          </div>
        )}
        
        {!loading && materials.length === 0 && (
          <div className="text-center p-12 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-3xl">
            <div className="bg-slate-100 dark:bg-slate-900 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
              <AlertCircle size={32} />
            </div>
            <h3 className="text-lg font-bold text-slate-700 dark:text-slate-200">Belum ada materi</h3>
            <p className="text-slate-500 text-sm">Admin belum mengupload materi untuk sistem ini.</p>
          </div>
        )}

        {materials.map((item) => (
          <div 
            key={item.id} 
            className={`
              bg-white dark:bg-slate-900 border transition-all duration-300 rounded-2xl overflow-hidden
              ${expandedId === item.id 
                ? 'border-teal-500/50 shadow-lg shadow-teal-500/10' 
                : 'border-slate-200 dark:border-slate-800 hover:border-teal-500/30'
              }
            `}
          >
            
            {/* Header Card (Clickable) */}
            <div 
              onClick={() => setExpandedId(expandedId === item.id ? null : item.id)}
              className="p-5 flex justify-between items-center cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
            >
              <div className="flex items-center gap-4">
                {/* Ikon Kategori Dinamis */}
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
                  item.category.includes('Must') 
                    ? 'bg-rose-100 text-rose-600 dark:bg-rose-900/20 dark:text-rose-400' 
                    : 'bg-teal-100 text-teal-600 dark:bg-teal-900/20 dark:text-teal-400'
                }`}>
                  {item.category.includes('Must') ? <Star size={20} fill="currentColor" /> : <Bookmark size={20} />}
                </div>

                <div>
                  {/* Badge Category */}
                  <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded border mb-1 inline-block ${getBadgeStyle(item.category)}`}>
                    {item.category}
                  </span>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white leading-tight">
                    {item.topic}
                  </h3>
                </div>
              </div>
              
              <div className={`transition-transform duration-300 text-slate-400 ${expandedId === item.id ? 'rotate-180' : ''}`}>
                <ChevronDown size={20} />
              </div>
            </div>

            {/* Expanded Content (Markdown Reader) */}
            {expandedId === item.id && (
              <div className="px-6 pb-8 pt-2 animate-in fade-in slide-in-from-top-2 border-t border-slate-100 dark:border-slate-800/50">
                
                {/* INI KUNCI AGAR MD BAGUS: Class 'prose' */}
                <div className="prose prose-sm md:prose-base max-w-none 
                  prose-slate dark:prose-invert 
                  prose-headings:text-teal-600 dark:prose-headings:text-teal-400 
                  prose-a:text-blue-500 prose-strong:text-slate-900 dark:prose-strong:text-white
                  marker:text-teal-500
                  mt-4 leading-relaxed"
                >
                  <ReactMarkdown>{item.content}</ReactMarkdown>
                </div>

                {/* Insight Section (Footer Card) */}
                {item.insight && (
                  <div className="mt-8 relative overflow-hidden rounded-xl border border-emerald-200 dark:border-emerald-500/20 bg-emerald-50 dark:bg-emerald-900/10 p-5">
                    <div className="absolute top-0 right-0 p-12 bg-emerald-400/10 rounded-full blur-xl translate-x-1/2 -translate-y-1/2"></div>
                    
                    <div className="relative z-10 flex gap-4">
                      <div className="bg-emerald-100 dark:bg-emerald-500/20 p-2 rounded-lg text-emerald-600 dark:text-emerald-400 h-fit">
                        <Sparkles size={18} />
                      </div>
                      <div>
                        <h4 className="text-emerald-700 dark:text-emerald-400 font-bold text-sm mb-1">
                          MedPrep Insight
                        </h4>
                        <p className="text-emerald-800 dark:text-emerald-200 text-sm italic leading-relaxed">
                          "{item.insight}"
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
        
        {/* Footer Note */}
        <div className="text-center pt-8 pb-4">
          <p className="text-xs text-slate-400">
            Sumber: SKDI 2024 & Konsensus Perhimpunan Dokter Spesialis
          </p>
        </div>

      </div>
    </div>
  );
}