import { Link } from 'react-router-dom';
import { BookOpen, ShieldCheck, Moon, ArrowRight } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-dark text-white font-sans">
      {/* Navbar Sederhana */}
      <nav className="p-6 flex justify-between items-center max-w-7xl mx-auto">
        <div className="text-2xl font-heading font-bold flex items-center gap-2">
          <span className="bg-primary p-1 rounded-lg">MD</span> MedPrep
        </div>
        <div className="flex gap-4">
          <Link
            to="/login"
            className="px-4 py-2 text-sm font-medium hover:text-primary transition-colors"
          >
            Masuk
          </Link>
          <Link
            to="/register"
            className="px-4 py-2 bg-primary hover:bg-blue-600 rounded-lg text-sm font-medium transition-colors"
          >
            Daftar Gratis
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="px-6 py-12 lg:py-20 max-w-7xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-xs font-medium mb-6 border border-blue-500/20">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
          </span>
          Platform Belajar #1 untuk Calon Dokter Muslim
        </div>

        <h1 className="text-4xl lg:text-6xl font-heading font-bold mb-6 leading-tight">
          Lulus UKMPPD dengan <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-cyan-400">
            Integrasi Keislaman
          </span>
        </h1>

        <p className="text-slate-400 text-lg mb-8 max-w-2xl mx-auto">
          Belajar ribuan soal CBT, latihan OSCE interaktif, dan dapatkan insight
          fiqih medis dalam satu aplikasi.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/login"
            className="flex items-center gap-2 bg-primary hover:bg-blue-600 px-8 py-3 rounded-xl font-bold transition-all hover:scale-105"
          >
            Mulai Belajar Sekarang <ArrowRight size={20} />
          </Link>
          <button className="px-8 py-3 rounded-xl font-bold border border-slate-700 hover:bg-slate-800 transition-colors">
            Pelajari Fitur
          </button>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-6 mt-20 text-left">
          <div className="p-6 rounded-2xl bg-surface border border-slate-700">
            <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center text-primary mb-4">
              <BookOpen size={24} />
            </div>
            <h3 className="text-xl font-bold mb-2">Bank Soal Lengkap</h3>
            <p className="text-slate-400">
              Ribuan soal latihan UKMPPD terbaru dengan pembahasan mendalam.
            </p>
          </div>
          <div className="p-6 rounded-2xl bg-surface border border-slate-700">
            <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center text-purple-400 mb-4">
              <ShieldCheck size={24} />
            </div>
            <h3 className="text-xl font-bold mb-2">OSCE Lab</h3>
            <p className="text-slate-400">
              Checklist interaktif untuk latihan keterampilan klinis mandiri.
            </p>
          </div>
          <div className="p-6 rounded-2xl bg-surface border border-slate-700 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-20 bg-islamic/5 rounded-full blur-3xl -mr-10 -mt-10"></div>
            <div className="w-12 h-12 bg-islamic/20 rounded-lg flex items-center justify-center text-islamic mb-4 relative z-10">
              <Moon size={24} />
            </div>
            <h3 className="text-xl font-bold mb-2 text-islamic relative z-10">
              Mode Islam
            </h3>
            <p className="text-slate-400 relative z-10">
              Integrasi doa, adab, dan hukum fiqih medis di setiap materi.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
