import React, { useMemo, useState } from "react";
import {
  ArrowLeft,
  Search,
  SlidersHorizontal,
  TrendingUp,
  BarChart3,
  Calendar,
  Target,
  Sparkles,
  Clock,
  Layers,
  Award,
  X,
  Info,
  CheckCircle2,
  Flame,
  ChevronDown,
} from "lucide-react";

/**
 * TrendAnalysis — Flow revisi (tanpa sidebar internal)
 * 1) Pilih Sistem (grid)
 * 2) Detail Sistem (tabs)
 * Cocok untuk web app yang sudah punya sidebar global (Dashboard/OSCE/CBT).
 */

/* =========================
   CONFIG
   ========================= */

type TabKey = "overview" | "freq" | "year" | "pred";

const MONTH_NAMES: Record<string, string> = {
  Jan: "Januari",
  Feb: "Februari",
  Mei: "Mei",
  Agt: "Agustus",
  Nov: "November",
};

const getPredictionTarget = () => {
  const month = new Date().getMonth();
  if (month >= 11 || month <= 1) return { key: "Feb" as const, label: "Februari" };
  if (month >= 2 && month <= 4) return { key: "Mei" as const, label: "Mei" };
  if (month >= 5 && month <= 7) return { key: "Agt" as const, label: "Agustus" };
  return { key: "Nov" as const, label: "November" };
};

const SYSTEM_COLORS: Record<
  string,
  { gradient: string; light: string; text: string; bar: string }
> = {
  Neurologi: {
    gradient: "from-indigo-500 to-purple-600",
    light: "bg-indigo-50 dark:bg-indigo-900/30",
    text: "text-indigo-600",
    bar: "bg-indigo-500",
  },
  Psikiatri: {
    gradient: "from-pink-500 to-rose-500",
    light: "bg-pink-50 dark:bg-pink-900/30",
    text: "text-pink-600",
    bar: "bg-pink-500",
  },
  Indra: {
    gradient: "from-cyan-500 to-blue-500",
    light: "bg-cyan-50 dark:bg-cyan-900/30",
    text: "text-cyan-600",
    bar: "bg-cyan-500",
  },
  Kardiovaskular: {
    gradient: "from-red-500 to-orange-500",
    light: "bg-red-50 dark:bg-red-900/30",
    text: "text-red-600",
    bar: "bg-red-500",
  },
  "Gastroentero Hepatologi": {
    gradient: "from-amber-500 to-yellow-500",
    light: "bg-amber-50 dark:bg-amber-900/30",
    text: "text-amber-600",
    bar: "bg-amber-500",
  },
  "Ginjal & Saluran Kemih": {
    gradient: "from-teal-500 to-emerald-500",
    light: "bg-teal-50 dark:bg-teal-900/30",
    text: "text-teal-600",
    bar: "bg-teal-500",
  },
  "Obstetri & Ginekologi": {
    gradient: "from-rose-500 to-pink-400",
    light: "bg-rose-50 dark:bg-rose-900/30",
    text: "text-rose-600",
    bar: "bg-rose-500",
  },
  "Endokrin Metabolisme": {
    gradient: "from-blue-500 to-indigo-500",
    light: "bg-blue-50 dark:bg-blue-900/30",
    text: "text-blue-600",
    bar: "bg-blue-500",
  },
  Hematoimunologi: {
    gradient: "from-violet-500 to-purple-500",
    light: "bg-violet-50 dark:bg-violet-900/30",
    text: "text-violet-600",
    bar: "bg-violet-500",
  },
  Muskuloskeletal: {
    gradient: "from-slate-600 to-slate-400",
    light: "bg-slate-50 dark:bg-slate-900/40",
    text: "text-slate-600 dark:text-slate-300",
    bar: "bg-slate-500",
  },
  Integumen: {
    gradient: "from-lime-500 to-green-500",
    light: "bg-lime-50 dark:bg-lime-900/30",
    text: "text-lime-700 dark:text-lime-400",
    bar: "bg-lime-500",
  },
};

/* =========================
   DATA (PASTE DATA KAMU DI SINI)
   - Kalau kamu sudah import TREND_DATA dari file lain, hapus block ini
   ========================= */

const TREND_DATA: Record<string, any> = {
  Neurologi: {
    top3: [
      { name: "Bell's Palsy", count: 9, pct: 12.5 },
      { name: "BPPV (Vertigo)", count: 8, pct: 11.1 },
      { name: "TTH (Nyeri Kepala)", count: 8, pct: 11.1 },
    ],
    frequency: [
      { name: "Bell's Palsy", count: 9, pct: 12.5 },
      { name: "BPPV", count: 8, pct: 11.1 },
      { name: "TTH", count: 8, pct: 11.1 },
      { name: "Cluster Headache", count: 7, pct: 9.7 },
      { name: "CTS", count: 6, pct: 8.3 },
      { name: "Trigeminal Neuralgia", count: 5, pct: 6.9 },
      { name: "Stroke Iskemik", count: 4, pct: 5.6 },
      { name: "Parkinson", count: 4, pct: 5.6 },
      { name: "Lainnya", count: 21, pct: 29.2 },
    ],
    yearly: [
      { period: "2016-2019", text: "Dominasi Bell's Palsy & Nyeri Kepala." },
      { period: "2022-2024", text: "Muncul kasus Parkinson & Jepitan Saraf (CTS/TTS)." },
      { period: "2025", text: "Tren Stroke TIA & Neuropati DM meningkat." },
    ],
    monthly: {
      Feb: ["Cluster Headache", "BPPV", "Bell's Palsy"],
      Mei: ["TTH", "Stroke TIA", "LBP/HNP"],
      Agt: ["TTH", "Parkinson", "Neuropati DM"],
      Nov: ["Bell's Palsy", "BPPV", "Stroke Iskemik"],
    },
    tips: {
      Feb: "Cluster Headache sering muncul Februari. Fokus bedakan dengan Migrain.",
      Mei: "TTH & LBP sering muncul. Kuasai pemeriksaan Lasegue.",
      Agt: "Kasus Parkinson & Neuropati DM naik. Latih pemeriksaan Romberg.",
      Nov: "Bell's Palsy & BPPV adalah 'Raja' di bulan ini. Pastikan skill N. VII & Epley lancar.",
    },
  },
  Psikiatri: {
    top3: [
      { name: "PTSD", count: 11, pct: 12.6 },
      { name: "Gangguan Cemas", count: 10, pct: 11.5 },
      { name: "Insomnia", count: 10, pct: 11.5 },
    ],
    frequency: [
      { name: "PTSD", count: 11, pct: 12.6 },
      { name: "GCM", count: 10, pct: 11.5 },
      { name: "Insomnia", count: 10, pct: 11.5 },
      { name: "Skizofrenia", count: 9, pct: 10.3 },
      { name: "Bipolar", count: 9, pct: 10.3 },
      { name: "Waham", count: 7, pct: 8.0 },
      { name: "Depresi", count: 6, pct: 6.9 },
      { name: "Gangguan Panik", count: 6, pct: 6.9 },
      { name: "Lainnya", count: 19, pct: 21.8 },
    ],
    yearly: [
      { period: "Awal", text: "Bipolar & Psikotik Akut mendominasi." },
      { period: "Tengah", text: "Somatisasi & PTSD meningkat." },
      { period: "Akhir", text: "Skizofrenia & GCM kembali naik." },
    ],
    monthly: {
      Feb: ["Gangguan Cemas", "Bipolar Depresi", "Skizofrenia"],
      Mei: ["Depresi Postpartum", "PTSD", "Disfungsi Seksual"],
      Agt: ["PTSD", "Skizofrenia", "Bipolar"],
      Nov: ["PTSD (Sangat Kuat)", "Gangguan Waham", "GCM"],
    },
    tips: {
      Feb: "Fokus diagnosis banding Bipolar Depresi vs Unipolar.",
      Mei: "Depresi Postpartum naik. Gunakan EPDS.",
      Agt: "Skizofrenia sering muncul. Pahami gejala positif vs negatif.",
      Nov: "PTSD adalah prediksi terkuat di November.",
    },
  },
  Kardiovaskular: {
    top3: [
      { name: "Atrial Fibrilasi", count: 13, pct: 16.5 },
      { name: "Syok Anafilaktik", count: 9, pct: 11.4 },
      { name: "Syok Hipovolemik", count: 8, pct: 10.1 },
    ],
    frequency: [
      { name: "Atrial Fibrilasi", count: 13, pct: 16.5 },
      { name: "Syok Anafilaktik", count: 9, pct: 11.4 },
      { name: "Syok Hipovolemik", count: 8, pct: 10.1 },
      { name: "RJP / Cardiac Arrest", count: 8, pct: 10.1 },
      { name: "Angina Pektoris", count: 7, pct: 8.9 },
      { name: "STEMI/UAP", count: 12, pct: 15.2 },
      { name: "Lainnya", count: 22, pct: 27.8 },
    ],
    yearly: [
      { period: "Awal", text: "Fokus BLS & Syok." },
      { period: "Tengah", text: "Aritmia (AF/SVT) & SKA." },
      { period: "Akhir", text: "Kombinasi Aritmia & Emergency." },
    ],
    monthly: {
      Feb: ["Syok Anafilaktik", "AF", "SKA"],
      Mei: ["SKA", "VES/SVT", "Limfangitis"],
      Agt: ["Syok Hipovolemik", "AF", "STEMI"],
      Nov: ["AF", "Syok/RJP", "ADHF"],
    },
    tips: {
      Feb: "Syok Anafilaktik sering jadi kasus OSCE. Ingat dosis Epinephrin.",
      Mei: "SKA dominan. Kuasai criteria TIMI Risk Score.",
      Agt: "Syok Hipovolemik dominan. Latih pemasangan A-line/IV Line.",
      Nov: "AF adalah kasus wajib. Jangan lupa skill BLS untuk Syok/RJP.",
    },
  },
  Indra: {
    top3: [
      { name: "Rhinitis Alergi", count: 11, pct: 10.4 },
      { name: "Corpus Alienum", count: 11, pct: 10.4 },
      { name: "Otitis Media Akut", count: 9, pct: 8.5 },
    ],
    frequency: [
      { name: "Rhinitis Alergi", count: 11, pct: 10.4 },
      { name: "Corpus Alienum", count: 11, pct: 10.4 },
      { name: "OMA", count: 9, pct: 8.5 },
      { name: "Episkleritis", count: 7, pct: 6.6 },
      { name: "Konjungtivitis", count: 6, pct: 5.7 },
      { name: "Blefaritis", count: 6, pct: 5.7 },
      { name: "Tonsilitis", count: 5, pct: 4.7 },
      { name: "Lainnya", count: 51, pct: 48.0 },
    ],
    yearly: [
      { period: "Umum", text: "Seimbang antara Mata & THT." },
      { period: "Trend", text: "Corpus Alienum sering muncul tiap tahun." },
    ],
    monthly: {
      Feb: ["Corpus Alienum", "Rhinitis", "Konjungtivitis"],
      Mei: ["Blefaritis", "Faringitis", "Miopia"],
      Agt: ["OMA", "Rhinitis", "Dry Eye"],
      Nov: ["Glaukoma", "Blefaritis", "Tonsilitis"],
    },
    tips: {
      Feb: "Skill ekstraksi benda asing penting.",
      Mei: "Blefaritis sering muncul. Latih instruksi lid hygiene.",
      Agt: "OMA naik. Bedakan stadium OMA.",
      Nov: "Waspada Glaukoma Akut (Emergency).",
    },
  },
  "Gastroentero Hepatologi": {
    top3: [
      { name: "Demam Tifoid", count: 7, pct: 8.1 },
      { name: "Hepatitis A", count: 6, pct: 7.0 },
      { name: "Apendisitis Akut", count: 6, pct: 7.0 },
    ],
    frequency: [
      { name: "Demam Tifoid", count: 7, pct: 8.1 },
      { name: "Hepatitis A", count: 6, pct: 7.0 },
      { name: "Apendisitis", count: 6, pct: 7.0 },
      { name: "Hemoroid", count: 6, pct: 7.0 },
      { name: "Gastritis/GERD", count: 6, pct: 7.0 },
      { name: "Amoebiasis", count: 5, pct: 5.8 },
      { name: "Lainnya", count: 50, pct: 58.1 },
    ],
    yearly: [
      { period: "Umum", text: "Infeksi & Bedah seimbang." },
      { period: "Catatan", text: "Kasus tindakan NGT sering muncul." },
    ],
    monthly: {
      Feb: ["Tifoid", "Hep A", "Parasit"],
      Mei: ["Apendisitis", "GERD", "Peritonitis"],
      Agt: ["Tifoid", "Amoebiasis", "Omfalitis"],
      Nov: ["Apendisitis", "Tifoid", "Abses Hepar"],
    },
    tips: {
      Feb: "Infeksi Tropis dominan. Pahami diagnosis Tifoid.",
      Mei: "Apendisitis naik. Latih pemeriksaan Blumberg.",
      Agt: "Amoebiasis kuat. Bedakan disentri amoeba vs basiler.",
      Nov: "Apendisitis & Tifoid sering jadi kasus akut.",
    },
  },
  "Ginjal & Saluran Kemih": {
    top3: [
      { name: "Sistitis", count: 9, pct: 11.8 },
      { name: "Vesikolithiasis", count: 8, pct: 10.5 },
      { name: "GNAPS", count: 8, pct: 10.5 },
    ],
    frequency: [
      { name: "Sistitis", count: 9, pct: 11.8 },
      { name: "Vesikolithiasis", count: 8, pct: 10.5 },
      { name: "GNAPS", count: 8, pct: 10.5 },
      { name: "Pielonefritis", count: 7, pct: 9.2 },
      { name: "Retensio Urin", count: 6, pct: 7.9 },
      { name: "Ureterolithiasis", count: 5, pct: 6.6 },
      { name: "Lainnya", count: 33, pct: 43.5 },
    ],
    yearly: [
      { period: "Trend", text: "ISK & Batu saluran kemih mendominasi." },
      { period: "Tindakan", text: "Fimosis & Kateterisasi sering diuji." },
    ],
    monthly: {
      Feb: ["Sistitis", "Pielonefritis", "GNAPS"],
      Mei: ["Fimosis", "Vesikolithiasis", "Uretritis"],
      Agt: ["Vesikolithiasis", "GNAPS", "Retensio"],
      Nov: ["Batu Ginjal/Ureter", "Retensio (Kateter)", "Parafimosis"],
    },
    tips: {
      Feb: "GNAPS sering di anak. Pahami kriteria major & minor.",
      Mei: "Fimosis sering muncul. Bedakan dengan Parafimosis.",
      Agt: "Vesikolithiasis & GNAPS. Latih pemeriksaan edema periorbital.",
      Nov: "Latih pemasangan kateter (Retensio Urin).",
    },
  },
  "Obstetri & Ginekologi": {
    top3: [
      { name: "Bakterial Vaginosis", count: 11, pct: 14.1 },
      { name: "Kandidiasis", count: 7, pct: 9.0 },
      { name: "Gonorrhea", count: 7, pct: 9.0 },
    ],
    frequency: [
      { name: "Bakterial Vaginosis", count: 11, pct: 14.1 },
      { name: "Kandidiasis", count: 7, pct: 9.0 },
      { name: "Gonorrhea", count: 7, pct: 9.0 },
      { name: "ANC Normal", count: 6, pct: 7.7 },
      { name: "KPD", count: 5, pct: 6.4 },
      { name: "Ca Serviks", count: 5, pct: 6.4 },
      { name: "PEB", count: 4, pct: 5.1 },
      { name: "KB (IUD)", count: 6, pct: 7.7 },
      { name: "Lainnya", count: 27, pct: 34.6 },
    ],
    yearly: [
      { period: "Pola", text: "Infeksi genital & ANC komplikasi." },
      { period: "Tindakan", text: "Pemasangan KB sering diuji skill." },
    ],
    monthly: {
      Feb: ["GO", "Mastitis", "PEB"],
      Mei: ["BV", "PID", "Abortus"],
      Agt: ["KB (IUD)", "Ca Serviks", "KPD"],
      Nov: ["KB (IUD/Implan)", "Ca Serviks", "PEB"],
    },
    tips: {
      Feb: "PEB & Mastitis. Latih pemeriksaan refleks patella.",
      Mei: "Abortus & PID. Pahami jenis abortus.",
      Agt: "KPD & IUD. Latih konseling KB.",
      Nov: "Konseling & pemasangan KB (IUD) adalah skill wajib.",
    },
  },
  "Endokrin Metabolisme": {
    top3: [
      { name: "Sindrom Metabolik", count: 16, pct: 28.6 },
      { name: "KAD/HHS", count: 11, pct: 19.6 },
      { name: "DM Tipe 2", count: 7, pct: 12.5 },
    ],
    frequency: [
      { name: "Sindrom Metabolik", count: 16, pct: 28.6 },
      { name: "KAD/HHS", count: 11, pct: 19.6 },
      { name: "DM T2", count: 7, pct: 12.5 },
      { name: "Grave's Disease", count: 6, pct: 10.7 },
      { name: "Gizi Buruk", count: 5, pct: 8.9 },
      { name: "Hipoglikemia", count: 4, pct: 7.1 },
      { name: "Gout", count: 4, pct: 7.1 },
      { name: "Lainnya", count: 3, pct: 5.3 },
    ],
    yearly: [
      { period: "Trend", text: "Sindrom Metabolik naik signifikan." },
      { period: "Emergency", text: "KAD/HHS konsisten tinggi." },
    ],
    monthly: {
      Feb: ["Sindrom Metabolik", "DM", "Hipertiroid"],
      Mei: ["KAD/HHS", "Sindrom Metabolik", "Grave's"],
      Agt: ["Sindrom Metabolik", "KAD", "DM"],
      Nov: ["Sindrom Metabolik", "Gizi Buruk", "Hipoglikemia"],
    },
    tips: {
      Feb: "Hipertiroid & Metabolik. Pahami kriteria klinis.",
      Mei: "KAD/HHS emergency! Latih pemasangan infus.",
      Agt: "DM & Metabolik. Fokus edukasi diet DM.",
      Nov: "Sindrom Metabolik & Gizi Buruk. Latih pemeriksaan antropometri.",
    },
  },
  Hematoimunologi: {
    top3: [
      { name: "Imunisasi/KMS", count: 16, pct: 22.5 },
      { name: "Anemia", count: 10, pct: 14.1 },
      { name: "Malaria", count: 8, pct: 11.3 },
    ],
    frequency: [
      { name: "Imunisasi", count: 16, pct: 22.5 },
      { name: "Anemia", count: 10, pct: 14.1 },
      { name: "Malaria", count: 8, pct: 11.3 },
      { name: "Leptospirosis", count: 6, pct: 8.5 },
      { name: "DHF", count: 6, pct: 8.5 },
      { name: "RA", count: 6, pct: 8.5 },
      { name: "Lainnya", count: 19, pct: 26.6 },
    ],
    yearly: [
      { period: "Pola", text: "Imunisasi (Anak) & Penyakit Tropis." },
      { period: "Dewasa", text: "Kasus Autoimun (RA/SLE) cukup sering." },
    ],
    monthly: {
      Feb: ["Autoimun (RA/SLE)", "Anemia", "Malaria"],
      Mei: ["Imunisasi", "DHF", "Leptospirosis"],
      Agt: ["Imunisasi", "Syok DSS", "Tropis"],
      Nov: ["Anemia ADB", "Autoimun", "Malaria"],
    },
    tips: {
      Feb: "Autoimun naik. Pahami kriteria ACR untuk RA.",
      Mei: "Imunisasi & DHF. Latih teknik injeksi IM.",
      Agt: "DSS (Syok Dengue) emergency. Asuhan cairan agresif.",
      Nov: "Anemia ADB sering muncul. Pahami terapi Fe.",
    },
  },
  Muskuloskeletal: {
    top3: [
      { name: "Fraktur", count: 27, pct: 29.0 },
      { name: "Ankle Sprain", count: 10, pct: 10.8 },
      { name: "Gout Artritis", count: 9, pct: 9.7 },
    ],
    frequency: [
      { name: "Fraktur", count: 27, pct: 29.0 },
      { name: "Ankle Sprain", count: 10, pct: 10.8 },
      { name: "Gout", count: 9, pct: 9.7 },
      { name: "OA Genu", count: 8, pct: 8.6 },
      { name: "Knee Sprain", count: 7, pct: 7.5 },
      { name: "Tenosinovitis", count: 6, pct: 6.5 },
      { name: "Meniscus", count: 6, pct: 6.5 },
      { name: "Lainnya", count: 20, pct: 21.4 },
    ],
    yearly: [
      { period: "Trend", text: "Fraktur selalu mendominasi." },
      { period: "Non-Trauma", text: "Gout & OA cukup tinggi." },
    ],
    monthly: {
      Feb: ["Fraktur (Humerus/Femur)", "Sprain", "Gout"],
      Mei: ["Fraktur (Radius/Ulna)", "OA", "Tenosinovitis"],
      Agt: ["Fraktur (Tibia)", "Sprain", "Gout"],
      Nov: ["OA Genu", "Meniscus Tear", "Tenosinovitis"],
    },
    tips: {
      Feb: "Fraktur besar. Kuasai pemeriksaan neurovaskular.",
      Mei: "Fraktur Radius & Tenosinovitis. Latih manuver Finkelstein.",
      Agt: "Fraktur Tibia & Gout. Pahami gout diet.",
      Nov: "Skill Pembidaian & Pemeriksaan OA Genu penting.",
    },
  },
  Integumen: {
    top3: [
      { name: "Vulnus (Luka)", count: 10, pct: 12.7 },
      { name: "Tinea", count: 8, pct: 10.1 },
      { name: "Dermatitis Atopik", count: 6, pct: 7.6 },
    ],
    frequency: [
      { name: "Vulnus", count: 10, pct: 12.7 },
      { name: "Tinea", count: 8, pct: 10.1 },
      { name: "Dermatitis Atopik", count: 6, pct: 7.6 },
      { name: "M. Hansen", count: 4, pct: 5.1 },
      { name: "Herpes Zoster", count: 5, pct: 6.3 },
      { name: "Moluscum", count: 4, pct: 5.1 },
      { name: "Lainnya", count: 37, pct: 46.1 },
    ],
    yearly: [
      { period: "Infeksi", text: "Jamur (Tinea) & Bakteri (Folikulitis)." },
      { period: "Tindakan", text: "Jahit luka (Suturing) sering diuji." },
    ],
    monthly: {
      Feb: ["Dermatitis", "Tinea", "Vulnus"],
      Mei: ["Vulnus (Jahit)", "Moluscum", "Herpes"],
      Agt: ["Dermatitis", "Skabies", "M. Hansen"],
      Nov: ["Vulnus", "Tinea", "IMS (Sifilis)"],
    },
    tips: {
      Feb: "Dermatitis Kontak sering. Tanyakan pajanan alergen.",
      Mei: "Teknik menjahit luka wajib di periode ini.",
      Agt: "Skabies & M. Hansen. Pahami tanda kardinal.",
      Nov: "Vulnus & Tinea dominan. Latih teknik jahit dan KOH prep.",
    },
  },
};

/* =========================
   HELPERS
   ========================= */

function cx(...classes: Array<string | false | undefined | null>) {
  return classes.filter(Boolean).join(" ");
}

function formatPct(n: number) {
  if (Number.isNaN(n)) return "0%";
  return `${n}%`;
}

function sumCounts(freq: Array<{ count: number }>) {
  return (freq || []).reduce((acc, x) => acc + (Number(x.count) || 0), 0);
}

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function Pill({
  children,
  tone = "neutral",
}: {
  children: React.ReactNode;
  tone?: "neutral" | "info" | "good" | "warn";
}) {
  const map = {
    neutral:
      "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200 border-slate-200 dark:border-slate-700",
    info:
      "bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-200 border-blue-200 dark:border-blue-800/30",
    good:
      "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-200 border-emerald-200 dark:border-emerald-800/30",
    warn:
      "bg-amber-50 text-amber-800 dark:bg-amber-900/10 dark:text-amber-200 border-amber-200 dark:border-amber-800/30",
  } as const;

  return (
    <span
      className={cx(
        "inline-flex items-center gap-1 rounded-full border px-3 py-1 text-[11px] font-black",
        map[tone]
      )}
    >
      {children}
    </span>
  );
}

function TabButton({
  active,
  onClick,
  icon: Icon,
  label,
  badge,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  label: string;
  badge?: string;
}) {
  return (
    <button
      onClick={onClick}
      className={cx(
        "inline-flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-black transition-all",
        active
          ? "border-slate-900 bg-slate-900 text-white shadow-lg dark:border-white/10 dark:bg-white/10"
          : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:text-slate-900 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-slate-700 dark:hover:text-white"
      )}
      aria-pressed={active}
    >
      <Icon size={14} />
      <span className="whitespace-nowrap">{label}</span>
      {badge ? (
        <span
          className={cx(
            "ml-1 rounded-full px-2 py-[2px] text-[10px] font-black",
            active
              ? "bg-white/15 text-white"
              : "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200"
          )}
        >
          {badge}
        </span>
      ) : null}
    </button>
  );
}

function SectionCard({
  title,
  icon: Icon,
  right,
  children,
}: {
  title: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  right?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-[1.75rem] border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-center justify-between gap-3 px-6 pt-6">
        <div className="flex items-center gap-2">
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-2xl bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200">
            <Icon size={18} />
          </span>
          <h3 className="text-sm font-black tracking-tight text-slate-900 dark:text-white">
            {title}
          </h3>
        </div>
        {right}
      </div>
      <div className="px-6 pb-6 pt-4">{children}</div>
    </div>
  );
}

/* =========================
   MAIN COMPONENT
   ========================= */

export default function TrendAnalysisFlowClean() {
  const [selectedSystem, setSelectedSystem] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<TabKey>("overview");

  // Picker controls
  const [query, setQuery] = useState("");
  const [showControls, setShowControls] = useState(false);
  const [sortMode, setSortMode] = useState<"topCount" | "totalCount" | "name">("topCount");

  // Frequency controls
  const [freqLimit, setFreqLimit] = useState<5 | 8 | 999>(8);

  const predictionTarget = useMemo(() => getPredictionTarget(), []);
  const lastUpdatedText = useMemo(() => {
    const d = new Date();
    const pad = (n: number) => `${n}`.padStart(2, "0");
    return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()} · ${pad(
      d.getHours()
    )}:${pad(d.getMinutes())}`;
  }, []);

  const allSystems = useMemo(() => Object.keys(TREND_DATA || {}), []);
  const filteredSystems = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = allSystems.filter((sys) => {
      if (!q) return true;
      const top = TREND_DATA[sys]?.top3?.[0]?.name?.toLowerCase?.() ?? "";
      return sys.toLowerCase().includes(q) || top.includes(q);
    });

    const withMetrics = list.map((sys) => {
      const topCount = Number(TREND_DATA[sys]?.top3?.[0]?.count ?? 0);
      const totalCount = sumCounts(TREND_DATA[sys]?.frequency ?? []);
      return { sys, topCount, totalCount };
    });

    withMetrics.sort((a, b) => {
      if (sortMode === "name") return a.sys.localeCompare(b.sys);
      if (sortMode === "totalCount") return b.totalCount - a.totalCount;
      return b.topCount - a.topCount;
    });

    return withMetrics.map((x) => x.sys);
  }, [allSystems, query, sortMode]);

  const systemData = selectedSystem ? TREND_DATA[selectedSystem] : null;
  const colorStyle = selectedSystem
    ? SYSTEM_COLORS[selectedSystem] || SYSTEM_COLORS["Neurologi"]
    : null;

  /* =========================
     VIEW 1: SYSTEM PICKER
     ========================= */
  if (!selectedSystem) {
    return (
      <div className="min-h-screen bg-slate-100 px-4 py-6 dark:bg-slate-950">
        <div className="mx-auto max-w-6xl space-y-5">
          {/* Header (tanpa meniru app shell, jadi aman dipasang dalam OSCE Center) */}
          <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <Pill tone="neutral">
                    <TrendingUp size={12} />
                    OSCE Center · Analisis Tren Kasus
                  </Pill>
                  <Pill tone="neutral">
                    <Clock size={12} />
                    Updated {lastUpdatedText}
                  </Pill>
                </div>

                <h1 className="mt-3 text-2xl font-black tracking-tight text-slate-900 dark:text-white">
                  Pilih Sistem untuk Mulai
                </h1>
                <p className="mt-2 max-w-2xl text-sm text-slate-600 dark:text-slate-300">
                  Setelah memilih sistem, kamu bisa buka <span className="font-bold">Ringkasan</span>,{" "}
                  <span className="font-bold">Frekuensi</span>, <span className="font-bold">Pola</span>,
                  dan <span className="font-bold">Prediksi</span>.
                </p>

                <div className="mt-4 flex flex-wrap gap-2">
                  <Pill tone="info">
                    <Award size={12} />
                    Top 3
                  </Pill>
                  <Pill tone="neutral">
                    <BarChart3 size={12} />
                    Distribusi
                  </Pill>
                  <Pill tone="warn">
                    <Target size={12} />
                    Prediksi {predictionTarget.label}
                  </Pill>
                </div>
              </div>

              <button
                onClick={() => setShowControls((v) => !v)}
                className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2.5 text-xs font-black text-slate-700 shadow-sm transition hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
              >
                <SlidersHorizontal size={14} />
                Filter & Sort
                <ChevronDown size={14} className={cx("transition", showControls && "rotate-180")} />
              </button>
            </div>

            {/* Controls */}
            <div className="mt-5 grid gap-3 md:grid-cols-[1fr_360px]">
              <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Cari sistem / top diagnosis…"
                  className="w-full rounded-2xl border border-slate-200 bg-white py-3 pl-10 pr-10 text-sm font-semibold text-slate-800 outline-none transition focus:border-slate-300 focus:ring-2 focus:ring-slate-400/20 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100 dark:focus:border-slate-700"
                />
                {query ? (
                  <button
                    onClick={() => setQuery("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200"
                    aria-label="Hapus pencarian"
                  >
                    <X size={14} />
                  </button>
                ) : null}
              </div>

              {showControls ? (
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900/40">
                  <div className="text-[11px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Urutkan
                  </div>
                  <div className="mt-2 grid grid-cols-3 gap-2">
                    {[
                      { id: "topCount" as const, label: "Top #1" },
                      { id: "totalCount" as const, label: "Total" },
                      { id: "name" as const, label: "A–Z" },
                    ].map((s) => (
                      <button
                        key={s.id}
                        onClick={() => setSortMode(s.id)}
                        className={cx(
                          "rounded-xl border px-3 py-2 text-[11px] font-black transition",
                          sortMode === s.id
                            ? "border-slate-900 bg-slate-900 text-white dark:border-white/10 dark:bg-white/10"
                            : "border-slate-200 bg-white text-slate-700 hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-slate-700"
                        )}
                        aria-pressed={sortMode === s.id}
                      >
                        {s.label}
                      </button>
                    ))}
                  </div>

                  <div className="mt-3 flex items-center justify-between">
                    <Pill tone="neutral">
                      <CheckCircle2 size={12} />
                      {filteredSystems.length} sistem
                    </Pill>
                    <button
                      onClick={() => {
                        setSortMode("topCount");
                        setQuery("");
                      }}
                      className="text-xs font-black text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white"
                    >
                      Reset
                    </button>
                  </div>
                </div>
              ) : (
                <div className="hidden md:block" />
              )}
            </div>
          </div>

          {/* Grid systems */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredSystems.map((sys) => {
              const cs = SYSTEM_COLORS[sys] || SYSTEM_COLORS["Neurologi"];
              const top1 = TREND_DATA[sys]?.top3?.[0];
              const total = sumCounts(TREND_DATA[sys]?.frequency ?? []);

              return (
                <button
                  key={sys}
                  onClick={() => {
                    setSelectedSystem(sys);
                    setActiveTab("overview");
                    setFreqLimit(8);
                  }}
                  className="group relative overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white p-5 text-left shadow-sm transition hover:-translate-y-[1px] hover:border-slate-300 hover:shadow-lg dark:border-slate-800 dark:bg-slate-900 dark:hover:border-slate-700"
                >
                  <div className={cx("absolute inset-0 opacity-0 transition-opacity group-hover:opacity-10", `bg-gradient-to-br ${cs.gradient}`)} />

                  <div className="relative">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="text-[11px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">
                          {sys}
                        </div>
                        <div className="mt-1 line-clamp-1 text-sm font-black text-slate-900 dark:text-white">
                          {top1?.name ?? "-"}
                        </div>
                        <div className="mt-2 text-xs text-slate-600 dark:text-slate-300">
                          Total kasus: <span className="font-extrabold">{total}</span>
                        </div>
                      </div>

                      <div className={cx("rounded-2xl px-3 py-2 text-right", cs.light)}>
                        <div className={cx("text-2xl font-black leading-none", cs.text)}>
                          {top1?.count ?? 0}
                        </div>
                        <div className="mt-1 text-[11px] font-bold text-slate-600 dark:text-slate-300">
                          {formatPct(Number(top1?.pct ?? 0))}
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 flex flex-wrap gap-2">
                      <Pill tone="info">
                        <Award size={12} />
                        Top 1
                      </Pill>
                      <Pill tone="warn">
                        <Target size={12} />
                        Target {predictionTarget.label}
                      </Pill>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Empty */}
          {filteredSystems.length === 0 ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-6 text-center text-sm text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300">
              Tidak ada hasil. Coba kata kunci lain.
            </div>
          ) : null}
        </div>
      </div>
    );
  }

  /* =========================
     VIEW 2: SYSTEM DETAIL
     ========================= */

  if (!systemData) {
    return (
      <div className="min-h-screen bg-slate-100 px-4 py-10 dark:bg-slate-950">
        <div className="mx-auto max-w-3xl rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
          <div className="text-sm font-black text-slate-900 dark:text-white">
            Data sistem tidak ditemukan.
          </div>
          <button
            onClick={() => setSelectedSystem(null)}
            className="mt-4 rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-black text-slate-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
          >
            Kembali
          </button>
        </div>
      </div>
    );
  }

  const top1 = systemData.top3?.[0];
  const maxPct = Math.max(1, ...((systemData.frequency ?? []).map((x: any) => Number(x.pct) || 0)));

  return (
    <div className="min-h-screen bg-slate-100 px-4 py-6 dark:bg-slate-950">
      <div className="mx-auto max-w-6xl space-y-5">
        {/* Header Detail */}
        <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div className="flex items-start gap-3">
              <button
                onClick={() => setSelectedSystem(null)}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-400/40 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
                aria-label="Kembali ke pilih sistem"
                title="Kembali"
              >
                <ArrowLeft size={18} />
              </button>

              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <Pill tone="neutral">
                    <Flame size={12} />
                    Sistem
                  </Pill>
                  <Pill tone="neutral">
                    <Clock size={12} />
                    Updated {lastUpdatedText}
                  </Pill>
                </div>

                <h1 className="mt-2 text-2xl font-black tracking-tight text-slate-900 dark:text-white">
                  {selectedSystem}
                </h1>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                  Pilih tab untuk melihat ringkasan, frekuensi, pola, dan prediksi.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 md:justify-end">
              <Pill tone="info">
                <Info size={12} />
                Data 2016–2025
              </Pill>
              <Pill tone="warn">
                <Target size={12} />
                Target: {predictionTarget.label}
              </Pill>
            </div>
          </div>

          {/* Tabs */}
          <div className="mt-5 flex flex-wrap gap-2">
            <TabButton
              active={activeTab === "overview"}
              onClick={() => setActiveTab("overview")}
              icon={TrendingUp}
              label="Ringkasan"
            />
            <TabButton
              active={activeTab === "freq"}
              onClick={() => setActiveTab("freq")}
              icon={BarChart3}
              label="Frekuensi"
              badge={String(systemData.frequency?.length ?? 0)}
            />
            <TabButton
              active={activeTab === "year"}
              onClick={() => setActiveTab("year")}
              icon={Layers}
              label="Pola"
            />
            <TabButton
              active={activeTab === "pred"}
              onClick={() => setActiveTab("pred")}
              icon={Target}
              label={`Prediksi (${predictionTarget.label})`}
            />
          </div>
        </div>

        {/* OVERVIEW */}
        {activeTab === "overview" ? (
          <div className="space-y-5">
            {/* Hero */}
            <div
              className={cx(
                "relative overflow-hidden rounded-[2rem] p-6 text-white shadow-xl",
                colorStyle?.gradient ? `bg-gradient-to-br ${colorStyle.gradient}` : "bg-teal-600"
              )}
            >
              <div className="absolute -right-10 -top-10 h-44 w-44 rounded-full bg-white/10 blur-2xl" />
              <div className="absolute -bottom-10 -left-10 h-44 w-44 rounded-full bg-white/10 blur-2xl" />

              <div className="relative">
                <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                  <div>
                    <div className="text-xs font-black uppercase tracking-wider text-white/80">
                      Fokus utama
                    </div>
                    <div className="mt-2 text-2xl font-black tracking-tight">
                      {top1?.name ?? "-"}
                    </div>
                    <div className="mt-2 text-sm text-white/80">
                      {top1?.count ?? 0} kasus · {formatPct(Number(top1?.pct ?? 0))}
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 md:justify-end">
                    <Pill tone="neutral">
                      <BarChart3 size={12} />
                      Total {sumCounts(systemData.frequency ?? [])}
                    </Pill>
                    <Pill tone="neutral">
                      <Target size={12} />
                      #{(systemData.monthly?.[predictionTarget.key] ?? [])[0] ?? "-"}
                    </Pill>
                  </div>
                </div>

                <div className="mt-5 grid gap-3 md:grid-cols-3">
                  {(systemData.top3 ?? []).map((item: any, idx: number) => (
                    <div
                      key={`${item.name}-${idx}`}
                      className="rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur"
                    >
                      <div className="flex items-center justify-between">
                        <div className="text-[11px] font-black uppercase tracking-wider text-white/70">
                          Top #{idx + 1}
                        </div>
                        <Pill tone="neutral">
                          <CheckCircle2 size={12} />
                          {formatPct(Number(item.pct ?? 0))}
                        </Pill>
                      </div>

                      <div className="mt-2 text-3xl font-black">
                        {item.count}
                        <span className="ml-1 text-base font-bold text-white/70">x</span>
                      </div>
                      <div className="mt-2 text-sm font-extrabold">{item.name}</div>
                      <div className="mt-2 text-xs text-white/80">
                        Latih alur: anamnesis → PE → tatalaksana awal (singkat).
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Quick tips month target */}
            <SectionCard
              title={`Pro Tip (${predictionTarget.label})`}
              icon={Sparkles}
              right={
                <Pill tone="warn">
                  <Sparkles size={12} />
                  tajam
                </Pill>
              }
            >
              <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-amber-900 dark:border-amber-800/30 dark:bg-amber-900/10 dark:text-amber-200">
                <div className="text-sm font-extrabold">
                  {systemData.tips?.[predictionTarget.key] ?? "—"}
                </div>
                <div className="mt-2 text-xs opacity-90">
                  Ulang 2–3x sampai alurnya “otomatis”.
                </div>
              </div>
            </SectionCard>
          </div>
        ) : null}

        {/* FREQUENCY */}
        {activeTab === "freq" ? (
          <SectionCard
            title="Distribusi Frekuensi"
            icon={BarChart3}
            right={
              <div className="flex items-center gap-2">
                <Pill tone="neutral">
                  <BarChart3 size={12} />
                  {systemData.frequency?.length ?? 0} item
                </Pill>
                <div className="rounded-full border border-slate-200 bg-white p-1 dark:border-slate-800 dark:bg-slate-900">
                  {[
                    { id: 5 as const, label: "Top 5" },
                    { id: 8 as const, label: "Top 8" },
                    { id: 999 as const, label: "All" },
                  ].map((b) => (
                    <button
                      key={b.id}
                      onClick={() => setFreqLimit(b.id)}
                      className={cx(
                        "rounded-full px-3 py-1.5 text-[11px] font-black transition",
                        freqLimit === b.id
                          ? "bg-slate-900 text-white dark:bg-white/10"
                          : "text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white"
                      )}
                      aria-pressed={freqLimit === b.id}
                    >
                      {b.label}
                    </button>
                  ))}
                </div>
              </div>
            }
          >
            <div className="space-y-3">
              {(systemData.frequency ?? [])
                .slice(0, freqLimit === 999 ? 999 : freqLimit)
                .map((item: any, idx: number) => {
                  const w = clamp(((Number(item.pct) || 0) / maxPct) * 100, 2, 100);

                  return (
                    <div
                      key={`${item.name}-${idx}`}
                      className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900/40"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <div className="line-clamp-1 text-sm font-extrabold text-slate-900 dark:text-white">
                            {item.name}
                          </div>
                          <div className="mt-1 text-xs text-slate-600 dark:text-slate-300">
                            {item.count}x · {formatPct(Number(item.pct ?? 0))}
                          </div>
                        </div>

                        <Pill tone="neutral">
                          <Award size={12} />
                          #{idx + 1}
                        </Pill>
                      </div>

                      <div className="mt-3 h-2.5 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                        <div
                          className={cx("h-full rounded-full", colorStyle?.bar || "bg-teal-500")}
                          style={{ width: `${w}%` }}
                          aria-label={`Bar frekuensi ${item.name}`}
                        />
                      </div>
                    </div>
                  );
                })}
            </div>
          </SectionCard>
        ) : null}

        {/* YEAR / MONTH MAP */}
        {activeTab === "year" ? (
          <div className="space-y-5">
            <SectionCard
              title="Pola Tahunan (Ringkas)"
              icon={Layers}
              right={
                <Pill tone="neutral">
                  <Clock size={12} />
                  per periode
                </Pill>
              }
            >
              <div className="grid gap-3 md:grid-cols-2">
                {(systemData.yearly ?? []).map((y: any, idx: number) => (
                  <div
                    key={`${y.period}-${idx}`}
                    className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900/40"
                  >
                    <Pill tone="info">{y.period}</Pill>
                    <div className="mt-3 text-sm font-semibold text-slate-700 dark:text-slate-200">
                      {y.text}
                    </div>
                  </div>
                ))}
              </div>
            </SectionCard>

            <SectionCard
              title="Peta Bulanan"
              icon={Calendar}
              right={
                <Pill tone="warn">
                  <Target size={12} />
                  target {predictionTarget.label}
                </Pill>
              }
            >
              <div className="grid gap-3 md:grid-cols-4">
                {Object.entries(systemData.monthly ?? {}).map(([month, cases]: [string, any]) => {
                  const isTarget = predictionTarget.key === (month as any);
                  return (
                    <div
                      key={month}
                      className={cx(
                        "rounded-2xl border p-4 transition",
                        isTarget
                          ? "border-teal-500 bg-teal-50 ring-2 ring-teal-500/20 dark:border-teal-400/60 dark:bg-teal-900/15"
                          : "border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900/40"
                      )}
                    >
                      <div className="flex items-center justify-between">
                        <div
                          className={cx(
                            "text-xs font-black",
                            isTarget
                              ? "text-teal-700 dark:text-teal-200"
                              : "text-slate-500 dark:text-slate-400"
                          )}
                        >
                          {MONTH_NAMES[month] ?? month}
                        </div>
                        {isTarget ? (
                          <Pill tone="good">
                            <Sparkles size={12} />
                            target
                          </Pill>
                        ) : null}
                      </div>

                      <ul className="mt-3 space-y-2">
                        {(cases ?? []).map((c: string, i: number) => (
                          <li
                            key={`${month}-${i}`}
                            className="flex items-start gap-2 text-xs text-slate-700 dark:text-slate-200"
                          >
                            <span
                              className={cx(
                                "mt-1 inline-block h-2 w-2 rounded-full",
                                isTarget ? "bg-teal-500" : "bg-slate-300 dark:bg-slate-600"
                              )}
                            />
                            <span className="leading-snug">{c}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  );
                })}
              </div>
            </SectionCard>
          </div>
        ) : null}

        {/* PREDICTION */}
        {activeTab === "pred" ? (
          <div className="space-y-5">
            <div
              className={cx(
                "relative overflow-hidden rounded-[2rem] p-6 text-white shadow-xl",
                colorStyle?.gradient ? `bg-gradient-to-br ${colorStyle.gradient}` : "bg-teal-600"
              )}
            >
              <div className="absolute -right-10 -top-10 h-44 w-44 rounded-full bg-white/10 blur-2xl" />
              <div className="absolute -bottom-10 -left-10 h-44 w-44 rounded-full bg-white/10 blur-2xl" />

              <div className="relative">
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                  <div>
                    <div className="inline-flex items-center gap-2 text-white/90">
                      <Target size={18} />
                      <div className="text-xs font-black uppercase tracking-wider">
                        Prediksi Bulan {predictionTarget.label}
                      </div>
                    </div>
                    <div className="mt-2 text-2xl font-black tracking-tight">
                      Checklist latihan sebelum periode
                    </div>
                    <div className="mt-2 text-sm text-white/80">
                      Fokus pada 3 kasus teratas + satu skill OSCE kunci.
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 md:justify-end">
                    <Pill tone="neutral">
                      <Info size={12} />
                      historical pattern
                    </Pill>
                    <Pill tone="neutral">
                      <Clock size={12} />
                      {lastUpdatedText}
                    </Pill>
                  </div>
                </div>

                <div className="mt-5">
                  <div className="text-[11px] font-black uppercase tracking-wider text-white/70">
                    Kasus paling berpotensi
                  </div>

                  <div className="mt-3 flex flex-wrap gap-2">
                    {(systemData.monthly?.[predictionTarget.key] ?? []).map((p: string, i: number) => (
                      <span
                        key={`${predictionTarget.key}-${i}`}
                        className="rounded-full border border-white/25 bg-white/15 px-4 py-2 text-sm font-black shadow-lg backdrop-blur"
                      >
                        {p}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <SectionCard title="OSCE Pro Tip" icon={Sparkles}>
              <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-amber-900 dark:border-amber-800/30 dark:bg-amber-900/10 dark:text-amber-200">
                <div className="text-sm font-extrabold">
                  {systemData.tips?.[predictionTarget.key] ?? "—"}
                </div>
                <div className="mt-2 text-xs opacity-90">
                  Saran: latih skenario 2–3x sampai alur klinisnya otomatis.
                </div>
              </div>
            </SectionCard>
          </div>
        ) : null}
      </div>
    </div>
  );
}