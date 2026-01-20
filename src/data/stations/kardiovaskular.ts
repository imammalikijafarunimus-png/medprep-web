import type { StationData } from '../osce_data';
import { casesKardio } from '../cases/kardiovaskular_cases';

export const stationKardio: StationData = {
  id: "kardiovaskular",
  title: "Sistem Kardiovaskular",
  icon: "heart",
  description: "Pemeriksaan Jantung dan Tekanan Vena Jugularis.",
  sections: [
    {
      type: 'standard_anamnesis',
      title: '1. Anamnesis Jantung',
      data: {
        keluhan_utama: 'Nyeri Dada (Chest Pain) / Berdebar',
        rps: ['Lokasi: Substernal? Menjalar ke lengan kiri/rahang?', 'Kualitas: Seperti ditindih beban berat?', 'Durasi: >20 menit?', 'Sesak: Saat aktivitas (DOE)? Tidur telentang (Orthopnea)?'],
        rpd: ['Hipertensi?', 'Diabetes?', 'Kolesterol?', 'Riwayat Jantung sebelumnya?'],
        rpk: ['Keluarga meninggal mendadak/sakit jantung?'],
        script: '"Nyerinya menjalar sampai ke leher atau lengan kiri Pak?"'
      }
    },
    {
      type: 'checklist',
      title: '2. Pemeriksaan Leher (JVP)',
      items: [
        { label: 'Posisi Pasien', description: 'Berbaring dengan kepala 30 derajat (gunakan bantal).' },
        { label: 'Ukur JVP', description: 'Cari titik kolaps Vena Jugularis. Ukur jarak vertikal dari Angle of Louis. Hasil: 5 +/- X cmH2O.' }
      ]
    },
    {
      type: 'checklist',
      title: '3. Pemeriksaan Jantung (Cor)',
      items: [
        { label: 'Inspeksi & Palpasi', description: 'Cari Ictus Cordis (SIC V Linea Midclavicularis Sinistra). Teraba? Kuat angkat? Thrill?' },
        { label: 'Perkusi Batas Jantung', description: 'Batas Kanan (Linea Parasternalis Dextra), Batas Kiri (Ictus Cordis), Pinggang Jantung (SIC III).', isCritical: true },
        { label: 'Auskultasi', description: 'Dengar di 4 Katup (Mitral, Trikuspid, Pulmonal, Aorta). S1 & S2 tunggal? Murmur? Gallop?', isCritical: true }
      ]
    }
  ],
  cases: casesKardio
};