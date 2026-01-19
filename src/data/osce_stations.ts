// --- TIPE DATA LEGO BLOCKS ---

export type OSCECategory = 
  | 'Neurologi' | 'Psikiatri' | 'Indra' | 'Respirasi' | 'Kardiovaskular' 
  | 'Gastroenterohepatologi' | 'Ginjal & Saluran Kemih' | 'Reproduksi' 
  | 'Endokrin & Metabolisme' | 'Hemato & Imunologi' | 'Muskuloskeletal' 
  | 'Integumen' | 'Kegawatdaruratan';

// 1. Tipe Section: STANDARD (Anamnesis Umum)
interface SectionStandardAnamnesis {
  type: 'standard_anamnesis';
  title: string;
  data: {
    keluhan_utama: string;
    rps: string[]; // Lokasi, Onset, Kualitas, dll
    rpd: string[];
    rpk: string[];
    kebiasaan?: string[];
    script?: string; // Contoh dialog dokter
  };
}

// 2. Tipe Section: PEDIATRI (Anak)
interface SectionPediatricHistory {
  type: 'pediatric_history';
  title: string;
  data: {
    prenatal: string[]; // Riwayat kehamilan ibu
    natal: string[];    // Persalinan (Spontan/SC, BBL)
    postnatal: string[]; // Imunisasi, Tumbuh kembang
    nutrisi: string[];  // ASI/Sufor
    script?: string;
  };
}

// 3. Tipe Section: PSIKIATRI (Jiwa)
interface SectionPsychiatryStatus {
  type: 'psychiatry_status';
  title: string;
  data: {
    penampilan: string[];
    mood_afek: string[];
    pembicaraan: string[];
    persepsi: string[]; // Halusinasi
    pikiran: string[];  // Waham
    tilikan: string;
    script?: string;
  };
}

// 4. Tipe Section: CHECKLIST (Tindakan/Pemeriksaan Fisik General)
interface SectionChecklist {
  type: 'checklist';
  title: string;
  items: {
    label: string;
    description?: string; // Detail cara periksa
    isCritical?: boolean;
    insight?: string; // Nilai Islam
    script?: string; // Dialog
  }[];
}

// Union Type (Gabungan semua kemungkinan lego)
export type OSCESection = 
  | SectionStandardAnamnesis 
  | SectionPediatricHistory 
  | SectionPsychiatryStatus 
  | SectionChecklist;

export interface OSCEStationData {
  id: string;
  system: OSCECategory;
  title: string; // Judul Kasus (Misal: Stroke Iskemik)
  description: string; // Deskripsi singkat kasus
  sections: OSCESection[]; // Susunan Lego-nya
}

// --- DATA DUMMY (CONTOH) ---

export const OSCE_STATIONS: OSCEStationData[] = [
  // KASUS 1: NEUROLOGI (Pola Standard)
  {
    id: 'neuro-01',
    system: 'Neurologi',
    title: 'Stroke Iskemik',
    description: 'Pasien datang dengan kelemahan anggota gerak sesisi mendadak.',
    sections: [
      {
        type: 'checklist',
        title: '1. Pembukaan & Informed Consent',
        items: [
          { label: 'Salam & Perkenalan', script: 'Assalamualaikum, Saya dr. Imam...', insight: 'Senyum, Salam, Sapa' },
          { label: 'Identitas Pasien', script: 'Nama, Usia, Alamat, Pekerjaan' },
          { label: 'Informed Consent', isCritical: true, script: 'Saya akan melakukan pemeriksaan saraf...' }
        ]
      },
      {
        type: 'standard_anamnesis',
        title: '2. Anamnesis (Sacred Seven)',
        data: {
          keluhan_utama: 'Lemah separuh badan kanan',
          rps: ['Onset: Tiba-tiba saat istirahat', 'Kualitas: Terasa berat, tidak bisa digerakkan', 'Gejala penyerta: Bicara pelo (+), Muntah (-)'],
          rpd: ['Hipertensi (+)', 'DM (+) disangkal'],
          rpk: ['Ayah meninggal karena stroke'],
          script: '"Sejak kapan Pak lemasnya? Apakah tiba-tiba atau perlahan?"'
        }
      },
      {
        type: 'checklist',
        title: '3. Status Neurologis',
        items: [
          { label: 'GCS', description: 'E4 V5 M6 (Compos Mentis)' },
          { label: 'Meningeal Sign', description: 'Kaku kuduk (-), Brudzinski I/II (-)' },
          { label: 'Nervus Cranialis', description: 'N. VII & XII Parese Sentral Dextra' },
          { label: 'Motorik', description: 'Lateralisasi ke kanan (Kekuatan 3/3/3)' }
        ]
      }
    ]
  },

  // KASUS 2: PEDIATRI (Pola Khusus Anak)
  {
    id: 'anak-01',
    system: 'Reproduksi', // Atau bisa buat kategori khusus 'Pediatri' jika mau dipisah dari Repro/Obsgyn
    title: 'Kejang Demam Sederhana',
    description: 'Anak usia 2 tahun datang dengan kejang kelojotan saat demam tinggi.',
    sections: [
      {
        type: 'checklist',
        title: '1. Alloanamnesis (Orang Tua)',
        items: [
          { label: 'Sapa Orang Tua', script: 'Ibu, anaknya namanya siapa?' }
        ]
      },
      {
        type: 'standard_anamnesis',
        title: '2. Riwayat Penyakit Sekarang',
        data: {
          keluhan_utama: 'Kejang 1x durasi < 5 menit',
          rps: ['Demam tinggi sejak kemarin', 'Batuk pilek (+)', 'Kejang seluruh tubuh', 'Setelah kejang menangis sadar'],
          rpd: ['Pernah kejang demam usia 1 tahun'],
          rpk: ['Ayah riwayat kejang demam (+)']
        }
      },
      {
        type: 'pediatric_history', // <--- LEGO KHUSUS ANAK
        title: '3. Riwayat Kehamilan & Tumbuh Kembang',
        data: {
          prenatal: ['Rutin kontrol bidan', 'Sakit selama hamil (-)'],
          natal: ['Lahir spontan, ditolong bidan', 'Langsung menangis', 'BBL 3000gr'],
          postnatal: ['Imunisasi dasar lengkap sesuai usia'],
          nutrisi: ['ASI Eksklusif 6 bulan', 'Makan lahap'],
          script: '"Bu, dulu waktu hamil ada masalah tidak? Lahirnya lancar? Imunisasinya lengkap?"'
        }
      }
    ]
  },

  // KASUS 3: PSIKIATRI (Pola Khusus Jiwa)
  {
    id: 'jiwa-01',
    system: 'Psikiatri',
    title: 'Skizofrenia Paranoid',
    description: 'Pasien laki-laki muda dibawa keluarga karena mengamuk dan bicara sendiri.',
    sections: [
      {
        type: 'checklist',
        title: '1. Bina Rapport',
        items: [
          { label: 'Sikap Empati', script: 'Halo Mas, saya dokter Imam. Mas tampak tegang, ada yang bisa diceritakan?', isCritical: true }
        ]
      },
      {
        type: 'psychiatry_status', // <--- LEGO KHUSUS JIWA
        title: '2. Status Mental',
        data: {
          penampilan: ['Rawat diri kurang', 'Mata melotot/curiga'],
          mood_afek: ['Afek Tumpul/Datar', 'Mood Iritabel'],
          pembicaraan: ['Logorrhea (banyak bicara)', 'Inkoheren'],
          persepsi: ['Halusinasi Auditorik (Bisikan ancaman)'],
          pikiran: ['Waham Kejar (+)', 'Waham Kebesaran (-)'],
          tilikan: 'Tilikan 1 (Merasa tidak sakit)',
          script: '"Apakah Mas mendengar suara bisikan yang orang lain tidak dengar?"'
        }
      }
    ]
  }
];