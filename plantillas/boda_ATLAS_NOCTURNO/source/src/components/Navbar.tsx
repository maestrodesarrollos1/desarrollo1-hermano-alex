import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { templateValues } from "@/config/template-values";
import { weddingData } from "@/data/weddingData";

const links = ([
  ["La noche", "#countdown", templateValues.sections.countdown],
  ["El archivo", "#sobre-nosotros", templateValues.sections.story],
  ["El recorrido", "#cronograma", templateValues.sections.schedule],
  ["Una nota", "#regalos", "gifts" in templateValues.sections && templateValues.sections.gifts],
  ["Confirmar", "#confirmar-asistencia", templateValues.sections.rsvp],
  ["Preguntas", "#preguntas-frecuentes", templateValues.sections.faq],
] as const).filter(([, , enabled]) => enabled);

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    document.documentElement.style.setProperty("--nav-height", "76px");
    return () => document.documentElement.style.removeProperty("--nav-height");
  }, []);

  return (
    <header className="atlas-nav">
      <style>{`
        .atlas-nav { position:fixed; inset:0 0 auto; z-index:100; height:var(--nav-height,76px); border-bottom:1px solid color-mix(in srgb,var(--template-primary-dark) 16%,transparent); background:color-mix(in srgb,var(--template-surface) 92%,transparent); color:var(--template-primary-dark); backdrop-filter:blur(16px); }
        .atlas-nav__inner { display:grid; grid-template-columns:auto 1fr auto; height:100%; align-items:center; gap:1.5rem; padding:0 clamp(1rem,3vw,3.5rem); }
        .atlas-nav__monogram { display:grid; width:46px; height:46px; place-items:center; border:1px solid color-mix(in srgb,var(--template-primary-dark) 24%,transparent); font-family:var(--font-title); font-size:1.05rem; letter-spacing:.1em; }
        .atlas-nav__links { display:flex; align-items:center; justify-self:center; gap:clamp(.8rem,2.2vw,2.2rem); }
        .atlas-nav__links a, .atlas-nav__menu a { font-family:var(--font-nav); font-size:.57rem; font-weight:600; letter-spacing:.15em; text-transform:uppercase; transition:color 180ms ease; }
        .atlas-nav__links a:hover, .atlas-nav__menu a:hover { color:var(--template-primary); }
        .atlas-nav__menu-button { display:none; justify-self:end; width:42px; height:42px; place-items:center; border:1px solid color-mix(in srgb,var(--template-primary-dark) 24%,transparent); background:transparent; color:inherit; }
        .atlas-nav__menu { position:absolute; top:calc(100% + 1px); left:0; right:0; display:none; border-bottom:1px solid color-mix(in srgb,var(--template-primary-dark) 20%,transparent); background:var(--template-surface); padding:1.5rem; }
        .atlas-nav__menu.is-open { display:grid; grid-template-columns:repeat(2,minmax(0,1fr)); gap:1.35rem 1rem; }
        @media (max-width:860px) { .atlas-nav__inner { grid-template-columns:1fr auto; } .atlas-nav__links, .atlas-nav__monogram { display:none; } .atlas-nav__menu-button { display:grid; } }
      `}</style>
      <div className="atlas-nav__inner">
        <nav className="atlas-nav__links" aria-label="Secciones de la invitacion">
          {links.map(([label, href]) => <a key={href} href={href}>{label}</a>)}
        </nav>
        <a className="atlas-nav__monogram" href="#hero" aria-label="Volver al inicio">{weddingData.couple.short.replace(" y ", "")}</a>
        <button className="atlas-nav__menu-button" type="button" aria-label={mobileOpen ? "Cerrar menu" : "Abrir menu"} aria-expanded={mobileOpen} onClick={() => setMobileOpen((current) => !current)}>{mobileOpen ? <X size={17} /> : <Menu size={18} />}</button>
      </div>
      <nav className={`atlas-nav__menu ${mobileOpen ? "is-open" : ""}`} aria-label="Secciones de la invitacion en movil">
        {links.map(([label, href]) => <a key={href} href={href} onClick={() => setMobileOpen(false)}>{label}</a>)}
      </nav>
    </header>
  );
};

export default Navbar;
