import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, useOutletContext } from 'react-router-dom'; // Import OutletContext
import { 
  ArrowLeft, ChevronDown, Sparkles, 
  AlertCircle, BookOpen, Star, Bookmark, Lock, Info 
} from 'lucide-react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';
import ReactMarkdown from 'react-markdown';
import { useAuth } from '../context/AuthContext';
import PremiumLock from '../components/PremiumLock';

// Interface Data
interface Material {
  id: string;
  system: string;
  topic: string; 
  content: string; 
  category: string;
  insight?: string;
  type?: 'free' | 'premium';
}

export default function MaterialViewer() {
  const [searchParams] = useSearchParams();
  const system = searchParams.get('system');
  const navigate = useNavigate();
  const { currentUser } = useAuth(); 
  
  // AMBIL STATUS INSIGHT DARI LAYOUT
  const { isInsightActive } = useOutletContext<{ isInsightActive: boolean }>();

  const [materials, setMaterials] = useState<Material[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    const fetchMaterials = async () => {
      if (!system) return;
      try {
        const q = query(collection(db, "cbt_materials"), where("system", "==", system));
        const snapshot = await getDocs(q);
        
        const data = snapshot.docs.map(doc => {
            const d = doc.data();
            return { 
                id: doc.id, 
                ...d,
                topic: d.title || d.topic 
            };
        }) as Material[];
        
        const sortedData = data.sort((a, b) => {
            const isAPremium = a.type === 'premium';
            const isBPremium = b.type === 'premium';
            if (isAPremium && !isBPremium) return -1;
            if (!isAPremium && isBPremium) return 1;
            return 0;
        });

        setMaterials(sortedData);
        if (sortedData.length > 0) setExpandedId(sortedData[0].id);
      } catch (err) { console.error(err); } 
      finally { setLoading(false); }
    };
    fetchMaterials();
  }, [system]);

  const getBadgeStyle = (cat: string) => {
    const category = cat?.toLowerCase() || '';
    if (category.includes('high') || category.includes('yield') || category.includes('must')) {
        return 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20';
    }
    if (category.includes('red') || category.includes('flag')) {
        return 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-500/10 dark:text-rose-400 dark:border-rose-500/20';
    }
    return 'bg-teal-50 text-teal-700 border-teal-200 dark:bg-teal-500/10 dark:text-teal-400 dark:border-teal-500/20';
  };

  return (
    <div className="animate-in slide-in-from-bottom-4 duration-500 pb-32 min-h-screen max-w-5xl mx-auto px-4 md:px-6 space-y-6">
      
      {/* HEADER COMPACT */}
      <div className="relative bg-slate-900 dark:bg-black rounded-[2rem] p-6 md:p-8 overflow-hidden shadow-xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-pink-500 rounded-full blur-[80px] opacity-20"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-500 rounded-full blur-[60px] opacity-20"></div>

        <div className="relative z-10">
           <button onClick={() => navigate(-1)} className="mb-4 flex items-center gap-2 text-[10px] font-bold text-slate-300 hover:text-white transition-colors bg-white/10 px-3 py-1.5 rounded-full w-fit backdrop-blur-md border border-white/5"><ArrowLeft size={12} /> Kembali</button>
          <div className="flex flex-col gap-1">
            <span className="text-pink-300 font-bold uppercase tracking-widest text-[9px] flex items-center gap-2"><BookOpen size={12} /> Clinical Knowledge</span>
            <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight leading-tight">{system || 'Memuat...'}</h1>
            <p className="text-slate-400 text-xs max-w-xl leading-relaxed mt-1 font-medium">Rangkuman poin kunci <span className="text-amber-400">Must Know</span> sesuai SKDI terbaru.</p>
          </div>
        </div>
      </div>

      {/* CONTENT LIST */}
      <div className="space-y-3">
        {loading && (<div className="text-center py-20"><div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div><p className="text-slate-400 text-xs font-medium animate-pulse">Menyiapkan materi...</p></div>)}
        {!loading && materials.length === 0 && (<div className="flex flex-col items-center justify-center py-16 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 text-center"><div className="w-12 h-12 bg-slate-200 dark:bg-slate-800 rounded-full flex items-center justify-center text-slate-400 mb-2"><AlertCircle size={24} /></div><h3 className="text-sm font-bold text-slate-700 dark:text-slate-200">Belum ada materi</h3></div>)}

        {materials.map((item) => {
            const userStatus = (currentUser?.subscriptionStatus as string) || 'free';
            const allowedStatuses = ['premium', 'expert', 'basic'];
            const isLocked = item.type === 'premium' && !allowedStatuses.includes(userStatus);
            const displayCategory = (item.category === 'High Yield' || item.category === 'High yield') ? 'Must Know' : item.category;

            return (
              <div key={item.id} className={`group bg-white dark:bg-slate-900 border transition-all duration-300 rounded-2xl overflow-hidden ${expandedId === item.id ? 'border-indigo-500/30 shadow-lg shadow-indigo-500/5' : 'border-slate-200 dark:border-white/5 hover:border-indigo-500/30 hover:shadow-md'}`}>
                <div onClick={() => setExpandedId(expandedId === item.id ? null : item.id)} className="p-4 md:p-5 flex justify-between items-start cursor-pointer relative">
                  <div className="flex items-start gap-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-sm transition-transform group-hover:scale-105 ${item.type === 'premium' ? 'bg-gradient-to-br from-amber-100 to-amber-200 text-amber-700 dark:from-amber-900/40 dark:to-amber-900/10 dark:text-amber-400' : 'bg-gradient-to-br from-teal-50 to-teal-100 text-teal-600 dark:from-teal-900/40 dark:to-teal-900/10 dark:text-teal-400'}`}>{item.type === 'premium' ? <Star size={18} fill="currentColor"/> : <Bookmark size={18} />}</div>
                    <div className="space-y-1">
                      <div className="flex flex-wrap gap-2 items-center"><span className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded-md border ${getBadgeStyle(item.category)}`}>{displayCategory}</span>{item.type === 'premium' && (<span className="text-[9px] font-bold uppercase px-2 py-0.5 rounded-md border bg-slate-900 text-white border-slate-700 flex items-center gap-1"><Lock size={8} /> PRO</span>)}</div>
                      <h3 className="text-base md:text-lg font-bold text-slate-900 dark:text-white leading-tight group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{item.topic}</h3>
                    </div>
                  </div>
                  <div className={`w-8 h-8 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-400 transition-all duration-300 ${expandedId === item.id ? 'rotate-180 bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400' : 'group-hover:bg-slate-100 dark:group-hover:bg-slate-700'}`}><ChevronDown size={16} /></div>
                </div>

                <div className={`grid transition-all duration-500 ease-in-out ${expandedId === item.id ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
                  <div className="overflow-hidden">
                    <div className="px-4 md:px-5 pb-6 pt-0">
                        <div className="h-px w-full bg-slate-100 dark:bg-slate-800 mb-4"></div>
                        
                        {isLocked ? ( <div className="py-6"><PremiumLock /></div> ) : (
                           <>
                             <article className="prose prose-sm md:prose-base max-w-none prose-slate dark:prose-invert prose-headings:font-bold prose-headings:text-indigo-900 dark:prose-headings:text-indigo-300 prose-headings:mb-2 prose-headings:mt-4 prose-p:text-slate-700 dark:prose-p:text-slate-300 prose-p:leading-snug prose-p:my-2 prose-strong:text-slate-900 dark:prose-strong:text-white prose-strong:font-black prose-li:marker:text-indigo-500 prose-li:my-0.5 prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline">
                               <ReactMarkdown>{item.content}</ReactMarkdown>
                             </article>

                             {/* CONDITIONAL RENDERING INSIGHT BOX */}
                             {isInsightActive && item.insight && (
                               <div className="mt-6 relative overflow-hidden rounded-2xl border border-amber-200 dark:border-amber-500/20 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/10 p-4">
                                 <div className="absolute top-0 right-0 w-24 h-24 bg-amber-400/20 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2"></div>
                                 <div className="relative z-10 flex gap-3 items-start">
                                   <div className="bg-white dark:bg-amber-900/40 p-2 rounded-xl text-amber-600 dark:text-amber-400 shadow-sm shrink-0"><Sparkles size={18} className="text-amber-500" /></div>
                                   <div>
                                     <h4 className="text-amber-800 dark:text-amber-300 font-bold text-xs uppercase tracking-wider mb-1 flex items-center gap-2">MedPrep Insight</h4>
                                     <p className="text-slate-700 dark:text-slate-200 text-sm font-medium italic leading-snug">"{item.insight}"</p>
                                   </div>
                                 </div>
                               </div>
                             )}
                           </>
                        )}
                    </div>
                  </div>
                </div>
              </div>
            );
        })}
        <div className="text-center pt-8 pb-4 opacity-50"><p className="text-[10px] text-slate-500 uppercase tracking-widest flex items-center justify-center gap-2"><Info size={10} /> Sumber: SKDI 2024</p></div>
      </div>
    </div>
  );
}