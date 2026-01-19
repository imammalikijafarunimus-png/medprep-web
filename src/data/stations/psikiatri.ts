import { StationData } from '../osce_data';

export const stationPsikiatri: StationData = {
  id: "psikiatri",
  title: "Psikiatri",
  icon: "smile",
  description: "Wawancara Psikiatri dan Status Mental.",
  sections: [
    {
      type: 'checklist',
      title: '1. Bina Rapport & Pembukaan',
      items: [
        { label: 'Salam & Perkenalan', script: 'Assalamualaikum, Selamat pagi. Saya dr. [Nama].' },
        { label: 'Bina Sambung Rasa (Rapport)', isCritical: true, script: 'Bapak/Ibu tampak tegang/sedih, ada yang bisa diceritakan? (Tunjukkan Empati)', insight: 'Tatap mata, condongkan badan, dengarkan aktif.' },
        { label: 'Identitas Pasien', script: 'Nama, Usia, Alamat, Pekerjaan, Status.' }
      ]
    },
    {
      type: 'standard_anamnesis',
      title: '2. Wawancara Keluhan',
      data: {
        keluhan_utama: 'Alasan dibawa ke RS (Marah-marah / Tidak bisa tidur / Murung)',
        rps: ['Onset: Sejak kapan? 2 minggu/1 bulan?', 'Stressor: Ada masalah apa sebelumnya?', 'Gejala: Halusinasi? Waham?'],
        rpd: ['Pernah sakit seperti ini?', 'Riwayat NAPZA / Alkohol?', 'Riwayat gangguan medis umum?'],
        rpk: ['Keluarga ada yang sakit jiwa?'],
        script: '"Bisa diceritakan awal mula keluhan bagaimana? Apakah mendengar bisikan?"'
      }
    },
    {
      type: 'psychiatry_status',
      title: '3. Status Mental (Penting!)',
      data: {
        penampilan: ['Wajar / Tidak wajar', 'Rapi / Lusuh', 'Sesuai usia?'],
        mood_afek: ['Mood: Eutimik/Depresif/Manik', 'Afek: Luas/Sempit/Datar', 'Keserasian: Serasi/Tidak'],
        pembicaraan: ['Spontan/Tidak', 'Volume', 'Intonasi', 'Koheren/Inkoheren'],
        persepsi: ['Halusinasi (Visual/Audio/Olfaktori)', 'Ilusi', 'Depersonalisasi'],
        pikiran: ['Arus: Logorrhea/Flight of Ideas', 'Isi: Waham (Kejar/Besar/Curiga)'],
        tilikan: 'Tilikan 1 (Sakal total) s.d Tilikan 6 (Sadar & mau berobat)',
        script: '"Apakah Bapak merasa memiliki kekuatan super? (Cek Waham)"'
      }
    }
  ],
  cases: []
};