import { ArrowUpRight, CalendarPlus, Phone } from "lucide-react";
import { templateValues as v } from "@/config/template-values";
import { downloadWeddingDate } from "@/lib/wedding-calendar";
export default function Contact() {
  const configured = /^https?:\/\//.test(v.rsvp.url);
  return <section id="confirmar-asistencia" data-editor-component="rsvp" className="az-contact">
    <div className="az-wrap az-contact-inner">
      <div><p className="az-kicker">27 de marzo · {v.event.venue}</p><h2 data-editor-key="rsvp.ctaTitle">{v.rsvp.ctaTitle}</h2><p data-editor-key="rsvp.ctaText">{v.rsvp.ctaText}</p>
      {configured ? <a className="az-button" href={v.rsvp.url} target="_blank" rel="noreferrer">Confirmar asistencia <ArrowUpRight size={17}/></a> : <button className="az-button" onClick={downloadWeddingDate}>Guardar en mi calendario <CalendarPlus size={17}/></button>}
      </div>
      <aside><span className="az-contact-number">27<span>/ 03</span></span><p data-editor-key="rsvp.noteText">{v.rsvp.noteText}</p><a className="az-text-button" href={`tel:${v.contact.phone.replace(/\s/g,"")}`}><Phone size={17}/>{v.contact.name} · {v.contact.phone}</a></aside>
    </div>
  </section>;
}
