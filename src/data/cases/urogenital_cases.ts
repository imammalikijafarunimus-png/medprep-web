import type { CaseStudy } from '../osce_data';

export const casesUrogenital: CaseStudy[] = [
  {
    id: "uro_sistitis",
    title: "Sistitis (ISK Bawah)",
    system: "Urogenital",
    level_skdi: "4A",
    frequency: 5,
    summary: "Wanita muda/dewasa dengan keluhan nyeri saat BAK dan anyang-anyangan.",
    content: {
      anamnesis: {
        keluhan_utama: "Nyeri saat BAK (Disuria)",
        list_pertanyaan: [
          "Apakah sering menahan kencing?",
          "Apakah terasa panas/terbakar saat BAK?",
          "Apakah BAK terasa tidak tuntas (Anyang-anyangan)?",
          "Apakah urin berwarna keruh atau berbau menyengat?",
          "Riwayat higienitas (cara cebok)?",
          "Demam? (Biasanya demam sumer-sumer atau tidak ada pada Sistitis)"
        ]
      },
      pemeriksaan_fisik: [
        "Tanda Vital: Biasanya stabil, suhu mungkin subfebris.",
        "Status Lokalis (Abdomen): Nyeri Tekan Suprapubik (+).",
        "Nyeri Ketok CVA: NEGATIF (-) (Penting untuk menyingkirkan Pielonefritis)."
      ],
      diagnosis: {
        working_diagnosis: "Sistitis Akut (ISK Bawah)",
        differential_diagnosis: ["Pielonefritis Akut", "Uretritis (GO/Non-GO)", "Vesikolithiasis"],
        penunjang: [
          "Urinalisis Rutin: Leukosituria (>5/LPB), Nitrit (+), Bakteriuria (+).",
          "Darah Rutin: Leukositosis ringan (jarang)."
        ],
        gold_standard: "Kultur Urin (>10^5 CFU/mL)"
      },
      tatalaksana: {
        farmakologi: [
          "R/ Ciprofloxacin tab 500 mg No. X",
          "S 2 dd tab 1 (habiskan)",
          "ATAU",
          "R/ Cotrimoxazole (Trimetoprim 160mg/Sulfametoksazol 800mg) tab No. X",
          "S 2 dd tab 1"
        ],
        non_farmakologi: [
          "Minum air putih minimal 2 liter/hari.",
          "Jangan menahan kencing (voiding habit).",
          "Jaga kebersihan area genital (cebok dari depan ke belakang).",
          "Hindari celana dalam ketat/lembab."
        ]
      },
      osce_tip: "Wajib periksa Nyeri Ketok CVA. Jika (+) arahnya ke Pielonefritis, bukan Sistitis. Jangan lupa edukasi 'Habiskan Antibiotik'!"
    }
  },
  {
    id: "uro_pielonefritis",
    title: "Pielonefritis Akut (ISK Atas)",
    system: "Urogenital",
    level_skdi: "4A",
    frequency: 4,
    summary: "Pasien demam tinggi menggigil disertai nyeri pinggang.",
    content: {
      anamnesis: {
        keluhan_utama: "Demam tinggi & Nyeri Pinggang",
        list_pertanyaan: [
          "Demamnya menggigil?",
          "Nyeri pinggang kanan/kiri? Menjalar ke selangkangan?",
          "Ada mual muntah?",
          "Riwayat kencing batu atau ISK sebelumnya?"
        ]
      },
      pemeriksaan_fisik: [
        "Tanda Vital: Febris (>38 C), Takikardia.",
        "Status Lokalis: Nyeri Ketok CVA (Costovertebral Angle) POSITIF (+).",
        "Nyeri tekan suprapubik (bisa ada bisa tidak)."
      ],
      diagnosis: {
        working_diagnosis: "Pielonefritis Akut",
        differential_diagnosis: ["Nefrolitiasis", "Appendicitis (jika nyeri kanan)", "KET (pada wanita)"],
        penunjang: [
          "Urinalisis: Leukosit penuh, Silinder Leukosit (WBC Casts) - Khas!",
          "Darah Rutin: Leukositosis (Shift to the left)."
        ],
        gold_standard: "Kultur Urin & USG Ginjal"
      },
      tatalaksana: {
        farmakologi: [
          "R/ Ciprofloxacin tab 500 mg No. XIV",
          "S 2 dd tab 1 (selama 7-14 hari)",
          "R/ Paracetamol tab 500 mg No. X",
          "S 3 dd tab 1 (prn demam)"
        ],
        non_farmakologi: [
          "Bed rest / Istirahat total.",
          "Rehidrasi cairan adekuat.",
          "Evaluasi demam dalam 48 jam."
        ]
      },
      osce_tip: "Kata kunci: Demam Menggigil + Nyeri Ketok CVA. Jangan lupa cek Silinder Leukosit di urinalisis."
    }
  },
  {
    id: "uro_gnaps",
    title: "GNAPS (Sindrom Nefritik Akut)",
    system: "Urogenital",
    level_skdi: "3B",
    frequency: 4,
    summary: "Anak kecil, pipis warna merah (seperti cola/teh), riwayat sakit tenggorokan/kulit.",
    content: {
      anamnesis: {
        keluhan_utama: "Kencing berwarna merah / Bengkak kelopak mata",
        list_pertanyaan: [
          "Apakah urin berwarna merah kecoklatan (seperti cola/air cucian daging)?",
          "Apakah sembab di kelopak mata saat bangun tidur?",
          "Riwayat sakit tenggorokan 1-2 minggu lalu? (Faringitis)",
          "Riwayat korengan di kulit 2-3 minggu lalu? (Impetigo)",
          "Apakah jumlah urin berkurang (Oliguria)?"
        ]
      },
      pemeriksaan_fisik: [
        "Tanda Vital: Hipertensi (Penting pada anak!).",
        "Wajah: Edema Periorbital (Puffy eyes).",
        "Ekstremitas: Edema pretibial minimal."
      ],
      diagnosis: {
        working_diagnosis: "Glomerulonefritis Akut Pasca Streptokokus (GNAPS)",
        differential_diagnosis: ["Sindrom Nefrotik", "Gagal Ginjal Akut"],
        penunjang: [
          "Urinalisis: Hematuria (Eritrosit dismorfik), Proteinuria (+1/+2 saja).",
          "Darah: ASTO (+) meningkat, C3 Komplemen menurun.",
          "Kultur Apus Tenggorok/Kulit."
        ],
        gold_standard: "Biopsi Ginjal (Jarang dilakukan di setting akut)"
      },
      tatalaksana: {
        farmakologi: [
          "R/ Eritromisin syrup 200mg/5ml fl No. I",
          "S 4 dd cth 1 (Eradikasi kuman)",
          "R/ Furosemid tab 40 mg No. X (Jika edema berat/hipertensi)",
          "S 1 dd tab 1/2-1 (pagi hari)"
        ],
        non_farmakologi: [
          "Restriksi Garam dan Cairan.",
          "Tirah baring.",
          "Monitor tekanan darah dan produksi urin."
        ]
      },
      osce_tip: "Bedakan dengan Sindrom Nefrotik! GNAPS = Hematuria + Hipertensi + Bengkak Ringan. Nefrotik = Proteinuria Masif + Bengkak Berat + Kolesterol Tinggi."
    }
  }
];