import React, { useState, useEffect } from 'react';
import { 
  ChevronLeft, ChevronRight, RotateCw, BookOpen, Brain, Beaker, 
  Activity, Heart, Shuffle, Zap, XCircle, CheckCircle, Clock, 
  Lock, Star 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom'; // 1. Tambah Import Navigate
import { FLASHCARDS } from '../data/flashcard_data';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

// --- TIPE DATA ---
interface CardProgress {
  id: string;
  interval: number; 
  nextReview: number;
  status: 'new' | 'learning' | 'review';
}

const CATEGORIES = [
  { id: 'all', label: 'Semua', icon: Shuffle },
  { id: 'farmako', label: 'Farmako & Dosis', icon: BookOpen },
  { id: 'lab', label: 'Nilai Lab', icon: Beaker },
  { id: 'klinis', label: 'Tanda Klinis', icon: Activity },
  { id: 'doa', label: 'Hafalan Doa', icon: Heart },
];

export default function FlashcardDrill() {
  const navigate = useNavigate(); // 2. Init Navigate
  const { currentUser } = useAuth();
  
  const [activeCategory, setActiveCategory] = useState('all');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [progressData, setProgressData] = useState<{[key:string]: CardProgress}>({});

  useEffect(() => {
    const saved = localStorage.getItem('medprep_flashcard_progress');
    if (saved) {
      setProgressData(JSON.parse(saved));
    }
  }, []);

  // Filter Cards
  const filteredCards = activeCategory === 'all' 
    ? FLASHCARDS 
    : FLASHCARDS.filter(card => card.category === activeCategory);

  const currentCard = filteredCards[currentIndex];
  const cardProgress = progressData[currentCard?.id];

  // LOGIKA KUNCI:
  const isLocked = (currentCard as any).type === 'premium' && currentUser?.subscriptionStatus !== 'premium';

  // Reset saat ganti kategori
  useEffect(() => {
    setCurrentIndex(0);
    setIsFlipped(false);
  }, [activeCategory]);

  const handleEvaluation = (result: 'forgot' | 'remember') => {
    const now = Date.now();
    let newInterval = 1;
    let nextDate = now;

    if (result === 'forgot') {
      newInterval = 0; 
      nextDate = now + 60000;
    } else {
      const currentInterval = cardProgress?.interval || 1;
      newInterval = currentInterval * 2; 
      nextDate = now + (newInterval * 24 * 60 * 60 * 1000);
    }

    const newProgress = {
      ...progressData,
      [currentCard.id]: {
        id: currentCard.id,
        interval: newInterval,
        nextReview: nextDate,
        status: result === 'forgot' ? 'learning' : 'review'
      } as CardProgress
    };

    setProgressData(newProgress);
    localStorage.setItem('medprep_flashcard_progress', JSON.stringify(newProgress));

    setIsFlipped(false);
    setTimeout(() => {
       setCurrentIndex((prev) => (prev + 1) % filteredCards.length);
    }, 200);
  };

  const handleNext = () => {
    setIsFlipped(false);
    setTimeout(() => setCurrentIndex((prev) => (prev + 1) % filteredCards.length), 200);
  };

  const handlePrev = () => {
    setIsFlipped(false);
    setTimeout(() => setCurrentIndex((prev) => (prev - 1 + filteredCards.length) % filteredCards.length), 200);
  };

  const getReviewText = () => {
    if (!cardProgress) return "Baru";
    const now = Date.now();
    if (cardProgress.nextReview < now) return "Due";
    const daysLeft = Math.ceil((cardProgress.nextReview - now) / (1000 * 60 * 60 * 24));
    return `${daysLeft} hari`;
  };

  return (
    <div className="p-6 pb-24 animate-in fade-in max-w-4xl mx-auto font-sans">
      
      {/* HEADER */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-black text-slate-900 dark:text-white mb-2 flex items-center justify-center gap-2">
          <Zap className="text-yellow-500 fill-yellow-500" /> Flashcard Drill
        </h1>
        <p className="text-slate-500 dark:text-slate-400">Metode Active Recall & Spaced Repetition.</p>
      </div>

      {/* TABS */}
      <div className="flex overflow-x-auto gap-3 pb-4 mb-6 custom-scrollbar justify-start md:justify-center">
        {CATEGORIES.map((cat) => {
          const Icon = cat.icon;
          const isActive = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-bold whitespace-nowrap transition-all ${
                isActive 
                  ? 'bg-teal-500 text-white shadow-lg shadow-teal-500/30' 
                  : 'bg-white dark:bg-slate-900 text-slate-500 border border-slate-200 dark:border-slate-800 hover:border-teal-500'
              }`}
            >
              <Icon size={16} /> {cat.label}
            </button>
          );
        })}
      </div>

      {/* AREA KARTU */}
      {filteredCards.length > 0 ? (
        // Wrapper Perspective (3D)
        <div className="relative h-[450px] w-full cursor-pointer group perspective-1000">
          
          <div className={`relative w-full h-full duration-500 transform-style-3d transition-all ${isFlipped ? 'rotate-y-180' : ''}`}>
            
            {/* SISI DEPAN */}
            <div 
              onClick={() => setIsFlipped(true)}
              className="absolute w-full h-full backface-hidden bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 rounded-3xl p-8 flex flex-col items-center justify-center text-center shadow-xl hover:border-teal-400 transition-colors"
            >
              <div className="absolute top-6 left-6 flex gap-2">
                <span className="text-xs font-bold uppercase tracking-widest text-slate-400 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full">
                  #{currentIndex + 1}
                </span>
                <span className={`text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full flex items-center gap-1 ${!cardProgress || cardProgress.nextReview < Date.now() ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
                  <Clock size={12} /> {getReviewText()}
                </span>
              </div>
              
              {/* Badge Premium */}
              <div className="absolute top-6 right-6">
                 {(currentCard as any).type === 'premium' ? (
                     <span className="bg-amber-100 text-amber-600 text-[10px] font-bold px-2 py-1 rounded border border-amber-200 flex items-center gap-1"><Lock size={10} /> PRO</span>
                 ) : (
                     <span className="bg-teal-100 text-teal-600 text-[10px] font-bold px-2 py-1 rounded border border-teal-200">FREE</span>
                 )}
              </div>

              <div className="w-24 h-24 bg-yellow-50 dark:bg-yellow-900/20 text-yellow-500 rounded-full flex items-center justify-center mb-8 animate-pulse">
                <Zap size={48} fill="currentColor" />
              </div>

              <h3 className="text-2xl md:text-3xl font-bold text-slate-800 dark:text-white leading-tight mb-4">
                {currentCard.question}
              </h3>
              
              <div className="absolute bottom-8 text-teal-500 text-sm font-bold flex items-center gap-2 bg-teal-50 dark:bg-teal-900/30 px-4 py-2 rounded-full">
                <RotateCw size={14} /> Klik untuk lihat jawaban
              </div>
            </div>

            {/* SISI BELAKANG */}
            <div className="absolute w-full h-full backface-hidden rotate-y-180 bg-slate-800 text-white rounded-3xl p-8 flex flex-col items-center justify-center text-center shadow-xl ring-4 ring-slate-700">
               
               {/* KONTEN JAWABAN / GEMBOK */}
               {isLocked ? (
                   <div className="w-full h-full flex flex-col items-center justify-center">
                        <div className="bg-white/10 p-4 rounded-full mb-4 backdrop-blur-sm">
                            <Lock size={32} className="text-white" />
                        </div>
                        <h3 className="text-white font-bold text-lg mb-2">Jawaban Terkunci</h3>
                        <p className="text-slate-300 text-sm mb-6 max-w-xs">Upgrade ke PRO untuk membuka kunci jawaban ini.</p>
                        
                        {/* --- TOMBOL UPGRADE (FIXED) --- */}
                        <button 
                            onClick={(e) => {
                                e.stopPropagation(); // Stop flip balik
                                navigate('/app/subscription'); // Arahkan ke halaman berbayar
                            }}
                            className="bg-white text-indigo-600 px-6 py-2 rounded-xl font-bold text-sm shadow-lg hover:bg-indigo-50 transition-colors flex items-center gap-2"
                        >
                            <Star size={14} fill="currentColor" className="text-orange-400"/> Upgrade Sekarang
                        </button>
                        
                        <button onClick={() => setIsFlipped(false)} className="mt-8 text-xs text-slate-400 hover:text-white underline">
                            Kembali ke Pertanyaan
                        </button>
                   </div>
               ) : (
                   <>
                       <div className="flex-1 flex flex-col justify-center w-full">
                          <span className="text-xs font-bold uppercase tracking-widest text-teal-400 mb-2">Jawaban</span>
                          <h3 className="text-xl md:text-2xl font-bold leading-relaxed mb-6">
                            {currentCard.answer}
                          </h3>
                          {currentCard.mnemonics && (
                            <div className="bg-slate-700/50 p-4 rounded-xl border border-slate-600 mx-auto w-full max-w-md">
                              <p className="text-sm font-bold text-yellow-400 flex items-center gap-2 justify-center mb-1">
                                <Brain size={14} /> Jembatan Keledai:
                              </p>
                              <p className="text-sm italic text-slate-200">"{currentCard.mnemonics}"</p>
                            </div>
                          )}
                       </div>

                       <div className="w-full pt-4 border-t border-slate-600">
                          <p className="text-xs text-slate-400 mb-3 font-bold uppercase">Bagaimana ingatan Anda?</p>
                          <div className="grid grid-cols-2 gap-4">
                            <button 
                              onClick={(e) => { e.stopPropagation(); handleEvaluation('forgot'); }}
                              className="flex flex-col items-center justify-center gap-1 bg-red-500/20 hover:bg-red-500 text-red-400 hover:text-white border border-red-500/50 py-3 rounded-xl transition-all group"
                            >
                              <XCircle size={24} className="group-hover:scale-110 transition-transform" />
                              <span className="text-xs font-bold">Lupa</span>
                            </button>

                            <button 
                              onClick={(e) => { e.stopPropagation(); handleEvaluation('remember'); }}
                              className="flex flex-col items-center justify-center gap-1 bg-green-500/20 hover:bg-green-500 text-green-400 hover:text-white border border-green-500/50 py-3 rounded-xl transition-all group"
                            >
                              <CheckCircle size={24} className="group-hover:scale-110 transition-transform" />
                              <span className="text-xs font-bold">Ingat</span>
                            </button>
                          </div>
                       </div>
                   </>
               )}
            </div>

          </div>
        </div>
      ) : (
        <div className="h-[400px] flex flex-col items-center justify-center text-slate-400 bg-slate-50 dark:bg-slate-900/50 rounded-3xl border border-dashed border-slate-300 dark:border-slate-700">
          <Zap size={48} className="mb-4 opacity-50" />
          <p>Semua kartu di kategori ini sudah dikuasai!</p>
          <button onClick={() => { localStorage.removeItem('medprep_flashcard_progress'); window.location.reload(); }} className="mt-4 text-xs text-teal-500 hover:underline">
            Reset Progress
          </button>
        </div>
      )}

      {!isFlipped && filteredCards.length > 0 && (
        <div className="flex items-center justify-center gap-6 mt-8 opacity-50 hover:opacity-100 transition-opacity">
          <button onClick={handlePrev} className="p-3 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400"><ChevronLeft /></button>
          <span className="text-xs text-slate-400 font-mono">{currentIndex + 1} / {filteredCards.length}</span>
          <button onClick={handleNext} className="p-3 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400"><ChevronRight /></button>
        </div>
      )}

      {/* CSS KHUSUS 3D FLIP */}
      <style>{`
        .perspective-1000 { perspective: 1000px; }
        .transform-style-3d { transform-style: preserve-3d; }
        .backface-hidden { backface-visibility: hidden; }
        .rotate-y-180 { transform: rotateY(180deg); }
      `}</style>
    </div>
  );
}