import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import translation files directly
import en from '../locales/en.json';
import fa from '../locales/fa.json';
import ru from '../locales/ru.json';
import zh from '../locales/zh.json';

// Get fallback language from environment variable, default to 'fa'
const fallbackLanguage = import.meta.env.VITE_FALLBACK_LANGUAGE || 'fa';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: fallbackLanguage,
    supportedLngs: ['en', 'fa', 'ru', 'zh'],
    debug: false,
    
    // Inline resources instead of loading from backend
    resources: {
      en: { translation: en },
      fa: { translation: fa },
      ru: { translation: ru },
      zh: { translation: zh },
    },

    interpolation: {
      escapeValue: false,
    },

    detection: {
      order: ['localStorage'], // Removed 'navigator' to disable system language detection
      caches: ['localStorage'],
    },
  });

export default i18n;

