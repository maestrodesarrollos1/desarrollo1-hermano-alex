import { useEffect, useMemo, useState } from "react";
import Logo from "./Logo";

const sections = [
  { id: "hero", label: "Inicio" },
  { id: "countdown", label: "Cuenta atrás" },
  { id: "nosotros", label: "Protagonistas" },
  { id: "historia", label: "Historia" },
  { id: "galeria", label: "Fotos" },
  { id: "mensajes", label: "Mensajes" },
  { id: "contacto", label: "Contacto" },
];

const ITEM_HEIGHT = 44;

const SideLayout = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const items = sections
        .map((section) => document.getElementById(section.id))
        .filter(Boolean) as HTMLElement[];

      let currentIndex = 0;
      items.forEach((item, index) => {
        const top = item.offsetTop - window.innerHeight * 0.28;
        if (window.scrollY >= top) {
          currentIndex = index;
        }
      });

      setActiveIndex(currentIndex);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const indicatorStyle = useMemo(
    () => ({
      transform: `translateY(${activeIndex * ITEM_HEIGHT}px)`,
    }),
    [activeIndex],
  );

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <aside className="mb-6 w-full overflow-hidden rounded-[1.8rem] border border-[#EAF6EC] bg-white lg:fixed lg:bottom-0 lg:left-0 lg:top-0 lg:mb-0 lg:w-[248px] lg:rounded-none lg:border-x-0 lg:border-y-0 lg:border-r">
      <div className="flex h-full flex-col px-6 py-8 lg:px-7 lg:py-10">
        <Logo compact className="w-full bg-transparent" />

        <div className="mt-12 flex-1">
          <div className="relative">
            <div
              className="absolute left-0 right-0 top-0 rounded-full bg-[#EAF6EC] transition-transform duration-300 ease-out"
              style={{ height: `${ITEM_HEIGHT - 6}px`, ...indicatorStyle }}
            />

            <ul className="relative space-y-0">
              {sections.map((section, index) => (
                <li key={section.id}>
                  <button
                    onClick={() => scrollTo(section.id)}
                    className={`relative flex h-11 w-full items-center rounded-full px-4 text-left text-sm transition-colors ${
                      activeIndex === index ? "text-[#2E7D59]" : "text-[#1F5E46] hover:text-[#0F3D2E]"
                    }`}
                  >
                    <span className="mr-3 text-[10px] uppercase tracking-[0.28em] text-[#7FAF8E]">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span>{section.label}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="pt-6 text-xs uppercase tracking-[0.24em] text-[#2E7D59]">
          {sections[activeIndex]?.label}
        </div>
      </div>
    </aside>
  );
};

export default SideLayout;
