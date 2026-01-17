import { createContext, useContext, useState, useEffect } from 'react';

const IslamicModeContext = createContext();

export function IslamicModeProvider({ children }) {
  const [isIslamicMode, setIsIslamicMode] = useState(true);

  const toggleIslamicMode = () => setIsIslamicMode((prev) => !prev);

  return (
    <IslamicModeContext.Provider value={{ isIslamicMode, toggleIslamicMode }}>
      {children}
    </IslamicModeContext.Provider>
  );
}

export const useIslamicMode = () => useContext(IslamicModeContext);
