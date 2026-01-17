import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Home, BookOpen, Stethoscope, Zap, User, LogOut, Activity, Brain } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const navItems = [
  { icon: Home, label: 'Dashboard', path: '/app' },
  { icon: Brain, label: 'CBT Center', path: '/app/cbt' }, // Update path & icon
  { icon: Stethoscope, label: 'Station OSCE', path: '/app/osce' },
  { icon: Zap, label: 'Flashcards', path: '/app/flashcards' },
  { icon: User, label: 'Profil Saya', path: '/app/profile' },
];

export default function Sidebar() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  return (
    <aside className="hidden lg:flex w-72 flex-col bg-slate-900/50 backdrop-blur-xl border-r border-slate-800 h-screen fixed left-0 top-0 z-50">
      {/* Logo Area */}
      <div className="p-8 border-b border-slate-800/50">
        <div className="flex items-center gap-3 text-white font-bold text-xl tracking-tight cursor-pointer" onClick={() => navigate('/app')}>
          <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/20">
            M
          </div>
          MedPrep
        </div>
      </div>
      
      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto custom-scrollbar">
        <p className="px-4 text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 mt-4">Menu Utama</p>
        {navItems.map((item) => {
          // Logic active state: Jika path diawali dengan item.path (misal /app/cbt/quiz tetap aktif di menu CBT)
          const isActive = location.pathname === item.path || (item.path !== '/app' && location.pathname.startsWith(item.path));
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-300 font-medium group relative overflow-hidden ${
                isActive 
                  ? "bg-blue-600/10 text-blue-400 border border-blue-500/20 shadow-[0_0_15px_rgba(59,130,246,0.1)]" 
                  : "text-slate-400 hover:text-white hover:bg-slate-800"
              }`}
            >
              {/* Active Indicator Line */}
              {isActive && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-blue-500 rounded-r-full"></div>}
              
              <item.icon size={20} className={isActive ? "text-blue-400" : "text-slate-500 group-hover:text-white transition-colors"} />
              {item.label}
            </Link>
          );
        })}

        {/* Section Tambahan (Visual Only - Future Dev) */}
        <div className="mt-8">
           <p className="px-4 text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Insight</p>
           <div className="px-4 py-3 rounded-xl border border-dashed border-slate-800 text-slate-500 text-sm flex items-center gap-3 cursor-not-allowed opacity-50 hover:opacity-100 transition-opacity">
              <Activity size={18} />
              <span>Statistik (Pro)</span>
           </div>
        </div>
      </nav>

      {/* Footer / Logout */}
      <div className="p-4 border-t border-slate-800/50 bg-slate-900/80">
        <button 
          onClick={handleLogout} 
          className="flex items-center gap-3 w-full px-4 py-3 text-red-400 hover:bg-red-500/10 hover:text-red-300 rounded-xl transition-all font-medium text-sm border border-transparent hover:border-red-500/20"
        >
          <LogOut size={18} />
          Keluar Aplikasi
        </button>
      </div>
    </aside>
  );
}