import { Link, useLocation, useNavigate } from 'react-router-dom'; // Tambah useNavigate
import { Home, BookOpen, Stethoscope, Zap, User, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const navItems = [
  { icon: Home, label: 'Dashboard', path: '/app' },
  { icon: BookOpen, label: 'Materi', path: '/app/materi' },
  { icon: Stethoscope, label: 'OSCE', path: '/app/osce' },
  { icon: Zap, label: 'Flashcards', path: '/app/flashcards' },
  { icon: User, label: 'Profil', path: '/app/profile' },
];

export default function Sidebar() {
  const { logout } = useAuth();
  const navigate = useNavigate(); // Hook untuk pindah halaman
  const location = useLocation();

  // Fungsi khusus untuk menangani Logout
  const handleLogout = async () => {
    try {
      await logout(); // 1. Putus koneksi Firebase
      navigate('/login'); // 2. Lempar user ke halaman Login
    } catch (error) {
      console.error('Gagal logout:', error);
      alert('Gagal keluar, coba refresh halaman.');
    }
  };

  return (
    // Tambahkan z-50 agar sidebar selalu di paling atas (supaya bisa diklik)
    <aside className="hidden lg:flex w-64 flex-col bg-surface border-r border-slate-700 h-screen fixed left-0 top-0 z-50">
      <div className="p-6 border-b border-slate-700">
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <span className="bg-primary px-2 rounded-lg">MD</span> MedPrep
        </h1>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors font-medium ${
              location.pathname === item.path
                ? 'bg-primary text-white'
                : 'text-slate-400 hover:bg-slate-700 hover:text-white'
            }`}
          >
            <item.icon size={20} />
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-700">
        <button
          onClick={handleLogout} // Panggil fungsi handleLogout
          className="flex items-center gap-3 w-full px-4 py-3 text-red-400 hover:bg-red-500/10 hover:text-red-300 rounded-lg transition-colors font-medium"
        >
          <LogOut size={20} />
          Keluar
        </button>
      </div>
    </aside>
  );
}
