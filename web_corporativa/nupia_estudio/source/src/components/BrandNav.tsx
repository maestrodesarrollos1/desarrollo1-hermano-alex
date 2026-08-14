import { useState } from "react";
import { Menu, X } from "lucide-react";

const links = [
  { href: "#obra", label: "La obra" },
  { href: "#coleccion", label: "Coleccion" },
  { href: "#contacto", label: "Contacto" },
  { href: "#proceso", label: "El proceso" },
];

const BrandNav = () => {
  const [isOpen, setIsOpen] = useState(false);
  const closeMenu = () => setIsOpen(false);

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

        <nav className="brand-nav__links" aria-label="Navegacion principal">
          {links.map((link) => <a key={link.href} href={link.href}>{link.label}</a>)}
        </nav>

        <a className="brand-nav__cta" href="#contacto">Hablemos</a>
        <button
          className="brand-nav__toggle"
          type="button"
          aria-label={isOpen ? "Cerrar menu" : "Abrir menu"}
          aria-expanded={isOpen}
          onClick={() => setIsOpen((current) => !current)}
        >
          {isOpen ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
        </button>
      </div>

      {isOpen ? (
        <div className="brand-nav__drawer">
          <nav aria-label="Navegacion movil">
            {links.map((link) => <a key={link.href} href={link.href} onClick={closeMenu}>{link.label}</a>)}
            <a href="#contacto" onClick={closeMenu}>Hablemos</a>
          </nav>
        </div>
      ) : null}
    </header>
  );
};

export default BrandNav;
