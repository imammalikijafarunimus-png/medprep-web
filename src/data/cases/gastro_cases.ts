import type { CaseStudy } from '../osce_data';

export const casesGastro: CaseStudy[] = [
  {
    id: "gastro_gerd",
    title: "GERD (Gastroesophageal Reflux Disease)",
    system: "Gastroenterohepatologi",
    level_skdi: "4A",
    frequency: 5,
    summary: "Dada terasa panas (heartburn) dan mulut pahit (regurgitasi).",
    content: {
      anamnesis: {
        keluhan_utama: "Dada terasa panas / terbakar",
        list_pertanyaan: [
          "Apakah rasa panas menjalar sampai leher? (Heartburn)",
          "Mulut terasa pahit/asam? (Regurgitasi)",
          "Sering sendawa? Kembung?",
          "Memberat setelah makan atau saat berbaring?",
          "Sering minum kopi/makan pedas/lemak?",
          "Ada penurunan berat badan/sulit menelan? (Alarm symptoms)"
        ]
      },
      pemeriksaan_fisik: [
        "Umumnya NORMAL.",
        "Status Lokalis: Nyeri tekan epigastrium (ringan/negatif).",
        "Gigi geligi: Karies (akibat asam lambung) pada kasus kronis."
      ],
      diagnosis: {
        working_diagnosis: "GERD (Gastroesophageal Reflux Disease)",
        differential_diagnosis: ["Dispepsia Fungsional", "Angina Pectoris (Jantung)", "Gastritis"],
        penunjang: ["Endoskopi (Gold Standard)", "PPI Test (Respon terhadap obat PPI)", "EKG (Singkirkan jantung)"],
        gold_standard: "Endoskopi / PPI Test"
      },
      tatalaksana: {
        farmakologi: [
          "R/ Omeprazole caps 20 mg No. XIV",
          "S 2 dd caps 1 (30 menit a.c / sebelum makan)",
          "R/ Domperidone tab 10 mg No. XIV (Prokinetik)",
          "S 3 dd tab 1 (15 menit a.c)",
          "R/ Sucralfate syr fl No. I (Pelapis mukosa)",
          "S 3 dd C I (1 jam a.c)"
        ],
        non_farmakologi: [
          "Jangan langsung tiduran setelah makan (tunggu 2-3 jam).",
          "Tidur bantal tinggi (elevasi kepala).",
          "Hindari kopi, coklat, pedas, asam, soda.",
          "Makan porsi kecil tapi sering (Small frequent feeding)."
        ]
      },
      osce_tip: "Bedakan dengan Gastritis/Maag. GERD kuncinya 'Naik ke atas' (Dada panas/Mulut pahit). Kalau Gastritis nyerinya 'Diam di ulu hati'."
    }
  },
  {
    id: "gastro_tifoid",
    title: "Demam Tifoid (Tipes)",
    system: "Gastroenterohepatologi",
    level_skdi: "4A",
    frequency: 5,
    summary: "Demam naik tangga (step-ladder) > 7 hari, lidah kotor, gangguan BAB.",
    content: {
      anamnesis: {
        keluhan_utama: "Demam > 1 minggu",
        list_pertanyaan: [
          "Demam makin sore/malam makin tinggi?",
          "Pola demam naik perlahan (step-ladder)?",
          "Ada mual/muntah/nyeri perut?",
          "BAB sulit (konstipasi) atau diare?",
          "Suka jajan sembarangan?"
        ]
      },
      pemeriksaan_fisik: [
        "Suhu: Febris (38-39 C).",
        "Mulut: Tifoid Tongue (Lidah kotor tengah putih, tepi merah, tremor).",
        "Abdomen: Nyeri tekan epigastrium, Hepatomegali (Hati teraba).",
        "Nadi: Bradikardia Relatif (Suhu naik, nadi tidak naik sesuai proporsi)."
      ],
      diagnosis: {
        working_diagnosis: "Demam Tifoid",
        differential_diagnosis: ["Dengue Fever (Demam Berdarah)", "Malaria", "ISK"],
        penunjang: ["Darah Rutin (Leukopenia/Limfositosis)", "Widal Test (Titer O > 1/320)", "Tubex TF (>4)"],
        gold_standard: "Kultur Darah (Minggu 1) / Feses (Minggu 2)"
      },
      tatalaksana: {
        farmakologi: [
          "R/ Kloramfenikol caps 500 mg No. XX (Lini 1 Klasik)",
          "S 4 dd caps 1 (sampai 7 hari bebas demam)",
          "ATAU",
          "R/ Tiamfenikol caps 500 mg No. XX",
          "S 4 dd caps 1",
          "ATAU",
          "R/ Ciprofloxacin tab 500 mg No. X (Dewasa)",
          "S 2 dd tab 1",
          "R/ Paracetamol tab 500 mg No. X",
          "S 3 dd tab 1 (k/p demam)"
        ],
        non_farmakologi: [
          "Tirah baring total sampai demam turun.",
          "Diet lunak rendah serat (Bubur saring) untuk cegah perforasi usus.",
          "Jaga kebersihan makanan/cuci tangan."
        ]
      },
      osce_tip: "Jangan lupa periksa Lidah (Tifoid Tongue)! Itu tanda fisik paling khas di OSCE."
    }
  },
  {
    id: "gastro_hepatitis",
    title: "Hepatitis A Akut",
    system: "Gastroenterohepatologi",
    level_skdi: "4A",
    frequency: 4,
    summary: "Mata kuning (ikterik), demam, mual, urin seperti teh pekat.",
    content: {
      anamnesis: {
        keluhan_utama: "Mata/Kulit Kuning",
        list_pertanyaan: [
          "Kapan mulai kuning? Demam sebelumnya?",
          "Urin berwarna teh pekat? BAB dempul (pucat)?",
          "Mual muntah hebat? Tidak nafsu makan?",
          "Ada teman sekolah/kerja yang sakit sama? (Penularan Fecal-Oral)",
          "Suka makan mentah/kerang?"
        ]
      },
      pemeriksaan_fisik: [
        "Mata: Sklera Ikterik (+).",
        "Abdomen: Hepatomegali (Hati teraba 2 jari b.a.c, tepi tumpul, permukaan rata, nyeri tekan +).",
        "Kulit: Ikterik (Kuning)."
      ],
      diagnosis: {
        working_diagnosis: "Hepatitis A Akut",
        differential_diagnosis: ["Hepatitis B/C", "Leptospirosis", "Malaria"],
        penunjang: ["IgM anti-HAV (+) - Penanda infeksi akut", "SGOT/SGPT meningkat tajam (>10x)", "Bilirubin Total/Direct meningkat"],
        gold_standard: "IgM anti-HAV"
      },
      tatalaksana: {
        farmakologi: [
          "R/ Curcuma (Hepatoprotektor) tab 20 mg No. X",
          "S 3 dd tab 1",
          "R/ Domperidone tab 10 mg No. X (Anti mual)",
          "S 3 dd tab 1 a.c",
          "R/ Vitamin B Kompleks tab No. X",
          "S 1 dd tab 1"
        ],
        non_farmakologi: [
          "Bed rest (Istirahat) sampai kuning hilang/enzim hati normal.",
          "Diet TKTP (Tinggi Kalori Tinggi Protein), rendah lemak (bila mual).",
          "Hindari obat hepatotoksik (Paracetamol dosis tinggi, Alkohol)."
        ]
      },
      osce_tip: "Hepatitis A itu Self-limiting (Sembuh sendiri). Terapi hanya suportif (Vitamin & Anti Mual). Kunci: IgM Anti-HAV."
    }
  }
];