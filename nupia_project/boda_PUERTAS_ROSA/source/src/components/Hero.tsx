import { ArrowDown, MapPin } from "lucide-react";
import { weddingData } from "@/data/weddingData";
import { templateValues } from "@/config/template-values";

const Hero = () => {
  const backgroundImage = templateValues.images.hero || "/images/doors/rose-dinner-editorial.png";

  return (
    <section id="hero" data-editor-component="hero" className="scroll-animate bg-[#4A2735] text-[#FFF9F3]">
      <div className="relative isolate min-h-[calc(100dvh-var(--nav-height))] overflow-hidden">
        <img src={backgroundImage} alt="Mesa de celebracion con flores y luz de velas" className="absolute inset-0 -z-20 h-full w-full object-cover object-[68%_center]" />
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(74,39,53,.94)_0%,rgba(74,39,53,.68)_38%,rgba(74,39,53,.12)_76%,rgba(74,39,53,.38)_100%)]" />
        <div className="pointer-events-none absolute inset-[20px] border border-[#FFF9F3]/20" aria-hidden="true" />

        <div className="relative mx-auto flex min-h-[calc(100dvh-var(--nav-height))] max-w-7xl flex-col justify-between px-8 py-14 md:px-14 md:py-16">
          <div className="max-w-2xl pt-6 md:pt-12">
            <p data-editor-key="hero.eyebrow" className="font-nav text-[10px] font-medium uppercase tracking-[.34em] text-[#F3C8B3]">
              {templateValues.hero.eyebrow}
            </p>
            <h1 className="mt-7 font-script text-[clamp(4.3rem,10vw,9.5rem)] leading-[.76] tracking-normal text-[#FFF9F3]">
              <span className="block" data-editor-key="couple.partner1">{weddingData.couple.partner1}</span>
              <span className="my-4 block font-serif text-[.35em] italic leading-none text-[#F3C8B3]">&amp;</span>
              <span className="block" data-editor-key="couple.partner2">{weddingData.couple.partner2}</span>
            </h1>
          </div>

          <div className="flex flex-col justify-between gap-8 border-t border-[#FFF9F3]/28 pt-5 md:flex-row md:items-end">
            <div className="flex items-start gap-3 text-[#FFF9F3]/82">
              <MapPin className="mt-1 h-4 w-4 shrink-0 text-[#F3C8B3]" aria-hidden="true" />
              <p className="font-nav text-[10px] font-medium uppercase leading-6 tracking-[.25em]">
                <span data-editor-key="event.dateLabel">{weddingData.event.dateLabel}</span><br />
                <span data-editor-key="event.city">{weddingData.event.city}</span>
              </p>
            </div>
            <a href="#countdown" className="group inline-flex w-fit items-center gap-3 font-nav text-[10px] font-medium uppercase tracking-[.25em] text-[#FFF9F3] transition-colors hover:text-[#F3C8B3]">
              Descubre el dia
              <ArrowDown className="h-4 w-4 transition-transform duration-300 group-hover:translate-y-1" aria-hidden="true" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
