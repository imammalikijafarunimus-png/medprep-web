import type { CaseStudy } from '../osce_data';


export const casesMuskulo: CaseStudy[] = [
  {
    id: "muskulo_fraktur",
    title: "Fraktur Tertutup (Closed Fracture)",
    system: "Muskuloskeletal",
    level_skdi: "3B/4A",
    frequency: 5,
    summary: "Pasien trauma, nyeri hebat, deformitas tulang, tidak ada luka terbuka.",
    content: {
      anamnesis: {
        keluhan_utama: "Nyeri kaki/tangan pasca trauma",
        list_pertanyaan: [
          "Mekanisme trauma? (Jatuh/Kecelakaan)",
          "Bisa digerakkan atau tidak? (Fungsiolaesa)",
          "Ada baal/kesemutan di ujung jari? (Sindrom Kompartemen)",
          "Ada riwayat pingsan/muntah? (Head injury)"
        ]
      },
      pemeriksaan_fisik: [
        "Look: Deformitas (Angulasi/Bengkok, Shortening/Pendek), Bengkak, Tidak ada luka terbuka.",
        "Feel: Nyeri tekan setempat, Krepitasi (+), Arteri distal teraba? (Cek vaskularisasi).",
        "Move: Nyeri gerak aktif & pasif, ROM terbatas."
      ],
      diagnosis: {
        working_diagnosis: "Fraktur Tertutup 1/3 Tengah Tibia/Fibula/Radius/Ulna Dextra/Sinistra",
        differential_diagnosis: ["Dislokasi", "Sprain (Keseleo)"],
        penunjang: ["Foto Rontgen 2 Posisi (AP & Lateral) - Rule of Two"],
        gold_standard: "Rontgen"
      },
      tatalaksana: {
        farmakologi: [
          "R/ Ketorolac inj amp No. I (Analgetik kuat)",
          "S imm (i.m/i.v) - Di UGD",
          "Pulang:",
          "R/ Asam Mefenamat tab 500 mg No. XV",
          "S 3 dd tab 1 p.c"
        ],
        non_farmakologi: [
          "Prinsip 4R: Recognize, Reposition, Retain (Fiksasi), Rehabilitation.",
          "Pasang Bidai (Splinting) melewati 2 sendi.",
          "Elevasi tungkai.",
          "Rujuk ke Sp.OT untuk pemasangan Gips/ORIF."
        ]
      },
      osce_tip: "Pemasangan bidai harus melewati 2 sendi (proksimal & distal fraktur). Cek pulsasi arteri dan kapiler (CRT) SEBELUM dan SESUDAH pasang bidai!"
    }
  },
  {
    id: "muskulo_gout",
    title: "Gout Arthritis (Asam Urat)",
    system: "Muskuloskeletal",
    level_skdi: "4A",
    frequency: 5,
    summary: "Nyeri sendi mendadak, bengkak, merah, biasanya di jempol kaki (Podagra).",
    content: {
      anamnesis: {
        keluhan_utama: "Nyeri sendi jempol kaki mendadak",
        list_pertanyaan: [
          "Kapan mulai sakit? (Biasanya bangun tidur pagi).",
          "Sakit sekali sampai tidak bisa kena selimut?",
          "Habis makan jeroan/melinjo/kacang?",
          "Pernah sakit seperti ini sebelumnya?"
        ]
      },
      pemeriksaan_fisik: [
        "Status Lokalis (MTP-1 / Jempol kaki):",
        "Tanda radang akut: Kalor (Panas), Rubor (Merah), Dolor (Nyeri), Tumor (Bengkak).",
        "Tophi: Benjolan keras putih di telinga/jari (pada kasus kronis)."
      ],
      diagnosis: {
        working_diagnosis: "Gout Arthritis Akut (Serangan Akut)",
        differential_diagnosis: ["Osteoarthritis (Nyeri mekanik)", "Rheumatoid Arthritis (Kaku pagi >1 jam, simetris)", "Septic Arthritis"],
        penunjang: ["Kadar Asam Urat Darah (Pria >7, Wanita >6)", "Aspirasi Cairan Sendi (Kristal jarum/monosodium urat)"],
        gold_standard: "Aspirasi Sendi (Kristal)"
      },
      tatalaksana: {
        farmakologi: [
          "SAAT NYERI (Akut):",
          "R/ Kolkisin (Colchicine) tab 0.5 mg No. X",
          "S (Awal 2 tab, lalu 1 tab tiap jam sampai nyeri hilang/diare, max 6mg)",
          "ATAU R/ Na Diclofenac tab 50 mg No. X",
          "S 2 dd tab 1",
          "",
          "SAAT TIDAK NYERI (Maintenance/Pencegahan):",
          "R/ Allopurinol tab 100 mg No. XXX",
          "S 1 dd tab 1"
        ],
        non_farmakologi: [
          "Diet rendah purin (hindari jeroan, seafood, alkohol, emping).",
          "Minum air putih yang banyak.",
          "Kompres dingin."
        ]
      },
      osce_tip: "JANGAN kasih Allopurinol saat serangan akut! Itu malah memperparah nyeri. Kasih NSAID/Kolkisin dulu. Allopurinol baru diberikan setelah nyeri hilang."
    }
  }
];