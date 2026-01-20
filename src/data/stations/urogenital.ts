import type { StationData } from '../osce_data';
import { casesUrogenital } from '../cases/urogenital_cases'; // <--- Import ini

export const stationUrogenital: StationData = {
  id: "urogenital",
  title: "Nefrologi & Urologi",
  icon: "droplet",
  description: "Pemeriksaan Ginjal, Saluran Kemih, dan Sirkumsisi.",
  sections: [
    {
      type: 'standard_anamnesis',
      title: '1. Anamnesis Urologi',
      data: {
        keluhan_utama: 'Nyeri Pinggang / Gangguan BAK',
        rps: ['Nyeri: Menjalar ke selangkangan (Kolik)?', 'BAK: Disuria? Polakisuria? Hematuria (Merah)?', 'Pancaran: Menetes/Bercabang?', 'Pasir/Batu keluar?'],
        rpd: ['Riwayat kencing batu?', 'Hipertensi/DM (Gagal Ginjal)?', 'Riwayat pasang kateter?'],
        rpk: ['Keluarga sakit ginjal?'],
        script: '"Kencingnya merah seperti air cucian daging atau teh pekat?"'
      }
    },
    {
      type: 'checklist',
      title: '2. Pemeriksaan Fisik Urologi',
      items: [
        { label: 'Sudut Costovertebrae (CVA)', description: 'Inspeksi (Massa/Tanda radang). Perkusi (Nyeri Ketok CVA +/-).', isCritical: true },
        { label: 'Suprapubik (Buli-buli)', description: 'Palpasi & Perkusi. Kesan penuh/kosong? Nyeri tekan?' },
        { label: 'Genitalia Eksterna (Pria)', description: 'Inspeksi OUE (Letak/Stenosis/Discharge). Palpasi Testis/Scrotum.' }
      ]
    },
    {
      type: 'checklist',
      title: '3. Keterampilan: Sirkumsisi (Dorsal Slit)',
      items: [
        { label: 'Asepsis & Anestesi', description: 'Desinfeksi genital. Anestesi Blok N. Dorsalis Penis + Infiltrasi Subkutan (Ring Block). Cek efek anestesi.', isCritical: true },
        { label: 'Membebaskan Perlengketan', description: 'Buka preputium, bersihkan smegma dengan klem tumpul.' },
        { label: 'Klem & Insisi', description: 'Klem jam 11, 1, dan 6. Gunting Dorsal Slit di jam 12. Gunting melingkar (Circumcision).', isCritical: true },
        { label: 'Hemostasis & Jahit', description: 'Kontrol perdarahan. Jahit mukosa-kulit (Jam 12, 6, 3, 9). Balut luka.' }
      ]
    }
  ],
  cases: casesUrogenital // <--- Masukkan di sini]
};