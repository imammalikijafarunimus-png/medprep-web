// --- 1. DEFINISI LEGO BLOCKS (INTERFACE) ---

export type OSCECategory = 
  | 'Neurologi' | 'Psikiatri' | 'Indra' | 'Respirasi' | 'Kardiovaskular' 
  | 'Gastroenterohepatologi' | 'Ginjal & Saluran Kemih' | 'Reproduksi' 
  | 'Endokrin & Metabolisme' | 'Hemato & Imunologi' | 'Muskuloskeletal' 
  | 'Integumen' | 'Kegawatdaruratan';

export interface SectionStandardAnamnesis {
  type: 'standard_anamnesis';
  title: string;
  data: {
    keluhan_utama: string;
    rps: string[];
    rpd: string[];
    rpk: string[];
    kebiasaan?: string[];
    script?: string;
  };
}

export interface SectionPediatricHistory {
  type: 'pediatric_history';
  title: string;
  data: {
    prenatal: string[];
    natal: string[];
    postnatal: string[];
    nutrisi: string[];
    script?: string;
  };
}

export interface SectionPsychiatryStatus {
  type: 'psychiatry_status';
  title: string;
  data: {
    penampilan: string[];
    mood_afek: string[];
    pembicaraan: string[];
    persepsi: string[];
    pikiran: string[];
    tilikan: string;
    script?: string;
  };
}

export interface SectionChecklist {
  type: 'checklist';
  title: string;
  items: {
    label: string;
    description?: string;
    isCritical?: boolean;
    insight?: string;
    script?: string;
  }[];
}

export type OSCESection = 
  | SectionStandardAnamnesis 
  | SectionPediatricHistory 
  | SectionPsychiatryStatus 
  | SectionChecklist;

export interface CaseStudy {
  id: string;
  title: string;
  frequency: number;
  tags: string[];
  summary: string;
  content: {
    definition: string;
    etiology: string[];
    riskFactors?: string[];
    anamnesis: { symptoms: string[]; negatives?: string[] };
    physicalExam: string[];
    diagnosis: { lab?: string; goldStandard: string };
    treatment: { pharm: string[]; nonPharm?: string[] };
    osceTip: string;
  };
}

export interface StationData {
  id: string;
  title: string;
  icon: string;
  description: string;
  sections: OSCESection[];
  cases: CaseStudy[];
}

// --- 2. IMPORT DATA DARI FILE TERPISAH ---
// Pastikan file-file ini sudah Anda buat di folder src/data/stations/
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

// --- 3. DATA MENU UTAMA ---
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

// --- 4. EXPORT DATA GABUNGAN ---
export const STATION_DATA: Record<string, StationData> = {
  // ... (Stase sebelumnya biarkan sama) ...
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
    ] as any, // Cast any sementara agar aman
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