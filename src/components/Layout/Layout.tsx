import React, { useState, useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutGrid, GraduationCap, Stethoscope, Zap, User, 
  Sun, Moon, BookOpen, Search, Bell, LogOut, ChevronRight,
  Menu, ShieldCheck, Settings,
  Brain
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

export default function Layout() {
  const { currentUser, logout } = useAuth(); 
  const location = useLocation();
  const navigate = useNavigate();
  
  // STATE UI
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); 
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

  // --- THEME ENGINE ---
  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('dark', 'mode-read');
    if (theme === 'dark') root.classList.add('dark');
    if (theme === 'read') root.classList.add('mode-read');
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : prev === 'dark' ? 'read' : 'light');
  };

  const getThemeIcon = () => {
    if (theme === 'dark') return <Moon size={20} className="text-indigo-400" />;
    if (theme === 'read') return <BookOpen size={20} className="text-amber-700" />;
    return <Sun size={20} className="text-orange-500" />;
  };

  // --- DYNAMIC TITLE ---
  const getPageTitle = () => {
      const path = location.pathname;
      if (path.includes('/dashboard')) return 'Dashboard';
      if (path.includes('/cbt')) return 'CBT Center';
      if (path.includes('/osce')) return 'OSCE Center';
      if (path.includes('/flashcards')) return 'Flashcards';
      if (path.includes('/profile')) return 'Profil';
      if (path.includes('/admin')) return 'Admin Panel';
      return 'MedPrep';
  };

  // --- NAVIGATION LIST ---
  const navItems = [
    { icon: LayoutGrid, label: 'Dashboard', path: '/app/dashboard' },
    { icon: Brain, label: 'CBT Center', path: '/app/cbt' },
    { icon: Stethoscope, label: 'OSCE Center', path: '/app/osce' },
    { icon: Zap, label: 'Flashcards', path: '/app/flashcards' },
    { icon: User, label: 'Profil Saya', path: '/app/profile' },
  ];

  const handleLogout = async () => {
      if(confirm('Apakah Anda yakin ingin keluar?')) {
          toast.success('Berhasil keluar. Sampai jumpa lagi, Dok! 👋', {
              duration: 2000,
              style: { borderRadius: '10px', background: '#333', color: '#fff' }
          });
          setTimeout(() => { navigate('/login'); }, 1000);
      }
  };

  return (
    <div className={`min-h-screen transition-colors duration-500 font-sans 
      ${theme === 'read' ? 'bg-[#fbf6e9] text-[#433422]' : 'bg-slate-50 dark:bg-[#0B1120] dark:text-slate-100'}`}>
      
      {/* ================= DESKTOP SIDEBAR (Floating Glass) ================= */}
      <aside className="hidden md:flex fixed top-6 bottom-6 left-6 w-72 rounded-[2.5rem] 
        bg-white/80 dark:bg-slate-900/80 backdrop-blur-2xl border border-white/40 dark:border-white/5 shadow-2xl shadow-slate-200/50 dark:shadow-black/50
        flex-col py-8 px-6 z-50">
        
        {/* Brand */}
        <div className="flex items-center gap-3 mb-10 px-2">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-teal-400 to-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/30">
                <span className="font-black text-2xl">M</span>
            </div>
            <div>
                <h1 className="font-bold text-xl tracking-tight leading-none text-slate-800 dark:text-white">MedPrep</h1>
                <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mt-1">Medical OS</p>
            </div>
        </div>

        {/* Nav Menu */}
        <nav className="flex-1 space-y-2 overflow-y-auto custom-scrollbar pr-2">
            {navItems.map((item) => {
                const isActive = location.pathname.startsWith(item.path);
                return (
                    <button
                        key={item.path}
                        onClick={() => navigate(item.path)}
                        className={`w-full flex items-center gap-4 px-4 py-4 rounded-2xl transition-all duration-300 group relative overflow-hidden
                            ${isActive 
                                ? 'bg-slate-900 text-white shadow-lg shadow-slate-900/20 dark:bg-white dark:text-slate-900' 
                                : 'hover:bg-slate-100 dark:hover:bg-white/5 text-slate-600 dark:text-slate-400 font-medium'
                            }`}
                    >
                        <item.icon size={22} className={`transition-transform group-hover:scale-110 ${isActive ? 'text-teal-400 dark:text-blue-600' : 'text-slate-400 dark:text-slate-500'}`} />
                        <span className="text-sm tracking-wide">{item.label}</span>
                        {isActive && <ChevronRight size={16} className="ml-auto opacity-50" />}
                    </button>
                )
            })}

            {/* ADMIN PANEL */}
            {(currentUser?.subscriptionStatus === 'premium' || currentUser?.subscriptionStatus === 'expert') && (
                <div className="pt-4 mt-4 border-t border-slate-100 dark:border-white/10">
                    <p className="px-4 text-[10px] font-bold uppercase text-slate-400 mb-2">Administrator</p>
                    <button
                        onClick={() => navigate('/app/admin')}
                        className={`w-full flex items-center gap-4 px-4 py-3 rounded-2xl transition-all duration-300 group
                            ${location.pathname.startsWith('/app/admin')
                                ? 'bg-red-50 text-red-600 border border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-900/30'
                                : 'hover:bg-red-50 text-slate-600 dark:text-slate-400 dark:hover:bg-red-900/10 hover:text-red-500'
                            }`}
                    >
                        <ShieldCheck size={22} className={location.pathname.startsWith('/app/admin') ? 'text-red-500' : ''} />
                        <span className="text-sm font-bold">Admin Panel</span>
                    </button>
                </div>
            )}
        </nav>

        {/* Sidebar Footer */}
        <div className="mt-4 px-4 py-4 bg-slate-50 dark:bg-white/5 rounded-2xl border border-slate-100 dark:border-white/5 text-center">
            <p className="text-[10px] text-slate-400">MedPrep v1.0.0</p>
        </div>
      </aside>

      {/* ================= MAIN CONTENT WRAPPER ================= */}
      {/* UPDATE: padding left md:pl-[22rem] agar ada jarak lega dari sidebar */}
      <div className="flex flex-col min-h-screen md:pl-[22rem] pr-6 py-6 relative transition-all">
        
        {/* HEADER (FLOATING CENTERED CAPSULE) */}
        {/* UPDATE: sticky top-6, max-w-5xl, mx-auto -> Header melayang di tengah */}
        <header className="sticky top-6 z-40 mb-8 mx-3 w-full max-w-5xl">
            <div className="bg-white/70 dark:bg-slate-900/60 backdrop-blur-2xl border border-white/40 dark:border-white/5 rounded-full px-6 py-3 flex items-center justify-between shadow-xl shadow-slate-200/20 dark:shadow-black/20 transition-all hover:bg-white/80 dark:hover:bg-slate-900/80">
                
                {/* Mobile Title */}
                <div className="md:hidden flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-teal-400 to-blue-600 flex items-center justify-center text-white text-xs font-bold">M</div>
                </div>

                {/* Left Side: Page Title */}
                <div className="hidden md:block">
                    <h2 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-3">
                        {getPageTitle()} 
                    </h2>
                </div>

                {/* Right Side: Tools */}
                <div className="flex items-center gap-2 md:gap-3 ml-auto">
                    {/* Theme Toggle */}
                    <button 
                        onClick={toggleTheme}
                        className="w-9 h-9 rounded-full bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 flex items-center justify-center hover:scale-110 transition-transform shadow-sm text-slate-500 dark:text-slate-300"
                    >
                        {getThemeIcon()}
                    </button>

                    {/* Notification */}
                    <button className="w-9 h-9 rounded-full bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 flex items-center justify-center hover:scale-110 transition-transform shadow-sm relative text-slate-500 dark:text-slate-300">
                        <Bell size={16} />
                        <span className="absolute top-2 right-2.5 w-1.5 h-1.5 bg-red-500 rounded-full border-2 border-white dark:border-slate-900"></span>
                    </button>

                    <div className="h-6 w-[1px] bg-slate-300 dark:bg-white/10 mx-2"></div>

                    {/* User Profile */}
                    <div className="flex items-center gap-3 pl-1 relative">
                        <div className="text-right hidden md:block">
                            <p className="text-xs font-bold text-slate-800 dark:text-white leading-tight">
                                {currentUser?.displayName?.split(' ')[0] || 'Dokter'}
                            </p>
                            <p className="text-[9px] font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                                UMS
                            </p>
                        </div>
                        
                        {/* Avatar Toggle */}
                        <div className="relative">
                            <button 
                                onClick={() => setIsProfileOpen(!isProfileOpen)}
                                className="w-9 h-9 rounded-full bg-gradient-to-tr from-teal-400 to-blue-500 p-[2px] cursor-pointer hover:scale-105 transition-transform shadow-md focus:outline-none"
                            >
                                <img 
                                    src={currentUser?.photoURL || `https://ui-avatars.com/api/?name=${currentUser?.displayName}&background=random`} 
                                    alt="Profile" 
                                    className="w-full h-full rounded-full object-cover border-2 border-white dark:border-slate-900"
                                />
                            </button>

                            {/* Dropdown Menu */}
                            {isProfileOpen && (
                                <>
                                    <div 
                                        className="fixed inset-0 z-40" 
                                        onClick={() => setIsProfileOpen(false)}
                                    ></div>

                                    <div className="absolute top-full right-0 mt-3 w-64 bg-white dark:bg-slate-800 rounded-3xl shadow-2xl border border-slate-100 dark:border-slate-700 z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                                        <div className="p-5 border-b border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-white/5">
                                            <p className="text-sm font-bold text-slate-800 dark:text-white">{currentUser?.displayName}</p>
                                            <p className="text-xs text-slate-500 truncate">{currentUser?.email}</p>
                                            <span className="mt-3 inline-block px-3 py-1 bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300 text-[10px] font-black rounded-full border border-indigo-200 dark:border-indigo-800 uppercase tracking-wider">
                                                {currentUser?.subscriptionStatus || 'FREE'}
                                            </span>
                                        </div>
                                        <div className="p-2">
                                            <button onClick={() => navigate('/app/profile')} className="w-full text-left px-4 py-3 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-2xl flex items-center gap-3 transition-colors">
                                                <Settings size={16} /> Pengaturan Akun
                                            </button>
                                            <button onClick={handleLogout} className="w-full text-left px-4 py-3 text-xs font-bold text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-2xl flex items-center gap-3 transition-colors">
                                                <LogOut size={16} /> Keluar Aplikasi
                                            </button>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </header>

        {/* CONTENT CENTERED */}
        {/* UPDATE: max-w-5xl dan mx-auto memastikan konten di tengah area kanan, seimbang kiri-kanan */}
        <main className="flex-1 w-full max-w-5xl mx-3 pb-24 md:pb-0">
            <Outlet />
        </main>

      </div>

      {/* ================= MOBILE BOTTOM NAVIGATION (Hyper Glass) ================= */}
      {/* UPDATE: Opacity lebih rendah (60-80%) dan Blur lebih tinggi untuk efek kaca nyata */}
      <nav className="md:hidden fixed bottom-6 left-6 right-6 bg-white/70 dark:bg-slate-900/60 backdrop-blur-2xl border border-white/20 dark:border-white/10 rounded-[2.5rem] shadow-2xl z-50 px-6 py-4 flex justify-between items-center ring-1 ring-white/20">
          {navItems.slice(0, 5).map((item) => {
              const isActive = location.pathname.startsWith(item.path);
              return (
                  <button 
                    key={item.path}
                    onClick={() => navigate(item.path)}
                    className={`flex flex-col items-center gap-1 transition-all duration-300 ${isActive ? 'text-blue-600 dark:text-teal-400 scale-110 -translate-y-1' : 'text-slate-400 hover:text-slate-600'}`}
                  >
                      <item.icon size={isActive ? 26 : 24} strokeWidth={isActive ? 2.5 : 2} />
                      {isActive && <span className="w-1 h-1 rounded-full bg-current mt-1 shadow-[0_0_10px_currentColor]"></span>}
                  </button>
              )
          })}
      </nav>

    </div>
  );
}