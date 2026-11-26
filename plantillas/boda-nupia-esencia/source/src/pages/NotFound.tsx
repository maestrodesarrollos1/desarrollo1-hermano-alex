import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import Navbar from "@/components/Navbar";
import ContactBar from "@/components/ContactBar";
import Footer from "@/components/Footer";
import { useTranslation } from "react-i18next";
import { useLocalizedNavigation } from "@/hooks/use-localized-navigation";

const NotFound = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const { getHomePath } = useLocalizedNavigation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col">
      <ContactBar />
      <Navbar />
      <div className="flex flex-1 items-center justify-center bg-background">
        <div className="text-center">
          <h1 className="mb-4 text-4xl font-bold text-primary">{t("notFound.title")}</h1>
          <p className="mb-4 text-xl text-muted-foreground">{t("notFound.message")}</p>
          <Link to={getHomePath()} className="text-primary underline hover:text-primary/80">
            {t("notFound.backHome")}
          </Link>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default NotFound;
