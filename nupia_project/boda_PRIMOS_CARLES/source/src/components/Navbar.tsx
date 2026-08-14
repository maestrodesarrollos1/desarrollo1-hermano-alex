import { useEffect, useRef, useState } from "react";
import type { MouseEvent } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { useLocalizedNavigation } from "@/hooks/use-localized-navigation";
import { useCountdown } from "@/hooks/use-countdown";
import { cn } from "@/lib/utils";
import { templateValues } from "@/config/template-values";
import { weddingData } from "@/data/weddingData";

type NavItem = {
  label: string;
  href: string;
  note?: string;
};

const navItems: readonly NavItem[] = [
  ...(templateValues.sections.story
    ? [{ label: "Sobre nosotros", href: "#sobre-nosotros" }]
    : []),
  ...(templateValues.sections.schedule ? [{ label: "Cronograma", href: "#cronograma" }] : []),
  ...(templateValues.sections.faq
    ? [{ label: "Preguntas frecuentes", href: "#preguntas-frecuentes" }]
    : []),
  ...(templateValues.sections.rsvp
    ? [{ label: "Confirma asistencia", href: "#confirmar-asistencia" }]
    : []),
];
const countdownShortLabels: Record<string, string> = {
  Dias: "D",
  Horas: "H",
  Min: "M",
  Seg: "S",
};

const homePaths = ["/", "/es", "/val", "/eng", "/ru"];
const DEFAULT_NAV_HEIGHT = 72;
const NAV_GAP = 12;
const NUPIA_STUDIO_URL = import.meta.env.VITE_NUPIA_STUDIO_URL ?? "http://localhost:8084";

const Navbar = () => {
  const { getHomePath } = useLocalizedNavigation();
  const location = useLocation();
  const countdownItems = useCountdown();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeHref, setActiveHref] = useState<string | null>(null);
  const [showCountdownBar, setShowCountdownBar] = useState(false);
  const [mainBarHeight, setMainBarHeight] = useState(DEFAULT_NAV_HEIGHT);
  const [countdownBarHeight, setCountdownBarHeight] = useState(0);
  const isHomePage = homePaths.includes(location.pathname);
  const mainBarRef = useRef<HTMLDivElement | null>(null);
  const countdownBarRef = useRef<HTMLDivElement | null>(null);

  const measureHeights = () => {
    const nextMainBarHeight = mainBarRef.current?.offsetHeight ?? DEFAULT_NAV_HEIGHT;
    const nextCountdownBarHeight = countdownBarRef.current?.scrollHeight ?? 0;

    setMainBarHeight((current) => (current === nextMainBarHeight ? current : nextMainBarHeight));
    setCountdownBarHeight((current) =>
      current === nextCountdownBarHeight ? current : nextCountdownBarHeight,
    );
  };

  const resolveSectionOffset = (includeCountdownBar: boolean) =>
    mainBarHeight + (includeCountdownBar ? countdownBarHeight : 0) + NAV_GAP;

  const getScrollOffset = (href: string) => {
    if (href === "#hero") {
      return mainBarHeight;
    }

    const target = document.getElementById(href.replace("#", ""));
    const countdownSection = document.getElementById("countdown");
    const countdownBottom = countdownSection
      ? countdownSection.offsetTop + countdownSection.offsetHeight
      : Number.POSITIVE_INFINITY;
    const shouldIncludeCountdownBar =
      showCountdownBar || (!!target && target.offsetTop >= countdownBottom);

    return resolveSectionOffset(shouldIncludeCountdownBar);
  };

  useEffect(() => {
    measureHeights();

    const resizeObserver = new ResizeObserver(() => {
      measureHeights();
    });

    if (mainBarRef.current) {
      resizeObserver.observe(mainBarRef.current);
    }

    if (countdownBarRef.current) {
      resizeObserver.observe(countdownBarRef.current);
    }

    window.addEventListener("resize", measureHeights);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", measureHeights);
    };
  }, [mobileOpen]);

  useEffect(() => {
    const root = document.documentElement;

    root.style.setProperty("--nav-height", `${mainBarHeight}px`);
    root.style.setProperty(
      "--nav-offset",
      `${mainBarHeight + (showCountdownBar ? countdownBarHeight : 0)}px`,
    );

    return () => {
      root.style.removeProperty("--nav-height");
      root.style.removeProperty("--nav-offset");
    };
  }, [countdownBarHeight, mainBarHeight, showCountdownBar]);

  useEffect(() => {
    if (!isHomePage) {
      setActiveHref(null);
      setShowCountdownBar(false);
      return;
    }

    const updateScrollState = () => {
      const countdownSection = document.getElementById("countdown");
      const nextShowCountdownBar = countdownSection
        ? countdownSection.getBoundingClientRect().bottom <= mainBarHeight
        : false;
      const nextSectionOffset =
        mainBarHeight + (nextShowCountdownBar ? countdownBarHeight : 0) + NAV_GAP;
      const activeMarker =
        window.scrollY + nextSectionOffset + window.innerHeight * 0.28;

      let nextActiveHref: string | null = null;

      navItems.forEach((item) => {
        const section = document.getElementById(item.href.replace("#", ""));
        if (section && activeMarker >= section.offsetTop) {
          nextActiveHref = item.href;
        }
      });

      setShowCountdownBar((current) =>
        current === nextShowCountdownBar ? current : nextShowCountdownBar,
      );
      setActiveHref((current) => (current === nextActiveHref ? current : nextActiveHref));
    };

    updateScrollState();
    window.addEventListener("scroll", updateScrollState, { passive: true });
    window.addEventListener("resize", updateScrollState);

    return () => {
      window.removeEventListener("scroll", updateScrollState);
      window.removeEventListener("resize", updateScrollState);
    };
  }, [countdownBarHeight, isHomePage, mainBarHeight]);

  const navigateOnPage = (href: string) => {
    const target = document.querySelector(href);

    if (target) {
      const offset = getScrollOffset(href);
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top: Math.max(top, 0), left: 0, behavior: "smooth" });
    }

    setMobileOpen(false);
  };

  const handleLogoClick = (event: MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => {
    if (!isHomePage) return;
    event.preventDefault();
    navigateOnPage("#hero");
  };

  const renderNavItem = (item: NavItem, mobile = false) => {
    const isActive = isHomePage && activeHref === item.href;
    const className = mobile
      ? cn(
          "font-nav flex w-full flex-col items-center justify-center px-5 py-3 text-center font-semibold uppercase text-[#0F3D2E] transition-colors hover:bg-[#EAF6EC] hover:text-[#0A2F23]",
          isActive && "bg-[#EAF6EC] text-[#0A2F23]",
        )
      : cn(
          "font-nav flex min-h-[52px] flex-col items-center justify-center px-2.5 py-2 text-center font-semibold uppercase text-[#0F3D2E] transition-colors hover:bg-[#F2FAF3] hover:text-[#0A2F23] xl:px-3",
          isActive && "bg-[#F2FAF3] text-[#0A2F23] shadow-[inset_0_0_0_1px_#DDF0E1]",
        );
    const labelMarkup = (
      <span className={cn("block text-[10px] tracking-[0.18em] xl:text-[11px]", mobile && "text-[11px]")}>
        {item.label}
      </span>
    );

    if (isHomePage) {
      return (
        <button
          key={item.href}
          type="button"
          onClick={() => navigateOnPage(item.href)}
          aria-current={isActive ? "location" : undefined}
          className={className}
        >
          {labelMarkup}
        </button>
      );
    }

    return (
      <Link
        key={item.href}
        to={`${getHomePath()}${item.href}`}
        onClick={() => setMobileOpen(false)}
        aria-current={isActive ? "location" : undefined}
        className={className}
      >
        {labelMarkup}
      </Link>
    );
  };

  const logo = (
    <span
      className="flex h-12 min-w-20 items-center justify-center border border-[#DDF0E1] px-3 font-script text-lg sm:h-14"
      style={{ color: "var(--template-primary-dark)" }}
      aria-hidden="true"
    >
      {weddingData.couple.short}
    </span>
  );
  const studioMark = (
    <a href={NUPIA_STUDIO_URL} className="absolute left-4 top-1/2 z-10 flex -translate-y-1/2 items-center gap-1.5 font-nav text-[8px] font-medium tracking-[0.2em] transition-opacity hover:opacity-65 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4" style={{ color: "var(--template-primary-dark)" }} aria-label="Nupia, estudio digital de bodas">
      <img className="h-7 w-5 object-contain" src="/images/nupia-mark.png" alt="" />
      <span>NUPIA</span>
    </a>
  );

  return (
    <header className="fixed left-0 right-0 top-0 z-[100] border-b border-[#C9E6D0] bg-white/[0.97] shadow-[0_10px_34px_rgba(15,61,46,0.12)] backdrop-blur-xl">
      {studioMark}
      <div ref={mainBarRef} className="mx-auto flex min-h-[72px] max-w-7xl items-center justify-between gap-4 pl-24 pr-4 py-2.5 sm:pl-28 sm:pr-6 xl:pl-24 xl:pr-6">
        <div className="flex shrink-0 items-center gap-3 sm:gap-4">
          {isHomePage ? (
            <button
              type="button"
              onClick={handleLogoClick}
              aria-label="Ir al inicio de la plantilla"
              className="transition-opacity hover:opacity-85 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#1F5E46]"
            >
              {logo}
            </button>
          ) : (
            <Link
              to={getHomePath()}
              aria-label="Ir al inicio de la plantilla"
              className="transition-opacity hover:opacity-85 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#1F5E46]"
            >
              {logo}
            </Link>
          )}
        </div>

        <nav className="hidden flex-1 items-center justify-end gap-1 lg:flex" aria-label="Navegacion principal">
          {navItems.map((item) => renderNavItem(item))}
        </nav>

        <button
          type="button"
          onClick={() => setMobileOpen((value) => !value)}
          aria-label={mobileOpen ? "Cerrar menu" : "Abrir menu"}
          aria-expanded={mobileOpen}
          className="border border-[#C9E6D0] bg-white p-2 text-[#0F3D2E] shadow-sm transition-colors hover:bg-[#F2FAF3] lg:hidden"
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      <div
        ref={countdownBarRef}
        aria-hidden={!showCountdownBar}
        className={cn(
          "overflow-hidden border-t border-[#EAF6EC] bg-[#FCFFFC] transition-[max-height,opacity,transform] duration-500 ease-out",
          showCountdownBar ? "max-h-20 translate-y-0 opacity-100" : "max-h-0 -translate-y-3 opacity-0",
        )}
      >
        <div className="mx-auto flex max-w-7xl justify-center px-4 py-1.5 sm:px-6">
          <div className="font-nav flex flex-wrap items-center justify-center gap-x-2 gap-y-1 border border-[#DDF0E1] bg-white/92 px-3 py-1.5 text-[#0F3D2E] shadow-[0_8px_20px_rgba(15,61,46,0.06)] sm:px-4">
            <span className="text-[9px] font-semibold uppercase tracking-[0.3em] text-[#7FAF8E] sm:text-[10px]">
              Cuenta atras
            </span>

            {countdownItems.map((item) => (
              <span key={item.label} className="inline-flex items-center gap-2">
                <span className="text-[11px] leading-none text-[#B8D8C0]" aria-hidden="true">
                  |
                </span>
                <span className="inline-flex items-baseline gap-1 whitespace-nowrap">
                  <span className="text-sm font-semibold leading-none tabular-nums sm:text-[15px]">
                    {item.value}
                  </span>
                  <span className="text-[9px] font-semibold uppercase tracking-[0.18em] text-[#2E7D59] sm:text-[10px]">
                    {countdownShortLabels[item.label] ?? item.label}
                  </span>
                </span>
              </span>
            ))}
          </div>
        </div>
      </div>

      <div
        className={`overflow-hidden border-t border-[#EAF6EC] bg-white transition-[max-height,opacity] duration-300 lg:hidden ${
          mobileOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <nav className="py-2" aria-label="Navegacion principal movil">
          {navItems.map((item) => renderNavItem(item, true))}
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
