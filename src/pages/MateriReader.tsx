import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, CheckCircle, XCircle, AlertCircle, 
  ChevronRight, ChevronLeft, RotateCcw, Brain, Sparkles, Lock,
  Trophy, Activity, Target
} from 'lucide-react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../context/AuthContext';
import PremiumLock from '../components/PremiumLock';
import toast from 'react-hot-toast';

interface Question {
  id: string;
  system: string;
  question: string;
  options: { [key: string]: string };
  correctAnswer: string;
  explanation: string;
  insight?: string;
  type?: 'free' | 'premium';
  examBatch?: string; 
  examYear?: string;  
}

export default function MaterialReader() {
  const [searchParams] = useSearchParams();
  
  // AMBIL PARAMETER
  const system = searchParams.get('system');
  const batchParam = searchParams.get('batch');
  const yearParam = searchParams.get('year');
  const modeParam = searchParams.get('mode');

  const navigate = useNavigate();
  const { currentUser } = useAuth();

  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<{[key:string]: string}>({});
  const [showExplanation, setShowExplanation] = useState<{[key:string]: boolean}>({});
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  // --- FETCHING DATA ---
  useEffect(() => {
    const fetchQuestions = async () => {
      if (!system) return;
      setLoading(true); 
      
      try {
        const q = query(collection(db, "cbt_questions"), where("system", "==", system));
        const snapshot = await getDocs(q);
        let data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Question[];
        
        if (modeParam === 'random') {
            data = data.sort(() => Math.random() - 0.5);
        } else if (batchParam) {
            data = data.filter(item => {
                const isBatchMatch = item.examBatch === batchParam;
                const isYearMatch = yearParam 
                    ? item.examYear === yearParam 
                    : (!item.examYear || item.examYear === '' || item.examYear === '-');
                return isBatchMatch && isYearMatch;
            });
        }

        setQuestions(data);
      } catch (err) {
        console.error(err);
        toast.error("Gagal memuat soal");
      } finally {
        setLoading(false);
      }
    };
    fetchQuestions();
  }, [system, batchParam, yearParam, modeParam]);

  // --- HANDLER ---
  const handleAnswer = (optionKey: string) => {
    const currentQ = questions[currentIndex];
    const isLocked = currentQ.type === 'premium' && (currentUser?.subscriptionStatus || 'free') !== 'premium';
    
    if (isLocked || isFinished || showExplanation[currentQ.id]) return;

    setSelectedAnswers(prev => ({ ...prev, [currentQ.id]: optionKey }));
    setShowExplanation(prev => ({ ...prev, [currentQ.id]: true }));
    
    const currentCount = parseInt(localStorage.getItem('medprep_cbt_counter') || '0');
    localStorage.setItem('medprep_cbt_counter', (currentCount + 1).toString());

    if (optionKey.toLowerCase() === currentQ.correctAnswer.toLowerCase()) {
        setScore(prev => prev + 1);
        toast.success("Tepat! 🎯", { position: 'bottom-center', duration: 1000, style: { borderRadius: '20px', background: '#333', color: '#fff' } });
    } else {
        toast.error("Kurang Tepat ❌", { position: 'bottom-center', duration: 1000, style: { borderRadius: '20px', background: '#333', color: '#fff' } });
    }
  };

  const nextQuestion = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      setIsFinished(true);
    }
  };

  const prevQuestion = () => {
    if (currentIndex > 0) setCurrentIndex(prev => prev - 1);
  };

  // --- RENDER HELPERS ---
  if (loading) return <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950"><div className="animate-spin w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full"></div></div>;

  if (questions.length === 0) return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-950 p-6 text-center">
        <div className="w-20 h-20 bg-slate-100 dark:bg-slate-900 rounded-full flex items-center justify-center mb-6 text-slate-400">
            <AlertCircle size={40} />
        </div>
        <h2 className="text-2xl font-black text-slate-800 dark:text-white mb-2">Folder Kosong</h2>
        <p className="text-slate-500 mb-8 max-w-xs mx-auto">Belum ada soal tersedia di folder <b>{batchParam}</b> ini.</p>
        <button onClick={() => navigate(-1)} className="px-8 py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl font-bold hover:scale-105 transition-transform">Kembali</button>
      </div>
  );

  const activeQ = questions[currentIndex];
  const isLocked = activeQ.type === 'premium' && (currentUser?.subscriptionStatus || 'free') !== 'premium';
  const sortedOptionKeys = activeQ.options ? Object.keys(activeQ.options).sort() : [];
  const progressPercent = ((currentIndex + 1) / questions.length) * 100;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-black pb-32 font-sans transition-colors duration-500">
      
      {/* REVISI: HEADER DIPINDAH KE SINI (DALAM CONTENT FLOW)
          Menghilangkan class 'fixed top-4', diganti menjadi container biasa.
          Memberikan margin-bottom (mb-6) agar ada jarak dengan kotak soal.
      */}
      <div className="pt-6 px-4 max-w-3xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-500">
        
        {/* --- FLOATING QUIZ HEADER (Posisi Relatif di Atas Soal) --- */}
        {!isFinished && (
            <div className="mb-6 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-white/20 dark:border-white/10 rounded-full shadow-lg p-2 pl-4 flex items-center justify-between sticky top-24 z-30 transition-all">
                
                <div className="flex items-center gap-4">
                    <button onClick={() => navigate(-1)} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 transition-colors">
                        <ArrowLeft size={20} />
                    </button>
                    <div className="flex flex-col">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                            {yearParam ? `${batchParam} ${yearParam}` : batchParam || 'Latihan'}
                        </span>
                        <div className="flex items-baseline gap-1">
                            <span className="text-sm font-black text-slate-800 dark:text-white">Soal {currentIndex + 1}</span>
                            <span className="text-xs font-medium text-slate-400">/ {questions.length}</span>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-3 pr-2">
                    <div className="hidden md:flex flex-col items-end mr-2">
                        <span className="text-[10px] font-bold text-slate-400 uppercase">Score</span>
                        <span className="text-sm font-black text-indigo-600 dark:text-indigo-400">{score} Poin</span>
                    </div>
                    {/* Progress Circle Mini */}
                    <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center relative overflow-hidden">
                        <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                            <path className="text-slate-200 dark:text-slate-700" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="4" />
                            <path className="text-indigo-500 transition-all duration-500" strokeDasharray={`${progressPercent}, 100`} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="4" />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center text-[8px] font-bold text-slate-600 dark:text-slate-300">
                            {Math.round(progressPercent)}%
                        </div>
                    </div>
                </div>
            </div>
        )}

        {isFinished ? (
            <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 md:p-12 text-center shadow-2xl shadow-indigo-500/10 border border-slate-100 dark:border-white/5 relative overflow-hidden mt-8">
                <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2"></div>
                
                <div className="relative z-10">
                    <div className="w-24 h-24 bg-gradient-to-br from-indigo-500 to-purple-600 text-white rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-xl shadow-indigo-500/30 animate-in zoom-in duration-500">
                        <Trophy size={48} fill="currentColor" className="text-white/90" />
                    </div>
                    
                    <h2 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white mb-2">Latihan Selesai!</h2>
                    <p className="text-slate-500 dark:text-slate-400 mb-10 max-w-md mx-auto leading-relaxed">
                      Selamat Dok! Anda telah menyelesaikan sesi latihan <b>{batchParam}</b>. Pertahankan konsistensi belajarmu.
                    </p>

                    <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto mb-10">
                        <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-100 dark:border-white/5">
                            <div className="flex items-center justify-center gap-2 text-slate-400 text-xs font-bold uppercase mb-1">
                                <Target size={14} /> Total Soal
                            </div>
                            <p className="text-2xl font-black text-slate-800 dark:text-white">{questions.length}</p>
                        </div>
                        <div className="bg-indigo-50 dark:bg-indigo-900/20 p-4 rounded-2xl border border-indigo-100 dark:border-indigo-500/20">
                            <div className="flex items-center justify-center gap-2 text-indigo-400 text-xs font-bold uppercase mb-1">
                                <Activity size={14} /> Skor Anda
                            </div>
                            <p className="text-2xl font-black text-indigo-600 dark:text-indigo-400">{score}</p>
                        </div>
                    </div>

                    <div className="flex gap-4 justify-center">
                      <button onClick={() => navigate('/app/cbt')} className="px-8 py-4 rounded-2xl border-2 border-slate-200 dark:border-slate-800 font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all">
                          Menu Utama
                      </button>
                      <button onClick={() => window.location.reload()} className="flex items-center gap-2 bg-slate-900 dark:bg-white hover:bg-slate-800 text-white dark:text-slate-900 px-10 py-4 rounded-2xl font-bold transition-all shadow-xl hover:scale-105 active:scale-95">
                          <RotateCcw size={18} /> Ulangi
                      </button>
                    </div>
                </div>
            </div>
        ) : (
            <>
                {/* QUESTION CARD */}
                <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-6 md:p-10 shadow-2xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-white/5 relative overflow-hidden min-h-[400px]">
                    
                    {/* Badge Premium */}
                    <div className="flex justify-between items-start mb-6">
                        <span className="bg-slate-100 dark:bg-slate-800 text-slate-500 text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-widest">
                            Vignette Case
                        </span>
                        {activeQ.type === 'premium' ? (
                            <span className="bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400 text-[10px] font-bold px-3 py-1.5 rounded-full border border-amber-200 dark:border-amber-800 flex items-center gap-1">
                                <Lock size={10} /> PRO QUESTION
                            </span>
                        ) : (
                            <span className="bg-teal-100 text-teal-700 dark:bg-teal-900/40 dark:text-teal-400 text-[10px] font-bold px-3 py-1.5 rounded-full border border-teal-200 dark:border-teal-800">
                                FREE ACCESS
                            </span>
                        )}
                    </div>

                    {isLocked ? (
                        <div className="mt-8 flex flex-col items-center justify-center text-center py-12">
                           <div className="blur-sm select-none opacity-50 w-full mb-8 space-y-6">
                              <h3 className="text-xl font-bold text-slate-300">Pertanyaan ini dikunci khusus member PRO...</h3>
                              {[1,2,3,4].map(i => <div key={i} className="h-16 bg-slate-100 dark:bg-slate-800 rounded-2xl w-full"></div>)}
                           </div>
                           <div className="absolute inset-0 z-10 flex items-center justify-center p-6 bg-white/50 dark:bg-black/50 backdrop-blur-sm rounded-[2.5rem]">
                                <PremiumLock />
                           </div>
                        </div>
                    ) : (
                        <div className="animate-in fade-in duration-500">
                            {/* Pertanyaan */}
                            <h3 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white leading-relaxed mb-10">
                                {activeQ.question}
                            </h3>

                            {/* Pilihan Jawaban */}
                            <div className="space-y-3">
                                {sortedOptionKeys.map((key) => {
                                    const value = activeQ.options[key] || ""; 
                                    const isSelected = selectedAnswers[activeQ.id] === key;
                                    const isCorrect = activeQ.correctAnswer.toLowerCase() === key.toLowerCase();
                                    const showResult = showExplanation[activeQ.id];

                                    // Styling Logic
                                    let containerClass = "border-slate-200 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800/50 bg-white dark:bg-slate-900/50 text-slate-600 dark:text-slate-300"; 
                                    let iconClass = "bg-slate-100 dark:bg-slate-800 text-slate-500";

                                    if (showResult) {
                                        if (isCorrect) {
                                            containerClass = "bg-emerald-50 dark:bg-emerald-900/20 border-emerald-500 text-emerald-800 dark:text-emerald-300 ring-1 ring-emerald-500";
                                            iconClass = "bg-emerald-200 dark:bg-emerald-800 text-emerald-800 dark:text-emerald-200";
                                        } else if (isSelected) {
                                            containerClass = "bg-rose-50 dark:bg-rose-900/20 border-rose-500 text-rose-800 dark:text-rose-300 ring-1 ring-rose-500";
                                            iconClass = "bg-rose-200 dark:bg-rose-800 text-rose-800 dark:text-rose-200";
                                        } else {
                                            containerClass += " opacity-50"; // Dim other options
                                        }
                                    } else if (isSelected) {
                                        containerClass = "border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300 ring-1 ring-indigo-500 shadow-md";
                                        iconClass = "bg-indigo-600 text-white shadow-lg shadow-indigo-500/30";
                                    }

                                    return (
                                        <button 
                                            key={key}
                                            onClick={() => handleAnswer(key)}
                                            disabled={!!showResult}
                                            className={`w-full p-4 md:p-5 rounded-2xl border-2 text-left transition-all duration-200 flex items-start gap-4 group ${containerClass} active:scale-[0.99]`}
                                        >
                                            <span className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold uppercase shrink-0 transition-colors mt-0.5 ${iconClass}`}>
                                                {key}
                                            </span>
                                            <span className="leading-snug font-medium text-base md:text-lg flex-1">{value}</span>
                                            
                                            {/* Status Icon */}
                                            {showResult && isCorrect && <CheckCircle size={24} className="ml-auto text-emerald-500 shrink-0 animate-in zoom-in" />}
                                            {showResult && isSelected && !isCorrect && <XCircle size={24} className="ml-auto text-rose-500 shrink-0 animate-in zoom-in" />}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </div>

                {/* PEMBAHASAN & INSIGHT (Muncul di Bawah) */}
                {!isLocked && showExplanation[activeQ.id] && (
                    <div className="animate-in slide-in-from-bottom-8 mt-6 bg-gradient-to-br from-indigo-50 to-white dark:from-slate-900 dark:to-slate-800 border border-indigo-100 dark:border-white/5 rounded-[2.5rem] p-8 relative overflow-hidden shadow-lg">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-[50px]"></div>
                        
                        <div className="relative z-10">
                            <h4 className="font-bold text-indigo-900 dark:text-indigo-300 mb-4 flex items-center gap-2 text-lg">
                                <div className="p-2 bg-indigo-100 dark:bg-indigo-900/50 rounded-xl">
                                    <Brain size={20} className="text-indigo-600 dark:text-indigo-400" />
                                </div>
                                Pembahasan Klinis
                            </h4>
                            <div className="text-slate-700 dark:text-slate-300 leading-relaxed text-base prose prose-indigo dark:prose-invert max-w-none">
                                {activeQ.explanation}
                            </div>
                            
                            {activeQ.insight && (
                               <div className="mt-8 relative overflow-hidden rounded-2xl border border-amber-200 dark:border-amber-500/20 bg-amber-50/50 dark:bg-amber-900/10 p-6">
                                 <div className="absolute top-0 right-0 p-16 bg-amber-400/10 rounded-full blur-2xl translate-x-1/2 -translate-y-1/2"></div>
                                 <div className="relative z-10 flex gap-4 items-start">
                                    <Sparkles size={24} className="text-amber-500 shrink-0 mt-1" />
                                    <div>
                                        <p className="text-xs font-bold text-amber-600 dark:text-amber-500 uppercase tracking-widest mb-1">MedPrep Insight</p>
                                        <p className="text-slate-800 dark:text-slate-200 text-base italic font-medium leading-relaxed">"{activeQ.insight}"</p>
                                    </div>
                                 </div>
                               </div>
                            )}
                        </div>
                    </div>
                )}
            </>
        )}
      </div>

      {/* --- BOTTOM NAVIGATION BAR (Floating di Bawah) --- */}
      {!isFinished && (
          <div className="fixed bottom-6 left-4 right-4 md:left-auto md:right-auto md:w-full md:max-w-3xl md:mx-auto z-40 flex justify-center">
             <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border border-slate-200 dark:border-slate-800 p-2 pl-4 pr-2 rounded-full shadow-2xl flex items-center gap-4 w-full md:w-auto">
                
                <button 
                    onClick={prevQuestion} 
                    disabled={currentIndex === 0} 
                    className="p-3 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
                >
                    <ChevronLeft size={24} />
                </button>

                <div className="flex-1 text-center md:w-48">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                        {currentIndex + 1} dari {questions.length}
                    </span>
                </div>

                <button 
                    onClick={nextQuestion} 
                    className="flex items-center gap-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-6 py-3 rounded-full font-bold shadow-lg hover:scale-105 active:scale-95 transition-all"
                >
                    {currentIndex === questions.length - 1 ? 'Selesai' : 'Lanjut'} 
                    {currentIndex !== questions.length - 1 && <ChevronRight size={18} />}
                </button>
             </div>
          </div>
      )}

    </div>
  );
}