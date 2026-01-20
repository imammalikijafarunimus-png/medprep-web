import type { StationData } from '../osce_data';
import { casesIntegumen } from '../cases/integumen_cases';


export const stationIntegumen: StationData = {
  id: "integumen",
  title: "Integumen (Kulit)",
  icon: "sun",
  description: "Deskripsi Lesi Kulit dan Pemeriksaan Penunjang.",
  sections: [
    {
      type: 'standard_anamnesis',
      title: '1. Anamnesis Kulit',
      data: {
        keluhan_utama: 'Gatal / Bercak Merah / Benjolan',
        rps: [
          'Lokasi awal? Menyebar kemana?',
          'Keluhan: Gatal (Malam hari/Berkeringat)? Nyeri? Panas?',
          'Kronologi: Awalnya bintik lalu melepuh?',
          'Faktor pencetus: Makanan? Kontak bahan kimia? Hewan?'
        ],
        rpd: ['Riwayat alergi (Atopi)?', 'Pernah sakit serupa?'],
        rpk: ['Keluarga/Teman sekamar gatal juga? (Scabies)'],
        script: '"Gatalnya makin parah kalau berkeringat tidak Pak?"'
      }
    },
    {
      type: 'checklist',
      title: '2. Status Dermatologis (Deskripsi Lesi)',
      items: [
        { label: 'Regio (Lokasi)', description: 'Generalisata / Lokalisata (misal: Regio Fasialis, Trunkus).' },
        { label: 'Efloresensi Primer', description: 'Makula, Papul, Plak, Nodul, Vesikel, Bula, Pustul.' },
        { label: 'Efloresensi Sekunder', description: 'Skuama (Sisik), Krusta (Kereng), Erosi, Ekskoriasi, Ulkus.', isCritical: true },
        { label: 'Konfigurasi & Distribusi', description: 'Linier? Annular (Cincin)? Herpetiformis (Bergerombol)? Simetris/Asimetris?' }
      ]
    },
    {
      type: 'checklist',
      title: '3. Pemeriksaan Penunjang Sederhana',
      items: [
        { label: 'Diaskopi', description: 'Tekan lesi merah dengan kaca objek. Pucat = Vasodilatasi. Tetap merah = Purpura/Ekstravasasi.' },
        { label: 'Tes Sensibilitas (Kusta)', description: 'Kapas (Raba), Jarum (Nyeri), Tabung panas/dingin (Suhu) pada bercak putih.', isCritical: true },
        { label: 'Kerokan Kulit (KOH)', description: 'Untuk jamur. Ambil dari tepi lesi yang aktif. Larutkan KOH 10%.' },
        { label: 'Tzank Test', description: 'Untuk virus (Herpes/Varicella). Ambil dasar vesikel. Cari sel datia berinti banyak.' }
      ]
    }
  ],
  cases: casesIntegumen
};