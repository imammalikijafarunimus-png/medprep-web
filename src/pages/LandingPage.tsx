import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Menu, X, Check, ArrowRight, Brain, Stethoscope, Heart,
  BookOpen, Star, Shield, PlayCircle, Moon, Sun, Award,
  CheckCircle2, Sparkles, Zap, Quote, Instagram, MessageCircle,
  Clock, ListChecks, Mic, AlertCircle, HeartHandshake, XCircle,
  Users, Trophy, TrendingUp
} from 'lucide-react';

// ─────────────────────────────────────────────
// META TAGS HELPER
// ─────────────────────────────────────────────
function updateMeta(title, description, imageUrl) {
  document.title = title;
  const setMeta = (property, content, useProperty = false) => {
    const selector = useProperty ? `meta[property="${property}"]` : `meta[name="${property}"]`;
    let el = document.querySelector(selector);
    if (!el) {
      el = document.createElement('meta');
      if (useProperty) el.setAttribute('property', property);
      else el.setAttribute('name', property);
      document.head.appendChild(el);
    }
    el.setAttribute('content', content);
  };
  setMeta('description', description);
  setMeta('og:title', title, true);
  setMeta('og:description', description, true);
  setMeta('og:image', imageUrl, true);
  setMeta('og:type', 'website', true);
  setMeta('twitter:card', 'summary_large_image');
  setMeta('twitter:title', title);
  setMeta('twitter:description', description);
}

// ─────────────────────────────────────────────
// DATA
// ─────────────────────────────────────────────
const TESTIMONIALS = [
  {
    name: "Fasha",
    role: "Lulusan UKMPPD Batch Nov 2025",
    univ: "Univ. Diponegoro",
    quote:
      "Fitur Insight-nya benar-benar 'game changer'. Saat ujian OSCE stase psikiatri dan bioetika, saya jadi jauh lebih tenang dan percaya diri.",
    rating: 5,
  },
  {
    name: "Amirah",
    role: "Mahasiswa FK Tahap Profesi",
    univ: "Univ. Muhammadiyah Semarang",
    quote:
      "Bank soalnya sangat relevan. Pembahasan tidak hanya medis, tapi ada 'touch' kemanusiaan yang sering dilupakan di buku teks biasa.",
    rating: 5,
  },
  {
    name: "Annisa",
    role: "Co-Ass Stase Jiwa",
    univ: "Univ. Abdurrab",
    quote:
      "Checklist OSCE-nya juara. Runtut, sistematis, dan timernya bikin simulasi berasa ujian beneran. Wajib punya buat pejuang One Shot.",
    rating: 5,
  },
];

const STATS = [
  { icon: Users,    value: "30+", label: "Mahasiswa Aktif" },
  { icon: Trophy,   value: "97%",    label: "Lulus One Shot"  },
  { icon: BookOpen, value: "300+", label: "Bank Soal"       },
  { icon: Star,     value: "4.9★",   label: "Rating Pengguna" },
];

const ADMIN_WA = import.meta.env.VITE_ADMIN_WA_NUMBER || "6288980507501";

// ─────────────────────────────────────────────
// AVATAR INITIALS
// ─────────────────────────────────────────────
const AVATAR_COLORS = [
  "from-indigo-400 to-purple-500",
  "from-teal-400 to-emerald-500",
  "from-rose-400 to-pink-500",
];
function Avatar({ name, index }) {
  const initials = name
    .replace(/^dr\.\s*/i, '')
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase();
  return (
    <div
      className={`w-10 h-10 rounded-full bg-gradient-to-tr ${AVATAR_COLORS[index % AVATAR_COLORS.length]} flex items-center justify-center text-white text-xs font-black shadow-md select-none`}
    >
      {initials}
    </div>
  );
}

// ─────────────────────────────────────────────
// DEMO VIDEO MODAL
// ─────────────────────────────────────────────
function DemoModal({ isOpen, onClose }) {
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;
  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center bg-black/70 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-3xl mx-4 bg-slate-900 rounded-3xl overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-9 h-9 bg-white/10 rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-colors"
        >
          <X size={18} />
        </button>
        {/* Placeholder — ganti src dengan URL video demo sesungguhnya */}
        <div className="aspect-video flex items-center justify-center bg-slate-800">
          <div className="text-center text-slate-400">
            <PlayCircle size={48} className="mx-auto mb-3 opacity-50" />
            <p className="text-sm font-medium">
              Video demo akan segera hadir
            </p>
            <p className="text-xs mt-1 opacity-60">
              Set{' '}
              <code className="bg-white/10 px-1 rounded">
                VITE_DEMO_VIDEO_URL
              </code>{' '}
              di .env
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// MAIN LANDING PAGE
// ─────────────────────────────────────────────
export default function LandingPage() {
  const navigate = useNavigate();

  // ── Theme — lazy initializer (SSR-safe) ──
  const [theme, setTheme] = useState(() => {
    if (typeof window === 'undefined') return 'light';
    return localStorage.getItem('theme') || 'light';
  });

  const [isScrolled, setIsScrolled]         = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [demoMode, setDemoMode]             = useState('medis');
  const [billingCycle, setBillingCycle]     = useState('midyear');
  const [isDemoOpen, setIsDemoOpen]         = useState(false);

  // ── Scroll listener ──
  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // ── Apply theme ──
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') root.classList.add('dark');
    else root.classList.remove('dark');
    localStorage.setItem('theme', theme);
  }, [theme]);

  // ── Meta tags ──
  useEffect(() => {
    updateMeta(
      'MedPrep — Lulus UKMPPD One Shot',
      'Platform belajar kedokteran #1 dengan Bank Soal Klinis, Checklist OSCE, dan Wawasan Bioetika Islam.',
      `${window.location.origin}/og-image.png`
    );
  }, []);

  // ── Pricing helpers ──
  const getPrice = (plan) => {
    const table = { basic: { monthly: '15rb', midyear: '45rb', lifetime: '99rb' },
                    expert: { monthly: '25rb', midyear: '75rb', lifetime: '149rb' } };
    return table[plan][billingCycle];
  };
  const getDurationLabel = () =>
    ({ monthly: '/ bulan', midyear: 'per 6 bulan', lifetime: 'sekali bayar' }[billingCycle]);

  const toggleTheme = () => setTheme((p) => (p === 'light' ? 'dark' : 'light'));

  // ── Smooth scroll to section ──
  const scrollTo = (id) => {
    setIsMobileMenuOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#050505] font-sans text-slate-900 dark:text-white transition-colors duration-500 overflow-x-hidden selection:bg-teal-500 selection:text-white">

      {/* DEMO MODAL */}
      <DemoModal isOpen={isDemoOpen} onClose={() => setIsDemoOpen(false)} />

      {/* BACKGROUND AMBIENCE */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-teal-400/20 dark:bg-teal-500/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-indigo-400/20 dark:bg-indigo-500/10 rounded-full blur-[120px] animate-pulse delay-1000" />
      </div>

      {/* ─── NAVBAR ─── */}
      <nav
        className={`fixed w-full z-50 transition-all duration-300 ${
          isScrolled
            ? 'bg-white/80 dark:bg-black/80 backdrop-blur-xl border-b border-slate-200 dark:border-white/5 py-4 shadow-sm'
            : 'bg-transparent py-6'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          {/* Logo */}
          <button
            className="flex items-center gap-2.5 font-black text-2xl tracking-tighter cursor-pointer"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            <div className="w-9 h-9 bg-gradient-to-br from-indigo-600 to-teal-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-teal-500/20">
              M
            </div>
            <span className="text-slate-900 dark:text-white">MedPrep</span>
          </button>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8 font-bold text-sm text-slate-500 dark:text-slate-400">
            {[
              { label: 'Home',     id: 'home'      },
              { label: 'Fitur',    id: 'fitur'     },
              { label: 'Testimoni',id: 'testimoni' },
              { label: 'Harga',    id: 'harga'     },
            ].map(({ label, id }) => (
              <button
                key={id}
                onClick={() => scrollTo(id)}
                className="hover:text-teal-600 dark:hover:text-white transition-colors"
              >
                {label}
              </button>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-full bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-white hover:scale-110 transition-transform active:scale-95"
              aria-label="Toggle tema"
            >
              {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
            </button>
            <button
              onClick={() => navigate('/login')}
              className="px-5 py-2.5 font-bold text-sm text-slate-600 dark:text-slate-300 hover:text-teal-600 dark:hover:text-white transition-colors"
            >
              Masuk
            </button>
            <button
              onClick={() => navigate('/register')}
              className="px-6 py-2.5 rounded-full bg-slate-900 dark:bg-white text-white dark:text-black font-bold text-sm hover:scale-105 transition-transform shadow-xl shadow-teal-500/10"
            >
              Daftar Gratis
            </button>
          </div>

          {/* Mobile top-right */}
          <div className="flex items-center gap-4 md:hidden">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-white"
              aria-label="Toggle tema"
            >
              {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
            </button>
            <button
              className="text-slate-900 dark:text-white"
              onClick={() => setIsMobileMenuOpen((p) => !p)}
              aria-label="Buka menu"
            >
              {isMobileMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 w-full bg-white/95 dark:bg-black/95 backdrop-blur-xl border-b border-slate-100 dark:border-white/10 p-6 flex flex-col gap-4 shadow-xl">
            {[
              { label: 'Home',     id: 'home'      },
              { label: 'Fitur',    id: 'fitur'     },
              { label: 'Testimoni',id: 'testimoni' },
              { label: 'Harga',    id: 'harga'     },
            ].map(({ label, id }) => (
              <button
                key={id}
                onClick={() => scrollTo(id)}
                className="text-sm font-bold text-slate-600 dark:text-slate-300 py-2 text-left"
              >
                {label}
              </button>
            ))}
            <hr className="border-slate-100 dark:border-white/10" />
            <button onClick={() => navigate('/login')}    className="w-full py-3 font-bold text-slate-600 dark:text-slate-300">Masuk</button>
            <button onClick={() => navigate('/register')} className="w-full py-3 bg-teal-600 text-white rounded-xl font-bold">Daftar Sekarang</button>
          </div>
        )}
      </nav>

      {/* ─── HERO ─── */}
      <section id="home" className="relative pt-32 pb-20 px-6 z-10">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">

          <div className="animate-in fade-in slide-in-from-left duration-1000 text-center lg:text-left">
            {/* Live badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-teal-50 dark:bg-teal-900/30 border border-teal-100 dark:border-teal-800 text-teal-700 dark:text-teal-300 text-[10px] font-bold uppercase tracking-wider mb-6">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-teal-500" />
              </span>
              Medical OS v1.0
            </div>

            <h1 className="text-5xl lg:text-7xl font-black tracking-tight leading-[1.1] mb-6 text-slate-900 dark:text-white">
              Lulus UKMPPD{' '}
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-teal-400">
                One Shot.
              </span>
            </h1>

            <p className="text-lg text-slate-500 dark:text-slate-400 max-w-lg mb-8 leading-relaxed font-medium mx-auto lg:mx-0">
              Platform belajar kedokteran #1 yang mengintegrasikan Bank Soal
              Klinis, Checklist OSCE, dan{' '}
              <span className="text-teal-600 dark:text-teal-400 font-bold underline decoration-wavy">
                Wawasan Bioetika Islam
              </span>{' '}
              dalam satu aplikasi.
            </p>

            {/* Social proof ticker */}
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 mb-8 justify-center lg:justify-start">
              {STATS.map(({ icon: Icon, value, label }) => (
                <div key={label} className="flex items-center gap-1.5 text-xs font-bold text-slate-500 dark:text-slate-400">
                  <Icon size={13} className="text-teal-500" />
                  <span className="text-slate-900 dark:text-white">{value}</span>
                  {label}
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
              <button
                onClick={() => navigate('/register')}
                className="w-full sm:w-auto px-8 py-4 bg-slate-900 dark:bg-white text-white dark:text-black rounded-2xl font-bold text-lg shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all flex items-center justify-center gap-3"
              >
                Mulai Belajar <ArrowRight size={20} />
              </button>
              <button
                onClick={() => setIsDemoOpen(true)}
                className="w-full sm:w-auto px-8 py-4 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-white rounded-2xl font-bold text-lg hover:bg-slate-50 dark:hover:bg-white/10 transition-all flex items-center justify-center gap-3"
              >
                <PlayCircle size={20} /> Lihat Demo
              </button>
            </div>
          </div>

          {/* Hero mockup card */}
          <div className="relative animate-in fade-in slide-in-from-right duration-1000 delay-200">
            <div className="relative mx-auto bg-white dark:bg-[#111] rounded-2xl border border-slate-200 dark:border-white/10 shadow-2xl overflow-hidden max-w-lg w-full ring-1 ring-slate-900/5">
              <div className="h-8 bg-slate-100 dark:bg-[#1a1a1a] border-b border-slate-200 dark:border-white/5 flex items-center px-4 gap-2">
                <div className="w-3 h-3 rounded-full bg-red-400" />
                <div className="w-3 h-3 rounded-full bg-amber-400" />
                <div className="w-3 h-3 rounded-full bg-green-400" />
              </div>
              <div className="p-8 bg-slate-50 dark:bg-[#0a0a0a] min-h-[300px] flex items-center justify-center relative overflow-hidden">
                {/* blurred skeleton bg */}
                <div className="absolute inset-0 p-6 opacity-30 blur-[2px] pointer-events-none select-none">
                  <div className="w-1/3 h-8 bg-slate-300 dark:bg-slate-700 rounded-lg mb-6" />
                  <div className="space-y-3">
                    <div className="w-full h-4 bg-slate-200 dark:bg-slate-800 rounded" />
                    <div className="w-5/6 h-4 bg-slate-200 dark:bg-slate-800 rounded" />
                    <div className="w-4/6 h-4 bg-slate-200 dark:bg-slate-800 rounded" />
                  </div>
                </div>
                {/* floating insight card */}
                <div className="relative z-10 w-full max-w-sm bg-white/80 dark:bg-[#1a1a1a]/90 backdrop-blur-xl p-6 rounded-2xl shadow-2xl border border-white/20 dark:border-white/10 ring-1 ring-black/5">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white shadow-lg shadow-emerald-500/30">
                      <BookOpen size={20} />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 dark:text-white text-sm">Insight Mode Detected</h4>
                      <p className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">Fiqih Medis</p>
                    </div>
                  </div>
                  <p className="text-slate-600 dark:text-slate-300 text-sm font-medium leading-relaxed mb-4">
                    "Pada kondisi gawat darurat (life-saving), tindakan medis prioritas mendahului izin keluarga."
                  </p>
                  <div className="bg-slate-50 dark:bg-white/5 p-2 rounded-lg border border-slate-100 dark:border-white/5">
                    <p className="text-[10px] text-slate-400 font-mono">Ref: Kaidah Fiqih "Adh-dharuraat tubiihul mahzhuraat"</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── FEATURES GRID ─── */}
      <section id="fitur" className="py-24 px-6 bg-white dark:bg-slate-900/50 border-y border-slate-100 dark:border-white/5">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-black mb-4 text-slate-900 dark:text-white">Kenapa Harus MedPrep?</h2>
            <p className="text-lg text-slate-500 dark:text-slate-400">Kombinasi sempurna antara kecerdasan klinis dan kepekaan nurani.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Brain,       color: 'blue',   title: 'Tajam Klinis',    sub: 'The Brain',    desc: 'Soal vignette CBT sesuai blueprint terbaru. Latih clinical reasoning dengan pembahasan mendalam.' },
              { icon: Stethoscope, color: 'teal',   title: 'Terampil Praktis',sub: 'The Skill',    desc: 'Checklist OSCE interaktif. Panduan langkah demi langkah dari Anamnesis hingga Edukasi.' },
              { icon: Heart,       color: 'rose',   title: 'Beradab & Etis',  sub: 'The Soul',     desc: 'Integrasi modul Bioetika & Fiqih Medis. Membentuk dokter yang menenangkan hati pasien.' },
            ].map(({ icon: Icon, color, title, sub, desc }) => (
              <div key={title} className="p-8 bg-slate-50 dark:bg-slate-900 rounded-[2rem] border border-slate-100 dark:border-white/5 hover:shadow-xl transition-all hover:-translate-y-1">
                <div className={`w-14 h-14 bg-${color}-100 dark:bg-${color}-900/20 text-${color}-600 dark:text-${color}-400 rounded-2xl flex items-center justify-center mb-6`}>
                  <Icon size={28} />
                </div>
                <h3 className="text-lg font-black text-slate-900 dark:text-white mb-2">{title}</h3>
                <p className={`text-xs font-bold text-${color}-500 uppercase tracking-widest mb-3`}>{sub}</p>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{desc}</p>
              </div>
            ))}

            {/* Coming soon card */}
            <div className="p-8 bg-emerald-900 text-white rounded-[2rem] shadow-xl relative overflow-hidden group border border-emerald-700">
              <div className="absolute top-0 right-0 w-32 h-32 bg-teal-400/20 rounded-full blur-2xl group-hover:bg-teal-400/30 transition-all" />
              <div className="relative z-10">
                <div className="flex justify-between items-start mb-6">
                  <div className="w-14 h-14 bg-white/10 text-emerald-300 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                    <Moon size={28} fill="currentColor" />
                  </div>
                  <span className="bg-white/20 text-[10px] font-bold px-2 py-1 rounded text-white border border-white/10 uppercase tracking-wide">
                    Coming Soon
                  </span>
                </div>
                <h3 className="text-lg font-black mb-2">OSCIE Center</h3>
                <p className="text-xs font-bold text-emerald-300 uppercase tracking-widest mb-3">Islamic Integration</p>
                <p className="text-sm text-emerald-100 leading-relaxed">Panduan Ceklis OSCIE, Doa Medis, dan Fiqih sesuai Himpunan Putusan Tarjih.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── MOCKUP CBT & OSCE ─── */}
      <section className="py-24 px-6 bg-slate-50 dark:bg-black relative overflow-hidden">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16 relative z-10">
            <h2 className="text-3xl md:text-4xl font-black mb-4 text-slate-900 dark:text-white">Intip Kedalaman Platform</h2>
            <p className="text-lg text-slate-500 dark:text-slate-400">Desain antarmuka yang fokus pada fokus Anda.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-10 items-stretch">
            {/* CBT Mockup */}
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-[2.5rem] blur opacity-20 group-hover:opacity-40 transition duration-500" />
              <div className="relative h-full bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-white/10 overflow-hidden shadow-xl p-8 flex flex-col">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 rounded-lg"><Brain size={20} /></div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">CBT Bank</h3>
                </div>
                <div className="flex-1 space-y-4">
                  <div className="flex justify-between items-center text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    <span>Kardiologi UKMPPD 2024 · Soal No. 45</span>
                    <span className="text-rose-500 flex items-center gap-1"><Clock size={12} /> 00:58</span>
                  </div>
                  <p className="text-sm text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    Seorang laki-laki 50 tahun datang dengan keluhan nyeri dada kiri menjalar ke rahang dan lengan kiri sejak 2 jam SMRS. Nyeri seperti tertindih berat. EKG: ST elevasi lead II, III, aVF. Diagnosis?
                  </p>
                  <div className="space-y-2 mt-4">
                    {['STEMI Inferior', 'STEMI Anterior', 'STEMI Lateral', 'NSTEMI'].map((opt, i) => (
                      <div key={i} className={`p-3 rounded-xl border text-xs font-bold flex items-center gap-3 ${i === 0 ? 'bg-blue-600 border-blue-600 text-white' : 'border-slate-200 dark:border-slate-700 text-slate-500'}`}>
                        <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${i === 0 ? 'border-white' : 'border-slate-300'}`}>{String.fromCharCode(65 + i)}</div>
                        {opt}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* OSCE Mockup */}
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-teal-500 to-emerald-500 rounded-[2.5rem] blur opacity-20 group-hover:opacity-40 transition duration-500" />
              <div className="relative h-full bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-white/10 overflow-hidden shadow-xl p-8 flex flex-col">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-teal-100 dark:bg-teal-900/30 text-teal-600 rounded-lg"><ListChecks size={20} /></div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">OSCE Master</h3>
                  </div>
                  <span className="bg-teal-50 text-teal-600 border border-teal-200 text-[10px] font-bold px-2 py-1 rounded-full flex items-center gap-1">
                    <Mic size={10} /> Script ON
                  </span>
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-end mb-4 border-b border-slate-100 dark:border-white/5 pb-4">
                    <div>
                      <span className="text-[10px] text-slate-400 font-bold uppercase">Station 4 · Musculoskeletal</span>
                      <h4 className="text-lg font-bold text-slate-800 dark:text-white">Pemeriksaan Fisik Ankle</h4>
                    </div>
                    <div className="text-2xl font-mono font-black text-slate-900 dark:text-white">08:30</div>
                  </div>
                  <div className="space-y-3">
                    <div className="p-3 bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/30 rounded-xl">
                      <div className="flex justify-between mb-1">
                        <span className="text-xs font-bold text-red-600 dark:text-red-400">Thompson Test</span>
                        <span className="text-[9px] font-black bg-red-100 text-red-600 px-1.5 py-0.5 rounded">CRITICAL</span>
                      </div>
                      <p className="text-[10px] text-slate-600 dark:text-slate-400 italic mb-2">"Saya akan meremas otot betis pasien dalam posisi tengkurap..."</p>
                      <div className="flex items-center gap-2 text-[10px] font-medium text-slate-500">
                        <AlertCircle size={10} /> Interpretasi: Kaki tidak plantar fleksi? Curiga ruptur tendon Achilles.
                      </div>
                    </div>
                    <div className="p-3 border border-slate-200 dark:border-slate-700 rounded-xl">
                      <span className="text-xs font-bold text-slate-800 dark:text-white">Anterior Drawer Test</span>
                      <p className="text-[10px] text-slate-500 mt-1">Cek stabilitas ligamen talofibular anterior (ATFL).</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── INSIGHT DEMO TOGGLE ─── */}
      <section className="py-24 px-6 relative overflow-hidden border-t border-slate-100 dark:border-white/5">
        <div className="max-w-5xl mx-auto relative z-10">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 mb-4 text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-50 dark:bg-emerald-900/20 px-4 py-1.5 rounded-full text-xs uppercase tracking-widest border border-emerald-100 dark:border-emerald-800">
              <Sparkles size={14} /> Fitur Pendukung
            </div>
            <h2 className="text-3xl md:text-4xl font-black mb-4 text-slate-900 dark:text-white">Satu Aplikasi, Dua Dunia.</h2>
            <p className="text-lg text-slate-500 dark:text-slate-400">Geser toggle untuk melihat bagaimana MedPrep mengubah cara Anda belajar.</p>
          </div>

          <div className="flex justify-center items-center gap-6 mb-12 select-none">
            <button className={`font-bold text-lg transition-colors ${demoMode === 'medis' ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400'}`} onClick={() => setDemoMode('medis')}>Mode Medis</button>
            <button
              onClick={() => setDemoMode((p) => (p === 'medis' ? 'insight' : 'medis'))}
              className={`w-20 h-10 rounded-full p-1 cursor-pointer transition-colors duration-500 shadow-inner ${demoMode === 'insight' ? 'bg-emerald-100 dark:bg-emerald-900/50' : 'bg-slate-200 dark:bg-slate-700'}`}
              aria-label="Toggle mode"
            >
              <div className={`w-8 h-8 rounded-full shadow-md transform transition-all duration-500 flex items-center justify-center text-white ${demoMode === 'insight' ? 'translate-x-10 bg-emerald-500' : 'translate-x-0 bg-blue-500'}`}>
                {demoMode === 'insight' ? <Sparkles size={16} /> : <Brain size={16} />}
              </div>
            </button>
            <button className={`font-bold text-lg transition-colors ${demoMode === 'insight' ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400'}`} onClick={() => setDemoMode('insight')}>Mode Insight</button>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl border border-slate-200 dark:border-white/10 overflow-hidden">
            <div className="grid md:grid-cols-2">
              <div className="p-10 border-b md:border-b-0 md:border-r border-slate-100 dark:border-white/5">
                <div className="inline-block bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-300 px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider mb-4">Gastroenterohepatology</div>
                <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-4">Sirosis Hepatis</h3>
                <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed mb-6">Kondisi fibrosis hati lanjut yang ditandai dengan distorsi arsitektur hepar dan pembentukan nodul regeneratif.</p>
                <div className="bg-slate-50 dark:bg-slate-800 p-5 rounded-2xl">
                  <h4 className="font-bold text-slate-800 dark:text-white text-sm mb-3">Tatalaksana Utama:</h4>
                  <ul className="space-y-2">
                    {['Atasi etiologi (Antiviral Hep B/C).', 'Restriksi garam untuk asites.', 'Skrining karsinoma hepatoseluler.'].map((t) => (
                      <li key={t} className="flex gap-2 text-sm text-slate-600 dark:text-slate-300">
                        <CheckCircle2 size={16} className="text-blue-500 shrink-0" /> {t}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              <div className={`p-10 flex flex-col justify-center transition-colors duration-500 ${demoMode === 'insight' ? 'bg-emerald-50/50 dark:bg-emerald-900/10' : 'bg-slate-50/50 dark:bg-slate-900/50'}`}>
                {demoMode === 'insight' ? (
                  <div className="animate-in fade-in slide-in-from-right duration-500 space-y-4">
                    <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-lg border border-emerald-100 dark:border-emerald-900/30">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="bg-emerald-100 dark:bg-emerald-900/50 p-2 rounded-lg text-emerald-600 dark:text-emerald-400"><BookOpen size={20} /></div>
                        <h4 className="font-bold text-emerald-800 dark:text-emerald-300 text-sm">Perspektif Islam</h4>
                      </div>
                      <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">Jika Sirosis disebabkan oleh alkohol, hukum berobat tetap <strong>Wajib</strong> (ikhtiar), namun tobat nasuha diperlukan untuk pembersihan jiwa.</p>
                    </div>
                    <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-lg border border-emerald-100 dark:border-emerald-900/30">
                      <h4 className="font-bold text-emerald-800 dark:text-emerald-300 text-xs uppercase tracking-widest mb-2">Doa Kesembuhan</h4>
                      <p className="text-sm font-serif italic text-slate-600 dark:text-slate-300">"Allahumma Rabban-nasi, adzhibil-ba'sa isyfi antasy-syafi..."</p>
                    </div>
                  </div>
                ) : (
                  <div className="text-center opacity-40">
                    <Brain size={48} className="mx-auto mb-4 text-slate-400" />
                    <p className="text-sm font-bold">Mode Medis Aktif</p>
                    <p className="text-xs">Aktifkan toggle untuk melihat wawasan integratif.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── TESTIMONIALS ─── */}
      <section id="testimoni" className="py-24 px-6 bg-slate-50 dark:bg-black">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-black text-center mb-16 text-slate-900 dark:text-white">Kata Mereka</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {TESTIMONIALS.map((testi, i) => (
              <div key={i} className="bg-white dark:bg-slate-900 p-10 rounded-[2.5rem] shadow-sm border border-slate-100 dark:border-white/5 relative hover:-translate-y-2 transition-transform duration-300">
                <Quote size={32} className="text-indigo-200 dark:text-indigo-900/50 absolute top-8 left-8" />
                {/* Star rating */}
                <div className="relative z-10 flex gap-0.5 mb-4">
                  {Array.from({ length: testi.rating }).map((_, s) => (
                    <Star key={s} size={14} className="text-amber-400 fill-amber-400" />
                  ))}
                </div>
                <div className="relative z-10">
                  <p className="text-slate-600 dark:text-slate-300 text-sm leading-loose mb-8 font-medium italic">"{testi.quote}"</p>
                  <div className="flex items-center gap-4 border-t border-slate-100 dark:border-white/10 pt-6">
                    <Avatar name={testi.name} index={i} />
                    <div>
                      <h4 className="font-bold text-slate-900 dark:text-white text-sm">{testi.name}</h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{testi.role}</p>
                      <p className="text-[10px] text-indigo-500 font-bold uppercase tracking-widest mt-1">{testi.univ}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── PRICING ─── */}
      <section id="harga" className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-black mb-4 text-slate-900 dark:text-white">Investasi Cerdas.</h2>
            <p className="text-slate-500 dark:text-slate-400 mb-8">Pilih paket sesuai target kelulusanmu.</p>
            {/* Billing toggle */}
            <div className="inline-flex bg-slate-100 dark:bg-slate-800 p-1 rounded-full border border-slate-200 dark:border-white/10">
              {(['monthly', 'midyear', 'lifetime']).map((cycle) => (
                <button
                  key={cycle}
                  onClick={() => setBillingCycle(cycle)}
                  className={`px-6 py-2 rounded-full text-xs font-bold transition-all duration-300 ${billingCycle === cycle ? 'bg-white dark:bg-slate-700 shadow-md text-slate-900 dark:text-white' : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'}`}
                >
                  {cycle === 'monthly' ? 'Bulanan' : cycle === 'midyear' ? '6 Bulan' : 'Selamanya'}
                </button>
              ))}
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8 items-end">
            {/* Starter */}
            <div className="p-8 bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-white/10">
              <span className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">Starter</span>
              <h3 className="text-4xl font-black mt-4 mb-2 text-slate-900 dark:text-white">Rp 0</h3>
              <p className="text-xs text-slate-500 mb-8">Akses terbatas selamanya.</p>
              <ul className="space-y-4 mb-8 text-sm text-slate-600 dark:text-slate-300">
                <li className="flex gap-3"><CheckCircle2 size={16} className="text-teal-500 shrink-0" /> 50 Soal Latihan</li>
                <li className="flex gap-3"><CheckCircle2 size={16} className="text-teal-500 shrink-0" /> Ceklis OSCE Dasar</li>
                {/* ✅ Fix: gunakan XCircle + warna merah, bukan CheckCircle hijau dengan line-through */}
                <li className="flex gap-3 text-slate-400"><XCircle size={16} className="text-slate-300 dark:text-slate-600 shrink-0" /><span className="line-through">Modul OSCIE</span></li>
              </ul>
              <button onClick={() => navigate('/register')} className="w-full py-3 rounded-xl border border-slate-300 dark:border-slate-700 font-bold text-sm hover:bg-slate-50 dark:hover:bg-white/5 transition-all">Daftar Gratis</button>
            </div>

            {/* Basic */}
            <div className="p-8 bg-white dark:bg-slate-900 rounded-[2.5rem] border-2 border-indigo-500 shadow-2xl relative transform md:-translate-y-4">
              <div className="absolute -top-4 inset-x-0 flex justify-center">
                <span className="bg-indigo-600 text-white px-4 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-lg">Rekomendasi PTN</span>
              </div>
              <span className="bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">Basic</span>
              <h3 className="text-4xl font-black mt-4 mb-2 text-slate-900 dark:text-white">{getPrice('basic')}</h3>
              <p className="text-xs text-slate-500 mb-8">{getDurationLabel()}</p>
              <ul className="space-y-4 mb-8 text-sm font-bold text-slate-700 dark:text-white">
                <li className="flex gap-3"><CheckCircle2 size={16} className="text-indigo-500 shrink-0" /> Full Bank Soal</li>
                <li className="flex gap-3"><CheckCircle2 size={16} className="text-indigo-500 shrink-0" /> Full Ceklis OSCE</li>
                <li className="flex gap-3 text-slate-400 font-normal"><XCircle size={16} className="text-slate-300 dark:text-slate-600 shrink-0" /><span className="line-through">Insight Islami</span></li>
              </ul>
              <button onClick={() => navigate('/register')} className="w-full py-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-lg hover:shadow-indigo-500/30 transition-all">Pilih Basic</button>
            </div>

            {/* Expert */}
            <div className="relative transform md:-translate-y-4">
              <div className="absolute -top-4 inset-x-0 flex justify-center z-20">
                <span className="bg-emerald-600 text-white px-4 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-lg">Rekomendasi PTM</span>
              </div>
              <div className="p-8 bg-slate-900 dark:bg-black rounded-[2.5rem] border border-slate-800 dark:border-white/20 shadow-2xl text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/20 rounded-full blur-3xl" />
                <div className="relative z-10 mt-2">
                  <span className="bg-emerald-500/20 text-emerald-400 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border border-emerald-500/30">Expert</span>
                  <h3 className="text-4xl font-black mt-4 mb-2">{getPrice('expert')}</h3>
                  <p className="text-xs text-slate-400 mb-8">{getDurationLabel()}</p>
                  <ul className="space-y-4 mb-8 text-sm font-bold">
                    <li className="flex gap-3"><CheckCircle2 size={16} className="text-emerald-400 shrink-0" /> Semua Fitur Basic</li>
                    <li className="flex gap-3"><CheckCircle2 size={16} className="text-emerald-400 shrink-0" /> Insight Islami</li>
                    <li className="flex gap-3"><CheckCircle2 size={16} className="text-emerald-400 shrink-0" /> OSCIE Module</li>
                  </ul>
                  <button
                    onClick={() => {
                      const text = `Halo Admin, saya ingin upgrade ke paket *Expert* MedPrep.`;
                      window.open(`https://wa.me/${ADMIN_WA}?text=${encodeURIComponent(text)}`, '_blank');
                    }}
                    className="w-full py-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 font-bold text-sm shadow-lg hover:shadow-emerald-500/30 transition-all flex items-center justify-center gap-2"
                  >
                    <Award size={16} /> Upgrade Expert
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Donasi */}
          <div className="mt-12 text-center opacity-60">
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400 flex items-center justify-center gap-2">
              <HeartHandshake size={14} className="text-teal-500" />
              Sebagian keuntungan (30%) akan didonasikan untuk kegiatan sosial kesehatan &amp; pengembangan fitur gratis.
            </p>
          </div>
        </div>
      </section>

      {/* ─── FINAL CTA ─── */}
      <section className="py-24 px-6 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-teal-500/10 rounded-full blur-[150px]" />
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-indigo-500/10 rounded-full blur-[120px]" />
          <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-emerald-500/10 rounded-full blur-[100px]" />
        </div>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-full bg-teal-500/20 border border-teal-500/30">
            <Sparkles size={16} className="text-teal-400" />
            <span className="text-teal-300 text-sm font-bold">Mulai Perjalananmu</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-white mb-6">
            Siap Lulus UKMPPD<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-emerald-400">One Shot?</span>
          </h2>
          <p className="text-lg text-slate-300 mb-10 max-w-2xl mx-auto leading-relaxed">
            Bergabung dengan <strong className="text-white">3.200+</strong> pejuang kedokteran yang sudah mempercayakan persiapan mereka bersama MedPrep.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => navigate('/register')}
              className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-teal-500 to-emerald-500 text-white rounded-2xl font-bold text-lg shadow-xl shadow-teal-500/30 hover:shadow-teal-500/50 hover:-translate-y-1 transition-all flex items-center justify-center gap-3"
            >
              <Zap size={20} /> Daftar Gratis Sekarang
            </button>
            <button
              onClick={() => navigate('/login')}
              className="w-full sm:w-auto px-8 py-4 bg-white/10 border border-white/20 text-white rounded-2xl font-bold text-lg hover:bg-white/20 transition-all flex items-center justify-center gap-3"
            >
              Sudah Punya Akun? <ArrowRight size={18} />
            </button>
          </div>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-6 text-sm text-slate-400">
            <span className="flex items-center gap-2"><CheckCircle2 size={16} className="text-teal-400" /> Tanpa kartu kredit</span>
            <span className="flex items-center gap-2"><CheckCircle2 size={16} className="text-teal-400" /> Akses instan</span>
            <span className="flex items-center gap-2"><CheckCircle2 size={16} className="text-teal-400" /> 50 soal gratis</span>
          </div>
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer className="bg-white dark:bg-slate-900 py-12 border-t border-slate-100 dark:border-white/5">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-slate-900 dark:bg-white rounded-lg flex items-center justify-center text-white dark:text-black font-black text-xs">M</div>
            <span className="font-bold text-sm text-slate-900 dark:text-white">MedPrep Indonesia</span>
          </div>
          <div className="flex gap-6">
            <a href={import.meta.env.VITE_INSTAGRAM_URL || '#'} target="_blank" rel="noreferrer" className="p-2 bg-slate-100 dark:bg-white/5 rounded-full text-slate-600 dark:text-slate-400 hover:text-pink-500 transition-colors" aria-label="Instagram">
              <Instagram size={18} />
            </a>
            <a href={`https://wa.me/${ADMIN_WA}`} target="_blank" rel="noreferrer" className="p-2 bg-slate-100 dark:bg-white/5 rounded-full text-slate-600 dark:text-slate-400 hover:text-green-500 transition-colors" aria-label="WhatsApp">
              <MessageCircle size={18} />
            </a>
          </div>
        </div>
        <div className="text-center mt-12 pt-8 border-t border-slate-100 dark:border-white/5 mx-6">
          <p className="text-[10px] text-slate-400">© 2026 MedPrep Indonesia. Dibuat dengan 💙 untuk sejawat.</p>
        </div>
      </footer>
    </div>
  );
}