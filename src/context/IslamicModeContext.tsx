import React, { createContext, useContext, useState, ReactNode } from 'react';

// 1. Definisi Tipe Data untuk Context
interface IslamicModeContextType {
  isIslamicMode: boolean;
  toggleIslamicMode: () => void;
}

// 2. Buat Context (Awalnya undefined)
const IslamicModeContext = createContext<IslamicModeContextType | undefined>(undefined);

// 3. Custom Hook (INI YANG HILANG SEBELUMNYA)
// Pastikan ada kata 'export' di depan function
export function useIslamicMode() {
  const context = useContext(IslamicModeContext);
  if (context === undefined) {
    throw new Error('useIslamicMode must be used within an IslamicModeProvider');
  }
  return context;
}

// 4. Provider Component
export function IslamicModeProvider({ children }: { children: ReactNode }) {
  // State default false (Mode standar)
  const [isIslamicMode, setIsIslamicMode] = useState(false);

  const toggleIslamicMode = () => {
    setIsIslamicMode(prev => !prev);
  };

  return (
    <IslamicModeContext.Provider value={{ isIslamicMode, toggleIslamicMode }}>
      {children}
    </IslamicModeContext.Provider>
  );
}