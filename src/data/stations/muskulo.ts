import { StationData } from '../osce_data';

export const stationMuskulo: StationData = {
  id: "muskulo",
  title: "Muskuloskeletal",
  icon: "activity",
  description: "Pemeriksaan Ortopedi, Sendi, dan Trauma.",
  sections: [
    {
      type: 'checklist',
      title: '1. Prinsip Pemeriksaan (Look, Feel, Move)',
      items: [
        { label: 'Look (Inspeksi)', description: 'Gaya berjalan (Antalgic)? Deformitas? Bengkak? Warna kulit (Merah/Biru)? Atrofi otot?', isCritical: true },
        { label: 'Feel (Palpasi)', description: 'Suhu (Hangat)? Nyeri tekan? Krepitasi? Arteri distal teraba? Sensibilitas distal?', isCritical: true },
        { label: 'Move (Gerak)', description: 'Range of Motion (ROM) Aktif & Pasif. Terbatas/Bebas? Nyeri saat digerakkan?' }
      ]
    },
    {
      type: 'checklist',
      title: '2. Tes Khusus Lutut (ACL/PCL/Meniscus)',
      items: [
        { label: 'Anterior Drawer Test', description: 'Lutut fleksi 90. Tarik tibia ke depan. Goyang/Loose? (Curiga ACL).' },
        { label: 'Posterior Drawer Test', description: 'Dorong tibia ke belakang. (Curiga PCL).' },
        { label: 'Lachman Test', description: 'Lutut fleksi 30. Tarik tibia ke depan (Lebih sensitif untuk ACL).' },
        { label: 'McMurray Test', description: 'Rotasi tibia + Ekstensi lutut. Bunyi "Klik"? (Curiga Meniscus).' }
      ]
    },
    {
      type: 'checklist',
      title: '3. Tes Khusus Ankle',
      items: [
        { label: 'Thompson Test', description: 'Pasien tengkurap. Remas otot betis. Kaki tidak plantar fleksi? (Curiga Ruptur Tendon Achilles).', isCritical: true },
        { label: 'Anterior Drawer Ankle', description: 'Cek stabilitas ligamen talofibular anterior (ATFL).' }
      ]
    }
  ],
  cases: []
};