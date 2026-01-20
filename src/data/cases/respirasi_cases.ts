import type { CaseStudy } from '../osce_data';

export const casesRespirasi: CaseStudy[] = [
  {
    id: "respi_asma",
    title: "Asma Bronkial (Serangan Akut)",
    system: "Respirasi",
    level_skdi: "4A",
    frequency: 5,
    summary: "Sesak napas episodik, bunyi mengi, riwayat atopi/alergi.",
    content: {
      anamnesis: {
        keluhan_utama: "Sesak Napas berbunyi (Mengi)",
        list_pertanyaan: [
          "Apakah sesak dipicu debu/dingin/aktivitas?",
          "Apakah bunyi 'ngik-ngik'?",
          "Sering kambuh di malam hari?",
          "Ada riwayat alergi di keluarga?",
          "Sudah pakai obat semprot (inhaler) di rumah?"
        ]
      },
      pemeriksaan_fisik: [
        "Inspeksi: Sesak, retraksi sela iga, napas cuping hidung.",
        "Auskultasi: Wheezing (+) pada ekspirasi di seluruh lapang paru.",
        "Ekspirasi memanjang."
      ],
      diagnosis: {
        working_diagnosis: "Asma Bronkial Serangan Akut Ringan/Sedang/Berat",
        differential_diagnosis: ["PPOK Eksaserbasi (Usia tua, perokok)", "Gagal Jantung Kiri (Asma Kardiale)"],
        penunjang: ["Spirometri (PEFR)", "Foto Thorax (Hiperinflasi)"],
        gold_standard: "Spirometri (Reversibilitas > 12%)"
      },
      tatalaksana: {
        farmakologi: [
          "Nebulisasi (UGD):",
          "R/ Ventolin (Salbutamol) nebules 2.5mg No. I",
          "S Pro nebulisasi (Boleh diulang 2-3x per 20 menit)",
          "Pulang:",
          "R/ Salbutamol tab 4 mg No. X",
          "S 3 dd tab 1",
          "R/ Dexamethasone tab 0.5 mg No. X",
          "S 3 dd tab 1"
        ],
        non_farmakologi: [
          "Posisi setengah duduk (Semi-Fowler).",
          "Oksigenasi 2-4 lpm kanul nasal.",
          "Hindari pencetus (debu, dingin, asap rokok)."
        ]
      },
      osce_tip: "Tentukan derajat serangan (Ringan: Bicara kalimat, Sedang: Penggal kalimat, Berat: Kata-kata). Terapi utama UGD: Oksigen + Nebulisasi SABA."
    }
  },
  {
    id: "respi_tb",
    title: "Tuberkulosis (TB) Paru",
    system: "Respirasi",
    level_skdi: "4A",
    frequency: 5,
    summary: "Batuk > 2 minggu, batuk darah, keringat malam, BB turun.",
    content: {
      anamnesis: {
        keluhan_utama: "Batuk lama (> 2 minggu)",
        list_pertanyaan: [
          "Batuk berdahak atau darah?",
          "Demam sumer-sumer (tidak tinggi)?",
          "Keringat malam tanpa aktivitas?",
          "Berat badan turun drastis?",
          "Ada kontak dengan penderita TB/Minum obat 6 bulan?"
        ]
      },
      pemeriksaan_fisik: [
        "Inspeksi: Badan kurus (kaheksia).",
        "Auskultasi: Suara napas Bronkial atau Ronkhi basah kasar di apeks (paru atas).",
        "Perkusi: Redup di apeks."
      ],
      diagnosis: {
        working_diagnosis: "TB Paru Kasus Baru / Kambuh / Putus Obat",
        differential_diagnosis: ["Bronkiektasis", "Pneumonia", "Ca Paru"],
        penunjang: ["BTA Sputum SPS (Sewaktu-Pagi-Sewaktu)", "Foto Thorax PA (Infiltrat di apeks)", "Tes Cepat Molekuler (TCM/GeneXpert)"],
        gold_standard: "BTA (+) atau TCM (+)"
      },
      tatalaksana: {
        farmakologi: [
          "Fase Intensif (2 bulan):",
          "R/ OAT FDC Kategori 1 (RHZE) tab No. LX (Sesuai BB)",
          "S 1 dd tab 3 (Minum pagi saat perut kosong)",
          "R/ Vitamin B6 (Pyridoxine) tab 10 mg No. LX",
          "S 1 dd tab 1 (Cegah neuropati)"
        ],
        non_farmakologi: [
          "Etika batuk (pakai masker).",
          "Ventilasi rumah harus bagus (buka jendela).",
          "Makan bergizi tinggi protein (TKTP).",
          "Wajib kontrol dahak bulan ke-2, 5, dan 6."
        ]
      },
      osce_tip: "Hafalkan dosis OAT FDC! BB 38-54kg = 3 tablet. BB 55-70kg = 4 tablet. Efek samping: Rifampisin (Kencing merah), INH (Kesemutan), Pirazinamid (Asam urat), Etambutol (Mata kabur)."
    }
  }
];