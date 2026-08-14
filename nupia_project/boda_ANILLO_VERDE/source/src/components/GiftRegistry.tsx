import { Gift, HeartHandshake, Plane } from "lucide-react";

const giftOptions = [
  { title: "Lista de bodas", text: "Una seleccion de regalos elegidos con calma.", icon: Gift },
  { title: "Fondo viaje", text: "Una forma de formar parte de nuestra proxima aventura.", icon: Plane },
  { title: "Aportacion libre", text: "El gesto es lo importante; vosotros elegis como.", icon: HeartHandshake },
] as const;

const GiftRegistry = () => {
  return (
    <section id="regalos" data-editor-component="gifts" className="scroll-animate relative isolate overflow-hidden bg-[#09150f] px-5 py-20 text-[#F7F1E5] md:px-8 md:py-28">
      <img src="/images/intro/dinner-editorial.png" alt="Detalle de una mesa para la celebracion" className="absolute inset-0 -z-20 h-full w-full object-cover object-[70%_center] opacity-75" />
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(5,13,8,.96)_0%,rgba(5,13,8,.82)_44%,rgba(5,13,8,.38)_100%)]" />
      <div className="mx-auto grid max-w-7xl gap-12 md:grid-cols-[.9fr_1.1fr] md:items-end">
        <div className="max-w-md">
          <p className="font-nav text-[10px] font-medium uppercase tracking-[.34em] text-[#D9B76F]">Regalos</p>
          <h2 className="mt-6 font-script text-6xl leading-[.8] md:text-8xl">Un gesto para el futuro</h2>
          <p className="mt-7 text-sm leading-7 text-[#F7F1E5]/70">La mayor alegria es compartir el dia con vosotros. Para quienes quieran tener un detalle, estas son algunas posibilidades.</p>
        </div>

        <div className="border-y border-[#F7F1E5]/24 md:border-t">
          {giftOptions.map((item, index) => {
            const Icon = item.icon;
            return (
              <article key={item.title} className="group grid grid-cols-[42px_1fr_auto] items-center gap-4 border-b border-[#F7F1E5]/18 py-7 last:border-b-0 md:py-9">
                <span className="font-nav text-[10px] tracking-[.18em] text-[#D9B76F]">0{index + 1}</span>
                <div>
                  <h3 className="font-script text-3xl leading-none md:text-4xl">{item.title}</h3>
                  <p className="mt-3 max-w-sm text-sm leading-6 text-[#F7F1E5]/62">{item.text}</p>
                </div>
                <Icon className="h-5 w-5 text-[#D9B76F] transition-transform duration-300 group-hover:-translate-y-1" aria-hidden="true" />
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default GiftRegistry;
