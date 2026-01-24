import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams, useNavigate, useOutletContext } from 'react-router-dom';
import { 
  ArrowLeft, ChevronDown, Sparkles, Search, SortAsc, SortDesc,
  BookOpen, Star, Bookmark, Lock, Info, CheckCircle2, X, Target
} from 'lucide-react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';
import ReactMarkdown from 'react-markdown';
import { useAuth } from '../context/AuthContext';
import PremiumLock from '../components/PremiumLock';
import MarkdownAlert, { AlertType } from '../components/MarkdownAlert';

interface Material {
  id: string;
  system: string;
  topic: string; 
  content: string; 
  category: string;
  skdi?: string; 
  insight?: string;
  type?: 'free' | 'premium';
}

export default function MaterialViewer() {
  const [searchParams] = useSearchParams();
  const system = searchParams.get('system');
  const navigate = useNavigate();
  const { currentUser } = useAuth(); 
  const { isInsightActive } = useOutletContext<{ isInsightActive: boolean }>();

  const [materials, setMaterials] = useState<Material[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortMode, setSortMode] = useState<'recommended' | 'a-z' | 'z-a'>('recommended');
  
  const [readHistory, setReadHistory] = useState<string[]>(() => {
      const saved = localStorage.getItem('medprep_read_materials');
      return saved ? JSON.parse(saved) : [];
  });

  // --- PARSING LOGIC BARU (LEBIH KUAT) ---
  // Fungsi ini memecah konten menjadi bagian-bagian (text biasa vs alert box)
  const renderContentWithAlerts = (content: string) => {
    // Regex untuk menangkap blok :::tipe ... ::: (multiline)
    // flag 's' (dotAll) agar . cocok dengan newline
    const regex = /:::(key-difference|clinical-pearls|high-yield|mnemonic)\s+([\s\S]*?)\s+:::/g;
    
    const parts = [];
    let lastIndex = 0;
    let match;

    while ((match = regex.exec(content)) !== null) {
      // 1. Tambahkan teks biasa sebelum blok alert
      if (match.index > lastIndex) {
        parts.push({
          type: 'text',
          content: content.substring(lastIndex, match.index)
        });
      }

      // 2. Tambahkan blok alert
      parts.push({
        type: 'alert',
        alertType: match[1] as AlertType,
        content: match[2] // Isi di dalam blok
      });

      lastIndex = regex.lastIndex;
    }

    // 3. Tambahkan sisa teks setelah blok terakhir
    if (lastIndex < content.length) {
      parts.push({
        type: 'text',
        content: content.substring(lastIndex)
      });
    }

    // Render hasil pecahan
    return parts.map((part, index) => {
      if (part.type === 'alert') {
        return (
          <MarkdownAlert key={index} type={part.alertType as AlertType}>
            {/* Render isi alert sebagai Markdown juga, agar bullet points jalan */}
            <ReactMarkdown 
               components={{
                 p: ({children}) => <div className="mb-2">{children}</div>, // Hindari p dalam div alert
                 ul: ({children}) => <ul className="list-disc pl-4 space-y-1 my-2 marker:text-current">{children}</ul>,
                 li: ({children}) => <li className="pl-1">{children}</li>
               }}
            >
              {part.content}
            </ReactMarkdown>
          </MarkdownAlert>
        );
      } else {
        return (
          <ReactMarkdown 
            key={index}
            components={{
                p: ({ children }) => <p className="text-slate-700 dark:text-slate-300 leading-relaxed my-3 font-medium">{children}</p>,
                ul: ({children}) => <ul className="list-disc pl-5 space-y-1 my-3 text-slate-700 dark:text-slate-300 marker:text-indigo-500">{children}</ul>,
                li: ({children}) => <li className="pl-1">{children}</li>,
                h2: ({children}) => <h2 className="text-xl font-black text-slate-900 dark:text-white mt-6 mb-3 flex items-center gap-2">{children}</h2>,
                strong: ({children}) => <strong className="font-black text-indigo-700 dark:text-indigo-400">{children}</strong>
            }}
          >
            {part.content}
          </ReactMarkdown>
        );
      }
    });
  };

  useEffect(() => {
    const fetchMaterials = async () => {
      if (!system) return;
      try {
        const q = query(collection(db, "cbt_materials"), where("system", "==", system));
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map(doc => {
            const d = doc.data();
            return { id: doc.id, ...d, topic: d.title || d.topic };
        }) as Material[];
        setMaterials(data);
        if (data.length > 0 && !expandedId) setExpandedId(data[0].id);
      } catch (err) { console.error(err); } 
      finally { setLoading(false); }
    };
    fetchMaterials();
  }, [system]);

  const handleExpand = (id: string) => {
      if (expandedId === id) { setExpandedId(null); } else {
          setExpandedId(id);
          if (!readHistory.includes(id)) {
              const newHistory = [...readHistory, id];
              setReadHistory(newHistory);
              localStorage.setItem('medprep_read_materials', JSON.stringify(newHistory));
          }
      }
  };

  const processedMaterials = useMemo(() => {
      let result = materials.filter(item => 
          item.topic.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.content.toLowerCase().includes(searchQuery.toLowerCase())
      );
      if (sortMode === 'a-z') { result.sort((a, b) => a.topic.localeCompare(b.topic)); } 
      else if (sortMode === 'z-a') { result.sort((a, b) => b.topic.localeCompare(a.topic)); } 
      else {
          result.sort((a, b) => {
              const scoreA = (a.type === 'premium' ? 2 : 0) + (a.category.toLowerCase().includes('high') ? 1 : 0);
              const scoreB = (b.type === 'premium' ? 2 : 0) + (b.category.toLowerCase().includes('high') ? 1 : 0);
              return scoreB - scoreA;
          });
      }
      return result;
  }, [materials, searchQuery, sortMode]);

  const getBadgeStyle = (cat: string) => {
    const category = cat?.toLowerCase() || '';
    if (category.includes('high') || category.includes('yield') || category.includes('must') || category.includes('prioritas')) {
        return 'bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-500/20 dark:text-amber-300 dark:border-amber-500/30';
    }
    if (category.includes('red') || category.includes('flag')) {
        return 'bg-rose-100 text-rose-700 border-rose-200 dark:bg-rose-500/20 dark:text-rose-300 dark:border-rose-500/30';
    }
    return 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-500/20 dark:text-blue-300 dark:border-blue-500/30';
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 pb-32 min-h-screen max-w-5xl mx-auto px-4 md:px-6 space-y-6">
      
      {/* HEADER */}
      <div className="space-y-4">
          <div className="flex items-center gap-3">
              <button onClick={() => navigate(-1)} className="p-2 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 transition-colors shadow-sm"><ArrowLeft size={18} className="text-slate-600 dark:text-slate-300" /></button>
              <div>
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest"><BookOpen size={12} /> Materi High-Yield</div>
                  <h1 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white leading-none">{system || 'Memuat...'}</h1>
              </div>
          </div>
          <div className="flex flex-col md:flex-row gap-3">
              <div className="relative flex-1 group">
                  <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-slate-400 group-focus-within:text-indigo-500 transition-colors"><Search size={18} /></div>
                  <input type="text" placeholder="Cari penyakit..." className="w-full pl-10 pr-10 py-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all shadow-sm text-slate-900 dark:text-white" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}/>
                  {searchQuery && (<button onClick={() => setSearchQuery('')} className="absolute inset-y-0 right-3 flex items-center text-slate-400 hover:text-slate-600"><X size={16} /></button>)}
              </div>
              <div className="flex gap-2">
                  <button onClick={() => setSortMode('recommended')} className={`px-4 py-3 rounded-xl text-xs font-bold border transition-all ${sortMode === 'recommended' ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900' : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800'}`}><Star size={14} /></button>
                  <button onClick={() => setSortMode(sortMode === 'a-z' ? 'z-a' : 'a-z')} className={`px-4 py-3 rounded-xl text-xs font-bold border transition-all bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800`}>{sortMode === 'z-a' ? <SortDesc size={14} /> : <SortAsc size={14} />}</button>
              </div>
          </div>
      </div>

      {/* LIST */}
      <div className="space-y-4">
        {loading && (<div className="text-center py-20"><div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div><p className="text-slate-400 text-xs font-bold">Menyiapkan materi...</p></div>)}
        {!loading && processedMaterials.length === 0 && (<div className="text-center py-20 opacity-50"><p className="text-slate-500 dark:text-slate-400">Materi tidak ditemukan.</p></div>)}

        {processedMaterials.map((item) => {
            const userStatus = (currentUser?.subscriptionStatus as string) || 'free';
            const allowedStatuses = ['premium', 'expert', 'basic'];
            const isLocked = item.type === 'premium' && !allowedStatuses.includes(userStatus);
            const displayCategory = (item.category?.toLowerCase().includes('high')) ? 'Prioritas' : item.category;
            const isExpanded = expandedId === item.id;
            const isRead = readHistory.includes(item.id);

            return (
              <div key={item.id} className={`group bg-white dark:bg-slate-900 border transition-all duration-300 rounded-2xl overflow-hidden ${isExpanded ? 'border-indigo-500/30 shadow-xl' : 'border-slate-200 dark:border-white/5 hover:border-indigo-300 dark:hover:border-indigo-700'} ${!isExpanded && isRead ? 'opacity-80' : 'opacity-100'}`}>
                <div onClick={() => handleExpand(item.id)} className="p-5 flex justify-between items-start cursor-pointer relative select-none">
                  <div className="flex items-start gap-4 flex-1">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border ${item.type === 'premium' ? 'bg-amber-50 border-amber-100 text-amber-600' : 'bg-indigo-50 border-indigo-100 text-indigo-600'}`}>
                      {item.type === 'premium' ? <Star size={20} fill="currentColor"/> : <Bookmark size={20} />}
                    </div>
                    <div className="space-y-1.5 flex-1">
                      <div className="flex flex-wrap gap-2 items-center">
                         <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-md border ${getBadgeStyle(item.category)}`}>{displayCategory}</span>
                         {item.skdi && (<span className="text-[9px] font-black uppercase px-2 py-0.5 rounded-md border bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700 flex items-center gap-1"><Target size={8} /> SKDI {item.skdi}</span>)}
                         {item.type === 'premium' && (<span className="text-[9px] font-black uppercase px-2 py-0.5 rounded-md border bg-slate-900 text-white border-slate-700 flex items-center gap-1"><Lock size={8} /> PRO</span>)}
                         {isRead && !isExpanded && (<span className="text-[9px] font-bold text-slate-400 flex items-center gap-1"><CheckCircle2 size={10} /> Dibaca</span>)}
                      </div>
                      <h3 className={`text-lg font-bold leading-tight transition-colors ${isExpanded ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400'}`}>{item.topic}</h3>
                    </div>
                  </div>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-slate-400 transition-all ${isExpanded ? 'bg-indigo-50 text-indigo-600 rotate-180 dark:bg-indigo-900/50 dark:text-indigo-400' : ''}`}><ChevronDown size={18} /></div>
                </div>

                <div className={`grid transition-all duration-500 ease-in-out ${isExpanded ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
                  <div className="overflow-hidden">
                    <div className="px-5 pb-6 pt-0">
                        <div className="h-px w-full bg-slate-100 dark:bg-slate-800 mb-6"></div>
                        {isLocked ? (<div className="py-6"><PremiumLock /></div>) : (
                           <>
                             {/* RENDER KONTEN DENGAN LOGIC BARU */}
                             <div className="prose prose-sm max-w-none prose-slate dark:prose-invert">
                                {renderContentWithAlerts(item.content)}
                             </div>

                             {isInsightActive && item.insight && (
                               <div className="mt-8 relative overflow-hidden rounded-2xl border border-amber-200 dark:border-amber-500/30 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/40 dark:to-orange-950/20 p-5">
                                 <div className="absolute top-0 right-0 w-32 h-32 bg-amber-400/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                                 <div className="relative z-10 flex gap-4 items-start">
                                   <div className="bg-white dark:bg-amber-900/20 p-2.5 rounded-xl text-amber-600 dark:text-amber-400 shadow-sm shrink-0 border border-amber-100 dark:border-amber-800"><Sparkles size={20} className="text-amber-500 dark:text-amber-400" fill="currentColor" /></div>
                                   <div>
                                     <h4 className="text-amber-800 dark:text-amber-400 font-black text-xs uppercase tracking-widest mb-1.5 flex items-center gap-2">MedPrep Insight</h4>
                                     <p className="text-slate-800 dark:text-white text-sm font-medium italic leading-relaxed font-serif opacity-90">"{item.insight}"</p>
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
        <div className="text-center pt-8 pb-4 opacity-50"><p className="text-[10px] text-slate-500 uppercase tracking-widest flex items-center justify-center gap-2"><Info size={10} /> Sumber: SKDI 2024 & Konsensus Spesialis</p></div>
      </div>
    </div>
  );
}