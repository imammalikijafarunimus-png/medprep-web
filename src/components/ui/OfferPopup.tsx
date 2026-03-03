/**
 * OfferPopup Component
 * @module components/ui/OfferPopup
 * 
 * Top-tier upgrade popup with:
 * - Different variants for Muhammadiyah vs General users
 * - Mobile-first responsive design
 * - Smooth animations
 * - WhatsApp integration
 */

import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { X, Crown, Sparkles, Check, MessageCircle, ArrowRight, Shield, Zap, BookOpen, Clock } from 'lucide-react';
import { cn } from '../../lib/utils';

// ===============================
// TYPES
// ===============================

export type OfferVariant = 'muhammadiyah' | 'general';

interface OfferPopupProps {
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

// ===============================
// PACKAGE CONFIGS
// ===============================

const PACKAGE_CONFIG: Record<OfferVariant, PackageInfo> = {
  muhammadiyah: {
    name: "Muhammadiyah Special Pack",
    price: "129.000",
    originalPrice: "199.000",
    badge: "KHUSUS PTM",
    description: "Paket eksklusif untuk mahasiswa Perguruan Tinggi Muhammadiyah",
    features: [
      "Full akses 3000+ soal UKMPPD",
      "Insight Islami & Jadwal Sholat",
      "OSCE & Flashcard lengkap",
      "Analisis performa real-time",
      "Support prioritas via WhatsApp",
    ],
    highlight: "Hemat 35% untuk PTM",
    gradient: "from-amber-500 via-orange-500 to-red-500",
    iconBg: "bg-gradient-to-br from-amber-400 to-orange-500",
  },
  general: {
    name: "Pro Pack",
    price: "99.000",
    originalPrice: "149.000",
    badge: "TERLARIS",
    description: "Akses lengkap semua fitur premium MedPrep",
    features: [
      "Full akses 3000+ soal UKMPPD",
      "OSCE & Flashcard lengkap",
      "Analisis performa real-time",
      "Bookmark & Progress sync",
      "Support via WhatsApp",
    ],
    highlight: "Penawaran Terbaik",
    gradient: "from-indigo-500 via-purple-500 to-pink-500",
    iconBg: "bg-gradient-to-br from-indigo-400 to-purple-500",
  },
};

// ===============================
// COMPONENT
// ===============================

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
  const config = PACKAGE_CONFIG[variant];

  useEffect(() => {
    if (isOpen) {
      // Small delay for animation
      const timer = setTimeout(() => setAnimateIn(true), 50);
      return () => clearTimeout(timer);
    } else {
      setAnimateIn(false);
    }
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleWhatsApp = () => {
    if (onWhatsApp) {
      onWhatsApp();
    } else {
      const adminPhone = "6285786456321";
      const text = `Halo Admin, saya ${userName} dari ${university}.\nMau ambil paket *${config.name}* (Rp ${config.price}).`;
      window.open(`https://wa.me/${adminPhone}?text=${encodeURIComponent(text)}`, '_blank');
    }
    onClose();
  };

  const handleViewPackages = () => {
    if (onViewPackages) onViewPackages();
    onClose();
  };

  return createPortal(
    <div
      className={cn(
        "fixed inset-0 z-[100] flex items-end sm:items-center justify-center",
        "bg-black/60 backdrop-blur-sm",
        "transition-opacity duration-300",
        animateIn ? "opacity-100" : "opacity-0"
      )}
      onClick={onClose}
    >
      {/* Modal Container */}
      <div
        className={cn(
          "w-full sm:max-w-[400px] max-h-[90vh] overflow-y-auto",
          "bg-white dark:bg-slate-900",
          "sm:rounded-3xl rounded-t-3xl",
          "shadow-2xl",
          "transition-all duration-300 ease-out",
          animateIn 
            ? "translate-y-0 sm:scale-100 opacity-100" 
            : "translate-y-full sm:translate-y-0 sm:scale-95 opacity-0"
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Gradient Header */}
        <div className={cn("relative h-32 overflow-hidden", `bg-gradient-to-br ${config.gradient}`)}>
          {/* Decorative circles */}
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/20 rounded-full blur-2xl" />
          <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-white/10 rounded-full blur-xl" />
          
          {/* Badge */}
          <div className="absolute top-4 left-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/20 backdrop-blur-md rounded-full text-white text-[10px] font-bold uppercase tracking-wider">
              <Shield size={12} />
              {config.badge}
            </span>
          </div>
          
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-white/30 transition-colors"
            aria-label="Tutup"
          >
            <X size={16} />
          </button>
          
          {/* Crown Icon */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2">
            <div className={cn(
              "w-20 h-20 rounded-2xl flex items-center justify-center shadow-xl",
              config.iconBg
            )}>
              <Crown size={36} className="text-white" />
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="pt-14 px-5 pb-6">
          {/* University Tag */}
          <div className="text-center mb-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded-full text-xs font-medium text-slate-600 dark:text-slate-300">
              <BookOpen size={12} />
              {university}
            </span>
          </div>

          {/* Title & Description */}
          <div className="text-center mb-5">
            <h2 className="text-xl font-black text-slate-900 dark:text-white mb-2">
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
                <span className="text-sm text-slate-400 line-through">
                  Rp {config.originalPrice}
                </span>
              )}
              <span className="text-3xl font-black text-slate-900 dark:text-white">
                Rp {config.price}
              </span>
            </div>
            <span className="text-xs text-slate-400 block mt-1">/ 6 bulan akses penuh</span>
          </div>

          {/* Highlight Badge */}
          <div className="flex justify-center mb-5">
            <span className={cn(
              "inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold",
              variant === 'muhammadiyah' 
                ? "bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400"
                : "bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400"
            )}>
              <Sparkles size={14} />
              {config.highlight}
            </span>
          </div>

          {/* Features */}
          <div className="space-y-2.5 mb-6">
            {config.features.map((feature, index) => (
              <div key={index} className="flex items-start gap-3">
                <div className={cn(
                  "w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5",
                  variant === 'muhammadiyah' ? "bg-amber-100 text-amber-600" : "bg-indigo-100 text-indigo-600"
                )}>
                  <Check size={12} />
                </div>
                <span className="text-sm text-slate-600 dark:text-slate-300">{feature}</span>
              </div>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="space-y-3">
            <button
              onClick={handleWhatsApp}
              className={cn(
                "w-full py-3.5 rounded-2xl font-bold text-sm",
                "flex items-center justify-center gap-2",
                "transition-all active:scale-[0.98]",
                "shadow-lg",
                variant === 'muhammadiyah'
                  ? "bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-orange-500/30"
                  : "bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white shadow-purple-500/30"
              )}
            >
              <MessageCircle size={18} />
              Ambil via WhatsApp
              <ArrowRight size={16} />
            </button>

            <button
              onClick={handleViewPackages}
              className="w-full py-3 rounded-2xl font-semibold text-sm border-2 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-slate-700 dark:text-slate-300"
            >
              Lihat Semua Paket
            </button>
          </div>

          {/* Trust Badges */}
          <div className="flex items-center justify-center gap-4 mt-5 pt-4 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-1 text-[10px] text-slate-400">
              <Shield size={12} />
              Aman & Terpercaya
            </div>
            <div className="flex items-center gap-1 text-[10px] text-slate-400">
              <Clock size={12} />
              Akses Instan
            </div>
            <div className="flex items-center gap-1 text-[10px] text-slate-400">
              <Zap size={12} />
              Respon Cepat
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}

// ===============================
// HOOK FOR OFFER POPUP
// ===============================

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
  const { isMuhammadiyahUniversity } = require('../../data/universities');
  
  const variant: OfferVariant = isMuhammadiyahUniversity(university) ? 'muhammadiyah' : 'general';

  useEffect(() => {
    if (subscriptionStatus === 'free') {
      const timer = setTimeout(() => setShowOffer(true), delay);
      return () => clearTimeout(timer);
    }
  }, [subscriptionStatus, delay]);

  const openOffer = () => setShowOffer(true);
  const closeOffer = () => setShowOffer(false);

  return {
    showOffer,
    openOffer,
    closeOffer,
    variant,
  };
}

export default OfferPopup;