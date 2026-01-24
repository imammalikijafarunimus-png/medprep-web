import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Menu, X, Check, ArrowRight, Brain, Stethoscope, Heart, 
  BookOpen, Star, Shield, PlayCircle, Moon, Sun, Users, Award, 
  CheckCircle2, Sparkles, Zap, Quote, Instagram, MessageCircle,
  Clock, ListChecks, Mic, AlertCircle, HeartHandshake
} from 'lucide-react';

// --- DATA TESTIMONI ---
const TESTIMONIALS = [
  {
    name: "dr. Fasha, S.Ked",
    role: "Lulusan UKMPPD Batch Nov 2025",
    univ: "Univ. Diponegoro",
    quote: "Fitur Insight-nya benar-benar 'game changer'. Saat ujian OSCE stase psikiatri dan bioetika, saya jadi jauh lebih tenang dan percaya diri."
  },
  {
    name: "Amirah Nur Fauziana, S.Ked",
    role: "Mahasiswa FK Tahap Profesi",
    univ: "Univ. Muhammadiyah Semarang",
    quote: "Bank soalnya sangat relevan. Pembahasan tidak hanya medis, tapi ada 'touch' kemanusiaan yang sering dilupakan di buku teks biasa."
  },
  {
    name: "Annisa Putri Sophia, S.Ked",
    role: "Co-Ass Stase Jiwa",
    univ: "Univ. Abdurrab",
    quote: "Checklist OSCE-nya juara. Runtut, sistematis, dan timernya bikin simulasi berasa ujian beneran. Wajib punya buat pejuang One Shot."
  }
];

// --- DATA KONTRIBUTOR ---
const TEAM_DIVISIONS = [
  {
    title: "CBT Center & Flashcard",
    color: "text-indigo-500",
    members: [
      { name: "dr. Imam Maliki Ja'far", title: "Tim Penyusun", gender: "male" },
      { name: "dr. Anggita Rahma Fedyasati", title: "Tim Ahli Materi", gender: "female" },
      { name: "dr. Indah Ainun Faroch", title: "Tim Ahli Materi", gender: "female" },
    ]
  },
  {
    title: "OSCE Checklist",
    color: "text-teal-500",
    members: [
      { name: "dr. Krishnapatti Panjalu", title: "Tim Penyusun", gender: "male" },
      { name: "dr. Kharisma Muhammad", title: "Tim Penyusun", gender: "male" },
      { name: "dr. Imam Maliki Ja'far", title: "Tim Penyusun", gender: "male" },
      { name: "dr. Muhammad Fath Faiz", title: "Tim Ahli Materi", gender: "male" },
      { name: "dr. Wahyu Hidayat Azzaozi", title: "Tim Ahli Materi", gender: "male" },
      { name: "dr. Nurahmat Yanisa Irfandi", title: "Tim Ahli Materi", gender: "male" },
    ]
  },
  {
    title: "OSCE Cases",
    color: "text-rose-500",
    members: [
      { name: "dr. Feby Ananda Putri", title: "Tim Penyusun", gender: "female" },
      { name: "dr. Indria Zulfani M.T.", title: "Tim Penyusun", gender: "female" },
      { name: "dr. Vina Shofiyatul Izaah", title: "Tim Penyusun", gender: "female" },
      { name: "dr. Imam Maliki Ja'far", title: "Koordinator", gender: "male" },
      { name: "dr. Intan Purnamasari", title: "Tim Penyusun", gender: "female" },
      { name: "dr. Putri Ika Nur Apriani", title: "Tim Penyusun", gender: "female" },
      { name: "dr. Alya Yasmin Adhi", title: "Tim Penyusun", gender: "female" },
      { name: "dr. Adela Zafira", title: "Tim Penyusun", gender: "female" },
      { name: "dr. Jihan Ayuningsih", title: "Tim Penyusun", gender: "female" },
      { name: "dr. Wajihahni Rodiyah", title: "Tim Penyusun", gender: "female" },
      { name: "dr. Rohmatul Ulya", title: "Tim Penyusun", gender: "female" },
      { name: "dr. Hanifah Resti M.", title: "Tim Penyusun", gender: "female" },
      { name: "dr. Yuyun Ayu Safitri", title: "Tim Penyusun", gender: "female" },
      { name: "dr. Aulia Zulfiana", title: "Tim Penyusun", gender: "female" },
    ]
  },
  {
    title: "OSCIE & Bioetika",
    color: "text-emerald-500",
    members: [
      { name: "dr. Imam Maliki Ja'far", title: "Koordinator OSCIE", gender: "male" },
      { name: "dr. Kharisma Muhammad", title: "Konsultan Fiqih Medis", gender: "male" },
    ]
  }
];

export default function LandingPage() {
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
  const [demoMode, setDemoMode] = useState<'medis' | 'insight'>('medis');
  
  // STATE PRICING (NEW)
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'midyear' | 'lifetime'>('midyear');

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') root.classList.add('dark');
    else root.classList.remove('dark');
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');

  const getAvatar = (gender: string, seed: string) => 
    `https://api.dicebear.com/9.x/avataaars/svg?seed=${seed}&gender=${gender}&clothing=blazerAndShirt`;

  // PRICING LOGIC
  const getPrice = (plan: 'basic' | 'expert') => {
      if (plan === 'basic') {
          if (billingCycle === 'monthly') return '15rb';
          if (billingCycle === 'midyear') return '45rb';
          return '99rb';
      } else {
          if (billingCycle === 'monthly') return '25rb';
          if (billingCycle === 'midyear') return '75rb';
          return '149rb';
      }
  };

  const getDurationLabel = () => {
      if (billingCycle === 'monthly') return '/ bulan';
      if (billingCycle === 'midyear') return 'per 6 bulan';
      return 'sekali bayar';
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#050505] font-sans text-slate-900 dark:text-white transition-colors duration-500 overflow-x-hidden selection:bg-teal-500 selection:text-white">
      
      {/* BACKGROUND AMBIENCE */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-teal-400/20 dark:bg-teal-500/10 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-indigo-400/20 dark:bg-indigo-500/10 rounded-full blur-[120px] animate-pulse delay-1000"></div>
      </div>

      {/* NAVBAR */}
      <nav className={`fixed w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-white/80 dark:bg-black/80 backdrop-blur-xl border-b border-slate-200 dark:border-white/5 py-4 shadow-sm' : 'bg-transparent py-6'}`}>
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center gap-2.5 font-black text-2xl tracking-tighter cursor-pointer" onClick={() => window.scrollTo(0,0)}>
            <div className="w-9 h-9 bg-gradient-to-br from-indigo-600 to-teal-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-teal-500/20">M</div>
            <span className="text-slate-900 dark:text-white">MedPrep</span>
          </div>

          <div className="hidden md:flex items-center gap-8 font-bold text-sm text-slate-500 dark:text-slate-400">
            {['Home', 'Fitur', 'Testimoni', 'Harga'].map((item) => (
              <a key={item} href={`#${item.toLowerCase()}`} className="hover:text-teal-600 dark:hover:text-white transition-colors">{item}</a>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-3">
            <button onClick={toggleTheme} className="p-2.5 rounded-full bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-white hover:scale-110 transition-transform active:scale-95 border border-transparent dark:border-white/5">
              {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
            </button>
            <button onClick={() => navigate('/login')} className="px-5 py-2.5 font-bold text-sm text-slate-600 dark:text-slate-300 hover:text-teal-600 dark:hover:text-white transition-colors">Masuk</button>
            <button onClick={() => navigate('/register')} className="px-6 py-2.5 rounded-full bg-slate-900 dark:bg-white text-white dark:text-black font-bold text-sm hover:scale-105 transition-transform shadow-xl shadow-teal-500/10">Daftar Gratis</button>
          </div>

          <div className="flex items-center gap-4 md:hidden">
              <button onClick={toggleTheme} className="p-2 rounded-full bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-white">{theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}</button>
              <button className="text-slate-900 dark:text-white" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>{isMobileMenuOpen ? <X /> : <Menu />}</button>
          </div>
        </div>
        
        {isMobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 w-full bg-white/95 dark:bg-black/95 backdrop-blur-xl border-b border-slate-100 dark:border-white/10 p-6 flex flex-col gap-4 shadow-xl">
            {['Home', 'Fitur', 'Testimoni', 'Harga'].map((item) => (<a key={item} href={`#${item.toLowerCase()}`} onClick={() => setIsMobileMenuOpen(false)} className="text-sm font-bold text-slate-600 dark:text-slate-300 py-2">{item}</a>))}
            <hr className="border-slate-100 dark:border-white/10"/>
            <button onClick={() => navigate('/login')} className="w-full py-3 font-bold text-slate-600 dark:text-slate-300">Masuk</button>
            <button onClick={() => navigate('/register')} className="w-full py-3 bg-teal-600 text-white rounded-xl font-bold">Daftar Sekarang</button>
          </div>
        )}
      </nav>

      {/* HERO SECTION */}
      <section id="home" className="relative pt-32 pb-20 px-6 z-10">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          
          <div className="animate-in fade-in slide-in-from-left duration-1000 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-teal-50 dark:bg-teal-900/30 border border-teal-100 dark:border-teal-800 text-teal-700 dark:text-teal-300 text-[10px] font-bold uppercase tracking-wider mb-6">
              <span className="relative flex h-2 w-2"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span><span className="relative inline-flex rounded-full h-2 w-2 bg-teal-500"></span></span>
              Medical OS v1.0
            </div>
            
            <h1 className="text-5xl lg:text-7xl font-black tracking-tight leading-[1.1] mb-6 text-slate-900 dark:text-white">
              Lulus UKMPPD <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-teal-400">One Shot.</span>
            </h1>
            
            <p className="text-lg text-slate-500 dark:text-slate-400 max-w-lg mb-8 leading-relaxed font-medium mx-auto lg:mx-0">
              Platform belajar kedokteran #1 yang mengintegrasikan Bank Soal Klinis, Checklist OSCE, dan <span className="text-teal-600 dark:text-teal-400 font-bold underline decoration-wavy">Wawasan Bioetika Islam</span> dalam satu aplikasi.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
              <button onClick={() => navigate('/register')} className="w-full sm:w-auto px-8 py-4 bg-slate-900 dark:bg-white text-white dark:text-black rounded-2xl font-bold text-lg shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all flex items-center justify-center gap-3">
                Mulai Belajar <ArrowRight size={20} />
              </button>
              <button className="w-full sm:w-auto px-8 py-4 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-white rounded-2xl font-bold text-lg hover:bg-slate-50 dark:hover:bg-white/10 transition-all flex items-center justify-center gap-3">
                <PlayCircle size={20} /> Lihat Demo
              </button>
            </div>
          </div>

          <div className="relative animate-in fade-in slide-in-from-right duration-1000 delay-200 lg:block">
             <div className="relative mx-auto bg-white dark:bg-[#111] rounded-2xl border border-slate-200 dark:border-white/10 shadow-2xl overflow-hidden max-w-lg w-full ring-1 ring-slate-900/5">
                <div className="h-8 bg-slate-100 dark:bg-[#1a1a1a] border-b border-slate-200 dark:border-white/5 flex items-center px-4 gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-400"></div>
                    <div className="w-3 h-3 rounded-full bg-amber-400"></div>
                    <div className="w-3 h-3 rounded-full bg-green-400"></div>
                </div>
                <div className="p-8 bg-slate-50 dark:bg-[#0a0a0a] min-h-[300px] flex items-center justify-center relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-full p-6 opacity-30 blur-[2px] pointer-events-none select-none">
                        <div className="w-1/3 h-8 bg-slate-300 dark:bg-slate-700 rounded-lg mb-6"></div>
                        <div className="space-y-3">
                            <div className="w-full h-4 bg-slate-200 dark:bg-slate-800 rounded"></div>
                            <div className="w-5/6 h-4 bg-slate-200 dark:bg-slate-800 rounded"></div>
                            <div className="w-4/6 h-4 bg-slate-200 dark:bg-slate-800 rounded"></div>
                        </div>
                    </div>
                    <div className="relative z-10 w-full max-w-sm bg-white/80 dark:bg-[#1a1a1a]/90 backdrop-blur-xl p-6 rounded-2xl shadow-2xl border border-white/20 dark:border-white/10 ring-1 ring-black/5 animate-float">
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
                            "Pada kondisi gawat darurat (life-saving), tindakan medis prioritas mendahului izin keluarga (Informed Consent bisa menyusul)."
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

      {/* FEATURES GRID */}
      <section id="fitur" className="py-24 px-6 bg-white dark:bg-slate-900/50 border-y border-slate-100 dark:border-white/5">
        <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-black mb-4 text-slate-900 dark:text-white">Kenapa Harus MedPrep?</h2>
                <p className="text-lg text-slate-500 dark:text-slate-400">Kombinasi sempurna antara kecerdasan klinis dan kepekaan nurani.</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="p-8 bg-slate-50 dark:bg-slate-900 rounded-[2rem] border border-slate-100 dark:border-white/5 hover:shadow-xl transition-all hover:-translate-y-1">
                    <div className="w-14 h-14 bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-2xl flex items-center justify-center mb-6"><Brain size={28} /></div>
                    <h3 className="text-lg font-black text-slate-900 dark:text-white mb-2">Tajam Klinis</h3>
                    <p className="text-xs font-bold text-blue-500 uppercase tracking-widest mb-3">The Brain</p>
                    <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">Soal vignette CBT sesuai blueprint terbaru. Latih clinical reasoning dengan pembahasan mendalam.</p>
                </div>
                <div className="p-8 bg-slate-50 dark:bg-slate-900 rounded-[2rem] border border-slate-100 dark:border-white/5 hover:shadow-xl transition-all hover:-translate-y-1">
                    <div className="w-14 h-14 bg-teal-100 dark:bg-teal-900/20 text-teal-600 dark:text-teal-400 rounded-2xl flex items-center justify-center mb-6"><Stethoscope size={28} /></div>
                    <h3 className="text-lg font-black text-slate-900 dark:text-white mb-2">Terampil Praktis</h3>
                    <p className="text-xs font-bold text-teal-500 uppercase tracking-widest mb-3">The Skill</p>
                    <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">Checklist OSCE interaktif. Panduan langkah demi langkah dari Anamnesis hingga Edukasi.</p>
                </div>
                <div className="p-8 bg-slate-50 dark:bg-slate-900 rounded-[2rem] border border-slate-100 dark:border-white/5 hover:shadow-xl transition-all hover:-translate-y-1">
                    <div className="w-14 h-14 bg-rose-100 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400 rounded-2xl flex items-center justify-center mb-6"><Heart size={28} /></div>
                    <h3 className="text-lg font-black text-slate-900 dark:text-white mb-2">Beradab & Etis</h3>
                    <p className="text-xs font-bold text-rose-500 uppercase tracking-widest mb-3">The Soul</p>
                    <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">Integrasi modul Bioetika & Fiqih Medis. Membentuk dokter yang menenangkan hati pasien.</p>
                </div>
                <div className="p-8 bg-emerald-900 text-white rounded-[2rem] shadow-xl relative overflow-hidden group border border-emerald-700">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-teal-400/20 rounded-full blur-2xl group-hover:bg-teal-400/30 transition-all"></div>
                    <div className="relative z-10">
                        <div className="flex justify-between items-start mb-6">
                            <div className="w-14 h-14 bg-white/10 text-emerald-300 rounded-2xl flex items-center justify-center backdrop-blur-sm"><Moon size={28} fill="currentColor" /></div>
                            <span className="bg-white/20 text-[10px] font-bold px-2 py-1 rounded text-white border border-white/10 uppercase tracking-wide">Coming Soon</span>
                        </div>
                        <h3 className="text-lg font-black mb-2">OSCIE Center</h3>
                        <p className="text-xs font-bold text-emerald-300 uppercase tracking-widest mb-3">Islamic Integration</p>
                        <p className="text-sm text-emerald-100 leading-relaxed">Panduan Ceklis OSCIE, Doa Medis, dan Fiqih sesuai Himpunan Putusan Tarjih.</p>
                    </div>
                </div>
            </div>
        </div>
      </section>

      {/* --- SECTION: MOCKUP CBT & OSCE (UPDATED CONTENT) --- */}
      <section className="py-24 px-6 bg-slate-50 dark:bg-black relative overflow-hidden">
          <div className="max-w-6xl mx-auto">
              <div className="text-center mb-16 relative z-10">
                  <h2 className="text-3xl md:text-4xl font-black mb-4 text-slate-900 dark:text-white">Intip Kedalaman Platform</h2>
                  <p className="text-lg text-slate-500 dark:text-slate-400">Desain antarmuka yang fokus pada fokus Anda.</p>
              </div>

              <div className="grid md:grid-cols-2 gap-10 items-stretch">
                  
                  {/* CARD 1: CBT MOCKUP (Updated) */}
                  <div className="relative group">
                      <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-[2.5rem] blur opacity-20 group-hover:opacity-40 transition duration-500"></div>
                      <div className="relative h-full bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-white/10 overflow-hidden shadow-xl p-8 flex flex-col">
                          <div className="flex items-center gap-3 mb-6">
                              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 rounded-lg"><Brain size={20} /></div>
                              <h3 className="text-xl font-bold text-slate-900 dark:text-white">CBT Bank</h3>
                          </div>
                          
                          <div className="flex-1 space-y-4">
                              <div className="flex justify-between items-center text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                  <span>Kardiologi UKMPPD 2024 Batch Mei - Soal No. 45</span>
                                  <span className="text-rose-500 flex items-center gap-1"><Clock size={12}/> 00:58</span>
                              </div>
                              <p className="text-sm text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                                  Seorang laki-laki 50 tahun datang dengan keluhan nyeri dada kiri menjalar ke rahang dan lengan kiri sejak 2 jam SMRS. Nyeri dirasakan seperti tertindih beban berat. Pemeriksaan EKG menunjukkan ST elevasi di lead II, III, aVF. Diagnosis pasien yang paling tepat?
                              </p>
                              <div className="space-y-2 mt-4">
                                  {['STEMI Inferior', 'STEMI Anterior', 'STEMI Lateral', 'NSTEMI'].map((opt, i) => (
                                      <div key={i} className={`p-3 rounded-xl border text-xs font-bold flex items-center gap-3 ${i === 0 ? 'bg-blue-600 border-blue-600 text-white' : 'border-slate-200 dark:border-slate-700 text-slate-500'}`}>
                                          <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${i === 0 ? 'border-white' : 'border-slate-300'}`}>{String.fromCharCode(65+i)}</div>
                                          {opt}
                                      </div>
                                  ))}
                              </div>
                          </div>
                      </div>
                  </div>

                  {/* CARD 2: OSCE MOCKUP (Updated) */}
                  <div className="relative group">
                      <div className="absolute -inset-1 bg-gradient-to-r from-teal-500 to-emerald-500 rounded-[2.5rem] blur opacity-20 group-hover:opacity-40 transition duration-500"></div>
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
                                      <span className="text-[10px] text-slate-400 font-bold uppercase">Station 4 - Musculoskeletal</span>
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

      {/* DEMO INTERACTIVE (INSIGHT) */}
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
                <span className={`font-bold text-lg transition-colors cursor-pointer ${demoMode === 'medis' ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400'}`} onClick={() => setDemoMode('medis')}>Mode Medis</span>
                <div onClick={() => setDemoMode(prev => prev === 'medis' ? 'insight' : 'medis')} className={`w-20 h-10 rounded-full p-1 cursor-pointer transition-colors duration-500 shadow-inner ${demoMode === 'insight' ? 'bg-emerald-100 dark:bg-emerald-900/50' : 'bg-slate-200 dark:bg-slate-700'}`}>
                    <div className={`w-8 h-8 rounded-full shadow-md transform transition-all duration-500 flex items-center justify-center text-white ${demoMode === 'insight' ? 'translate-x-10 bg-emerald-500' : 'translate-x-0 bg-blue-500'}`}>
                        {demoMode === 'insight' ? <Sparkles size={16} /> : <Brain size={16} />}
                    </div>
                </div>
                <span className={`font-bold text-lg transition-colors cursor-pointer ${demoMode === 'insight' ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400'}`} onClick={() => setDemoMode('insight')}>Mode Insight</span>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl border border-slate-200 dark:border-white/10 overflow-hidden">
                <div className="grid md:grid-cols-2">
                    <div className="p-10 border-b md:border-b-0 md:border-r border-slate-100 dark:border-white/5">
                        <div className="inline-block bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-300 px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider mb-4">Gastroenterohepatology</div>
                        <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-4">Sirosis Hepatis</h3>
                        <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed mb-6">Kondisi fibrosis hati lanjut yang ditandai dengan distorsi arsitektur hepar dan pembentukan nodul regeneratif. Gejala klinis meliputi asites, ikterus, dan eritema palmaris.</p>
                        <div className="bg-slate-50 dark:bg-slate-800 p-5 rounded-2xl">
                            <h4 className="font-bold text-slate-800 dark:text-white text-sm mb-3">Tatalaksana Utama:</h4>
                            <ul className="space-y-2">
                                <li className="flex gap-2 text-sm text-slate-600 dark:text-slate-300"><CheckCircle2 size={16} className="text-blue-500 shrink-0"/> Atasi etiologi (Antiviral Hep B/C).</li>
                                <li className="flex gap-2 text-sm text-slate-600 dark:text-slate-300"><CheckCircle2 size={16} className="text-blue-500 shrink-0"/> Restriksi garam untuk asites.</li>
                                <li className="flex gap-2 text-sm text-slate-600 dark:text-slate-300"><CheckCircle2 size={16} className="text-blue-500 shrink-0"/> Skrining karsinoma hepatoseluler.</li>
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

      {/* TESTIMONIALS */}
      <section id="testimoni" className="py-24 px-6 bg-slate-50 dark:bg-black">
          <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl font-black text-center mb-16 text-slate-900 dark:text-white">Kata Mereka</h2>
              <div className="grid md:grid-cols-3 gap-8">
                  {TESTIMONIALS.map((testi, i) => (
                      <div key={i} className="bg-white dark:bg-slate-900 p-10 rounded-[2.5rem] shadow-sm border border-slate-100 dark:border-white/5 relative hover:-translate-y-2 transition-transform duration-300">
                          <Quote size={32} className="text-indigo-200 dark:text-indigo-900/50 absolute top-8 left-8" />
                          <div className="relative z-10 pt-6">
                              <p className="text-slate-600 dark:text-slate-300 text-sm leading-loose mb-8 font-medium italic">"{testi.quote}"</p>
                              <div className="flex items-center gap-4 border-t border-slate-100 dark:border-white/10 pt-6">
                                  <div className={`w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-400 to-purple-500 shadow-md`}></div>
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

      {/* PRICING (UPDATED) */}
      <section id="harga" className="py-24 px-6">
          <div className="max-w-6xl mx-auto">
              <div className="text-center mb-12">
                  <h2 className="text-4xl font-black mb-4 text-slate-900 dark:text-white">Investasi Cerdas.</h2>
                  <p className="text-slate-500 dark:text-slate-400 mb-8">Pilih paket sesuai target kelulusanmu.</p>
                  
                  {/* PRICING TOGGLE */}
                  <div className="inline-flex bg-slate-100 dark:bg-slate-800 p-1 rounded-full border border-slate-200 dark:border-white/10">
                      {(['monthly', 'midyear', 'lifetime'] as const).map((cycle) => (
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
                  
                  {/* STARTER */}
                  <div className="p-8 bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-white/10">
                      <span className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">Starter</span>
                      <h3 className="text-4xl font-black mt-4 mb-2 text-slate-900 dark:text-white">Rp 0</h3>
                      <p className="text-xs text-slate-500 mb-8">Akses terbatas selamanya.</p>
                      <ul className="space-y-4 mb-8 text-sm text-slate-600 dark:text-slate-300">
                          <li className="flex gap-3"><CheckCircle2 size={16} className="text-teal-500"/> 50 Soal Latihan</li>
                          <li className="flex gap-3"><CheckCircle2 size={16} className="text-teal-500"/> Ceklis OSCE Dasar</li>
                          <li className="flex gap-3 text-slate-400 line-through"><CheckCircle2 size={16} /> Modul OSCIE</li>
                      </ul>
                      <button onClick={() => navigate('/register')} className="w-full py-3 rounded-xl border border-slate-300 dark:border-slate-700 font-bold text-sm hover:bg-slate-50 dark:hover:bg-white/5 transition-all">Daftar Gratis</button>
                  </div>

                  {/* BASIC */}
                  <div className="p-8 bg-white dark:bg-slate-900 rounded-[2.5rem] border-2 border-indigo-500 shadow-2xl relative transform md:-translate-y-4">
                      <div className="absolute -top-4 inset-x-0 flex justify-center"><span className="bg-indigo-600 text-white px-4 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-lg">Rekomendasi PTN</span></div>
                      <span className="bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">Basic</span>
                      <h3 className="text-4xl font-black mt-4 mb-2 text-slate-900 dark:text-white">{getPrice('basic')}</h3>
                      <p className="text-xs text-slate-500 mb-8">{getDurationLabel()}</p>
                      <ul className="space-y-4 mb-8 text-sm font-bold text-slate-700 dark:text-white">
                          <li className="flex gap-3"><CheckCircle2 size={16} className="text-indigo-500"/> Full Bank Soal</li>
                          <li className="flex gap-3"><CheckCircle2 size={16} className="text-indigo-500"/> Full Ceklis OSCE</li>
                          <li className="flex gap-3 text-slate-400 line-through font-normal"><CheckCircle2 size={16} /> Insight Islami</li>
                      </ul>
                      <button onClick={() => navigate('/register')} className="w-full py-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-lg hover:shadow-indigo-500/30 transition-all">Pilih Basic</button>
                  </div>

                  {/* EXPERT */}
                  <div className="relative transform md:-translate-y-4">
                      <div className="absolute -top-4 inset-x-0 flex justify-center z-20">
                          <span className="bg-emerald-600 text-white px-4 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-lg">Rekomendasi PTM</span>
                      </div>
                      <div className="p-8 bg-slate-900 dark:bg-black rounded-[2.5rem] border border-slate-800 dark:border-white/20 shadow-2xl text-white relative overflow-hidden">
                          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/20 rounded-full blur-3xl"></div>
                          <div className="relative z-10 mt-2">
                              <span className="bg-emerald-500/20 text-emerald-400 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border border-emerald-500/30">Expert</span>
                              <h3 className="text-4xl font-black mt-4 mb-2">{getPrice('expert')}</h3>
                              <p className="text-xs text-slate-400 mb-8">{getDurationLabel()}</p>
                              <ul className="space-y-4 mb-8 text-sm text-slate-300">
                                  <li className="flex gap-3"><CheckCircle2 size={16} className="text-emerald-400"/> Semua Fitur Basic</li>
                                  <li className="flex gap-3"><CheckCircle2 size={16} className="text-emerald-400"/> <strong className="text-white">Akses OSCIE Center</strong></li>
                                  <li className="flex gap-3"><CheckCircle2 size={16} className="text-emerald-400"/> Fiqih Medis & Doa</li>
                              </ul>
                              <button onClick={() => navigate('/register')} className="w-full py-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 font-bold text-sm shadow-lg hover:shadow-emerald-500/30 transition-all flex items-center justify-center gap-2">
                                  <Award size={16} /> Upgrade Expert
                              </button>
                          </div>
                      </div>
                  </div>
              </div>

              {/* DONASI JARIYAH */}
              <div className="mt-12 text-center opacity-60">
                  <p className="text-xs font-medium text-slate-500 dark:text-slate-400 flex items-center justify-center gap-2">
                      <HeartHandshake size={14} className="text-teal-500"/> 
                      Sebagian keuntungan (30%) akan didonasikan untuk kegiatan sosial kesehatan & pengembangan fitur gratis.
                  </p>
              </div>
          </div>
      </section>

      {/* CONTRIBUTORS */}
      <section id="kontributor" className="py-24 bg-white dark:bg-slate-900/50 border-y border-slate-100 dark:border-white/5">
          <div className="max-w-7xl mx-auto px-6">
              <div className="text-center mb-16">
                  <div className="inline-flex items-center gap-2 mb-4 text-slate-500 dark:text-slate-400 font-bold bg-slate-100 dark:bg-white/5 px-4 py-1.5 rounded-full text-xs uppercase tracking-widest">
                      <Users size={14} /> Dibalik Layar
                  </div>
                  <h2 className="text-3xl font-black text-slate-900 dark:text-white">Tim Penyusun</h2>
              </div>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                  {TEAM_DIVISIONS.map((division, idx) => (
                      <div key={idx} className="space-y-6">
                          <h3 className={`text-sm font-black uppercase tracking-widest border-b border-slate-200 dark:border-white/10 pb-3 ${division.color}`}>
                              {division.title}
                          </h3>
                          <div className="space-y-4">
                              {division.members.map((member, mIdx) => (
                                  <div key={mIdx} className="flex items-start gap-4 group">
                                      <img 
                                        src={getAvatar(member.gender, member.name + mIdx)} 
                                        alt={member.name} 
                                        className="w-10 h-10 rounded-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 shrink-0"
                                      />
                                      <div>
                                          <h4 className="font-bold text-slate-900 dark:text-white text-sm">{member.name}</h4>
                                          <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-tight mt-0.5">{member.title}</p>
                                      </div>
                                  </div>
                              ))}
                          </div>
                      </div>
                  ))}
              </div>
          </div>
      </section>

      {/* PESAN PENULIS */}
      <section className="py-20 px-6 bg-slate-50 dark:bg-black relative">
          <div className="max-w-2xl mx-auto text-center">
              <Quote size={24} className="mx-auto mb-6 text-slate-300 dark:text-slate-700" />
              <p className="text-sm text-slate-600 dark:text-slate-300 italic leading-loose">
                  "Aplikasi ini lahir dari semangat belajar dan berbagi, sebagai panduan bagi rekan-rekan sejawat yang sedang menapaki perjalanan menjadi dokter sejati. Setiap lembar ditulis dengan harapan agar ilmu, keterampilan, dan nilai kemanusiaan dapat berjalan beriringan dalam setiap ujian, baik di meja OSCE maupun di medan pelayanan nyata. Semoga karya sederhana ini menjadi bagian kecil dari perjuangan besar kita dalam mengabdi kepada kesehatan bangsa."
              </p>
              <div className="mt-8 flex items-center justify-center gap-3 opacity-50">
                  <div className="h-px w-8 bg-slate-400"></div>
                  <p className="text-[10px] font-bold uppercase tracking-widest">Pesan Penulis</p>
                  <div className="h-px w-8 bg-slate-400"></div>
              </div>
          </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-white dark:bg-slate-900 py-12 border-t border-slate-100 dark:border-white/5">
          <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
              <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-slate-900 dark:bg-white rounded-lg flex items-center justify-center text-white dark:text-black font-black text-xs">M</div>
                  <span className="font-bold text-sm text-slate-900 dark:text-white">MedPrep Indonesia</span>
              </div>
              <div className="flex gap-6">
                  <a href="#" className="p-2 bg-slate-100 dark:bg-white/5 rounded-full text-slate-600 dark:text-slate-400 hover:text-pink-500 transition-colors"><Instagram size={18} /></a>
                  <a href="#" className="p-2 bg-slate-100 dark:bg-white/5 rounded-full text-slate-600 dark:text-slate-400 hover:text-green-500 transition-colors"><MessageCircle size={18} /></a>
              </div>
          </div>
          <div className="text-center mt-12 pt-8 border-t border-slate-100 dark:border-white/5 mx-6">
              <p className="text-[10px] text-slate-400">© 2026 MedPrep Indonesia. Dibuat dengan 💙 untuk sejawat.</p>
          </div>
      </footer>

    </div>
  );
}