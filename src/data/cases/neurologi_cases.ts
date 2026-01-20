import type { CaseStudy } from '../osce_data';

export const casesNeurologi: CaseStudy[] = [
  {
    id: "neuro_kejang_demam",
    title: "Kejang Demam (Simpleks/Kompleks)",
    system: "Neurologi",
    level_skdi: "4A",
    frequency: 5,
    summary: "Anak kejang saat demam, tidak ada riwayat epilepsi atau infeksi intrakranial.",
    content: {
      anamnesis: {
        keluhan_utama: "Kejang disertai Demam",
        list_pertanyaan: [
          "Berapa lama kejangnya? (>15 menit = Kompleks)",
          "Kejang seluruh tubuh atau sebagian? (Fokal = Kompleks)",
          "Setelah kejang sadar atau tidak?",
          "Apakah kejang berulang dalam 24 jam?",
          "Suhu tubuh sebelum kejang berapa?",
          "Ada batuk pilek / diare sebelumnya? (Cari fokus infeksi)"
        ]
      },
      pemeriksaan_fisik: [
        "Suhu: Febris (>38 C).",
        "Kaku Kuduk: NEGATIF (Wajib cek untuk singkirkan Meningitis).",
        "Refleks Patologis: Negatif.",
        "Status Neurologis lain: Dalam batas normal pasca kejang."
      ],
      diagnosis: {
        working_diagnosis: "Kejang Demam Simpleks (KDS) atau Kompleks (KDK)",
        differential_diagnosis: ["Meningitis", "Ensefalitis", "Epilepsi yang diprovokasi demam"],
        penunjang: [
          "Darah Rutin (Leukositosis?)",
          "Gula Darah Sewaktu (Singkirkan hipoglikemia)",
          "Lumbal Pungsi (JIKA ada tanda kaku kuduk / <12 bulan)"
        ],
        gold_standard: "Klinis (EEG tidak rutin)"
      },
      tatalaksana: {
        farmakologi: [
          "Saat Kejang (Pre-Hospital/Di Rumah):",
          "R/ Diazepam rectal tube 5mg No. I (BB <10kg)",
          "R/ Diazepam rectal tube 10mg No. I (BB >10kg)",
          "S prn kejang (masukkan lewat anus)",
          "",
          "Saat Demam:",
          "R/ Paracetamol syr 120mg/5ml fl No. I",
          "S 3 dd cth I (10-15mg/kgBB/kali)"
        ],
        non_farmakologi: [
          "Kompres air hangat.",
          "Jangan masukkan sendok/kopi ke mulut saat kejang.",
          "Miringkan posisi anak agar tidak tersedak.",
          "Sedia obat kejang rectal di rumah."
        ]
      },
      osce_tip: "Wajib bedakan KDS vs KDK. KDS: <15 menit, Umum, 1x/24jam. KDK: >15 menit, Fokal, >1x/24jam. Jangan lupa cek Kaku Kuduk!"
    }
  },
  {
    id: "neuro_stroke",
    title: "Stroke (Iskemik & Hemoragik)",
    system: "Neurologi",
    level_skdi: "3B/4A",
    frequency: 5,
    summary: "Defisit neurologis mendadak (Hemiparese, Bicara pelo).",
    content: {
      anamnesis: {
        keluhan_utama: "Lemah separuh badan mendadak",
        list_pertanyaan: [
          "Kapan kejadiannya? (Onset <4.5 jam penting untuk trombolisis)",
          "Sedang aktivitas atau istirahat? (Aktif = Hemoragik, Istirahat = Iskemik)",
          "Ada nyeri kepala hebat / muntah? (Tanda TIK meningkat -> Hemoragik)",
          "Riwayat Hipertensi/DM/Jantung?",
          "Apakah bicara jadi pelo / tidak mengerti bahasa?"
        ]
      },
      pemeriksaan_fisik: [
        "Tensi: Seringkali Hipertensi (Emergency Hypertension).",
        "Nervus Cranialis: Parese N.VII (Wajah merot) & N.XII (Lidah deviasi) Sentral.",
        "Motorik: Hemiparese (Kekuatan 0-4).",
        "Refleks: Fisiologis meningkat, Patologis (Babinski) Positif."
      ],
      diagnosis: {
        working_diagnosis: "Stroke Hemoragik / Stroke Non-Hemoragik (Iskemik)",
        differential_diagnosis: ["Tumor Otak", "Abses Otak", "Bells Palsy (Jika wajah saja)"],
        penunjang: [
          "CT Scan Kepala Non-Kontras (Gold Standard).",
          "EKG (Cari Atrial Fibrilasi).",
          "GDS, Elektrolit."
        ],
        gold_standard: "CT Scan Kepala"
      },
      tatalaksana: {
        farmakologi: [
          "Oksigenasi & Pasang IV Line (NaCl 0.9%).",
          "Manajemen Tensi (Nikardipin/Diltiazem) jika >220/120 (Iskemik) atau >180 (Hemoragik).",
          "Antiplatelet (Aspirin/Clopidogrel) HANYA jika CT Scan = Iskemik.",
          "Mannitol (Jika ada tanda TIK meningkat)."
        ],
        non_farmakologi: [
          "Head up 30 derajat.",
          "Rujuk segera ke RS dengan fasilitas CT Scan & Neurolog.",
          "Edukasi keluarga tentang Golden Period."
        ]
      },
      osce_tip: "Gunakan Siriraj Score jika tidak ada CT Scan di soal OSCE. Rumus: (2.5 x Kesadaran) + (2 x Muntah) + (2 x Nyeri Kepala) + (0.1 x Diastol) - (3 x Atheroma) - 12. >1 = Perdarahan. <-1 = Iskemik."
    }
  },
  {
    id: "neuro_hnp",
    title: "HNP (Hernia Nucleus Pulposus)",
    system: "Neurologi",
    level_skdi: "3B",
    frequency: 4,
    summary: "Nyeri pinggang menjalar sampai kaki (Ischialgia).",
    content: {
      anamnesis: {
        keluhan_utama: "Nyeri pinggang menjalar ke kaki",
        list_pertanyaan: [
          "Nyeri menjalar seperti setrum?",
          "Bertambah nyeri saat batuk/mengejan/bungkuk?",
          "Ada kesemutan/baal di kaki?",
          "Pekerjaan sering angkat berat?"
        ]
      },
      pemeriksaan_fisik: [
        "Inspeksi: Cara berjalan pincang (antalgic gait).",
        "Provokasi Nyeri: Laseque Sign (+) < 60 derajat.",
        "Patrick & Contra-Patrick (Menyingkirkan masalah sendi panggul).",
        "Sensoris: Hipestesi sesuai dermatom (L4/L5/S1)."
      ],
      diagnosis: {
        working_diagnosis: "HNP Lumbal",
        differential_diagnosis: ["Spondilolistesis", "Canal Stenosis", "Tumor Medula Spinalis"],
        penunjang: ["MRI Lumbal (Gold Standard)"],
        gold_standard: "MRI"
      },
      tatalaksana: {
        farmakologi: [
          "R/ Na Diclofenac tab 50 mg No. X",
          "S 2 dd tab 1 pc",
          "R/ Gabapentin caps 300 mg No. X (Untuk nyeri neuropatik)",
          "S 1 dd caps 1 (malam)",
          "R/ Eperisone tab 50 mg No. X (Muscle relaxant)",
          "S 3 dd tab 1"
        ],
        non_farmakologi: [
          "Hindari angkat beban berat.",
          "Tidur di alas keras (kasur ortopedi).",
          "Fisioterapi / Berenang."
        ]
      },
      osce_tip: "Jangan lupa tes Laseque! Kalau Laseque (+) kemungkinan besar HNP. Kalau Patrick (+) kemungkinan masalah sendi Hip."
    }
  },
  {
    id: "neuro_bells",
    title: "Bell's Palsy",
    system: "Neurologi",
    level_skdi: "4A",
    frequency: 4,
    summary: "Wajah mencong sesisi, mata sulit menutup, dahi tidak berkerut.",
    content: {
      anamnesis: {
        keluhan_utama: "Wajah mencong / Mulut perot",
        list_pertanyaan: [
          "Mata terasa pedih/berair? (Lagopthalmos)",
          "Telinga berdenging / Nyeri belakang telinga?",
          "Rasa lidah berkurang?",
          "Tangan/Kaki lemah? (PENTING untuk singkirkan Stroke)"
        ]
      },
      pemeriksaan_fisik: [
        "Nervus VII Perifer:",
        "- Dahi: Tidak bisa mengerut (lipatan hilang).",
        "- Mata: Tidak bisa menutup rapat (Lagopthalmos).",
        "- Mulut: Senyum tertinggal, kembung pipi bocor.",
        "Motorik Ekstremitas: Normal (5555). Ini yang membedakan dengan Stroke!"
      ],
      diagnosis: {
        working_diagnosis: "Bell's Palsy (Parese N.VII Perifer Idiopatik)",
        differential_diagnosis: ["Stroke (Parese N.VII Sentral - Dahi bisa kerut)", "Ramsay Hunt Syndrome (Ada vesikel di telinga)", "Tumor CPA"],
        penunjang: ["Tidak rutin (Diagnosis Klinis)"],
        gold_standard: "Klinis"
      },
      tatalaksana: {
        farmakologi: [
          "R/ Prednison tab 5 mg (Dosis 60mg/hari tap off) No. XX",
          "S 3 dd tab 4 (pagi-siang-sore)",
          "R/ Acyclovir tab 400 mg No. XXV (Jika curiga virus)",
          "S 5 dd tab 1",
          "R/ Cendo Lyteers ED fl No. I (Artificial tears)",
          "S 4 dd gtt I OD/OS (mata yang sakit)"
        ],
        non_farmakologi: [
          "Fisioterapi wajah (latihan senyum, siul, kerut dahi).",
          "Pakai kacamata hitam/plester mata saat tidur (mencegah mata kering).",
          "Jangan kena angin langsung (kipas/AC)."
        ]
      },
      osce_tip: "Kunci: Cek Dahi! Kalau dahi KANAN KIRI bisa berkerut tapi mulut mencong = STROKE. Kalau dahi sisi sakit TIDAK bisa berkerut = BELL'S PALSY."
    }
  }
];