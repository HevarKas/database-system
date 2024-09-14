import React, { createContext, useContext, useState, ReactNode } from 'react';

type LanguageContextProps = {
  language: 'en' | 'ku' | 'ar';
  rtl: boolean;
  setLanguage: (lang: 'en' | 'ku' | 'ar') => void;
};

const LanguageContext = createContext<LanguageContextProps | undefined>(
  undefined,
);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [language, setLanguage] = useState<'en' | 'ku' | 'ar'>('en');

  const rtl = language === 'ar' || language === 'ku';

  return (
    <LanguageContext.Provider value={{ language, rtl, setLanguage }}>
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
