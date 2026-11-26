import { Church, Moon, Music, Utensils, Wine } from "lucide-react";
import AboutInfo from "@/components/AboutInfo";
import Contact from "@/components/Contact";
import LoveMessages from "@/components/LoveMessages";
import NightPhotoGallery from "@/components/NightPhotoGallery";
import { weddingData } from "@/data/weddingData";
import { activeEditionId, templateValues } from "@/config/template-values";

const timelineItems = [
  { time: "18:30", title: "Ceremonia", icon: Church },
  { time: "20:00", title: "Cóctel", icon: Wine },
  { time: "21:30", title: "Cena", icon: Utensils },
  { time: "00:00", title: "Fiesta", icon: Music },
] as const;

const faqItems = [
  {
    id: "faq-como-ir",
    question: "¿Dónde nos encontramos?",
    answer: "Nos reunimos en Jardín de los Farolillos, en Madrid. Nos encontraréis en la entrada antes de la ceremonia.",
  },
  {
    id: "faq-musica",
    question: "¿Puedo sugerir una canción?",
    answer: "Por supuesto. Decídnosla cuando nos veamos y la guardaremos para el baile.",
  },
  {
    id: "faq-hora",
    question: "¿A qué hora debo llegar?",
    answer: "Con un cuarto de hora de margen tendréis tiempo para saludar y buscar sitio.",
  },
  {
    id: "faq-vestimenta",
    question: "¿Cómo nos vestimos?",
    answer: "Vestíos de fiesta, pero con zapatos que os apetezca seguir llevando en el baile.",
  },
  {
    id: "faq-tiempo",
    question: "¿Llevo algo de abrigo?",
    answer: "Al caer la noche puede refrescar. Una chaqueta ligera os vendrá bien.",
  },
] as const;

const WeddingDetails = () => {
  return (
    <>
      {templateValues.sections.countdown ? <AboutInfo /> : null}

      {templateValues.sections.story ? (
        <section id="sobre-nosotros" data-editor-component="story" className="scroll-animate bg-white px-5 py-16 md:py-24">
          <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
            {activeEditionId === "esencia" ? (
              <figure className="mx-auto w-full max-w-5xl overflow-hidden">
                <img src={templateValues.images.hero || "/images/intro/dinner-editorial.png"} alt="" loading="lazy" className="aspect-[3/2] w-full object-cover" />
              </figure>
            ) : <NightPhotoGallery />}

            <div className="mx-auto max-w-xl text-center lg:text-left">
              <p className="font-nav text-xs uppercase tracking-[0.34em] text-[color:var(--template-primary-dark)]">Nuestra historia</p>
              <h2 data-editor-key="story.title" className="mt-4 font-script text-4xl text-[color:var(--template-primary-dark)] md:text-6xl">
                {templateValues.story.title}
              </h2>
              <div className="mx-auto mt-6 h-px w-20 bg-[#DDF0E1] lg:mx-0" />
              <div className="mt-8 space-y-6 text-lg leading-8 text-[color:var(--template-primary-dark)]">
                <p data-editor-key="story.paragraph1" data-editor-multiline="true">
                  {templateValues.story.paragraph1}
                </p>
                <p data-editor-key="story.paragraph2" data-editor-multiline="true">
                  {templateValues.story.paragraph2}
                </p>
              </div>
            </div>
          </div>
        </section>
      ) : null}

      {templateValues.sections.schedule ? (
        <section
          id="cronograma"
          data-editor-component="schedule"
          className="scroll-animate bg-[var(--template-soft)] px-5 py-12 md:py-16"
        >
          <div className="mx-auto max-w-6xl">
            <div className="relative overflow-hidden border border-[#DDECE0] bg-[var(--template-primary-dark)] p-5 text-white shadow-[0_24px_64px_rgba(15,61,46,0.13)] md:p-7">
              <div className="absolute -left-16 top-1/2 h-36 w-36 -translate-y-1/2 rounded-full border border-white/10" aria-hidden="true" />
              <div className="absolute -right-20 bottom-0 h-48 w-48 rounded-full border border-white/10" aria-hidden="true" />

              <div className="relative grid gap-5 lg:grid-cols-[1fr_1.45fr] lg:items-center">
                <div>
                  <div className="flex items-center gap-3 text-white/72">
                    <Moon className="h-5 w-5" aria-hidden="true" />
                    <p className="font-nav text-xs uppercase tracking-[0.3em]">Boda de noche</p>
                  </div>
                  <h2 className="mt-3 font-script text-4xl leading-none text-white md:text-5xl">Cronograma</h2>
                  <p className="mt-4 text-sm leading-7 text-white/78 md:text-base">
                    <span data-editor-key="event.dateLabel">{weddingData.event.dateLabel}</span>
                    {" · "}
                    <span data-editor-key="event.city">{weddingData.event.city}</span>
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                  {timelineItems.map((item, index) => {
                    const Icon = item.icon;
                    return (
                      <article
                        key={`${item.time}-${item.title}`}
                        className="border-l border-white/30 px-4 py-2"
                      >
                        <div className="flex items-center justify-between gap-3">
                          <Icon className="h-5 w-5 text-white/68" aria-hidden="true" />
                          <span className="font-nav text-[10px] uppercase tracking-[0.22em] text-white/46">
                            {String(index + 1).padStart(2, "0")}
                          </span>
                        </div>
                        <p className="mt-5 font-script text-3xl leading-none text-white md:text-4xl">{item.time}</p>
                        <h3 className="mt-3 font-nav text-[11px] uppercase tracking-[0.22em] text-white/82">
                          {item.title}
                        </h3>
                      </article>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </section>
      ) : null}

      {templateValues.sections.messages ? (
        <section id="mensajes" data-editor-component="messages" className="scroll-animate bg-white px-5 py-16 md:py-24">
          <div className="mx-auto max-w-6xl">
            <div className="mx-auto max-w-3xl text-center">
              <h3 className="font-script text-4xl leading-tight text-[color:var(--template-primary-dark)] md:text-6xl">
                Comparte un mensaje con nosotros
              </h3>
              <div className="mx-auto mt-6 h-px w-20 bg-[#DDF0E1]" />
              <p className="mt-6 text-base leading-8 text-[color:var(--template-primary-dark)] md:text-lg">
                Deja una dedicatoria para que forme parte del recuerdo de la noche.
              </p>
            </div>
            <div className="mt-12 md:mt-16">
              <LoveMessages />
            </div>
          </div>
        </section>
      ) : null}

      {templateValues.sections.rsvp ? <Contact /> : null}

      {templateValues.sections.faq ? (
        <section id="preguntas-frecuentes" data-editor-component="faq" className="scroll-animate bg-[var(--template-soft)] px-5 py-16 md:py-24">
          <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[0.68fr_1.32fr] lg:items-start">
            <div className="border border-[#DDECE0] bg-white p-7 md:p-9">
              <p className="font-nav text-xs uppercase tracking-[0.34em] text-[color:var(--template-primary-dark)]">Información práctica</p>
              <h2 className="mt-5 font-script text-4xl leading-none text-[color:var(--template-primary-dark)] md:text-6xl">
                Preguntas frecuentes
              </h2>
              <div className="mt-7 h-px w-20 bg-[#DDF0E1]" />
              <p className="mt-7 text-base leading-8 text-[color:var(--template-primary-dark)]">
                Por si os lo estáis preguntando antes de salir de casa.
              </p>
            </div>

            <div className="faq-accordion space-y-4">
              {faqItems.map((item) => (
                <article key={item.id} className="faq-accordion__item">
                  <input type="checkbox" id={item.id} className="faq-accordion__toggle" />
                  <span className="faq-accordion__plus" aria-hidden="true">
                    +
                  </span>
                  <label htmlFor={item.id} className="faq-accordion__question">
                    {item.question}
                  </label>
                  <div className="faq-accordion__answer">
                    <div className="faq-accordion__answer-inner text-sm leading-7 text-[color:var(--template-primary-dark)] md:text-base">
                      {item.answer}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      ) : null}
    </>
  );
};

export default WeddingDetails;
