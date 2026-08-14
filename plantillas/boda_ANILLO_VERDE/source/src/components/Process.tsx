import { weddingData } from "@/data/weddingData";

const Process = () => {
  return (
    <section id="galeria" className="scroll-animate bg-white px-5 py-16 md:py-24">
      <div className="mx-auto max-w-6xl text-center">
        <p className="text-xs uppercase tracking-[0.4em] text-[#7FAF8E]">Fotos</p>
        <h2 className="mt-4 font-script text-5xl text-[#0F3D2E] md:text-7xl">Momentos</h2>
        <div className="mt-12 grid gap-5 md:grid-cols-2">
          {weddingData.gallery.map((src, index) => (
            <img
              key={src}
              src={src}
              alt={`Imagen de galería ${index + 1}`}
              className="h-[420px] w-full object-cover outline outline-1 -outline-offset-[12px] outline-white"
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Process;
