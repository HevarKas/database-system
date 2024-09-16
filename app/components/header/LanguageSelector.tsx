import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select';
import { useLanguage } from '~/contexts/LanguageContext';
import i18n from '~/i18n';

const LanguageSwitcher: React.FC = () => {
  const { t } = useTranslation();
  const { language, setLanguage } = useLanguage();

  const handleLanguageChange = (value: string) => {
    setLanguage(value as 'en' | 'ku' | 'ar');
    i18n.changeLanguage(value);
  };

  return (
    <section className="flex items-center mx-2 w-24">
      <Select value={language} onValueChange={handleLanguageChange}>
        <SelectTrigger className="bg-transparent border-none focus:outline-none">
          <SelectValue placeholder={t('localize[language]')} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="en">{t('localize.english')}</SelectItem>
          <SelectItem value="ku">{t('localize.kurdish')}</SelectItem>
          <SelectItem value="ar">{t('localize.arabic')}</SelectItem>
        </SelectContent>
      </Select>
    </section>
  );
};

export default LanguageSwitcher;
