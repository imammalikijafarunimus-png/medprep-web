export interface Flashcard {
    id: string;
    category: 'farmako' | 'lab' | 'klinis' | 'doa' | 'umum';
    question: string;
    answer: string;
    mnemonics?: string; // Jembatan keledai (Opsional)
  }
  
  export const FLASHCARDS: Flashcard[] = [
    // --- KATEGORI: HAFALAN DOA (ISLAMIC) ---
    {
      id: 'doa_makan',
      category: 'doa',
      question: 'Doa Sebelum Makan & Minum',
      answer: 'Allahumma baarik lanaa fiimaa rozaqtanaa wa qinaa adzaaban naar. (Ya Allah, berkahilah kami dalam rezeki yang telah Engkau berikan kepada kami dan peliharalah kami dari siksa api neraka)',
      mnemonics: 'Ingat "Barik lana" (berkahi kami)'
    },
    {
      id: 'doa_obat',
      category: 'doa',
      question: 'Doa Minum Obat (Syifa)',
      answer: 'Allahumma Rabban-nasi, adzhibil-ba’sa, isyfi antas-syafi, la syifa’a illa syifa’uka, syifa’an la yughadiru saqaman. (Ya Allah Tuhan manusia, hilangkanlah penyakit, sembuhkanlah karena Engkaulah Penyembuh...)',
    },
    {
      id: 'doa_pasien',
      category: 'doa',
      question: 'Doa Menjenguk Orang Sakit',
      answer: 'La ba\'sa thahurun insya Allah. (Tidak mengapa, semoga sakitmu ini membuat dosamu bersih, Insya Allah)',
    },
  
    // --- KATEGORI: FARMAKO & DOSIS ---
    {
      id: 'farm_pct_anak',
      category: 'farmako',
      question: 'Dosis Paracetamol Anak',
      answer: '10 - 15 mg/kgBB/kali pemberian. (Maksimal 4-5 kali sehari).',
      mnemonics: 'Ingat angka 10-15 (umur anak SMP)'
    },
    {
      id: 'farm_adrenaline',
      category: 'farmako',
      question: 'Dosis Adrenalin Syok Anafilaktik (Dewasa)',
      answer: '0.3 - 0.5 mg (ml) IM (Intramuskular). Larutan 1:1000.',
      mnemonics: 'Ingat "Setengah ampul" paha luar'
    },
    {
      id: 'farm_tb_anak',
      category: 'farmako',
      question: 'Dosis INH (Isoniazid) TB Anak',
      answer: '10 mg/kgBB (Range 7-15 mg). Maksimal 300 mg/hari.',
    },
  
    // --- KATEGORI: NILAI LAB ---
    {
      id: 'lab_hb',
      category: 'lab',
      question: 'Nilai Normal Hemoglobin (Hb) Dewasa',
      answer: 'Pria: 13 - 17 g/dL\nWanita: 12 - 15 g/dL\nIbu Hamil: > 11 g/dL',
    },
    {
      id: 'lab_gula',
      category: 'lab',
      question: 'Kriteria Diagnosis Diabetes (GDP & GDS)',
      answer: 'GDP ≥ 126 mg/dL\nGDS ≥ 200 mg/dL + Gejala Klasik',
    },
    {
      id: 'lab_trombosit',
      category: 'lab',
      question: 'Nilai Normal Trombosit',
      answer: '150.000 - 450.000 /µL',
      mnemonics: 'Di bawah 150rb = Trombositopenia (Dengue?)'
    },
  
    // --- KATEGORI: TANDA KLINIS ---
    {
      id: 'klinis_murphy',
      category: 'klinis',
      question: 'Murphy Sign (+)',
      answer: 'Nyeri tekan perut kanan atas saat inspirasi dalam. Khas untuk Kolesistitis Akut.',
    },
    {
      id: 'klinis_brudzinski',
      category: 'klinis',
      question: 'Brudzinski I (Tanda Rangsang Meningeal)',
      answer: 'Saat leher difleksikan, lutut dan panggul ikut fleksi secara otomatis.',
      mnemonics: 'Leher tekuk -> Kaki ikut nekuk'
    },
    {
      id: 'klinis_mcburney',
      category: 'klinis',
      question: 'McBurney Point',
      answer: 'Titik 1/3 lateral garis imajiner dari SIAS ke Umbilikus. Nyeri tekan = Appendicitis.',
    }
  ];