import type { CaseStudy } from '../osce_data';

export const casesTHT: CaseStudy[] = [
  {
    id: "tht_epistaksis",
    title: "Epistaksis Anterior (Mimisan)",
    system: "Indra (THT)",
    level_skdi: "4A",
    frequency: 5,
    summary: "Pasien datang dengan perdarahan dari hidung yang tidak berhenti.",
    content: {
      anamnesis: {
        keluhan_utama: "Keluar darah dari hidung",
        list_pertanyaan: [
          "Darah keluar dari satu atau dua lubang?",
          "Darah menetes atau mengalir deras?",
          "Ada riwayat trauma (terpukul/mengorek hidung)?",
          "Riwayat Hipertensi? (Penting pada lansia/Epistaksis Posterior)",
          "Riwayat gangguan pembekuan darah?"
        ]
      },
      pemeriksaan_fisik: [
        "Rinoskopi Anterior: Tampak sumber perdarahan di Plexus Kiesselbach (Anterior).",
        "Tanda Vital: Cek Tensi (Hipertensi?) dan Nadi (Syok?).",
        "Tenggorok: Pastikan tidak ada darah mengalir di dinding faring posterior (Post-nasal drip)."
      ],
      diagnosis: {
        working_diagnosis: "Epistaksis Anterior et causa Trauma/Idiopatik",
        differential_diagnosis: ["Epistaksis Posterior (Biasanya hipertensi/arteri sphenopalatina)", "Hemofilia/ITP"],
        penunjang: ["Darah Rutin (Trombosit)", "Bleeding Time / Clotting Time"],
        gold_standard: "Klinis & Rinoskopi"
      },
      tatalaksana: {
        farmakologi: [
          "R/ Adrenalin 1:10.000 amp No. I (Untuk tampon)",
          "S Pro tampon (Medical Use)",
          "R/ Asam Traneksamat tab 500 mg No. X",
          "S 3 dd tab 1",
          "R/ Amoxicillin tab 500 mg No. XV (Jika pasang tampon > 24 jam)",
          "S 3 dd tab 1"
        ],
        non_farmakologi: [
          "Metode Trotter: Pencet cuping hidung 10-15 menit, posisi duduk menunduk.",
          "Pasang Tampon Anterior (Kapas + Adrenalin/Lidocain) jika tekan langsung gagal.",
          "Kompres dingin pada pangkal hidung."
        ]
      },
      osce_tip: "Ingat urutan: 1. Tekan cuping hidung (Trotter) -> 2. Tampon Anterior (Adrenalin) -> 3. Tampon Posterior (Bellocq - Rujuk). Jangan suruh pasien mendongak!"
    }
  },
  {
    id: "tht_oma",
    title: "Otitis Media Akut (OMA)",
    system: "Indra (THT)",
    level_skdi: "4A",
    frequency: 5,
    summary: "Anak demam dan nyeri telinga hebat, atau keluar cairan nanah.",
    content: {
      anamnesis: {
        keluhan_utama: "Nyeri Telinga / Keluar Cairan",
        list_pertanyaan: [
          "Apakah ada batuk pilek sebelumnya? (ISPA)",
          "Nyeri telinga hebat? (Stadium Supurasi)",
          "Telinga terasa penuh/pendengaran berkurang? (Stadium Oklusi/Eksudasi)",
          "Tiba-tiba nyeri hilang tapi keluar cairan? (Stadium Perforasi)"
        ]
      },
      pemeriksaan_fisik: [
        "Otoskopi (PENTING!):",
        "- Stadium Oklusi: Retraksi membran timpani.",
        "- Stadium Hiperemis: MT merah, refleks cahaya hilang.",
        "- Stadium Supurasi: MT Bulging (menonjol), nyeri hebat.",
        "- Stadium Perforasi: Tampak lubang (perforasi) + sekret pulsasi."
      ],
      diagnosis: {
        working_diagnosis: "Otitis Media Akut (OMA) Stadium ... (Sebutkan stadiumnya!)",
        differential_diagnosis: ["Otitis Eksterna (Nyeri tarik aurikula +)", "OMSK (Kronis > 2 bulan)"],
        penunjang: ["Tidak rutin"],
        gold_standard: "Otoskopi"
      },
      tatalaksana: {
        farmakologi: [
          "R/ Amoxicillin syr 125mg/5ml fl No. I",
          "S 3 dd cth I (Antibiotik Lini 1)",
          "R/ Paracetamol syr 120mg/5ml fl No. I",
          "S 3 dd cth I (Analgesik/Antipiretik)",
          "R/ Efedrin 1% nasal drop fl No. I (Dekongestan - Std Oklusi)",
          "S 3 dd gtt II (hidung kanan/kiri)",
          "R/ H2O2 3% liq fl No. I (Cuci telinga - Std Perforasi)",
          "S 2 dd gtt X AD/AS (diamkan 5 menit, bersihkan)"
        ],
        non_farmakologi: [
          "Jangan kemasukan air.",
          "Obati batuk pileknya.",
          "Jika Bulging -> Rujuk untuk Miringotomi."
        ]
      },
      osce_tip: "Diagnosis OMA WAJIB sebutkan stadiumnya (Oklusi/Hiperemis/Supurasi/Perforasi/Resolusi) karena terapinya beda-beda."
    }
  },
  {
    id: "tht_serumen",
    title: "Serumen Prop (Kotoran Telinga)",
    system: "Indra (THT)",
    level_skdi: "4A",
    frequency: 4,
    summary: "Telinga terasa penuh, pendengaran berkurang, mendadak tuli setelah berenang.",
    content: {
      anamnesis: {
        keluhan_utama: "Telinga tersumbat / Pendengaran berkurang",
        list_pertanyaan: [
          "Apakah habis kemasukan air/berenang? (Serumen mengembang)",
          "Sering mengorek telinga dengan cotton bud? (Serumen terdorong ke dalam)",
          "Ada nyeri atau berdenging (tinnitus)?"
        ]
      },
      pemeriksaan_fisik: [
        "Otoskopi: Tampak massa kecoklatan/hitam menutupi liang telinga (CAE).",
        "Tes Garpu Tala: Rinne Negatif (Tuli Konduktif), Weber lateralisasi ke telinga sakit."
      ],
      diagnosis: {
        working_diagnosis: "Serumen Prop (Impaksi Serumen) AD/AS",
        differential_diagnosis: ["Benda Asing (Corpus Alienum)", "Otitis Eksterna"],
        penunjang: ["Tes Penala"],
        gold_standard: "Otoskopi"
      },
      tatalaksana: {
        farmakologi: [
          "R/ Karbogliserin 10% ear drop fl No. I",
          "S 3 dd gtt III AD/AS (Selama 3 hari untuk melunakkan)",
          "ATAU",
          "R/ Fenol Gliserin ear drop fl No. I",
          "S 3 dd gtt III"
        ],
        non_farmakologi: [
          "Ekstraksi Serumen (Jika lunak): Irigasi dengan air hangat (sesuai suhu tubuh) atau Suction.",
          "Ekstraksi Serumen (Jika keras): Pakai hak (hook) atau sendok serumen (spoon).",
          "Edukasi: Hindari cotton bud!"
        ]
      },
      osce_tip: "Jangan lakukan irigasi jika ada riwayat Perforasi Membran Timpani! Gunakan hook/spoon saja."
    }
  }
];