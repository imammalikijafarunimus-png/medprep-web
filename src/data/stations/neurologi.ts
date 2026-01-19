import { StationData } from '../osce_data';

export const stationNeurologi: StationData = {
  id: "neurologi",
  title: "Sistem Neurologi",
  icon: "brain",
  description: "Pemeriksaan Saraf Pusat, Meningeal Sign, dan Koordinasi.",
  sections: [
    {
      type: 'checklist',
      title: '1. Pembukaan & Anamnesis',
      items: [
        { label: 'Salam & Perkenalan', script: 'Assalamualaikum Bapak/Ibu, Selamat pagi. Saya dr. [Nama] yang berjaga saat ini.', insight: 'Senyum, Salam, Sapa' },
        { label: 'Informed Consent', isCritical: true, script: 'Izin melakukan pemeriksaan neurologis untuk mengetahui kondisi kesehatan fisik saat ini. Mungkin nanti perlu membuka sedikit pakaian. Apakah berkenan?' },
        { label: 'Identitas Pasien', script: 'Nama, Usia, Alamat, Pekerjaan, Status Pernikahan.' }
      ]
    },
    {
      type: 'standard_anamnesis',
      title: '2. Anamnesis (Sacred Seven)',
      data: {
        keluhan_utama: 'Keluhan utama pasien (misal: Nyeri kepala / Kelemahan)',
        rps: ['Lokasi: Dimana letaknya?', 'Onset: Sejak kapan?', 'Kronologi: Awal mulanya bagaimana?', 'Kualitas: Mengganggu? Terus menerus?', 'Sifat: Menjalar/Ditusuk/Berputar?'],
        rpd: ['Riwayat Hipertensi / DM / Trauma', 'Riwayat Stroke sebelumnya'],
        rpk: ['Riwayat penyakit serupa di keluarga'],
        script: '"Ada keluhan apa Bapak/Ibu? Ada yang bisa saya bantu?"'
      }
    },
    {
      type: 'checklist',
      title: '3. Pemeriksaan Rangsang Meningeal',
      items: [
        { label: 'Kaku Kuduk', description: 'Tekuk kepala ke dada. Tahanan (+)? Nyeri (+)?', isCritical: true },
        { label: 'Brudzinski 1', description: 'Fleksi kepala, perhatikan apakah lutut ikut menekuk?' },
        { label: 'Kernig Sign', description: 'Fleksi paha 90°, luruskan tungkai bawah. Tahanan < 135°?' },
        { label: 'Brudzinski 2', description: 'Fleksi satu tungkai, tungkai kontralateral ikut fleksi?' }
      ]
    },
    {
      type: 'checklist',
      title: '4. Pemeriksaan Koordinasi (Cerebellar)',
      items: [
        { label: 'Tes Telunjuk - Hidung', description: 'Pasien menyentuh hidung sendiri lalu telunjuk pemeriksa.' },
        { label: 'Tes Tumit - Lutut', description: 'Tumit disusurkan dari lutut ke bawah (tulang kering).' },
        { label: 'Romberg Test', description: 'Berdiri tegak, mata terbuka lalu tertutup 30 detik. Jatuh?' },
        { label: 'Disdiadokokinesia', description: 'Gerakan bolak-balik tangan dengan cepat.' }
      ]
    }
  ],
  cases: [] // Nanti diisi kasus neurologi
};