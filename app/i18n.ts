import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import translations directly to ensure they're available synchronously
import enTranslation from '../translations/en/translation.json';
import zhCNTranslation from '../translations/zh-CN/translation.json';

const resources = {
  en: {
    translation: enTranslation,
  },
  'zh-CN': {
    translation: zhCNTranslation,
  },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    debug: false,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
