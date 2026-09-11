import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "./ui/button";
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
        <div className="bg-card border border-border rounded-lg shadow-lg p-6">
          <div className="flex flex-col gap-4">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <h4 className="font-soho font-semibold text-lg mb-2">{t("cookies.title")}</h4>
                <p className="text-sm text-muted-foreground">
                  {t("cookies.message")}
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleDeny}
                className="shrink-0"
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 sm:justify-end">
              <Button
                variant="outline"
                onClick={handleDeny}
                className="w-full sm:w-auto"
              >
                {t("cookies.deny")}
              </Button>
              <Button
                onClick={handleAccept}
                className="w-full sm:w-auto"
              >
                {t("cookies.accept")}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CookieConsent;
