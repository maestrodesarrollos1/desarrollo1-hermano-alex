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

        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(5,15,11,0.12)_0%,rgba(5,15,11,0.18)_35%,rgba(5,15,11,0.58)_100%)]" />

        <div className="pointer-events-none absolute inset-4 border border-white/45 sm:inset-6 md:inset-8" />

        <div className="relative mx-auto flex h-full max-w-6xl flex-col items-start justify-end px-9 pb-12 pt-12 text-left text-white sm:px-14 sm:pb-14 sm:pt-16 md:pb-16 md:pt-20">
          <p
            data-editor-key="hero.eyebrow"
            className="font-nav text-xs uppercase tracking-[0.34em] text-white/90 md:text-sm md:tracking-[0.46em]"
          >
            {templateValues.hero.eyebrow}
          </p>

          <h1 className="mt-4 max-w-4xl font-script text-3xl leading-tight sm:text-4xl md:mt-5 md:text-5xl lg:text-6xl">
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
