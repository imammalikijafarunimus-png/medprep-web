import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { PTM_UNIVERSITIES, GENERAL_UNIVERSITIES } from '../data/universities';
import { 
  ArrowRight, Check, ChevronRight, School, 
  BookOpen, User, Mail, Lock, Sparkles 
} from 'lucide-react';

// --- TIPE DATA TYPESCRIPT ---
type Step = 1 | 2 | 3;
type UserSegment = 'muhammadiyah' | 'general';

interface OnboardingData {
  name: string;
  email: string;
  password: string;
  university: string;
  segment: UserSegment;
  enableInsight: boolean;
}

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();

  // State Halaman
  const [currentStep, setCurrentStep] = useState<Step>(1);
  const [isLoading, setIsLoading] = useState(false);
  
  // State Form Data
  const [formData, setFormData] = useState<OnboardingData>({
    name: '',
    email: '',
    password: '',
    university: '',
    segment: 'general', // default
    enableInsight: false
  });

  // --- LOGIKA STEP 2: PILIH KAMPUS ---
  const handleUnivSelect = (univ: string, isPTM: boolean) => {
    setFormData(prev => ({
      ...prev,
      university: univ,
      segment: isPTM ? 'muhammadiyah' : 'general',
      // Jika PTM, default insight nyala. Jika umum, mati dulu (ditawarin di step 3)
      enableInsight: isPTM 
    }));
    setCurrentStep(3);
  };

  // --- LOGIKA FINAL: REGISTER & SIMPAN ---
  const handleFinish = async () => {
    setIsLoading(true);
    try {
      // 1. Register Auth Firebase
      const userCredential = await register(formData.email, formData.password);
      const user = userCredential.user;

      // 2. Simpan Data Profil ke Firestore
      await setDoc(doc(db, "users", user.uid), {
        name: formData.name,
        email: formData.email,
        university: formData.university,
        segment: formData.segment,
        role: 'student',
        
        // Settings Preferences
        preferences: {
          showIslamicInsight: formData.enableInsight,
          showPrayerTimes: formData.segment === 'muhammadiyah' // Default nyala buat PTM
        },
        
        createdAt: serverTimestamp()
      });

      // 3. Redirect ke Dashboard
      navigate('/app');

    } catch (error: any) {
      alert("Gagal mendaftar: " + error.message);
      // Jika gagal auth, kembalikan ke step 1
      setCurrentStep(1);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 flex items-center justify-center p-4 font-sans selection:bg-blue-500/30">
      
      {/* Background Ambience (Glow Gelap) */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-blue-900/20 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-emerald-900/10 rounded-full blur-[100px]"></div>
      </div>

      <div className="w-full max-w-lg relative z-10">
        
        {/* Progress Bar Sederhana */}
        <div className="flex gap-2 mb-8 justify-center">
          {[1, 2, 3].map((step) => (
            <div 
              key={step}
              className={`h-1.5 rounded-full transition-all duration-500 ${
                step <= currentStep ? 'w-12 bg-blue-500' : 'w-4 bg-slate-800'
              }`}
            />
          ))}
        </div>

        {/* CONTAINER UTAMA (Glass Effect Dark) */}
        <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-3xl p-8 shadow-2xl">
          
          {/* STEP 1: AKUN BASIC */}
          {currentStep === 1 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right duration-500">
              <div className="text-center">
                <h1 className="text-2xl font-bold text-white mb-2">Buat Akun MedPrep</h1>
                <p className="text-slate-400 text-sm">Mulai perjalanan lulus UKMPPD One Shot.</p>
              </div>

              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Nama Lengkap</label>
                  <div className="relative">
                    <User className="absolute left-4 top-3.5 text-slate-500" size={18} />
                    <input 
                      type="text" 
                      placeholder="dr. Muda Siapa"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 pl-12 pr-4 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all outline-none placeholder:text-slate-600"
                      value={formData.name}
                      onChange={e => setFormData({...formData, name: e.target.value})}
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Email Kampus / Pribadi</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-3.5 text-slate-500" size={18} />
                    <input 
                      type="email" 
                      placeholder="nama@univ.ac.id"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 pl-12 pr-4 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all outline-none placeholder:text-slate-600"
                      value={formData.email}
                      onChange={e => setFormData({...formData, email: e.target.value})}
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-3.5 text-slate-500" size={18} />
                    <input 
                      type="password" 
                      placeholder="Minimal 6 karakter"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 pl-12 pr-4 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all outline-none placeholder:text-slate-600"
                      value={formData.password}
                      onChange={e => setFormData({...formData, password: e.target.value})}
                    />
                  </div>
                </div>
              </div>

              <button 
                onClick={() => {
                  if(formData.name && formData.email && formData.password.length >= 6) setCurrentStep(2);
                  else alert("Mohon lengkapi data dengan benar.");
                }}
                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all"
              >
                Lanjut <ChevronRight size={18} />
              </button>
              
              <p className="text-center text-xs text-slate-500 mt-4">
                Sudah punya akun? <Link to="/login" className="text-blue-400 hover:underline">Masuk</Link>
              </p>
            </div>
          )}

          {/* STEP 2: UNIVERSITAS (The Filter) */}
          {currentStep === 2 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right duration-500">
              <div className="text-center">
                <div className="w-12 h-12 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4 text-blue-400">
                  <School size={24} />
                </div>
                <h2 className="text-xl font-bold text-white">Di mana kamu menimba ilmu?</h2>
                <p className="text-slate-400 text-sm">Kami akan menyesuaikan kurikulum untukmu.</p>
              </div>

              <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                <p className="text-xs font-bold text-blue-400 uppercase tracking-wider mb-2">Perguruan Tinggi Muhammadiyah</p>
                {PTM_UNIVERSITIES.map(univ => (
                  <button
                    key={univ}
                    onClick={() => handleUnivSelect(univ, true)}
                    className="w-full text-left p-4 rounded-xl bg-slate-950/50 border border-slate-800 hover:border-blue-500 hover:bg-blue-500/10 transition-all text-sm text-slate-300 hover:text-white flex justify-between group"
                  >
                    {univ}
                    <ChevronRight size={16} className="opacity-0 group-hover:opacity-100 transition-opacity text-blue-500" />
                  </button>
                ))}

                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 mt-4">Universitas Umum</p>
                {GENERAL_UNIVERSITIES.map(univ => (
                  <button
                    key={univ}
                    onClick={() => handleUnivSelect(univ, false)}
                    className="w-full text-left p-4 rounded-xl bg-slate-950/50 border border-slate-800 hover:border-slate-500 hover:bg-slate-800 transition-all text-sm text-slate-300 hover:text-white"
                  >
                    {univ}
                  </button>
                ))}
              </div>
              
              <button onClick={() => setCurrentStep(1)} className="w-full text-slate-500 text-sm py-2 hover:text-slate-300">Kembali</button>
            </div>
          )}

          {/* STEP 3: PREFERENCE (The Soft Sell) */}
          {currentStep === 3 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right duration-500">
              
              {/* KONTEN DINAMIS BERDASARKAN SEGMEN */}
              {formData.segment === 'muhammadiyah' ? (
                // --- TAMPILAN UNTUK ANAK PTM ---
                <div className="text-center space-y-4">
                  <div className="w-16 h-16 bg-emerald-500/10 rounded-2xl flex items-center justify-center mx-auto mb-2 text-emerald-400 border border-emerald-500/20">
                    <Sparkles size={32} />
                  </div>
                  <h2 className="text-xl font-bold text-white">Halo Sejawat PTM! 👋</h2>
                  <p className="text-slate-400 text-sm leading-relaxed">
                    Kami mendeteksi kamu dari FK Muhammadiyah. Sistem akan otomatis mengaktifkan modul <span className="text-emerald-400 font-bold">OSCIE & Fiqih Medis</span> untuk persiapan ujian komprehensifmu.
                  </p>
                  
                  <div className="bg-emerald-900/20 border border-emerald-500/30 p-4 rounded-xl text-left flex gap-3">
                    <div className="mt-1 bg-emerald-500 rounded-full p-0.5 w-4 h-4 flex items-center justify-center shrink-0">
                      <Check size={10} className="text-black font-bold" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-emerald-300">Auto-Activate: Insight Mode</p>
                      <p className="text-xs text-emerald-400/70">Materi medis terintegrasi dengan Al-Islam & Kemuhammadiyahan.</p>
                    </div>
                  </div>
                </div>
              ) : (
                // --- TAMPILAN UNTUK ANAK UMUM ---
                <div className="text-center space-y-4">
                  <div className="w-16 h-16 bg-blue-500/10 rounded-2xl flex items-center justify-center mx-auto mb-2 text-blue-400 border border-blue-500/20">
                    <BookOpen size={32} />
                  </div>
                  <h2 className="text-xl font-bold text-white">Siap untuk Upgrade Skill? 🚀</h2>
                  <p className="text-slate-400 text-sm leading-relaxed">
                    Ingin menambah wawasan bioetika? Kamu bisa mengaktifkan <span className="text-white font-bold">Insight Mode</span> untuk mendapatkan perspektif humanis & religius dalam praktik klinis.
                  </p>

                  {/* Toggle Pilihan untuk Anak Umum */}
                  <div 
                    onClick={() => setFormData({...formData, enableInsight: !formData.enableInsight})}
                    className={`cursor-pointer p-4 rounded-xl border transition-all flex items-center gap-4 text-left ${
                      formData.enableInsight 
                      ? 'bg-blue-600 border-blue-500 shadow-lg shadow-blue-500/20' 
                      : 'bg-slate-950 border-slate-800 hover:border-slate-600'
                    }`}
                  >
                    <div className={`w-6 h-6 rounded-full border flex items-center justify-center ${
                      formData.enableInsight ? 'bg-white border-white' : 'border-slate-500'
                    }`}>
                      {formData.enableInsight && <Check size={14} className="text-blue-600" />}
                    </div>
                    <div>
                      <p className={`text-sm font-bold ${formData.enableInsight ? 'text-white' : 'text-slate-300'}`}>
                        Ya, Aktifkan Insight Mode
                      </p>
                      <p className={`text-xs ${formData.enableInsight ? 'text-blue-100' : 'text-slate-500'}`}>
                        Gratis. Bisa dimatikan kapan saja.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <div className="pt-4 space-y-3">
                <button 
                  onClick={handleFinish}
                  disabled={isLoading}
                  className="w-full bg-white hover:bg-slate-200 text-slate-900 font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-white/5"
                >
                  {isLoading ? 'Menyiapkan Dashboard...' : 'Masuk ke Dashboard'} 
                  {!isLoading && <ArrowRight size={18} />}
                </button>
                
                <button onClick={() => setCurrentStep(2)} className="w-full text-slate-500 text-sm py-2 hover:text-slate-300">Kembali</button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}