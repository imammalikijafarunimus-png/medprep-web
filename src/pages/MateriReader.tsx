import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, useOutletContext } from 'react-router-dom'; // Import OutletContext
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
  
  const system = searchParams.get('system');
  const batchParam = searchParams.get('batch');
  const yearParam = searchParams.get('year');
  const modeParam = searchParams.get('mode');

  const navigate = useNavigate();
  const { currentUser } = useAuth();
  
  // AMBIL STATUS INSIGHT
  const { isInsightActive } = useOutletContext<{ isInsightActive: boolean }>();

  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<{[key:string]: string}>({});
  const [showExplanation, setShowExplanation] = useState<{[key:string]: boolean}>({});
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

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
                const isYearMatch = yearParam ? item.examYear === yearParam : (!item.examYear || item.examYear === '' || item.examYear === '-');
                return isBatchMatch && isYearMatch;
            });
        }
        setQuestions(data);
      } catch (err) {
        console.error(err);
        toast.error("Gagal memuat soal");
      } finally { setLoading(false); }
    };
    fetchQuestions();
  }, [system, batchParam, yearParam, modeParam]);

  const handleAnswer = (optionKey: string) => {
    const currentQ = questions[currentIndex];
    const userStatus = (currentUser?.subscriptionStatus as string) || 'free';
    const allowedStatuses = ['premium', 'expert', 'basic']; 
    
    const isLocked = currentQ.type === 'premium' && !allowedStatuses.includes(userStatus);
    
    if (isLocked || isFinished || showExplanation[currentQ.id]) return;

    setSelectedAnswers(prev => ({ ...prev, [currentQ.id]: optionKey }));
    setShowExplanation(prev => ({ ...prev, [currentQ.id]: true }));
    
    const currentCount = parseInt(localStorage.getItem('medprep_cbt_counter') || '0');
    localStorage.setItem('medprep_cbt_counter', (currentCount + 1).toString());

    if (optionKey.toLowerCase() === currentQ.correctAnswer.toLowerCase()) {
        setScore(prev => prev + 1);
        toast.success("Tepat! 🎯", { position: 'bottom-center', duration: 1000, style: { borderRadius: '20px', background: '#333', color: '#fff', fontSize: '12px' } });
    } else {
        toast.error("Kurang Tepat ❌", { position: 'bottom-center', duration: 1000, style: { borderRadius: '20px', background: '#333', color: '#fff', fontSize: '12px' } });
    }
  };

  const nextQuestion = () => {
    if (currentIndex < questions.length - 1) setCurrentIndex(prev => prev + 1);
    else setIsFinished(true);
  };

  const prevQuestion = () => {
    if (currentIndex > 0) setCurrentIndex(prev => prev - 1);
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950"><div className="animate-spin w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full"></div></div>;

  if (questions.length === 0) return (<div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-950 p-6 text-center"><div className="w-16 h-16 bg-slate-100 dark:bg-slate-900 rounded-full flex items-center justify-center mb-4 text-slate-400"><AlertCircle size={32} /></div><h2 className="text-lg font-black text-slate-800 dark:text-white mb-1">Folder Kosong</h2><p className="text-slate-500 mb-6 text-xs max-w-xs mx-auto">Belum ada soal tersedia di folder <b>{batchParam}</b> ini.</p><button onClick={() => navigate(-1)} className="px-6 py-2.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl font-bold text-sm">Kembali</button></div>);

  const activeQ = questions[currentIndex];
  const userStatusRender = (currentUser?.subscriptionStatus as string) || 'free';
  const allowedStatusesRender = ['premium', 'expert', 'basic'];
  const isLocked = activeQ.type === 'premium' && !allowedStatusesRender.includes(userStatusRender);
  const sortedOptionKeys = activeQ.options ? Object.keys(activeQ.options).sort() : [];
  const progressPercent = ((currentIndex + 1) / questions.length) * 100;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-black pb-40 md:pb-28 font-sans transition-colors duration-500">
      
      <div className="pt-4 px-4 max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-500">
        
        {!isFinished && (
            <div className="mb-4 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-white/20 dark:border-white/10 rounded-full shadow-sm p-1.5 pl-4 flex items-center justify-between sticky top-20 z-30">
                <div className="flex items-center gap-3"><button onClick={() => navigate(-1)} className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 transition-colors"><ArrowLeft size={16} /></button><div className="flex flex-col"><span className="text-[9px] font-bold uppercase tracking-widest text-slate-400">{yearParam ? `${batchParam} ${yearParam}` : batchParam || 'Latihan'}</span><div className="flex items-baseline gap-1"><span className="text-xs font-black text-slate-800 dark:text-white">Soal {currentIndex + 1}</span><span className="text-[10px] font-medium text-slate-400">/ {questions.length}</span></div></div></div>
                <div className="flex items-center gap-2 pr-2"><div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center relative overflow-hidden"><svg className="w-full h-full -rotate-90" viewBox="0 0 36 36"><path className="text-slate-200 dark:text-slate-700" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="4" /><path className="text-indigo-500 transition-all duration-500" strokeDasharray={`${progressPercent}, 100`} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="4" /></svg><div className="absolute inset-0 flex items-center justify-center text-[7px] font-bold text-slate-600 dark:text-slate-300">{Math.round(progressPercent)}%</div></div></div>
            </div>
        )}

        {isFinished ? (
            <div className="bg-white dark:bg-slate-900 rounded-[2rem] p-8 text-center shadow-xl border border-slate-100 dark:border-white/5 mt-8">
                <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-600 text-white rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl"><Trophy size={32} fill="currentColor" /></div>
                <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-1">Selesai!</h2>
                <p className="text-sm text-slate-500 mb-8">Folder <b>{batchParam}</b> tuntas.</p>
                <div className="grid grid-cols-2 gap-3 max-w-xs mx-auto mb-8">
                    <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl border border-slate-100 dark:border-white/5"><div className="flex items-center justify-center gap-1 text-slate-400 text-[10px] font-bold uppercase mb-1"><Target size={12} /> Total</div><p className="text-xl font-black text-slate-800 dark:text-white">{questions.length}</p></div>
                    <div className="bg-indigo-50 dark:bg-indigo-900/20 p-3 rounded-xl border border-indigo-100 dark:border-indigo-500/20"><div className="flex items-center justify-center gap-1 text-indigo-400 text-[10px] font-bold uppercase mb-1"><Activity size={12} /> Skor</div><p className="text-xl font-black text-indigo-600 dark:text-indigo-400">{score}</p></div>
                </div>
                <div className="flex gap-3 justify-center"><button onClick={() => navigate('/app/cbt')} className="px-6 py-3 rounded-xl border border-slate-200 dark:border-slate-800 font-bold text-slate-600 dark:text-slate-300 text-sm hover:bg-slate-50 dark:hover:bg-slate-800">Menu Utama</button><button onClick={() => window.location.reload()} className="flex items-center gap-2 bg-slate-900 dark:bg-white hover:bg-slate-800 text-white dark:text-slate-900 px-8 py-3 rounded-xl font-bold text-sm shadow-lg"><RotateCcw size={16} /> Ulangi</button></div>
            </div>
        ) : (
            <>
                <div className="bg-white dark:bg-slate-900 rounded-[2rem] p-5 md:p-8 shadow-sm border border-slate-100 dark:border-white/5 relative overflow-hidden min-h-[300px]">
                    <div className="flex justify-between items-start mb-4">
                        <span className="bg-slate-100 dark:bg-slate-800 text-slate-500 text-[9px] font-bold px-2 py-1 rounded uppercase tracking-widest">Vignette Case</span>
                        {activeQ.type === 'premium' ? <span className="bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400 text-[9px] font-bold px-2 py-1 rounded border border-amber-200 dark:border-amber-800 flex items-center gap-1"><Lock size={10} /> PRO</span> : <span className="bg-teal-100 text-teal-700 dark:bg-teal-900/40 dark:text-teal-400 text-[9px] font-bold px-2 py-1 rounded border border-teal-200 dark:border-teal-800">FREE</span>}
                    </div>

                    {isLocked ? (
                        <div className="mt-8 flex flex-col items-center justify-center text-center py-8">
                           <div className="blur-sm select-none opacity-50 w-full mb-6 space-y-4"><h3 className="text-lg font-bold text-slate-300">Soal terkunci...</h3>{[1,2,3].map(i => <div key={i} className="h-12 bg-slate-100 dark:bg-slate-800 rounded-xl w-full"></div>)}</div>
                           <div className="absolute inset-0 z-10 flex items-center justify-center p-6 bg-white/50 dark:bg-black/50 backdrop-blur-sm rounded-[2rem]"><PremiumLock /></div>
                        </div>
                    ) : (
                        <div className="animate-in fade-in duration-500">
                            <h3 className="text-base md:text-lg font-bold text-slate-900 dark:text-white leading-relaxed mb-6">{activeQ.question}</h3>
                            <div className="space-y-2.5">
                                {sortedOptionKeys.map((key) => {
                                    const value = activeQ.options[key] || ""; 
                                    const isSelected = selectedAnswers[activeQ.id] === key;
                                    const isCorrect = activeQ.correctAnswer.toLowerCase() === key.toLowerCase();
                                    const showResult = showExplanation[activeQ.id];
                                    let containerClass = "border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 bg-white dark:bg-slate-900/50 text-slate-600 dark:text-slate-300"; 
                                    let iconClass = "bg-slate-100 dark:bg-slate-800 text-slate-500";
                                    if (showResult) {
                                        if (isCorrect) { containerClass = "bg-emerald-50 dark:bg-emerald-900/20 border-emerald-500 text-emerald-800 dark:text-emerald-300 ring-1 ring-emerald-500"; iconClass = "bg-emerald-200 dark:bg-emerald-800 text-emerald-800 dark:text-emerald-200"; } 
                                        else if (isSelected) { containerClass = "bg-rose-50 dark:bg-rose-900/20 border-rose-500 text-rose-800 dark:text-rose-300 ring-1 ring-rose-500"; iconClass = "bg-rose-200 dark:bg-rose-800 text-rose-800 dark:text-rose-200"; } 
                                        else { containerClass += " opacity-50"; }
                                    } else if (isSelected) { containerClass = "border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300 ring-1 ring-indigo-500 shadow-sm"; iconClass = "bg-indigo-600 text-white"; }

                                    return (
                                        <button key={key} onClick={() => handleAnswer(key)} disabled={!!showResult} className={`w-full p-3.5 rounded-xl border text-left transition-all duration-200 flex items-start gap-3 group ${containerClass} active:scale-[0.99]`}>
                                            <span className={`w-6 h-6 rounded flex items-center justify-center text-[10px] font-bold uppercase shrink-0 transition-colors mt-0.5 ${iconClass}`}>{key}</span>
                                            <span className="leading-snug font-medium text-sm flex-1">{value}</span>
                                            {showResult && isCorrect && <CheckCircle size={18} className="ml-auto text-emerald-500 shrink-0" />}
                                            {showResult && isSelected && !isCorrect && <XCircle size={18} className="ml-auto text-rose-500 shrink-0" />}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </div>

                {!isLocked && showExplanation[activeQ.id] && (
                    <div className="animate-in slide-in-from-bottom-8 mt-4 bg-indigo-50/50 dark:bg-slate-900 border border-indigo-100 dark:border-white/5 rounded-[2rem] p-6 relative overflow-hidden shadow-sm">
                        <div className="relative z-10">
                            <h4 className="font-bold text-indigo-900 dark:text-indigo-300 mb-3 flex items-center gap-2 text-sm"><Brain size={16} /> Pembahasan Klinis</h4>
                            <div className="text-slate-700 dark:text-slate-300 leading-relaxed text-sm">{activeQ.explanation}</div>
                            
                            {/* CONDITIONAL RENDERING INSIGHT BOX */}
                            {isInsightActive && activeQ.insight && (
                               <div className="mt-4 relative overflow-hidden rounded-xl border border-amber-200 dark:border-amber-500/20 bg-amber-50/50 dark:bg-amber-900/10 p-4 flex gap-3 items-start">
                                    <Sparkles size={16} className="text-amber-500 shrink-0 mt-0.5" />
                                    <div><p className="text-[10px] font-bold text-amber-600 dark:text-amber-500 uppercase tracking-widest mb-0.5">MedPrep Insight</p><p className="text-slate-800 dark:text-slate-200 text-sm italic font-medium leading-relaxed">"{activeQ.insight}"</p></div>
                               </div>
                            )}
                        </div>
                    </div>
                )}
            </>
        )}
      </div>

      {!isFinished && (
          <div className="fixed bottom-24 md:bottom-6 left-4 right-4 z-40 flex justify-center">
             <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border border-slate-200 dark:border-slate-800 p-1.5 pl-4 pr-1.5 rounded-full shadow-xl flex items-center gap-4 w-full md:w-auto max-w-md">
                <button onClick={prevQuestion} disabled={currentIndex === 0} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"><ChevronLeft size={20} /></button>
                <div className="flex-1 text-center w-32"><span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{currentIndex + 1} dari {questions.length}</span></div>
                <button onClick={nextQuestion} className="flex items-center gap-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-5 py-2.5 rounded-full font-bold shadow-lg hover:scale-105 active:scale-95 transition-all text-xs">{currentIndex === questions.length - 1 ? 'Selesai' : 'Lanjut'} {currentIndex !== questions.length - 1 && <ChevronRight size={14} />}</button>
             </div>
          </div>
      )}
    </div>
  );
}