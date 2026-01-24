import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { doc, updateDoc, serverTimestamp } from 'firebase/firestore'; 
import { db } from '../lib/firebase';
import { getDeviceId } from '../utils/device'; // <-- Import helper
import { Mail, Lock, ArrowRight, AlertCircle, Sparkles, Eye, EyeOff } from 'lucide-react';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  // State untuk Toggle Password
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // 1. Lakukan Login Auth
      const userCredential = await login(formData.email, formData.password);
      const user = userCredential.user;

      // 2. TAMBAHAN: Update Device ID di Firestore
      // Ini yang akan menendang device lama
      await updateDoc(doc(db, "users", user.uid), {
          lastDeviceId: getDeviceId(),
          lastLoginAt: serverTimestamp()
      });

      navigate('/app/dashboard');
    } catch (err: any) {
      let msg = "Gagal masuk. Periksa kembali email dan password Anda.";
      if (err.code === 'auth/user-not-found') msg = "Akun tidak ditemukan. Silakan daftar dulu.";
      if (err.code === 'auth/wrong-password') msg = "Password salah.";
      if (err.code === 'auth/invalid-credential') msg = "Email atau password salah.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-black text-slate-900 dark:text-white flex items-center justify-center p-4 font-sans transition-colors duration-500 overflow-hidden relative">
      
      {/* Background Ambience */}
      <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-teal-500/20 rounded-full blur-[120px] animate-blob"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-indigo-500/20 rounded-full blur-[120px] animate-blob animation-delay-2000"></div>

      <div className="w-full max-w-md relative z-10">
        
        {/* CONTAINER UTAMA */}
        <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-2xl border border-white/20 dark:border-white/10 rounded-[2.5rem] p-8 md:p-10 shadow-2xl shadow-slate-200/50 dark:shadow-black/50 animate-in fade-in zoom-in-95 duration-500">
          
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-teal-400 to-blue-600 text-white mb-6 shadow-lg shadow-teal-500/30">
               <span className="font-black text-2xl">M</span>
            </div>
            <h1 className="text-3xl font-black text-slate-900 dark:text-white mb-2 tracking-tight">Selamat Datang</h1>
            <p className="text-slate-500 text-sm">Lanjutkan progres belajarmu hari ini.</p>
          </div>

          {error && (
             <div className="mb-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900/30 rounded-2xl p-4 flex items-start gap-3 text-red-600 dark:text-red-400 text-sm animate-in slide-in-from-top-2">
              <AlertCircle size={18} className="shrink-0 mt-0.5" />
              <p className="font-medium">{error}</p>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            
            {/* Input Email */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Email</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                   <Mail className="text-slate-400 group-focus-within:text-teal-500 transition-colors" size={20} />
                </div>
                <input 
                  type="email" 
                  required
                  placeholder="nama@email.com"
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl py-4 pl-12 pr-4 text-slate-900 dark:text-white focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all outline-none placeholder:text-slate-400 shadow-sm"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
              </div>
            </div>

            {/* Input Password (Modified) */}
            <div className="space-y-2">
              <div className="flex justify-between items-center ml-1">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Password</label>
                <a href="#" className="text-xs font-bold text-teal-600 hover:text-teal-500 transition-colors">Lupa password?</a>
              </div>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="text-slate-400 group-focus-within:text-teal-500 transition-colors" size={20} />
                </div>
                <input 
                  // Tipe input dinamis: text atau password
                  type={showPassword ? "text" : "password"} 
                  required
                  placeholder="••••••••"
                  // Tambahkan pr-12 agar teks tidak tertutup tombol mata
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl py-4 pl-12 pr-12 text-slate-900 dark:text-white focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all outline-none placeholder:text-slate-400 shadow-sm"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                />
                
                {/* Tombol Mata (Toggle) */}
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors focus:outline-none"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Tombol Login */}
            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold py-4 rounded-2xl flex items-center justify-center gap-2 transition-all shadow-xl hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed group mt-2"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 dark:border-slate-900/30 border-t-white dark:border-t-slate-900 rounded-full animate-spin"></span>
                  Memproses...
                </span>
              ) : (
                <>
                  Masuk Sekarang 
                  <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>

          </form>

          <div className="mt-10 pt-6 border-t border-slate-200 dark:border-slate-800 text-center">
            <p className="text-slate-500 text-sm">
              Belum punya akun?{' '}
              <Link to="/register" className="text-teal-600 dark:text-teal-400 font-bold hover:underline transition-all">
                Daftar Gratis
              </Link>
            </p>
            
            <div className="mt-6 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-900/30 text-[10px] font-bold text-amber-700 dark:text-amber-400">
              <Sparkles size={12} fill="currentColor" />
              <span>Login untuk akses Bank Soal & Checklist OSCE</span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}