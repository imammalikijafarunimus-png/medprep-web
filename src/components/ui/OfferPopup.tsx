/**
 * OfferPopup Component — v3
 * @module components/ui/OfferPopup
 *
 * Bug fixes over v2:
 * - "Jangan tampilkan lagi" saves to localStorage IMMEDIATELY on checkbox
 *   change, not deferred to any close handler — eliminates every race condition.
 * - useOfferPopup lazy-initializes and double-checks isDismissed() right before
 *   showing (covers the delay window + multi-tab dismiss edge case).
 * - isDismissed() helper used consistently on all code paths.
 *
 * UI redesign:
 * - Gradient illustration header with floating decorations
 * - Compact split price block
 * - Clean feature list with colored check badges
 * - "Jangan tampilkan" moved to footer row next to trust badges
 */

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { createPortal } from 'react-dom';
import {
  X,
  Sparkles,
  Check,
  MessageCircle,
  ArrowRight,
  Shield,
  Zap,
  Clock,
  Star,
  Gift,
  ChevronRight,
  Crown,
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { isMuhammadiyahUniversity } from '../../data/universities';

// ─────────────────────────────────────────────
// CONSTANTS
// ─────────────────────────────────────────────

const ADMIN_WA = import.meta.env.VITE_ADMIN_WA_NUMBER ?? '6288980507501';
const DISMISSED_KEY = 'medprep_offer_dismissed';
const COUNTDOWN_SECONDS = 30 * 60;

// ─────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────

const isDismissed = (): boolean =>
  typeof window !== 'undefined' &&
  localStorage.getItem(DISMISSED_KEY) === 'true';

const setDismissed = (): void =>
  localStorage.setItem(DISMISSED_KEY, 'true');

const clearDismissed = (): void =>
  localStorage.removeItem(DISMISSED_KEY);

function lockBodyScroll(): () => void {
  const w = window.innerWidth - document.documentElement.clientWidth;
  document.body.style.paddingRight = `${w}px`;
  document.body.style.overflow = 'hidden';
  return () => {
    document.body.style.paddingRight = '';
    document.body.style.overflow = '';
  };
}

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

interface PackageConfig {
  name: string;
  price: string;
  originalPrice: string;
  period: string;
  badge: string;
  tagline: string;
  features: string[];
  headerFrom: string;
  headerTo: string;
  bgFrom: string;
  bgTo: string;
  checkClass: string;
  btnClass: string;
}

// ─────────────────────────────────────────────
// PACKAGE CONFIGS
// ─────────────────────────────────────────────

const PACKAGE_CONFIG: Record<OfferVariant, PackageConfig> = {
  muhammadiyah: {
    name: 'Muhammadiyah Special Pack',
    price: '75.000',
    originalPrice: '159.000',
    period: '6 bulan',
    badge: 'KHUSUS PTM · HEMAT 53%',
    tagline: 'Paket eksklusif mahasiswa PTM — lengkap dengan Insight Islami.',
    features: [
      '3.000+ soal UKMPPD terkini',
      'Insight Islami & Fiqih Medis',
      'OSCE Checklist interaktif',
      'Analisis performa real-time',
      'Jadwal Sholat terintegrasi',
      'Support prioritas WhatsApp',
    ],
    headerFrom: 'from-amber-500',
    headerTo: 'to-orange-500',
    bgFrom: 'from-amber-50',
    bgTo: 'to-orange-50',
    checkClass:
      'text-amber-600 bg-amber-100 dark:bg-amber-900/30 dark:text-amber-400',
    btnClass:
      'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 shadow-orange-400/40 focus:ring-amber-500',
  },
  general: {
    name: 'Pro Pack',
    price: '45.000',
    originalPrice: '99.000',
    period: '6 bulan',
    badge: 'TERLARIS · HEMAT 55%',
    tagline: 'Semua yang kamu butuhkan untuk lulus UKMPPD One Shot.',
    features: [
      '3.000+ soal UKMPPD terkini',
      'OSCE Checklist interaktif',
      'Analisis performa real-time',
      'Bookmark & Progress sync',
      'Flashcard pintar adaptif',
      'Support via WhatsApp',
    ],
    headerFrom: 'from-violet-600',
    headerTo: 'to-indigo-600',
    bgFrom: 'from-violet-50',
    bgTo: 'to-indigo-50',
    checkClass:
      'text-violet-600 bg-violet-100 dark:bg-violet-900/30 dark:text-violet-400',
    btnClass:
      'bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 shadow-violet-500/40 focus:ring-violet-500',
  },
};

// ─────────────────────────────────────────────
// FOCUS TRAP
// ─────────────────────────────────────────────

const FOCUSABLE =
  'a[href],button:not([disabled]),textarea,input,select,[tabindex]:not([tabindex="-1"])';

function useFocusTrap(
  ref: React.RefObject<HTMLElement | null>,
  active: boolean
) {
  useEffect(() => {
    if (!active || !ref.current) return;
    const root = ref.current as HTMLElement;
    root.querySelector<HTMLElement>(FOCUSABLE)?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;
      const els = [...root.querySelectorAll<HTMLElement>(FOCUSABLE)].filter(
        (n) => !n.closest('[hidden]')
      );
      if (!els.length) return;
      const first = els[0];
      const last = els[els.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [active, ref]);
}

// ─────────────────────────────────────────────
// COUNTDOWN
// ─────────────────────────────────────────────

function useCountdown(active: boolean, initial: number) {
  const [s, setS] = useState(initial);
  useEffect(() => {
    if (!active) return;
    setS(initial);
    const id = setInterval(() => setS((v) => Math.max(0, v - 1)), 1000);
    return () => clearInterval(id);
  }, [active, initial]);
  return {
    display: `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`,
    urgent: s < 300,
    expired: s === 0,
  };
}

// ─────────────────────────────────────────────
// DECORATIVE STAR
// ─────────────────────────────────────────────

function Dot({ className, delay = 0 }: { className?: string; delay?: number }) {
  return (
    <Star
      size={8}
      fill="currentColor"
      className={cn('absolute animate-pulse opacity-50', className)}
      style={{ animationDelay: `${delay}ms` }}
    />
  );
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
  const [in_, setIn] = useState(false);
  const [doNotShow, setDoNotShow] = useState(isDismissed);
  const ref = useRef<HTMLDivElement>(null);
  const cfg = PACKAGE_CONFIG[variant];
  const { display: timer, urgent, expired } = useCountdown(isOpen, COUNTDOWN_SECONDS);
  const TITLE_ID = 'offer-title';

  useEffect(() => {
    if (isOpen) {
      const t = setTimeout(() => setIn(true), 40);
      return () => clearTimeout(t);
    }
    setIn(false);
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const fn = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', fn);
    return () => document.removeEventListener('keydown', fn);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!isOpen) return;
    return lockBodyScroll();
  }, [isOpen]);

  useFocusTrap(ref, isOpen && in_);

  // ── Save/clear dismissed immediately on checkbox toggle ──
  const onCheckbox = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked;
    setDoNotShow(checked);
    if (checked) setDismissed();
    else clearDismissed();
  }, []);

  if (!isOpen) return null;

  const close = () => onClose();

  const handleWhatsApp = () => {
    if (onWhatsApp) {
      onWhatsApp();
    } else {
      const msg = `Halo Admin, saya ${userName} dari ${university}.\nMau ambil paket *${cfg.name}* (Rp ${cfg.price}/${cfg.period}).`;
      window.open(
        `https://wa.me/${ADMIN_WA}?text=${encodeURIComponent(msg)}`,
        '_blank',
        'noopener,noreferrer'
      );
    }
    close();
  };

  const handleViewPackages = () => { onViewPackages?.(); close(); };

  return createPortal(
    <>
      {/* Backdrop */}
      <div
        className={cn(
          'fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm transition-opacity duration-300',
          in_ ? 'opacity-100' : 'opacity-0'
        )}
        onClick={close}
        aria-hidden="true"
      />

      {/* Dialog wrapper */}
      <div className="fixed inset-0 z-[101] flex items-end sm:items-center justify-center p-0 sm:p-4 pointer-events-none">
        <div
          ref={ref}
          role="dialog"
          aria-modal="true"
          aria-labelledby={TITLE_ID}
          className={cn(
            'pointer-events-auto',
            'w-full sm:max-w-[460px]',
            'max-h-[92vh] overflow-y-auto',
            'bg-white dark:bg-slate-900',
            'rounded-t-[2rem] sm:rounded-[2rem]',
            'shadow-2xl shadow-black/30',
            'transition-all duration-300 ease-out',
            in_
              ? 'translate-y-0 sm:scale-100 opacity-100'
              : 'translate-y-6 sm:translate-y-0 sm:scale-95 opacity-0'
          )}
          onClick={(e) => e.stopPropagation()}
        >
          {/* ─── HEADER ─── */}
          <div
            className={cn(
              'relative h-44 overflow-hidden',
              'rounded-t-[2rem]',
              `bg-gradient-to-br ${cfg.headerFrom} ${cfg.headerTo}`
            )}
          >
            {/* Glow */}
            <div className="absolute -top-16 -right-16 w-56 h-56 bg-white/10 rounded-full blur-3xl" />
            <div className="absolute -bottom-12 -left-12 w-44 h-44 bg-black/10 rounded-full blur-2xl" />

            {/* Floating dots */}
            <Dot className="top-7 left-10 text-white"      delay={0}   />
            <Dot className="top-16 left-28 text-white"     delay={300} />
            <Dot className="top-6 right-24 text-white"     delay={150} />
            <Dot className="top-20 right-10 text-white"    delay={500} />
            <Dot className="bottom-8 left-16 text-white"   delay={700} />

            {/* Close */}
            <button
              onClick={close}
              className="absolute top-4 right-4 z-10 w-8 h-8 flex items-center justify-center bg-black/20 hover:bg-black/35 backdrop-blur-sm rounded-full text-white transition-colors focus:outline-none focus:ring-2 focus:ring-white/50"
              aria-label="Tutup"
            >
              <X size={15} />
            </button>

            {/* Badge */}
            <div className="absolute top-4 left-4">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-black/20 backdrop-blur-sm rounded-full text-white text-[10px] font-black uppercase tracking-widest">
                <Gift size={11} />
                {cfg.badge}
              </span>
            </div>

            {/* Illustration */}
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2.5">
              <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center shadow-xl ring-1 ring-white/30">
                <Crown size={30} className="text-white" />
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1 bg-black/20 backdrop-blur-sm rounded-full">
                <span className="text-white/90 text-[11px] font-semibold">{university}</span>
              </div>
            </div>

            {/* Timer */}
            <div className="absolute bottom-3 right-4">
              <span
                className={cn(
                  'inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black backdrop-blur-sm',
                  expired  ? 'bg-red-600/80 text-white' :
                  urgent   ? 'bg-yellow-400/90 text-yellow-900 animate-pulse' :
                             'bg-black/25 text-white'
                )}
              >
                <Clock size={10} />
                {expired ? 'HABIS' : timer}
              </span>
            </div>
          </div>

          {/* ─── BODY ─── */}
          <div className="px-6 pt-5 pb-6 space-y-5">

            {/* Title */}
            <div>
              <h2
                id={TITLE_ID}
                className="text-[1.3rem] font-black text-slate-900 dark:text-white leading-tight"
              >
                {cfg.name}
              </h2>
              <p className="text-[13px] text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                {cfg.tagline}
              </p>
            </div>

            {/* Price block */}
            <div
              className={cn(
                'rounded-2xl p-4',
                'bg-gradient-to-br',
                cfg.bgFrom,
                cfg.bgTo,
                'dark:bg-none dark:bg-slate-800/50',
                'border border-white dark:border-white/5'
              )}
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-[2rem] font-black text-slate-900 dark:text-white leading-none">
                      Rp {cfg.price}
                    </span>
                    <span className="text-sm text-slate-400 line-through">
                      {cfg.originalPrice}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    per {cfg.period} · akses penuh
                  </p>
                </div>
                <div className="flex flex-col items-center justify-center bg-emerald-500 text-white rounded-xl px-3 py-2 shadow-md shadow-emerald-500/30">
                  <Sparkles size={14} />
                  <span className="text-[10px] font-black mt-0.5">PROMO</span>
                </div>
              </div>
            </div>

            {/* Features */}
            <ul className="grid grid-cols-1 gap-2" aria-label="Yang kamu dapatkan">
              {cfg.features.map((f) => (
                <li key={f} className="flex items-center gap-3">
                  <span
                    className={cn(
                      'w-5 h-5 rounded-full flex items-center justify-center shrink-0',
                      cfg.checkClass
                    )}
                    aria-hidden="true"
                  >
                    <Check size={11} strokeWidth={3} />
                  </span>
                  <span className="text-sm text-slate-700 dark:text-slate-300 font-medium">
                    {f}
                  </span>
                </li>
              ))}
            </ul>

            {/* CTAs */}
            <div className="space-y-2.5">
              <button
                onClick={handleWhatsApp}
                className={cn(
                  'w-full py-3.5 rounded-2xl font-black text-sm text-white',
                  'flex items-center justify-center gap-2',
                  'transition-all active:scale-[0.98] shadow-lg',
                  'focus:outline-none focus:ring-2 focus:ring-offset-2',
                  cfg.btnClass
                )}
              >
                <MessageCircle size={17} aria-hidden="true" />
                Ambil via WhatsApp
                <ArrowRight size={15} aria-hidden="true" />
              </button>

              <button
                onClick={handleViewPackages}
                className="w-full py-3 rounded-2xl font-semibold text-sm flex items-center justify-center gap-1.5 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-300"
              >
                Lihat Semua Paket
                <ChevronRight size={15} aria-hidden="true" />
              </button>
            </div>

            {/* Footer — trust badges */}
            <div className="flex items-center justify-center gap-4 pt-3 border-t border-slate-100 dark:border-white/5">
              {([
                { Icon: Shield,  label: 'Aman & Terpercaya' },
                { Icon: Clock,   label: 'Akses Instan'      },
                { Icon: Zap,     label: 'Respon Cepat'      },
              ] as const).map(({ Icon, label }) => (
                <div key={label} className="flex items-center gap-1 text-[10px] text-slate-400 font-medium">
                  <Icon size={11} aria-hidden="true" />
                  {label}
                </div>
              ))}
            </div>

            {/* Don't show again */}
            <label className="flex items-center justify-center gap-1.5 cursor-pointer group -mt-2">
              <input
                type="checkbox"
                checked={doNotShow}
                onChange={onCheckbox}
                className="w-3.5 h-3.5 rounded accent-slate-500 cursor-pointer"
                aria-label="Jangan tampilkan penawaran ini lagi"
              />
              <span className="text-[10px] text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300 transition-colors select-none">
                Jangan tampilkan lagi
              </span>
            </label>
          </div>
        </div>
      </div>
    </>,
    document.body
  );
}

// ─────────────────────────────────────────────
// HOOK
// ─────────────────────────────────────────────

export interface UseOfferPopupOptions {
  university?: string;
  subscriptionStatus?: string;
  delay?: number;
}

export function useOfferPopup({
  university,
  subscriptionStatus,
  delay = 1500,
}: UseOfferPopupOptions) {
  // Start as false always; effect below controls when to show.
  const [showOffer, setShowOffer] = useState(false);

  const variant: OfferVariant = isMuhammadiyahUniversity(university)
    ? 'muhammadiyah'
    : 'general';

  useEffect(() => {
    if (subscriptionStatus !== 'free') return;

    // Re-check on every effect run (mount + dependency changes)
    if (isDismissed()) return;

    const timer = setTimeout(() => {
      // Second check: covers multi-tab dismiss during the delay window
      if (!isDismissed()) setShowOffer(true);
    }, delay);

    return () => clearTimeout(timer);
  }, [subscriptionStatus, delay]);

  const openOffer = useCallback(() => {
    if (!isDismissed()) setShowOffer(true);
  }, []);

  const closeOffer = useCallback(() => setShowOffer(false), []);

  return { showOffer, openOffer, closeOffer, variant };
}

export default OfferPopup;