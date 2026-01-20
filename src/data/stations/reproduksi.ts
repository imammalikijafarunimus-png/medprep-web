import type { StationData } from '../osce_data';
import { casesReproduksi } from '../cases/reproduksi_cases';

export const stationReproduksi: StationData = {
  id: "reproduksi",
  title: "Sistem Reproduksi",
  icon: "baby",
  description: "Pemeriksaan Kehamilan (ANC), Ginekologi, dan Kontrasepsi.",
  sections: [
    {
      type: 'checklist',
      title: '1. Pembukaan & Identitas',
      items: [
        { label: 'Salam & Perkenalan', script: 'Assalamualaikum Bu, Saya dr. [Nama].' },
        { label: 'Identitas & Status Pernikahan', script: 'Nama Ibu? Usia? Pekerjaan? Nama Suami? Menikah berapa lama?' },
        { label: 'Informed Consent', isCritical: true, script: 'Izin melakukan pemeriksaan kehamilan/dalam. Mungkin sedikit tidak nyaman. Apakah Ibu bersedia?' }
      ]
    },
    {
      type: 'standard_anamnesis',
      title: '2. Anamnesis (Pilih Sesuai Kasus)',
      data: {
        keluhan_utama: 'Hamil (Kontrol/Mulas) ATAU Masalah Kewanitaan (Nyeri/Keputihan)',
        rps: [
          'JIKA HAMIL (Obstetri): HPHT? Taksiran Partus? Gerak janin aktif? Mulas teratur? Keluar air-air/lendir darah?',
          'JIKA GINEKOLOGI: Siklus haid? Nyeri haid? Keputihan (Warna/Bau/Gatal)? Perdarahan pasca senggama?',
          'Riwayat Obstetri Lalu: G.. P.. A.. (Hamil berapa kali, Lahir, Keguguran)?'
        ],
        rpd: ['Riwayat Hipertensi (Preus)?', 'Riwayat SC?', 'Riwayat KB sebelumnya?'],
        rpk: ['Riwayat kencing manis/darah tinggi di keluarga?', 'Riwayat kembar?'],
        script: '"Ibu hamil anak keberapa? Hamil sebelumnya lancar bu? HPHT kapan?"'
      }
    },
    {
      type: 'checklist',
      title: '3. Pemeriksaan Obstetri (Ibu Hamil)',
      items: [
        { label: 'Inspeksi Abdomen', description: 'Membesar sesuai usia kehamilan? Striae? Bekas SC? Gerak janin terlihat?' },
        { label: 'Leopold I', description: 'Tentukan TFU (cm/jari). Tentukan bagian di fundus (Bokong/Kepala).', isCritical: true },
        { label: 'Leopold II', description: 'Tentukan Punggung (Kanan/Kiri) dan Bagian Kecil (Ekstremitas).', isCritical: true },
        { label: 'Leopold III', description: 'Tentukan bagian terendah janin (Presentasi). Sudah masuk PAP?' },
        { label: 'Leopold IV', description: 'Seberapa jauh masuk PAP (Divergen/Konvergen)? Perlimaan?' },
        { label: 'Auskultasi DJJ', description: 'Hitung DJJ 1 menit penuh (Normal: 120-160x/m).', isCritical: true }
      ]
    },
    {
      type: 'checklist',
      title: '4. Pemeriksaan Ginekologi',
      items: [
        { label: 'Posisi Litotomi', description: 'Pasien berbaring kaki ditekuk/di penyangga.' },
        { label: 'Inspeksi Genitalia Eksterna', description: 'Massa? Tanda radang? Fluor albus? Darah?' },
        { label: 'Pemeriksaan Inspekulo (Spekulum)', description: 'Masuk miring -> Putar -> Buka. Cek Portio (Licin/Erosi?), Ostium (Tertutup/Terbuka?), Fluxus (+/-)?', isCritical: true },
        { label: 'Pemeriksaan Bimanual (VT)', description: 'Dua jari masuk vagina, tangan lain di suprasimfisis. Cek Uterus (Ukuran/Nyeri goyang?), Adneksa (Massa/Nyeri?).' }
      ]
    },
    {
      type: 'checklist',
      title: '5. Keterampilan: Pelepasan Implan (KB)',
      items: [
        { label: 'Persiapan & Anestesi', description: 'Cuci tangan, pakai handscoon steril. Antiseptik area insisi. Anestesi Lidokain (Subkutan di bawah ujung kapsul). Cek efek anestesi.', isCritical: true },
        { label: 'Insisi & Eksplorasi', description: 'Insisi kecil (2-3mm) dekat ujung kapsul. Dorong kapsul ke arah insisi sampai ujungnya nongol.' },
        { label: 'Pencabutan', description: 'Jepit ujung kapsul dengan klem mosquito. Bersihkan jaringan ikat. Tarik perlahan. Pastikan kapsul utuh (1 atau 2 batang).', isCritical: true },
        { label: 'Penutupan Luka', description: 'Dekatkan tepi luka (steristrip/jahit 1 simpul). Tutup kassa tekan & plester. Edukasi luka kering 3 hari.' }
      ]
    }
  ],
  cases: casesReproduksi
};