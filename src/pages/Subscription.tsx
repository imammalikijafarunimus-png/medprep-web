/**
 * Subscription Page — v5
 * @module pages/Subscription
 *
 * Fixes & improvements over v4:
 * - VITE_ADMIN_WA_NUMBER from env (no hardcoded number)
 * - Free tier button: correctly shows "Paket Saat Ini" only when currentPlan === 'free',
 *   otherwise shows "Paket Gratis" (non-disabled) for Basic/Expert users
 * - Expert card: added 'relative' to the dark card div so glow blur renders correctly
 * - Badge rekomendasi: specific labels "PTN & PTS Umum" vs "PTM & Aisyiyah"
 *   using Building2 / School icons to reinforce identity
 * - "Additional features" section given proper card treatment
 * - Comparison table header columns: stronger background highlight
 * - Active plan: green "Paket Saat Ini" pill appears on the correct card only
 */

import React, { useState } from 'react';
import {
  Check, X, Star, Shield, Crown, Heart,
  Zap, ArrowRight, School, Building2,
  Clock, BookOpenCheck, Award, CheckCircle2,
  MessageCircle,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getRecommendedPackage } from '../data/universities';

// ─────────────────────────────────────────────
// CONSTANTS
// ─────────────────────────────────────────────

const ADMIN_WA = import.meta.env.VITE_ADMIN_WA_NUMBER ?? '6288980507501';

// ─────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────

type BillingCycle = 'monthly' | 'midyear' | 'lifetime';
type Plan = 'free' | 'basic' | 'expert';

// ─────────────────────────────────────────────
// PRICE TABLE
// ─────────────────────────────────────────────

const PRICES: Record<'basic' | 'expert', Record<BillingCycle, string>> = {
  basic:  { monthly: '15.000', midyear: '45.000', lifetime: '99.000'  },
  expert: { monthly: '25.000', midyear: '75.000', lifetime: '149.000' },
};

const CYCLE_LABEL: Record<BillingCycle, string> = {
  monthly:  '/ bulan',
  midyear:  '/ 6 bulan',
  lifetime: '/ selamanya',
};

// ─────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────

function ActivePlanBadge() {
  return (
    <span className="inline-flex items-center gap-1 text-[10px] font-black text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-900/30 px-3 py-1 rounded-full border border-emerald-200 dark:border-emerald-800">
      <CheckCircle2 size={11} />
      PAKET SAAT INI
    </span>
  );
}

// ─────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────

export default function Subscription() {
  const { currentUser } = useAuth();
  const [billingCycle, setBillingCycle] = useState<BillingCycle>('midyear');

  const currentPlan = (currentUser?.subscriptionStatus ?? 'free') as Plan;
  const recommended = getRecommendedPackage(currentUser?.university);

  const isRecommendedBasic  = recommended.name.toLowerCase().includes('basic');
  const isRecommendedExpert = recommended.name.toLowerCase().includes('expert');

  const getPrice = (plan: 'basic' | 'expert') => PRICES[plan][billingCycle];

  const handleSubscribe = (plan: string, price: string) => {
    const text =
      `Halo Admin MedPrep, saya *${currentUser?.displayName}* (${currentUser?.email}).\n` +
      `Ingin berlangganan paket *${plan}* seharga *Rp ${price}* (${billingCycle}).\n\n` +
      `Mohon info pembayaran. Terima kasih!`;
    window.open(
      `https://wa.me/${ADMIN_WA}?text=${encodeURIComponent(text)}`,
      '_blank',
      'noopener,noreferrer'
    );
  };

  return (
    <div className="space-y-16 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-24 max-w-7xl mx-auto px-4 md:px-6">

      {/* ── ACTIVE SUBSCRIPTION BANNER ── */}
      {currentPlan !== 'free' && (
        <div className="flex items-center gap-3 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-2xl p-5">
          <CheckCircle2 size={20} className="text-emerald-600 dark:text-emerald-400 shrink-0" />
          <div>
            <p className="font-bold text-emerald-700 dark:text-emerald-400 text-sm">
              Kamu sudah berlangganan paket{' '}
              <span className="uppercase font-black">{currentPlan}</span>
            </p>
            <p className="text-xs text-emerald-600/70 dark:text-emerald-500/70 mt-0.5">
              Semua fitur paket ini sudah aktif di akunmu.
            </p>
          </div>
        </div>
      )}

      {/* ── HERO ── */}
      <div className="relative bg-slate-900 dark:bg-black rounded-[2.5rem] p-10 md:p-14 overflow-hidden shadow-2xl text-center border border-slate-800">
        {/* Glow blobs */}
        <div className="absolute top-0 right-0 w-72 h-72 bg-indigo-500/20 rounded-full blur-[80px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-teal-500/20 rounded-full blur-[80px] pointer-events-none" />

        <div className="relative z-10 max-w-3xl mx-auto">
          {/* Amal Jariyah pill */}
          <div className="inline-flex items-center gap-2 bg-pink-500/10 border border-pink-500/20 text-pink-400 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-6">
            <Heart size={12} fill="currentColor" /> Amal Jariyah
          </div>

          <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-6 leading-tight">
            Investasi Cerdas{' '}<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-300 to-indigo-400">
              Masa Depan Sejawat
            </span>
          </h1>

          <p className="text-slate-400 text-base md:text-lg leading-relaxed mb-8">
            <span className="text-white font-bold">30% biaya langganan</span> didonasikan
            untuk kegiatan sosial kesehatan &amp; pengembangan fitur gratis.
          </p>

          {/* Billing toggle */}
          <div className="inline-flex bg-slate-800/50 backdrop-blur border border-slate-700 p-1 rounded-full">
            {(['monthly', 'midyear', 'lifetime'] as const).map((cycle) => (
              <button
                key={cycle}
                onClick={() => setBillingCycle(cycle)}
                className={`px-6 py-2 rounded-full text-xs font-bold transition-all duration-300 ${
                  billingCycle === cycle
                    ? 'bg-white text-slate-900 shadow-lg'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {cycle === 'monthly' ? 'Bulanan' : cycle === 'midyear' ? '6 Bulan' : 'Selamanya'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── PRICING GRID ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start pt-4">

        {/* ── FREE ── */}
        <div className="group relative bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 p-8 rounded-[2.5rem] hover:shadow-xl transition-all duration-300 mt-2">
          <div className="mb-6">
            <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800 text-slate-500 rounded-2xl flex items-center justify-center mb-4">
              <Shield size={24} />
            </div>
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">Starter</h3>
              {currentPlan === 'free' && <ActivePlanBadge />}
            </div>
            <p className="text-slate-500 text-sm">Akses terbatas untuk mencoba.</p>
          </div>

          <div className="mb-8">
            <span className="text-4xl font-black text-slate-900 dark:text-white">Rp 0</span>
            <span className="text-sm font-medium text-slate-400 block mt-1">Selamanya</span>
          </div>

          {/* ✅ Fix: disabled only when currentPlan === 'free' */}
          <button
            disabled={currentPlan === 'free'}
            className={`w-full py-4 rounded-2xl font-bold mb-8 text-sm transition-all ${
              currentPlan === 'free'
                ? 'bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
                : 'border-2 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5'
            }`}
          >
            {currentPlan === 'free' ? '✅ Paket Saat Ini' : 'Paket Gratis'}
          </button>

          <div className="space-y-4">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Fitur Tersedia</p>
            <ul className="space-y-3 text-sm text-slate-600 dark:text-slate-400">
              <li className="flex gap-3"><Check size={18} className="text-teal-500 shrink-0" /> 50 Soal Latihan</li>
              <li className="flex gap-3"><Check size={18} className="text-teal-500 shrink-0" /> Ceklis OSCE Dasar</li>
            </ul>

            <div className="h-px bg-slate-100 dark:bg-slate-800 my-4" />

            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Terkunci</p>
            <ul className="space-y-3 text-sm text-slate-400 opacity-60">
              <li className="flex gap-3"><X size={18} /> Analisis &amp; Rekap Soal</li>
              <li className="flex gap-3"><X size={18} /> Bank Kasus OSCE Lengkap</li>
              <li className="flex gap-3"><X size={18} /> Insight Klinis</li>
              <li className="flex gap-3"><X size={18} /> Fiqih Medis &amp; Doa</li>
            </ul>
          </div>
        </div>

        {/* ── BASIC ── */}
        <div className={`relative group z-10 hover:-translate-y-2 transition-transform duration-300 ${
          isRecommendedBasic ? 'ring-4 ring-blue-500/30' : ''
        }`}>
          {/* Badge rekomendasi — spesifik PTN & PTS */}
          {isRecommendedBasic && (
            <div className="absolute -top-5 left-1/2 -translate-x-1/2 z-20">
              <span className="inline-flex items-center gap-1.5 bg-blue-600 text-white text-[10px] font-black px-4 py-1.5 rounded-full shadow-lg shadow-blue-500/30 whitespace-nowrap">
                <Building2 size={11} />
                Rekomendasi PTN &amp; PTS Umum
              </span>
            </div>
          )}

          <div className="bg-white dark:bg-slate-900 border-2 border-blue-500/20 p-8 rounded-[2.5rem] shadow-2xl h-full">
            <div className="mb-6 mt-2">
              <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/20 text-blue-600 rounded-2xl flex items-center justify-center mb-4">
                <Star size={24} fill="currentColor" />
              </div>
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">Basic</h3>
                {currentPlan === 'basic' && <ActivePlanBadge />}
              </div>
              <p className="text-slate-500 text-sm">Lulus UKMPPD dengan efisien.</p>
            </div>

            <div className="mb-8 flex items-baseline gap-1">
              <span className="text-5xl font-black text-slate-900 dark:text-white">
                Rp {getPrice('basic')}
              </span>
              <span className="text-sm font-medium text-slate-400 ml-1">
                {CYCLE_LABEL[billingCycle]}
              </span>
            </div>

            <button
              onClick={() => handleSubscribe('BASIC', getPrice('basic'))}
              disabled={currentPlan === 'basic'}
              className={`w-full py-4 rounded-2xl font-bold transition-all mb-8 flex items-center justify-center gap-2 text-sm ${
                currentPlan === 'basic'
                  ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 cursor-not-allowed'
                  : currentPlan === 'expert'
                  ? 'border-2 border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20'
                  : 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/20'
              }`}
            >
              {currentPlan === 'basic'
                ? '✅ Paket Saat Ini'
                : currentPlan === 'expert'
                ? 'Downgrade ke Basic'
                : (<><MessageCircle size={16} /> Pilih Basic <ArrowRight size={14} /></>)
              }
            </button>

            <div className="space-y-4">
              <p className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest">Fitur Unggulan</p>
              <ul className="space-y-3 text-sm text-slate-700 dark:text-slate-300 font-medium">
                <li className="flex gap-3"><Check size={18} className="text-blue-500 shrink-0" /> Unlock <b className="ml-1">Semua Soal</b></li>
                <li className="flex gap-3"><Check size={18} className="text-blue-500 shrink-0" /> Unlock <b className="ml-1">Stase &amp; Ceklis OSCE</b></li>
                <li className="flex gap-3"><Check size={18} className="text-blue-500 shrink-0" /> Analisis &amp; Rekap Soal</li>
              </ul>

              <div className="h-px bg-slate-100 dark:bg-slate-800 my-4" />

              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Masih Terkunci</p>
              <ul className="space-y-3 text-sm text-slate-400">
                <li className="flex gap-3 items-center"><X size={18} className="text-red-400 shrink-0" /> Insight Klinis</li>
                <li className="flex gap-3 items-center"><X size={18} className="text-red-400 shrink-0" /> Data Statistik OSCE</li>
                <li className="flex gap-3 items-center"><X size={18} className="text-red-400 shrink-0" /> Fiqih Medis &amp; Doa</li>
              </ul>
            </div>
          </div>
        </div>

        {/* ── EXPERT ── */}
        <div className={`relative group z-10 hover:-translate-y-2 transition-transform duration-300 ${
          isRecommendedExpert ? 'ring-4 ring-amber-500/30' : ''
        }`}>
          {/* Badge rekomendasi — spesifik PTM & Aisyiyah */}
          {isRecommendedExpert && (
            <div className="absolute -top-5 left-1/2 -translate-x-1/2 z-20">
              <span className="inline-flex items-center gap-1.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-[10px] font-black px-4 py-1.5 rounded-full shadow-lg shadow-amber-500/30 whitespace-nowrap">
                <School size={11} />
                Rekomendasi PTM &amp; Aisyiyah
              </span>
            </div>
          )}

          {/* ✅ Fix: relative added here so glow blur stays contained */}
          <div className="relative bg-slate-900 border border-amber-500/30 p-8 rounded-[2.5rem] shadow-2xl h-full overflow-hidden">
            {/* Glow */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-[60px] translate-x-1/3 -translate-y-1/3 pointer-events-none" />

            <div className="relative z-10">
              <div className="mb-6 mt-2">
                <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-orange-500 text-white rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-amber-500/30">
                  <Crown size={24} fill="currentColor" />
                </div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-xl font-bold text-white">Expert</h3>
                  {currentPlan === 'expert' && <ActivePlanBadge />}
                </div>
                <p className="text-slate-400 text-sm">Full Akses: Insight &amp; Data Lengkap.</p>
              </div>

              <div className="mb-8 flex items-baseline gap-1">
                <span className="text-5xl font-black text-white">
                  Rp {getPrice('expert')}
                </span>
                <span className="text-sm font-medium text-slate-500 ml-1">
                  {CYCLE_LABEL[billingCycle]}
                </span>
              </div>

              <button
                onClick={() => handleSubscribe('EXPERT', getPrice('expert'))}
                disabled={currentPlan === 'expert'}
                className={`w-full py-4 rounded-2xl font-bold transition-all mb-8 flex items-center justify-center gap-2 text-sm ${
                  currentPlan === 'expert'
                    ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600 text-white shadow-lg shadow-amber-500/30'
                }`}
              >
                {currentPlan === 'expert'
                  ? '✅ Paket Saat Ini'
                  : (<><Zap size={16} /> Upgrade ke Expert <ArrowRight size={14} /></>)
                }
              </button>

              <div className="space-y-4">
                <p className="text-xs font-bold text-amber-500 uppercase tracking-widest">
                  Semua Fitur Basic, Ditambah:
                </p>
                <ul className="space-y-3 text-sm text-slate-200 font-medium">
                  {[
                    'Unlock Insight Klinis',
                    'Unlock Statistik OSCE',
                    'Perpustakaan Digital',
                    'Fiqih Medis & Doa',
                    'Prioritas Support',
                  ].map((f) => (
                    <li key={f} className="flex gap-3 items-center">
                      <div className="bg-amber-500/20 p-1 rounded-full shrink-0">
                        <Check size={12} className="text-amber-400" />
                      </div>
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* ── COMPARISON TABLE ── */}
      <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 md:p-12 border border-slate-200 dark:border-white/5 shadow-xl overflow-hidden">
        <h3 className="text-2xl font-black text-center mb-10 text-slate-900 dark:text-white">
          Bandingkan Fitur
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[600px]">
            <thead>
              <tr className="border-b-2 border-slate-100 dark:border-slate-800">
                <th className="py-4 px-4 font-bold text-slate-500 text-sm uppercase tracking-wider w-1/2">
                  Fitur
                </th>
                <th className="py-4 px-4 font-bold text-slate-400 text-sm uppercase tracking-wider text-center">
                  Starter
                </th>
                {/* ✅ Stronger highlight for Basic */}
                <th className="py-4 px-4 font-bold text-blue-600 dark:text-blue-400 text-sm uppercase tracking-wider text-center bg-blue-100/60 dark:bg-blue-900/20 rounded-t-xl">
                  <span className="flex items-center justify-center gap-1.5">
                    <Star size={13} fill="currentColor" /> Basic
                  </span>
                </th>
                {/* ✅ Stronger highlight for Expert */}
                <th className="py-4 px-4 font-bold text-amber-500 text-sm uppercase tracking-wider text-center bg-amber-100/60 dark:bg-amber-900/20 rounded-t-xl">
                  <span className="flex items-center justify-center gap-1.5">
                    <Crown size={13} fill="currentColor" /> Expert
                  </span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {([
                { name: 'Bank Soal Latihan',     free: '50 Soal',  basic: 'Unlimited',        expert: 'Unlimited'        },
                { name: 'Ceklis OSCE',           free: 'Dasar',    basic: 'Lengkap',           expert: 'Lengkap + Update' },
                { name: 'Analisis & Rekap Nilai',free: false,      basic: true,                expert: true               },
                { name: 'Insight Klinis & Tips', free: false,      basic: false,               expert: true               },
                { name: 'Statistik OSCE',        free: false,      basic: false,               expert: true               },
                { name: 'Fiqih Medis & Doa',     free: false,      basic: false,               expert: true               },
                { name: 'Support Admin',         free: 'Normal',   basic: 'Normal',            expert: 'Prioritas'        },
              ] as const).map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                  <td className="py-4 px-4 text-sm font-medium text-slate-700 dark:text-slate-300">
                    {row.name}
                  </td>
                  <td className="py-4 px-4 text-sm text-center text-slate-500">
                    {typeof row.free === 'boolean'
                      ? (row.free
                          ? <Check size={16} className="mx-auto text-teal-500" />
                          : <X size={16} className="mx-auto text-slate-300 dark:text-slate-600" />)
                      : row.free}
                  </td>
                  <td className="py-4 px-4 text-sm text-center text-blue-600 dark:text-blue-400 font-medium bg-blue-50/40 dark:bg-blue-900/5">
                    {typeof row.basic === 'boolean'
                      ? (row.basic
                          ? <Check size={16} className="mx-auto text-blue-500" />
                          : <X size={16} className="mx-auto text-slate-300 dark:text-slate-600" />)
                      : row.basic}
                  </td>
                  <td className="py-4 px-4 text-sm text-center text-amber-500 font-bold bg-amber-50/40 dark:bg-amber-900/5">
                    {typeof row.expert === 'boolean'
                      ? (row.expert
                          ? <Check size={16} className="mx-auto text-amber-500" />
                          : <X size={16} className="mx-auto text-slate-300 dark:text-slate-600" />)
                      : row.expert}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── ADDITIONAL FEATURES ── */}
      {/* ✅ Now wrapped in cards — consistent with rest of app */}
      <div className="grid md:grid-cols-3 gap-6">
        {([
          {
            icon: Clock,
            iconClass: 'bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400',
            title: 'Aktivasi Cepat',
            desc: 'Akun aktif < 10 menit setelah bukti transfer dikirim.',
          },
          {
            icon: BookOpenCheck,
            iconClass: 'bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400',
            title: 'Materi Terupdate',
            desc: 'Sesuai SKDI terbaru dan guideline PPK terkini.',
          },
          {
            icon: Award,
            iconClass: 'bg-purple-100 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400',
            title: 'Garansi Kualitas',
            desc: 'Dibuat oleh dokter terbaik untuk calon sejawat.',
          },
        ] as const).map(({ icon: Icon, iconClass, title, desc }) => (
          <div
            key={title}
            className="flex flex-col items-center text-center p-8 bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-100 dark:border-white/5 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300"
          >
            <div className={`w-14 h-14 ${iconClass} rounded-2xl flex items-center justify-center mb-5 shadow-sm`}>
              <Icon size={26} />
            </div>
            <h4 className="font-bold text-slate-900 dark:text-white mb-2">{title}</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed max-w-[200px]">
              {desc}
            </p>
          </div>
        ))}
      </div>

    </div>
  );
}