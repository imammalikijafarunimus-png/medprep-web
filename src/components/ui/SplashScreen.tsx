/**
 * SplashScreen Component
 * @module components/ui/SplashScreen
 *
 * Ditampilkan saat app pertama kali dimuat (Firebase init, auth check, dll).
 * Auto-dismiss setelah `minDuration` ms agar tidak langsung hilang
 * jika loading selesai terlalu cepat (mencegah flash).
 */

import React, { useEffect, useState } from 'react';

interface SplashScreenProps {
  /** Set false saat app sudah siap (Firebase resolved, auth checked, dll) */
  isReady: boolean;
  /** Durasi minimum splash ditampilkan dalam ms — default 1200 */
  minDuration?: number;
  children: React.ReactNode;
}

const MESSAGES = [
  'Mempersiapkan pengalaman belajar terbaik untuk Anda…',
  'Menyiapkan bank soal UKMPPD…',
  'Mengaktifkan mode belajar cerdas…',
];

export default function SplashScreen({
  isReady,
  minDuration = 1200,
  children,
}: SplashScreenProps) {
  const [minPassed, setMinPassed] = useState(false);
  const [fadeOut, setFadeOut]     = useState(false);
  const [hidden, setHidden]       = useState(false);
  const [msgIndex, setMsgIndex]   = useState(0);

  // ── Minimum duration timer ──
  useEffect(() => {
    const t = setTimeout(() => setMinPassed(true), minDuration);
    return () => clearTimeout(t);
  }, [minDuration]);

  // ── Cycle messages every 1.8s ──
  useEffect(() => {
    const t = setInterval(
      () => setMsgIndex((i) => (i + 1) % MESSAGES.length),
      1800
    );
    return () => clearInterval(t);
  }, []);

  // ── Start fade-out when both conditions met ──
  useEffect(() => {
    if (!isReady || !minPassed) return;
    setFadeOut(true);
    const t = setTimeout(() => setHidden(true), 600); // match CSS duration
    return () => clearTimeout(t);
  }, [isReady, minPassed]);

  if (hidden) return <>{children}</>;

  return (
    <>
      {/* Render children underneath so they mount early */}
      <div className="sr-only" aria-hidden="true">{children}</div>

      {/* Splash overlay */}
      <div
        className={`
          fixed inset-0 z-[9999] flex flex-col items-center justify-center
          bg-slate-50 dark:bg-[#050505]
          transition-opacity duration-600 ease-in-out
          ${fadeOut ? 'opacity-0 pointer-events-none' : 'opacity-100'}
        `}
        role="status"
        aria-label="Memuat aplikasi"
        aria-live="polite"
      >
        {/* Ambient blobs — matches LandingPage */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-teal-400/20 dark:bg-teal-500/10 rounded-full blur-[120px] animate-pulse" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-indigo-400/20 dark:bg-indigo-500/10 rounded-full blur-[120px] animate-pulse delay-700" />
        </div>

        <div className="relative z-10 flex flex-col items-center gap-8 px-6 text-center max-w-sm">

          {/* Logo mark */}
          <div className="relative">
            <div className="w-20 h-20 bg-gradient-to-br from-indigo-600 to-teal-500 rounded-[1.5rem] flex items-center justify-center text-white font-black text-4xl shadow-2xl shadow-teal-500/30">
              M
            </div>
            {/* Ping ring */}
            <span className="absolute inset-0 rounded-[1.5rem] border-2 border-teal-500/40 animate-ping" />
          </div>

          {/* Wordmark */}
          <div>
            <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
              MedPrep
            </h1>
            <p className="text-xs font-bold text-teal-600 dark:text-teal-400 uppercase tracking-widest mt-1">
              Medical OS v1.0
            </p>
          </div>

          {/* Animated dots loader */}
          <div className="flex items-center gap-1.5" aria-hidden="true">
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                className="w-2 h-2 rounded-full bg-teal-500 dark:bg-teal-400 animate-bounce"
                style={{ animationDelay: `${i * 150}ms` }}
              />
            ))}
          </div>

          {/* Rotating message */}
          <p
            key={msgIndex}
            className="text-sm text-slate-500 dark:text-slate-400 font-medium leading-relaxed animate-in fade-in duration-500"
          >
            {MESSAGES[msgIndex]}
          </p>
        </div>
      </div>
    </>
  );
}