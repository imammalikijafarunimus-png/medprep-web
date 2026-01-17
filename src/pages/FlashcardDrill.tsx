import React, { useState, useEffect } from 'react';
import { 
  Zap, RotateCw, Check, X, ChevronRight, 
  ArrowLeft, Brain, Pill, Activity, Sparkles, Filter 
} from 'lucide-react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useIslamicMode } from '../context/IslamicModeContext';

// --- TIPE DATA ---
interface Flashcard {
  id: string;
  front: string; // Pertanyaan / Istilah
  back: string;  // Jawaban / Definisi
  category: 'Farmako' | 'Lab' | 'Klinis' | 'Fiqih' | 'Lainnya';
  system?: string; // Opsional: Kardio, Neuro, dll
}

const CATEGORIES = [
  { id: 'All', label: 'Semua', icon: Zap },
  { id: 'Farmako', label: 'Farmako & Dosis', icon: Pill },
  { id: 'Lab', label: 'Nilai Lab', icon: Activity },
  { id: 'Klinis', label: 'Tanda Klinis', icon: Brain },
  { id: 'Fiqih', label: 'Hafalan Doa', icon: Sparkles },
];

export default function FlashcardDrill() {
  const { isIslamicMode } = useIslamicMode();
  
  // State Data
  const [cards, setCards] = useState<Flashcard[]>([]);
  const [filteredCards, setFilteredCards] = useState<Flashcard[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');

  // State Drill
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [score, setScore] = useState({ remembered: 0, forgot: 0 });
  const [isFinished, setIsFinished] = useState(false);

  // 1. Fetch Data
  useEffect(() => {
    const fetchCards = async () => {
      setLoading(true);
      try {
        const snapshot = await getDocs(collection(db, "flashcards"));
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Flashcard[];
        
        // DUMMY DATA (Jika kosong)
        if (data.length === 0) {
          const dummy: Flashcard[] = [
            { id: '1', category: 'Farmako', front: 'Dosis Paracetamol Anak', back: '10-15 mg/kgBB/kali, tiap 4-6 jam (Maks 5x/hari)' },
            { id: '2', category: 'Farmako', front: 'Dosis Adrenalin Syok Anafilaktik (Dewasa)', back: '0.3 - 0.5 mg IM (1:1000). Ulangi tiap 5-15 menit.' },
            { id: '3', category: 'Lab', front: 'Nilai Normal Kalium (K+)', back: '3.5 - 5.0 mEq/L' },
            { id: '4', category: 'Klinis', front: 'Murphy Sign (+)', back: 'Nyeri tekan perut kanan atas saat inspirasi dalam -> Kolesistitis Akut' },
            { id: '5', category: 'Fiqih', front: 'Doa Menjenguk Orang Sakit', back: 'Laa ba\'sa thahuurun insyaa Allah (Tidak mengapa, semoga sakitmu ini menjadi pembersih dosa)' },
            { id: '6', category: 'Klinis', front: 'Trias Cushing (TIK Meningkat)', back: '1. Hipertensi (Sistolik naik)\n2. Bradikardia\n3. Napas ireguler' },
          ];
          setCards(dummy);
        } else {
          setCards(data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchCards();
  }, []);

  // 2. Filter Logic
  useEffect(() => {
    let result = cards;
    if (selectedCategory !== 'All') {
      result = cards.filter(c => c.category === selectedCategory);
    }
    // Shuffle Array (Biar urutan soal acak setiap kali buka)
    result = result.sort(() => Math.random() - 0.5);
    setFilteredCards(result);
    setCurrentIndex(0);
    setIsFinished(false);
    setScore({ remembered: 0, forgot: 0 });
    setIsFlipped(false);
  }, [selectedCategory, cards]);

  // --- HANDLERS ---
  const handleNext = (remembered: boolean) => {
    setScore(prev => ({
      remembered: remembered ? prev.remembered + 1 : prev.remembered,
      forgot: remembered ? prev.forgot : prev.forgot + 1
    }));

    setIsFlipped(false);
    
    // Delay sedikit biar kartu tertutup dulu baru ganti soal
    setTimeout(() => {
      if (currentIndex < filteredCards.length - 1) {
        setCurrentIndex(prev => prev + 1);
      } else {
        setIsFinished(true);
      }
    }, 200);
  };

  const restartDrill = () => {
    const shuffled = [...filteredCards].sort(() => Math.random() - 0.5);
    setFilteredCards(shuffled);
    setCurrentIndex(0);
    setIsFinished(false);
    setScore({ remembered: 0, forgot: 0 });
    setIsFlipped(false);
  };

  if (loading) return <div className="text-center p-10 animate-pulse text-slate-500">Menyiapkan Kartu Hafalan...</div>;

  return (
    <div className="max-w-4xl mx-auto pb-10">
      
      {/* HEADER & FILTER */}
      <div className="mb-8 animate-in slide-in-from-top duration-500">
        <h1 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
          <Zap className="text-amber-400" fill="currentColor" /> Flashcard Drill
        </h1>
        <p className="text-slate-400 text-sm mb-6">Metode "Active Recall" untuk menghafal dosis, nilai lab, dan poin penting.</p>
        
        {/* Category Pills */}
        <div className="flex gap-3 overflow-x-auto pb-2 custom-scrollbar">
          {CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold transition-all whitespace-nowrap border ${
                selectedCategory === cat.id 
                ? 'bg-amber-500 text-black border-amber-500' 
                : 'bg-slate-900 border-slate-700 text-slate-400 hover:bg-slate-800'
              }`}
            >
              <cat.icon size={16} /> {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* CONTENT AREA */}
      {filteredCards.length === 0 ? (
        <div className="text-center p-12 border border-dashed border-slate-800 rounded-2xl text-slate-500">
          Tidak ada kartu di kategori ini.
        </div>
      ) : isFinished ? (
        // --- RESULT SCREEN ---
        <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-10 text-center animate-in zoom-in duration-300">
          <div className="w-20 h-20 bg-amber-500/20 rounded-full flex items-center justify-center mx-auto mb-6 text-amber-400">
            <Zap size={40} />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Sesi Selesai!</h2>
          <p className="text-slate-400 mb-8">Kamu telah mereview {filteredCards.length} kartu.</p>
          
          <div className="grid grid-cols-2 gap-4 max-w-xs mx-auto mb-8">
            <div className="bg-emerald-500/10 border border-emerald-500/20 p-4 rounded-xl">
              <p className="text-2xl font-bold text-emerald-400">{score.remembered}</p>
              <p className="text-xs text-emerald-500/70 uppercase font-bold">Ingat</p>
            </div>
            <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-xl">
              <p className="text-2xl font-bold text-red-400">{score.forgot}</p>
              <p className="text-xs text-red-500/70 uppercase font-bold">Lupa</p>
            </div>
          </div>

          <button 
            onClick={restartDrill}
            className="px-8 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold transition-all"
          >
            Ulangi Latihan
          </button>
        </div>
      ) : (
        // --- CARD DRILL ---
        <div className="animate-in fade-in duration-500">
          
          {/* Progress Bar */}
          <div className="flex justify-between text-xs text-slate-500 mb-2 font-bold uppercase tracking-wider">
            <span>Kartu {currentIndex + 1} dari {filteredCards.length}</span>
            <span>{filteredCards[currentIndex].category}</span>
          </div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full mb-6">
            <div 
              className="bg-amber-400 h-1.5 rounded-full transition-all duration-300" 
              style={{ width: `${((currentIndex + 1) / filteredCards.length) * 100}%` }}
            ></div>
          </div>

          {/* THE CARD (Perspective 3D) */}
          <div 
            className="relative w-full h-80 cursor-pointer perspective-1000 group"
            onClick={() => setIsFlipped(!isFlipped)}
          >
            <div className={`relative w-full h-full transition-transform duration-500 transform-style-3d ${isFlipped ? 'rotate-y-180' : ''}`}>
              
              {/* FRONT (Pertanyaan) */}
              <div className="absolute w-full h-full backface-hidden bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-3xl flex flex-col items-center justify-center p-8 shadow-2xl text-center">
                <span className="text-amber-500 text-xs font-bold uppercase mb-4 tracking-widest border border-amber-500/30 px-2 py-1 rounded">
                  {filteredCards[currentIndex].category}
                </span>
                <h3 className="text-2xl md:text-3xl font-bold text-white leading-tight">
                  {filteredCards[currentIndex].front}
                </h3>
                <p className="text-slate-500 text-xs mt-6 animate-pulse">Ketuk untuk balik kartu</p>
              </div>

              {/* BACK (Jawaban) */}
              <div className="absolute w-full h-full backface-hidden rotate-y-180 bg-gradient-to-br from-blue-900 to-slate-900 border border-blue-500/30 rounded-3xl flex flex-col items-center justify-center p-8 shadow-2xl text-center">
                <h3 className="text-xl md:text-2xl font-medium text-blue-100 leading-relaxed whitespace-pre-line">
                  {filteredCards[currentIndex].back}
                </h3>
              </div>

            </div>
          </div>

          {/* Action Buttons (Muncul setelah dibalik) */}
          <div className={`flex gap-4 mt-8 transition-all duration-300 ${isFlipped ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}>
            <button 
              onClick={() => handleNext(false)}
              className="flex-1 py-4 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-red-400 rounded-2xl font-bold flex flex-col items-center gap-1 transition-all"
            >
              <X size={24} />
              <span className="text-xs uppercase">Lupa / Salah</span>
            </button>
            <button 
              onClick={() => handleNext(true)}
              className="flex-1 py-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl font-bold flex flex-col items-center gap-1 shadow-lg shadow-emerald-500/20 transition-all"
            >
              <Check size={24} />
              <span className="text-xs uppercase">Ingat / Benar</span>
            </button>
          </div>

        </div>
      )}
      
      {/* Tambahkan CSS inline untuk efek 3D flip */}
      <style>{`
        .perspective-1000 { perspective: 1000px; }
        .transform-style-3d { transform-style: preserve-3d; }
        .backface-hidden { backface-visibility: hidden; }
        .rotate-y-180 { transform: rotateY(180deg); }
      `}</style>
    </div>
  );
}