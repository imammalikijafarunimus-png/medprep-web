import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, ChevronDown, Sparkles, 
  AlertCircle, BookOpen, Star, Bookmark, Siren, Flame 
} from 'lucide-react';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { db } from '../lib/firebase'; // Pastikan path firebase benar
import ReactMarkdown from 'react-markdown';

// Sesuaikan Interface dengan Data dari Admin Panel Baru
interface Material {
  id: string;
  system: string;
  title: string;      // Admin Panel pakai 'title'
  content: string; 
  category: string;   // High Yield, Red Flag, Emergency
  insight?: string;
}

export default function MaterialViewer() {
  const [searchParams] = useSearchParams();
  const system = searchParams.get('system');
  const navigate = useNavigate();
  
  const [materials, setMaterials] = useState<Material[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    const fetchMaterials = async () => {
      if (!system) return;
      try {
        // AMBIL DARI KOLEKSI BARU 'cbt_materials'
        // Kita urutkan berdasarkan createdAt desc (terbaru diatas) atau bisa di client side
        const q = query(collection(db, "cbt_materials"), where("system", "==", system));
        const snapshot = await getDocs(q);
        
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Material[];
        
        // Sorting Client Side: Emergency & Red Flag duluan, baru High Yield
        const sortedData = data.sort((a, b) => {
            const priority = { 'Emergency': 3, 'Red Flag': 2, 'High Yield': 1, 'Skill Lab': 0 };
            const pA = priority[a.category as keyof typeof priority] || 0;
            const pB = priority[b.category as keyof typeof priority] || 0;
            return pB - pA;
        });

        setMaterials(sortedData);
        if (sortedData.length > 0) setExpandedId(sortedData[0].id);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchMaterials();
  }, [system]);

  // --- HELPER: BADGE COLOR & ICON ---
  const getCategoryConfig = (cat: string) => {
    switch (cat) {
        case 'Red Flag': return { color: 'bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-400', icon: Siren };
        case 'Emergency': return { color: 'bg-orange-100 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400', icon: Flame };
        case 'High Yield': return { color: 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-400', icon: Star };
        default: return { color: 'bg-teal-100 text-teal-600 dark:bg-teal-900/20 dark:text-teal-400', icon: Bookmark };
    }
  };

  return (
    <div className="animate-in slide-in-from-right duration-500 pb-20 min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors">
      
      {/* HEADER */}
      <div className="relative bg-gradient-to-r from-teal-900 via-slate-900 to-slate-900 pb-12 pt-8 px-6 rounded-b-[2.5rem] shadow-2xl overflow-hidden mb-8">
        <div className="absolute top-0 right-0 p-40 bg-teal-500/10 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 left-0 p-20 bg-emerald-500/10 rounded-full blur-2xl -translate-x-1/2 translate-y-1/2"></div>

        <div className="relative z-10 max-w-4xl mx-auto">
          <button onClick={() => navigate(-1)} className="mb-6 p-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full text-white transition-all w-fit">
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
              Rangkuman materi High Yield, Red Flag, dan Emergency cases sesuai SKDI.
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

        {materials.map((item) => {
            const config = getCategoryConfig(item.category);
            const Icon = config.icon;

            return (
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
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${config.color}`}>
                      <Icon size={20} fill="currentColor" className="opacity-80" />
                    </div>

                    <div>
                      <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded border mb-1 inline-block border-transparent bg-slate-100 dark:bg-slate-800 text-slate-500`}>
                        {item.category}
                      </span>
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white leading-tight">
                        {item.title}
                      </h3>
                    </div>
                  </div>
                  
                  <div className={`transition-transform duration-300 text-slate-400 ${expandedId === item.id ? 'rotate-180' : ''}`}>
                    <ChevronDown size={20} />
                  </div>
                </div>

                {/* Expanded Content */}
                {expandedId === item.id && (
                  <div className="px-6 pb-8 pt-2 animate-in fade-in slide-in-from-top-2 border-t border-slate-100 dark:border-slate-800/50">
                    <div className="prose prose-sm md:prose-base max-w-none prose-slate dark:prose-invert prose-headings:text-teal-600 dark:prose-headings:text-teal-400 prose-a:text-blue-500 prose-strong:text-slate-900 dark:prose-strong:text-white marker:text-teal-500 mt-4 leading-relaxed">
                      <ReactMarkdown>{item.content}</ReactMarkdown>
                    </div>

                    {item.insight && (
                      <div className="mt-8 relative overflow-hidden rounded-xl border border-emerald-200 dark:border-emerald-500/20 bg-emerald-50 dark:bg-emerald-900/10 p-5">
                        <div className="absolute top-0 right-0 p-12 bg-emerald-400/10 rounded-full blur-xl translate-x-1/2 -translate-y-1/2"></div>
                        <div className="relative z-10 flex gap-4">
                          <div className="bg-emerald-100 dark:bg-emerald-500/20 p-2 rounded-lg text-emerald-600 dark:text-emerald-400 h-fit">
                             <Sparkles size={18} />
                          </div>
                          <div>
                            <h4 className="text-emerald-700 dark:text-emerald-400 font-bold text-sm mb-1">MedPrep Insight</h4>
                            <p className="text-emerald-800 dark:text-emerald-200 text-sm italic leading-relaxed">"{item.insight}"</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
        })}
        
        <div className="text-center pt-8 pb-4">
          <p className="text-xs text-slate-400">Sumber: SKDI 2024 & Konsensus Perhimpunan Dokter Spesialis</p>
        </div>

      </div>
    </div>
  );
}