import { ArrowDown, MapPin } from "lucide-react";
import { weddingData } from "@/data/weddingData";
import { templateValues } from "@/config/template-values";

const Hero = () => {
  const backgroundImage = templateValues.images.landing || templateValues.images.hero || "/images/intro/dinner-editorial.png";

  return (
    <section id="hero" data-editor-component="hero" className="scroll-animate bg-[#08130d] text-[#F7F1E5]">
      <div className="relative isolate min-h-[calc(100dvh-var(--nav-height))] overflow-hidden">
        <img src={backgroundImage} alt="Mesa de celebracion con flores y luz de velas" className="absolute inset-0 -z-20 h-full w-full object-cover object-[68%_center]" />
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(5,13,8,.94)_0%,rgba(5,13,8,.68)_38%,rgba(5,13,8,.12)_76%,rgba(5,13,8,.38)_100%)]" />
        <div className="pointer-events-none absolute inset-[20px] border border-[#F7F1E5]/20" aria-hidden="true" />

        <div className="relative mx-auto flex min-h-[calc(100dvh-var(--nav-height))] max-w-7xl flex-col justify-between px-8 py-14 md:px-14 md:py-16">
          <div className="max-w-2xl pt-6 md:pt-12">
            <p data-editor-key="hero.eyebrow" className="font-nav text-[10px] font-medium uppercase tracking-[.34em] text-[#D9B76F]">
              {templateValues.hero.eyebrow}
            </p>
            <h1 className="mt-7 font-script text-[clamp(4.3rem,10vw,9.5rem)] leading-[.76] tracking-normal text-[#F7F1E5]">
              <span className="block" data-editor-key="couple.partner1">{weddingData.couple.partner1}</span>
              <span className="my-4 block font-serif text-[.35em] italic leading-none text-[#D9B76F]">&amp;</span>
              <span className="block" data-editor-key="couple.partner2">{weddingData.couple.partner2}</span>
            </h1>
          </div>

          <div className="flex flex-col justify-between gap-8 border-t border-[#F7F1E5]/28 pt-5 md:flex-row md:items-end">
            <div className="flex items-start gap-3 text-[#F7F1E5]/82">
              <MapPin className="mt-1 h-4 w-4 shrink-0 text-[#D9B76F]" aria-hidden="true" />
              <p className="font-nav text-[10px] font-medium uppercase leading-6 tracking-[.25em]">
                <span data-editor-key="event.dateLabel">{weddingData.event.dateLabel}</span><br />
                <span data-editor-key="event.city">{weddingData.event.city}</span>
              </p>
            </div>
            <a href="#countdown" className="group inline-flex w-fit items-center gap-3 font-nav text-[10px] font-medium uppercase tracking-[.25em] text-[#F7F1E5] transition-colors hover:text-[#D9B76F]">
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
