// src/data/categories.ts

export interface SystemCategory {
    id: string;
    label: string;
    shortLabel: string;
    color: string; // Representasi warna untuk UI (Tailwind class)
    icon?: string;
  }
  
  export const EXAM_CATEGORIES: SystemCategory[] = [
    { 
      id: 'kardiovaskular', 
      label: 'Kardiovaskular', 
      shortLabel: 'Kardiovaskular',
      color: 'text-rose-400 bg-rose-500/10 border-rose-500/20' 
    },
    { 
      id: 'respirasi', 
      label: 'Respirasi', 
      shortLabel: 'Respirasi',
      color: 'text-sky-400 bg-sky-500/10 border-sky-500/20' 
    },
    { 
      id: 'gastroenterohepatologi', 
      label: 'Gastroenterohepatologi', 
      shortLabel: 'Gastro & Hepato',
      color: 'text-amber-400 bg-amber-500/10 border-amber-500/20' 
    },
    { 
      id: 'nefrologi', 
      label: 'Nefrologi & Urologi', 
      shortLabel: 'Ginjal & Kemih',
      color: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20' 
    },
    { 
      id: 'reproduksi', 
      label: 'Reproduksi', 
      shortLabel: 'Obsgyn',
      color: 'text-pink-400 bg-pink-500/10 border-pink-500/20' 
    },
    { 
      id: 'neurologi', 
      label: 'Neurologi', 
      shortLabel: 'Neurologi',
      color: 'text-violet-400 bg-violet-500/10 border-violet-500/20' 
    },
    { 
      id: 'psikiatri', 
      label: 'Psikiatri', 
      shortLabel: 'Psikiatri',
      color: 'text-fuchsia-400 bg-fuchsia-500/10 border-fuchsia-500/20' 
    },
    { 
      id: 'endokrin', 
      label: 'Endokrin & Metabolik', 
      shortLabel: 'Endokrin & Metabolik',
      color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' 
    },
    { 
      id: 'muskuloskeletal', 
      label: 'Muskuloskeletal', 
      shortLabel: 'Muskuloskeletal',
      color: 'text-slate-400 bg-slate-500/10 border-slate-500/20' 
    },
    { 
      id: 'dermatovenerologi', 
      label: 'Dermatovenerologi', 
      shortLabel: 'Kulit & Kelamin',
      color: 'text-red-400 bg-red-500/10 border-red-500/20' 
    },
    { 
      id: 'oftalmologi', 
      label: 'Oftalmologi', 
      shortLabel: 'Oftalmologi',
      color: 'text-blue-400 bg-blue-500/10 border-blue-500/20' 
    },
    { 
      id: 'tht', 
      label: 'THT-KL', 
      shortLabel: 'THT',
      color: 'text-teal-400 bg-teal-500/10 border-teal-500/20' 
    },
    { 
      id: 'hematoimunologi', 
      label: 'Hematoimunologi & Tropis', 
      shortLabel: 'Tropis & Imun',
      color: 'text-orange-400 bg-orange-500/10 border-orange-500/20' 
    },
    { 
      id: 'forensik', 
      label: 'Forensik & Medikolegal', 
      shortLabel: 'Forensik',
      color: 'text-zinc-400 bg-zinc-500/10 border-zinc-500/20' 
    },
    { 
      id: 'ikm', 
      label: 'IKM & Biostatistik', 
      shortLabel: 'IKM & Riset',
      color: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20' 
    }
  ];