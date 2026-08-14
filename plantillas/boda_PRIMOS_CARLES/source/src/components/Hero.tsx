import { weddingData } from "@/data/weddingData";
import { templateValues } from "@/config/template-values";

const Hero = () => {
  const heroImage = templateValues.images.landing || templateValues.images.hero;
  const backgroundImage = heroImage
    ? `linear-gradient(180deg, rgba(5,15,11,0.12) 0%, rgba(5,15,11,0.2) 35%, rgba(5,15,11,0.66) 100%), url("${heroImage}")`
    : "radial-gradient(circle at top, var(--template-primary) 0%, var(--template-text) 35%, var(--template-primary-dark) 78%)";

  return (
    <section id="hero" data-editor-component="hero" className="scroll-animate scroll-mt-[84px] bg-[#0D1F18]">
      <div
        className="relative h-[calc(100dvh-var(--nav-height))] min-h-[34rem] overflow-hidden bg-cover bg-center"
        style={{ backgroundColor: "var(--template-primary-dark)", backgroundImage }}
      >
        <div className="absolute -left-24 top-20 h-72 w-72 rounded-full border border-white/10" aria-hidden="true" />
        <div className="absolute -right-20 bottom-10 h-96 w-96 rounded-full border border-white/10" aria-hidden="true" />

        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(5,15,11,0.12)_0%,rgba(5,15,11,0.18)_35%,rgba(5,15,11,0.58)_100%)]" />

        <div className="pointer-events-none absolute inset-4 border-2 border-white/60 sm:inset-6 md:inset-8" />

        <div className="relative mx-auto flex h-full max-w-6xl flex-col items-center justify-end px-5 pb-10 pt-12 text-center text-white sm:px-6 sm:pb-14 sm:pt-16 md:pb-16 md:pt-20">
          <p
            data-editor-key="hero.eyebrow"
            className="font-nav text-xs uppercase tracking-[0.34em] text-white/90 md:text-sm md:tracking-[0.46em]"
          >
            {templateValues.hero.eyebrow}
          </p>

          <h1 className="mt-5 font-script text-4xl leading-tight sm:text-5xl md:mt-6 md:text-6xl">
            <span data-editor-key="couple.partner1">{weddingData.couple.partner1}</span>
            {" y "}
            <span data-editor-key="couple.partner2">{weddingData.couple.partner2}</span>
          </h1>

          <div className="mt-6 h-px w-24 bg-white/80 md:w-28" />

          <p className="font-nav mt-6 text-xs uppercase leading-7 tracking-[0.24em] text-white/92 sm:text-sm md:text-base md:tracking-[0.34em]">
            <span data-editor-key="event.dateLabel">{weddingData.event.dateLabel}</span>
            {" - "}
            <span data-editor-key="event.city">{weddingData.event.city}</span>
          </p>
        </div>
      </div>
    </section>
  );
};

export default Hero;
