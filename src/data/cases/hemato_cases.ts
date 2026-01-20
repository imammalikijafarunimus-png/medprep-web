import type { CaseStudy } from '../osce_data';

export const casesHemato: CaseStudy[] = [
  {
    id: "hemato_adb",
    title: "Anemia Defisiensi Besi",
    system: "Hematoimunologi",
    level_skdi: "4A",
    frequency: 5,
    summary: "Lemah, letih, lesu (5L), konjungtiva anemis, kuku sendok (koilonychia).",
    content: {
      anamnesis: {
        keluhan_utama: "Lemah / Pucat / Sering pusing",
        list_pertanyaan: [
          "Sering berkunang-kunang saat bangun dari duduk?",
          "Pola makan bagaimana? (Jarang makan daging/sayur hijau?)",
          "Suka minum teh/kopi setelah makan? (Menghambat absorpsi besi)",
          "Ada riwayat perdarahan kronis? (Haid banyak/lama, wasir berdarah, cacingan?)",
          "Anak-anak: Minum susu sapi berlebihan?"
        ]
      },
      pemeriksaan_fisik: [
        "Mata: Konjungtiva anemis (pucat).",
        "Mulut: Atrofi papil lidah (lidah licin), Cheilitis (pecah sudut bibir).",
        "Ekstremitas: Koilonychia (Kuku sendok/cekung), Capillary refill time normal (bedakan dengan syok)."
      ],
      diagnosis: {
        working_diagnosis: "Anemia Defisiensi Besi",
        differential_diagnosis: ["Anemia Penyakit Kronis", "Thalasemia (riwayat keluarga +)", "Anemia Megaloblastik"],
        penunjang: ["Darah Rutin (Hb turun, MCV < 80, MCH < 27)", "Gambaran Darah Tepi (Mikrositik Hipokrom)", "Serum Iron (SI) turun, TIBC naik, Ferritin turun"],
        gold_standard: "Ferritin Serum & SI/TIBC"
      },
      tatalaksana: {
        farmakologi: [
          "R/ Sulfas Ferrosus (SF) tab 300 mg No. XXX",
          "S 3 dd tab 1 (Saat perut kosong / dengan jus jeruk)",
          "R/ Vitamin C tab 50 mg No. XXX (Membantu penyerapan)",
          "S 3 dd tab 1"
        ],
        non_farmakologi: [
          "Makan makanan tinggi zat besi (daging merah, hati, bayam).",
          "JANGAN minum teh/kopi/susu berbarengan dengan obat besi (beri jeda 2 jam).",
          "Efek samping obat: BAB berwarna hitam & mual (wajar)."
        ]
      },
      osce_tip: "Ingat Trias ADB: 1. Gejala Anemia (5L), 2. Tanda Defisiensi Besi (Kuku sendok/Lidah licin), 3. Penyebab (Perdarahan/Kurang asupan)."
    }
  },
  {
    id: "hemato_hiv",
    title: "HIV / AIDS (Konseling VCT)",
    system: "Hematoimunologi",
    level_skdi: "4A",
    frequency: 4,
    summary: "Konseling pre-test dan post-test HIV. Perilaku berisiko.",
    content: {
      anamnesis: {
        keluhan_utama: "Ingin periksa darah / BB turun drastis / Diare kronis",
        list_pertanyaan: [
          "Faktor Risiko: Hubungan seksual tidak aman? Gonta-ganti pasangan?",
          "Pengguna jarum suntik bergantian (penasun)?",
          "Pernah transfusi darah/tato?",
          "Pasangan status HIV-nya bagaimana?",
          "Ada demam lama > 1 bulan? Diare > 1 bulan?"
        ]
      },
      pemeriksaan_fisik: [
        "Mulut: Oral Thrush (Jamur di lidah/mulut) - Tanda imunitas rendah.",
        "Kulit: Dermatitis seboroik berat, Herpes Zoster.",
        "Kelenjar: Limfadenopati generalisata (benjolan di leher/ketiak/selangkangan)."
      ],
      diagnosis: {
        working_diagnosis: "Tersangka Infeksi HIV / AIDS Stadium ...",
        differential_diagnosis: ["TB Paru", "Limfoma"],
        penunjang: ["Rapid Test HIV (3 Metode berbeda)", "CD4 Count", "Viral Load"],
        gold_standard: "Western Blot (Jarang) / Rapid Test 3 Reagen"
      },
      tatalaksana: {
        farmakologi: [
          "R/ Kotrimoksazol tab 960 mg No. XXX (Profilaksis IO)",
          "S 1 dd tab 1",
          "(Obat ARV biasanya diresepkan di poli khusus VCT/CST, di OSCE sebutkan saja 'Rujuk ke PDP untuk ARV')"
        ],
        non_farmakologi: [
          "Konseling VCT (Voluntary Counseling and Testing).",
          "Prinsip 5C (Consent, Confidentiality, Counseling, Correct Result, Connect to Care).",
          "Edukasi seks aman (Kondom).",
          "Jangan mendiskriminasi pasien."
        ]
      },
      osce_tip: "Di stase ini, poin utamanya adalah KOMUNIKASI (Empati & Tidak menghakimi). Jangan lupa minta Informed Consent tertulis sebelum tes HIV."
    }
  }
];