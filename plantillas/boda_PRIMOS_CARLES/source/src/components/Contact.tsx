import { weddingData } from "@/data/weddingData";
import { RSVP_FORM_URL } from "@/config/rsvp";
import flowersImage from "../../resources/flores.png";
import { templateValues } from "@/config/template-values";

const Contact = () => {
  return (
    <section id="confirmar-asistencia" data-editor-component="rsvp" className="scroll-animate bg-[#F8FCF8]">
      <div className="px-5 py-16 md:py-24">
        <div className="relative mx-auto max-w-5xl overflow-hidden border border-[#E2EFE5] bg-[#FBFEFB] px-6 py-10 text-center shadow-[0_18px_46px_rgba(15,61,46,0.08)] md:px-10 md:py-12">
          <img
            src={flowersImage}
            alt=""
            aria-hidden="true"
            className="pointer-events-none absolute -left-12 -top-12 h-40 w-auto -rotate-[10deg] object-contain opacity-[0.07] md:h-56"
          />
          <img
            src={flowersImage}
            alt=""
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-16 -right-12 h-44 w-auto rotate-[170deg] object-contain opacity-[0.05] md:h-60"
          />

          <div className="relative z-10 mx-auto max-w-3xl">
            <p
              data-editor-key="rsvp.noteTitle"
              className="font-nav text-sm uppercase tracking-[0.32em] text-[#7FAF8E] md:text-base"
            >
              {templateValues.rsvp.noteTitle}
            </p>
            <div className="mx-auto mt-5 h-px w-24 bg-[#D7E7DB]" />
            <p
              data-editor-key="rsvp.noteText"
              data-editor-multiline="true"
              className="mx-auto mt-6 max-w-2xl text-base leading-8 text-[#1F5E46] md:text-lg"
            >
              {templateValues.rsvp.noteText}
            </p>

            <div className="mx-auto mt-8 max-w-2xl border border-[#DDECE0] bg-white px-5 py-6 text-center shadow-[0_16px_40px_rgba(15,61,46,0.08)]">
              <p className="text-xs uppercase tracking-[0.36em] text-[#7FAF8E]">
                {"Dato opcional"}
              </p>
              <p className="mt-4 break-all font-nav text-lg tracking-[0.12em] text-[#0F3D2E] md:text-2xl">
                Sustituye este texto por la información de cada evento
              </p>
            </div>
          </div>
        </div>
      </div>

      <div
        id="confirmar-asistencia-cta"
        className="parallax-band min-h-[720px] md:min-h-[680px]"
        style={{
          backgroundImage:
            "radial-gradient(circle at top, var(--template-primary) 0%, var(--template-text) 38%, var(--template-primary-dark) 100%)",
        }}
      >
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(7,28,22,0.42),rgba(7,28,22,0.5))]" />
        <div className="relative flex min-h-[720px] items-center justify-center px-5 py-16 md:min-h-[680px] md:py-24">
          <div className="w-full max-w-4xl border border-white/70 bg-black/28 px-6 py-12 text-center text-white shadow-[0_24px_60px_rgba(0,0,0,0.18)] backdrop-blur-[4px] md:px-10 md:py-14">
            <div className="mx-auto flex max-w-3xl flex-col items-center justify-center">
              <h2 data-editor-key="rsvp.ctaTitle" className="font-script text-4xl text-white md:text-6xl">
                {templateValues.rsvp.ctaTitle}
              </h2>
              <div className="mx-auto mt-6 h-px w-24 bg-white/70" />
              <p
                data-editor-key="rsvp.ctaText"
                data-editor-multiline="true"
                className="mx-auto mt-6 max-w-2xl text-base leading-8 text-white/90 md:text-lg"
              >
                {templateValues.rsvp.ctaText}
              </p>
              <p className="mt-10 max-w-2xl font-nav text-sm tracking-[0.24em] text-white/82 md:text-base">
                <span data-editor-key="event.dateLabel">{weddingData.event.dateLabel}</span>
                {" · "}
                <span data-editor-key="event.city">{weddingData.event.city}</span>
              </p>
              <a
                href={RSVP_FORM_URL}
                className="font-nav mt-10 inline-flex h-14 min-w-[240px] items-center justify-center border border-white/70 bg-transparent px-7 text-sm uppercase tracking-[0.28em] text-white transition hover:bg-white hover:text-[#0F3D2E]"
              >
                Confirmar asistencia
              </a>
              <p className="mt-6 text-sm italic text-white/78 md:text-base">
                {"*Configura la fecha límite antes de publicar"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
