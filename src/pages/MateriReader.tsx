import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, CheckCircle, XCircle, AlertCircle, 
  ChevronRight, ChevronLeft, RotateCcw, Brain, Sparkles, Lock,
  Trophy
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
  examBatch?: string; // Tambahan field
  examYear?: string;  // Tambahan field
}

export default function MateriReader() {
  const [searchParams] = useSearchParams();
  
  // AMBIL PARAMETER DARI URL
  const system = searchParams.get('system');
  const batchParam = searchParams.get('batch'); // Nama Folder
  const yearParam = searchParams.get('year');   // Tahun (Opsional)
  const modeParam = searchParams.get('mode');   // 'random' atau null

  const navigate = useNavigate();
  const { currentUser } = useAuth();

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
      setLoading(true); // Reset loading saat fetch ulang
      
      try {
        // 1. Ambil SEMUA soal sistem tersebut dulu
        const q = query(collection(db, "cbt_questions"), where("system", "==", system));
        const snapshot = await getDocs(q);
        let data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Question[];
        
        // 2. FILTER CLIENT-SIDE (Lebih Fleksibel)
        if (modeParam === 'random') {
            // Jika mode random (Drilling Acak), ambil semua tanpa filter batch
            // Tapi acak urutannya
            data = data.sort(() => Math.random() - 0.5);
        } else if (batchParam) {
            // JIKA PILIH FOLDER TERTENTU
            data = data.filter(item => {
                // Cek Nama Batch
                const isBatchMatch = item.examBatch === batchParam;
                
                // Cek Tahun (Jika di URL ada tahun, di data harus sama. Jika tidak, data harus kosong/strip)
                const isYearMatch = yearParam 
                    ? item.examYear === yearParam 
                    : (!item.examYear || item.examYear === '' || item.examYear === '-');

                return isBatchMatch && isYearMatch;
            });
            
            // Urutkan soal dalam folder agar konsisten (opsional, atau bisa diacak juga)
            // data = data.sort(() => Math.random() - 0.5); 
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

  const handleAnswer = (optionKey: string) => {
    const currentQ = questions[currentIndex];
    const isLocked = currentQ.type === 'premium' && currentUser?.subscriptionStatus !== 'premium';
    
    if (isLocked || isFinished || showExplanation[currentQ.id]) return;

    setSelectedAnswers(prev => ({ ...prev, [currentQ.id]: optionKey }));
    setShowExplanation(prev => ({ ...prev, [currentQ.id]: true }));
    
    // Counter Global Dashboard
    const currentCount = parseInt(localStorage.getItem('medprep_cbt_counter') || '0');
    localStorage.setItem('medprep_cbt_counter', (currentCount + 1).toString());

    if (optionKey.toLowerCase() === currentQ.correctAnswer.toLowerCase()) {
        setScore(prev => prev + 1);
        toast.success("Tepat! 🎯", { position: 'bottom-center', duration: 1000 });
    } else {
        toast.error("Kurang Tepat ❌", { position: 'bottom-center', duration: 1000 });
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
        <AlertCircle size={40} className="text-slate-400 mb-4" />
        <h2 className="text-xl font-bold text-slate-800 dark:text-white">Folder Kosong</h2>
        <p className="text-slate-500 mt-2 text-sm">Belum ada soal di folder <b>{batchParam}</b> ini.</p>
        <button onClick={() => navigate(-1)} className="mt-6 px-6 py-2 bg-indigo-600 text-white rounded-lg font-bold">Kembali</button>
      </div>
  );

  const activeQ = questions[currentIndex];
  const isLocked = activeQ.type === 'premium' && currentUser?.subscriptionStatus !== 'premium';
  
  // Sort opsi jawaban
  const sortedOptionKeys = activeQ.options ? Object.keys(activeQ.options).sort() : [];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-20 font-sans">
      
      {/* HEADER */}
      <div className="fixed top-0 left-0 right-0 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 z-30 px-4 h-16 flex items-center shadow-sm">
        <div className="w-full max-w-2xl mx-auto flex justify-between items-center relative">
          
          <button onClick={() => navigate(-1)} className="p-2 -ml-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full text-slate-500">
             <ArrowLeft size={20} />
          </button>
          
          <div className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center">
            {/* Tampilkan Nama Folder/Batch di Header agar user tau sedang di mana */}
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                {yearParam ? `${batchParam} ${yearParam}` : batchParam || 'Latihan'}
            </span>
            <span className="text-lg font-bold text-slate-900 dark:text-white font-mono">
              {currentIndex + 1} <span className="text-slate-400 text-sm">/ {questions.length}</span>
            </span>
          </div>

          <div className="text-sm font-bold text-indigo-600 bg-indigo-50 dark:bg-indigo-900/20 px-3 py-1 rounded-full border border-indigo-100 dark:border-indigo-800">
             ★ {score}
          </div>
        </div>
        
        <div className="absolute bottom-0 left-0 w-full h-1 bg-slate-100 dark:bg-slate-800">
           <div className="h-full bg-indigo-500 transition-all duration-300" style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}></div>
        </div>
      </div>

      {/* CONTENT AREA */}
      <div className="pt-20 px-4 max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-300">
        
        {isFinished ? (
            <div className="text-center py-12 bg-white dark:bg-slate-900 rounded-3xl shadow-xl border border-slate-200 dark:border-slate-800 p-8 mt-4">
                <div className="w-24 h-24 bg-gradient-to-br from-indigo-500 to-purple-600 text-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-indigo-500/30 animate-in zoom-in">
                    <Trophy size={40} />
                </div>
                
                <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-2">Latihan Selesai!</h2>
                <p className="text-slate-500 mb-8 max-w-sm mx-auto">
                  Anda telah menyelesaikan folder <b>{batchParam}</b>.
                </p>

                <div className="bg-slate-50 dark:bg-slate-950 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 mb-8 max-w-xs mx-auto">
                   <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Akurasi Jawaban</p>
                   <div className="flex items-end justify-center gap-2">
                      <span className="text-4xl font-black text-indigo-600 dark:text-indigo-400">{score}</span>
                      <span className="text-lg text-slate-400 font-bold mb-1">/ {questions.length}</span>
                   </div>
                   <div className="w-full bg-slate-200 dark:bg-slate-800 h-2 rounded-full mt-3 overflow-hidden">
                      <div className="h-full bg-indigo-500" style={{ width: `${(score / questions.length) * 100}%` }}></div>
                   </div>
                </div>

                <div className="flex gap-3 justify-center">
                  <button onClick={() => navigate('/app/cbt')} className="px-6 py-3 rounded-xl border-2 border-slate-200 dark:border-slate-700 font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800">
                      Menu Utama
                  </button>
                  <button onClick={() => window.location.reload()} className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-xl font-bold transition-all shadow-lg shadow-indigo-500/30">
                      <RotateCcw size={18} /> Ulangi
                  </button>
                </div>
            </div>
        ) : (
            <>
                <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-sm border border-slate-200 dark:border-slate-800 mb-6 relative overflow-hidden min-h-[300px]">
                    <div className="flex justify-end mb-4">
                        {activeQ.type === 'premium' ? (
                            <span className="bg-amber-100 text-amber-600 text-[10px] font-bold px-2 py-1 rounded border border-amber-200 flex items-center gap-1"><Lock size={10} /> PRO</span>
                        ) : (
                            <span className="bg-teal-100 text-teal-600 text-[10px] font-bold px-2 py-1 rounded border border-teal-200">FREE</span>
                        )}
                    </div>

                    {isLocked ? (
                        <div className="mt-4">
                           <div className="blur-sm select-none opacity-50 mb-8 space-y-4">
                              <h3 className="text-lg font-medium">Soal ini dikunci...</h3>
                              {[1,2,3,4].map(i => <div key={i} className="h-12 bg-slate-100 rounded-xl w-full"></div>)}
                           </div>
                           <div className="absolute inset-0 z-10 flex items-center justify-center p-6"><PremiumLock /></div>
                        </div>
                    ) : (
                        <>
                            <h3 className="text-lg font-medium text-slate-800 dark:text-slate-200 leading-relaxed mb-6">
                                {activeQ.question}
                            </h3>

                            <div className="space-y-3">
                                {sortedOptionKeys.map((key) => {
                                    const value = activeQ.options[key] || ""; 
                                    const isSelected = selectedAnswers[activeQ.id] === key;
                                    const isCorrect = activeQ.correctAnswer.toLowerCase() === key.toLowerCase();
                                    const showResult = showExplanation[activeQ.id];

                                    let btnClass = "border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400"; 
                                    
                                    if (showResult) {
                                        if (isCorrect) btnClass = "bg-green-50 dark:bg-green-900/20 border-green-500 text-green-700 dark:text-green-400 font-bold";
                                        else if (isSelected) btnClass = "bg-red-50 dark:bg-red-900/20 border-red-500 text-red-700 dark:text-red-400";
                                    } else if (isSelected) {
                                        btnClass = "border-indigo-500 bg-indigo-50 text-indigo-700 font-bold ring-1 ring-indigo-500";
                                    }

                                    return (
                                        <button 
                                            key={key}
                                            onClick={() => handleAnswer(key)}
                                            disabled={!!showResult}
                                            className={`w-full p-4 rounded-xl border-2 text-left transition-all flex items-start gap-3 ${btnClass} active:scale-[0.98]`}
                                        >
                                            <span className="uppercase font-bold text-xs mt-0.5 bg-white dark:bg-slate-950 w-6 h-6 rounded flex items-center justify-center shrink-0 shadow-sm border border-inherit">
                                                {key}
                                            </span>
                                            <span className="leading-snug flex-1">{value}</span>
                                            {showResult && isCorrect && <CheckCircle size={20} className="ml-auto text-green-500 shrink-0" />}
                                            {showResult && isSelected && !isCorrect && <XCircle size={20} className="ml-auto text-red-500 shrink-0" />}
                                        </button>
                                    );
                                })}
                            </div>
                        </>
                    )}
                </div>

                {!isLocked && showExplanation[activeQ.id] && (
                    <div className="animate-in slide-in-from-bottom-4 bg-indigo-50 dark:bg-indigo-900/10 border border-indigo-100 dark:border-indigo-800 rounded-3xl p-6 mb-24">
                        <h4 className="font-bold text-indigo-800 dark:text-indigo-300 mb-2 flex items-center gap-2">
                            <Brain size={18} /> Pembahasan
                        </h4>
                        <p className="text-slate-700 dark:text-slate-300 leading-relaxed text-sm">
                            {activeQ.explanation}
                        </p>
                        {activeQ.insight && (
                           <div className="mt-4 pt-4 border-t border-indigo-200/50 flex gap-3">
                              <Sparkles size={16} className="text-amber-500 shrink-0 mt-0.5" />
                              <p className="text-xs font-bold text-amber-600 dark:text-amber-500 italic">Insight: "{activeQ.insight}"</p>
                           </div>
                        )}
                    </div>
                )}
            </>
        )}
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 p-4 z-30 pb-6">
         <div className="max-w-2xl mx-auto flex justify-between items-center gap-4">
            <button onClick={prevQuestion} disabled={currentIndex === 0} className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 disabled:opacity-30">
                <ChevronLeft size={24} />
            </button>

            <button 
                onClick={nextQuestion} 
                className="flex-1 flex items-center justify-center gap-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-6 py-3.5 rounded-xl font-bold shadow-lg hover:scale-[1.02] transition-all active:scale-[0.98]"
            >
                {currentIndex === questions.length - 1 ? 'Lihat Hasil' : 'Lanjut'} <ChevronRight size={18} />
            </button>
         </div>
      </div>
    </div>
  );
}