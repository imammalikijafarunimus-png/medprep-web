import type { CaseStudy } from '../osce_data';

export const casesKardio: CaseStudy[] = [
  {
    id: "kardio_hipertensi",
    title: "Hipertensi Esensial (Primer)",
    system: "Kardiovaskular",
    level_skdi: "4A",
    frequency: 5,
    summary: "Sakit kepala tengkuk, tensi > 140/90 mmHg.",
    content: {
      anamnesis: {
        keluhan_utama: "Sakit kepala / Tengkuk berat",
        list_pertanyaan: [
          "Ada riwayat darah tinggi sebelumnya?",
          "Keluarga ada yang hipertensi?",
          "Suka makan asin/berlemak?",
          "Merokok? Minum kopi?",
          "Pandangan kabur atau nyeri dada? (Cek kerusakan organ target)"
        ]
      },
      pemeriksaan_fisik: [
        "Tensi: > 140/90 mmHg (Ukur 2x selang 5 menit).",
        "BMI: Cek Obesitas.",
        "Funduskopi: Cek Retinopati Hipertensi (jika memungkinkan).",
        "Jantung: Batas jantung melebar (Kardiomegali)?"
      ],
      diagnosis: {
        working_diagnosis: "Hipertensi Grade I / II",
        differential_diagnosis: ["Hipertensi Sekunder (Penyakit Ginjal/Tiroid)", "White Coat Hypertension"],
        penunjang: ["Profil Lipid (Kolesterol)", "Gula Darah", "Urinalisis (Proteinuria)", "EKG (LVH)"],
        gold_standard: "Tensimeter (Pengukuran berulang)"
      },
      tatalaksana: {
        farmakologi: [
          "R/ Amlodipin tab 5 mg / 10 mg No. XXX",
          "S 1 dd tab 1 (Malam hari)",
          "ATAU",
          "R/ Captopril tab 12.5 mg / 25 mg No. XXX",
          "S 2 dd tab 1 (1 jam ac / 2 jam pc)",
          "ATAU",
          "R/ Candesartan tab 8 mg / 16 mg No. XXX",
          "S 1 dd tab 1"
        ],
        non_farmakologi: [
          "Diet DASH (Rendah garam < 1 sdt/hari).",
          "Olahraga aerobik 30 menit/hari.",
          "Stop merokok."
        ]
      },
      osce_tip: "Target Tensi: <140/90 (Umum), <130/80 (DM/CKD). Captopril batuk kering -> ganti ARB (Candesartan/Valsartan)."
    }
  },
  {
    id: "kardio_acs",
    title: "Acute Coronary Syndrome (STEMI)",
    system: "Kardiovaskular",
    level_skdi: "3B",
    frequency: 5,
    summary: "Nyeri dada kiri tipikal > 20 menit, menjalar, keringat dingin.",
    content: {
      anamnesis: {
        keluhan_utama: "Nyeri Dada Kiri (Angina)",
        list_pertanyaan: [
          "Nyeri seperti ditindih beban berat?",
          "Menjalar ke rahang/lengan kiri?",
          "Durasi > 20 menit? Membaik dengan istirahat?",
          "Disertai keringat dingin / mual?",
          "Riwayat merokok / kolesterol / jantung?"
        ]
      },
      pemeriksaan_fisik: [
        "KU: Gelisah, kesakitan (Levine Sign - memegang dada).",
        "Tanda Vital: Bisa hipertensi/hipotensi, takikardia.",
        "Auskultasi: S3 Gallop? Murmur? (Komplikasi)."
      ],
      diagnosis: {
        working_diagnosis: "STEMI (ST Elevation Myocardial Infarction) Lokasi ... (Anterior/Inferior/dll)",
        differential_diagnosis: ["NSTEMI", "UAP (Unstable Angina)", "GERD", "Dissection Aorta"],
        penunjang: ["EKG 12 Lead (ST Elevasi > 2 kotak kecil)", "Enzim Jantung (Troponin T/I CK-MB)"],
        gold_standard: "EKG & Troponin"
      },
      tatalaksana: {
        farmakologi: [
          "Loading Dose (Di UGD):",
          "R/ Aspilet (Aspirin) tab 80 mg No. IV (320 mg)",
          "S stat 4 tab (Kunyah)",
          "R/ Clopidogrel tab 75 mg No. IV (300 mg)",
          "S stat 4 tab (Telan)",
          "R/ ISDN tab 5 mg No. I (Sublingual - Bawah lidah)",
          "S stat 1 tab (Jika tensi > 100)"
        ],
        non_farmakologi: [
          "Oksigen 2-4 lpm jika saturasi < 90%.",
          "Pasang IV line.",
          "Rujuk SEGERA untuk PCI (Pasang Ring) / Fibrinolitik."
        ]
      },
      osce_tip: "Ingat MONACO: Morfin (jarang di FKTP), Oksigen, Nitrat (ISDN), Aspirin, Clopidogrel. Kontraindikasi Nitrat: Tensi rendah / Pakai obat kuat (Viagra)."
    }
  }
];