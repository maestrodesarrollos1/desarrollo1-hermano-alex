import { useTranslation } from "react-i18next";
import { LANGUAGE_PREFIXES } from "@/config/routes";

export const useLocalizedNavigation = () => {
  const { i18n } = useTranslation();
  const currentLang = i18n.language || "es";
  const prefix = LANGUAGE_PREFIXES[currentLang] || "es";

  const getHomePath = (): string => {
    return `/${prefix}`;
  };

  return {
    currentLang,
    prefix,
    getHomePath,
  };
};
