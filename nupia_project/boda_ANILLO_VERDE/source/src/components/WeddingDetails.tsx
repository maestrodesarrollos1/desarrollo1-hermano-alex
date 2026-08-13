import { CalendarHeart, Church, Coffee, Music2, Utensils } from "lucide-react";
import AboutInfo from "@/components/AboutInfo";
import Contact from "@/components/Contact";
import GiftRegistry from "@/components/GiftRegistry";
import LoveMessages from "@/components/LoveMessages";
import NightPhotoGallery from "@/components/NightPhotoGallery";
import { weddingData } from "@/data/weddingData";
import { templateValues } from "@/config/template-values";

const schedule = [
  { time: "17:45", title: "Bienvenida", note: "Las puertas se abren", icon: Coffee },
  { time: "18:30", title: "Ceremonia", note: "El momento de decir si", icon: Church },
  { time: "21:00", title: "Cena bajo luces", note: "Brindis y sobremesa", icon: Utensils },
  { time: "23:30", title: "Baile", note: "Que empiece la noche", icon: Music2 },
] as const;

const faqItems = [
  ["Como llego?", "Anade mapas, autobuses, aparcamiento y cualquier indicacion util para que el trayecto sea parte del plan."],
  ["Codigo de vestimenta", "Define colores, formalidad y recomendaciones para una ceremonia exterior o para una celebracion de noche."],
  ["Puedo llevar acompanante?", "Aclara aqui como confirmar acompanantes desde el formulario de asistencia."],
  ["Regalos", "Explica la lista de bodas, el fondo de viaje o cualquier detalle que querais compartir con discrecion."],
] as const;

const WeddingDetails = () => {
  return (
    <>
      {templateValues.sections.countdown ? <AboutInfo /> : null}

      {templateValues.sections.story ? (
        <section id="sobre-nosotros" data-editor-component="story" className="scroll-animate overflow-hidden bg-[#F3EFE4] py-20 md:py-28">
          <div className="mx-auto grid max-w-7xl gap-10 px-5 md:grid-cols-[.65fr_1.35fr] md:px-8">
            <div>
              <p className="font-nav text-[10px] font-medium uppercase tracking-[.34em] text-[#8D6D2D]">Capitulo I</p>
              <p className="mt-8 font-script text-[10rem] leading-[.55] text-[#B58A3C]/30" aria-hidden="true">A</p>
            </div>
            <div className="max-w-3xl border-l border-[#14382A]/20 pl-6 md:pl-12">
              <h2 data-editor-key="story.title" className="font-script text-6xl leading-[.8] text-[#14382A] md:text-8xl">{templateValues.story.title}</h2>
              <div className="mt-10 grid max-w-2xl gap-5 text-base leading-8 text-[#14382A]/76 md:text-lg">
                <p data-editor-key="story.paragraph1" data-editor-multiline="true">{templateValues.story.paragraph1}</p>
                <p data-editor-key="story.paragraph2" data-editor-multiline="true">{templateValues.story.paragraph2}</p>
              </div>
              <p className="mt-12 font-nav text-[10px] font-medium uppercase tracking-[.25em] text-[#8D6D2D]">El comienzo de todo</p>
            </div>
          </div>
          <div className="mt-20"><NightPhotoGallery /></div>
        </section>
      ) : null}

      {templateValues.sections.schedule ? (
        <section id="cronograma" data-editor-component="schedule" className="scroll-animate bg-[#F7F1E5] px-5 py-20 md:px-8 md:py-28">
          <div className="mx-auto max-w-7xl">
            <div className="grid gap-7 border-b border-[#14382A]/22 pb-12 md:grid-cols-[.7fr_1.3fr] md:items-end">
              <div className="min-w-0">
                <p className="font-nav text-[10px] font-medium uppercase tracking-[.34em] text-[#8D6D2D]">El programa</p>
                <h2 className="mt-6 max-w-[22rem] font-script text-6xl leading-[.8] text-[#14382A] md:max-w-md md:text-7xl">El ritmo de la noche</h2>
              </div>
              <p className="max-w-md font-body text-sm leading-7 text-[#14382A]/68 md:justify-self-end">
                <span data-editor-key="event.dateLabel">{weddingData.event.dateLabel}</span><br />
                <span data-editor-key="event.venue">{weddingData.event.venue}</span>
              </p>
            </div>
            <div>
              {schedule.map((item, index) => {
                const Icon = item.icon;
                return (
                  <article key={item.title} className="grid grid-cols-[30px_1fr_auto] items-center gap-4 border-b border-[#14382A]/16 py-7 last:border-b-0 md:grid-cols-[70px_160px_1fr_auto] md:gap-6 md:py-10">
                    <span className="font-nav text-[10px] tracking-[.18em] text-[#8D6D2D]">0{index + 1}</span>
                    <p className="font-script text-4xl leading-none text-[#14382A] md:text-5xl">{item.time}</p>
                    <div className="col-span-3 mt-1 md:col-span-1 md:col-start-3 md:row-start-1 md:mt-0">
                      <h3 className="font-script text-3xl leading-none text-[#14382A] md:text-4xl">{item.title}</h3>
                      <p className="mt-2 text-sm text-[#14382A]/58">{item.note}</p>
                    </div>
                    <Icon className="col-start-3 row-start-1 h-5 w-5 justify-self-end text-[#B58A3C] md:col-start-4" aria-hidden="true" />
                  </article>
                );
              })}
            </div>
          </div>
        </section>
      ) : null}

      <GiftRegistry />

      {templateValues.sections.rsvp ? <Contact /> : null}

      {templateValues.sections.messages ? (
        <section id="mensajes" data-editor-component="messages" className="scroll-animate bg-[#09150F] px-5 py-20 md:px-8 md:py-28">
          <div className="mx-auto max-w-7xl">
            <div className="mb-11 flex items-center gap-4 text-[#D9B76F]">
              <CalendarHeart className="h-4 w-4" aria-hidden="true" />
              <p className="font-nav text-[10px] font-medium uppercase tracking-[.34em]">Mensajes de invitados</p>
            </div>
            <LoveMessages />
          </div>
        </section>
      ) : null}

      {templateValues.sections.faq ? (
        <section id="preguntas-frecuentes" data-editor-component="faq" className="scroll-animate bg-[#F3EFE4] px-5 py-20 md:px-8 md:py-28">
          <div className="mx-auto grid max-w-7xl gap-12 md:grid-cols-[.65fr_1.35fr] md:items-start">
            <div>
              <p className="font-nav text-[10px] font-medium uppercase tracking-[.34em] text-[#8D6D2D]">Para tenerlo todo claro</p>
              <h2 className="mt-7 max-w-[19rem] font-script text-4xl leading-[.86] text-[#14382A] md:text-5xl lg:text-5xl">
                <span className="block">Preguntas</span>
                <span className="block">utiles</span>
              </h2>
            </div>
            <div className="border-t border-[#14382A]/22">
              {faqItems.map(([question, answer], index) => (
                <details key={question} className="group border-b border-[#14382A]/18 py-6 md:py-7">
                  <summary className="flex cursor-pointer list-none items-center gap-5 text-[#14382A] [&::-webkit-details-marker]:hidden">
                    <span className="font-nav text-[10px] tracking-[.18em] text-[#8D6D2D]">0{index + 1}</span>
                    <span className="font-script text-3xl leading-none md:text-4xl">{question}</span>
                    <span className="ml-auto grid h-7 w-7 place-items-center border border-[#14382A]/28 text-lg leading-none transition-transform duration-300 group-open:rotate-45">+</span>
                  </summary>
                  <p className="ml-[49px] mt-5 max-w-xl text-sm leading-7 text-[#14382A]/68">{answer}</p>
                </details>
              ))}
            </div>
          </div>
        </section>
      ) : null}
    </>
  );
};

export default WeddingDetails;
