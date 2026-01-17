import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Menu, X, Check, ArrowRight, Brain, Stethoscope, Heart, 
  BookOpen, Star, Shield, PlayCircle
} from 'lucide-react';

// --- SUB-COMPONENTS (Styling yang lebih Premium) ---

// 1. Feature Card dengan Hover Gradient & Glass Feel
const FeatureCard = ({ icon, title, subtitle, desc }: { icon: React.ReactNode, title: string, subtitle: string, desc: string }) => (
  <div className="group relative p-8 rounded-3xl bg-white border border-slate-100 shadow-sm hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 overflow-hidden">
    {/* Gradient Background on Hover */}
    <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-white opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
    
    <div className="relative z-10">
      <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-sm">
        {icon}
      </div>
      <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">{title}</h3>
      <p className="text-xs font-bold text-blue-600 mb-3 uppercase tracking-widest mt-1">{subtitle}</p>
      <p className="text-slate-600 leading-relaxed text-sm">
        {desc}
      </p>
    </div>
  </div>
);

// 2. Testimonial Card dengan Style Minimalis
const TestimonialCard = ({ quote, name, role }: { quote: string, name: string, role: string }) => (
  <div className="bg-white/60 backdrop-blur-sm p-8 rounded-2xl border border-white shadow-xl relative">
    <div className="flex items-center gap-4 mb-4">
      <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-50 rounded-full flex items-center justify-center font-bold text-blue-600 text-lg">
        {name.charAt(0)}
      </div>
      <div>
        <h4 className="font-bold text-slate-900 text-sm">{name}</h4>
        <p className="text-xs text-slate-500 font-medium">{role}</p>
      </div>
    </div>
    <p className="text-slate-700 italic relative z-10 text-lg font-medium leading-relaxed">"{quote}"</p>
  </div>
);

// --- MAIN COMPONENT ---
export default function LandingPage() {
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // State Toggle
  const [demoMode, setDemoMode] = useState<'standard' | 'insight'>('standard');

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-blue-100 selection:text-blue-900 overflow-x-hidden">
      
      {/* ================= BACKGROUND MESH GRADIENTS (Orbs) ================= */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        {/* Bola Ungu Pudar di Kiri Atas */}
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-purple-200 rounded-full mix-blend-multiply filter blur-[128px] opacity-40 animate-blob"></div>
        {/* Bola Biru Pudar di Kanan Atas */}
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-200 rounded-full mix-blend-multiply filter blur-[128px] opacity-40 animate-blob animation-delay-2000"></div>
        {/* Bola Pink Pudar di Tengah Bawah */}
        <div className="absolute -bottom-32 left-20 w-[600px] h-[600px] bg-pink-100 rounded-full mix-blend-multiply filter blur-[128px] opacity-40 animate-blob animation-delay-4000"></div>
      </div>

      {/* ================= NAVBAR (GLASSMORPHISM) ================= */}
      <nav className={`fixed w-full z-50 transition-all duration-500 ${
        isScrolled 
          ? 'bg-white/70 backdrop-blur-lg border-b border-white/20 shadow-sm py-4' 
          : 'bg-transparent py-6'
      }`}>
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2.5 font-extrabold text-2xl tracking-tighter text-slate-900 cursor-pointer" onClick={() => window.scrollTo(0,0)}>
            <div className="w-9 h-9 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-500/30">M</div>
            MedPrep
          </div>

          {/* Menu Desktop */}
          <div className="hidden md:flex items-center gap-10 font-medium text-slate-600 text-sm">
            {['Home', 'Fitur', 'Kurikulum', 'Harga'].map((item) => (
              <a key={item} href={`#${item.toLowerCase()}`} className="hover:text-blue-600 transition-colors relative group">
                {item}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 transition-all group-hover:w-full"></span>
              </a>
            ))}
          </div>

          {/* Tombol Auth */}
          <div className="hidden md:flex items-center gap-3">
            <button onClick={() => navigate('/login')} className="px-6 py-2.5 text-slate-600 font-bold text-sm hover:text-blue-600 transition-colors">
              Masuk
            </button>
            <button 
              onClick={() => navigate('/register')}
              className="px-6 py-2.5 rounded-full bg-slate-900 text-white font-bold text-sm hover:bg-blue-600 transition-all shadow-lg hover:shadow-blue-500/25 active:scale-95"
            >
              Daftar Gratis
            </button>
          </div>

          {/* Mobile Toggle */}
          <button className="md:hidden p-2 text-slate-600" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
        
        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 w-full bg-white/95 backdrop-blur-xl border-b border-slate-100 p-6 flex flex-col gap-4 shadow-xl animate-in slide-in-from-top-5">
            <button onClick={() => navigate('/register')} className="w-full py-3 bg-blue-600 text-white rounded-xl font-bold shadow-lg shadow-blue-500/30">Daftar Sekarang</button>
          </div>
        )}
      </nav>

      {/* ================= HERO SECTION ================= */}
      <section id="home" className="relative pt-44 pb-20 px-6 overflow-hidden z-10">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          
          {/* Text Content */}
          <div className="space-y-8 animate-in slide-in-from-left duration-1000">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-blue-100 shadow-sm text-blue-700 text-xs font-bold uppercase tracking-wider">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
              </span>
              #1 Platform UKMPPD Terintegrasi
            </div>
            
            <h1 className="text-5xl lg:text-7xl font-extrabold leading-[1.1] text-slate-900 tracking-tight">
              Lulus UKMPPD <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">One Shot.</span>
            </h1>
            
            <p className="text-lg text-slate-600 leading-relaxed max-w-lg font-medium">
              Platform belajar kedokteran masa depan. Bank soal klinis terupdate, panduan OSCE visual, dan wawasan <span className="text-slate-900 font-bold decoration-wavy underline decoration-emerald-400">Bioetika Medis</span>.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <button onClick={() => navigate('/register')} className="group flex items-center justify-center gap-3 bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-2xl font-bold text-lg shadow-xl shadow-blue-500/20 transition-all hover:-translate-y-1">
                Mulai Belajar
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </button>
              <button className="flex items-center justify-center gap-3 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 px-8 py-4 rounded-2xl font-bold text-lg transition-all">
                <PlayCircle size={20} /> Demo Video
              </button>
            </div>
            
            <div className="flex items-center gap-6 pt-4 text-sm font-semibold text-slate-500">
              <div className="flex -space-x-2">
                {[1,2,3,4].map(i => <div key={i} className={`w-8 h-8 rounded-full border-2 border-white bg-slate-200 bg-[url('https://i.pravatar.cc/100?img=${10+i}')] bg-cover`}></div>)}
              </div>
              <p>Dipercaya 2.000+ Mahasiswa FK</p>
            </div>
          </div>

          {/* Visual Hero: Glass Laptop Mockup */}
          <div className="relative animate-in slide-in-from-right duration-1000 delay-200">
            <div className="relative mx-auto bg-slate-900 rounded-2xl border-[6px] border-slate-800 w-full max-w-[550px] shadow-2xl overflow-hidden group">
              
              {/* Top Bar */}
              <div className="bg-slate-800 h-6 flex items-center gap-1.5 px-4">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500/80"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-green-500/80"></div>
              </div>

              {/* Screen Area */}
              <div className="bg-white aspect-[16/10] p-8 relative overflow-hidden">
                {/* Abstract Content Placeholder */}
                <div className="space-y-4 opacity-30">
                  <div className="h-6 bg-slate-900 rounded-md w-1/3 mb-8"></div>
                  <div className="h-3 bg-slate-400 rounded w-full"></div>
                  <div className="h-3 bg-slate-400 rounded w-5/6"></div>
                  <div className="h-3 bg-slate-400 rounded w-4/6"></div>
                  <div className="grid grid-cols-2 gap-4 mt-8">
                    <div className="h-24 bg-blue-100 rounded-lg"></div>
                    <div className="h-24 bg-slate-100 rounded-lg"></div>
                  </div>
                </div>

                {/* THE FLOATING INSIGHT CARD (Glassmorphism Effect) */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[85%] bg-white/60 backdrop-blur-md border border-white/50 p-6 rounded-2xl shadow-2xl z-10 animate-float">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="bg-emerald-100 p-2 rounded-lg text-emerald-600">
                      <BookOpen size={20} />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">Insight Mode Detected</h4>
                      <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider">Fiqih Medis</p>
                    </div>
                  </div>
                  <p className="text-slate-700 text-xs font-medium leading-relaxed">
                    "Pada kondisi gawat darurat (life-saving), tindakan medis prioritas mendahului izin keluarga (Informed Consent bisa menyusul)."
                  </p>
                  <div className="mt-3 text-[10px] text-slate-400 font-mono bg-white/50 p-2 rounded">
                    Ref: Kaidah Fiqih "Adh-dharuraat tubiihul mahzhuraat"
                  </div>
                </div>

              </div>
            </div>
            
            {/* Dekorasi di belakang laptop */}
            <div className="absolute -z-10 -bottom-10 -right-10 w-40 h-40 bg-blue-500/20 rounded-full blur-2xl"></div>
            <div className="absolute -z-10 -top-10 -left-10 w-40 h-40 bg-purple-500/20 rounded-full blur-2xl"></div>
          </div>

        </div>
      </section>

      {/* ================= WHY MEDPREP (Clean Cards) ================= */}
      <section id="features" className="py-24 relative z-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold mb-4 tracking-tight text-slate-900">Kenapa Harus MedPrep?</h2>
            <p className="text-slate-500 max-w-2xl mx-auto text-lg">Kombinasi sempurna antara kecerdasan klinis dan kepekaan nurani.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<Brain size={32} />}
              title="Tajam Klinis"
              subtitle="The Brain"
              desc="Soal vignette CBT sesuai blueprint terbaru. Latih clinical reasoning dengan pembahasan mendalam, bukan sekadar kunci jawaban."
            />
            <FeatureCard 
              icon={<Stethoscope size={32} />}
              title="Terampil Praktis"
              subtitle="The Skill"
              desc="Checklist OSCE interaktif. Panduan langkah demi langkah dari Anamnesis hingga Edukasi, lengkap dengan timer ujian."
            />
            <FeatureCard 
              icon={<Heart size={32} />}
              title="Beradab & Etis"
              subtitle="The Soul"
              desc="Integrasi modul Bioetika & Fiqih Medis. Membentuk dokter yang tidak hanya pintar mengobati, tapi juga menenangkan hati."
            />
          </div>
        </div>
      </section>

      {/* ================= TOGGLE SECTION (Gradient Container) ================= */}
      <section className="py-24 relative overflow-hidden">
        {/* Latar Belakang Gradient Halus */}
        <div className="absolute inset-0 bg-gradient-to-b from-white via-blue-50/50 to-white"></div>
        
        <div className="max-w-6xl mx-auto px-6 relative z-10">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Satu Aplikasi, Dua Dunia.</h2>
            <p className="text-slate-600 text-lg">
              Geser toggle untuk melihat bagaimana MedPrep mengubah cara Anda belajar.
            </p>
          </div>

          {/* TOGGLE SWITCH */}
          <div className="flex justify-center items-center gap-6 mb-12 select-none">
            <span className={`font-bold text-lg transition-colors ${demoMode === 'standard' ? 'text-blue-600' : 'text-slate-300'}`}>Mode Medis</span>
            <div 
              onClick={() => setDemoMode(prev => prev === 'standard' ? 'insight' : 'standard')}
              className="w-24 h-12 bg-slate-200 rounded-full p-1 cursor-pointer relative shadow-inner transition-colors duration-500"
              style={{ backgroundColor: demoMode === 'insight' ? '#d1fae5' : '#e2e8f0' }}
            >
              <div className={`w-10 h-10 rounded-full shadow-md transform transition-all duration-500 flex items-center justify-center text-white ${
                demoMode === 'insight' ? 'translate-x-12 bg-emerald-500' : 'translate-x-0 bg-blue-500'
              }`}>
                {demoMode === 'insight' ? <BookOpen size={18} /> : <Brain size={18} />}
              </div>
            </div>
            <span className={`font-bold text-lg transition-colors ${demoMode === 'insight' ? 'text-emerald-600' : 'text-slate-300'}`}>Mode Insight</span>
          </div>

          {/* INTERACTIVE DEMO CONTAINER */}
          <div className="bg-white rounded-[2.5rem] shadow-2xl border border-slate-100 overflow-hidden transition-all duration-700">
            <div className="grid md:grid-cols-5 min-h-[400px]">
              
              {/* KONTEN MEDIS (KIRI) */}
              <div className="md:col-span-3 p-10 flex flex-col justify-center border-r border-slate-50">
                <div className="inline-block bg-blue-100 text-blue-700 px-3 py-1 rounded-lg text-xs font-bold w-fit mb-4">Gastroenterohepatology</div>
                <h3 className="text-3xl font-bold text-slate-800 mb-4">Sirosis Hepatis</h3>
                <p className="text-slate-600 leading-relaxed mb-6">
                  Kondisi fibrosis hati lanjut yang ditandai dengan distorsi arsitektur hepar dan pembentukan nodul regeneratif. Gejala klinis meliputi asites, ikterus, dan eritema palmaris.
                </p>
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                  <h4 className="font-bold text-slate-700 text-sm mb-2">Tatalaksana Utama:</h4>
                  <ul className="list-disc pl-4 text-sm text-slate-600 space-y-1">
                    <li>Atasi etiologi (Antiviral untuk Hep B/C).</li>
                    <li>Restriksi garam untuk asites.</li>
                    <li>Skrining karsinoma hepatoseluler.</li>
                  </ul>
                </div>
              </div>

              {/* KONTEN INSIGHT (KANAN - DINAMIS) */}
              <div className={`md:col-span-2 p-10 flex flex-col justify-center transition-colors duration-500 ${
                demoMode === 'insight' ? 'bg-emerald-50/50' : 'bg-slate-50/50'
              }`}>
                {demoMode === 'insight' ? (
                  <div className="animate-in slide-in-from-right fade-in duration-500">
                    <div className="bg-white p-6 rounded-2xl shadow-lg border border-emerald-100 mb-4">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="bg-emerald-100 p-2 rounded-lg text-emerald-600"><BookOpen size={20} /></div>
                        <h4 className="font-bold text-emerald-800">Perspektif Islam</h4>
                      </div>
                      <p className="text-sm text-slate-700 leading-relaxed">
                        Jika Sirosis disebabkan oleh alkohol, hukum berobat tetap <strong>Wajib</strong>, namun tobat nasuha diperlukan.
                      </p>
                    </div>
                    <div className="bg-white p-6 rounded-2xl shadow-lg border border-emerald-100">
                      <h4 className="font-bold text-emerald-800 mb-2 text-sm">Doa Kesembuhan</h4>
                      <p className="text-xs text-slate-500 italic">"Allahumma Rabban-nasi, adzhibil-ba'sa..."</p>
                    </div>
                  </div>
                ) : (
                  <div className="text-center opacity-40">
                    <BookOpen size={48} className="mx-auto mb-4 text-slate-400" />
                    <p className="text-sm font-medium">Mode Medis Aktif</p>
                    <p className="text-xs">Aktifkan toggle untuk melihat wawasan integratif.</p>
                  </div>
                )}
              </div>

            </div>
          </div>

          <div className="mt-12 max-w-3xl mx-auto">
             <TestimonialCard 
              quote="Jujur, fitur Insight ini game changer. Pas ujian OSCE station komunikasi, gue jadi lebih pede ngomong sama pasien karena paham aspek etis & agamanya."
              name="Dr. Muda Aditya"
              role="Universitas Indonesia"
            />
          </div>
        </div>
      </section>

      {/* ================= PRICING ================= */}
      <section id="pricing" className="py-24 bg-white z-10 relative">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-extrabold mb-12">Investasi Cerdas.</h2>
          
          <div className="grid md:grid-cols-2 gap-8 items-center">
            
            {/* Free Tier */}
            <div className="bg-white p-8 rounded-3xl border border-slate-200 hover:border-blue-200 transition-colors">
              <h3 className="font-bold text-slate-500 text-lg mb-2">Starter</h3>
              <div className="text-4xl font-extrabold mb-1 text-slate-900">Rp 0</div>
              <p className="text-slate-400 text-sm mb-8">Selamanya.</p>
              
              <ul className="space-y-4 text-left text-sm text-slate-600 mb-8 px-4">
                <li className="flex gap-3"><Check size={18} className="text-blue-500" /> 100 Soal Latihan</li>
                <li className="flex gap-3"><Check size={18} className="text-blue-500" /> Akses Dasar OSCE</li>
                <li className="flex gap-3 text-slate-400"><X size={18} /> <span className="line-through">Modul Bioetika</span></li>
              </ul>
              
              <button onClick={() => navigate('/register')} className="w-full py-3.5 rounded-xl border-2 border-slate-100 text-slate-700 font-bold hover:border-slate-300 transition-all">
                Daftar Gratis
              </button>
            </div>

            {/* Premium Tier */}
            <div className="bg-slate-900 p-8 rounded-3xl text-white shadow-2xl shadow-blue-900/20 transform scale-105 relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-gradient-to-bl from-blue-500 to-purple-500 text-white text-[10px] font-bold px-4 py-1.5 rounded-bl-xl uppercase tracking-wider">
                Best Value
              </div>
              
              <h3 className="font-bold text-blue-200 text-lg mb-2">Pro Doctor</h3>
              <div className="text-4xl font-extrabold mb-1">Rp 149rb</div>
              <p className="text-slate-400 text-sm mb-8">per bulan</p>
              
              <ul className="space-y-4 text-left text-sm text-slate-300 mb-8 px-4">
                <li className="flex gap-3"><Check size={18} className="text-emerald-400" /> <strong>Unlimited</strong> Bank Soal</li>
                <li className="flex gap-3"><Check size={18} className="text-emerald-400" /> Full Video OSCE</li>
                <li className="flex gap-3"><Check size={18} className="text-emerald-400" /> <strong>Akses Modul Insight</strong></li>
                <li className="flex gap-3"><Check size={18} className="text-emerald-400" /> Statistik Analisis</li>
              </ul>
              
              <button onClick={() => navigate('/register')} className="w-full py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold transition-all shadow-lg shadow-blue-500/30">
                Langganan Sekarang
              </button>
            </div>

          </div>
        </div>
      </section>

      {/* ================= FOOTER ================= */}
      <footer className="bg-slate-50 border-t border-slate-200 pt-16 pb-8 text-center">
        <div className="flex items-center justify-center gap-2 font-extrabold text-2xl text-slate-900 mb-6">
          <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center text-white text-sm">M</div>
          MedPrep
        </div>
        <div className="flex justify-center gap-6 mb-8 text-sm text-slate-500 font-medium">
          <a href="#" className="hover:text-blue-600">Tentang Kami</a>
          <a href="#" className="hover:text-blue-600">Kebijakan Privasi</a>
          <a href="#" className="hover:text-blue-600">Bantuan</a>
        </div>
        <p className="text-xs text-slate-400">
          © 2026 MedPrep Indonesia. Dibuat dengan 💙 dan ☕ untuk sejawat.
        </p>
      </footer>

      {/* CSS untuk Animasi Blob & Float */}
      <style>{`
        @keyframes float {
          0% { transform: translate(-50%, -50%) translateY(0px); }
          50% { transform: translate(-50%, -50%) translateY(-10px); }
          100% { transform: translate(-50%, -50%) translateY(0px); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 { animation-delay: 2s; }
        .animation-delay-4000 { animation-delay: 4s; }
      `}</style>

    </div>
  );
}