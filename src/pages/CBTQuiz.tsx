import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, useOutletContext } from 'react-router-dom';
import { 
  ArrowLeft, CheckCircle, XCircle, AlertCircle, 
  ChevronRight, ChevronLeft, RotateCcw, Brain, Sparkles, Lock,
  Trophy, Activity, Target
} from 'lucide-react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db, isFirebaseInitialized } from '../lib/firebase';
import { useAuth } from '../context/AuthContext';
import PremiumLock from '../components/PremiumLock';
import toast from 'react-hot-toast';
import { SYSTEM_LIST } from '../data/osce_data'; // Untuk mapping System ID

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

  const navigate = useNavigate();
  const { currentUser, updateGlobalStats } = useAuth(); // Ambil fungsi update
  const { isInsightActive } = useOutletContext<{ isInsightActive: boolean }>();

  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<{[key:string]: string}>({});
  const [showExplanation, setShowExplanation] = useState<{[key:string]: boolean}>({});
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  // Helper: Get System ID from Label (e.g., "Neurologi" -> "neurologi")
  const getSystemId = (label: string) => {
    const found = SYSTEM_LIST.find(s => s.label === label);
    return found ? found.id : 'general';
  };

  useEffect(() => {
    const fetchQuestions = async () => {
      if (!system) return;
      setLoading(true);
      
      // Check Firebase
      if (!isFirebaseInitialized() || !db) {
        toast.error("Firebase belum siap. Periksa konfigurasi .env.local");
        setLoading(false);
        return;
      }
      
      try {
        const q = query(collection(db, "cbt_questions"), where("system", "==", system));
        const snapshot = await getDocs(q);
        let data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Question[];
        
        if (batchParam) {
            data = data.filter(item => {
                const isBatchMatch = item.examBatch === batchParam;
                const isYearMatch = yearParam ? item.examYear === yearParam : (!item.examYear || item.examYear === '' || item.examYear === '-');
                return isBatchMatch && isYearMatch;
            });
        }
        setQuestions(data);
      } catch (err) { console.error(err); toast.error("Gagal memuat soal"); } 
      finally { setLoading(false); }
    };
    fetchQuestions();
  }, [system, batchParam, yearParam]);

  const handleAnswer = async (optionKey: string) => {
    const currentQ = questions[currentIndex];
    const userStatus = (currentUser?.subscriptionStatus as string) || 'free';
    const allowedStatuses = ['premium', 'expert', 'basic']; 
    const isLocked = currentQ.type === 'premium' && !allowedStatuses.includes(userStatus);
    
    if (isLocked || isFinished || showExplanation[currentQ.id]) return;

    setSelectedAnswers(prev => ({ ...prev, [currentQ.id]: optionKey }));
    setShowExplanation(prev => ({ ...prev, [currentQ.id]: true }));
    
    const isCorrect = optionKey.toLowerCase() === currentQ.correctAnswer.toLowerCase();
    
    // --- UPDATE KE FIREBASE ---
    const systemId = getSystemId(system || 'General');
    await updateGlobalStats(systemId, isCorrect); // Panggil fungsi global

    if (isCorrect) {
        setScore(prev => prev + 1);
        toast.success("Benar! 🎯", { position: 'bottom-center', duration: 1000, style: { borderRadius: '12px', background: '#1e293b', color: '#fff', fontSize: '11px' } });
    } else {
        toast.error("Salah ❌", { position: 'bottom-center', duration: 1000, style: { borderRadius: '12px', background: '#1e293b', color: '#fff', fontSize: '11px' } });
    }
  };

  const nextQuestion = () => {
    if (currentIndex < questions.length - 1) setCurrentIndex(prev => prev + 1);
    else setIsFinished(true);
  };

  const prevQuestion = () => {
    if (currentIndex > 0) setCurrentIndex(prev => prev - 1);
  };

  // --- RENDER LOGIC (Compact & Top Tier) ---
  // (Render logic sama seperti file sebelumnya, dipersingkat untuk fokus logic)
  if (loading) return <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950"><div className="animate-spin w-8 h-8 border-4 border-teal-500 border-t-transparent rounded-full"></div></div>;

  if (questions.length === 0) return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-950 p-6 text-center">
          <AlertCircle size={48} className="text-slate-300 mb-4" />
          <h2 className="text-lg font-black text-slate-800 dark:text-white mb-1">Folder Kosong</h2>
          <p className="text-slate-500 mb-6 text-xs">Belum ada soal di folder ini.</p>
          <button onClick={() => navigate(-1)} className="px-6 py-2.5 bg-slate-900 text-white rounded-xl font-bold text-xs">Kembali</button>
      </div>
  );

  const activeQ = questions[currentIndex];
  const userStatusRender = (currentUser?.subscriptionStatus as string) || 'free';
  const allowedStatusesRender = ['premium', 'expert', 'basic'];
  const isLocked = activeQ.type === 'premium' && !allowedStatusesRender.includes(userStatusRender);
  const sortedOptionKeys = activeQ.options ? Object.keys(activeQ.options).sort() : [];
  const progressPercent = ((currentIndex + 1) / questions.length) * 100;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-32 font-sans">
      <div className="pt-4 px-4 max-w-2xl mx-auto">
        {!isFinished && (
            <div className="mb-4 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-100 dark:border-slate-800 rounded-full shadow-sm p-1.5 pl-4 flex items-center justify-between sticky top-20 z-30">
                <div className="flex items-center gap-3">
                    <button onClick={() => navigate(-1)} className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500"><ArrowLeft size={16} /></button>
                    <div className="flex flex-col">
                        <span className="text-[9px] font-bold uppercase tracking-widest text-slate-400">{batchParam || 'Latihan'}</span>
                        <div className="flex items-baseline gap-1">
                            <span className="text-xs font-black text-slate-800 dark:text-white">{currentIndex + 1}</span>
                            <span className="text-[10px] font-medium text-slate-400">/ {questions.length}</span>
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-2 pr-1">
                   <div className="text-center px-2 border-r border-slate-100 dark:border-slate-800">
                        <h4 className="text-xs font-black text-emerald-500">{score}</h4>
                        <p className="text-[8px] text-slate-400 uppercase font-bold">Benar</p>
                   </div>
                   <div className="w-10 h-10 rounded-full relative flex items-center justify-center">
                        <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                            <path className="text-slate-200 dark:text-slate-700" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="4" />
                            <path className="text-teal-500 transition-all duration-500" strokeDasharray={`${progressPercent}, 100`} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                        </svg>
                   </div>
                </div>
            </div>
        )}

        {isFinished ? (
            <div className="bg-white dark:bg-slate-900 rounded-[2rem] p-8 text-center shadow-xl border border-slate-100 dark:border-slate-800 mt-8 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-teal-500 to-emerald-500"></div>
                <Trophy size={48} className="text-amber-500 mx-auto mb-4" fill="currentColor"/>
                <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-1">Selesai!</h2>
                <p className="text-sm text-slate-500 mb-8">Progresmu tersimpan di cloud.</p>
                
                <div className="grid grid-cols-3 gap-3 max-w-xs mx-auto mb-8">
                    <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl"><p className="text-xl font-black text-slate-800 dark:text-white">{questions.length}</p><p className="text-[9px] text-slate-400 uppercase font-bold">Total</p></div>
                    <div className="bg-emerald-50 dark:bg-emerald-900/20 p-3 rounded-xl"><p className="text-xl font-black text-emerald-600">{score}</p><p className="text-[9px] text-emerald-400 uppercase font-bold">Benar</p></div>
                    <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-xl"><p className="text-xl font-black text-blue-600">{Math.round((score/questions.length)*100)}%</p><p className="text-[9px] text-blue-400 uppercase font-bold">Skor</p></div>
                </div>
                <div className="flex gap-3 justify-center">
                    <button onClick={() => navigate(-1)} className="px-6 py-3 rounded-xl border border-slate-200 font-bold text-slate-600 text-xs">Menu</button>
                    <button onClick={() => window.location.reload()} className="flex items-center gap-2 bg-slate-900 text-white px-8 py-3 rounded-xl font-bold text-xs shadow-lg"><RotateCcw size={16} /> Ulangi</button>
                </div>
            </div>
        ) : (
            <>
                <div className="bg-white dark:bg-slate-900 rounded-[2rem] p-5 shadow-sm border border-slate-100 dark:border-slate-800 min-h-[200px]">
                    {isLocked ? <div className="py-10 flex flex-col items-center justify-center"><PremiumLock /></div> : (
                        <div className="animate-in fade-in duration-500">
                            <h3 className="text-base font-bold text-slate-900 dark:text-white leading-relaxed mb-6">{activeQ.question}</h3>
                            <div className="space-y-2.5">
                                {sortedOptionKeys.map((key) => {
                                    const value = activeQ.options[key]; 
                                    const isSelected = selectedAnswers[activeQ.id] === key;
                                    const isCorrect = activeQ.correctAnswer.toLowerCase() === key.toLowerCase();
                                    const showResult = showExplanation[activeQ.id];
                                    
                                    let cn = "border-slate-200 bg-slate-50 text-slate-700";
                                    if (showResult) {
                                        if (isCorrect) cn = "bg-emerald-50 border-emerald-500 text-emerald-800";
                                        else if (isSelected) cn = "bg-rose-50 border-rose-500 text-rose-800";
                                        else cn = "opacity-50 border-slate-200";
                                    } else if (isSelected) cn = "border-indigo-500 bg-indigo-50 text-indigo-700";

                                    return (
                                        <button key={key} onClick={() => handleAnswer(key)} disabled={!!showResult} className={`w-full p-3 rounded-xl border text-left transition-all flex items-start gap-3 group ${cn}`}>
                                            <span className="font-bold text-xs mt-0.5">{key}</span>
                                            <span className="leading-snug font-medium text-sm flex-1">{value}</span>
                                            {showResult && isCorrect && <CheckCircle size={18} className="text-emerald-600 ml-auto shrink-0" />}
                                            {showResult && isSelected && !isCorrect && <XCircle size={18} className="text-rose-600 ml-auto shrink-0" />}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </div>

                {!isLocked && showExplanation[activeQ.id] && (
                    <div className="mt-4 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[2rem] p-5 animate-in slide-in-from-bottom-8">
                        <h4 className="font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2 text-sm"><Brain size={16} className="text-teal-500"/> Pembahasan</h4>
                        <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">{activeQ.explanation}</p>
                        {isInsightActive && activeQ.insight && (
                           <div className="mt-4 border-l-4 border-amber-400 bg-amber-50/50 dark:bg-amber-900/10 p-4 flex gap-3 items-start">
                                <Sparkles size={16} className="text-amber-500 shrink-0 mt-0.5" />
                                <div>
                                    <p className="text-[10px] font-bold text-amber-600 uppercase tracking-widest mb-0.5">Insight</p>
                                    <p className="text-slate-800 dark:text-slate-200 text-sm italic">"{activeQ.insight}"</p>
                                </div>
                           </div>
                        )}
                    </div>
                )}
            </>
        )}
      </div>
      
      {!isFinished && (
          <div className="fixed bottom-20 md:bottom-6 left-0 right-0 z-40 flex justify-center px-4">
             <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border border-slate-200 dark:border-slate-800 p-1.5 pl-4 pr-1.5 rounded-full shadow-xl flex items-center gap-4 w-full max-w-md">
                <button onClick={prevQuestion} disabled={currentIndex === 0} className="p-2 rounded-full hover:bg-slate-100 text-slate-500 disabled:opacity-30"><ChevronLeft size={20} /></button>
                <div className="flex-1 h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-teal-500 transition-all" style={{ width: `${progressPercent}%` }} />
                </div>
                <button onClick={nextQuestion} className="flex items-center gap-2 bg-slate-900 text-white px-5 py-2.5 rounded-full font-bold text-xs shadow-lg active:scale-95">
                    {currentIndex === questions.length - 1 ? 'Selesai' : 'Lanjut'} <ChevronRight size={14} />
                </button>
             </div>
          </div>
      )}
    </div>
  );
}