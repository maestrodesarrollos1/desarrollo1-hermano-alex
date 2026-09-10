import { CalendarCheck, Mail, Phone } from "lucide-react";
import { weddingData } from "@/data/weddingData";
import { RSVP_FORM_URL } from "@/config/rsvp";
import flowersImage from "../../resources/flores.png";
import { templateValues } from "@/config/template-values";

const Contact = () => {
  return (
    <section id="confirmar-asistencia" data-editor-component="rsvp" className="scroll-animate bg-white px-5 py-16 md:py-24">
      <div className="mx-auto grid max-w-6xl overflow-hidden border border-[#DDECE0] bg-[#FBFEFB] shadow-[0_26px_76px_rgba(15,61,46,0.1)] lg:grid-cols-[1.05fr_0.95fr]">
        <div className="relative min-h-[30rem] bg-[#0D1F18] p-6 text-white md:p-10">
          <img
            src={flowersImage}
            alt=""
            aria-hidden="true"
            className="pointer-events-none absolute -left-12 -top-12 h-48 w-auto -rotate-[12deg] object-contain opacity-[0.14] md:h-64"
          />
          <img
            src={flowersImage}
            alt=""
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-16 -right-10 h-52 w-auto rotate-[164deg] object-contain opacity-[0.1] md:h-72"
          />
          <div className="relative flex h-full flex-col justify-between">
            <div>
              <p
                data-editor-key="rsvp.noteTitle"
                className="font-nav text-xs uppercase tracking-[0.34em] text-white/54"
              >
                {templateValues.rsvp.noteTitle}
              </p>
              <h2 data-editor-key="rsvp.ctaTitle" className="mt-5 font-script text-5xl leading-none md:text-7xl">
                {templateValues.rsvp.ctaTitle}
              </h2>
              <p
                data-editor-key="rsvp.ctaText"
                data-editor-multiline="true"
                className="mt-6 max-w-xl text-base leading-8 text-white/78"
              >
                {templateValues.rsvp.ctaText}
              </p>
            </div>

            <p className="mt-12 font-nav text-sm uppercase tracking-[0.22em] text-white/72">
              <span data-editor-key="event.dateLabel">{weddingData.event.dateLabel}</span>
              {" · "}
              <span data-editor-key="event.city">{weddingData.event.city}</span>
            </p>
          </div>
        </div>

        <div className="grid content-center gap-5 p-6 md:p-10">
          <p
            data-editor-key="rsvp.noteText"
            data-editor-multiline="true"
            className="text-base leading-8 text-[#1F5E46] md:text-lg"
          >
            {templateValues.rsvp.noteText}
          </p>

          <div className="grid gap-3">
            {weddingData.contact.email ? (
              <div className="flex items-center gap-3 border border-[#EAF6EC] bg-white px-4 py-4">
                <Mail className="h-5 w-5 text-[#A7605F]" aria-hidden="true" />
                <span data-editor-key="contact.email" className="break-all text-sm text-[#1F5E46]">
                  {weddingData.contact.email}
                </span>
              </div>
            ) : null}
            <div className="flex items-center gap-3 border border-[#EAF6EC] bg-white px-4 py-4">
              <Phone className="h-5 w-5 text-[#A7605F]" aria-hidden="true" />
              <span data-editor-key="contact.phone" className="text-sm text-[#1F5E46]">
                {weddingData.contact.phone}
              </span>
            </div>
          </div>

          <a
            href={RSVP_FORM_URL || undefined}
            aria-disabled={!RSVP_FORM_URL}
            onClick={(event) => {
              if (!RSVP_FORM_URL) event.preventDefault();
            }}
            className="font-nav mt-2 inline-flex min-h-14 items-center justify-center gap-3 border border-[#A7605F] bg-[#A7605F] px-6 text-sm uppercase tracking-[0.26em] text-white transition hover:bg-[#0F3D2E] hover:border-[#0F3D2E] aria-disabled:cursor-not-allowed aria-disabled:opacity-55"
          >
            <CalendarCheck className="h-5 w-5" aria-hidden="true" />
            Confirmar asistencia
          </a>
          <p className="text-center text-sm italic text-[#7FAF8E]">El enlace de confirmación se añadirá antes de publicar</p>
        </div>
      </div>
    </section>
  );
};

export default Contact;
