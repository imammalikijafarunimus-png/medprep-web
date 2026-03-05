/**
 * OfferPopup Component — v2
 * @module components/ui/OfferPopup
 *
 * Improvements over v1:
 * - role="dialog" + aria-modal + aria-labelledby for full accessibility
 * - Focus trap: Tab key is trapped inside modal while open
 * - Admin WA number sourced from VITE_ADMIN_WA_NUMBER env variable
 * - "Jangan tampilkan lagi" checkbox with localStorage persistence
 * - useOfferPopup hook respects the "dismissed" flag before showing
 * - Body overflow lock with scrollbar-width compensation (no layout shift)
 * - Countdown urgency timer to boost conversion
 */

import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import {
  X,
  Crown,
  Sparkles,
  Check,
  MessageCircle,
  ArrowRight,
  Shield,
  Zap,
  BookOpen,
  Clock,
  Timer,
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { isMuhammadiyahUniversity } from '../../data/universities';

// ─────────────────────────────────────────────
// CONSTANTS
// ─────────────────────────────────────────────

const ADMIN_WA =
  import.meta.env.VITE_ADMIN_WA_NUMBER ?? '6288980507501';

/** localStorage key used for "don't show again" */
const DISMISSED_KEY = 'medprep_offer_dismissed';

/** Countdown duration in seconds */
const COUNTDOWN_SECONDS = 30 * 60; // 30 minutes

// ─────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────

export type OfferVariant = 'muhammadiyah' | 'general';

export interface OfferPopupProps {
  isOpen: boolean;
  onClose: () => void;
  variant: OfferVariant;
  university?: string;
  userName?: string;
  onWhatsApp?: () => void;
  onViewPackages?: () => void;
}

interface PackageInfo {
  name: string;
  price: string;
  originalPrice?: string;
  badge: string;
  description: string;
  features: string[];
  highlight: string;
  gradient: string;
  iconBg: string;
}

// ─────────────────────────────────────────────
// PACKAGE CONFIGS
// ─────────────────────────────────────────────

const PACKAGE_CONFIG: Record<OfferVariant, PackageInfo> = {
  muhammadiyah: {
    name: 'Muhammadiyah Special Pack',
    price: '75.000',
    originalPrice: '159.000',
    badge: 'KHUSUS PTM',
    description: 'Paket eksklusif untuk mahasiswa Perguruan Tinggi Muhammadiyah',
    features: [
      'Full akses 3000+ soal UKMPPD',
      'Insight Islami & Jadwal Sholat',
      'OSCE & Flashcard lengkap',
      'Analisis performa real-time',
      'Support prioritas via WhatsApp',
    ],
    highlight: 'Hemat 35% untuk PTM',
    gradient: 'from-amber-500 via-orange-500 to-red-500',
    iconBg: 'bg-gradient-to-br from-amber-400 to-orange-500',
  },
  general: {
    name: 'Pro Pack',
    price: '45.000',
    originalPrice: '99.000',
    badge: 'TERLARIS',
    description: 'Akses lengkap semua fitur premium MedPrep',
    features: [
      'Full akses 3000+ soal UKMPPD',
      'OSCE & Flashcard lengkap',
      'Analisis performa real-time',
      'Bookmark & Progress sync',
      'Support via WhatsApp',
    ],
    highlight: 'Penawaran Terbaik',
    gradient: 'from-indigo-500 via-purple-500 to-pink-500',
    iconBg: 'bg-gradient-to-br from-indigo-400 to-purple-500',
  },
};

// ─────────────────────────────────────────────
// FOCUS TRAP HOOK
// ─────────────────────────────────────────────

const FOCUSABLE_SELECTORS =
  'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])';

function useFocusTrap(
  containerRef: React.RefObject<HTMLElement | null>,
  isActive: boolean
) {
  useEffect(() => {
    if (!isActive || !containerRef.current) return;

    const container = containerRef.current as HTMLElement;

    // Move focus into the modal on open
    const firstFocusable = container.querySelector<HTMLElement>(FOCUSABLE_SELECTORS);
    firstFocusable?.focus();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      const focusables = Array.from(
        container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTORS)
      ).filter((el) => !el.closest('[hidden]'));

      if (focusables.length === 0) return;

      const first = focusables[0];
      const last = focusables[focusables.length - 1];

      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isActive, containerRef]);
}

// ─────────────────────────────────────────────
// COUNTDOWN HOOK
// ─────────────────────────────────────────────

function useCountdown(isActive: boolean, initialSeconds: number) {
  const [seconds, setSeconds] = useState(initialSeconds);

  useEffect(() => {
    if (!isActive) return;
    setSeconds(initialSeconds); // reset on each open
    const interval = setInterval(() => {
      setSeconds((s) => Math.max(0, s - 1));
    }, 1000);
    return () => clearInterval(interval);
  }, [isActive, initialSeconds]);

  const mm = String(Math.floor(seconds / 60)).padStart(2, '0');
  const ss = String(seconds % 60).padStart(2, '0');
  return { display: `${mm}:${ss}`, isExpired: seconds === 0 };
}

// ─────────────────────────────────────────────
// BODY LOCK HELPER
// ─────────────────────────────────────────────

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
// COMPONENT
// ─────────────────────────────────────────────

export function OfferPopup({
  isOpen,
  onClose,
  variant,
  university = 'Kampus Anda',
  userName = 'Sejawat',
  onWhatsApp,
  onViewPackages,
}: OfferPopupProps) {
  const [animateIn, setAnimateIn] = useState(false);
  const [doNotShow, setDoNotShow] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const titleId = 'offer-popup-title';

  const config = PACKAGE_CONFIG[variant];
  const { display: countdown, isExpired } = useCountdown(isOpen, COUNTDOWN_SECONDS);

  // ── Animation in/out ──
  useEffect(() => {
    if (isOpen) {
      const t = setTimeout(() => setAnimateIn(true), 50);
      return () => clearTimeout(t);
    } else {
      setAnimateIn(false);
    }
  }, [isOpen]);

  // ── Escape key ──
  useEffect(() => {
    if (!isOpen) return;
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  // ── Body scroll lock ──
  useEffect(() => {
    if (!isOpen) return;
    return lockBodyScroll();
  }, [isOpen]);

  // ── Focus trap ──
  useFocusTrap(containerRef, isOpen && animateIn);

  if (!isOpen) return null;

  // ── Handlers ──
  const handleClose = () => {
    if (doNotShow) {
      localStorage.setItem(DISMISSED_KEY, 'true');
    }
    onClose();
  };

  const handleWhatsApp = () => {
    if (onWhatsApp) {
      onWhatsApp();
    } else {
      const text = `Halo Admin, saya ${userName} dari ${university}.\nMau ambil paket *${config.name}* (Rp ${config.price}).`;
      window.open(
        `https://wa.me/${ADMIN_WA}?text=${encodeURIComponent(text)}`,
        '_blank',
        'noopener,noreferrer'
      );
    }
    if (doNotShow) localStorage.setItem(DISMISSED_KEY, 'true');
    onClose();
  };

  const handleViewPackages = () => {
    onViewPackages?.();
    if (doNotShow) localStorage.setItem(DISMISSED_KEY, 'true');
    onClose();
  };

  const isMuhammadiyah = variant === 'muhammadiyah';

  return createPortal(
    <div
      className={cn(
        'fixed inset-0 z-[100] flex items-end sm:items-center justify-center',
        'bg-black/60 backdrop-blur-sm',
        'transition-opacity duration-300',
        animateIn ? 'opacity-100' : 'opacity-0'
      )}
      onClick={handleClose}
      aria-hidden="true"
    >
      {/* ── Modal container ── */}
      <div
        ref={containerRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className={cn(
          'w-full sm:max-w-[400px] max-h-[90vh] overflow-y-auto',
          'bg-white dark:bg-slate-900',
          'sm:rounded-3xl rounded-t-3xl',
          'shadow-2xl',
          'transition-all duration-300 ease-out',
          animateIn
            ? 'translate-y-0 sm:scale-100 opacity-100'
            : 'translate-y-full sm:translate-y-0 sm:scale-95 opacity-0'
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {/* ── Gradient header ── */}
        <div
          className={cn('relative h-32 overflow-hidden', `bg-gradient-to-br ${config.gradient}`)}
          aria-hidden="true"
        >
          {/* Decorative blobs */}
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/20 rounded-full blur-2xl" />
          <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-white/10 rounded-full blur-xl" />

          {/* Badge */}
          <div className="absolute top-4 left-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/20 backdrop-blur-md rounded-full text-white text-[10px] font-bold uppercase tracking-wider">
              <Shield size={12} />
              {config.badge}
            </span>
          </div>

          {/* Countdown */}
          <div className="absolute top-4 right-12">
            <span
              className={cn(
                'inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black backdrop-blur-md',
                isExpired
                  ? 'bg-red-500/40 text-white'
                  : 'bg-white/20 text-white'
              )}
            >
              <Timer size={11} />
              {isExpired ? 'KEDALUWARSA' : countdown}
            </span>
          </div>

          {/* Close button */}
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-white/30 transition-colors focus:outline-none focus:ring-2 focus:ring-white"
            aria-label="Tutup penawaran"
          >
            <X size={16} />
          </button>

          {/* Crown icon */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2">
            <div
              className={cn(
                'w-20 h-20 rounded-2xl flex items-center justify-center shadow-xl',
                config.iconBg
              )}
            >
              <Crown size={36} className="text-white" aria-hidden="true" />
            </div>
          </div>
        </div>

        {/* ── Content ── */}
        <div className="pt-14 px-5 pb-6">
          {/* University tag */}
          <div className="text-center mb-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded-full text-xs font-medium text-slate-600 dark:text-slate-300">
              <BookOpen size={12} aria-hidden="true" />
              {university}
            </span>
          </div>

          {/* Title */}
          <div className="text-center mb-5">
            <h2
              id={titleId}
              className="text-xl font-black text-slate-900 dark:text-white mb-2"
            >
              {config.name}
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              {config.description}
            </p>
          </div>

          {/* Price */}
          <div className="text-center mb-5">
            <div className="inline-flex items-baseline gap-2">
              {config.originalPrice && (
                <span className="text-sm text-slate-400 line-through" aria-label={`Harga normal Rp ${config.originalPrice}`}>
                  Rp {config.originalPrice}
                </span>
              )}
              <span
                className="text-3xl font-black text-slate-900 dark:text-white"
                aria-label={`Harga promo Rp ${config.price}`}
              >
                Rp {config.price}
              </span>
            </div>
            <span className="text-xs text-slate-400 block mt-1">/ 6 bulan akses penuh</span>
          </div>

          {/* Highlight badge */}
          <div className="flex justify-center mb-5">
            <span
              className={cn(
                'inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold',
                isMuhammadiyah
                  ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400'
                  : 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400'
              )}
            >
              <Sparkles size={14} aria-hidden="true" />
              {config.highlight}
            </span>
          </div>

          {/* Features list */}
          <ul className="space-y-2.5 mb-6" aria-label="Fitur yang didapatkan">
            {config.features.map((feature) => (
              <li key={feature} className="flex items-start gap-3">
                <div
                  className={cn(
                    'w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5',
                    isMuhammadiyah
                      ? 'bg-amber-100 text-amber-600'
                      : 'bg-indigo-100 text-indigo-600'
                  )}
                  aria-hidden="true"
                >
                  <Check size={12} />
                </div>
                <span className="text-sm text-slate-600 dark:text-slate-300">{feature}</span>
              </li>
            ))}
          </ul>

          {/* CTA buttons */}
          <div className="space-y-3">
            <button
              onClick={handleWhatsApp}
              className={cn(
                'w-full py-3.5 rounded-2xl font-bold text-sm',
                'flex items-center justify-center gap-2',
                'transition-all active:scale-[0.98]',
                'shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2',
                isMuhammadiyah
                  ? 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-orange-500/30 focus:ring-amber-500'
                  : 'bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white shadow-purple-500/30 focus:ring-indigo-500'
              )}
            >
              <MessageCircle size={18} aria-hidden="true" />
              Ambil via WhatsApp
              <ArrowRight size={16} aria-hidden="true" />
            </button>

            <button
              onClick={handleViewPackages}
              className="w-full py-3 rounded-2xl font-semibold text-sm border-2 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-400"
            >
              Lihat Semua Paket
            </button>
          </div>

          {/* "Don't show again" checkbox */}
          <label className="flex items-center justify-center gap-2 mt-4 cursor-pointer group">
            <input
              type="checkbox"
              checked={doNotShow}
              onChange={(e) => setDoNotShow(e.target.checked)}
              className="w-3.5 h-3.5 rounded accent-slate-500 cursor-pointer"
            />
            <span className="text-[11px] text-slate-400 group-hover:text-slate-500 dark:group-hover:text-slate-300 transition-colors">
              Jangan tampilkan lagi
            </span>
          </label>

          {/* Trust badges */}
          <div
            className="flex items-center justify-center gap-4 mt-5 pt-4 border-t border-slate-100 dark:border-slate-800"
            aria-label="Keunggulan layanan"
          >
            {[
              { icon: Shield, label: 'Aman & Terpercaya' },
              { icon: Clock,  label: 'Akses Instan'      },
              { icon: Zap,    label: 'Respon Cepat'      },
            ].map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-1 text-[10px] text-slate-400">
                <Icon size={12} aria-hidden="true" />
                {label}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}

// ─────────────────────────────────────────────
// HOOK
// ─────────────────────────────────────────────

interface UseOfferPopupOptions {
  university?: string;
  subscriptionStatus?: string;
  delay?: number;
}

export function useOfferPopup({
  university,
  subscriptionStatus,
  delay = 1500,
}: UseOfferPopupOptions) {
  const [showOffer, setShowOffer] = useState(false);

  const variant: OfferVariant = isMuhammadiyahUniversity(university)
    ? 'muhammadiyah'
    : 'general';

  useEffect(() => {
    if (subscriptionStatus !== 'free') return;

    // Respect "don't show again" preference
    const dismissed = localStorage.getItem(DISMISSED_KEY) === 'true';
    if (dismissed) return;

    const timer = setTimeout(() => setShowOffer(true), delay);
    return () => clearTimeout(timer);
  }, [subscriptionStatus, delay]);

  const openOffer  = () => setShowOffer(true);
  const closeOffer = () => setShowOffer(false);

  return { showOffer, openOffer, closeOffer, variant };
}

export default OfferPopup;