import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, BookOpen, ChevronDown, ChevronUp, Sparkles } from 'lucide-react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';
import ReactMarkdown from 'react-markdown'; // Opsional: Kalau mau support Bold/List dr database

interface Material {
  id: string;
  topic: string;
  content: string; // Bisa format Markdown
  category: string;
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
        const q = query(collection(db, "study_materials"), where("system", "==", system));
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Material[];
        setMaterials(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchMaterials();
  }, [system]);

  return (
    <div className="animate-in slide-in-from-right duration-500">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <button onClick={() => navigate(-1)} className="p-2 bg-slate-800 rounded-full text-slate-400 hover:text-white">
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-white">Materi: {system}</h1>
          <p className="text-slate-400 text-sm">High Yield Points & Clinical Keys</p>
        </div>
      </div>

      {loading && <div className="text-center text-slate-500 animate-pulse">Mengambil data materi...</div>}
      
      {!loading && materials.length === 0 && (
        <div className="p-12 text-center border border-dashed border-slate-800 rounded-2xl text-slate-500">
          Belum ada materi untuk sistem ini.
        </div>
      )}

      <div className="space-y-4">
        {materials.map((item) => (
          <div key={item.id} className="bg-slate-900/50 border border-slate-800 rounded-2xl overflow-hidden transition-all">
            
            {/* Header Accordion */}
            <div 
              onClick={() => setExpandedId(expandedId === item.id ? null : item.id)}
              className="p-6 flex justify-between items-center cursor-pointer hover:bg-slate-800/50"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-emerald-500/10 rounded-lg flex items-center justify-center text-emerald-400 font-bold text-sm">
                  HY
                </div>
                <h3 className="text-lg font-bold text-white">{item.topic}</h3>
              </div>
              {expandedId === item.id ? <ChevronUp className="text-slate-400"/> : <ChevronDown className="text-slate-400"/>}
            </div>

            {/* Content (Hanya muncul jika expanded) */}
            {expandedId === item.id && (
              <div className="px-6 pb-6 pt-0 border-t border-slate-800/50 animate-in fade-in">
                <div className="prose prose-invert prose-sm max-w-none mt-4 text-slate-300 leading-relaxed whitespace-pre-line">
                  {/* Gunakan ReactMarkdown jika data Anda format markdown, atau tampilkan text biasa */}
                  {item.content}
                </div>

                {/* Insight Section */}
                {item.insight && (
                  <div className="mt-6 bg-emerald-900/20 border border-emerald-500/20 p-4 rounded-xl flex gap-3">
                    <Sparkles className="text-emerald-400 shrink-0 mt-1" size={18} />
                    <div>
                      <h4 className="text-emerald-400 font-bold text-sm mb-1">MedPrep Insight</h4>
                      <p className="text-emerald-100/70 text-sm italic">"{item.insight}"</p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}