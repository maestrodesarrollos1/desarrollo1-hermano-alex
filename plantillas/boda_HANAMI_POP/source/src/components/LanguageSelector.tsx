import { useState } from "react";
import { useTranslation } from "react-i18next";
import { ChevronDown } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import ukFlag from "@/assets/flags/uk.svg";
import esFlag from "@/assets/flags/es.svg";
import ruFlag from "@/assets/flags/ru.svg";
import vaFlag from "@/assets/flags/va.svg";
import { LANGUAGE_PREFIXES } from "@/config/routes";

const languages = [
  { code: "en", name: "English", flag: ukFlag },
  { code: "es", name: "Español", flag: esFlag },
  { code: "ru", name: "Русский", flag: ruFlag },
  { code: "va", name: "Valencià", flag: vaFlag },
];

interface LanguageSelectorProps {
  isScrolled: boolean;
}

const LanguageSelector = ({ isScrolled }: LanguageSelectorProps) => {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const currentLanguage = languages.find((lang) => lang.code === i18n.language) || languages[1];

  const changeLanguage = (langCode: string) => {
    const nextPath = `/${LANGUAGE_PREFIXES[langCode] || "es"}`;
    i18n.changeLanguage(langCode);
    navigate(nextPath, { replace: true });
    setIsOpen(false);
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger
        className={`flex items-center gap-2 rounded-lg px-3 py-2 transition-all hover:bg-white/10 ${
          isScrolled ? "text-primary" : "text-white"
        }`}
      >
        <img
          src={currentLanguage.flag}
          alt={currentLanguage.name}
          className="h-5 w-7 rounded-sm border border-border/20 object-cover"
        />
        <span className="hidden text-sm font-medium sm:inline">{currentLanguage.code.toUpperCase()}</span>
        <ChevronDown className="h-4 w-4" />
      </DropdownMenuTrigger>

      <DropdownMenuContent align="start" className="min-w-[180px] border-border bg-background shadow-lg">
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => changeLanguage(lang.code)}
            className={`flex cursor-pointer items-center gap-3 px-4 py-3 hover:bg-primary/10 ${
              currentLanguage.code === lang.code ? "bg-primary/5 font-semibold" : ""
            }`}
          >
            <img
              src={lang.flag}
              alt={lang.name}
              className="h-5 w-7 rounded-sm border border-border/20 object-cover"
            />
            <span className="text-sm">{lang.name}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LanguageSelector;
