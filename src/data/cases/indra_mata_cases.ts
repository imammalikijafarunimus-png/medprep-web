import type { CaseStudy } from '../osce_data';

export const casesMata: CaseStudy[] = [
  {
    id: "mata_konjungtivitis",
    title: "Konjungtivitis (Mata Merah)",
    system: "Indra (Mata)",
    level_skdi: "4A",
    frequency: 5,
    summary: "Mata merah, berair/belekan, visus NORMAL.",
    content: {
      anamnesis: {
        keluhan_utama: "Mata merah",
        list_pertanyaan: [
          "Pandangan kabur? (Jika kabur = Keratitis/Glaukoma/Uveitis).",
          "Ada sekret/belek? Warna? (Kuning kental = Bakteri, Air/Putih = Virus/Alergi).",
          "Gatal? (Alergi).",
          "Mata lengket saat bangun tidur?",
          "Orang serumah sakit sama?"
        ]
      },
      pemeriksaan_fisik: [
        "Visus: 6/6 (Normal) -> Kunci diagnosis mata merah visus normal.",
        "Segmen Anterior:",
        "- Konjungtiva: Injeksi Konjungtiva (+), Injeksi Siliar (-).",
        "- Sekret: Purulen (Bakteri) atau Serous (Virus).",
        "- Kornea: Jernih (Tes Fluoresin Negatif)."
      ],
      diagnosis: {
        working_diagnosis: "Konjungtivitis Bakterial ODS",
        differential_diagnosis: ["Konjungtivitis Viral", "Konjungtivitis Alergi", "Keratitis (Visus turun)"],
        penunjang: ["Gram Sekret Mata (Jarang dilakukan di FKTP)"],
        gold_standard: "Klinis"
      },
      tatalaksana: {
        farmakologi: [
          "R/ Kloramfenikol 1% EO (Salep) tube No. I",
          "S 3 dd app OD/OS (Oles mata)",
          "ATAU",
          "R/ Levofloxacin ED (Tetes) fl No. I",
          "S 6 dd gtt I OD/OS (Tiap 4 jam)"
        ],
        non_farmakologi: [
          "Kompres dingin.",
          "Jangan kucek mata.",
          "Cuci tangan (sangat menular).",
          "Pakai kacamata hitam."
        ]
      },
      osce_tip: "Bedakan: Bakteri (Belek kuning lengket), Virus (Berair + Demam/Flu), Alergi (Gatal + Riwayat Atopi). Visus PASTI Normal."
    }
  },
  {
    id: "mata_hordeolum",
    title: "Hordeolum vs Kalazion",
    system: "Indra (Mata)",
    level_skdi: "4A",
    frequency: 4,
    summary: "Benjolan di kelopak mata. Nyeri (Hordeolum) vs Tidak Nyeri (Kalazion).",
    content: {
      anamnesis: {
        keluhan_utama: "Bintitian / Benjolan kelopak mata",
        list_pertanyaan: [
          "Nyeri atau tidak? (Nyeri = Hordeolum).",
          "Merah atau sewarna kulit?",
          "Sudah berapa lama?",
          "Sering bintitian? (Cek kacamata/kebersihan)."
        ]
      },
      pemeriksaan_fisik: [
        "Inspeksi Palpebra:",
        "- Hordeolum: Benjolan merah, ada 'pus point' (mata nanah), tanda radang (+).",
        "- Kalazion: Benjolan keras, tidak merah, tidak nyeri.",
        "Pre-aurikular node: Cek pembesaran KGB (jarang)."
      ],
      diagnosis: {
        working_diagnosis: "Hordeolum Eksternum/Internum palpebra superior/inferior",
        differential_diagnosis: ["Kalazion", "Blefaritis"],
        penunjang: ["Tidak ada"],
        gold_standard: "Klinis"
      },
      tatalaksana: {
        farmakologi: [
          "R/ Kloramfenikol salep mata tube No. I",
          "S 3 dd app OD/OS",
          "R/ Asam Mefenamat tab 500mg No. X (Jika nyeri)",
          "S 3 dd tab 1 pc"
        ],
        non_farmakologi: [
          "Kompres HANGAT 3-4x sehari (percepat matang/kempes).",
          "Jaga kebersihan kelopak mata.",
          "Jangan dipencet sendiri."
        ]
      },
      osce_tip: "Hordeolum = H = Hangat (Kompres Hangat), Hurt (Nyeri). Kalazion = K = Kronis, Keras, Kalem (Gak nyeri)."
    }
  }
];