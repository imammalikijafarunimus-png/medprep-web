import React from 'react';
import { ArrowRight, PlayCircle, BookOpen, Users, Trophy, Star, Brain, Stethoscope, Heart, Sparkles } from 'lucide-react';

// ============================================
// TYPES
// ============================================
interface HeroStats {
  icon: React.ElementType;
  value: string;
  label: string;
}

interface HeroSectionProps {
  onGetStarted?: () => void;
  onWatchDemo?: () => void;
}

// ============================================
// DATA
// ============================================
const STATS: HeroStats[] = [
  { icon: Users, value: '3,200+', label: 'Mahasiswa Aktif' },
  { icon: Trophy, value: '97%', label: 'Lulus One Shot' },
  { icon: BookOpen, value: '3,000+', label: 'Bank Soal' },
  { icon: Star, value: '4.9★', label: 'Rating Pengguna' },
];

const FEATURES = [
  {
    icon: Brain,
    title: 'Tajam Klinis',
    subtitle: 'The Brain',
    description: 'Soal vignette CBT sesuai blueprint terbaru. Latih clinical reasoning dengan pembahasan mendalam.',
    color: 'dealbox' as const,
  },
  {
    icon: Stethoscope,
    title: 'Terampil Praktis',
    subtitle: 'The Skill',
    description: 'Checklist OSCE interaktif. Panduan langkah demi langkah dari Anamnesis hingga Edukasi.',
    color: 'brand' as const,
  },
  {
    icon: Heart,
    title: 'Beradab & Etis',
    subtitle: 'The Soul',
    description: 'Integrasi modul Bioetika & Fiqih Medis. Membentuk dokter yang menenangkan hati pasien.',
    color: 'success' as const,
  },
];

// ============================================
// HERO SECTION COMPONENT
// ============================================
export function HeroSection({ onGetStarted, onWatchDemo }: HeroSectionProps) {
  return (
    <section className="hero-section border-b border-border">
      {/* Gradient Background */}
      <div className="absolute inset-0 hero-gradient pointer-events-none" />
      
      {/* Blur Orbs */}
      <div className="hero-orb hero-orb-primary w-[500px] h-[500px] right-0 top-0" />
      <div className="hero-orb hero-orb-secondary w-[400px] h-[400px] left-0 bottom-0" />
      
      <div className="container-app relative py-12 md:py-16">
        {/* Hero Content */}
        <div className="mx-auto max-w-4xl text-center">
          {/* Live Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-white/90 text-xs font-semibold uppercase tracking-wider mb-6">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-success" />
            </span>
            Medical OS v1.0
          </div>

          {/* Main Title */}
          <h1 className="hero-title text-white mb-6">
            Lulus UKMPPD{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-white/70">
              One Shot.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="hero-subtitle text-white/90 mx-auto mb-8">
            Platform belajar kedokteran #1 yang mengintegrasikan Bank Soal
            Klinis, Checklist OSCE, dan{' '}
            <span className="text-success font-semibold underline decoration-wavy decoration-success/50">
              Wawasan Bioetika Islam
            </span>{' '}
            dalam satu aplikasi.
          </p>

          {/* Stats Ticker */}
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3 mb-8">
            {STATS.map(({ icon: Icon, value, label }) => (
              <div key={label} className="flex items-center gap-2 text-sm font-semibold text-white/80">
                <Icon size={16} className="text-success" />
                <span className="text-white font-bold">{value}</span>
                <span>{label}</span>
              </div>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <button
              onClick={onGetStarted}
              className="btn-hero-primary group"
            >
              Mulai Belajar
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              onClick={onWatchDemo}
              className="btn-hero-secondary"
            >
              <PlayCircle size={18} />
              Lihat Demo
            </button>
          </div>

          {/* Disclaimer */}
          <p className="mt-6 text-xs text-white/60 leading-relaxed">
            Platform pembelajaran kedokteran untuk persiapan UKMPPD
          </p>
        </div>

        {/* Dashboard Mockup Card */}
        <div className="mx-auto mt-10 max-w-5xl">
          <DashboardMockup />
        </div>
      </div>
    </section>
  );
}

// ============================================
// DASHBOARD MOCKUP COMPONENT
// ============================================
function DashboardMockup() {
  return (
    <div className="chrome-card backdrop-blur-sm bg-white/95 dark:bg-card/95 border-white/20">
      {/* Chrome Header */}
      <div className="chrome-header bg-muted/30">
        <div className="chrome-dots">
          <div className="chrome-dot chrome-dot-red" />
          <div className="chrome-dot chrome-dot-yellow" />
          <div className="chrome-dot chrome-dot-green" />
        </div>
        <div className="chrome-url">
          <div className="chrome-url-inner bg-muted/50">
            app.medprep.id/dashboard
          </div>
        </div>
      </div>
      
      {/* Content */}
      <div className="chrome-content">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-foreground">
              Progress Belajar
            </h3>
            <p className="text-sm text-muted-foreground">
              Pantau perkembangan kamu secara real-time
            </p>
          </div>
          <div className="live-indicator">
            <div className="live-dot" />
            Live
          </div>
        </div>
        
        {/* Mockup Content */}
        <div className="grid md:grid-cols-3 gap-4">
          {/* Progress Card */}
          <div className="stat-card">
            <div className="text-sm text-muted-foreground mb-1">Soal Selesai</div>
            <div className="text-2xl font-bold text-dealbox">1,234</div>
            <div className="text-xs text-success mt-1">+12% dari minggu lalu</div>
          </div>
          
          {/* Accuracy Card */}
          <div className="stat-card">
            <div className="text-sm text-muted-foreground mb-1">Akurasi</div>
            <div className="text-2xl font-bold text-dealbox">87%</div>
            <div className="text-xs text-success mt-1">+5% improvement</div>
          </div>
          
          {/* Streak Card */}
          <div className="stat-card">
            <div className="text-sm text-muted-foreground mb-1">Streak Harian</div>
            <div className="text-2xl font-bold text-dealbox">14 hari</div>
            <div className="text-xs text-warning mt-1">🔥 Tetap semangat!</div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================
// PARTNER LOGOS SECTION
// ============================================
export function PartnerLogosSection() {
  // Placeholder logos - ganti dengan logo universitas asli
  const partners = [
    'Universitas Indonesia',
    'Universitas Gadjah Mada',
    'Universitas Diponegoro',
    'Universitas Airlangga',
    'Universitas Brawijaya',
  ];

  return (
    <section className="border-b border-border bg-warm py-12 md:py-16">
      <div className="container-app">
        <div className="mb-12 text-center">
          <h2 className="text-lg md:text-xl font-medium text-muted-foreground">
            Dipercaya oleh Mahasiswa dari Berbagai Universitas
          </h2>
        </div>
        
        <div className="marquee-container">
          {/* Fade Masks */}
          <div className="marquee-mask-left" />
          <div className="marquee-mask-right" />
          
          {/* Marquee Content */}
          <div className="marquee-content">
            {/* First set */}
            <div className="flex min-w-max items-center gap-12 md:gap-20 px-6">
              {partners.map((partner, idx) => (
                <div
                  key={`first-${idx}`}
                  className="h-12 md:h-16 px-6 flex items-center justify-center text-muted-foreground/60 hover:text-foreground font-semibold transition-all duration-300"
                >
                  {partner}
                </div>
              ))}
            </div>
            {/* Duplicate for seamless loop */}
            <div className="flex min-w-max items-center gap-12 md:gap-20 px-6">
              {partners.map((partner, idx) => (
                <div
                  key={`second-${idx}`}
                  className="h-12 md:h-16 px-6 flex items-center justify-center text-muted-foreground/60 hover:text-foreground font-semibold transition-all duration-300"
                >
                  {partner}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ============================================
// STATS SECTION
// ============================================
export function StatsSection() {
  return (
    <section className="py-16 md:py-20 bg-background border-b border-border">
      <div className="container-app">
        <div className="stats-grid">
          {STATS.map(({ icon: Icon, value, label }) => (
            <div key={label} className="stat-item">
              <Icon size={24} className="mx-auto mb-2 text-dealbox" />
              <div className="stat-value">{value}</div>
              <div className="stat-label">{label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ============================================
// FEATURES SECTION
// ============================================
export function FeaturesSection() {
  return (
    <section className="py-24 px-6 bg-warm border-b border-border">
      <div className="container-app">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Kenapa Harus MedPrep?
          </h2>
          <p className="text-lg text-muted-foreground">
            Kombinasi sempurna antara kecerdasan klinis dan kepekaan nurani.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {FEATURES.map(({ icon: Icon, title, subtitle, description, color }) => (
            <div
              key={title}
              className="p-8 bg-card rounded-[2rem] border border-border hover:shadow-xl transition-all hover:-translate-y-1"
            >
              {/* Icon Container */}
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 ${
                color === 'dealbox' ? 'icon-container-dealbox' :
                color === 'brand' ? 'icon-container-brand' :
                'icon-container-success'
              }`}>
                <Icon size={28} />
              </div>
              
              {/* Title */}
              <h3 className="text-lg font-bold text-foreground mb-2">
                {title}
              </h3>
              
              {/* Subtitle */}
              <p className={`text-xs font-bold uppercase tracking-widest mb-3 ${
                color === 'dealbox' ? 'text-dealbox' :
                color === 'brand' ? 'text-brand' :
                'text-success'
              }`}>
                {subtitle}
              </p>
              
              {/* Description */}
              <p className="text-sm text-muted-foreground leading-relaxed">
                {description}
              </p>
            </div>
          ))}

          {/* Coming Soon Card */}
          <div className="p-8 bg-gradient-to-b from-success/20 to-success/10 text-foreground rounded-[2rem] border border-success/30 shadow-lg relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-success/20 rounded-full blur-2xl group-hover:bg-success/30 transition-all" />
            <div className="relative z-10">
              <div className="flex justify-between items-start mb-6">
                <div className="w-14 h-14 bg-white/10 text-success rounded-2xl flex items-center justify-center backdrop-blur-sm">
                  <Sparkles size={28} />
                </div>
                <span className="bg-white/20 text-xs font-bold px-2 py-1 rounded text-success border border-success/20 uppercase tracking-wide">
                  Coming Soon
                </span>
              </div>
              <h3 className="text-lg font-bold mb-2">OSCIE Center</h3>
              <p className="text-xs font-bold text-success/80 uppercase tracking-widest mb-3">
                Islamic Integration
              </p>
              <p className="text-sm text-foreground/80 leading-relaxed">
                Panduan Ceklis OSCIE, Doa Medis, dan Fiqih sesuai Himpunan Putusan Tarjih.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;