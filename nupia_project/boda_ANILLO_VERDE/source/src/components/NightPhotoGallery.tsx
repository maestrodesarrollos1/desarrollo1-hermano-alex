const galleryItems = [
  { src: "/couple-gallery/photo-1.jpg", title: "Mirada", fallback: "linear-gradient(135deg, #123c2d, #628d70)" },
  { src: "/couple-gallery/photo-2.jpg", title: "Brindis", fallback: "linear-gradient(135deg, #1e4c39, #d3bb83)" },
  { src: "/couple-gallery/photo-3.jpg", title: "Baile", fallback: "linear-gradient(135deg, #081711, #3c7656)" },
  { src: "/couple-gallery/photo-4.jpg", title: "Detalle", fallback: "linear-gradient(135deg, #315b47, #e8dfc8)" },
  { src: "/couple-gallery/photo-5.jpg", title: "Noche", fallback: "linear-gradient(135deg, #06100b, #7a6332)" },
  { src: "/couple-gallery/photo-6.jpg", title: "Promesa", fallback: "linear-gradient(135deg, #294d3a, #95b198)" },
] as const;

const NightPhotoGallery = () => {
  const featured = galleryItems[0];
  const loopItems = [...galleryItems, ...galleryItems] as const;

  return (
    <section className="relative left-1/2 w-screen -translate-x-1/2 overflow-hidden bg-[#09150f] py-20 text-[#F7F1E5] md:py-28">
      <style>{`
        @keyframes archiveRailMove { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        .archive-rail { animation: archiveRailMove 42s linear infinite; }
        .archive-rail:hover { animation-play-state: paused; }
        @media (prefers-reduced-motion: reduce) { .archive-rail { animation: none; } }
      `}</style>
      <div className="pointer-events-none absolute left-[9%] top-0 h-full w-px bg-[#F7F1E5]/12" />
      <div className="relative mx-auto max-w-7xl px-5 md:px-8">
        <div className="grid gap-10 lg:grid-cols-[.62fr_1.38fr] lg:items-end">
          <div className="lg:pb-5">
            <p className="font-nav text-[10px] font-medium uppercase tracking-[.34em] text-[#D9B76F]">Archivo privado</p>
            <h3 className="mt-7 max-w-[19rem] font-script text-4xl leading-[.86] md:text-5xl lg:text-5xl">
              <span className="block">Un album</span>
              <span className="block">en movimiento</span>
            </h3>
            <p className="mt-8 max-w-sm text-sm leading-7 text-[#F7F1E5]/64">Cada marco se preparara para una fotografia real. Un gesto, una escena, una memoria.</p>
          </div>

          <a href={featured.src} className="group relative block overflow-hidden border border-[#F7F1E5]/24 p-3">
            <span className="block aspect-[16/10] bg-cover bg-center transition-transform duration-700 group-hover:scale-[1.03]" style={{ backgroundImage: `url("${featured.src}"), ${featured.fallback}` }} />
            <span className="absolute inset-3 bg-[linear-gradient(180deg,transparent_36%,rgba(4,12,8,.82)_100%)]" />
            <span className="absolute bottom-8 left-8 right-8 flex items-end justify-between gap-5">
              <span>
                <span className="block font-nav text-[10px] font-medium uppercase tracking-[.27em] text-[#D9B76F]">Folio 01</span>
                <span className="mt-3 block font-script text-5xl leading-none">{featured.title}</span>
              </span>
              <span className="font-nav text-[10px] uppercase tracking-[.22em] text-[#F7F1E5]/66">Ver imagen</span>
            </span>
          </a>
        </div>

        <div className="relative mt-14 overflow-hidden">
          <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-[#09150f] to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-[#09150f] to-transparent" />
          <div className="archive-rail flex w-max gap-5">
            {loopItems.map((item, index) => (
              <a key={`${item.src}-${index}`} href={item.src} className="group block w-48 shrink-0 md:w-60">
                <span className="block border border-[#F7F1E5]/20 bg-[#F7F1E5]/5 p-2 transition duration-300 group-hover:-translate-y-2 group-hover:border-[#D9B76F]">
                  <span className="block aspect-[4/5] bg-cover bg-center" style={{ backgroundImage: `url("${item.src}"), ${item.fallback}` }} />
                </span>
                <span className="mt-4 flex items-center justify-between border-t border-[#F7F1E5]/18 pt-3">
                  <span className="font-script text-3xl leading-none">{item.title}</span>
                  <span className="font-nav text-[10px] tracking-[.18em] text-[#D9B76F]">{String((index % galleryItems.length) + 1).padStart(2, "0")}</span>
                </span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default NightPhotoGallery;
