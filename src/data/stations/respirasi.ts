import type { StationData } from '../osce_data';
import { casesRespirasi } from '../cases/respirasi_cases';

export const stationRespirasi: StationData = {
  id: "respirasi",
  title: "Sistem Respirasi",
  icon: "wind",
  description: "Pemeriksaan Fisik Thorax (Paru) Depan dan Belakang.",
  sections: [
    {
      type: 'checklist',
      title: '1. Pembukaan',
      items: [
        { label: 'Salam & Perkenalan', script: 'Assalamualaikum, Saya dr. [Nama].' },
        { label: 'Informed Consent', isCritical: true, script: 'Izin memeriksa dada Bapak/Ibu. Mohon bajunya dibuka ya Pak.' }
      ]
    },
    {
      type: 'standard_anamnesis',
      title: '2. Anamnesis Respirasi',
      data: {
        keluhan_utama: 'Sesak Napas / Batuk',
        rps: ['Onset: Akut/Kronis?', 'Sifat Batuk: Berdahak/Kering?', 'Dahak: Warna? Darah (Hemoptisis)?', 'Sesak: Bunyi "ngik"? Dipengaruhi aktivitas?', 'Gejala lain: Demam? Keringat malam? BB turun?'],
        rpd: ['Riwayat Asma/Alergi?', 'Riwayat TB (OAT)?', 'Riwayat Merokok (Penting!)'],
        rpk: ['Keluarga ada yang batuk lama/TB?'],
        script: '"Sesaknya bunyi ngik tidak Pak? Merokok berapa bungkus sehari?"'
      }
    },
    {
      type: 'checklist',
      title: '3. Pemeriksaan Fisik Paru (Depan)',
      items: [
        { label: 'Inspeksi Statis & Dinamis', description: 'Bentuk dada (Barrel chest?), Simetris/Tertinggal?, Retraksi sela iga?', isCritical: true },
        { label: 'Palpasi (Stem Fremitus)', description: 'Ucapkan "77" atau "99". Bandingkan getaran kanan-kiri (Atas, Tengah, Bawah).' },
        { label: 'Perkusi Paru', description: 'Sonor (Normal) / Redup (Cairan/Massa) / Hipersonor (Udara/Pneumothorax). Bandingkan kanan-kiri.' },
        { label: 'Auskultasi', description: 'Suara Dasar (Vesikuler/Bronkial) & Suara Tambahan (Ronkhi/Wheezing).', isCritical: true }
      ]
    },
    {
      type: 'checklist',
      title: '4. Pemeriksaan Paru (Belakang)',
      items: [
        { label: 'Posisi Pasien', description: 'Minta pasien duduk membelakangi pemeriksa & memeluk dada sendiri (Scapula terbuka).' },
        { label: 'Palpasi, Perkusi, Auskultasi Punggung', description: 'Lakukan langkah sama seperti depan di area punggung.' }
      ]
    }
  ],
  cases: casesRespirasi
};