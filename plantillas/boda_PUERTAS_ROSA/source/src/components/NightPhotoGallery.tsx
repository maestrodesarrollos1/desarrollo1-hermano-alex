import { useState } from "react";
import { templateValues } from "@/config/template-values";

const galleryItems = [
  { src: templateValues.images.galeria1 || "/couple-gallery/photo-1.jpg", title: "Mirada", note: "01 / Primeras luces", fallback: "linear-gradient(160deg, #6f374b, #d99fa6 54%, #fff3e9)" },
  { src: templateValues.images.galeria2 || "/couple-gallery/photo-2.jpg", title: "Complices", note: "02 / Sin prisa", fallback: "linear-gradient(160deg, #5b3040, #bd7c8c 56%, #f4d5ca)" },
  { src: templateValues.images.galeria3 || "/couple-gallery/photo-3.jpg", title: "Promesa", note: "03 / Un instante", fallback: "linear-gradient(160deg, #814356, #e6b2ad 52%, #fff5ed)" },
  { src: templateValues.images.galeria4 || "/couple-gallery/photo-4.jpg", title: "Brindis", note: "04 / Por nosotros", fallback: "linear-gradient(160deg, #5b3040, #c58f79 53%, #f9ded0)" },
  { src: templateValues.images.galeria5 || "/couple-gallery/photo-5.jpg", title: "Baile", note: "05 / La noche", fallback: "linear-gradient(160deg, #44222f, #9b5b6d 48%, #e9b5ab)" },
] as const;

const NightPhotoGallery = () => {
  const [activeIndex, setActiveIndex] = useState(2);

  return (
    <section className="rose-photo-wall relative left-1/2 w-screen -translate-x-1/2 overflow-hidden py-20 md:py-28">
      <style>{`
        .rose-photo-wall { background: #5a3040; color: #fff9f3; }
        .rose-photo-wall__eyebrow, .rose-photo-wall__note, .rose-photo-wall__counter { color: #f3c8b3; }
        .rose-photo-wall__description { color: rgba(255, 249, 243, .68); }
        .rose-photo-wall__stage { height: clamp(34rem, 55vw, 42rem); }
        .rose-photo-wall__panel { transition: flex 750ms cubic-bezier(.22,1,.36,1), filter 500ms ease, transform 500ms ease; }
        .rose-photo-wall__panel:not(.is-active) { filter: saturate(.66) brightness(.72); }
        .rose-photo-wall__panel:not(.is-active):hover { filter: saturate(.9) brightness(.88); }
        .rose-photo-wall__shade { background: linear-gradient(180deg, rgba(68,31,43,.08) 18%, rgba(68,31,43,.82) 100%); }
        .rose-photo-wall__panel-copy { color: #fff9f3; }
        @media (max-width: 767px) {
          .rose-photo-wall__stage { height: 34rem; }
          .rose-photo-wall__panel-copy { padding: 1.1rem .75rem; }
          .rose-photo-wall__panel.is-active .rose-photo-wall__title { font-size: 2.25rem; }
        }
        @media (prefers-reduced-motion: reduce) { .rose-photo-wall__panel { transition-duration: 1ms !important; } }
      `}</style>
      <div className="mx-auto flex max-w-7xl flex-col gap-10 px-5 md:flex-row md:items-end md:justify-between md:px-8">
        <div className="max-w-xl">
          <p className="rose-photo-wall__eyebrow font-nav text-[10px] font-medium uppercase tracking-[.34em]">El album de la casa</p>
          <h3 className="mt-7 font-script text-5xl leading-[.84] md:text-7xl">Cinco momentos. Una historia.</h3>
        </div>
        <p className="rose-photo-wall__description max-w-xs text-sm leading-7">Un mural pensado para sustituir cada panel por una fotografia de la pareja. Pulsa una imagen para descubrirla.</p>
      </div>

      <div className="rose-photo-wall__stage mx-auto mt-14 flex max-w-[112rem] gap-1 px-3 md:mt-16 md:px-5">
        {galleryItems.map((item, index) => {
          const isActive = activeIndex === index;
          return (
            <button
              key={item.title}
              type="button"
              aria-pressed={isActive}
              aria-label={`Ver imagen ${item.title}`}
              onClick={() => setActiveIndex(index)}
              className={`rose-photo-wall__panel group relative min-w-0 overflow-hidden border border-[#FFF9F3]/28 text-left outline-none focus-visible:ring-2 focus-visible:ring-[#F3C8B3] ${isActive ? "is-active" : ""}`}
              style={{ flex: isActive ? "4.4 1 0%" : "1 1 0%" }}
            >
              <span className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-[1.04]" style={{ backgroundImage: `url("${item.src}"), ${item.fallback}` }} />
              <span className="rose-photo-wall__shade absolute inset-0" />
              <span className="rose-photo-wall__panel-copy absolute bottom-0 left-0 right-0 p-5 md:p-7" style={isActive ? undefined : { writingMode: "vertical-rl" }}>
                <span className="rose-photo-wall__note block font-nav text-[10px] font-medium uppercase tracking-[.24em]">{item.note}</span>
                <span className={`rose-photo-wall__title mt-3 block font-script leading-none ${isActive ? "text-5xl md:text-7xl" : "text-3xl"}`}>{item.title}</span>
              </span>
            </button>
          );
        })}
      </div>

      <div className="mx-auto mt-7 flex max-w-7xl items-center justify-between px-5 md:px-8">
        <p className="rose-photo-wall__eyebrow font-nav text-[10px] uppercase tracking-[.24em]">Selecciona una fotografia</p>
        <p className="rose-photo-wall__counter font-nav text-[10px] uppercase tracking-[.24em]">{String(activeIndex + 1).padStart(2, "0")} / {String(galleryItems.length).padStart(2, "0")}</p>
      </div>
    </section>
  );
};

export default NightPhotoGallery;
