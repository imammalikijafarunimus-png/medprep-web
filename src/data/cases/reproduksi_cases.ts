import type { CaseStudy } from '../osce_data';

export const casesReproduksi: CaseStudy[] = [
  {
    id: "repro_anc",
    title: "ANC (Antenatal Care) Fisiologis",
    system: "Reproduksi",
    level_skdi: "4A",
    frequency: 5,
    summary: "Ibu hamil kontrol rutin. Penting hitung HPHT, Taksiran Partus, dan Status Gizi.",
    content: {
      anamnesis: {
        keluhan_utama: "Ingin periksa kehamilan",
        list_pertanyaan: [
          "Hamil ke berapa? (G..P..A..)",
          "HPHT (Hari Pertama Haid Terakhir) tanggal berapa?",
          "Gerakan janin aktif?",
          "Ada keluhan mual/pusing/pandangan kabur?",
          "Riwayat persalinan lalu (Normal/SC)?"
        ]
      },
      pemeriksaan_fisik: [
        "BB/TB & LILA (Lingkar Lengan Atas > 23.5 cm = Tidak KEK).",
        "Tensi: < 140/90 (Singkirkan preeklampsia).",
        "Leopold I-IV (TFU, Punggung, Presentasi, Masuk PAP).",
        "DJJ (Denyut Jantung Janin): Normal 120-160 dpm."
      ],
      diagnosis: {
        working_diagnosis: "G1P0A0 Hamil ... minggu, Janin Tunggal Hidup Intrauterin, Presentasi Kepala",
        differential_diagnosis: ["-"],
        penunjang: ["Hb (Anemia?)", "Golongan Darah", "Protein Urin", "HBsAg, HIV, Sifilis (Triple Eliminasi)"],
        gold_standard: "USG Obstetri"
      },
      tatalaksana: {
        farmakologi: [
          "R/ Ferro Sulfat (Tablet Tambah Darah) tab 300 mg No. XXX",
          "S 1 dd tab 1 (Malam hari, hindari teh/kopi)",
          "R/ Asam Folat tab 400 mcg No. XXX",
          "S 1 dd tab 1",
          "R/ Kalsium Laktat tab 500 mg No. XXX",
          "S 1 dd tab 1 (Pagi hari)"
        ],
        non_farmakologi: [
          "Makan bergizi seimbang.",
          "Tanda bahaya kehamilan (Pedarahan, Ketuban pecah, Kejang, Demam).",
          "Rencanakan persalinan di faskes."
        ]
      },
      osce_tip: "Rumus Naegele (Taksiran Partus): Hari +7, Bulan -3, Tahun +1. (Kalau bulan Jan-Maret: H+7, B+9, T+0)."
    }
  },
  {
    id: "repro_fluor",
    title: "Fluor Albus (Keputihan) Patologis",
    system: "Reproduksi",
    level_skdi: "4A",
    frequency: 5,
    summary: "Keputihan gatal, bau, atau berwarna.",
    content: {
      anamnesis: {
        keluhan_utama: "Keputihan",
        list_pertanyaan: [
          "Warna? (Putih susu/Kuning hijau/Abu-abu)",
          "Bau? (Amis/Apek)",
          "Gatal? Panas?",
          "Pasangan ada keluhan sama?",
          "Riwayat diabetes? Higienitas?"
        ]
      },
      pemeriksaan_fisik: [
        "Inspekulo (Spekulum):",
        "- Candidiasis: Gumpalan seperti susu basi/keju (cottage cheese), vulva merah gatal.",
        "- Bakterial Vaginosis (BV): Cairan putih abu-abu, encer, bau amis (fishy odor).",
        "- Trikomoniasis: Kuning kehijauan, berbusa, Strawberry Cervix."
      ],
      diagnosis: {
        working_diagnosis: "Candidiasis Vulvovaginalis / Bakterial Vaginosis / Trikomoniasis",
        differential_diagnosis: ["Servisitis Gonore", "Kanker Serviks"],
        penunjang: ["Whiff Test (BV + bau amis)", "Sediaan Basah (NaCl/KOH)"],
        gold_standard: "Mikroskopis"
      },
      tatalaksana: {
        farmakologi: [
          "Jika Candidiasis (Jamur):",
          "R/ Ketoconazole tab 200 mg No. X",
          "S 2 dd tab 1 (5 hari)",
          "ATAU R/ Nistatin Ovula No. I (Masukkan vagina malam hari)",
          "",
          "Jika BV / Trikomoniasis:",
          "R/ Metronidazole tab 500 mg No. XIV",
          "S 2 dd tab 1 (7 hari) (Wajib obati pasangan jika Trikomoniasis)"
        ],
        non_farmakologi: [
          "Jaga kebersihan area kewanitaan agar tetap kering.",
          "Ganti celana dalam jika lembab.",
          "Hindari sabun pembersih vagina (douching) berlebihan."
        ]
      },
      osce_tip: "Hafalkan trias klasik: Jamur = Gatal + Susu Basi. BV = Bau Amis + Encer. Trikomonas = Hijau Berbusa + Strawberry Cervix."
    }
  }
];