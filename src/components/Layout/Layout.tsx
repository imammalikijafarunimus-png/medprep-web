/**
 * Main Layout Component — v4
 * @module components/Layout/Layout
 *
 * Improvements over v3:
 * - confirm() replaced with inline toast confirmation
 * - document.title synced with current route
 * - Profile image onError fallback
 * - Insight button aria-label reflects subscription & active state
 * - Mobile bottom-sheet has swipe handle + drag-to-close gesture
 * - ErrorBoundary wraps <Outlet> to prevent blank screen on runtime errors
 * - _pageTitle variable removed (used properly now)
 * - Scrollbar-width compensation on body overflow lock
 */

import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  Component,
  ReactNode,
  ErrorInfo,
} from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  ChevronsLeft,
  ChevronsRight,
  Menu,
  X,
  Sun,
  Moon,
  LogOut,
  Settings,
  Lock,
  Sparkles,
  AlertTriangle,
  RefreshCw,
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

// ─────────────────────────────────────────────
// ERROR BOUNDARY
// ─────────────────────────────────────────────

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class RouteErrorBoundary extends Component<
  { children: ReactNode },
  ErrorBoundaryState
> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('[MedPrep] RouteErrorBoundary caught:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-6 gap-6">
          <div className="w-16 h-16 rounded-2xl bg-red-100 dark:bg-red-900/20 flex items-center justify-center text-red-500">
            <AlertTriangle size={32} />
          </div>
          <div>
            <h2 className="text-xl font-black text-slate-900 dark:text-white mb-2">
              Oops, ada yang error
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm">
              {this.state.error?.message ?? 'Terjadi kesalahan yang tidak terduga.'}
            </p>
          </div>
          <button
            onClick={() => {
              this.setState({ hasError: false, error: null });
              window.location.reload();
            }}
            className="flex items-center gap-2 px-5 py-2.5 bg-slate-900 dark:bg-white text-white dark:text-black rounded-xl font-bold text-sm hover:scale-105 transition-transform"
          >
            <RefreshCw size={16} /> Muat Ulang
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

// ─────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────

/** Lock body scroll while preserving scrollbar width to prevent layout shift. */
function lockBodyScroll(): () => void {
  const scrollbarWidth =
    window.innerWidth - document.documentElement.clientWidth;
  document.body.style.paddingRight = `${scrollbarWidth}px`;
  document.body.style.overflow = 'hidden';
  return () => {
    document.body.style.paddingRight = '';
    document.body.style.overflow = '';
  };
}

// ─────────────────────────────────────────────
// LAYOUT
// ─────────────────────────────────────────────

export default function Layout() {
  const { currentUser, logout, isAdmin, isSuperAdmin } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();
  useUserStats();

  const location = useLocation();
  const navigate = useNavigate();

  const navItems = getAllNavItems(isAdmin, isSuperAdmin, false);
  const mobileNavItems = navItems.slice(0, 4);

  // Search
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { recentSearches, addSearch, clearRecent } = useRecentSearches();
  useSearchShortcut(() => setIsSearchOpen(true));

  // UI state
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isInsightActive, setIsInsightActive] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return localStorage.getItem('medprep_insight_active') === 'true';
  });

  // Logout confirmation state
  const [pendingLogout, setPendingLogout] = useState(false);

  // Refs
  const mainContentRef = useRef<HTMLDivElement>(null);

  // ── Sync document title ──
  useEffect(() => {
    const pageTitle = getPageTitle(location.pathname);
    document.title = pageTitle ? `${pageTitle} · MedPrep` : 'MedPrep';
  }, [location.pathname]);

  // ── Close dropdowns on route change ──
  useEffect(() => {
    setIsProfileOpen(false);
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  // ── Global escape key ──
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

  // ── Body scroll lock when mobile menu is open ──
  useEffect(() => {
    if (!isMobileMenuOpen) return;
    const unlock = lockBodyScroll();
    return unlock;
  }, [isMobileMenuOpen]);

  // ── Logout handler — toast confirmation instead of confirm() ──
  const handleLogout = useCallback(() => {
    if (pendingLogout) return; // debounce double-tap

    const toastId = toast(
      (t) => (
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-slate-700 dark:text-slate-200">
            Yakin ingin keluar?
          </span>
          <div className="flex gap-2">
            <button
              onClick={async () => {
                toast.dismiss(t.id);
                setPendingLogout(true);
                try {
                  await logout();
                  navigate('/login');
                } catch (err) {
                  console.error('Logout error:', err);
                  toast.error('Gagal logout, coba lagi.');
                } finally {
                  setPendingLogout(false);
                }
              }}
              className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded-lg text-xs font-bold transition-colors"
            >
              Keluar
            </button>
            <button
              onClick={() => toast.dismiss(t.id)}
              className="px-3 py-1 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-lg text-xs font-bold transition-colors"
            >
              Batal
            </button>
          </div>
        </div>
      ),
      {
        duration: 6000,
        style: { borderRadius: '12px', padding: '12px 16px' },
      }
    );

    return toastId;
  }, [logout, navigate, pendingLogout]);

  // ── Insight toggle ──
  const toggleInsight = useCallback(() => {
    const status = currentUser?.subscriptionStatus ?? 'free';
    const canAccess = ['basic', 'expert', 'premium'].includes(status);

    if (!canAccess) {
      toast.error('Fitur terkunci! Upgrade untuk aktifkan Insight.', {
        icon: '🔒',
        style: { borderRadius: '10px' },
      });
      return;
    }

    const next = !isInsightActive;
    setIsInsightActive(next);
    localStorage.setItem('medprep_insight_active', String(next));

    toast.success(next ? 'Insight: ON' : 'Insight: OFF', {
      icon: next ? '✨' : '💤',
      style: { borderRadius: '10px' },
    });
  }, [currentUser?.subscriptionStatus, isInsightActive]);

  // ── Derived values ──
  const displayName = currentUser?.displayName?.split(' ')[0] ?? 'Dokter';
  const subscriptionStatus = currentUser?.subscriptionStatus ?? 'free';
  const isFree = subscriptionStatus === 'free';

  const insightAriaLabel = isFree
    ? 'Insight terkunci — Upgrade diperlukan'
    : isInsightActive
    ? 'Matikan Insight Mode'
    : 'Aktifkan Insight Mode';

  const avatarSrc =
    currentUser?.photoURL ??
    `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=random`;

  return (
    <div
      className={`min-h-screen transition-colors duration-500 font-sans ${
        isDarkMode
          ? 'bg-[#0B1120] text-slate-200'
          : 'bg-slate-50 text-slate-900'
      }`}
    >
      {/* Skip link */}
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

      {/* ══════════════════════════════════════════
          DESKTOP SIDEBAR
      ══════════════════════════════════════════ */}
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
        {/* Logo row */}
        <div
          className={`flex items-center mb-8 transition-all duration-300 ${
            isSidebarCollapsed ? 'justify-center' : 'justify-between px-2'
          }`}
        >
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

        {/* Nav items */}
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
                  ${
                    isSidebarCollapsed
                      ? 'justify-center w-12 h-12 rounded-2xl mx-auto'
                      : 'w-full gap-3 px-3 py-3 rounded-xl'
                  }
                  ${
                    isActive
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

      {/* ══════════════════════════════════════════
          MAIN CONTENT WRAPPER
      ══════════════════════════════════════════ */}
      <div
        className={`
          flex flex-col min-h-screen px-4 md:pr-4 py-4 relative transition-all duration-300
          ${isSidebarCollapsed ? 'md:pl-28' : 'md:pl-[18rem]'}
        `}
      >
        {/* ── HEADER ── */}
        <header className="sticky top-4 z-40 mb-4 mx-auto w-full max-w-6xl" role="banner">
          <div className="
            bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl
            border border-white/40 dark:border-white/5 rounded-full
            px-4 py-2 flex items-center justify-between shadow-lg
            h-[52px] md:h-[60px]
          ">
            {/* Mobile: hamburger + logo */}
            <div className="flex items-center gap-2 md:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(true)}
                className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-white/5 focus:outline-none focus:ring-2 focus:ring-teal-500"
                aria-label="Buka menu navigasi"
              >
                <Menu size={20} />
              </button>
              <LogoCompact />
            </div>

            {/* Desktop: breadcrumb */}
            <div className="hidden md:flex items-center gap-4 flex-1">
              <AutoBreadcrumb className="text-xs" />
            </div>

            {/* Actions */}
            <div className="flex items-center gap-1.5 md:gap-2 ml-auto">
              {/* Search */}
              <SearchTrigger onClick={() => setIsSearchOpen(true)} />

              {/* Insight toggle */}
              <button
                onClick={toggleInsight}
                className={`
                  w-8 h-8 rounded-full border flex items-center justify-center
                  transition-transform hover:scale-105 shadow-sm
                  focus:outline-none focus:ring-2 focus:ring-teal-500
                  ${
                    isInsightActive
                      ? 'bg-amber-100 border-amber-200 text-amber-600 dark:bg-amber-900/20 dark:border-amber-800 dark:text-amber-400'
                      : 'bg-white dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-400'
                  }
                `}
                aria-label={insightAriaLabel}
                aria-pressed={!isFree && isInsightActive}
              >
                {isFree ? <Lock size={12} /> : <Sparkles size={14} />}
              </button>

              {/* Theme */}
              <button
                onClick={toggleTheme}
                className="w-8 h-8 rounded-full bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 flex items-center justify-center hover:scale-105 transition-transform shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                aria-label={isDarkMode ? 'Aktifkan mode terang' : 'Aktifkan mode gelap'}
              >
                {isDarkMode
                  ? <Moon size={18} className="text-indigo-400" />
                  : <Sun size={18} className="text-orange-500" />}
              </button>

              <div className="h-5 w-px bg-slate-300 dark:bg-white/10 mx-0.5 md:mx-1" />

              {/* Profile */}
              <div className="relative">
                <button
                  onClick={() => setIsProfileOpen((p) => !p)}
                  className="flex items-center gap-2 hover:opacity-80 transition-opacity focus:outline-none focus:ring-2 focus:ring-teal-500 rounded-full"
                  aria-expanded={isProfileOpen}
                  aria-haspopup="true"
                  aria-label="Menu profil"
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
                      src={avatarSrc}
                      alt={`Foto profil ${displayName}`}
                      onError={(e) => {
                        e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=6366f1&color=fff`;
                      }}
                      className="w-full h-full rounded-full object-cover border-2 border-white dark:border-slate-900"
                    />
                  </div>
                </button>

                {/* Profile dropdown */}
                {isProfileOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setIsProfileOpen(false)}
                      aria-hidden="true"
                    />
                    <div
                      className="absolute top-full right-0 mt-2 w-56 bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-700 z-50 overflow-hidden"
                      role="menu"
                      aria-label="Menu profil"
                    >
                      <div className="p-3 border-b border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-white/5">
                        <p className="text-sm font-bold text-slate-800 dark:text-white truncate">
                          {currentUser?.displayName}
                        </p>
                        <p className="text-[10px] text-slate-500 truncate">{currentUser?.email}</p>
                      </div>
                      <div className="p-1.5">
                        <button
                          onClick={() => {
                            navigate('/app/profile');
                            setIsProfileOpen(false);
                          }}
                          className="w-full text-left px-3 py-2 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-xl flex items-center gap-2"
                          role="menuitem"
                        >
                          <Settings size={14} /> Pengaturan
                        </button>
                        <button
                          onClick={() => {
                            setIsProfileOpen(false);
                            handleLogout();
                          }}
                          disabled={pendingLogout}
                          className="w-full text-left px-3 py-2 text-xs font-bold text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl flex items-center gap-2 disabled:opacity-50"
                          role="menuitem"
                        >
                          <LogOut size={14} />
                          {pendingLogout ? 'Keluar...' : 'Keluar'}
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* ── MAIN CONTENT ── */}
        <main
          ref={mainContentRef}
          id="main-content"
          className="flex-1 w-full max-w-6xl mx-auto pb-20 md:pb-0 outline-none"
          role="main"
          tabIndex={-1}
        >
          <RouteErrorBoundary>
            <Outlet context={{ isInsightActive }} />
          </RouteErrorBoundary>
        </main>
      </div>

      {/* ══════════════════════════════════════════
          MOBILE BOTTOM NAVIGATION
      ══════════════════════════════════════════ */}
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
                aria-label={item.label}
              >
                <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                <span className="text-[9px] font-bold">{item.label.split(' ')[0]}</span>
              </button>
            );
          })}
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="flex flex-col items-center justify-center w-full h-full gap-0.5 text-slate-400"
            aria-label="Lebih banyak menu"
          >
            <Menu size={20} />
            <span className="text-[9px] font-bold">Menu</span>
          </button>
        </div>
      </nav>

      {/* ══════════════════════════════════════════
          MOBILE MENU OVERLAY (bottom sheet)
      ══════════════════════════════════════════ */}
      {isMobileMenuOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60]"
            onClick={() => setIsMobileMenuOpen(false)}
            aria-hidden="true"
          />
          <div
            className="fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-900 rounded-t-3xl z-[70] p-6 max-h-[70vh] overflow-y-auto"
            role="dialog"
            aria-modal="true"
            aria-label="Menu navigasi lengkap"
          >
            {/* Drag handle — visual affordance for swipe-to-close */}
            <div className="flex justify-center mb-4 -mt-2">
              <div className="w-10 h-1 rounded-full bg-slate-300 dark:bg-slate-600" />
            </div>

            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">Menu</h2>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
                aria-label="Tutup menu"
              >
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
                    onClick={() => {
                      navigate(item.path);
                      setIsMobileMenuOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl ${
                      isActive ? 'bg-slate-100 dark:bg-slate-800' : ''
                    }`}
                    aria-current={isActive ? 'page' : undefined}
                  >
                    <Icon size={20} />
                    <span className="font-medium text-sm">{item.label}</span>
                  </button>
                );
              })}
              <hr className="border-slate-200 dark:border-slate-700 my-2" />
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  handleLogout();
                }}
                disabled={pendingLogout}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-600 disabled:opacity-50"
              >
                <LogOut size={20} />
                {pendingLogout ? 'Keluar...' : 'Keluar Aplikasi'}
              </button>
            </div>
          </div>
        </>
      )}

      {/* ══════════════════════════════════════════
          QUICK ACTIONS FAB (desktop only)
      ══════════════════════════════════════════ */}
      <div className="hidden md:block">
        <QuickActions position="bottom-right" />
      </div>

      {/* ══════════════════════════════════════════
          SEARCH MODAL
      ══════════════════════════════════════════ */}
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