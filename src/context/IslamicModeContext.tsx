// src/context/IslamicModeContext.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext'; // 1. Import useAuth untuk cek status user

// 1. Definisi Tipe Data
interface IslamicModeContextType {
  isIslamicMode: boolean;
  toggleIslamicMode: () => boolean; // Mengembalikan true jika berhasil, false jika ditolak
  isLocked: boolean; // Status kunci (true = free user)
}

const IslamicModeContext = createContext<IslamicModeContextType | undefined>(undefined);

// 2. Custom Hook
export function useIslamicMode() {
  const context = useContext(IslamicModeContext);
  if (context === undefined) {
    throw new Error('useIslamicMode must be used within an IslamicModeProvider');
  }
  return context;
}

// 3. Provider Component
export function IslamicModeProvider({ children }: { children: ReactNode }) {
  const { currentUser } = useAuth(); // Ambil data user dari AuthContext
  const [isIslamicMode, setIsIslamicMode] = useState(false);

  // Cek apakah user premium (jika tidak, berarti terkunci)
  const isLocked = currentUser?.subscriptionStatus !== 'premium';

  // 4. Logika "Auto Off" & Sinkronisasi
  useEffect(() => {
    // Jika user bukan premium (free) DAN fitur sedang menyala, paksa mati.
    if (isLocked && isIslamicMode) {
      setIsIslamicMode(false);
    }
  }, [isLocked, isIslamicMode]);

  // 5. Fungsi Toggle dengan Proteksi
  const toggleIslamicMode = (): boolean => {
    // Jika terkunci, jangan ubah state, kembalikan false (tanda ditolak)
    if (isLocked) {
      return false; 
    }

    // Jika premium, boleh toggle
    setIsIslamicMode(prev => !prev);
    return true;
  };

  return (
    <IslamicModeContext.Provider value={{ isIslamicMode, toggleIslamicMode, isLocked }}>
      {children}
    </IslamicModeContext.Provider>
  );
}