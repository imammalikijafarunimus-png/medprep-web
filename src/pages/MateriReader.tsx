import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { 
  BookOpen, CheckCircle, XCircle, ChevronRight, ChevronLeft, 
  HelpCircle, Sparkles, AlertCircle 
} from 'lucide-react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../lib/firebase'; 

interface Question {
  id: string;
  category: string;
  question: string;
  options: { A: string; B: string; C: string; D: string; E: string; };
  correctAnswer: string;
  explanation: string;
  insight?: string;
}

export default function MateriReader() {
  const [searchParams] = useSearchParams();
  const systemFilter = searchParams.get('system');

  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<{[key: number]: string}>({});
  const [showExplanation, setShowExplanation] = useState<{[key: number]: boolean}>({});

  useEffect(() => {
    const fetchQuestions = async () => {
      setLoading(true);
      try {
        let q;
        // FIX: Gunakan field 'system' untuk filter
        if (systemFilter) {
           q = query(collection(db, "cbt_questions"), where("system", "==", systemFilter));
        } else {
           q = collection(db, "cbt_questions");
        }

        const snapshot = await getDocs(q);
        
        const data = snapshot.docs.map(doc => {
          const d = doc.data();
          return {
            id: doc.id,
            category: d.system || 'Umum', // Tampilkan label System
            question: d.question,
            options: {
              // Handle format opsi A/a
              A: d.options?.a || d.options?.A,
              B: d.options?.b || d.options?.B,
              C: d.options?.c || d.options?.C,
              D: d.options?.d || d.options?.D,
              E: d.options?.e || d.options?.E
            },
            correctAnswer: (d.correctAnswer || '').toUpperCase(),
            explanation: d.explanation,
            insight: d.insight || null
          } as Question;
        });

        setQuestions(data);
      } catch (err) {
        console.error("Gagal mengambil soal:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchQuestions();
  }, [systemFilter]);

  const handleAnswer = (opt: string) => {
    if (showExplanation[currentIndex]) return;
    setSelectedAnswers(prev => ({ ...prev, [currentIndex]: opt }));
  };

  const checkAnswer = () => {
    setShowExplanation(prev => ({ ...prev, [currentIndex]: true }));
    
    // --- INTEGRASI DASHBOARD (TAMBAHAN BARU) ---
    // Tambah counter soal yg dikerjakan
    const currentCount = parseInt(localStorage.getItem('medprep_cbt_counter') || '0');
    localStorage.setItem('medprep_cbt_counter', (currentCount + 1).toString());
    // -------------------------------------------
  };;

  if (loading) return <div className="flex items-center justify-center h-screen text-slate-500 animate-pulse">Memuat Bank Soal {systemFilter ? `(${systemFilter})` : ''}...</div>;
  
  if (questions.length === 0) return (
    <div className="flex flex-col items-center justify-center h-[60vh] text-center border-2 border-dashed border-slate-800 rounded-3xl m-4">
      <div className="bg-slate-800 p-4 rounded-full mb-4">
        <AlertCircle className="text-slate-500" size={32} />
      </div>
      <h3 className="text-xl font-bold text-white mb-2">Soal Tidak Ditemukan</h3>
      <p className="text-slate-400 max-w-md">Belum ada soal untuk sistem <strong>"{systemFilter}"</strong>.</p>
    </div>
  );

  const currentQ = questions[currentIndex];
  const userAns = selectedAnswers[currentIndex];
  const isRevealed = showExplanation[currentIndex];

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-140px)] animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* AREA SOAL */}
      <div className="flex-1 flex flex-col min-h-0 bg-slate-900/50 backdrop-blur-md border border-slate-800 rounded-3xl overflow-hidden shadow-2xl relative">
        <div className="px-6 py-4 border-b border-slate-800 flex justify-between items-center bg-slate-900/80">
          <div className="flex items-center gap-3">
             <span className="bg-blue-600 text-white text-xs font-bold px-2.5 py-1 rounded-lg">No. {currentIndex + 1}</span>
             <span className="text-slate-400 text-xs uppercase tracking-wider font-bold">{currentQ.category}</span>
          </div>
          <div className="text-slate-500 text-xs flex items-center gap-1"><HelpCircle size={14} /> Mode Latihan</div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 md:p-8 custom-scrollbar">
          <div className="prose prose-invert prose-lg max-w-none mb-8">
            <p className="text-slate-200 leading-relaxed text-lg font-medium whitespace-pre-line">{currentQ.question}</p>
          </div>

          <div className="space-y-3">
            {['A','B','C','D','E'].map((opt) => {
              let btnClass = "border-slate-700 bg-slate-900/50 hover:bg-slate-800 text-slate-300";
              if (userAns === opt) btnClass = "border-blue-500 bg-blue-500/20 text-blue-200 ring-1 ring-blue-500";
              if (isRevealed) {
                if (opt === currentQ.correctAnswer) btnClass = "border-emerald-500 bg-emerald-500/20 text-emerald-300 ring-1 ring-emerald-500";
                else if (userAns === opt && userAns !== currentQ.correctAnswer) btnClass = "border-red-500 bg-red-500/20 text-red-300 ring-1 ring-red-500";
                else btnClass = "opacity-50 border-slate-800";
              }

              return (
                <button key={opt} onClick={() => handleAnswer(opt)} disabled={isRevealed} className={`w-full text-left p-4 rounded-xl border transition-all flex items-center gap-4 ${btnClass}`}>
                  <span className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold border ${btnClass.includes('emerald') ? 'border-emerald-500 bg-emerald-500 text-black' : btnClass.includes('red') ? 'border-red-500 bg-red-500 text-white' : btnClass.includes('blue') ? 'bg-blue-500 border-blue-500 text-white' : 'border-slate-600 text-slate-500'}`}>{opt}</span>
                  <span className="flex-1 text-sm md:text-base">{(currentQ.options as any)[opt]}</span>
                  {isRevealed && opt === currentQ.correctAnswer && <CheckCircle size={20} className="text-emerald-500" />}
                  {isRevealed && userAns === opt && userAns !== currentQ.correctAnswer && <XCircle size={20} className="text-red-500" />}
                </button>
              );
            })}
          </div>

          {isRevealed && (
            <div className="mt-8 space-y-6 animate-in slide-in-from-bottom-2">
              <div className="bg-blue-900/10 border border-blue-500/20 rounded-2xl p-6">
                <h4 className="flex items-center gap-2 font-bold text-blue-400 mb-3"><BookOpen size={18} /> Pembahasan Medis</h4>
                <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-line">{currentQ.explanation}</p>
              </div>
              
              {/* FITUR INSIGHT DI QUIZ (BARU) */}
              {currentQ.insight && (
                <div className="bg-emerald-900/10 border border-emerald-500/20 rounded-2xl p-6 relative overflow-hidden">
                   <div className="absolute top-0 right-0 p-16 bg-emerald-500/5 rounded-full blur-2xl"></div>
                   <h4 className="flex items-center gap-2 font-bold text-emerald-400 mb-3 relative z-10"><Sparkles size={18} /> MedPrep Insight</h4>
                   <p className="text-slate-300 text-sm leading-relaxed relative z-10 italic">"{currentQ.insight}"</p>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="p-4 border-t border-slate-800 bg-slate-900/80 backdrop-blur flex justify-between items-center">
          <button disabled={currentIndex === 0} onClick={() => setCurrentIndex(c => c - 1)} className="flex items-center gap-2 px-4 py-2 text-slate-400 hover:text-white disabled:opacity-30 transition-colors"><ChevronLeft size={20} /> Prev</button>
          {!isRevealed ? (
            <button onClick={checkAnswer} disabled={!userAns} className="px-8 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-blue-600/20">Cek Jawaban</button>
          ) : (
            <button disabled={currentIndex === questions.length - 1} onClick={() => setCurrentIndex(c => c + 1)} className="flex items-center gap-2 px-6 py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl transition-all">Lanjut <ChevronRight size={20} /></button>
          )}
        </div>
      </div>

      {/* KOLOM NOMOR (DESKTOP) */}
      <div className="hidden lg:flex w-72 flex-col gap-4">
        <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
           <p className="text-slate-500 text-xs font-bold uppercase mb-2">Progress</p>
           <div className="w-full bg-slate-800 rounded-full h-2 mb-2"><div className="bg-blue-500 h-2 rounded-full transition-all duration-500" style={{ width: `${(Object.keys(selectedAnswers).length / questions.length) * 100}%` }}></div></div>
           <p className="text-right text-xs text-slate-400">{Object.keys(selectedAnswers).length} / {questions.length} terjawab</p>
        </div>
        <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 flex-1 overflow-y-auto custom-scrollbar">
           <div className="grid grid-cols-5 gap-2">
             {questions.map((_, idx) => {
               let gridClass = "bg-slate-800 text-slate-400 hover:bg-slate-700";
               if (currentIndex === idx) gridClass = "bg-blue-600 text-white ring-2 ring-blue-400 ring-offset-2 ring-offset-slate-900";
               else if (selectedAnswers[idx]) gridClass = "bg-blue-500/20 text-blue-400 border border-blue-500/30";
               if (showExplanation[idx]) {
                 const isCorrect = selectedAnswers[idx] === questions[idx].correctAnswer;
                 gridClass = isCorrect ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30" : "bg-red-500/20 text-red-400 border border-red-500/30";
                 if(currentIndex === idx) gridClass += " ring-2 ring-slate-500 ring-offset-2 ring-offset-slate-900";
               }
               return <button key={idx} onClick={() => setCurrentIndex(idx)} className={`aspect-square rounded-lg text-sm font-bold transition-all ${gridClass}`}>{idx + 1}</button>
             })}
           </div>
        </div>
      </div>
    </div>
  );
}