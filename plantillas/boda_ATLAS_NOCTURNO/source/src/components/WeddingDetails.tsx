import { Compass, MoonStar, Sparkles } from "lucide-react";
import AboutInfo from "@/components/AboutInfo";
import Contact from "@/components/Contact";
import GiftRegistry from "@/components/GiftRegistry";
import LoveMessages from "@/components/LoveMessages";
import NightPhotoGallery from "@/components/NightPhotoGallery";
import { templateValues } from "@/config/template-values";
import { weddingData } from "@/data/weddingData";

const schedule = [
  ["19:00", "El encuentro", "La luz baja y empieza la noche."],
  ["19:45", "La ceremonia", "Un momento para estar muy cerca."],
  ["21:30", "La mesa", "Cena, brindis y conversaciones largas."],
  ["00:00", "Sin reloj", "La pista queda abierta hasta el final."],
] as const;

const faqItems = [
  ["Como llego?", "Incluid aqui la finca, el enlace de mapas, el parking y cualquier detalle de transporte que facilite el viaje."],
  ["Hay codigo de vestimenta?", "Este espacio permite concretar formalidad, colores o recomendaciones para una celebracion al aire libre."],
  ["Puedo venir con acompanante?", "La confirmacion puede indicar claramente las plazas reservadas para cada invitado."],
  ["Y si tengo alguna duda?", "Dejad una persona de contacto para resolver los pequenos detalles antes del gran dia."],
] as const;

const photo = (slot: "historia1" | "historia2") => templateValues.images[slot] || "/images/intro/dinner-editorial.png";

const WeddingDetails = () => (
  <>
    {templateValues.sections.countdown ? <AboutInfo /> : null}

    {templateValues.sections.story ? (
      <section id="sobre-nosotros" data-editor-component="story" className="atlas-story scroll-animate">
        <div className="atlas-story__heading">
          <p className="atlas-kicker">01 / Donde empezo todo</p>
          <p className="atlas-story__number" aria-hidden="true">I</p>
          <h2 data-editor-key="story.title">{templateValues.story.title}</h2>
        </div>
        <div className="atlas-story__content">
          <div className="atlas-story__copy">
            <p data-editor-key="story.paragraph1" data-editor-multiline="true">{templateValues.story.paragraph1}</p>
            <p data-editor-key="story.paragraph2" data-editor-multiline="true">{templateValues.story.paragraph2}</p>
          </div>
          <div className="atlas-story__photos" aria-label="Dos recuerdos de la pareja">
            <figure className="atlas-story__portrait"><img src={photo("historia1")} alt="Un recuerdo de la pareja" loading="lazy" /></figure>
            <figure className="atlas-story__landscape"><img src={photo("historia2")} alt="Otro momento compartido" loading="lazy" /></figure>
          </div>
        </div>
        <NightPhotoGallery />
      </section>
    ) : null}

    {templateValues.sections.schedule ? (
      <section id="cronograma" data-editor-component="schedule" className="atlas-schedule scroll-animate">
        <div className="atlas-schedule__intro">
          <div>
            <p className="atlas-kicker">02 / Una ruta sin prisa</p>
            <h2>La noche,<br />en cuatro actos.</h2>
          </div>
          <p className="atlas-schedule__where"><span data-editor-key="event.dateLabel">{weddingData.event.dateLabel}</span><br /><span data-editor-key="event.venue">{weddingData.event.venue}</span></p>
        </div>
        <div className="atlas-schedule__route" aria-hidden="true"><span /><span /><span /><span /></div>
        <div className="atlas-schedule__list">
          {schedule.map(([time, title, note], index) => (
            <article key={time}>
              <p className="atlas-schedule__index">0{index + 1}</p>
              <p className="atlas-schedule__time">{time}</p>
              <div><h3>{title}</h3><p>{note}</p></div>
              {index === 3 ? <MoonStar aria-hidden="true" /> : <Compass aria-hidden="true" />}
            </article>
          ))}
        </div>
      </section>
    ) : null}

    <GiftRegistry />
    {templateValues.sections.rsvp ? <Contact /> : null}

    {templateValues.sections.messages ? (
      <section id="mensajes" data-editor-component="messages" className="atlas-messages scroll-animate">
        <div className="atlas-messages__intro"><Sparkles aria-hidden="true" /><p className="atlas-kicker">03 / Dejad una linea en esta noche</p><h2>Las palabras tambien se quedan.</h2></div>
        <LoveMessages />
      </section>
    ) : null}

    {templateValues.sections.faq ? (
      <section id="preguntas-frecuentes" data-editor-component="faq" className="atlas-faq scroll-animate">
        <div className="atlas-faq__title"><p className="atlas-kicker">04 / Antes de llegar</p><h2>Todo en su lugar.</h2></div>
        <div className="atlas-faq__list">
          {faqItems.map(([question, answer], index) => (
            <details key={question}>
              <summary><span>0{index + 1}</span><strong>{question}</strong><b>+</b></summary>
              <p>{answer}</p>
            </details>
          ))}
        </div>
      </section>
    ) : null}
  </>
);

export default WeddingDetails;
