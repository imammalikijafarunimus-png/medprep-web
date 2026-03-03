/**
 * Main Layout Component
 * @module components/Layout/Layout
 * 
 * Consolidated layout with:
 * - Accessible navigation
 * - Proper ARIA attributes
 * - Keyboard navigation support
 * - Skip links
 * - Focus management
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { 
  ChevronsLeft, ChevronsRight, Menu, X,
  Sun, Moon, BookOpen, Search, LogOut,
  Settings, Lock, Sparkles
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useUserStats } from '../../hooks/useUserStats';
import { NAV_ITEMS, getPageTitle } from '../../config/navigation';
import { Logo, LogoCompact } from '../ui/Logo';
import toast from 'react-hot-toast';

export default function Layout() {
  const { currentUser, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { totalAnswered, accuracy, streak } = useUserStats();
  const location = useLocation();
  const navigate = useNavigate();
  
  // UI State
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isInsightActive, setIsInsightActive] = useState(
    localStorage.getItem('medprep_insight_active') === 'true'
  );
  
  // Refs for focus management
  const searchInputRef = useRef<HTMLInputElement>(null);
  const profileButtonRef = useRef<HTMLButtonElement>(null);
  const mainContentRef = useRef<HTMLDivElement>(null);
  
  // Search state
  const [searchQuery, setSearchQuery] = useState('');

  // ============================================
  // EFFECTS
  // ============================================

  // Focus search input when opened
  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchOpen]);

  // Close dropdowns on route change
  useEffect(() => {
    setIsProfileOpen(false);
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  // Close dropdowns on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsProfileOpen(false);
        setIsMobileMenuOpen(false);
        setIsSearchOpen(false);
      }
    };
    
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, []);

  // ============================================
  // HANDLERS
  // ============================================

  const handleSearch = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/app/search?q=${encodeURIComponent(searchQuery)}`);
      setIsSearchOpen(false);
      setSearchQuery('');
    }
  }, [searchQuery, navigate]);

  const handleLogout = useCallback(async () => {
    if (confirm('Keluar dari aplikasi?')) {
      try {
        await logout();
        navigate('/login');
      } catch (error) {
        console.error('Logout error:', error);
        toast.error('Gagal logout');
      }
    }
  }, [logout, navigate]);

  const toggleInsight = useCallback(() => {
    const status = currentUser?.subscriptionStatus || 'free';
    const canAccess = ['basic', 'expert', 'premium'].includes(status);
    
    if (!canAccess) {
      toast.error('Fitur terkunci! Upgrade untuk aktifkan Insight.', {
        icon: '🔒',
        style: { borderRadius: '10px' }
      });
      return;
    }
    
    const newState = !isInsightActive;
    setIsInsightActive(newState);
    localStorage.setItem('medprep_insight_active', String(newState));
    
    toast.success(newState ? 'Insight: ON' : 'Insight: OFF', {
      icon: newState ? '✨' : '💤',
      style: { borderRadius: '10px' }
    });
  }, [currentUser?.subscriptionStatus, isInsightActive]);

  const getThemeIcon = () => {
    switch (theme) {
      case 'dark':
        return <Moon size={18} className="text-indigo-400" aria-hidden="true" />;
      case 'read':
        return <BookOpen size={18} className="text-amber-700" aria-hidden="true" />;
      default:
        return <Sun size={18} className="text-orange-500" aria-hidden="true" />;
    }
  };

  const getThemeLabel = () => {
    switch (theme) {
      case 'dark': return 'Mode Gelap';
      case 'read': return 'Mode Baca';
      default: return 'Mode Terang';
    }
  };

  // ============================================
  // RENDER
  // ============================================

  const pageTitle = getPageTitle(location.pathname);
  const displayName = currentUser?.displayName?.split(' ')[0] || 'Dokter';
  const subscriptionStatus = currentUser?.subscriptionStatus || 'free';

  return (
    <div className={`min-h-screen transition-colors duration-500 font-sans ${
      theme === 'read' 
        ? 'bg-[#fbf6e9] text-[#433422]' 
        : 'bg-slate-50 dark:bg-[#0B1120] dark:text-slate-200'
    }`}>
      
      {/* Skip Link - Keyboard Navigation */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[9999] focus:px-4 focus:py-2 focus:bg-slate-900 focus:text-white focus:rounded-xl focus:font-bold focus:text-sm focus:shadow-2xl"
        onClick={(e) => {
          e.preventDefault();
          mainContentRef.current?.focus();
        }}
      >
        Langsung ke konten utama
      </a>

      {/* ============================================ */}
      {/* DESKTOP SIDEBAR */}
      {/* ============================================ */}
      <aside 
        className={`
          hidden md:flex fixed top-4 bottom-4 left-4 rounded-[2rem] 
          bg-white/80 dark:bg-slate-900/80 backdrop-blur-2xl 
          border border-white/40 dark:border-white/5 shadow-xl 
          flex-col py-6 transition-all duration-300 z-50
          ${isSidebarCollapsed ? 'w-20 px-2 items-center' : 'w-64 px-4'}
        `}
        role="navigation"
        aria-label="Menu utama"
      >
        {/* Logo */}
        <div className={`flex items-center mb-8 transition-all duration-300 ${
          isSidebarCollapsed ? 'justify-center' : 'justify-between px-2'
        }`}>
          <Logo 
            size={isSidebarCollapsed ? 'sm' : 'md'} 
            showText={!isSidebarCollapsed}
            onClick={() => navigate('/app/dashboard')}
          />
          
          {!isSidebarCollapsed && (
            <button 
              onClick={() => setIsSidebarCollapsed(true)}
              className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-white/5 text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
              aria-label="Ciutkan sidebar"
            >
              <ChevronsLeft size={18} aria-hidden="true" />
            </button>
          )}
        </div>

        {/* Collapse button when collapsed */}
        {isSidebarCollapsed && (
          <button 
            onClick={() => setIsSidebarCollapsed(false)}
            className="mb-6 p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-white/5 text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
            aria-label="Lebarkan sidebar"
          >
            <ChevronsRight size={20} aria-hidden="true" />
          </button>
        )}

        {/* Navigation Items */}
        <nav className="flex-1 space-y-2 overflow-y-auto custom-scrollbar w-full" aria-label="Menu navigasi">
          {NAV_ITEMS.map((item) => {
            const isActive = location.pathname.startsWith(item.path);
            const Icon = item.icon;
            
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`
                  flex items-center transition-all duration-300 group relative overflow-hidden
                  focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2
                  ${isSidebarCollapsed 
                    ? 'justify-center w-12 h-12 rounded-2xl mx-auto' 
                    : 'w-full gap-3 px-3 py-3 rounded-xl'
                  }
                  ${isActive 
                    ? 'bg-slate-900 text-white shadow-md dark:bg-white dark:text-slate-900' 
                    : 'hover:bg-slate-100 dark:hover:bg-white/5 text-slate-600 dark:text-slate-400 font-medium'
                  }
                `}
                aria-current={isActive ? 'page' : undefined}
                title={isSidebarCollapsed ? item.label : undefined}
              >
                <Icon 
                  size={20} 
                  className={`shrink-0 transition-transform group-hover:scale-110 ${
                    isActive 
                      ? 'text-teal-400 dark:text-blue-600' 
                      : 'text-slate-400 dark:text-slate-500'
                  }`}
                  aria-hidden="true"
                />
                {!isSidebarCollapsed && (
                  <span className="text-xs tracking-wide font-bold whitespace-nowrap">
                    {item.label}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </aside>

      {/* ============================================ */}
      {/* MAIN CONTENT WRAPPER */}
      {/* ============================================ */}
      <div className={`
        flex flex-col min-h-screen px-4 md:pr-4 py-4 relative transition-all duration-300
        ${isSidebarCollapsed ? 'md:pl-28' : 'md:pl-[18rem]'}
      `}>
        
        {/* HEADER */}
        <header 
          className="sticky top-4 z-40 mb-6 mx-auto w-full max-w-6xl"
          role="banner"
        >
          <div className="
            bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl 
            border border-white/40 dark:border-white/5 rounded-full 
            px-5 py-2.5 flex items-center justify-between shadow-lg 
            transition-all hover:bg-white/90 dark:hover:bg-slate-900/90 h-[60px]
          ">
            
            {/* Mobile Logo & Menu */}
            <div className="md:hidden flex items-center gap-2">
              <button
                onClick={() => setIsMobileMenuOpen(true)}
                className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-white/5 focus:outline-none focus:ring-2 focus:ring-teal-500"
                aria-label="Buka menu"
                aria-expanded={isMobileMenuOpen}
              >
                <Menu size={20} aria-hidden="true" />
              </button>
              <LogoCompact />
            </div>

            {/* Page Title (Desktop) */}
            <div className="hidden md:flex items-center flex-1">
              {isSearchOpen ? (
                <form onSubmit={handleSearch} className="w-full flex items-center gap-2 animate-in fade-in slide-in-from-right duration-300">
                  <Search size={16} className="text-slate-400 shrink-0" aria-hidden="true" />
                  <input
                    ref={searchInputRef}
                    type="search"
                    placeholder="Cari materi, soal, atau obat..."
                    className="w-full bg-transparent border-none outline-none text-slate-800 dark:text-white placeholder:text-slate-400 text-sm font-medium"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    aria-label="Pencarian"
                  />
                  <button
                    type="button"
                    onClick={() => { setIsSearchOpen(false); setSearchQuery(''); }}
                    className="p-1 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
                    aria-label="Tutup pencarian"
                  >
                    <X size={14} aria-hidden="true" />
                  </button>
                </form>
              ) : (
                <h1 className="text-base font-bold text-slate-800 dark:text-white">
                  {pageTitle}
                </h1>
              )}
            </div>

            {/* Header Actions */}
            <div className="flex items-center gap-2 ml-auto">
              
              {/* Search Toggle */}
              <button
                onClick={() => setIsSearchOpen(true)}
                className="w-8 h-8 rounded-full bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 flex items-center justify-center hover:scale-105 transition-transform shadow-sm text-slate-500 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
                aria-label="Buka pencarian"
              >
                <Search size={14} aria-hidden="true" />
              </button>

              {/* Insight Toggle */}
              <button
                onClick={toggleInsight}
                className={`w-8 h-8 rounded-full border flex items-center justify-center hover:scale-105 transition-transform shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 ${
                  isInsightActive
                    ? 'bg-amber-100 border-amber-200 text-amber-600 dark:bg-amber-900/20 dark:border-amber-800 dark:text-amber-400'
                    : 'bg-white dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-400'
                }`}
                aria-label={isInsightActive ? 'Matikan Insight' : 'Aktifkan Insight'}
                aria-pressed={isInsightActive}
              >
                {subscriptionStatus === 'free' ? (
                  <Lock size={12} aria-hidden="true" />
                ) : (
                  <Sparkles size={14} fill={isInsightActive ? 'currentColor' : 'none'} aria-hidden="true" />
                )}
              </button>

              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className="w-8 h-8 rounded-full bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 flex items-center justify-center hover:scale-105 transition-transform shadow-sm text-slate-500 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
                aria-label={`Ganti tema, saat ini: ${getThemeLabel()}`}
              >
                {getThemeIcon()}
              </button>

              <div className="h-5 w-px bg-slate-300 dark:bg-white/10 mx-1" aria-hidden="true" />

              {/* Profile */}
              <div className="relative">
                <button
                  ref={profileButtonRef}
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center gap-2 hover:opacity-80 transition-opacity focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 rounded-full"
                  aria-label="Menu profil"
                  aria-expanded={isProfileOpen}
                  aria-haspopup="true"
                >
                  {/* Name (Desktop only) */}
                  <div className="hidden md:block text-right">
                    <p className="text-[11px] font-bold text-slate-800 dark:text-white leading-tight">
                      {displayName}
                    </p>
                    <p className="text-[8px] font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                      {subscriptionStatus}
                    </p>
                  </div>
                  
                  {/* Avatar */}
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-teal-400 to-blue-500 p-[1.5px] shadow-md">
                    <img
                      src={currentUser?.photoURL || `https://ui-avatars.com/api/?name=${displayName}&background=random`}
                      alt=""
                      className="w-full h-full rounded-full object-cover border-2 border-white dark:border-slate-900"
                    />
                  </div>
                </button>

                {/* Profile Dropdown */}
                {isProfileOpen && (
                  <>
                    <div 
                      className="fixed inset-0 z-40" 
                      onClick={() => setIsProfileOpen(false)}
                      aria-hidden="true"
                    />
                    <div 
                      className="absolute top-full right-0 mt-2 w-60 bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-700 z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200"
                      role="menu"
                    >
                      <div className="p-4 border-b border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-white/5">
                        <p className="text-sm font-bold text-slate-800 dark:text-white">
                          {currentUser?.displayName}
                        </p>
                        <p className="text-[10px] text-slate-500 mt-1 truncate">
                          {currentUser?.email}
                        </p>
                        <span className="mt-2 inline-block px-2 py-0.5 bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300 text-[9px] font-black rounded border border-indigo-200 dark:border-indigo-800 uppercase tracking-wider">
                          {subscriptionStatus}
                        </span>
                      </div>
                      <div className="p-1.5">
                        <button
                          onClick={() => { navigate('/app/profile'); setIsProfileOpen(false); }}
                          className="w-full text-left px-3 py-2 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-xl flex items-center gap-2 transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500"
                          role="menuitem"
                        >
                          <Settings size={14} aria-hidden="true" />
                          Pengaturan Akun
                        </button>
                        <button
                          onClick={handleLogout}
                          className="w-full text-left px-3 py-2 text-xs font-bold text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl flex items-center gap-2 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500"
                          role="menuitem"
                        >
                          <LogOut size={14} aria-hidden="true" />
                          Keluar Aplikasi
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* MAIN CONTENT */}
        <main 
          ref={mainContentRef}
          id="main-content"
          className="flex-1 w-full max-w-6xl mx-auto pb-24 md:pb-0 outline-none"
          role="main"
          tabIndex={-1}
        >
          <Outlet context={{ isInsightActive }} />
        </main>
      </div>

      {/* ============================================ */}
      {/* MOBILE NAVIGATION (Bottom Tab Bar) */}
      {/* ============================================ */}
      <nav 
        className="md:hidden fixed bottom-0 left-0 right-0 bg-white/95 dark:bg-slate-950/95 backdrop-blur-xl border-t border-slate-200 dark:border-white/10 z-50"
        role="navigation"
        aria-label="Menu mobile"
      >
        <div className="flex justify-around items-center h-16 px-2">
          {NAV_ITEMS.slice(0, 4).map((item) => {
            const isActive = location.pathname.startsWith(item.path);
            const Icon = item.icon;
            
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`
                  flex flex-col items-center justify-center w-full h-full gap-1 
                  transition-all duration-300 active:scale-90
                  focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-inset
                  ${isActive 
                    ? 'text-blue-600 dark:text-teal-400' 
                    : 'text-slate-400 dark:text-slate-500 hover:text-slate-600'
                  }
                `}
                aria-current={isActive ? 'page' : undefined}
              >
                <Icon size={isActive ? 22 : 20} strokeWidth={isActive ? 2.5 : 2} aria-hidden="true" />
                <span className="text-[9px] font-bold tracking-wide">
                  {item.label.split(' ')[0]}
                </span>
              </button>
            );
          })}
          
          {/* More button for overflow items */}
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="flex flex-col items-center justify-center w-full h-full gap-1 text-slate-400 dark:text-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-inset"
            aria-label="Menu lainnya"
          >
            <Menu size={20} aria-hidden="true" />
            <span className="text-[9px] font-bold tracking-wide">Lainnya</span>
          </button>
        </div>
      </nav>

      {/* ============================================ */}
      {/* MOBILE MENU OVERLAY */}
      {/* ============================================ */}
      {isMobileMenuOpen && (
        <>
          <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60]"
            onClick={() => setIsMobileMenuOpen(false)}
            aria-hidden="true"
          />
          <div 
            className="fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-900 rounded-t-3xl z-[70] p-6 animate-in slide-in-from-bottom duration-300"
            role="dialog"
            aria-label="Menu navigasi"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">Menu</h2>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500"
                aria-label="Tutup menu"
              >
                <X size={20} aria-hidden="true" />
              </button>
            </div>
            
            <div className="space-y-2">
              {NAV_ITEMS.map((item) => {
                const isActive = location.pathname.startsWith(item.path);
                const Icon = item.icon;
                
                return (
                  <button
                    key={item.path}
                    onClick={() => {
                      navigate(item.path);
                      setIsMobileMenuOpen(false);
                    }}
                    className={`
                      w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all
                      focus:outline-none focus:ring-2 focus:ring-teal-500
                      ${isActive
                        ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white'
                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                      }
                    `}
                    aria-current={isActive ? 'page' : undefined}
                  >
                    <Icon size={20} aria-hidden="true" />
                    <span className="font-medium text-sm">{item.label}</span>
                  </button>
                );
              })}
              
              <hr className="border-slate-200 dark:border-slate-700 my-2" />
              
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                <LogOut size={20} aria-hidden="true" />
                <span className="font-medium text-sm">Keluar Aplikasi</span>
              </button>
            </div>
          </div>
        </>
      )}

      {/* Live Region for Announcements */}
      <div 
        aria-live="polite" 
        aria-atomic="true" 
        className="sr-only"
      >
        {/* Screen readers will announce changes here */}
      </div>
    </div>
  );
}