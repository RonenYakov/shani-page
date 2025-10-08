import React, { useState, useEffect, createContext, useContext } from 'react';
import { translations } from './translations';

export type Language = 'he' | 'en';

interface I18nContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string | string[];
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

interface I18nProviderProps {
  children: React.ReactNode;
}

export const I18nProvider: React.FC<I18nProviderProps> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>('he');

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    if (typeof window !== 'undefined') {
      localStorage.setItem('language', lang);
      document.documentElement.dir = lang === 'he' ? 'rtl' : 'ltr';
      document.documentElement.lang = lang;
    }
  };

  const t = (key: string): string | string[] => {
    const base: any = translations[language];
    // Try nested lookup first (e.g., faq.title → base.faq.title)
    const keys = key.split('.');
    let nested: any = base;
    for (const k of keys) {
      nested = nested?.[k];
      if (nested === undefined) break;
    }
    if (nested !== undefined) return nested;

    // Fallback to flat key lookup (e.g., "faq.title" as a single key)
    const flat = base?.[key];
    return flat !== undefined ? flat : key;
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('language');
      if (saved && (saved === 'he' || saved === 'en')) {
        setLanguageState(saved as Language);
      }
      document.documentElement.dir = language === 'he' ? 'rtl' : 'ltr';
      document.documentElement.lang = language;
    }
  }, [language]);

  return (
    <I18nContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </I18nContext.Provider>
  );
};

export const useI18n = () => {
  const context = useContext(I18nContext);
  if (context === undefined) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return context;
};
