import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // Import Auth

export default function Login() {
  const { login } = useAuth(); // Ambil fungsi login
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await login(email, password); // Panggil Firebase Login
      navigate('/app'); // Jika sukses, masuk ke Dashboard
    } catch (err) {
      setError('Email atau password salah. Coba lagi.');
    }
  };

  return (
    <div className="min-h-screen bg-dark flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-surface border border-slate-700 p-8 rounded-2xl shadow-xl">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold mb-2">Selamat Datang</h1>
          <p className="text-slate-400">Masuk untuk melanjutkan belajar</p>
        </div>

        {error && (
          <div className="bg-red-500/20 text-red-400 p-3 rounded-lg mb-4 text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">
              Email
            </label>
            <input
              type="email"
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white"
              placeholder="user@example.com"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">
              Password
            </label>
            <input
              type="password"
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white"
              placeholder="••••••••"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            className="w-full bg-primary hover:bg-blue-600 text-white font-bold py-3 rounded-lg transition-all"
          >
            Masuk
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-slate-400">
          Belum punya akun?{' '}
          <Link to="/register" className="text-primary hover:underline">
            Daftar (Hubungi Admin)
          </Link>
        </div>
      </div>
    </div>
  );
}
