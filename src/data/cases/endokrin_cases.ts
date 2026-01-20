import type { CaseStudy } from '../osce_data';

export const casesEndokrin: CaseStudy[] = [
  {
    id: "endo_dm2",
    title: "Diabetes Mellitus Tipe 2",
    system: "Endokrin",
    level_skdi: "4A",
    frequency: 5,
    summary: "Poliuria, Polidipsi, Polifagia, Gula darah puasa > 126.",
    content: {
      anamnesis: {
        keluhan_utama: "Sering kencing / Cepat haus",
        list_pertanyaan: [
          "Sering kencing malam hari? (Poliuria)",
          "Cepat haus? (Polidipsi) Cepat lapar? (Polifagia)",
          "Berat badan turun drastis?",
          "Ada kesemutan/luka susah sembuh?",
          "Riwayat DM di keluarga?"
        ]
      },
      pemeriksaan_fisik: [
        "BMI: Biasanya Overweight/Obesitas.",
        "Kaki: Cek ulkus/luka, cek sensitivitas (monofilamen).",
        "Acanthosis Nigricans: Lipatan leher hitam (tanda resistensi insulin)."
      ],
      diagnosis: {
        working_diagnosis: "Diabetes Mellitus Tipe 2 (Tanpa Komplikasi / Dengan Neuropati)",
        differential_diagnosis: ["Diabetes Insipidus", "DM Tipe 1 (Biasanya usia muda/kurus)"],
        penunjang: ["GDP > 126 mg/dL", "GDS > 200 mg/dL + Gejala Klasik", "HbA1c > 6.5%"],
        gold_standard: "GDP / HbA1c"
      },
      tatalaksana: {
        farmakologi: [
          "R/ Metformin tab 500 mg No. XXX (Lini 1 - Sesudah makan)",
          "S 3 dd tab 1 (Dosis bertahap, mulai 1x1 dulu)",
          "R/ Glimepiride tab 2 mg No. XXX (Pemicu insulin - Sebelum makan)",
          "S 1 dd tab 1 (Pagi hari)",
          "R/ Vitamin B1 B6 B12 tab No. X (Untuk neuropati/kesemutan)",
          "S 3 dd tab 1"
        ],
        non_farmakologi: [
          "Diet 3J (Jadwal, Jumlah, Jenis).",
          "Olahraga rutin 150 menit/minggu.",
          "Perawatan kaki (pakai alas kaki, hindari luka)."
        ]
      },
      osce_tip: "Metformin diminum SETELAH makan (cegah mual). Glimepiride/Glibenklamid diminum SEBELUM makan (cegah hipoglikemi)."
    }
  },
  {
    id: "endo_graves",
    title: "Hipertiroid (Graves Disease)",
    system: "Endokrin",
    level_skdi: "3A/4A",
    frequency: 4,
    summary: "Berdebar, tangan gemetar, mata melotot, benjolan di leher difus.",
    content: {
      anamnesis: {
        keluhan_utama: "Jantung berdebar / Berat badan turun",
        list_pertanyaan: [
          "Sering berkeringat banyak? Tidak tahan panas?",
          "Tangan gemetar (tremor)?",
          "Makan banyak tapi makin kurus?",
          "Benjolan di leher ikut bergerak saat menelan?",
          "Mata terasa menonjol?"
        ]
      },
      pemeriksaan_fisik: [
        "Mata: Eksoftalmus (menonjol), Von Grafe Sign (+).",
        "Leher: Struma Difus (Rata), kenyal, ikut bergerak menelan.",
        "Ekstremitas: Fine Tremor (Gemetar halus saat tangan diluruskan).",
        "Nadi: Takikardia (>100x/m)."
      ],
      diagnosis: {
        working_diagnosis: "Hipertiroid et causa Graves Disease",
        differential_diagnosis: ["Struma Nodusa Toksik", "Tiroiditis", "Gangguan Cemas"],
        penunjang: ["TSHs (Rendah), fT4 (Tinggi)"],
        gold_standard: "TSH & fT4"
      },
      tatalaksana: {
        farmakologi: [
          "R/ PTU (Propiltiourasil) tab 100 mg No. XXX",
          "S 3 dd tab 1 (Tiap 8 jam)",
          "R/ Propranolol tab 10 mg No. XXX (Untuk berdebar/tremor)",
          "S 3 dd tab 1"
        ],
        non_farmakologi: [
          "Istirahat cukup.",
          "Diet tinggi kalori.",
          "Rujuk ke Sp.PD untuk evaluasi jangka panjang."
        ]
      },
      osce_tip: "Trias Graves: 1. Struma Difus, 2. Eksoftalmus, 3. Hipertiroid (Berdebar/Tremor). Obat pilihan ibu hamil trimester 1 = PTU, Trimester 2-3 = Methimazole."
    }
  }
];