import type { CaseStudy } from '../osce_data';

export const casesGadar: CaseStudy[] = [
  {
    id: "gadar_anafilaktik",
    title: "Syok Anafilaktik",
    system: "Gawat Darurat",
    level_skdi: "4A",
    frequency: 5,
    summary: "Sesak napas, tensi turun drastis, bentol-bentol setelah suntik/makan/minum obat.",
    content: {
      anamnesis: {
        keluhan_utama: "Sesak napas mendadak & Penurunan Kesadaran",
        list_pertanyaan: [
          "Apa yang dilakukan sebelum kejadian? (Suntik antibiotik? Makan udang?)",
          "Berapa lama setelah paparan? (Biasanya < 30 menit).",
          "Ada riwayat alergi sebelumnya?",
          "Suara serak/mengorok? (Edema laring)."
        ]
      },
      pemeriksaan_fisik: [
        "Airway: Stridor (bunyi ngorok), suara parau, edema bibir/lidah.",
        "Breathing: Sesak, Wheezing (+).",
        "Circulation: Hipotensi (Syok), Takikardia, Akral dingin.",
        "Skin: Urtikaria (biduran) seluruh tubuh."
      ],
      diagnosis: {
        working_diagnosis: "Syok Anafilaktik",
        differential_diagnosis: ["Syok Kardiogenik", "Syok Neurogenik", "Asma Akut"],
        penunjang: ["Tidak ada (Diagnosis Klinis & Cito)"],
        gold_standard: "Klinis"
      },
      tatalaksana: {
        farmakologi: [
          "TERAPI UTAMA (Wajib hafal mati):",
          "R/ Adrenalin (Epinefrin) 1:1000 ampul No. I",
          "S imm (Suntikkan 0.3 - 0.5 ml IM di paha anterolateral)",
          "Boleh diulang tiap 5-15 menit jika tidak respon.",
          "",
          "Terapi Tambahan (Setelah Adrenalin):",
          "R/ Difenhidramin inj amp No. I (Antihistamin)",
          "S imm (10-20 mg IV/IM)",
          "R/ Dexamethasone inj amp No. I (Kortikosteroid)",
          "S imm (5 mg IV)"
        ],
        non_farmakologi: [
          "Hentikan paparan (stop infus/suntikan).",
          "Posisi Trendelenburg (Kaki lebih tinggi dari kepala) untuk naikkan tensi.",
          "Oksigenasi aliran tinggi (High flow).",
          "Pasang IV line grojok cairan (Kristaloid)."
        ]
      },
      osce_tip: "Di stase Gadar, JANGAN ANAMNESIS LAMA-LAMA. Cek ABC (Airway Breathing Circulation), tegakkan diagnosa, langsung suntik Adrenalin. Adrenalin adalah obat DEWA di kasus ini."
    }
  }
];