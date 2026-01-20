import type { StationData } from '../osce_data';
import { casesEndokrin } from '../cases/endokrin_cases';

export const stationEndokrin: StationData = {
  id: "endokrin",
  title: "Endokrin & Metabolisme",
  icon: "zap",
  description: "Pemeriksaan Tiroid (Struma), Kaki Diabetes, dan Status Gizi.",
  sections: [
    {
      type: 'standard_anamnesis',
      title: '1. Anamnesis Endokrin',
      data: {
        keluhan_utama: 'Benjolan di Leher / Banyak Kencing / Berdebar',
        rps: [
          'TIROID: Berdebar? Berkeringat banyak? Tangan gemetar? BB turun tapi makan banyak? (Hipertiroid)',
          'DIABETES: Polidipsi (Haus)? Poliuria (Pipis)? Polifagia (Lapar)? Kesemutan?',
          'Benjolan: Nyeri? Cepat membesar? Suara serak?'
        ],
        rpd: ['Riwayat Radiasi Leher?', 'Riwayat Gula Darah Tinggi?', 'Riwayat Operasi Tiroid?'],
        rpk: ['Keluarga ada yang sakit gondok/kencing manis?'],
        script: '"Apakah Bapak merasa lebih tidak tahan panas dibanding orang lain?"'
      }
    },
    {
      type: 'checklist',
      title: '2. Pemeriksaan Leher (Tiroid)',
      items: [
        { label: 'Inspeksi (Depan)', description: 'Minta pasien menengadah & menelan ludah. Perhatikan gerakan massa. Simetris/Asimetris? Tanda radang?' },
        { label: 'Palpasi (Belakang)', description: 'Pemeriksa di belakang pasien. Palpasi 2 lobus tiroid. Ukuran? Konsistensi (Keras/Kenyal)? Nyeri tekan? Ikut bergerak saat menelan?', isCritical: true },
        { label: 'Auskultasi Tiroid', description: 'Cek Bruit (Bising) pada struma (Tanda Hipertiroid/Grave’s).' },
        { label: 'Pemberton Sign', description: 'Angkat kedua tangan pasien ke atas. Positif jika muka merah/pusing (Obstruksi vaskular).' }
      ]
    },
    {
      type: 'checklist',
      title: '3. Tanda Mata & Tremor (Grave’s Disease)',
      items: [
        { label: 'Eksoftalmus', description: 'Lihat dari samping/atas, bola mata menonjol?' },
        { label: 'Von Grafe Sign', description: 'Minta pasien melirik ke bawah. Lid lag (kelopak atas tertinggal)?' },
        { label: 'Stellwag Sign', description: 'Jarang berkedip (Tatapan terpaku).' },
        { label: 'Fine Tremor', description: 'Minta pasien luruskan tangan, taruh kertas di punggung tangan. Gemetar halus?' }
      ]
    },
    {
      type: 'checklist',
      title: '4. Pemeriksaan Kaki Diabetes',
      items: [
        { label: 'Inspeksi', description: 'Warna kulit? Deformitas (Claw toe)? Callus (Kapalan)? Luka/Ulkus?' },
        { label: 'Palpasi Nadi', description: 'A. Dorsalis Pedis & A. Tibialis Posterior. Kuat/Lemah?' },
        { label: 'Tes Sensibilitas (Monofilamen)', description: 'Tes 10 titik di telapak kaki. Pasien merem. Terasa/Tidak?' }
      ]
    }
  ],
  cases: casesEndokrin
};