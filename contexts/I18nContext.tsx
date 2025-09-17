
import React, { createContext, useState, useContext, useEffect, useMemo } from 'react';
import { translations, Locale } from '../lib/translations';

type TranslationKey = keyof typeof translations.en;

type TranslationFunction = (key: TranslationKey, ...args: any[]) => string;

interface I18nContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: TranslationFunction;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export const I18nProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [locale, setLocaleState] = useState<Locale>('en');

  useEffect(() => {
    const savedLocale = localStorage.getItem('locale') as Locale;
    if (savedLocale && translations[savedLocale]) {
      setLocaleState(savedLocale);
    } else {
        const browserLang = navigator.language.split('-')[0];
        if (browserLang === 'vi') {
            setLocaleState('vi');
        }
    }
  }, []);

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
    localStorage.setItem('locale', newLocale);
  };

  const t = useMemo((): TranslationFunction => (key, ...args) => {
    const template = translations[locale][key] || translations.en[key];
    if (typeof template === 'function') {
      return (template as (...args: any[]) => string)(...args);
    }
    return template as string;
  }, [locale]);
  
  const value = { locale, setLocale, t };

  return (
    <I18nContext.Provider value={value}>
      {children}
    </I18nContext.Provider>
  );
};

export const useI18n = (): I18nContextType => {
  const context = useContext(I18nContext);
  if (context === undefined) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return context;
};
