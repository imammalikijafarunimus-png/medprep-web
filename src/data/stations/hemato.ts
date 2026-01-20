import type { StationData } from '../osce_data';
import { casesHemato } from '../cases/hemato_cases';

export const stationHemato: StationData = {
  id: "hemato",
  title: "Hemato & Imunologi",
  icon: "shield",
  description: "Pemeriksaan Anemia, Tanda Perdarahan, dan Infeksi Tropis.",
  sections: [
    {
      type: 'standard_anamnesis',
      title: '1. Anamnesis (Sering pada Anak)',
      data: {
        keluhan_utama: 'Demam / Pucat / Mimisan / Bintik Merah',
        rps: [
          'DEMAM: Pola demam (Naik turun/Terus menerus)? Menggigil? Kejang?',
          'PERDARAHAN: Gusi berdarah? Mimisan? BAB hitam? Bintik merah di kulit?',
          'ANEMIA: Lemas? Pusing? Sulit konsentrasi?',
          'Riwayat bepergian ke daerah endemis (Papua/NTT)?'
        ],
        rpd: ['Riwayat alergi obat/makanan?', 'Riwayat sakit kuning?'],
        rpk: ['Keluarga sakit Thalasemia/Hemofilia?'],
        script: '"Demamnya mendadak tinggi atau perlahan naik Bu?"'
      }
    },
    {
      type: 'checklist',
      title: '2. Pemeriksaan Fisik Umum',
      items: [
        { label: 'Tanda Vital & Gizi', description: 'Suhu (Penting!), Nadi, RR. Status Gizi (BB/TB).' },
        { label: 'Kulit & Mata', description: 'Konjungtiva anemis? Sklera ikterik? Petechiae/Purpura/Ecchymosis di kulit?' }
      ]
    },
    {
      type: 'checklist',
      title: '3. Pemeriksaan Khusus',
      items: [
        { label: 'Rumple Leed Test (Tourniquet)', description: 'Tahan tensi di antara Sistol-Diastol selama 5-10 menit. Positif jika >10 petechiae di area volar lengan.', isCritical: true },
        { label: 'Palpasi KGB', description: 'Leher, Axilla, Inguinal. Nyeri? Mobile/Fiksir? Ukuran?' },
        { label: 'Palpasi Hepar & Lien', description: 'Hepatomegali? Splenomegali (Schuffner 1-8)?' }
      ]
    }
  ],
  cases: casesHemato
};