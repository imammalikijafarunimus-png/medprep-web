import { useState, useEffect } from 'react';
import { ArrowLeft, RotateCcw, ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useIslamicMode } from '../context/IslamicModeContext';
import { collection, getDocs } from 'firebase/firestore'; // Import Firestore
import { db } from '../lib/firebase';

export default function FlashcardDrill() {
  const { isIslamicMode } = useIslamicMode();

  const [fullDeck, setFullDeck] = useState([]); // Semua kartu dari DB
  const [activeDeck, setActiveDeck] = useState([]); // Kartu yang sedang dimainkan (terfilter)
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [loading, setLoading] = useState(true);

  // 1. Ambil Data dari Firestore (Sekali saja saat load)
  useEffect(() => {
    const fetchCards = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'flashcards'));
        const cards = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setFullDeck(cards);
      } catch (error) {
        console.error('Gagal ambil flashcards:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchCards();
  }, []);

  // 2. Filter Deck saat Mode Islam berubah atau Data baru masuk
  useEffect(() => {
    if (fullDeck.length > 0) {
      const filtered = fullDeck.filter((card) =>
        isIslamicMode ? true : card.type !== 'islamic'
      );
      setActiveDeck(filtered);
      setCurrentIndex(0);
      setIsFlipped(false);
    }
  }, [isIslamicMode, fullDeck]);

  // Navigasi
  const handleNext = () => {
    if (currentIndex < activeDeck.length - 1) {
      setIsFlipped(false);
      setTimeout(() => setCurrentIndex((prev) => prev + 1), 150);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setIsFlipped(false);
      setTimeout(() => setCurrentIndex((prev) => prev - 1), 150);
    }
  };

  if (loading)
    return <div className="p-10 text-center">Mengambil kartu...</div>;

  // Jika database kosong
  if (activeDeck.length === 0)
    return (
      <div className="p-10 text-center text-slate-400">
        <p>Belum ada kartu soal.</p>
        <Link to="/admin" className="text-primary underline mt-2 block">
          Input Soal Dulu
        </Link>
      </div>
    );

  const currentCard = activeDeck[currentIndex];

  return (
    <div className="max-w-xl mx-auto pb-20 h-[calc(100vh-100px)] flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 shrink-0">
        <div className="flex items-center gap-4">
          <Link to="/app" className="p-2 hover:bg-slate-800 rounded-full">
            <ArrowLeft size={24} />
          </Link>
          <div>
            <h1 className="text-xl font-bold">Flashcards</h1>
            <p className="text-sm text-slate-400">
              Kartu {currentIndex + 1} dari {activeDeck.length}
            </p>
          </div>
        </div>
        <button
          onClick={() => {
            setIsFlipped(false);
            setCurrentIndex(0);
          }}
          className="p-2 hover:bg-slate-800 rounded-full text-slate-400"
        >
          <RotateCcw size={20} />
        </button>
      </div>

      {/* FLASHCARD AREA */}
      <div
        className="flex-1 perspective-1000 relative group cursor-pointer"
        onClick={() => setIsFlipped(!isFlipped)}
      >
        <div
          className={`
          relative w-full h-full duration-500 transform-style-3d transition-transform
          ${isFlipped ? 'rotate-y-180' : ''}
        `}
        >
          {/* DEPAN */}
          <div className="absolute inset-0 backface-hidden bg-surface border border-slate-700 rounded-2xl p-8 flex flex-col items-center justify-center text-center shadow-xl">
            <span
              className={`
              text-xs font-bold px-3 py-1 rounded-full mb-4 uppercase tracking-wider
              ${
                currentCard.type === 'islamic'
                  ? 'bg-islamic/20 text-islamic'
                  : 'bg-blue-500/20 text-blue-400'
              }
            `}
            >
              {currentCard.type === 'islamic' ? '🕌 Fiqih Medis' : '🩺 Medis'}
            </span>
            <h3 className="text-2xl font-bold leading-relaxed">
              {currentCard.front}
            </h3>
            <p className="text-sm text-slate-500 mt-8 animate-pulse">
              (Ketuk untuk balik)
            </p>
          </div>

          {/* BELAKANG */}
          <div className="absolute inset-0 backface-hidden rotate-y-180 bg-slate-800 border border-slate-600 rounded-2xl p-8 flex flex-col items-center justify-center text-center shadow-xl">
            <h3 className="text-xl text-slate-200 whitespace-pre-line leading-relaxed">
              {currentCard.back}
            </h3>
          </div>
        </div>
      </div>

      {/* Navigasi Bawah */}
      <div className="flex items-center justify-between mt-8 shrink-0 gap-4">
        <button
          onClick={handlePrev}
          disabled={currentIndex === 0}
          className="flex-1 p-4 rounded-xl bg-surface border border-slate-700 disabled:opacity-50 hover:bg-slate-700 flex justify-center"
        >
          <ChevronLeft />
        </button>
        <button
          onClick={handleNext}
          disabled={currentIndex === activeDeck.length - 1}
          className="flex-1 p-4 rounded-xl bg-primary hover:bg-blue-600 text-white disabled:bg-slate-700 disabled:opacity-50 flex justify-center"
        >
          <ChevronRight />
        </button>
      </div>
    </div>
  );
}
