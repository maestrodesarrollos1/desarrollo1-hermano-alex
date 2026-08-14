import { useState } from "react";
import type { CSSProperties } from "react";
import { templateValues } from "@/config/template-values";

const galleryItems = [
  {
    src: templateValues.images.galeria1 || "/couple-gallery/photo-1.jpg",
    title: "Mirada",
    fallback: "linear-gradient(135deg, #2b1119, #a7605f 48%, #f1ddd5)",
  },
  {
    src: templateValues.images.galeria2 || "/couple-gallery/photo-2.jpg",
    title: "Brindis",
    fallback: "linear-gradient(135deg, #4a1f2a, #c38a78 46%, #fff7f2)",
  },
  {
    src: templateValues.images.galeria3 || "/couple-gallery/photo-3.jpg",
    title: "Baile",
    fallback: "linear-gradient(135deg, #1f1720, #7b3f4a 52%, #f1ddd5)",
  },
  {
    src: templateValues.images.galeria4 || "/couple-gallery/photo-4.jpg",
    title: "Detalle",
    fallback: "linear-gradient(135deg, #4a1f2a, #b9856f 42%, #fffaf8)",
  },
  {
    src: templateValues.images.galeria5 || "/couple-gallery/photo-5.jpg",
    title: "Noche",
    fallback: "linear-gradient(135deg, #24121a, #63323b 48%, #d8a898)",
  },
  {
    src: templateValues.images.galeria6 || "/couple-gallery/photo-6.jpg",
    title: "Promesa",
    fallback: "linear-gradient(135deg, #4a1f2a, #a7605f 45%, #f6e8df)",
  },
] as const;

const positions = [
  "md:left-[50%] md:top-[2%] md:-translate-x-1/2",
  "md:right-[3%] md:top-[22%]",
  "md:right-[10%] md:bottom-[10%]",
  "md:left-[50%] md:bottom-[0%] md:-translate-x-1/2",
  "md:left-[10%] md:bottom-[10%]",
  "md:left-[3%] md:top-[22%]",
] as const;

const NightPhotoGallery = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeItem = galleryItems[activeIndex];

  return (
    <div className="night-gallery relative mx-auto w-full max-w-[42rem]">
      <style>{`
        @keyframes nightGalleryOrbit {
          0%, 100% { transform: translate3d(0, 0, 0) rotate(var(--tilt)); }
          50% { transform: translate3d(0, -8px, 0) rotate(calc(var(--tilt) * -1)); }
        }
        .night-gallery-tile {
          animation: nightGalleryOrbit 5.6s ease-in-out infinite;
          animation-delay: var(--delay);
        }
        .night-gallery-tile:hover,
        .night-gallery-tile.is-active {
          animation-play-state: paused;
        }
      `}</style>

      <div className="relative h-[31rem] md:h-[42rem]">
        <div
          className="absolute left-1/2 top-1/2 z-10 grid h-[19rem] w-[19rem] -translate-x-1/2 -translate-y-1/2 place-items-center overflow-hidden border border-[#DDECE0] bg-white p-3 shadow-[0_30px_80px_rgba(15,61,46,0.14)] md:h-[26rem] md:w-[26rem]"
          style={{ clipPath: "polygon(50% 0%, 94% 25%, 94% 75%, 50% 100%, 6% 75%, 6% 25%)" }}
        >
          <div
            className="h-full w-full bg-cover bg-center transition duration-500"
            style={{
              backgroundImage: `${activeItem.fallback}, url("${activeItem.src}")`,
              clipPath: "polygon(50% 0%, 94% 25%, 94% 75%, 50% 100%, 6% 75%, 6% 25%)",
            }}
          />
          <div className="absolute inset-3 bg-[linear-gradient(180deg,transparent_35%,rgba(15,8,12,.66)_100%)]" />
          <div className="absolute bottom-12 left-1/2 w-52 -translate-x-1/2 text-center text-white md:bottom-16">
            <p className="font-nav text-[10px] uppercase tracking-[0.3em] text-white/74">Galeria privada</p>
            <p className="mt-2 font-script text-4xl leading-none md:text-5xl">{activeItem.title}</p>
          </div>
        </div>

        {galleryItems.map((item, index) => (
          <button
            key={item.src}
            type="button"
            onClick={() => setActiveIndex(index)}
            className={`night-gallery-tile absolute h-24 w-24 border border-[#DDECE0] bg-white p-1.5 shadow-[0_18px_42px_rgba(15,61,46,0.13)] transition duration-300 hover:z-20 hover:scale-105 md:h-32 md:w-32 ${positions[index]} ${
              activeIndex === index ? "is-active z-20 scale-105 border-[#0F3D2E]" : "z-0"
            }`}
            style={
              {
                "--delay": `${index * -0.45}s`,
                "--tilt": `${index % 2 === 0 ? -2 : 2}deg`,
                clipPath: "polygon(50% 0%, 94% 25%, 94% 75%, 50% 100%, 6% 75%, 6% 25%)",
              } as CSSProperties
            }
            aria-label={`Mostrar imagen ${item.title}`}
          >
            <span
              className="block h-full w-full bg-cover bg-center"
              style={{
                backgroundImage: `${item.fallback}, url("${item.src}")`,
                clipPath: "polygon(50% 0%, 94% 25%, 94% 75%, 50% 100%, 6% 75%, 6% 25%)",
              }}
            />
          </button>
        ))}
      </div>
    </div>
  );
};

export default NightPhotoGallery;
