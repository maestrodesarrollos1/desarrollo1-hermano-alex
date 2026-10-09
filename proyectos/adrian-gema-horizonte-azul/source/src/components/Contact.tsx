import { ArrowRight, CalendarPlus } from "lucide-react";
import { Link } from "react-router-dom";
import { templateValues as v } from "@/config/template-values";
import { downloadWeddingDate } from "@/lib/wedding-calendar";

export default function Contact() {
  return <section id="confirmar-asistencia" data-editor-component="rsvp" className="az-contact">
    <div className="az-wrap az-contact-inner">
      <div className="az-contact-copy">
        <p className="az-kicker">{v.event.dateLabel} · {v.event.venue}</p>
        <h2 data-editor-key="rsvp.ctaTitle">{v.rsvp.ctaTitle}</h2>
        <p data-editor-key="rsvp.ctaText">{v.rsvp.ctaText}</p>
        <Link className="az-button az-contact-cta" to="/es/confirmar-asistencia">Confirma asistencia <ArrowRight size={17} aria-hidden="true"/></Link>
        <button className="az-text-button" type="button" onClick={downloadWeddingDate}><CalendarPlus size={17} aria-hidden="true"/> Guardar la fecha</button>
      </div>
      <figure className="az-contact-art">
        <img src={v.images.galeria19} alt="Adrián y Gema con Nala" loading="lazy" width="1536" height="2048"/>
        <figcaption><span>Adrián, Gema y Nala</span><span>27 · 03 · 2027</span></figcaption>
      </figure>
    </div>
  </section>;
}
