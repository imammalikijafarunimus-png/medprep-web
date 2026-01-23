import React, { useState, useEffect, useRef } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutGrid, GraduationCap, Stethoscope, Zap, User, 
  Sun, Moon, BookOpen, Search, Bell, LogOut, ChevronRight,
  ShieldCheck, Settings, Sparkles, Lock, X
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { doc, getDoc } from 'firebase/firestore'; 
import { db } from '../../lib/firebase'; 
import toast from 'react-hot-toast';

export default function Layout() {
  const { currentUser } = useAuth(); 
  const location = useLocation();
  const navigate = useNavigate();
  
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); 
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
  const [userProfile, setUserProfile] = useState<any>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const searchInputRef = useRef<HTMLInputElement>(null);
  
  // STATE GLOBAL INSIGHT MODE
  const [isInsightActive, setIsInsightActive] = useState(localStorage.getItem('medprep_insight_active') === 'true');

  useEffect(() => {
    const fetchUserData = async () => {
      if (currentUser?.uid) {
        try {
          const docRef = doc(db, "users", currentUser.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) setUserProfile(docSnap.data());
        } catch (err) { console.error(err); }
      }
    };
    fetchUserData();
  }, [currentUser]);

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('dark', 'mode-read');
    if (theme === 'dark') root.classList.add('dark');
    if (theme === 'read') root.classList.add('mode-read');
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
      if(isSearchOpen && searchInputRef.current) searchInputRef.current.focus();
  }, [isSearchOpen]);

  const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : prev === 'dark' ? 'read' : 'light');
  
  const getThemeIcon = () => {
    if (theme === 'dark') return <Moon size={18} className="text-indigo-400" />;
    if (theme === 'read') return <BookOpen size={18} className="text-amber-700" />;
    return <Sun size={18} className="text-orange-500" />;
  };

  const toggleInsight = () => {
      const status = userProfile?.subscriptionStatus || currentUser?.subscriptionStatus || 'free';
      const canAccess = status === 'basic' || status === 'expert' || status === 'premium';

      if (!canAccess) {
          toast.error("Fitur Terkunci! Upgrade untuk aktifkan Insight.", { icon: '🔒', style: { borderRadius: '10px', background: '#333', color: '#fff', fontSize: '12px' } });
          return;
      }
      const newState = !isInsightActive;
      setIsInsightActive(newState);
      localStorage.setItem('medprep_insight_active', String(newState));
      if(newState) toast.success("Insight: ON", { icon: '✨', style: { borderRadius: '10px', background: '#333', color: '#fff', fontSize: '12px' } });
      else toast("Insight: OFF", { icon: '💤', style: { borderRadius: '10px', background: '#333', color: '#fff', fontSize: '12px' } });
  };

  const getPageTitle = () => {
      const path = location.pathname;
      if (path.includes('/dashboard')) return 'Dashboard';
      if (path.includes('/cbt')) return 'CBT Center';
      if (path.includes('/osce')) return 'OSCE Center';
      if (path.includes('/oscie')) return 'OSCIE Center';
      if (path.includes('/flashcards')) return 'Flashcards';
      if (path.includes('/profile')) return 'Profil';
      return 'MedPrep';
  };

  const handleSearch = (e: React.FormEvent) => {
      e.preventDefault();
      if(searchQuery.trim()) {
          toast(`Mencari: ${searchQuery}`, { icon: '🔍' });
          setIsSearchOpen(false);
          setSearchQuery('');
      }
  };

  const handleLogout = async () => { 
      if(confirm('Keluar aplikasi?')) {
          setTimeout(() => { navigate('/login'); }, 500);
      }
  };

  const navItems = [
    { icon: LayoutGrid, label: 'Dashboard', path: '/app/dashboard' },
    { icon: GraduationCap, label: 'CBT Center', path: '/app/cbt' },
    { icon: Stethoscope, label: 'OSCE Center', path: '/app/osce' },
    { icon: Moon, label: 'OSCIE Center', path: '/app/oscie' },
    { icon: Zap, label: 'Flashcards', path: '/app/flashcards' },
    { icon: User, label: 'Profil Saya', path: '/app/profile' },
  ];

  return (
    <div className={`min-h-screen transition-colors duration-500 font-sans ${theme === 'read' ? 'bg-[#fbf6e9] text-[#433422]' : 'bg-slate-50 dark:bg-[#0B1120] dark:text-slate-200'}`}>
      
      {/* SIDEBAR */}
      <aside className="hidden md:flex fixed top-4 bottom-4 left-4 w-64 rounded-[2rem] bg-white/80 dark:bg-slate-900/80 backdrop-blur-2xl border border-white/40 dark:border-white/5 shadow-xl flex-col py-6 px-4 z-50">
        <div className="flex items-center gap-3 mb-6 px-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-400 to-blue-600 flex items-center justify-center text-white shadow-lg"><span className="font-black text-xl">M</span></div>
            <div><h1 className="font-bold text-lg tracking-tight leading-none text-slate-800 dark:text-white">MedPrep</h1><p className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Medical OS</p></div>
        </div>
        <nav className="flex-1 space-y-1 overflow-y-auto custom-scrollbar pr-1">
            {navItems.map((item) => {
                const isActive = location.pathname.startsWith(item.path);
                return (
                    <button key={item.path} onClick={() => navigate(item.path)} className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-300 group relative overflow-hidden ${isActive ? 'bg-slate-900 text-white shadow-md dark:bg-white dark:text-slate-900' : 'hover:bg-slate-100 dark:hover:bg-white/5 text-slate-600 dark:text-slate-400 font-medium'}`}>
                        <item.icon size={20} className={`transition-transform group-hover:scale-110 ${isActive ? 'text-teal-400 dark:text-blue-600' : 'text-slate-400 dark:text-slate-500'}`} />
                        <span className="text-xs tracking-wide font-bold">{item.label}</span>
                        {isActive && <ChevronRight size={14} className="ml-auto opacity-50" />}
                    </button>
                )
            })}
            {(userProfile?.subscriptionStatus === 'premium' || userProfile?.subscriptionStatus === 'expert') && (
                <div className="pt-3 mt-3 border-t border-slate-100 dark:border-white/10">
                    <p className="px-3 text-[9px] font-bold uppercase text-slate-400 mb-1">Admin</p>
                    <button onClick={() => navigate('/app/admin')} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-300 group ${location.pathname.startsWith('/app/admin') ? 'bg-red-50 text-red-600 border border-red-200 dark:bg-red-900/20 dark:text-red-400' : 'hover:bg-red-50 text-slate-600 dark:text-slate-400 hover:text-red-500'}`}>
                        <ShieldCheck size={20} className={location.pathname.startsWith('/app/admin') ? 'text-red-500' : ''} /><span className="text-xs font-bold">Panel Admin</span>
                    </button>
                </div>
            )}
        </nav>
      </aside>

      {/* MAIN CONTENT */}
      <div className="flex flex-col min-h-screen md:pl-[18rem] px-4 md:pr-4 py-4 relative transition-all">
        
        {/* HEADER */}
        <header className="sticky top-4 z-40 mb-6 mx-auto w-full max-w-6xl">
            <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-white/40 dark:border-white/5 rounded-full px-5 py-2.5 flex items-center justify-between shadow-lg transition-all hover:bg-white/90 dark:hover:bg-slate-900/90 h-[60px]">
                
                <div className="md:hidden flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-teal-400 to-blue-600 flex items-center justify-center text-white text-xs font-bold">M</div>
                </div>

                <div className="flex-1 flex items-center">
                    {isSearchOpen ? (
                        <form onSubmit={handleSearch} className="w-full flex items-center gap-2 animate-in fade-in slide-in-from-right duration-300">
                            <Search size={16} className="text-slate-400 ml-1" />
                            <input ref={searchInputRef} type="text" placeholder="Cari materi..." className="w-full bg-transparent border-none outline-none text-slate-800 dark:text-white placeholder:text-slate-400 text-sm font-medium" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} onBlur={() => !searchQuery && setIsSearchOpen(false)} />
                            <button type="button" onClick={() => { setIsSearchOpen(false); setSearchQuery(''); }} className="p-1 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-400"><X size={14}/></button>
                        </form>
                    ) : (
                        <div className="hidden md:flex items-center gap-3 animate-in fade-in duration-300">
                            <h2 className="text-base font-bold text-slate-800 dark:text-white">{getPageTitle()}</h2>
                        </div>
                    )}
                </div>

                <div className="flex items-center gap-2 ml-auto">
                    {!isSearchOpen && <button onClick={() => setIsSearchOpen(true)} className="w-8 h-8 rounded-full bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 flex items-center justify-center hover:scale-105 transition-transform shadow-sm text-slate-500 dark:text-slate-300"><Search size={14} /></button>}
                    
                    {/* TOGGLE INSIGHT BUTTON */}
                    <button onClick={toggleInsight} className={`w-8 h-8 rounded-full border flex items-center justify-center hover:scale-105 transition-transform shadow-sm ${isInsightActive ? 'bg-amber-100 border-amber-200 text-amber-600 dark:bg-amber-900/20 dark:border-amber-800 dark:text-amber-400' : 'bg-white dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-400'}`}>
                        {(userProfile?.subscriptionStatus === 'free' || !userProfile?.subscriptionStatus) ? <Lock size={12} /> : <Sparkles size={14} fill={isInsightActive ? "currentColor" : "none"} />}
                    </button>

                    <button onClick={toggleTheme} className="w-8 h-8 rounded-full bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 flex items-center justify-center hover:scale-105 transition-transform shadow-sm text-slate-500 dark:text-slate-300"><>{getThemeIcon()}</></button>

                    <div className="h-5 w-[1px] bg-slate-300 dark:bg-white/10 mx-1"></div>

                    <div className="flex items-center gap-2 pl-1 relative">
                        <div className="text-right hidden md:block">
                            <p className="text-[11px] font-bold text-slate-800 dark:text-white leading-tight">{userProfile?.name?.split(' ')[0] || currentUser?.displayName?.split(' ')[0] || 'Dokter'}</p>
                            <p className="text-[8px] font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider max-w-[120px] truncate">{userProfile?.university || 'Universitas'}</p>
                        </div>
                        <div className="relative">
                            <button onClick={() => setIsProfileOpen(!isProfileOpen)} className="w-8 h-8 rounded-full bg-gradient-to-tr from-teal-400 to-blue-500 p-[1.5px] cursor-pointer hover:scale-105 transition-transform shadow-md focus:outline-none">
                                <img src={currentUser?.photoURL || `https://ui-avatars.com/api/?name=${userProfile?.name || currentUser?.displayName}&background=random`} alt="Profile" className="w-full h-full rounded-full object-cover border-2 border-white dark:border-slate-900" />
                            </button>
                            {isProfileOpen && (
                                <>
                                    <div className="fixed inset-0 z-40" onClick={() => setIsProfileOpen(false)}></div>
                                    <div className="absolute top-full right-0 mt-2 w-60 bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-700 z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                                        <div className="p-4 border-b border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-white/5">
                                            <p className="text-sm font-bold text-slate-800 dark:text-white">{userProfile?.name || currentUser?.displayName}</p>
                                            <p className="text-[10px] text-slate-500 mt-1 truncate">{userProfile?.university}</p>
                                            <span className="mt-2 inline-block px-2 py-0.5 bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300 text-[9px] font-black rounded border border-indigo-200 dark:border-indigo-800 uppercase tracking-wider">{userProfile?.subscriptionStatus || 'FREE'}</span>
                                        </div>
                                        <div className="p-1.5">
                                            <button onClick={() => navigate('/app/profile')} className="w-full text-left px-3 py-2 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-xl flex items-center gap-2 transition-colors"><Settings size={14} /> Pengaturan Akun</button>
                                            <button onClick={handleLogout} className="w-full text-left px-3 py-2 text-xs font-bold text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl flex items-center gap-2 transition-colors"><LogOut size={14} /> Keluar Aplikasi</button>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </header>

        {/* MENGIRIM CONTEXT KE HALAMAN */}
        <main className="flex-1 w-full max-w-6xl mx-auto pb-24 md:pb-0">
            <Outlet context={{ isInsightActive }} />
        </main>
      </div>

      <nav className="md:hidden fixed bottom-4 left-4 right-4 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-white/20 dark:border-white/10 rounded-2xl shadow-2xl z-50 px-6 py-3 flex justify-between items-center ring-1 ring-white/20">
          {navItems.slice(0, 5).map((item) => {
              const isActive = location.pathname.startsWith(item.path);
              return (<button key={item.path} onClick={() => navigate(item.path)} className={`flex flex-col items-center gap-0.5 transition-all duration-300 ${isActive ? 'text-blue-600 dark:text-teal-400 scale-105 -translate-y-0.5' : 'text-slate-400 hover:text-slate-600'}`}><item.icon size={isActive ? 22 : 20} strokeWidth={isActive ? 2.5 : 2} />{isActive && <span className="w-1 h-1 rounded-full bg-current mt-0.5 shadow-[0_0_10px_currentColor]"></span>}</button>)
          })}
      </nav>
    </div>
  );
}