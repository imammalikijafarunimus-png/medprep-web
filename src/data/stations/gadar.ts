import type { StationData } from '../osce_data';
import { casesGadar } from '../cases/gadar_cases';

export const stationGadar: StationData = {
  id: "gadar",
  title: "Kegawatdaruratan",
  icon: "siren",
  description: "Primary Survey (ABCDE), Resusitasi Jantung Paru, Syok, dan Trauma.",
  sections: [
    // --- SKENARIO 1: UNIVERSAL PRIMARY SURVEY ---
    {
      type: 'checklist',
      title: '[UNIVERSAL] Primary Survey (ABCDE)',
      items: [
        { label: 'DANGER (3A)', description: 'Aman Diri (APD), Aman Lingkungan, Aman Pasien.', isCritical: true },
        { label: 'RESPONSE (Cek Kesadaran)', description: 'Panggil "Pak! Pak!". Cek respon AVPU (Alert, Verbal, Pain, Unresponsive).' },
        { label: 'AIRWAY + C-Spine Control', description: 'Cek jalan napas (Snoring/Gurgling/Stridor?). Curiga trauma servikal? Pasang Collar Neck + Jaw Thrust.', isCritical: true },
        { label: 'BREATHING', description: 'Inspeksi (Jejas/Simetris?), Auskultasi (Vesikuler?), Perkusi, Palpasi. Cek Saturasi O2. Beri Oksigen jika perlu.' },
        { label: 'CIRCULATION', description: 'Cek Nadi Carotis (<10 detik). Cek Akral, CRT. Pasang IV Line (Infus) 2 jalur jarum besar (14G/16G). Stop bleeding jika ada.', isCritical: true },
        { label: 'DISABILITY', description: 'Cek GCS dan Pupil (Isokor/Refleks cahaya).' },
        { label: 'EXPOSURE', description: 'Buka pakaian untuk cari jejas lain. Cegah hipotermia (selimut).' }
      ]
    },

    // --- SKENARIO 2: SYOK & JANTUNG ---
    {
      type: 'checklist',
      title: '[KASUS] Syok Anafilaktik',
      items: [
        { label: 'Kenali Tanda', description: 'Riwayat alergi/obat/sengatan. Sesak (Stridor/Wheezing), Hipotensi, Urtikaria.' },
        { label: 'Posisi Pasien', description: 'Trendelenburg (Kaki lebih tinggi) jika hemodinamik tidak stabil.' },
        { label: 'Adrenalin (Epinefrin)', description: 'Inj. Adrenalin 1:1000 0.3-0.5 ml IM (Intramuskular) di paha mid-anterolateral. Ulangi tiap 5-15 menit.', isCritical: true },
        { label: 'Cairan & Oksigen', description: 'Loading Kristaloid 10-20ml/kgBB cepat. Oksigen aliran tinggi.' },
        { label: 'Terapi Tambahan', description: 'Difenhidramin (Antihistamin) & Steroid (Dexamethasone) IV pelan.' }
      ]
    },
    {
      type: 'checklist',
      title: '[KASUS] Henti Jantung (Cardiac Arrest)',
      items: [
        { label: 'Cek Nadi Carotis', description: 'Tidak teraba? -> Code Blue / Panggil Bantuan.', isCritical: true },
        { label: 'RJP (CPR) Berkualitas', description: '30 Kompresi : 2 Ventilasi. Kecepatan 100-120x/m. Kedalaman 5-6 cm. Recoil penuh. Minimal interupsi.', isCritical: true },
        { label: 'Evaluasi Irama (Defibrilator)', description: 'Shockable (VF/VT Tanpa Nadi)? -> Kejut Listrik (Defibrilasi). Non-Shockable (Asistol/PEA)? -> Lanjut CPR + Adrenalin 1mg IV tiap 3-5 menit.' }
      ]
    },

    // --- SKENARIO 3: ENDOKRIN (GULA) ---
    {
      type: 'checklist',
      title: '[KASUS] Hipoglikemia & Hiperglikemia',
      items: [
        { label: 'Cek GDS (Gula Darah Sewaktu)', description: 'Segera saat Primary Survey (Disability).', isCritical: true },
        { label: 'Tatalaksana Hipoglikemia (Sadar)', description: 'Berikan air gula / makanan manis.' },
        { label: 'Tatalaksana Hipoglikemia (Tidak Sadar)', description: 'Bolus Dextrose 40% (D40) 2 Flacon (50ml). Evaluasi GDS ulang per 15 menit sampai target >100 mg/dL.', isCritical: true },
        { label: 'Tatalaksana Hiperglikemia (KAD/HHS)', description: 'Rehidrasi cairan (NaCl 0.9%) masif. Insulin drip (sesuai protokol RS).' }
      ]
    },

    // --- SKENARIO 4: NEUROLOGI (KEJANG) ---
    {
      type: 'checklist',
      title: '[KASUS] Kejang Demam (Anak)',
      items: [
        { label: 'Amankan Pasien', description: 'Jauhkan benda berbahaya. Jangan masukkan sendok ke mulut! Miringkan badan.' },
        { label: 'Hentikan Kejang (Akses Belum Ada)', description: 'Diazepam Rectal (Tube). BB <10kg: 5mg. BB >10kg: 10mg. Boleh diulang 1x (interval 5 menit).', isCritical: true },
        { label: 'Hentikan Kejang (Akses IV Ada)', description: 'Diazepam IV pelan 0.3-0.5 mg/kgBB.' },
        { label: 'Tatalaksana Demam', description: 'Paracetamol (10-15 mg/kgBB) atau Kompres hangat.' }
      ]
    },

    // --- SKENARIO 5: RESUSITASI NEONATUS ---
    {
      type: 'checklist',
      title: '[KASUS] Resusitasi Neonatus',
      items: [
        { label: 'Penilaian Awal (T.O.N.E)', description: 'Cukup bulan? Tonus otot baik? Menangis/Bernapas spontan? (Jika TIDAK -> Resusitasi).' },
        { label: 'Langkah Awal (30 Detik)', description: 'Jaga kehangatan (Infant Warmer). Posisikan kepala (sedikit ekstensi). Isap lendir (Mulut dulu baru Hidung). Keringkan & Stimulasi. Posisikan kembali.', isCritical: true },
        { label: 'Evaluasi HR & Napas', description: 'HR < 100 atau Apneu/Megap-megap? -> VTP (Ventilasi Tekanan Positif).' },
        { label: 'VTP (Ventilasi)', description: 'Kecepatan 40-60x/menit. "Remas-Lepas-Lepas". Evaluasi dada mengembang.', isCritical: true },
        { label: 'Kompresi Dada', description: 'Jika HR < 60 setelah VTP adekuat. Rasio 3 Kompresi : 1 Napas.' }
      ]
    },

    // --- SKENARIO 6: TRAUMA MUSKULOSKELETAL ---
    {
      type: 'checklist',
      title: '[KASUS] Trauma / Fraktur (Ortopedi)',
      items: [
        { label: 'Status Lokalis (Look)', description: 'Deformitas? Bengkak? Luka terbuka (Bone exposed)? Perdarahan aktif?' },
        { label: 'Status Lokalis (Feel)', description: 'Nyeri tekan? Krepitasi? NVD (Neurovascular Distal - Cek Nadi & Sensibilitas distal fraktur).', isCritical: true },
        { label: 'Status Lokalis (Move)', description: 'Terbatas karena nyeri (Functio Laesa). Jangan dipaksa gerak.' },
        { label: 'Bidai (Splinting)', description: 'Melewati 2 sendi. Jangan luruskan paksa jika ada tahanan. Cek NVD lagi setelah bidai.', isCritical: true }
      ]
    }
  ],
  cases: casesGadar
};