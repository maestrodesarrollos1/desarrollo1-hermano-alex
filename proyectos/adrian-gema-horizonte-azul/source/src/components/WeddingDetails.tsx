import { ArrowUpRight, Plus } from "lucide-react";
import AboutInfo from "@/components/AboutInfo";
import Contact from "@/components/Contact";
import LoveMessages from "@/components/LoveMessages";
import NightPhotoGallery from "@/components/NightPhotoGallery";
import { templateValues as v } from "@/config/template-values";
export default function WeddingDetails() {
  const agenda=[["01",v.schedule.ceremony,"El sí, quiero","Ceremonia"],["02",v.schedule.cocktail,"El primer brindis","Cóctel"],["03",v.schedule.lunch,"Todos a la mesa","Banquete"],["04",v.schedule.party,"Que siga la fiesta",`Hasta las ${v.schedule.end} h`]];
  const questions=[
    [v.faq.parkingQuestion,v.faq.parkingAnswer],
    ["¿A qué hora empieza la celebración?",`La ceremonia empieza a las ${v.schedule.ceremony} h en ${v.event.venue}.`],
    ["¿Habrá transporte?",v.faq.transportAnswer],
  ];
  return <>
    {v.sections.countdown && <AboutInfo/>}
    {v.sections.story && <>
      <section id="sobre-nosotros" data-editor-component="story" className="az-story az-wrap">
        <div className="az-story-photos">
          <figure className="az-story-main"><img src={v.images.historia1} alt="Adrián y Gema abrazados en un jardín" loading="lazy" width="600" height="800"/><figcaption>Adrián &amp; Gema</figcaption></figure>
          <figure className="az-story-nala"><img src={v.images.historia2} alt="Adrián y Gema con Nala" loading="lazy" width="400" height="500"/><figcaption>Y Nala, claro.</figcaption></figure>
        </div>
        <div className="az-story-copy"><p className="az-kicker">Todo lo que nos trae hasta aquí</p><h2 data-editor-key="story.title">{v.story.title}</h2><p data-editor-key="story.paragraph1">{v.story.paragraph1}</p><p data-editor-key="story.paragraph2">{v.story.paragraph2}</p><span className="az-signature">A <i>&amp;</i> G</span></div>
      </section>
      <NightPhotoGallery/>
      {v.sections.messages && <section id="mensajes" data-editor-component="messages" className="az-message-section az-message-section--album az-wrap"><LoveMessages/></section>}
    </>}
    {v.sections.schedule && <>
      <section id="cronograma" data-editor-component="schedule" className="az-day">
        <div className="az-wrap">
          <div className="az-section-heading"><div><p className="az-kicker">Sábado, 27 de marzo</p><h2>Un día para <em>quedarse.</em></h2></div><p>De las doce<br/>a las mil historias.</p></div>
          <ol className="az-agenda">{agenda.map(([number,time,title,note])=><li key={number}><span className="az-agenda-number">{number}</span><strong>{time}<small>h</small></strong><h3>{title}</h3><p>{note}</p></li>)}</ol>
        </div>
      </section>
      <section className="az-venue az-wrap">
        <figure><img src="/images/pareja/finca-ilustrada.webp" alt="Ilustración mediterránea de una finca entre árboles" loading="lazy" width="1000" height="650"/><figcaption>Un paisaje para imaginar el día.</figcaption></figure>
        <div><p className="az-kicker">El punto de encuentro</p><h2 data-editor-key="event.venue">{v.event.venue}</h2><p>Nos vemos aquí para el primer abrazo, el primer brindis y todo lo que venga después.</p><a className="az-text-button" href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(v.event.venue)}`} target="_blank" rel="noreferrer">Buscar la finca en Maps <ArrowUpRight size={17}/></a><p className="az-venue-note">Dos zonas de aparcamiento dentro de la finca.</p></div>
      </section>
    </>}
    {v.sections.rsvp && <Contact/>}
    {v.sections.faq && <section id="preguntas-frecuentes" data-editor-component="faq" className="az-faq az-wrap"><div><p className="az-kicker">Antes de vernos</p><h2>Las pequeñas<br/><em>grandes dudas.</em></h2></div><div>{questions.map(([q,a])=><details key={q}><summary>{q}<Plus size={20}/></summary><p>{a}</p></details>)}</div></section>}
  </>;
}
