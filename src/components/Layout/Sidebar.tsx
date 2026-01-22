import React from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom'; // 1. Pastikan import useNavigate
import { LayoutDashboard, GraduationCap, Stethoscope, Zap, User, LogOut, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { isAdmin } from '../../config/admin_list';

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate(); // 2. Hook untuk pindah halaman manual
  const { logout, currentUser } = useAuth();

  // --- FUNGSI LOGOUT YANG BENAR ---
  const handleLogout = async () => {
    try {
      await logout();     // 1. Hapus data sesi di Firebase
      navigate('/login'); // 2. PAKSA browser pindah ke halaman Login
    } catch (error) {
      console.error("Gagal logout:", error);
    }
  };

  const menuItems = [
    // Pastikan path dashboard sudah benar
    { icon: LayoutDashboard, label: 'Dashboard', path: '/app/dashboard' },
    { icon: GraduationCap, label: 'CBT Center', path: '/app/cbt' },
    { icon: Stethoscope, label: 'OSCE Center', path: '/app/osce' },
    { icon: Zap, label: 'Flashcards', path: '/app/flashcards' },
    { icon: User, label: 'Profil Saya', path: '/app/profile' },
  ];

  return (
    <aside className="w-72 bg-slate-900 h-screen fixed left-0 top-0 flex flex-col border-r border-slate-800 z-50">
      
      {/* Logo Area */}
      <div className="p-6 flex items-center gap-3">
        <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
          <span className="text-white font-black text-xl">M</span>
        </div>
        <span className="text-white font-bold text-xl tracking-tight">MedPrep</span>
      </div>

      <div className="px-4 mb-2">
        <div className="h-px bg-gradient-to-r from-transparent via-slate-700 to-transparent"></div>
      </div>

      {/* Menu Utama */}
      <nav className="flex-1 px-4 py-4 space-y-2 overflow-y-auto custom-scrollbar">
        <p className="px-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Menu Utama</p>
        
        {menuItems.map((item) => {
          // Logic active state yang lebih ketat agar dashboard tidak "menyala" saat di CBT
          const isActive = location.pathname === item.path || (item.path !== '/app/dashboard' && location.pathname.startsWith(`${item.path}/`));
          
          return (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/app/dashboard'} // PENTING: Mencegah dashboard aktif terus
              className={`flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-200 group ${
                isActive 
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-900/20' 
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <item.icon size={20} className={isActive ? 'text-white' : 'text-slate-500 group-hover:text-white transition-colors'} />
              <span className="font-medium text-sm">{item.label}</span>
            </NavLink>
          );
        })}

        {/* --- MENU KHUSUS ADMIN --- */}
        {isAdmin(currentUser?.email) && (
          <div className="mt-8 pt-4 border-t border-slate-800">
             <p className="px-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Administrator</p>
             <NavLink
              to="/app/admin"
              className={({ isActive }) => `flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-200 group ${
                isActive 
                  ? 'bg-red-600 text-white shadow-md shadow-red-900/20' 
                  : 'text-red-400 hover:bg-red-900/20 hover:text-red-300'
              }`}
            >
              <ShieldCheck size={20} />
              <span className="font-medium text-sm">Admin Panel</span>
            </NavLink>
          </div>
        )}

      </nav>

      {/* Footer / Logout */}
      <div className="p-4 border-t border-slate-800">
        <button 
          onClick={handleLogout} // PANGGIL FUNGSI BARU DI SINI
          className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-slate-400 hover:bg-slate-800 hover:text-red-400 transition-all"
        >
          <LogOut size={20} />
          <span className="font-medium text-sm">Keluar Aplikasi</span>
        </button>
      </div>
    </aside>
  );
}