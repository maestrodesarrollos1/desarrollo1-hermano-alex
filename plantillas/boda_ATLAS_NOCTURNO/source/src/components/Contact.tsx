import { ArrowUpRight, Mail, Phone } from "lucide-react";
import { RSVP_FORM_URL } from "@/config/rsvp";
import { templateValues } from "@/config/template-values";
import { weddingData } from "@/data/weddingData";

const Contact = () => (
  <section id="confirmar-asistencia" data-editor-component="rsvp" className="atlas-rsvp scroll-animate">
    <div className="atlas-rsvp__aside"><p className="atlas-kicker">04 / Confirmacion</p><p>Una respuesta<br />y todo queda listo.</p><span aria-hidden="true">RSVP</span></div>
    <div className="atlas-rsvp__main">
      <p data-editor-key="rsvp.noteTitle" className="atlas-kicker">{templateValues.rsvp.noteTitle}</p>
      <h2 data-editor-key="rsvp.ctaTitle">{templateValues.rsvp.ctaTitle}</h2>
      <p data-editor-key="rsvp.ctaText" data-editor-multiline="true">{templateValues.rsvp.ctaText}</p>
      <a href={RSVP_FORM_URL}>Confirmar asistencia <ArrowUpRight aria-hidden="true" /></a>
      <div className="atlas-rsvp__contact">
        <a href={`mailto:${weddingData.contact.email}`}><Mail aria-hidden="true" /><span data-editor-key="contact.email">{weddingData.contact.email}</span></a>
        <a href={`tel:${weddingData.contact.phone.replace(/\s/g, "")}`}><Phone aria-hidden="true" /><span data-editor-key="contact.phone">{weddingData.contact.phone}</span></a>
      </div>
    </div>
  </section>
);

export default Contact;
