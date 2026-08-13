import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { X } from "lucide-react";

const getCookie = (name: string): string | null => {
  try {
    if (typeof document === 'undefined') return null;
    const nameEQ = name + "=";
    const ca = document.cookie.split(";");
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) === " ") c = c.substring(1, c.length);
      if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
  } catch {
    return null;
  }
};

const CookieConsent = () => {
  const { i18n, t } = useTranslation();
  // Check cookie immediately to prevent flash
  const [showBanner, setShowBanner] = useState(() => {
    return !getCookie("allowCookies");
  });

  // Only save language preference when it changes (URL is source of truth for restoration)
  useEffect(() => {
    if (getCookie("allowCookies")) {
      setCookie("preferredLang", i18n.language, 365);
    }
  }, [i18n.language]);

  const setCookie = (name: string, value: string, days: number) => {
    let expires = "";
    if (days) {
      const date = new Date();
      date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
      expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "") + expires + "; path=/";
  };


  const eraseCookie = (name: string) => {
    document.cookie = name + "=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;";
  };

  const handleAccept = () => {
    setCookie("allowCookies", "1", 365);
    setCookie("preferredLang", i18n.language, 365);
    setShowBanner(false);
  };

  const handleDeny = () => {
    eraseCookie("allowCookies");
    eraseCookie("preferredLang");
    setShowBanner(false);
  };

  if (!showBanner) return null;

  return (
    <div
      id="cookie-consent"
      data-editor-component="cookies"
      className="fixed bottom-0 left-0 right-0 z-50 p-4 animate-in slide-in-from-bottom-5"
    >
      <div className="container mx-auto max-w-4xl">
        <div className="border border-[#14382A]/24 bg-[#F7F1E5] p-3 shadow-[0_26px_70px_rgba(4,12,8,.28)]">
          <div className="border border-[#B58A3C]/50 p-5 md:p-6">
          <div className="flex flex-col gap-4">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <p className="font-nav text-[10px] font-medium uppercase tracking-[.28em] text-[#8D6D2D]">Privacidad</p>
                <h4 className="mt-3 font-script text-3xl leading-none text-[#14382A]">{t("cookies.title")}</h4>
                <p className="mt-3 max-w-xl text-sm leading-6 text-[#14382A]/68">
                  {t("cookies.message")}
                </p>
              </div>
              <button
                type="button"
                onClick={handleDeny}
                className="grid h-9 w-9 shrink-0 place-items-center border border-[#14382A]/18 text-[#14382A] transition-colors hover:border-[#B58A3C] hover:text-[#8D6D2D]"
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 sm:justify-end">
              <button
                type="button"
                onClick={handleDeny}
                className="min-h-11 w-full border border-[#14382A]/32 px-5 font-nav text-[10px] font-medium uppercase tracking-[.2em] text-[#14382A] transition-colors hover:border-[#B58A3C] hover:text-[#8D6D2D] sm:w-auto"
              >
                {t("cookies.deny")}
              </button>
              <button
                type="button"
                onClick={handleAccept}
                className="min-h-11 w-full border border-[#14382A] bg-[#14382A] px-5 font-nav text-[10px] font-medium uppercase tracking-[.2em] text-[#F7F1E5] transition-colors hover:bg-[#B58A3C] hover:text-[#14382A] sm:w-auto"
              >
                {t("cookies.accept")}
              </button>
            </div>
          </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CookieConsent;
