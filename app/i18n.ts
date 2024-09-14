import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { arabicTranslations } from '~/locales/ar';
import { englishTranslations } from '~/locales/en';
import { kurdishTranslations } from '~/locales/ku';

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: englishTranslations },
    ar: { translation: arabicTranslations },
    ku: { translation: kurdishTranslations },
  },
  lng: 'en',
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
