import React, { useState, useEffect } from 'react';
import { 
  ChevronLeft, ChevronRight, RotateCw, BookOpen, Brain, Beaker, 
  Activity, Heart, Shuffle, Zap, XCircle, CheckCircle, Clock, 
  Lock, Star, Bookmark, BookmarkCheck
} from 'lucide-react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { FLASHCARDS } from '../data/flashcard_data';
import { useAuth } from '../context/AuthContext';

// Phase 1 & 2 Components
import { PageTransition, LoadingWrapper, AnimateIn } from '../components/ui/PageTransition';
import { Skeleton, SkeletonCard } from '../components/ui/Loading';
import { EmptyState } from '../components/ui/EmptyState';
import { useBookmarks, BookmarkType } from '../hooks/useBookmarks';
import { useToast } from '../context/ToastContext';

interface CardProgress {
  id: string;
  interval: number; 
  nextReview: number;
  status: 'new' | 'learning' | 'review';
}

const CATEGORIES = [
  { id: 'all', label: 'Semua', icon: Shuffle },
  { id: 'farmako', label: 'Farmako', icon: BookOpen },
  { id: 'lab', label: 'Lab', icon: Beaker },
  { id: 'klinis', label: 'Klinis', icon: Activity },
  { id: 'doa', label: 'Doa', icon: Heart },
];

// Loading skeleton for flashcard
function LoadingFlashcard() {
  return (
    <div className="space-y-6" aria-hidden="true">
      {/* Category tabs skeleton */}
      <div className="flex gap-2 justify-center">
        {[1, 2, 3, 4, 5].map((i) => (
          <Skeleton key={i} className="h-10 w-20 rounded-full" />
        ))}
      </div>
      
      {/* Card skeleton */}
      <div className="h-96 rounded-3xl bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 p-6">
        <div className="flex justify-between mb-6">
          <Skeleton className="h-6 w-16 rounded-full" />
          <Skeleton className="h-6 w-20 rounded-full" />
        </div>
        <div className="flex flex-col items-center justify-center h-full gap-4">
          <Skeleton className="w-16 h-16 rounded-full" />
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </div>
      </div>
      
      {/* Navigation skeleton */}
      <div className="flex justify-center gap-4">
        <Skeleton className="h-10 w-10 rounded-full" />
        <Skeleton className="h-6 w-20" />
        <Skeleton className="h-10 w-10 rounded-full" />
      </div>
    </div>
  );
}

// Stats Card Component
function StatsCard({ mastered, learning, due }: { mastered: number; learning: number; due: number }) {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 mb-6">
      <div className="grid grid-cols-3 gap-4 text-center">
        <div>
          <p className="text-2xl font-black text-green-500">{mastered}</p>
          <p className="text-[10px] text-slate-400 font-bold uppercase">Dikuasai</p>
        </div>
        <div>
          <p className="text-2xl font-black text-yellow-500">{learning}</p>
          <p className="text-[10px] text-slate-400 font-bold uppercase">Sedang Belajar</p>
        </div>
        <div>
          <p className="text-2xl font-black text-red-500">{due}</p>
          <p className="text-[10px] text-slate-400 font-bold uppercase">Due Today</p>
        </div>
      </div>
    </div>
  );
}

export default function FlashcardDrill() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const toast = useToast();
  
  // Get insight status from layout
  const { isInsightActive } = useOutletContext<{ isInsightActive: boolean }>();
  
  // Phase 2: Bookmarks hook
  const { isBookmarked, toggleBookmark } = useBookmarks();
  
  const [activeCategory, setActiveCategory] = useState('all');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [progressData, setProgressData] = useState<{[key:string]: CardProgress}>({});
  const [loading, setLoading] = useState(true);

  // Load progress from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('medprep_flashcard_progress');
    if (saved) {
      setProgressData(JSON.parse(saved));
    }
    // Simulate initial load
    const timer = setTimeout(() => setLoading(false), 300);
    return () => clearTimeout(timer);
  }, []);

  // Filter cards by category
  const filteredCards = activeCategory === 'all' 
    ? FLASHCARDS 
    : FLASHCARDS.filter(card => card.category === activeCategory);
  const currentCard = filteredCards[currentIndex];
  const cardProgress = progressData[currentCard?.id];
  const isLocked = (currentCard as any)?.type === 'premium' && currentUser?.subscriptionStatus !== 'premium';
  
  // Check if card is bookmarked - use correct type
  const isCardBookmarked = currentCard ? isBookmarked(currentCard.id, 'flashcard' as BookmarkType) : false;

  // Reset index when category changes
  useEffect(() => {
    setCurrentIndex(0);
    setIsFlipped(false);
  }, [activeCategory]);

  // Calculate stats
  const stats = React.useMemo(() => {
    const cards = Object.values(progressData);
    const now = Date.now();
    return {
      mastered: cards.filter(c => c.status === 'review' && c.interval >= 7).length,
      learning: cards.filter(c => c.status === 'learning').length,
      due: cards.filter(c => c.nextReview < now).length
    };
  }, [progressData]);

  const handleEvaluation = (result: 'forgot' | 'remember') => {
    if (!currentCard) return;
    
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

    // Show toast feedback using correct methods
    if (result === 'forgot') {
      toast.info('Kartu akan diulang lagi');
    } else {
      toast.success('Interval diperpanjang!');
    }

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

  const handleToggleBookmark = () => {
    if (!currentCard) return;
    
    const bookmarkType: BookmarkType = 'flashcard' as BookmarkType;
    
    toggleBookmark({
      id: currentCard.id,
      type: bookmarkType,
      title: currentCard.question,
      subtitle: currentCard.category,
      path: `/app/flashcards?id=${currentCard.id}`
    });
    
    if (isCardBookmarked) {
      toast.info('Dihapus dari bookmark');
    } else {
      toast.success('Ditambahkan ke bookmark');
    }
  };

  const getReviewText = () => {
    if (!cardProgress) return "Baru";
    const now = Date.now();
    if (cardProgress.nextReview < now) return "Due";
    const daysLeft = Math.ceil((cardProgress.nextReview - now) / (1000 * 60 * 60 * 24));
    return `${daysLeft}h`;
  };

  const resetProgress = () => {
    if (confirm('Yakin ingin reset semua progress flashcard?')) {
      localStorage.removeItem('medprep_flashcard_progress');
      setProgressData({});
      setCurrentIndex(0);
      toast.success('Progress flashcard direset');
    }
  };

  return (
    <PageTransition variant="fade">
      <LoadingWrapper isLoading={loading} skeleton={<LoadingFlashcard />}>
        <div className="p-4 md:p-6 pb-24 max-w-3xl mx-auto font-sans">
          
          {/* Header */}
          <AnimateIn animation="slide-up" delay={0}>
            <div className="text-center mb-6">
              <h1 className="text-2xl font-black text-slate-900 dark:text-white mb-1 flex items-center justify-center gap-2">
                <Zap className="text-yellow-500 fill-yellow-500 w-6 h-6" /> Flashcard Drill
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Active Recall & Spaced Repetition untuk ingatan jangka panjang.
              </p>
            </div>
          </AnimateIn>

          {/* Stats Card */}
          <AnimateIn animation="slide-up" delay={50}>
            <StatsCard {...stats} />
          </AnimateIn>

          {/* Category Tabs */}
          <AnimateIn animation="slide-up" delay={100}>
            <div className="flex overflow-x-auto gap-2 pb-2 mb-6 custom-scrollbar justify-start md:justify-center px-1">
              {CATEGORIES.map((cat, idx) => {
                const Icon = cat.icon;
                const isActive = activeCategory === cat.id;
                return (
                  <button 
                    key={cat.id} 
                    onClick={() => setActiveCategory(cat.id)} 
                    className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                      isActive 
                        ? 'bg-teal-500 text-white shadow-md' 
                        : 'bg-white dark:bg-slate-900 text-slate-500 border border-slate-200 dark:border-slate-800 hover:border-teal-500'
                    }`}
                  >
                    <Icon size={14} /> {cat.label}
                  </button>
                );
              })}
            </div>
          </AnimateIn>

          {/* Flashcard or Empty State */}
          {filteredCards.length > 0 ? (
            <AnimateIn animation="fade" delay={150}>
              <div className="relative h-96 w-full cursor-pointer group perspective-1000">
                <div className={`relative w-full h-full duration-500 transform-style-3d transition-all ${isFlipped ? 'rotate-y-180' : ''}`}>
                  
                  {/* Front Side */}
                  <div 
                    onClick={() => !isLocked && setIsFlipped(true)} 
                    className={`absolute w-full h-full backface-hidden bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 rounded-3xl p-6 flex flex-col items-center justify-center text-center shadow-lg hover:border-teal-400 transition-colors ${
                      isLocked ? 'cursor-not-allowed opacity-75' : 'cursor-pointer'
                    }`}
                  >
                    <div className="absolute top-4 left-4 flex gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full">
                        #{currentIndex + 1}
                      </span>
                      <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full flex items-center gap-1 ${
                        !cardProgress || cardProgress.nextReview < Date.now() 
                          ? 'bg-red-100 text-red-600' 
                          : 'bg-green-100 text-green-600'
                      }`}>
                        <Clock size={10} /> {getReviewText()}
                      </span>
                    </div>
                    
                    <div className="absolute top-4 right-4 flex gap-2">
                      {/* Bookmark Button */}
                      <button 
                        onClick={(e) => { e.stopPropagation(); handleToggleBookmark(); }}
                        className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                      >
                        {isCardBookmarked ? (
                          <BookmarkCheck size={16} className="text-teal-500" />
                        ) : (
                          <Bookmark size={16} className="text-slate-400" />
                        )}
                      </button>
                      
                      {/* Premium/Free Badge */}
                      {(currentCard as any)?.type === 'premium' ? (
                        <span className="bg-amber-100 text-amber-600 text-[9px] font-bold px-2 py-0.5 rounded border border-amber-200 flex items-center gap-1">
                          <Lock size={8} /> PRO
                        </span>
                      ) : (
                        <span className="bg-teal-100 text-teal-600 text-[9px] font-bold px-2 py-0.5 rounded border border-teal-200">
                          FREE
                        </span>
                      )}
                    </div>
                    
                    <div className="w-16 h-16 bg-yellow-50 dark:bg-yellow-900/20 text-yellow-500 rounded-full flex items-center justify-center mb-6 animate-pulse">
                      <Zap size={32} fill="currentColor" />
                    </div>
                    <h3 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white leading-snug mb-2 px-2">
                      {currentCard.question}
                    </h3>
                    <div className="absolute bottom-6 text-teal-500 text-xs font-bold flex items-center gap-2 bg-teal-50 dark:bg-teal-900/30 px-3 py-1.5 rounded-full">
                      <RotateCw size={12} /> {isLocked ? 'Terkunci' : 'Lihat Jawaban'}
                    </div>
                  </div>

                  {/* Back Side */}
                  <div className="absolute w-full h-full backface-hidden rotate-y-180 bg-slate-800 text-white rounded-3xl p-6 flex flex-col items-center justify-center text-center shadow-xl ring-4 ring-slate-700">
                    {isLocked ? (
                      <div className="w-full h-full flex flex-col items-center justify-center">
                        <div className="bg-white/10 p-3 rounded-full mb-3 backdrop-blur-sm">
                          <Lock size={24} className="text-white" />
                        </div>
                        <h3 className="text-white font-bold text-base mb-1">Terkunci</h3>
                        <p className="text-slate-300 text-xs mb-4 max-w-xs">Upgrade ke PRO untuk membuka.</p>
                        <button 
                          onClick={(e) => { e.stopPropagation(); navigate('/app/subscription'); }} 
                          className="bg-white text-indigo-600 px-5 py-2 rounded-xl font-bold text-xs shadow-lg hover:bg-indigo-50 transition-colors flex items-center gap-2"
                        >
                          <Star size={12} fill="currentColor" className="text-orange-400"/> Upgrade
                        </button>
                        <button 
                          onClick={() => setIsFlipped(false)} 
                          className="mt-6 text-[10px] text-slate-400 hover:text-white underline"
                        >
                          Kembali
                        </button>
                      </div>
                    ) : (
                      <>
                        <div className="flex-1 flex flex-col justify-center w-full">
                          <span className="text-[10px] font-bold uppercase tracking-widest text-teal-400 mb-1">Jawaban</span>
                          <h3 className="text-lg md:text-xl font-bold leading-snug mb-4">{currentCard.answer}</h3>
                          
                          {/* Insight / Mnemonics */}
                          {isInsightActive && currentCard.mnemonics && (
                            <div className="bg-slate-700/50 p-3 rounded-xl border border-slate-600 mx-auto w-full max-w-sm">
                              <p className="text-xs font-bold text-yellow-400 flex items-center gap-1.5 justify-center mb-0.5">
                                <Brain size={12} /> Jembatan Keledai:
                              </p>
                              <p className="text-xs italic text-slate-200">"{currentCard.mnemonics}"</p>
                            </div>
                          )}
                        </div>

                        <div className="w-full pt-3 border-t border-slate-600">
                          <p className="text-[10px] text-slate-400 mb-2 font-bold uppercase">Evaluasi:</p>
                          <div className="grid grid-cols-2 gap-3 mb-3">
                            <button 
                              onClick={(e) => { e.stopPropagation(); handleEvaluation('forgot'); }} 
                              className="flex items-center justify-center gap-2 bg-red-500/20 hover:bg-red-500 text-red-400 hover:text-white border border-red-500/50 py-2.5 rounded-xl transition-all group"
                            >
                              <XCircle size={18} className="group-hover:scale-110 transition-transform" />
                              <span className="text-xs font-bold">Lupa</span>
                            </button>
                            <button 
                              onClick={(e) => { e.stopPropagation(); handleEvaluation('remember'); }} 
                              className="flex items-center justify-center gap-2 bg-green-500/20 hover:bg-green-500 text-green-400 hover:text-white border border-green-500/50 py-2.5 rounded-xl transition-all group"
                            >
                              <CheckCircle size={18} className="group-hover:scale-110 transition-transform" />
                              <span className="text-xs font-bold">Ingat</span>
                            </button>
                          </div>
                          
                          {/* Skip/Next button on back side */}
                          <button
                            onClick={(e) => { e.stopPropagation(); handleNext(); }}
                            className="w-full flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white/70 hover:text-white border border-white/20 py-2 rounded-xl transition-all text-xs font-bold"
                          >
                            Lewati <ChevronRight size={14} />
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </AnimateIn>
          ) : (
            <EmptyState
              icon={<Zap className="w-12 h-12" />}
              title="Tidak Ada Kartu"
              description="Tidak ada flashcard dalam kategori ini."
              action={{
                label: 'Reset Progress',
                onClick: resetProgress
              }}
            />
          )}

          {/* Navigation - Always visible */}
          {filteredCards.length > 0 && (
            <AnimateIn animation="slide-up" delay={200}>
              <div className="flex items-center justify-center gap-4 mt-6 opacity-60 hover:opacity-100 transition-opacity">
                <button 
                  onClick={handlePrev} 
                  className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 transition-colors"
                >
                  <ChevronLeft size={20} />
                </button>
                <span className="text-xs text-slate-400 font-mono font-bold">
                  {currentIndex + 1} / {filteredCards.length}
                </span>
                <button 
                  onClick={handleNext} 
                  className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 transition-colors"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            </AnimateIn>
          )}

          {/* Reset Button (only show if there's progress) */}
          {Object.keys(progressData).length > 0 && (
            <div className="text-center mt-4">
              <button 
                onClick={resetProgress}
                className="text-xs text-slate-400 hover:text-red-500 transition-colors underline"
              >
                Reset Semua Progress
              </button>
            </div>
          )}

          <style>{`
            .perspective-1000 { perspective: 1000px; }
            .transform-style-3d { transform-style: preserve-3d; }
            .backface-hidden { backface-visibility: hidden; }
            .rotate-y-180 { transform: rotateY(180deg); }
          `}</style>
        </div>
      </LoadingWrapper>
    </PageTransition>
  );
}