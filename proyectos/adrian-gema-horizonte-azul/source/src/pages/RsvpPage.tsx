import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import RsvpForm from "@/components/RsvpForm";
import { templateValues as v } from "@/config/template-values";

export default function RsvpPage() {
  return <div className="azure-wedding az-rsvp-page">
    <a className="az-skip" href="#contenido">Saltar al contenido</a>
    <Navbar/>
    <main id="contenido" className="az-rsvp-page-main">
      <div className="az-wrap az-rsvp-page-layout">
        <div className="az-rsvp-page-copy">
          <Link to="/es#confirmar-asistencia" className="az-rsvp-back"><ArrowLeft size={17} aria-hidden="true"/> Volver a la invitación</Link>
          <p className="az-kicker">{v.event.dateLabel} · {v.event.venue}</p>
          <h1>Nos vemos <em>allí.</em></h1>
          <p>Nos hace ilusión saber si compartiréis este día con nosotros. Contadnos quiénes venís para guardaros vuestro sitio.</p>
          <span className="az-rsvp-page-signature">{v.couple.partner1} <i>&amp;</i> {v.couple.partner2}</span>
        </div>
        <RsvpForm/>
      </div>
    </main>
    <footer className="az-rsvp-page-footer"><span>{v.couple.partner1} &amp; {v.couple.partner2}</span><span>{v.event.dateLabel}</span></footer>
  </div>;
}
