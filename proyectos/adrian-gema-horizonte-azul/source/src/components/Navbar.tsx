import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { templateValues as v } from "@/config/template-values";
export default function Navbar() {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const close = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, []);
  const items = [
    ...(v.sections.story ? [{href:"sobre-nosotros", label:"Nosotros"}] : []),
    ...(v.sections.schedule ? [{href:"cronograma", label:"El gran día"}] : []),
    ...(v.sections.faq ? [{href:"preguntas-frecuentes", label:"Vuestras dudas"}] : []),
    ...(v.sections.rsvp ? [{href:"confirmar-asistencia", label:"Nos vemos allí"}] : []),
  ];
  return <header className="az-nav">
    <a className="az-monogram" href="/es#hero" aria-label="Adrián y Gema, inicio">A<span>&amp;</span>G</a>
    <p className="az-nav-date">27 / 03 / 27</p>
    <button className="az-icon az-nav-toggle" aria-label={open ? "Cerrar menú" : "Abrir menú"} aria-expanded={open} aria-controls="az-menu" onClick={() => setOpen(!open)}>{open ? <X/> : <Menu/>}</button>
    <nav id="az-menu" className={open ? "is-open" : ""} aria-label="Navegación principal">
      {items.map(item => <a key={item.href} href={`/es#${item.href}`} onClick={() => setOpen(false)}>{item.label}</a>)}
    </nav>
  </header>;
}
