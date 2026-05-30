'use client';

import { createContext, useContext, useEffect, useMemo } from 'react';
import { useAppStore } from '@/store/app-store';
import type { Language } from '@/types';

interface LanguageContextValue {
  language: Language;
  isRTL: boolean;
  dir: 'rtl' | 'ltr';
}

const LanguageContext = createContext<LanguageContextValue>({
  language: 'ar',
  isRTL: true,
  dir: 'rtl',
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const language = useAppStore((s) => s.language);
  const isRTL = language === 'ar';
  const dir = isRTL ? 'rtl' : 'ltr';

  useEffect(() => {
    document.documentElement.dir = dir;
    document.documentElement.lang = language;
  }, [language, dir]);

  const value = useMemo(() => ({ language, isRTL, dir }), [language, isRTL, dir]);

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
