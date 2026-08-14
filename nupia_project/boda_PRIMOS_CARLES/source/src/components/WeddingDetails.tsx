import { Bus, Church, Heart, Music, Users, Utensils, Wine } from "lucide-react";
import AboutInfo from "@/components/AboutInfo";
import LoveMessages from "@/components/LoveMessages";
import { weddingData } from "@/data/weddingData";
import { templateValues } from "@/config/template-values";

const timelineItems = [
  { time: "17:30", title: "Recepción de invitados", icon: Users },
  { time: "18:00", title: "Ceremonia", icon: Church },
  { time: "19:00", title: "Traslado opcional", icon: Bus },
  { time: "19:30", title: "Cóctel", icon: Wine },
  { time: "21:00", title: "Cena", icon: Utensils },
  { time: "23:30", title: "Fiesta", icon: Music },
  { time: "Por definir", title: "Fin del evento", icon: Heart },
] as const;

const venueCards = [
  {
    eyebrow: "Ceremonia",
    title: "Lugar de la ceremonia",
    description: "Añade aquí el nombre, la dirección y las indicaciones de acceso.",
  },
  {
    eyebrow: "Celebración",
    title: weddingData.event.venue,
    description: "Añade aquí el espacio de celebración, transporte y aparcamiento.",
  },
] as const;

const faqItems = [
  {
    id: "faq-como-ir",
    question: "¿Cómo puedo llegar?",
    answer:
      "Incluye enlaces de mapas, direcciones, transporte colectivo y opciones de aparcamiento.",
  },
  {
    id: "faq-musica",
    question: "¿Puedo sugerir una canción?",
    answer:
      "Explica cómo enviar sugerencias o conecta este apartado con una pregunta del formulario RSVP.",
  },
  {
    id: "faq-hora",
    question: "¿A qué hora debo llegar?",
    answer:
      "Indica la hora recomendada de llegada y cuánto margen conviene dejar antes del comienzo.",
  },
  {
    id: "faq-vestimenta",
    question: "¿Cuál es el código de vestimenta?",
    answer:
      "Describe el nivel de formalidad, los colores reservados y cualquier recomendación práctica.",
  },
  {
    id: "faq-tiempo",
    question: "¿Qué tiempo suele hacer?",
    answer:
      "Añade una orientación estacional y recuerda actualizarla cerca de la fecha del evento.",
  },
] as const;

const WeddingDetails = () => {
  return (
    <>
      {templateValues.sections.story ? (
        <section id="sobre-nosotros" data-editor-component="story" className="scroll-animate bg-white px-5 py-16 md:py-24">
        <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
          <div
            className="relative flex min-h-[420px] items-center justify-center overflow-hidden border border-[#DDECE0] bg-[radial-gradient(circle_at_top,#F2FAF3,#DDF0E1)] p-10 text-center md:min-h-[560px]"
            role="img"
            aria-label="Espacio reservado para contenido visual del evento"
          >
            <div className="absolute -left-20 top-16 h-56 w-56 rounded-full border border-[#C9E6D0]" aria-hidden="true" />
            <div className="absolute -right-24 bottom-12 h-72 w-72 rounded-full border border-[#C9E6D0]" aria-hidden="true" />
            <p className="relative max-w-xs font-nav text-sm uppercase leading-8 tracking-[0.28em] text-[#2E7D59]">
              Espacio para una imagen o ilustración del proyecto
            </p>
          </div>

          <div className="mx-auto max-w-xl text-center lg:text-left">
            <h2 data-editor-key="story.title" className="font-script text-4xl text-[#0F3D2E] md:text-6xl">
              {templateValues.story.title}
            </h2>
            <div className="mx-auto mt-6 h-px w-20 bg-[#DDF0E1] lg:mx-0" />
            <div className="mt-8 space-y-6 text-lg leading-8 text-[#1F5E46]">
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

      {templateValues.sections.messages ? (
        <section id="mensajes" data-editor-component="messages" className="scroll-animate bg-[#F8FCF8] px-5 pb-16 pt-4 md:pb-24">
        <div className="mx-auto max-w-6xl">
          <div className="mx-auto max-w-3xl text-center">
            <h3 className="font-script text-4xl leading-tight text-[#0F3D2E] md:text-6xl">
              Comparte un mensaje con los protagonistas
            </h3>
            <div className="mx-auto mt-6 h-px w-20 bg-[#DDF0E1]" />
            <p className="mt-6 text-base leading-8 text-[#1F5E46] md:text-lg">
              La galería personal se ha retirado. El editor futuro permitirá añadir recursos propios a cada
              proyecto sin incorporarlos a la biblioteca base.
            </p>
          </div>
          <div className="mt-12 md:mt-16">
            <LoveMessages />
          </div>
        </div>
        </section>
      ) : null}

      {templateValues.sections.countdown ? <AboutInfo /> : null}

      {templateValues.sections.schedule ? (
        <section id="cronograma" data-editor-component="schedule" className="scroll-animate bg-[#F8FCF8] px-5 py-16 md:py-24">
        <div className="mx-auto max-w-6xl">
          <div className="text-center">
            <h2 className="font-script text-4xl text-[#2B2B2B] md:text-6xl">Cronograma</h2>
            <p className="mt-4 font-nav text-sm uppercase tracking-[0.26em] text-[#7FAF8E] md:text-base">
              Agenda de ejemplo
            </p>
            <div className="mx-auto mt-6 h-px w-20 bg-[#DDF0E1]" />
            <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-[#1F5E46] md:text-lg">
              Modifica, reordena o elimina los hitos para ajustarlos al programa real del evento.
            </p>
          </div>

          <div className="mx-auto mt-14 max-w-4xl overflow-hidden border border-[#DDECE0] bg-white/92 px-6 py-10 shadow-[0_18px_44px_rgba(15,61,46,0.08)] backdrop-blur-sm md:px-10 md:py-12">
            {timelineItems.map((item, index) => {
              const Icon = item.icon;
              return (
                <div
                  key={`${item.time}-${item.title}`}
                  className="grid grid-cols-[64px_40px_1fr] gap-4 md:grid-cols-[84px_52px_1fr] md:gap-5"
                >
                  <div className="flex justify-center pt-1.5">
                    <div className="flex h-12 w-12 items-center justify-center border border-[#DDECE0] bg-[#F8FCF8] text-[#2E7D59] md:h-14 md:w-14">
                      <Icon className="h-7 w-7 stroke-[1.4] md:h-8 md:w-8" aria-hidden="true" />
                    </div>
                  </div>
                  <div className="relative flex justify-center">
                    {index !== timelineItems.length - 1 ? (
                      <span className="absolute top-3 h-[calc(100%+1.5rem)] w-px bg-[#D7E7DB]" aria-hidden="true" />
                    ) : null}
                    <span className="relative mt-3 h-3 w-3 rotate-45 border border-[#7FAF8E] bg-white" aria-hidden="true" />
                  </div>
                  <div>
                    <p className="font-nav text-base tracking-[0.12em] text-[#2E7D59] md:text-lg">
                      {item.time}
                    </p>
                    <p className="mt-1 pb-10 text-sm font-semibold uppercase tracking-[0.18em] text-[#333333] last:pb-0 md:text-base">
                      {item.title}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mx-auto mt-14 grid max-w-5xl gap-5 md:grid-cols-2">
            {venueCards.map((card) => (
              <article
                key={card.eyebrow}
                className="border border-[#DDECE0] bg-white/90 p-6 shadow-[0_16px_40px_rgba(15,61,46,0.08)] backdrop-blur-sm md:p-8"
              >
                <p className="text-xs uppercase tracking-[0.32em] text-[#7FAF8E]">{card.eyebrow}</p>
                <h3
                  data-editor-key={card.eyebrow === "Celebración" ? "event.venue" : undefined}
                  className="mt-4 font-script text-3xl text-[#0F3D2E] md:text-4xl"
                >
                  {card.title}
                </h3>
                <p className="mt-4 leading-7 text-[#1F5E46]">{card.description}</p>
              </article>
            ))}
          </div>
        </div>
        </section>
      ) : null}

      {templateValues.sections.faq ? (
        <section id="preguntas-frecuentes" data-editor-component="faq" className="scroll-animate bg-white px-5 py-16 md:py-24">
        <div className="mx-auto max-w-6xl">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="font-script text-4xl text-[#0F3D2E] md:text-6xl">Preguntas frecuentes</h2>
            <div className="mx-auto mt-6 h-px w-20 bg-[#DDF0E1]" />
            <p className="mt-8 text-lg leading-8 text-[#1F5E46]">
              Usa estos bloques como punto de partida y reemplázalos con información verificada.
            </p>
          </div>

          <div className="faq-accordion mx-auto mt-10 max-w-4xl space-y-4">
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
                  <div className="faq-accordion__answer-inner text-sm leading-7 text-[#1F5E46] md:text-base">
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
