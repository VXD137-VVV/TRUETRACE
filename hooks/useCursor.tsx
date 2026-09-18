'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

export type CursorVariant = 'default' | 'button' | 'link' | 'card' | 'image' | 'text' | 'hidden';

interface CursorContextType {
  cursorVariant: CursorVariant;
  cursorText: string;
  setCursorVariant: (variant: CursorVariant, text?: string) => void;
  resetCursor: () => void;
  isEnabled: boolean;
  setIsEnabled: (enabled: boolean) => void;
}

const CursorContext = createContext<CursorContextType | undefined>(undefined);

export function CursorProvider({ children }: { children: ReactNode }) {
  const [cursorVariant, setCursorVariantState] = useState<CursorVariant>('default');
  const [cursorText, setCursorText] = useState<string>('');
  const [isEnabled, setIsEnabled] = useState<boolean>(true);

  const setCursorVariant = (variant: CursorVariant, text = '') => {
    setCursorVariantState(variant);
    setCursorText(text);
  };

  const resetCursor = () => {
    setCursorVariantState('default');
    setCursorText('');
  };

  return (
    <CursorContext.Provider
      value={{
        cursorVariant,
        cursorText,
        setCursorVariant,
        resetCursor,
        isEnabled,
        setIsEnabled,
      }}
    >
      {children}
    </CursorContext.Provider>
  );
}

export function useCursor() {
  const context = useContext(CursorContext);
  if (!context) {
    throw new Error('useCursor must be used within a CursorProvider');
  }
  return context;
}
