import { StationData } from '../osce_data';

export const stationMata: StationData = {
  id: "indra",
  title: "Indra (Mata)",
  icon: "eye",
  description: "Pemeriksaan Visus dan Segmen Anterior/Posterior.",
  sections: [
    {
      type: 'checklist',
      title: '1. Persiapan & Visus',
      items: [
        { label: 'Cuci Tangan & Salam', isCritical: true },
        { label: 'Pemeriksaan Visus (Snellen)', description: 'Jarak 6 meter. Periksa mata kanan (OD) dulu, kiri (OS) ditutup. Lanjut Pinhole jika tidak 6/6.' },
        { label: 'Koreksi Kacamata', description: 'Trial lens jika visus tidak maju dengan pinhole.' }
      ]
    },
    {
      type: 'checklist',
      title: '2. Segmen Anterior',
      items: [
        { label: 'Palpebra', description: 'Edema? Hiperemis? Entropion/Ektropion? Ptosis?' },
        { label: 'Konjungtiva', description: 'Anemis? Injeksi Konjungtiva/Siliar? Sekret?' },
        { label: 'Kornea', description: 'Jernih/Keruh? Infiltrat? Ulkus? (Pakai senter dari samping)' },
        { label: 'Bilik Mata Depan (COA)', description: 'Dalam/Dangkal? Hifema? Hipopion?' },
        { label: 'Iris & Pupil', description: 'Bulat? Sentral? Refleks cahaya langsung/tidak langsung?' },
        { label: 'Lensa', description: 'Jernih/Keruh (Katarak)? Shadow Test?' }
      ]
    },
    {
      type: 'checklist',
      title: '3. Segmen Posterior (Funduskopi)',
      items: [
        { label: 'Refleks Fundus', description: 'Jarak 30cm. Cemerlang (Jingga)?' },
        { label: 'Papil N. Opticus', description: 'Batas tegas? Warna? CDR (Cup Disc Ratio)?' },
        { label: 'Retina & Makula', description: 'Perdarahan? Eksudat? Refleks fovea?' }
      ]
    }
  ],
  cases: []
};