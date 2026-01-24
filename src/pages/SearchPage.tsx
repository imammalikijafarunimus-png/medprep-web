import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { 
  Search, ArrowLeft, BookOpen, Brain, Zap, Stethoscope, 
  ChevronRight, AlertCircle, FileText, Activity 
} from 'lucide-react';
import { collection, getDocs, query, limit } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { FLASHCARDS } from '../data/flashcard_data'; // Pastikan path benar
import { STATION_DATA } from '../data/osce_data';   // Pastikan path benar

// Tipe Hasil Pencarian
type SearchResult = {
  id: string;
  type: 'cbt' | 'material' | 'osce' | 'flashcard';
  title: string;
  subtitle: string;
  link: string;
};

export default function SearchPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const queryText = searchParams.get('q')?.toLowerCase() || '';

  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeFilter, setActiveFilter] = useState<'all' | 'cbt' | 'material' | 'osce' | 'flashcard'>('all');

  useEffect(() => {
    const performSearch = async () => {
      if (!queryText) return;
      setLoading(true);
      
      const combinedResults: SearchResult[] = [];

      try {
        // 1. CARI DI FLASHCARDS (Local Data - Cepat)
        const flashcardMatches = FLASHCARDS.filter(card => 
            card.question.toLowerCase().includes(queryText) || 
            card.answer.toLowerCase().includes(queryText)
        ).map(card => ({
            id: card.id,
            type: 'flashcard' as const,
            title: card.question,
            subtitle: `Jawaban: ${card.answer.substring(0, 50)}...`,
            link: '/app/flashcards'
        }));
        combinedResults.push(...flashcardMatches);

        // 2. CARI DI OSCE (Local Data)
        // Melakukan loop ke object STATION_DATA
        Object.values(STATION_DATA).forEach((station: any) => {
            station.cases?.forEach((cs: any) => {
                if (cs.title.toLowerCase().includes(queryText) || cs.summary.toLowerCase().includes(queryText)) {
                    combinedResults.push({
                        id: cs.id,
                        type: 'osce' as const,
                        title: cs.title,
                        subtitle: `Station: ${station.title}`,
                        link: '/app/osce' // Idealnya deep link ke kasus spesifik jika logic view mendukung
                    });
                }
            });
        });

        // 3. CARI DI MATERI (Firebase)
        // Catatan: Firestore tidak support "contains" query secara native dan murah.
        // Strategi: Ambil dokumen (bisa dibatasi limit) lalu filter manual di client.
        const materialRef = collection(db, "cbt_materials");
        const materialSnapshot = await getDocs(query(materialRef, limit(100))); // Limit agar tidak berat
        
        materialSnapshot.docs.forEach(doc => {
            const data = doc.data();
            const topic = data.topic || data.title || '';
            const content = data.content || '';
            
            if (topic.toLowerCase().includes(queryText) || content.toLowerCase().includes(queryText)) {
                combinedResults.push({
                    id: doc.id,
                    type: 'material' as const,
                    title: topic,
                    subtitle: content.substring(0, 60).replace(/[#*]/g, '') + '...', // Bersihkan markdown dikit
                    link: `/app/cbt/read?system=${encodeURIComponent(data.system)}`
                });
            }
        });

        // 4. CARI DI SOAL CBT (Firebase)
        const questionRef = collection(db, "cbt_questions");
        const questionSnapshot = await getDocs(query(questionRef, limit(50))); // Limit 50 soal sampel
        
        questionSnapshot.docs.forEach(doc => {
            const data = doc.data();
            const qText = data.question || '';
            
            if (qText.toLowerCase().includes(queryText)) {
                combinedResults.push({
                    id: doc.id,
                    type: 'cbt' as const,
                    title: `Soal ${data.system}`,
                    subtitle: qText.substring(0, 60) + '...',
                    link: `/app/cbt/quiz?system=${encodeURIComponent(data.system)}&mode=random` // Link sementara
                });
            }
        });

        setResults(combinedResults);

      } catch (error) {
        console.error("Search Error:", error);
      } finally {
        setLoading(false);
      }
    };

    performSearch();
  }, [queryText]);

  // Filter Tampilan
  const displayedResults = activeFilter === 'all' 
    ? results 
    : results.filter(r => r.type === activeFilter);

  // Helper Icon
  const getTypeIcon = (type: string) => {
      switch(type) {
          case 'cbt': return <Brain size={16} className="text-indigo-500" />;
          case 'material': return <BookOpen size={16} className="text-pink-500" />;
          case 'osce': return <Stethoscope size={16} className="text-teal-500" />;
          case 'flashcard': return <Zap size={16} className="text-yellow-500" />;
          default: return <Search size={16} />;
      }
  };

  const getTypeLabel = (type: string) => {
      switch(type) {
          case 'cbt': return 'Soal CBT';
          case 'material': return 'Materi';
          case 'osce': return 'Kasus OSCE';
          case 'flashcard': return 'Flashcard';
          default: return 'Lainnya';
      }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 md:px-6 py-6 pb-24 font-sans min-h-screen animate-in fade-in">
      
      {/* HEADER */}
      <div className="flex items-center gap-3 mb-6">
          <button onClick={() => navigate(-1)} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500">
              <ArrowLeft size={20} />
          </button>
          <div>
              <h1 className="text-xl font-black text-slate-900 dark:text-white">Hasil Pencarian</h1>
              <p className="text-xs text-slate-500">Untuk kata kunci: <span className="font-bold text-slate-800 dark:text-slate-300">"{queryText}"</span></p>
          </div>
      </div>

      {/* TABS FILTER */}
      <div className="flex gap-2 overflow-x-auto pb-4 mb-2 custom-scrollbar">
          {[
              { id: 'all', label: 'Semua' },
              { id: 'cbt', label: 'Soal CBT' },
              { id: 'material', label: 'Materi' },
              { id: 'osce', label: 'OSCE' },
              { id: 'flashcard', label: 'Flashcard' },
          ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveFilter(tab.id as any)}
                className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                    activeFilter === tab.id 
                    ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-md' 
                    : 'bg-white dark:bg-slate-800 text-slate-500 border border-slate-200 dark:border-slate-700'
                }`}
              >
                  {tab.label}
              </button>
          ))}
      </div>

      {/* RESULTS AREA */}
      <div className="space-y-3">
          {loading ? (
              <div className="space-y-3 pt-4">
                  {[1,2,3].map(i => (
                      <div key={i} className="h-20 bg-slate-100 dark:bg-slate-800/50 rounded-2xl animate-pulse"></div>
                  ))}
              </div>
          ) : displayedResults.length > 0 ? (
              displayedResults.map((item, idx) => (
                  <div 
                    key={`${item.type}-${item.id}-${idx}`}
                    onClick={() => navigate(item.link)}
                    className="group bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-100 dark:border-white/5 hover:border-indigo-500/30 hover:shadow-md transition-all cursor-pointer flex items-start gap-4"
                  >
                      {/* Icon Box */}
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 bg-slate-50 dark:bg-slate-800 group-hover:scale-110 transition-transform`}>
                          {getTypeIcon(item.type)}
                      </div>

                      <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                              <span className="text-[9px] font-bold uppercase tracking-widest text-slate-400 border border-slate-200 dark:border-slate-700 px-1.5 py-0.5 rounded">
                                  {getTypeLabel(item.type)}
                              </span>
                          </div>
                          <h3 className="text-sm font-bold text-slate-900 dark:text-white truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                              {item.title}
                          </h3>
                          <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed mt-0.5">
                              {item.subtitle}
                          </p>
                      </div>

                      <div className="self-center text-slate-300 group-hover:text-indigo-500 transition-colors">
                          <ChevronRight size={18} />
                      </div>
                  </div>
              ))
          ) : (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                  <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4 text-slate-400">
                      <Search size={32} />
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">Tidak ditemukan</h3>
                  <p className="text-xs text-slate-500 mt-1 max-w-xs">
                      Coba gunakan kata kunci lain seperti "Hipertensi", "Ankle", atau nama obat.
                  </p>
              </div>
          )}
      </div>

    </div>
  );
}