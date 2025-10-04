import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

export function useLanguage() {
  const { i18n } = useTranslation();

  useEffect(() => {
    // Update html lang and dir attributes when language changes
    document.documentElement.lang = i18n.language;
    document.documentElement.setAttribute('dir', i18n.dir());
  }, [i18n.language]);

  return { language: i18n.language, changeLanguage: i18n.changeLanguage };
}

