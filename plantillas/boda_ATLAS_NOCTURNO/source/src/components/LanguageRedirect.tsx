import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { LANGUAGE_PREFIXES, getLanguageFromPrefix } from '@/config/routes';

const LanguageRedirect = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { i18n, ready } = useTranslation();

  useEffect(() => {
    // Wait until i18n is ready
    if (!ready) return;
    
    try {
      const pathParts = location.pathname.split('/').filter(Boolean);
      const firstPart = pathParts[0];

      // Check if the first part is a language prefix
      const isLanguagePrefix = Object.values(LANGUAGE_PREFIXES).includes(firstPart);

      if (isLanguagePrefix) {
        // Set language based on URL prefix
        const lang = getLanguageFromPrefix(firstPart);
        if (i18n.language !== lang) {
          i18n.changeLanguage(lang);
        }
      } else if (location.pathname === '/') {
        // Root path: redirect to default language
        const currentLang = i18n.language || 'es';
        const prefix = LANGUAGE_PREFIXES[currentLang] || 'es';
        navigate(`/${prefix}`, { replace: true });
      }
    } catch (error) {
      console.error('LanguageRedirect error:', error);
    }
  }, [location.pathname, i18n, navigate, ready]);

  return null;
};

export default LanguageRedirect;
