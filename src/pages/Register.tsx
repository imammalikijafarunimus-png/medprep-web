import React, { useState, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { PTM_UNIVERSITIES, STATE_UNIVERSITIES, PRIVATE_UNIVERSITIES } from '../data/universities';
import {
  ArrowRight, ChevronRight, School,
  User, Mail, Lock, ChevronLeft, Shield, Gift,
  Eye, EyeOff, CheckCircle2, XCircle, Circle
} from 'lucide-react';

// ─── Validation Utilities (inline, mirroring lib/validation) ─────────────────

function validateNameLocal(name: string): { isValid: boolean; error: string } {
  if (!name) return { isValid: false, error: '' };
  const trimmed = name.trim();
  if (trimmed.length < 2) return { isValid: false, error: 'Minimal 2 karakter' };
  if (trimmed.length > 100) return { isValid: false, error: 'Terlalu panjang' };
  if (!/^[a-zA-ZÀ-ÿ\s\-'.]+$/.test(trimmed))
    return { isValid: false, error: 'Hanya huruf & spasi' };
  return { isValid: true, error: '' };
}

interface PasswordAnalysis {
  score: 0 | 1 | 2 | 3;           // 0=Lemah, 1=Sedang, 2=Baik, 3=Kuat
  label: string;
  color: string;                   // Tailwind text color
  barColor: string;                // Tailwind bg color
  barWidth: string;                // e.g. 'w-1/4'
  checks: {
    minLength: boolean;            // 8+
    hasLetter: boolean;
    hasNumber: boolean;
    hasMixedCase: boolean;         // tip
    hasSymbol: boolean;            // tip
    longEnough: boolean;           // 12+, tip
  };
}

function analyzePassword(password: string): PasswordAnalysis {
  const checks = {
    minLength:    password.length >= 8,
    hasLetter:    /[a-zA-Z]/.test(password),
    hasNumber:    /\d/.test(password),
    hasMixedCase: /[A-Z]/.test(password) && /[a-z]/.test(password),
    hasSymbol:    /[!@#$%^&*(),.?":{}|<>]/.test(password),
    longEnough:   password.length >= 12,
  };

  const { minLength, hasLetter, hasNumber, hasMixedCase, hasSymbol, longEnough } = checks;

  let score: 0 | 1 | 2 | 3 = 0;
  if (minLength && hasLetter && hasNumber) score = 1;        // Sedang
  if (score >= 1 && (hasMixedCase || longEnough)) score = 2; // Baik
  if (score >= 2 && hasSymbol && longEnough && hasMixedCase) score = 3; // Kuat

  const meta = [
    { label: 'Lemah',  color: 'text-red-500',    barColor: 'bg-red-500',    barWidth: 'w-1/4' },
    { label: 'Sedang', color: 'text-yellow-500',  barColor: 'bg-yellow-500', barWidth: 'w-2/4' },
    { label: 'Baik',   color: 'text-blue-500',    barColor: 'bg-blue-500',   barWidth: 'w-3/4' },
    { label: 'Kuat',   color: 'text-teal-500',    barColor: 'bg-teal-500',   barWidth: 'w-full' },
  ][score];

  return { score, checks, ...meta };
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function NameBadge({ name }: { name: string }) {
  if (!name) return null;
  const { isValid, error } = validateNameLocal(name);
  return (
    <span className={`flex items-center gap-1 text-xs font-semibold mt-1 ml-1 transition-all duration-300 ${isValid ? 'text-teal-500' : 'text-red-400'}`}>
      {isValid
        ? <><CheckCircle2 size={13} /> Nama valid</>
        : <><XCircle size={13} /> {error}</>}
    </span>
  );
}

function CheckItem({ done, tip, label }: { done: boolean; tip?: boolean; label: string }) {
  return (
    <span className={`flex items-center gap-1.5 text-xs transition-all duration-300 ${done ? 'text-teal-500' : tip ? 'text-slate-400' : 'text-slate-500'}`}>
      {done
        ? <CheckCircle2 size={12} className="flex-shrink-0" />
        : tip
          ? <Circle size={12} className="flex-shrink-0 opacity-50" />
          : <Circle size={12} className="flex-shrink-0" />}
      {label}{tip && !done && <span className="text-slate-500 text-[10px]"> (tips)</span>}
    </span>
  );
}

function PasswordStrengthBox({ password }: { password: string }) {
  if (!password) return null;
  const { score, label, color, barColor, barWidth, checks } = analyzePassword(password);

  return (
    <div className="mt-3 p-3 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-3 animate-in fade-in duration-300">
      {/* Bar */}
      <div className="flex items-center gap-3">
        <div className="flex-1 h-1.5 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
          <div className={`h-full rounded-full transition-all duration-500 ${barColor} ${barWidth}`} />
        </div>
        <span className={`text-xs font-bold w-12 text-right ${color}`}>{label}</span>
      </div>

      {/* Checklist grid */}
      <div className="grid grid-cols-2 gap-y-1.5 gap-x-3">
        {/* Requirements */}
        <CheckItem done={checks.minLength} label="8+ karakter" />
        <CheckItem done={checks.hasLetter} label="Ada huruf" />
        <CheckItem done={checks.hasNumber} label="Ada angka" />
        {/* Tips */}
        <CheckItem done={checks.hasMixedCase} tip label="Huruf besar/kecil" />
        <CheckItem done={checks.hasSymbol}    tip label="Karakter khusus" />
        <CheckItem done={checks.longEnough}   tip label="12+ karakter" />
      </div>
    </div>
  );
}

// ─── Types ────────────────────────────────────────────────────────────────────

type Step = 1 | 2 | 3;
type UserSegment = 'muhammadiyah' | 'general';

interface OnboardingData {
  name: string;
  email: string;
  password: string;
  university: string;
  segment: UserSegment;
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [currentStep, setCurrentStep] = useState<Step>(1);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [touched, setTouched] = useState({ name: false, email: false, password: false });

  const [formData, setFormData] = useState<OnboardingData>({
    name: '', email: '', password: '', university: '', segment: 'general',
  });

  // Derived validation state
  const nameValidation  = useMemo(() => validateNameLocal(formData.name), [formData.name]);
  const pwdAnalysis     = useMemo(() => analyzePassword(formData.password), [formData.password]);
  const passwordOk      = pwdAnalysis.checks.minLength && pwdAnalysis.checks.hasLetter && pwdAnalysis.checks.hasNumber;

  const step1Ready = nameValidation.isValid && formData.email.includes('@') && passwordOk;

  const handleUnivSelect = (univ: string, isPTM: boolean) => {
    setFormData(prev => ({ ...prev, university: univ, segment: isPTM ? 'muhammadiyah' : 'general' }));
    setCurrentStep(3);
  };

  const handleFinish = async () => {
    setIsLoading(true);
    try {
      await register(formData.email, formData.password, formData.name, formData.university, formData.segment);
      navigate('/app/dashboard');
    } catch (error: any) {
      console.error('Register Error:', error);
      alert('Gagal mendaftar: ' + (error.message || 'Coba lagi nanti'));
      setCurrentStep(1);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNext = () => {
    setTouched({ name: true, email: true, password: true });
    if (step1Ready) setCurrentStep(2);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-black text-slate-900 dark:text-white flex items-center justify-center p-4 font-sans transition-colors duration-500 overflow-hidden relative">
      <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-blue-500/20 rounded-full blur-[120px] animate-blob" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-teal-500/20 rounded-full blur-[120px] animate-blob animation-delay-2000" />

      <div className="w-full max-w-lg relative z-10">
        {/* Progress dots */}
        <div className="flex gap-2 mb-8 justify-center">
          {[1, 2, 3].map(step => (
            <div key={step} className={`h-1.5 rounded-full transition-all duration-500 ${step <= currentStep ? 'w-12 bg-teal-500 shadow-[0_0_10px_theme(colors.teal.500)]' : 'w-4 bg-slate-300 dark:bg-slate-800'}`} />
          ))}
        </div>

        <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-2xl border border-white/20 dark:border-white/10 rounded-[2.5rem] p-8 md:p-10 shadow-2xl shadow-slate-200/50 dark:shadow-black/50 overflow-hidden min-h-[500px] flex flex-col justify-center">

          {/* ── STEP 1: DATA DIRI ── */}
          {currentStep === 1 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right duration-500">
              <div className="text-center">
                <h1 className="text-2xl font-black text-slate-900 dark:text-white mb-2">Buat Akun MedPrep</h1>
                <p className="text-slate-500 text-sm">Mulai perjalanan lulus UKMPPD One Shot.</p>
              </div>

              <div className="space-y-4">
                {/* Nama */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Nama Lengkap</label>
                  <div className="relative group">
                    <User className="absolute left-4 top-4 text-slate-400 group-focus-within:text-teal-500 transition-colors" size={20} />
                    <input
                      type="text"
                      placeholder="dr. Muda Siapa"
                      className={`w-full bg-slate-50 dark:bg-slate-950 border rounded-2xl py-4 pl-12 pr-4 text-slate-900 dark:text-white focus:ring-1 transition-all outline-none placeholder:text-slate-400 shadow-sm
                        ${touched.name && formData.name
                          ? nameValidation.isValid
                            ? 'border-teal-500 focus:border-teal-500 focus:ring-teal-500'
                            : 'border-red-400 focus:border-red-400 focus:ring-red-400'
                          : 'border-slate-200 dark:border-slate-800 focus:border-teal-500 focus:ring-teal-500'}`}
                      value={formData.name}
                      onChange={e => { setFormData({ ...formData, name: e.target.value }); setTouched(t => ({ ...t, name: true })); }}
                    />
                    {/* inline badge — right side */}
                    {touched.name && formData.name && (
                      <span className="absolute right-4 top-1/2 -translate-y-1/2">
                        {nameValidation.isValid
                          ? <CheckCircle2 size={18} className="text-teal-500" />
                          : <XCircle size={18} className="text-red-400" />}
                      </span>
                    )}
                  </div>
                  {touched.name && <NameBadge name={formData.name} />}
                </div>

                {/* Email */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Email</label>
                  <div className="relative group">
                    <Mail className="absolute left-4 top-4 text-slate-400 group-focus-within:text-teal-500 transition-colors" size={20} />
                    <input
                      type="email"
                      placeholder="nama@univ.ac.id"
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl py-4 pl-12 pr-4 text-slate-900 dark:text-white focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all outline-none placeholder:text-slate-400 shadow-sm"
                      value={formData.email}
                      onChange={e => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>
                </div>

                {/* Password */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Password</label>
                  <div className="relative group">
                    <Lock className="absolute left-4 top-4 text-slate-400 group-focus-within:text-teal-500 transition-colors" size={20} />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Minimal 8 karakter"
                      className={`w-full bg-slate-50 dark:bg-slate-950 border rounded-2xl py-4 pl-12 pr-12 text-slate-900 dark:text-white focus:ring-1 transition-all outline-none placeholder:text-slate-400 shadow-sm
                        ${touched.password && formData.password
                          ? passwordOk
                            ? 'border-teal-500 focus:border-teal-500 focus:ring-teal-500'
                            : 'border-yellow-400 focus:border-yellow-400 focus:ring-yellow-400'
                          : 'border-slate-200 dark:border-slate-800 focus:border-teal-500 focus:ring-teal-500'}`}
                      value={formData.password}
                      onChange={e => { setFormData({ ...formData, password: e.target.value }); setTouched(t => ({ ...t, password: true })); }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors focus:outline-none"
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>

                  {/* Strength box — only when user has started typing */}
                  {touched.password && formData.password && (
                    <PasswordStrengthBox password={formData.password} />
                  )}
                </div>
              </div>

              <button
                onClick={handleNext}
                className={`w-full font-bold py-4 rounded-2xl flex items-center justify-center gap-2 transition-all shadow-lg group
                  ${step1Ready
                    ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:scale-[1.02] active:scale-[0.98]'
                    : 'bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-600 cursor-not-allowed'}`}
              >
                Lanjut <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </button>

              <p className="text-center text-xs text-slate-500 mt-4">
                Sudah punya akun?{' '}
                <Link to="/login" className="text-teal-600 dark:text-teal-400 font-bold hover:underline">Masuk</Link>
              </p>
            </div>
          )}

          {/* ── STEP 2: PILIH KAMPUS ── */}
          {currentStep === 2 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right duration-500 h-full flex flex-col">
              <div className="text-center">
                <div className="w-14 h-14 bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center mx-auto mb-4 text-teal-600 dark:text-teal-400">
                  <School size={28} />
                </div>
                <h2 className="text-xl font-black text-slate-900 dark:text-white mb-2">Asal Universitas?</h2>
                <p className="text-slate-500 text-sm">Kurikulum akan disesuaikan.</p>
              </div>

              <div className="space-y-6 flex-1 overflow-y-auto pr-2 custom-scrollbar max-h-[350px]">

                {/* PTM */}
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

                {/* PTN */}
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

                {/* Swasta */}
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

              <button onClick={() => setCurrentStep(1)} className="w-full text-slate-500 text-xs font-bold py-3 hover:text-slate-800 dark:hover:text-white transition-colors flex items-center justify-center gap-2">
                <ChevronLeft size={14} /> Kembali
              </button>
            </div>
          )}

          {/* ── STEP 3: KONFIRMASI ── */}
          {currentStep === 3 && (
            <div className="space-y-8 animate-in fade-in slide-in-from-right duration-500 text-center flex flex-col justify-center h-full">
              <div className="relative mx-auto">
                <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-[2rem] flex items-center justify-center text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700 shadow-xl relative z-10">
                  <Shield size={40} />
                </div>
                <div className="absolute -top-2 -right-2 bg-pink-500 text-white p-2 rounded-full shadow-lg animate-bounce z-20">
                  <Gift size={16} fill="currentColor" />
                </div>
              </div>
              <div>
                <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-3">Akun Siap Dibuat!</h2>
                <p className="text-slate-500 text-sm leading-relaxed max-w-xs mx-auto">
                  Kamu akan masuk sebagai <span className="font-bold text-slate-800 dark:text-white">Free Member</span>.<br /><br />
                  Kami telah menyiapkan <span className="text-teal-600 dark:text-teal-400 font-bold">Rekomendasi Paket</span> khusus untuk {formData.university} di Dashboard.
                </p>
              </div>
              <div className="pt-4 space-y-3">
                <button
                  onClick={handleFinish}
                  disabled={isLoading}
                  className="w-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold py-4 rounded-2xl flex items-center justify-center gap-2 transition-all shadow-xl hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60 disabled:pointer-events-none"
                >
                  {isLoading ? 'Menyiapkan...' : 'Buka Dashboard Saya'}
                  {!isLoading && <ArrowRight size={18} />}
                </button>
                <button onClick={() => setCurrentStep(2)} className="w-full text-slate-500 text-xs font-bold py-2 hover:text-slate-800 dark:hover:text-white transition-colors">
                  Kembali
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}