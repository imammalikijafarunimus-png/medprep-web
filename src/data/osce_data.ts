// src/data/osce_data.ts

// --- 1. DEFINISI TYPE & INTERFACE ---

export type OSCECategory = 
  | 'Neurologi' | 'Psikiatri' | 'Indra' | 'Respirasi' | 'Kardiovaskular' 
  | 'Gastroenterohepatologi' | 'Ginjal & Saluran Kemih' | 'Reproduksi' 
  | 'Endokrin & Metabolisme' | 'Hemato & Imunologi' | 'Muskuloskeletal' 
  | 'Integumen' | 'Kegawatdaruratan';

// Interface untuk Tipe Alert/Kotak Info (High Yield, Clinical Pearls, dll)
export type AlertType = 'key-difference' | 'clinical-pearls' | 'high-yield' | 'mnemonic';

export interface ContentBlock {
  type: 'text' | 'alert';
  content: string;
  alertType?: AlertType;
}

export interface CaseStudy {
  id: string;
  title: string;
  system: string; 
  level_skdi: string; 
  frequency: number; // 1-5 Bintang
  summary: string; 
  content: {
    etiologi?: string; // Tambahkan field ini untuk kelengkapan
    anamnesis: {
      keluhan_utama: string;
      list_pertanyaan: string[];
    };
    pemeriksaan_fisik: string[];
    pemeriksaan_penunjang?: string[];
    diagnosis: {
      working_diagnosis: string;
      differential_diagnosis: string[];
      penunjang: string[];
      gold_standard: string;
    };
    tatalaksana: {
      farmakologi: string[];
      non_farmakologi: string[];
    };
    osce_tip: string;
  };
}

export interface ChecklistItem {
  label: string;
  description?: string;
  isCritical?: boolean;
  insight?: string;
  script?: string;
}

export interface OSCESection {
  type: 'checklist'; // Fokus pada checklist untuk simulator
  title: string;
  items: ChecklistItem[];
}

export interface StationData {
  id: string;
  title: string;
  icon: string;
  description: string;
  sections: OSCESection[];
  cases: CaseStudy[];
}

// --- 2. DATA MENU UTAMA ---
export const SYSTEM_LIST = [
  { id: 'neurologi', label: 'Neurologi', system: 'Saraf', icon: 'brain' },
  { id: 'psikiatri', label: 'Psikiatri', system: 'Jiwa', icon: 'smile' },
  { id: 'indra', label: 'Indra (Mata THT)', system: 'Sensorik', icon: 'eye' },
  { id: 'respirasi', label: 'Respirasi', system: 'Paru', icon: 'wind' },
  { id: 'kardiovaskular', label: 'Kardiovaskular', system: 'Jantung', icon: 'heart' },
  { id: 'gastro', label: 'Gastroenterohepatologi', system: 'Pencernaan', icon: 'utensils' },
  { id: 'urogenital', label: 'Urogenital', system: 'Ginjal & Sal. Kemih', icon: 'droplet' },
  { id: 'reproduksi', label: 'Reproduksi', system: 'Obsgyn', icon: 'baby' },
  { id: 'endokrin', label: 'Endokrin & Metabolik', system: 'Hormon', icon: 'zap' },
  { id: 'hemato', label: 'Hemato & Imunologi', system: 'Darah', icon: 'shield' },
  { id: 'muskulo', label: 'Muskuloskeletal', system: 'Tulang & Otot', icon: 'activity' },
  { id: 'integumen', label: 'Integumen', system: 'Kulit', icon: 'sun' },
  { id: 'gadar', label: 'Kegawatdaruratan', system: 'Emergency', icon: 'siren' },
];

// --- 3. IMPORT DATA STASIUN (PASTIKAN FILE INI ADA) ---
import { stationNeurologi } from './stations/neurologi';
import { stationPsikiatri } from './stations/psikiatri';
import { stationMata } from './stations/indra_mata';
import { stationTHT } from './stations/indra_tht';
import { stationRespirasi } from './stations/respirasi';
import { stationKardio } from './stations/kardiovaskular';
import { stationGastro } from './stations/gastro';
import { stationUrogenital } from './stations/urogenital';
import { stationReproduksi } from './stations/reproduksi';
import { stationEndokrin } from './stations/endokrin';
import { stationHemato } from './stations/hemato';
import { stationMuskulo } from './stations/muskulo';
import { stationIntegumen } from './stations/integumen';
import { stationGadar } from './stations/gadar';

// --- 4. EXPORT DATA GABUNGAN ---
export const STATION_DATA: Record<string, StationData> = {
  neurologi: stationNeurologi,
  psikiatri: stationPsikiatri,
  indra: {
    id: "indra",
    title: "Sistem Indra (Mata & THT)",
    icon: "eye",
    description: "Pemeriksaan Visus, Segmen Mata, Telinga, Hidung, Tenggorok.",
    sections: [
        ...stationMata.sections.map(s => ({...s, title: `[MATA] ${s.title}`})), 
        ...stationTHT.sections.map(s => ({...s, title: `[THT] ${s.title}`}))
    ] as any, 
    cases: [ ...stationMata.cases, ...stationTHT.cases ]
  },
  respirasi: stationRespirasi,
  kardiovaskular: stationKardio,
  gastro: stationGastro,
  urogenital: stationUrogenital,
  reproduksi: stationReproduksi,
  endokrin: stationEndokrin,
  hemato: stationHemato,
  muskulo: stationMuskulo,
  integumen: stationIntegumen,
  gadar: stationGadar,
};