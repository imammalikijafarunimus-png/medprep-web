import type { CaseStudy } from '../osce_data';

export const casesPsikiatri: CaseStudy[] = [
  {
    id: "psik_skizofrenia",
    title: "Skizofrenia Paranoid (F20.0)",
    system: "Psikiatri",
    level_skdi: "4A",
    frequency: 5,
    summary: "Pasien muda dibawa keluarga karena marah-marah, bicara sendiri, dan curiga berlebihan.",
    content: {
      anamnesis: {
        keluhan_utama: "Marah-marah tanpa sebab / Bicara sendiri",
        list_pertanyaan: [
          "Sejak kapan? (>1 bulan = Skizofrenia).",
          "Apakah mendengar bisikan? (Halusinasi Auditorik).",
          "Apakah merasa dikejar-kejar/dimata-matai? (Waham Kejar).",
          "Apakah merasa ada yang menyisipkan pikiran? (Waham Insert).",
          "Pernah memakai narkoba? (Singkirkan Psikosis Akibat Zat).",
          "Masih bisa kerja/kuliah? (Penurunan fungsi peran)."
        ]
      },
      pemeriksaan_fisik: [
        "Status Internus & Neurologis: Biasanya NORMAL (untuk menyingkirkan penyebab organik).",
        "Status Mental:",
        "- Persepsi: Halusinasi auditorik (+).",
        "- Isi Pikir: Waham persekutorik/curiga (+).",
        "- Afek: Terbatas/Tumpul (Gejala negatif).",
        "- Tilikan: Derajat 1 (Sakit total/menyangkal)."
      ],
      diagnosis: {
        working_diagnosis: "Skizofrenia Paranoid (F20.0)",
        differential_diagnosis: ["Gangguan Waham Menetap", "Skizoafektif", "Psikosis Akibat Zat"],
        penunjang: ["PANSS Score (Untuk evaluasi)", "Urinalisis (Tes Narkoba)"],
        gold_standard: "Klinis (PPDGJ-III / DSM-5)"
      },
      tatalaksana: {
        farmakologi: [
          "R/ Risperidone tab 2 mg No. XX",
          "S 2 dd tab 1 (Pagi-Malam)",
          "ATAU",
          "R/ Haloperidol tab 1.5 mg No. XX",
          "S 2 dd tab 1",
          "R/ Trihexyphenidyl (THP) tab 2 mg No. X (Cegah EPS)",
          "S 2 dd tab 1"
        ],
        non_farmakologi: [
          "Edukasi keluarga: Minum obat seumur hidup/jangka panjang.",
          "Awasi efek samping kaku-kaku (EPS).",
          "Kontrol rutin ke Sp.KJ."
        ]
      },
      osce_tip: "Kunci Diagnosis: Gejala > 1 bulan + Halusinasi/Waham menonjol + Penurunan Fungsi. Jangan lupa cek Tilikan!"
    }
  },
  {
    id: "psik_depresi",
    title: "Gangguan Depresi Mayor",
    system: "Psikiatri",
    level_skdi: "3A",
    frequency: 4,
    summary: "Murung, tidak bersemangat, ingin bunuh diri, > 2 minggu.",
    content: {
      anamnesis: {
        keluhan_utama: "Sedih berkepanjangan / Hilang minat",
        list_pertanyaan: [
          "3 Gejala Utama: Sedih/Murung? Hilang Minat (Anhedonia)? Mudah Lelah (Anergia)?",
          "Durasi > 2 minggu?",
          "Gangguan tidur (Insomnia)? Gangguan makan (Nafsu makan turun)?",
          "Ada ide bunuh diri? (PENTING untuk kegawatdaruratan).",
          "Ada riwayat bipolar (senang berlebihan) sebelumnya?"
        ]
      },
      pemeriksaan_fisik: [
        "Penampilan: Tampak lusuh, wajah sedih (hipomimik), kontak mata kurang.",
        "Psikomotor: Retardasi (lambat).",
        "Mood: Hipotimik/Depresif.",
        "Afek: Depresif."
      ],
      diagnosis: {
        working_diagnosis: "Episode Depresi Berat dengan/tanpa Gejala Psikotik",
        differential_diagnosis: ["Gangguan Bipolar (Episode Depresi)", "Distimia (Depresi ringan > 2 tahun)"],
        penunjang: ["HDRS (Hamilton Depression Rating Scale)"],
        gold_standard: "Klinis"
      },
      tatalaksana: {
        farmakologi: [
          "R/ Fluoxetine caps 10 mg No. X",
          "S 1 dd caps 1 (pagi hari)",
          "ATAU",
          "R/ Amitriptilin tab 25 mg No. X (Jika insomnia menonjol)",
          "S 1 dd tab 1 (malam hari)"
        ],
        non_farmakologi: [
          "Psikoterapi Suportif (Dengarkan keluhan).",
          "CBT (Cognitive Behavioral Therapy).",
          "Aktivitas fisik ringan (olahraga)."
        ]
      },
      osce_tip: "Hati-hati, jika ada Ide Bunuh Diri = KEGAWATAN PSIKIATRI. Pasien tidak boleh pulang, harus rawat inap/pengawasan ketat."
    }
  }
];