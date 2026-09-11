import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import en from '@/translations/en.json';
import es from '@/translations/es.json';
import ru from '@/translations/ru.json';
import va from '@/translations/va.json';

// Initialize i18n without auto-detection - URL is source of truth
i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      es: { translation: es },
      ru: { translation: ru },
      va: { translation: va },
    },
    lng: 'es', // Explicit default
    fallbackLng: 'es',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
