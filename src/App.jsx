import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import { IslamicModeProvider } from './context/IslamicModeContext';
import { AuthProvider } from './context/AuthContext';
import Layout from './components/Layout/Layout';

// Import Semua Halaman
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import MateriReader from './pages/MateriReader';
import OSCEStation from './pages/OSCEStation';
import FlashcardDrill from './pages/FlashcardDrill';
import Profile from './pages/Profile';
import AdminPanel from './pages/AdminPanel'; // <--- IMPORT HALAMAN ADMIN

// Komponen Placeholder (Untuk halaman yang belum ada)
const ComingSoon = ({ title }) => (
  <div className="flex flex-col items-center justify-center h-96 text-center text-slate-400 p-8">
    <div className="bg-slate-800 p-4 rounded-full mb-4">
      <span className="text-4xl">🚧</span>
    </div>
    <h2 className="text-2xl font-bold text-white mb-2">{title}</h2>
    <p>Fitur ini sedang dalam tahap pengembangan.</p>
    <button
      className="mt-6 px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-sm transition-colors text-white"
      onClick={() => window.history.back()}
    >
      Kembali
    </button>
  </div>
);

function App() {
  return (
    // 1. Provider Mode Islam (Paling Luar)
    <IslamicModeProvider>
      {/* 2. Provider Auth (Pembungkus Login) */}
      <AuthProvider>
        <Router>
          <Routes>
            {/* =========================================
                1. PUBLIC ROUTES (Halaman Depan)
               ========================================= */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* =========================================
                2. APP ROUTES (Halaman Dalam dengan Sidebar)
               ========================================= */}
            <Route path="/app" element={<Layout />}>
              {/* Dashboard Utama */}
              <Route index element={<Dashboard />} />

              {/* Fitur - Fitur Inti */}
              <Route path="materi" element={<MateriReader />} />
              <Route path="osce" element={<OSCEStation />} />
              <Route path="flashcards" element={<FlashcardDrill />} />

              {/* Fitur Profil */}
              <Route path="profile" element={<Profile />} />

              {/* Fitur Admin (Akses Manual via URL /app/admin) */}
              <Route path="admin" element={<AdminPanel />} />
            </Route>

            {/* =========================================
                3. FALLBACK (Jika Link Salah)
               ========================================= */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </AuthProvider>
    </IslamicModeProvider>
  );
}

export default App;
