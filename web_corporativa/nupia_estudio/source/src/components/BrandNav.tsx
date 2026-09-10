import { useEffect, useRef, useState } from "react";
import { Menu, X } from "lucide-react";

const links = [
  { href: "#coleccion", label: "Diseños" },
  { href: "#proceso", label: "Cómo trabajamos" },
  { href: "#dudas", label: "Dudas" },
];

const BrandNav = () => {
  const [isOpen, setIsOpen] = useState(false);
  const toggle = useRef<HTMLButtonElement>(null);
  const closeMenu = () => setIsOpen(false);
  useEffect(() => {
    const escape = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isOpen) { setIsOpen(false); toggle.current?.focus(); }
    };
    const breakpoint = window.matchMedia("(min-width: 761px)");
    const closeDesktop = () => { if (breakpoint.matches) setIsOpen(false); };
    document.addEventListener("keydown", escape);
    breakpoint.addEventListener("change", closeDesktop);
    return () => { document.removeEventListener("keydown", escape); breakpoint.removeEventListener("change", closeDesktop); };
  }, [isOpen]);

  return (
    <header className="brand-nav">
      <div className="brand-nav__inner">
        <a className="brand-mark" href="#inicio" aria-label="Nupia, volver al inicio" onClick={closeMenu}>
          <span className="brand-mark__lockup">
            <img className="brand-mark__glyph" src="/images/nupia-mark.png" alt="" />
            <span className="brand-mark__name">NUPIA</span>
          </span>
          <small>ESTUDIO DIGITAL</small>
        </a>

        <nav className="brand-nav__links" aria-label="Navegación principal">
          {links.map((link) => <a key={link.href} href={link.href}>{link.label}</a>)}
        </nav>

        <a className="brand-nav__cta" href="#contacto">Hablemos de vuestra boda</a>
        <button
          className="brand-nav__toggle"
          ref={toggle}
          type="button"
          aria-label={isOpen ? "Cerrar menú" : "Abrir menú"}
          aria-expanded={isOpen}
          aria-controls="mobile-navigation"
          onClick={() => setIsOpen((current) => !current)}
        >
          {isOpen ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
        </button>
      </div>

      {isOpen ? (
        <div id="mobile-navigation" className="brand-nav__drawer">
          <nav aria-label="Navegación móvil">
            {links.map((link) => <a key={link.href} href={link.href} onClick={closeMenu}>{link.label}</a>)}
            <a href="#contacto" onClick={closeMenu}>Hablemos</a>
          </nav>
        </div>
      ) : null}
    </header>
  );
};

export default BrandNav;
