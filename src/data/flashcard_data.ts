import { Brain, Heart, BookOpen, Activity, Beaker, Shuffle } from 'lucide-react';

// 1. UPDATE INTERFACE (Agar tidak merah)
export interface Flashcard {
  id: string;
  category: 'farmako' | 'lab' | 'klinis' | 'doa';
  question: string;
  answer: string;
  mnemonics?: string; // Jembatan keledai (opsional)
  type?: 'free' | 'premium'; // <--- TAMBAHAN PENTING
}

// 2. DATA FLASHCARD (Contoh dengan Label Premium)
export const FLASHCARDS: Flashcard[] = [
  // --- FARMAKOLOGI ---
  {
    id: 'f1',
    category: 'farmako',
    question: 'Dosis Paracetamol untuk anak (rumus umum)?',
    answer: '10-15 mg/kgBB/kali, diberikan tiap 4-6 jam (maksimal 5x sehari).',
    mnemonics: 'Ingat "10-15" untuk demam anak.',
    type: 'free' // GRATIS
  },
  {
    id: 'f2',
    category: 'farmako',
    question: 'Antidotum keracunan Organofosfat?',
    answer: 'Sulfas Atropin (SA) sampai tanda atropinisasi muncul.',
    type: 'free'
  },
  {
    id: 'f3',
    category: 'farmako',
    question: 'Terapi Eradikasi H. pylori (Triple Therapy)?',
    answer: 'PPI (2x1) + Amoxicillin (2x1000mg) + Clarithromycin (2x500mg) selama 14 hari.',
    mnemonics: 'PAC: P-PI, A-mox, C-larithro',
    type: 'premium' // BERBAYAR
  },

  // --- NILAI LAB ---
  {
    id: 'l1',
    category: 'lab',
    question: 'Nilai normal Trombosit?',
    answer: '150.000 - 450.000 /µL',
    type: 'free'
  },
  {
    id: 'l2',
    category: 'lab',
    question: 'Kriteria Anemia menurut WHO untuk Laki-laki dewasa?',
    answer: 'Hb < 13 g/dL',
    type: 'free'
  },
  {
    id: 'l3',
    category: 'lab',
    question: 'Interpretasi Analisa Gas Darah: pH 7.25, pCO2 60, HCO3 26?',
    answer: 'Asidosis Respiratorik (pH rendah, pCO2 tinggi, HCO3 normal/kompensasi awal).',
    type: 'premium' // BERBAYAR
  },

  // --- TANDA KLINIS ---
  {
    id: 'k1',
    category: 'klinis',
    question: 'Tanda khas pada Inspeksi pasien PPOK (Emfisema)?',
    answer: 'Barrel Chest (Dada tong) & Pursed-lip breathing.',
    type: 'free'
  },
  {
    id: 'k2',
    category: 'klinis',
    question: 'Trias Cushing (TIK Meningkat)?',
    answer: '1. Hipertensi (Sistolik naik)\n2. Bradikardia\n3. Napas Irreguler',
    mnemonics: 'Kebalikan Syok (Hipotensi + Takikardi)',
    type: 'premium' // BERBAYAR
  },

  // --- DOA DOKTER ---
  {
    id: 'd1',
    category: 'doa',
    question: 'Doa menjenguk orang sakit?',
    answer: 'Allahumma rabban-nasi adzhibil-ba’sa, isyfi antasy-syafi, la syifa’a illa syifa’uka, syifa’an la yughadiru saqaman.',
    mnemonics: 'Ya Allah hilangkanlah penyakitnya, sembuhkanlah...',
    type: 'free'
  },
  {
    id: 'd2',
    category: 'doa',
    question: 'Doa ketika minum obat?',
    answer: 'Bismillah, asy-syafi huwallah. (Dengan nama Allah, Yang Maha Menyembuhkan adalah Allah).',
    type: 'free'
  }
];