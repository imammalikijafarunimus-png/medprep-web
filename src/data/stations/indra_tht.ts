import type { StationData } from '../osce_data';
import { casesTHT } from '../cases/indra_tht_cases';

export const stationTHT: StationData = {
  id: "indra_tht", // ID sementara, tidak dipakai di menu utama
  title: "Indra (THT-KL)",
  icon: "ear",
  description: "Pemeriksaan Telinga, Hidung, dan Tenggorok.",
  sections: [
    {
      type: 'standard_anamnesis',
      title: 'A. Anamnesis THT',
      data: {
        keluhan_utama: 'Gangguan pendengaran / Nyeri telinga / Hidung buntu',
        rps: ['Lokasi: Telinga kanan/kiri?', 'Onset: Akut/Kronis?', 'Sifat: Terus menerus/Hilang timbul?', 'Sekret: Ada cairan? Warna? Bau?', 'Gejala lain: Demam? Pusing berputar?'],
        rpd: ['Riwayat mengorek telinga?', 'Riwayat berenang?', 'Riwayat Alergi/Asma?', 'Penggunaan obat tetes?'],
        rpk: ['Riwayat keganasan di keluarga (Ca Nasofaring)?'],
        script: '"Telinganya sakit sejak kapan Pak? Keluar cairan tidak?"'
      }
    },
    {
      type: 'checklist',
      title: 'B. Pemeriksaan Telinga (Otoskopi)',
      items: [
        { label: 'Inspeksi & Palpasi Luar', description: 'Daun telinga (Mikrotia/Normal)? Nyeri tarik aurikula? Nyeri tekan tragus? Nyeri ketok mastoid?', isCritical: true },
        { label: 'Otoskopi (Liang Telinga)', description: 'Tarik aurikula ke Postero-Superior (Dewasa). Cek CAE: Lapang/Sempit? Edema? Hiperemis? Sekret? Serumen?' },
        { label: 'Otoskopi (Membran Timpani)', description: 'Intak/Perforasi? Refleks Cahaya (Cone of Light)? Retraksi/Bulging?', isCritical: true },
        { label: 'Tes Pendengaran (Garpu Tala)', description: 'Rinne, Weber, Swabach (Jika ada indikasi).' }
      ]
    },
    {
      type: 'checklist',
      title: 'C. Pemeriksaan Hidung (Rinoskopi)',
      items: [
        { label: 'Inspeksi & Palpasi Luar', description: 'Deformitas batang hidung? Nyeri tekan sinus (Frontalis/Maksilaris)?' },
        { label: 'Rinoskopi Anterior', description: 'Pegang spekulum dengan tangan kiri. Cek: Mukosa (Pucat/Hiperemis), Konka (Edema/Hipertrofi), Septum (Deviasi), Sekret, Massa/Polip.', isCritical: true }
      ]
    },
    {
      type: 'checklist',
      title: 'D. Pemeriksaan Tenggorok',
      items: [
        { label: 'Pemeriksaan Orofaring', description: 'Gunakan spatel lidah (tekan 2/3 anterior lidah). Cek: Uvula (letak), Arkus Faring, Dinding Faring Posterior (Granul?), Tonsil (Ukuran T1-T4, Detritus, Hiperemis).' }
      ]
    }
  ],
  cases: casesTHT
};