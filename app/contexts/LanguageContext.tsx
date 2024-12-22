import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import i18n from '~/i18n';

type LanguageContextProps = {
  language: 'en' | 'ku' | 'ar';
  rtl: boolean;
  setLanguage: (lang: 'en' | 'ku' | 'ar') => void;
};

const LanguageContext = createContext<LanguageContextProps | undefined>(
  undefined,
);

const LANGUAGE_STORAGE_KEY = 'preferredLanguage';

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<'en' | 'ku' | 'ar' | null>(null);

  useEffect(() => {
    const savedLanguage = localStorage.getItem(LANGUAGE_STORAGE_KEY) as 'en' | 'ku' | 'ar';
    const initialLanguage = savedLanguage || 'en';
    setLanguage(initialLanguage);
    i18n.changeLanguage(initialLanguage);
  }, []);

  const handleSetLanguage = (lang: 'en' | 'ku' | 'ar') => {
    setLanguage(lang);
    localStorage.setItem(LANGUAGE_STORAGE_KEY, lang);
    i18n.changeLanguage(lang);
  };

  const rtl = language === 'ar' || language === 'ku';

  if (language === null) {
    return null;
  }

  return (
    <LanguageContext.Provider value={{ language, rtl, setLanguage: handleSetLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }

  return context;
};
