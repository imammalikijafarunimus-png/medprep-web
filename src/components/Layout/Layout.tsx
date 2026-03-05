/**
 * Main Layout Component - FIXED VERSION
 * @module components/Layout/Layout
 * 
 * Fixes:
 * - Mobile sidebar hidden properly
 * - Quick Actions positioning fixed
 * - Better responsive behavior
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
import { getAllNavItems, getPageTitle } from '../../config/navigation';
import { Logo, LogoCompact } from '../ui/Logo';
import { QuickActions } from '../ui/QuickActions';
import { SearchModal, SearchTrigger, useSearchShortcut } from '../ui/SearchModal';
import { AutoBreadcrumb } from '../ui/Breadcrumb';
import { useRecentSearches } from '../../hooks/useRecentSearches';
import toast from 'react-hot-toast';

export default function Layout() {
  const { currentUser, logout, isAdmin, isSuperAdmin } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();
  const { totalAnswered, accuracy, streak } = useUserStats();
  const location = useLocation();
  const navigate = useNavigate();
  
  // Get nav items based on user role
  const navItems = getAllNavItems(isAdmin, isSuperAdmin, false);
  const mobileNavItems = navItems.slice(0, 4);
  
  // Search
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { recentSearches, addSearch, clearRecent } = useRecentSearches();
  useSearchShortcut(() => setIsSearchOpen(true));
  
  // UI State
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isInsightActive, setIsInsightActive] = useState(
    typeof window !== 'undefined' && localStorage.getItem('medprep_insight_active') === 'true'
  );
  
  // Refs
  const mainContentRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on route change
  useEffect(() => {
    setIsProfileOpen(false);
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  // Close on escape
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

  // Handlers
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
    return isDarkMode 
      ? <Moon size={18} className="text-indigo-400" /> 
      : <Sun size={18} className="text-orange-500" />;
  };

  const pageTitle = getPageTitle(location.pathname);
  const displayName = currentUser?.displayName?.split(' ')[0] || 'Dokter';
  const subscriptionStatus = currentUser?.subscriptionStatus || 'free';

  return (
    <div className={`min-h-screen transition-colors duration-500 font-sans ${
      isDarkMode 
        ? 'bg-[#0B1120] text-slate-200' 
        : 'bg-slate-50 text-slate-900'
    }`}>
      
      {/* Skip Link */}
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
      {/* DESKTOP SIDEBAR - HIDDEN ON MOBILE */}
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
              className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-white/5 text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
              aria-label="Ciutkan sidebar"
            >
              <ChevronsLeft size={18} />
            </button>
          )}
        </div>

        {isSidebarCollapsed && (
          <button 
            onClick={() => setIsSidebarCollapsed(false)}
            className="mb-6 p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-white/5 text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
            aria-label="Lebarkan sidebar"
          >
            <ChevronsRight size={20} />
          </button>
        )}

        {/* Navigation */}
        <nav className="flex-1 space-y-2 overflow-y-auto custom-scrollbar w-full">
          {navItems.map((item) => {
            const isActive = location.pathname.startsWith(item.path);
            const Icon = item.icon;
            
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`
                  flex items-center transition-all duration-300 group
                  focus:outline-none focus:ring-2 focus:ring-teal-500
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
                <Icon size={20} className="shrink-0" />
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
        <header className="sticky top-4 z-40 mb-4 mx-auto w-full max-w-6xl" role="banner">
          <div className="
            bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl 
            border border-white/40 dark:border-white/5 rounded-full 
            px-4 py-2 flex items-center justify-between shadow-lg 
            h-[52px] md:h-[60px]
          ">
            {/* Mobile Menu Button & Logo */}
            <div className="flex items-center gap-2 md:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(true)}
                className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-white/5 focus:outline-none focus:ring-2 focus:ring-teal-500"
                aria-label="Buka menu"
              >
                <Menu size={20} />
              </button>
              <LogoCompact />
            </div>

            {/* Desktop: Breadcrumb + Page Title */}
            <div className="hidden md:flex items-center gap-4 flex-1">
              <AutoBreadcrumb className="text-xs" />
            </div>

            {/* Actions */}
            <div className="flex items-center gap-1.5 md:gap-2 ml-auto">
              {/* Search */}
              <SearchTrigger onClick={() => setIsSearchOpen(true)} />

              {/* Insight */}
              <button
                onClick={toggleInsight}
                className={`w-8 h-8 rounded-full border flex items-center justify-center transition-transform hover:scale-105 shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 ${
                  isInsightActive
                    ? 'bg-amber-100 border-amber-200 text-amber-600 dark:bg-amber-900/20 dark:border-amber-800 dark:text-amber-400'
                    : 'bg-white dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-400'
                }`}
                aria-label={isInsightActive ? 'Matikan Insight' : 'Aktifkan Insight'}
              >
                {subscriptionStatus === 'free' ? <Lock size={12} /> : <Sparkles size={14} />}
              </button>

              {/* Theme */}
              <button
                onClick={toggleTheme}
                className="w-8 h-8 rounded-full bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 flex items-center justify-center hover:scale-105 transition-transform shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                {getThemeIcon()}
              </button>

              <div className="h-5 w-px bg-slate-300 dark:bg-white/10 mx-0.5 md:mx-1" />

              {/* Profile */}
              <div className="relative">
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center gap-2 hover:opacity-80 transition-opacity focus:outline-none focus:ring-2 focus:ring-teal-500 rounded-full"
                >
                  <div className="hidden md:block text-right">
                    <p className="text-[10px] font-bold text-slate-800 dark:text-white leading-tight">
                      {displayName}
                    </p>
                    <p className="text-[8px] font-medium text-slate-500 uppercase tracking-wider">
                      {subscriptionStatus}
                    </p>
                  </div>
                  <div className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-gradient-to-tr from-teal-400 to-blue-500 p-[1.5px] shadow-md">
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
                    <div className="fixed inset-0 z-40" onClick={() => setIsProfileOpen(false)} />
                    <div className="absolute top-full right-0 mt-2 w-56 bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-700 z-50 overflow-hidden">
                      <div className="p-3 border-b border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-white/5">
                        <p className="text-sm font-bold text-slate-800 dark:text-white truncate">
                          {currentUser?.displayName}
                        </p>
                        <p className="text-[10px] text-slate-500 truncate">{currentUser?.email}</p>
                      </div>
                      <div className="p-1.5">
                        <button
                          onClick={() => { navigate('/app/profile'); setIsProfileOpen(false); }}
                          className="w-full text-left px-3 py-2 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-xl flex items-center gap-2"
                        >
                          <Settings size={14} /> Pengaturan
                        </button>
                        <button
                          onClick={handleLogout}
                          className="w-full text-left px-3 py-2 text-xs font-bold text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl flex items-center gap-2"
                        >
                          <LogOut size={14} /> Keluar
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
          className="flex-1 w-full max-w-6xl mx-auto pb-20 md:pb-0 outline-none"
          role="main"
          tabIndex={-1}
        >
          <Outlet context={{ isInsightActive }} />
        </main>
      </div>

      {/* ============================================ */}
      {/* MOBILE BOTTOM NAVIGATION */}
      {/* ============================================ */}
      <nav 
        className="md:hidden fixed bottom-0 left-0 right-0 bg-white/95 dark:bg-slate-950/95 backdrop-blur-xl border-t border-slate-200 dark:border-white/10 z-50 safe-area-bottom"
        role="navigation"
        aria-label="Menu mobile"
      >
        <div className="flex justify-around items-center h-16 px-2">
          {mobileNavItems.map((item) => {
            const isActive = location.pathname.startsWith(item.path);
            const Icon = item.icon;
            
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`flex flex-col items-center justify-center w-full h-full gap-0.5 transition-all ${
                  isActive ? 'text-blue-600 dark:text-teal-400' : 'text-slate-400'
                }`}
                aria-current={isActive ? 'page' : undefined}
              >
                <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                <span className="text-[9px] font-bold">{item.label.split(' ')[0]}</span>
              </button>
            );
          })}
          
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="flex flex-col items-center justify-center w-full h-full gap-0.5 text-slate-400"
          >
            <Menu size={20} />
            <span className="text-[9px] font-bold">Menu</span>
          </button>
        </div>
      </nav>

      {/* ============================================ */}
      {/* MOBILE MENU OVERLAY */}
      {/* ============================================ */}
      {isMobileMenuOpen && (
        <>
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60]" onClick={() => setIsMobileMenuOpen(false)} />
          <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-900 rounded-t-3xl z-[70] p-6 max-h-[70vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">Menu</h2>
              <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">
                <X size={20} />
              </button>
            </div>
            
            <div className="space-y-2">
              {navItems.map((item) => {
                const isActive = location.pathname.startsWith(item.path);
                const Icon = item.icon;
                
                return (
                  <button
                    key={item.path}
                    onClick={() => { navigate(item.path); setIsMobileMenuOpen(false); }}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl ${
                      isActive ? 'bg-slate-100 dark:bg-slate-800' : ''
                    }`}
                  >
                    <Icon size={20} />
                    <span className="font-medium text-sm">{item.label}</span>
                  </button>
                );
              })}
              <hr className="border-slate-200 dark:border-slate-700 my-2" />
              <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-600">
                <LogOut size={20} /> Keluar Aplikasi
              </button>
            </div>
          </div>
        </>
      )}

      {/* ============================================ */}
      {/* QUICK ACTIONS FAB - FIXED POSITIONING */}
      {/* ============================================ */}
      <div className="hidden md:block">
        <QuickActions position="bottom-right" />
      </div>

      {/* ============================================ */}
      {/* SEARCH MODAL */}
      {/* ============================================ */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        recentSearches={recentSearches}
        onClearRecent={clearRecent}
        onSearch={addSearch}
      />
    </div>
  );
}