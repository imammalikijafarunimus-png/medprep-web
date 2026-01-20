import type { StationData } from '../osce_data';
import { casesGastro } from '../cases/gastro_cases';

export const stationGastro: StationData = {
  id: "gastro",
  title: "Gastroenterohepatologi",
  icon: "utensils",
  description: "Pemeriksaan Abdomen, Hepar, Lien, dan Rectal Toucher.",
  sections: [
    {
      type: 'standard_anamnesis',
      title: '1. Anamnesis Digesti',
      data: {
        keluhan_utama: 'Nyeri Perut / Muntah / BAB Darah / Kuning',
        rps: ['Lokasi Nyeri: Ulu hati? Kanan bawah? Menyebar?', 'BAB: Warna hitam (Melena)? Darah segar (Hematokezia)? Cair?', 'Muntah: Isi? Darah?', 'Kulit/Mata Kuning?'],
        rpd: ['Riwayat sakit maag?', 'Riwayat Hepatitis/Alkohol?', 'Riwayat Hemoroid?'],
        rpk: ['Keluarga sakit kuning/kanker usus?'],
        script: '"BAB-nya warna apa Pak? Seperti aspal atau darah segar?"'
      }
    },
    {
      type: 'checklist',
      title: '2. Pemeriksaan Abdomen',
      items: [
        { label: 'Inspeksi', description: 'Cembung/Datar? Caput medusa? Bekas operasi? Darm contour/Steifung?' },
        { label: 'Auskultasi (Dahulukan!)', description: 'Bising usus di semua kuadran. Normal/Meningkat/Menurun/Metalik Sound?', isCritical: true },
        { label: 'Perkusi', description: 'Timpani (seluruh lapang)? Pekak beralih (Shifting Dullness) untuk Ascites?', isCritical: true },
        { label: 'Palpasi', description: 'Nyeri tekan (McBurney/Murphy)? Massa? Hepatomegali (Lobus Kanan/Kiri)? Splenomegali (Schuffner)?' }
      ]
    },
    {
      type: 'checklist',
      title: '3. Pemeriksaan Khusus (Rectal Toucher)',
      items: [
        { label: 'Persiapan & Posisi', description: 'Litotomi atau Sim Position. Pakai jelly + handscoon.' },
        { label: 'Inspeksi Perianal', description: 'Hemoroid eksterna? Fisura? Fistula? Abses?' },
        { label: 'Palpasi (Colok Dubur)', description: 'Tonus Sfingter Ani (Jepit). Mukosa licin/berbenjol? Ampula kolaps/tidak? Prostat (Sulcus/Pole)?', isCritical: true },
        { label: 'Handscoon', description: 'Cek lendir dan darah pada sarung tangan setelah jari keluar.' }
      ]
    }
  ],
  cases: casesGastro
};