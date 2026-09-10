import { useRef, useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { templateValues } from "@/config/template-values";

const photos = [
  ["galeria1", "01", "Antes de llegar"], ["galeria2", "02", "La conversacion"], ["galeria3", "03", "Una promesa"],
  ["galeria4", "04", "La mesa larga"], ["galeria5", "05", "Cuando cae la noche"], ["galeria6", "06", "La ultima cancion"],
] as const;

const NightPhotoGallery = () => {
  const rail = useRef<HTMLDivElement>(null);
  const [current, setCurrent] = useState(0);
  const move = (direction: number) => {
    const next = Math.max(0, Math.min(photos.length - 1, current + direction));
    rail.current?.children[next]?.scrollIntoView({ behavior: "smooth", inline: "start", block: "nearest" });
    setCurrent(next);
  };
  return (
    <section className="atlas-gallery" aria-label="Album de la pareja">
      <style>{`
        .atlas-gallery { overflow:hidden; background:var(--template-primary-dark); color:var(--template-soft); padding:clamp(72px,10vw,150px) 0; }
        .atlas-gallery__head { display:flex; align-items:end; justify-content:space-between; gap:28px; max-width:1280px; margin:0 auto 42px; padding:0 clamp(20px,5vw,70px); }
        .atlas-gallery__kicker, .atlas-gallery__index { margin:0; color:var(--template-primary); font-family:var(--font-nav); font-size:10px; letter-spacing:.28em; text-transform:uppercase; }
        .atlas-gallery h2 { max-width:590px; margin:18px 0 0; font-family:var(--font-title); font-size:clamp(3.2rem,6vw,6.8rem); font-weight:400; line-height:.8; }
        .atlas-gallery__controls { display:flex; gap:8px; } .atlas-gallery__controls button { display:grid; width:43px; height:43px; place-items:center; border:1px solid color-mix(in srgb,var(--template-soft) 32%,transparent); background:transparent; color:var(--template-soft); cursor:pointer; transition:background .2s ease,color .2s ease; } .atlas-gallery__controls button:hover { background:var(--template-soft); color:var(--template-primary-dark); }
        .atlas-gallery__rail { display:flex; gap:12px; overflow-x:auto; padding:0 clamp(20px,5vw,70px) 10px; scroll-snap-type:x mandatory; scrollbar-width:none; } .atlas-gallery__rail::-webkit-scrollbar { display:none; }
        .atlas-gallery__frame { position:relative; flex:0 0 min(72vw,720px); aspect-ratio:1.35; overflow:hidden; scroll-snap-align:start; background:var(--template-primary); } .atlas-gallery__frame:nth-child(even) { aspect-ratio:.82; flex-basis:min(43vw,430px); }
        .atlas-gallery__frame::after { content:""; position:absolute; inset:14px; border:1px solid rgba(255,255,255,.42); pointer-events:none; } .atlas-gallery__image { width:100%; height:100%; object-fit:cover; filter:saturate(.78); } .atlas-gallery__fallback { width:100%; height:100%; background:repeating-linear-gradient(45deg,color-mix(in srgb,var(--template-primary) 80%,var(--template-primary-dark)) 0 1px,transparent 1px 12px); }
        .atlas-gallery__caption { position:absolute; left:24px; right:24px; bottom:21px; display:flex; justify-content:space-between; gap:12px; color:#fff; font-family:var(--font-nav); font-size:10px; letter-spacing:.2em; text-transform:uppercase; } .atlas-gallery__caption span:last-child { max-width:65%; text-align:right; }
        @media (max-width:680px) { .atlas-gallery__head { align-items:start; flex-direction:column; } .atlas-gallery__frame { flex-basis:84vw; } .atlas-gallery__frame:nth-child(even) { flex-basis:70vw; } }
      `}</style>
      <div className="atlas-gallery__head"><div><p className="atlas-gallery__kicker">Capitulo II / Archivo vivo</p><h2>Un album que se mueve con vosotros.</h2></div><div><p className="atlas-gallery__index">{String(current + 1).padStart(2, "0")} / 06</p><div className="atlas-gallery__controls"><button aria-label="Foto anterior" onClick={() => move(-1)}><ArrowLeft size={17} /></button><button aria-label="Foto siguiente" onClick={() => move(1)}><ArrowRight size={17} /></button></div></div></div>
      <div className="atlas-gallery__rail" ref={rail} onScroll={(event) => { const width = (event.currentTarget.firstElementChild as HTMLElement)?.offsetWidth ?? 1; setCurrent(Math.round(event.currentTarget.scrollLeft / (width + 12))); }}>
        {photos.map(([slot, number, title]) => { const src = templateValues.images[slot]; return <figure className="atlas-gallery__frame" key={slot}>{src ? <img className="atlas-gallery__image" src={src} alt={`Fotografia ${number} de la pareja`} loading="lazy" /> : <div className="atlas-gallery__fallback" />}<figcaption className="atlas-gallery__caption"><span>{number}</span><span>{title}</span></figcaption></figure>; })}
      </div>
    </section>
  );
};

export default NightPhotoGallery;
