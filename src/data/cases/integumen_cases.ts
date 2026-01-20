import type { CaseStudy } from '../osce_data';

export const casesIntegumen: CaseStudy[] = [
  {
    id: "kulit_tinea",
    title: "Tinea Corporis/Cruris (Jamur)",
    system: "Integumen",
    level_skdi: "4A",
    frequency: 5,
    summary: "Bercak merah gatal, tepi aktif (lebih merah), tengah menyembuh (central healing).",
    content: {
      anamnesis: {
        keluhan_utama: "Bercak merah gatal di badan/selangkangan",
        list_pertanyaan: [
          "Gatal bertambah saat berkeringat?",
          "Awalnya kecil lalu melebar?",
          "Sering pakai baju ketat/lembab?",
          "Teman serumah/asrama ada yang sakit sama?"
        ]
      },
      pemeriksaan_fisik: [
        "Efloresensi (Deskripsi Lesi):",
        "Makula eritematosa (merah) berbatas tegas, dengan tepi aktif (papul/vesikel di pinggir) dan central healing (tengah lebih pucat).",
        "Skuama (sisik) halus."
      ],
      diagnosis: {
        working_diagnosis: "Tinea Corporis (Badan) / Tinea Cruris (Selangkangan)",
        differential_diagnosis: ["Pityriasis Rosea (Herald patch)", "Dermatitis Numularis (Bentuk koin, basah)", "Candidiasis (Lesi satelit)"],
        penunjang: ["Kerokan Kulit dengan KOH 10-20%"],
        gold_standard: "KOH (Hifa Panjang Bersekat)"
      },
      tatalaksana: {
        farmakologi: [
          "Topikal (Lini 1):",
          "R/ Ketoconazole 2% cream tube No. II",
          "S 2 dd app loc dol (oles di tempat sakit + 2cm ke luar) a.m et p.m",
          "",
          "Sistemik (Jika luas/bandel):",
          "R/ Ketoconazole tab 200 mg No. X",
          "S 1 dd tab 1",
          "R/ Cetirizine tab 10 mg No. X (Anti gatal)",
          "S 1 dd tab 1"
        ],
        non_farmakologi: [
          "Jaga area tetap kering.",
          "Ganti baju jika berkeringat.",
          "Jangan tukar-tukan handuk.",
          "Lanjutkan obat krim sampai 1-2 minggu SETELAH sembuh (cegah kambuh)."
        ]
      },
      osce_tip: "Kata kunci: 'Central Healing' dan 'Gatal saat berkeringat'. Pada resep krim, tulis 'oleskan sampai 2 cm di luar batas lesi' agar tuntas."
    }
  },
  {
    id: "kulit_scabies",
    title: "Scabies (Kudis)",
    system: "Integumen",
    level_skdi: "4A",
    frequency: 5,
    summary: "Gatal hebat malam hari, menyerang sekelompok orang (asrama/pesantren), sela jari.",
    content: {
      anamnesis: {
        keluhan_utama: "Gatal seluruh tubuh terutama sela jari",
        list_pertanyaan: [
          "Gatal memberat saat malam hari? (Pruritus nokturna)",
          "Teman sekamar/keluarga gatal juga?",
          "Lokasi gatal di sela jari, pergelangan tangan, pusar, atau area genital?",
          "Tinggal di asrama/pesantren?"
        ]
      },
      pemeriksaan_fisik: [
        "Efloresensi:",
        "Papul eritematosa, ekskoriasi (bekas garukan), krusta.",
        "Khas: Kunikulus (Terowongan) putih keabuan berkelok (jarang terlihat jelas).",
        "Predileksi: Sela jari tangan, fleksor pergelangan, umbilikus, bokong, genitalia pria."
      ],
      diagnosis: {
        working_diagnosis: "Scabies",
        differential_diagnosis: ["Prurigo", "Pediculosis Corporis", "Dermatitis Atopik"],
        penunjang: ["Kerokan kulit / Tes Tinta (Burrow Ink Test)"],
        gold_standard: "Ditemukan Tungau/Telur Sarcoptes scabiei"
      },
      tatalaksana: {
        farmakologi: [
          "R/ Permethrin 5% cream tube No. II (Scabimite)",
          "S ue (oleskan seluruh tubuh dari leher ke bawah, diamkan 8-10 jam, bilas)",
          "Pakai malam hari, cuci pagi hari. Diulang 1 minggu lagi.",
          "",
          "R/ Cetirizine tab 10 mg No. X",
          "S 1 dd tab 1 (malam)"
        ],
        non_farmakologi: [
          "WAJIB obati seluruh penghuni rumah/kamar (meski tidak gatal).",
          "Cuci baju/sprei dengan air panas (>60C) atau rendam air panas.",
          "Jemur kasur/bantal di bawah matahari.",
          "Barang yg tak bisa dicuci, masukkan plastik tertutup rapat selama 3 hari."
        ]
      },
      osce_tip: "Kardinal Sign (4 Tanda): 1. Gatal malam, 2. Menyerang kelompok, 3. Terowongan, 4. Ditemukan tungau. (Minimal 2 tanda = Diagnosis Tegak)."
    }
  },
  {
    id: "kulit_varicella",
    title: "Varicella (Cacar Air)",
    system: "Integumen",
    level_skdi: "4A",
    frequency: 4,
    summary: "Demam, muncul lenting isi air (vesikel) menyebar dari badan ke wajah/kaki.",
    content: {
      anamnesis: {
        keluhan_utama: "Demam dan muncul lenting berair",
        list_pertanyaan: [
          "Lenting muncul dari mana dulu? (Badan -> Wajah/Ekstremitas = Sentrifugal).",
          "Apakah gatal?",
          "Ada demam sebelumnya?",
          "Belum pernah cacar sebelumnya?"
        ]
      },
      pemeriksaan_fisik: [
        "Efloresensi: Polimorfik (Bermacam-macam bentuk dalam satu waktu).",
        "Ada Papul, Vesikel (Tear drop / Dew drop on rose petal), Pustul, dan Krusta secara bersamaan.",
        "Penyebaran sentrifugal (pusat di badan)."
      ],
      diagnosis: {
        working_diagnosis: "Varicella Zoster (Cacar Air)",
        differential_diagnosis: ["Variola (Cacar monyet/Smallpox - monomorfik)", "Herpes Zoster (Sesuai dermatom/sebelah badan)", "Impetigo Bulosa"],
        penunjang: ["Tzanck Test (Sel Datia Berinti Banyak)"],
        gold_standard: "PCR / Kultur Virus (Jarang)"
      },
      tatalaksana: {
        farmakologi: [
          "R/ Acyclovir tab 800 mg No. XXV (Dewasa)",
          "S 5 dd tab 1 (Tiap 4 jam, selama 7 hari) -> Dosis 5x800mg PENTING!",
          "R/ Paracetamol tab 500 mg No. X",
          "S 3 dd tab 1 (demam)",
          "R/ Bedak Salisil 2% (Untuk gatal/keringkan lesi)",
          "S ue 2 dd"
        ],
        non_farmakologi: [
          "Isolasi di rumah sampai semua lenting kering (menjadi koreng/krusta).",
          "Jangan digaruk (cegah bekas/bopeng).",
          "Potong kuku pendek.",
          "Mandi tetap boleh (air hangat, jangan digosok keras)."
        ]
      },
      osce_tip: "Hafalkan dosis Acyclovir Varicella Dewasa: 5 x 800 mg (Dosis besar!). Beda dengan Herpes Zoster (5x800mg) dan Herpes Simpleks (5x200mg)."
    }
  }
];