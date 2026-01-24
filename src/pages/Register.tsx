import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { PTM_UNIVERSITIES, STATE_UNIVERSITIES, PRIVATE_UNIVERSITIES } from '../data/universities';
import { 
  ArrowRight, Check, ChevronRight, School, 
  BookOpen, User, Mail, Lock, Sparkles, ChevronLeft, Shield, Gift,
  Eye, EyeOff
} from 'lucide-react';

type Step = 1 | 2 | 3;
type UserSegment = 'muhammadiyah' | 'general';

interface OnboardingData {
  name: string;
  email: string;
  password: string;
  university: string;
  segment: UserSegment;
}

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [currentStep, setCurrentStep] = useState<Step>(1);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const [formData, setFormData] = useState<OnboardingData>({
    name: '',
    email: '',
    password: '',
    university: '',
    segment: 'general' 
  });

  const handleUnivSelect = (univ: string, isPTM: boolean) => {
    setFormData(prev => ({
      ...prev,
      university: univ,
      segment: isPTM ? 'muhammadiyah' : 'general', 
    }));
    setCurrentStep(3);
  };

  const handleFinish = async () => {
    setIsLoading(true);
    try {
      const userCredential = await register(formData.email, formData.password, formData.name);
      const user = userCredential.user;

      // Simpan data lengkap ke Firestore
      await setDoc(doc(db, "users", user.uid), {
        name: formData.name,
        email: formData.email,
        university: formData.university,
        segment: formData.segment,
        subscriptionStatus: 'free', 
        role: 'student',
        preferences: {
          showIslamicInsight: false,
          showPrayerTimes: formData.segment === 'muhammadiyah' 
        },
        createdAt: serverTimestamp()
      });
      
      navigate('/app/dashboard');
    } catch (error: any) {
      console.error("Register Error:", error);
      alert("Gagal mendaftar: " + error.message);
      setCurrentStep(1);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-black text-slate-900 dark:text-white flex items-center justify-center p-4 font-sans transition-colors duration-500 overflow-hidden relative">
      <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-blue-500/20 rounded-full blur-[120px] animate-blob"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-teal-500/20 rounded-full blur-[120px] animate-blob animation-delay-2000"></div>

      <div className="w-full max-w-lg relative z-10">
        <div className="flex gap-2 mb-8 justify-center">
          {[1, 2, 3].map((step) => (
            <div key={step} className={`h-1.5 rounded-full transition-all duration-500 ${step <= currentStep ? 'w-12 bg-teal-500 shadow-[0_0_10px_theme(colors.teal.500)]' : 'w-4 bg-slate-300 dark:bg-slate-800'}`}/>
          ))}
        </div>

        <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-2xl border border-white/20 dark:border-white/10 rounded-[2.5rem] p-8 md:p-10 shadow-2xl shadow-slate-200/50 dark:shadow-black/50 overflow-hidden min-h-[500px] flex flex-col justify-center">
          
          {/* STEP 1: DATA DIRI */}
          {currentStep === 1 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right duration-500">
              <div className="text-center">
                <h1 className="text-2xl font-black text-slate-900 dark:text-white mb-2">Buat Akun MedPrep</h1>
                <p className="text-slate-500 text-sm">Mulai perjalanan lulus UKMPPD One Shot.</p>
              </div>
              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Nama Lengkap</label>
                  <div className="relative group">
                    <User className="absolute left-4 top-4 text-slate-400 group-focus-within:text-teal-500 transition-colors" size={20} />
                    <input type="text" placeholder="dr. Muda Siapa" className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl py-4 pl-12 pr-4 text-slate-900 dark:text-white focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all outline-none placeholder:text-slate-400 shadow-sm" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Email</label>
                  <div className="relative group">
                    <Mail className="absolute left-4 top-4 text-slate-400 group-focus-within:text-teal-500 transition-colors" size={20} />
                    <input type="email" placeholder="nama@univ.ac.id" className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl py-4 pl-12 pr-4 text-slate-900 dark:text-white focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all outline-none placeholder:text-slate-400 shadow-sm" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Password</label>
                  <div className="relative group">
                    <Lock className="absolute left-4 top-4 text-slate-400 group-focus-within:text-teal-500 transition-colors" size={20} />
                    <input type={showPassword ? "text" : "password"} placeholder="Minimal 6 karakter" className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl py-4 pl-12 pr-12 text-slate-900 dark:text-white focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all outline-none placeholder:text-slate-400 shadow-sm" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors focus:outline-none">{showPassword ? <EyeOff size={20}/> : <Eye size={20}/>}</button>
                  </div>
                </div>
              </div>
              <button onClick={() => { if(formData.name && formData.email && formData.password.length >= 6) setCurrentStep(2); else alert("Mohon lengkapi data."); }} className="w-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold py-4 rounded-2xl flex items-center justify-center gap-2 transition-all shadow-lg hover:scale-[1.02] active:scale-[0.98] group">Lanjut <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform"/></button>
              <p className="text-center text-xs text-slate-500 mt-4">Sudah punya akun? <Link to="/login" className="text-teal-600 dark:text-teal-400 font-bold hover:underline">Masuk</Link></p>
            </div>
          )}

          {/* STEP 2: PILIH KAMPUS (3 KATEGORI) */}
          {currentStep === 2 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right duration-500 h-full flex flex-col">
              <div className="text-center">
                <div className="w-14 h-14 bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center mx-auto mb-4 text-teal-600 dark:text-teal-400"><School size={28} /></div>
                <h2 className="text-xl font-black text-slate-900 dark:text-white mb-2">Asal Universitas?</h2>
                <p className="text-slate-500 text-sm">Kurikulum akan disesuaikan.</p>
              </div>
              
              <div className="space-y-6 flex-1 overflow-y-auto pr-2 custom-scrollbar max-h-[350px]">
                
                {/* 1. PTM */}
                <div>
                    <p className="text-xs font-black text-teal-600 dark:text-teal-400 uppercase tracking-widest mb-3 pl-1 sticky top-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur py-2 z-10">
                        Perguruan Tinggi Muhammadiyah
                    </p>
                    <div className="space-y-2">
                        {PTM_UNIVERSITIES.map(univ => (
                            <button key={univ} onClick={() => handleUnivSelect(univ, true)} className="w-full text-left p-4 rounded-2xl bg-teal-50/50 dark:bg-teal-900/10 border border-teal-100 dark:border-teal-900/30 hover:border-teal-500 dark:hover:border-teal-500 hover:shadow-md transition-all text-sm text-slate-700 dark:text-slate-300 hover:text-teal-700 dark:hover:text-white flex justify-between group items-center">
                                <span className="font-medium line-clamp-1">{univ}</span>
                                <ChevronRight size={16} className="opacity-0 group-hover:opacity-100 transition-all text-teal-500" />
                            </button>
                        ))}
                    </div>
                </div>

                {/* 2. UNIVERSITAS NEGERI */}
                <div>
                    <p className="text-xs font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest mb-3 pl-1 sticky top-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur py-2 z-10">
                        Universitas Negeri (PTN)
                    </p>
                    <div className="space-y-2">
                        {STATE_UNIVERSITIES.map(univ => (
                            <button key={univ} onClick={() => handleUnivSelect(univ, false)} className="w-full text-left p-4 rounded-2xl bg-blue-50/50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/30 hover:border-blue-500 dark:hover:border-blue-500 hover:shadow-md transition-all text-sm text-slate-700 dark:text-slate-300 hover:text-blue-700 dark:hover:text-white flex justify-between group items-center">
                                <span className="font-medium line-clamp-1">{univ}</span>
                                <ChevronRight size={16} className="opacity-0 group-hover:opacity-100 transition-all text-blue-500" />
                            </button>
                        ))}
                    </div>
                </div>

                {/* 3. UNIVERSITAS SWASTA */}
                <div>
                    <p className="text-xs font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-widest mb-3 pl-1 sticky top-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur py-2 z-10">
                        Universitas Swasta (Non-PTM)
                    </p>
                    <div className="space-y-2">
                        {PRIVATE_UNIVERSITIES.map(univ => (
                            <button key={univ} onClick={() => handleUnivSelect(univ, false)} className="w-full text-left p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 hover:border-indigo-500 dark:hover:border-indigo-500 hover:shadow-md transition-all text-sm text-slate-700 dark:text-slate-300 hover:text-indigo-700 dark:hover:text-white flex justify-between group items-center">
                                <span className="font-medium line-clamp-1">{univ}</span>
                                <ChevronRight size={16} className="opacity-0 group-hover:opacity-100 transition-all text-indigo-500" />
                            </button>
                        ))}
                    </div>
                </div>

              </div>
              <button onClick={() => setCurrentStep(1)} className="w-full text-slate-500 text-xs font-bold py-3 hover:text-slate-800 dark:hover:text-white transition-colors flex items-center justify-center gap-2"><ChevronLeft size={14} /> Kembali</button>
            </div>
          )}

          {/* STEP 3: KONFIRMASI */}
          {currentStep === 3 && (
            <div className="space-y-8 animate-in fade-in slide-in-from-right duration-500 text-center flex flex-col justify-center h-full">
              <div className="relative mx-auto">
                  <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-[2rem] flex items-center justify-center text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700 shadow-xl relative z-10"><Shield size={40} /></div>
                  <div className="absolute -top-2 -right-2 bg-pink-500 text-white p-2 rounded-full shadow-lg animate-bounce z-20"><Gift size={16} fill="currentColor" /></div>
              </div>
              <div>
                  <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-3">Akun Siap Dibuat!</h2>
                  <p className="text-slate-500 text-sm leading-relaxed max-w-xs mx-auto">
                    Kamu akan masuk sebagai <span className="font-bold text-slate-800 dark:text-white">Free Member</span>. <br/><br/>
                    Kami telah menyiapkan <span className="text-teal-600 dark:text-teal-400 font-bold">Rekomendasi Paket</span> khusus untuk {formData.university} di Dashboard.
                  </p>
              </div>
              <div className="pt-4 space-y-3">
                <button onClick={handleFinish} disabled={isLoading} className="w-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold py-4 rounded-2xl flex items-center justify-center gap-2 transition-all shadow-xl hover:scale-[1.02] active:scale-[0.98]">
                  {isLoading ? 'Menyiapkan...' : 'Buka Dashboard Saya'} {!isLoading && <ArrowRight size={18} />}
                </button>
                <button onClick={() => setCurrentStep(2)} className="w-full text-slate-500 text-xs font-bold py-2 hover:text-slate-800 dark:hover:text-white transition-colors">Kembali</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}