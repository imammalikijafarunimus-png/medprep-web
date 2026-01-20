import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, RotateCw, BookOpen, Brain, Beaker, Activity, Heart, Shuffle, Zap, XCircle, CheckCircle, Clock } from 'lucide-react';
import { FLASHCARDS } from '../data/flashcard_data';

// --- TIPE DATA PROGRES (DISIMPAN DI LOCALSTORAGE) ---
interface CardProgress {
  id: string;
  interval: number; // Jarak hari untuk review berikutnya
  nextReview: number; // Timestamp kapan harus muncul lagi
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
  const [activeCategory, setActiveCategory] = useState('all');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  
  // State untuk menyimpan progress hafalan Dokter
  const [progressData, setProgressData] = useState<{[key:string]: CardProgress}>({});

  // 1. LOAD PROGRESS DARI LOCAL STORAGE SAAT MULAI
  useEffect(() => {
    const saved = localStorage.getItem('medprep_flashcard_progress');
    if (saved) {
      setProgressData(JSON.parse(saved));
    }
  }, []);

  // 2. FILTER & SORTING KARTU (LOGIKA SRS)
  // Kartu yang "Due" (Jatuh Tempo) atau "Belum Pernah Dilihat" akan muncul duluan
  const getFilteredCards = () => {
    let cards = activeCategory === 'all' 
      ? FLASHCARDS 
      : FLASHCARDS.filter(card => card.category === activeCategory);
    
    const now = Date.now();

    // Sort: Prioritaskan yang (1) Belum pernah dibuka, (2) Sudah waktunya review (Lupa/Jatuh tempo)
    return cards.sort((a, b) => {
      const progA = progressData[a.id];
      const progB = progressData[b.id];

      // Kalau belum ada data, anggap prioritas tinggi
      if (!progA) return -1;
      if (!progB) return 1;

      // Kalau sudah ada data, urutkan berdasarkan waktu review
      return progA.nextReview - progB.nextReview;
    });
  };

  const filteredCards = getFilteredCards();
  const currentCard = filteredCards[currentIndex];
  const cardProgress = progressData[currentCard?.id];

  // Reset saat ganti kategori
  useEffect(() => {
    setCurrentIndex(0);
    setIsFlipped(false);
  }, [activeCategory]);

  // --- LOGIKA EVALUASI (SRS ALGORITHM SEDERHANA) ---
  const handleEvaluation = (result: 'forgot' | 'remember') => {
    const now = Date.now();
    let newInterval = 1; // Default 1 hari
    let nextDate = now;

    if (result === 'forgot') {
      // JIKA LUPA/SALAH:
      // Reset interval, muncul lagi dalam 1 menit (logika antrian) atau besok
      newInterval = 0; 
      nextDate = now + 60000; // Muncul 1 menit lagi (dianggap 'Learning')
    } else {
      // JIKA INGAT/BENAR:
      // Interval dikali 2 (Spaced Repetition: 1 hari -> 2 hari -> 4 hari -> dst)
      const currentInterval = cardProgress?.interval || 1;
      newInterval = currentInterval * 2; 
      // Hitung tanggal berikutnya (Hari * 24jam * 60mnt * 60dtk * 1000ms)
      nextDate = now + (newInterval * 24 * 60 * 60 * 1000);
    }

    // Update State
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

    // Pindah ke kartu berikutnya otomatis agar flow cepat
    setIsFlipped(false);
    setTimeout(() => {
       // Pindah ke kartu berikutnya (looping)
       setCurrentIndex((prev) => (prev + 1) % filteredCards.length);
    }, 200);
  };

  // Navigasi Manual (Tetap ada jika ingin skip)
  const handleNext = () => {
    setIsFlipped(false);
    setTimeout(() => setCurrentIndex((prev) => (prev + 1) % filteredCards.length), 200);
  };

  const handlePrev = () => {
    setIsFlipped(false);
    setTimeout(() => setCurrentIndex((prev) => (prev - 1 + filteredCards.length) % filteredCards.length), 200);
  };

  // Helper untuk menampilkan status waktu
  const getReviewText = () => {
    if (!cardProgress) return "Baru";
    const now = Date.now();
    if (cardProgress.nextReview < now) return "Due (Waktunya Review)";
    
    const daysLeft = Math.ceil((cardProgress.nextReview - now) / (1000 * 60 * 60 * 24));
    return `Review: ${daysLeft} hari lagi`;
  };

  return (
    <div className="p-6 pb-24 animate-in fade-in max-w-4xl mx-auto">
      
      {/* HEADER */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-black text-slate-900 dark:text-white mb-2 flex items-center justify-center gap-2">
          {/* ICON KEMBALI JADI PETIR (ZAP) */}
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
        <div className="relative h-[450px] w-full cursor-pointer group [perspective:1000px]">
          
          <div className={`relative w-full h-full duration-500 [transform-style:preserve-3d] transition-all ${isFlipped ? '[transform:rotateY(180deg)]' : ''}`}>
            
            {/* SISI DEPAN (PERTANYAAN) */}
            <div 
              onClick={() => setIsFlipped(true)}
              className="absolute w-full h-full [backface-visibility:hidden] bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 rounded-3xl p-8 flex flex-col items-center justify-center text-center shadow-xl hover:border-teal-400 transition-colors"
            >
              <div className="absolute top-6 left-6 flex gap-2">
                <span className="text-xs font-bold uppercase tracking-widest text-slate-400 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full">
                  #{currentIndex + 1}
                </span>
                {/* Badge Status Review */}
                <span className={`text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full flex items-center gap-1 ${!cardProgress || cardProgress.nextReview < Date.now() ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
                  <Clock size={12} /> {getReviewText()}
                </span>
              </div>

              {/* ICON PETIR DI TENGAH KARTU */}
              <div className="w-24 h-24 bg-yellow-50 dark:bg-yellow-900/20 text-yellow-500 rounded-full flex items-center justify-center mb-8 animate-pulse">
                <Zap size={48} fill="currentColor" />
              </div>

              <h3 className="text-2xl md:text-3xl font-bold text-slate-800 dark:text-white leading-tight mb-4">
                {currentCard.question}
              </h3>
              
              <div className="absolute bottom-8 flex flex-col items-center gap-2">
                <span className="text-teal-500 text-sm font-bold flex items-center gap-2 bg-teal-50 dark:bg-teal-900/30 px-4 py-2 rounded-full">
                  <RotateCw size={14} /> Klik kartu untuk lihat jawaban
                </span>
              </div>
            </div>

            {/* SISI BELAKANG (JAWABAN & EVALUASI) */}
            <div className="absolute w-full h-full [backface-visibility:hidden] [transform:rotateY(180deg)] bg-slate-800 text-white rounded-3xl p-8 flex flex-col items-center justify-center text-center shadow-xl ring-4 ring-slate-700">
               
               {/* KONTEN JAWABAN */}
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

               {/* TOMBOL EVALUASI (PENTING) */}
               <div className="w-full pt-4 border-t border-slate-600">
                  <p className="text-xs text-slate-400 mb-3 font-bold uppercase">Bagaimana ingatan Anda?</p>
                  <div className="grid grid-cols-2 gap-4">
                    <button 
                      onClick={(e) => { e.stopPropagation(); handleEvaluation('forgot'); }}
                      className="flex flex-col items-center justify-center gap-1 bg-red-500/20 hover:bg-red-500 text-red-400 hover:text-white border border-red-500/50 py-3 rounded-xl transition-all group"
                    >
                      <XCircle size={24} className="group-hover:scale-110 transition-transform" />
                      <span className="text-xs font-bold">Lupa / Salah</span>
                      <span className="text-[10px] opacity-70">&lt; 1 mnt</span>
                    </button>

                    <button 
                      onClick={(e) => { e.stopPropagation(); handleEvaluation('remember'); }}
                      className="flex flex-col items-center justify-center gap-1 bg-green-500/20 hover:bg-green-500 text-green-400 hover:text-white border border-green-500/50 py-3 rounded-xl transition-all group"
                    >
                      <CheckCircle size={24} className="group-hover:scale-110 transition-transform" />
                      <span className="text-xs font-bold">Ingat / Benar</span>
                      <span className="text-[10px] opacity-70">3 hari</span>
                    </button>
                  </div>
               </div>
            </div>

          </div>
        </div>
      ) : (
        // JIKA KOSONG
        <div className="h-[400px] flex flex-col items-center justify-center text-slate-400 bg-slate-50 dark:bg-slate-900/50 rounded-3xl border border-dashed border-slate-300 dark:border-slate-700">
          <Zap size={48} className="mb-4 opacity-50" />
          <p>Semua kartu di kategori ini sudah dikuasai!</p>
          <button onClick={() => { localStorage.removeItem('medprep_flashcard_progress'); window.location.reload(); }} className="mt-4 text-xs text-teal-500 hover:underline">
            Reset Progress
          </button>
        </div>
      )}

      {/* CONTROLS (Hanya muncul jika BELUM dibalik / Sisi Depan) */}
      {!isFlipped && filteredCards.length > 0 && (
        <div className="flex items-center justify-center gap-6 mt-8 opacity-50 hover:opacity-100 transition-opacity">
          <button onClick={handlePrev} className="p-3 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400"><ChevronLeft /></button>
          <span className="text-xs text-slate-400 font-mono">{currentIndex + 1} / {filteredCards.length}</span>
          <button onClick={handleNext} className="p-3 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400"><ChevronRight /></button>
        </div>
      )}

    </div>
  );
}