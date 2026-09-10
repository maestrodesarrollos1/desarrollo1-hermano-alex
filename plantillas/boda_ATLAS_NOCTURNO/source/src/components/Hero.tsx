import { ArrowDownRight, MapPin } from "lucide-react";
import { weddingData } from "@/data/weddingData";
import { templateValues } from "@/config/template-values";

const Hero = () => {
  const image = templateValues.images.landing || templateValues.images.hero;
  return (
    <section id="hero" data-editor-component="hero" className="atlas-hero scroll-animate">
      <style>{`
        .atlas-hero { background:var(--template-primary-dark); color:var(--template-soft); }
        .atlas-hero__grid { min-height:calc(100dvh - var(--nav-height)); display:grid; grid-template-columns:minmax(0,1fr) minmax(0,1fr); }
        .atlas-hero__copy { position:relative; display:flex; min-height:580px; flex-direction:column; justify-content:space-between; padding:clamp(32px,7vw,112px); }
        .atlas-hero__copy::before { content:""; position:absolute; inset:24px 0 24px 24px; border:1px solid color-mix(in srgb,var(--template-soft) 20%,transparent); pointer-events:none; }
        .atlas-hero__eyebrow, .atlas-hero__meta { margin:0; color:var(--template-primary); font-family:var(--font-nav); font-size:10px; font-weight:500; letter-spacing:.3em; line-height:1.65; text-transform:uppercase; }
        .atlas-hero h1 { position:relative; z-index:1; margin:44px 0; font-family:var(--font-title); font-size:clamp(4.6rem,9vw,10rem); font-weight:400; line-height:.72; }
        .atlas-hero h1 span { display:block; } .atlas-hero h1 i { display:block; margin:18px 0; color:var(--template-primary); font-family:Georgia,serif; font-size:.33em; font-weight:400; line-height:.45; }
        .atlas-hero__footer { display:flex; justify-content:space-between; gap:18px; border-top:1px solid color-mix(in srgb,var(--template-soft) 22%,transparent); padding-top:18px; }
        .atlas-hero__location { display:flex; align-items:flex-start; gap:10px; color:color-mix(in srgb,var(--template-soft) 78%,transparent); }
        .atlas-hero__location svg { color:var(--template-primary); }
        .atlas-hero__discover { display:inline-flex; align-items:center; gap:9px; color:var(--template-soft); font-family:var(--font-nav); font-size:10px; letter-spacing:.22em; text-transform:uppercase; }
        .atlas-hero__visual { position:relative; min-height:460px; overflow:hidden; background:var(--template-primary); }
        .atlas-hero__visual::before { content:""; position:absolute; inset:0; background:repeating-linear-gradient(90deg,rgba(255,255,255,.12) 0 1px,transparent 1px 17px); z-index:1; mix-blend-mode:soft-light; }
        .atlas-hero__visual::after { content:""; position:absolute; inset:clamp(22px,5vw,64px); z-index:2; border:1px solid rgba(255,255,255,.4); }
        .atlas-hero__image { width:100%; height:100%; object-fit:cover; filter:saturate(.68) contrast(.96); mix-blend-mode:multiply; opacity:.72; }
        .atlas-hero__fallback { position:absolute; inset:0; display:grid; place-items:center; color:color-mix(in srgb,var(--template-soft) 74%,white); font-family:var(--font-title); font-size:clamp(9rem,23vw,20rem); line-height:1; }
        .atlas-hero__stamp { position:absolute; right:clamp(26px,5vw,72px); bottom:clamp(28px,5vw,72px); z-index:3; width:126px; height:126px; display:grid; place-items:center; border:1px solid rgba(255,255,255,.7); border-radius:50%; color:#fff; font-family:var(--font-nav); font-size:9px; letter-spacing:.18em; line-height:1.7; text-align:center; text-transform:uppercase; }
        @media (max-width:800px) { .atlas-hero__grid { grid-template-columns:1fr; } .atlas-hero__copy { min-height:64dvh; } .atlas-hero__copy::before { inset:14px; } .atlas-hero__visual { min-height:42dvh; } .atlas-hero h1 { margin:30px 0; } }
      `}</style>
      <div className="atlas-hero__grid">
        <div className="atlas-hero__copy">
          <div><p data-editor-key="hero.eyebrow" className="atlas-hero__eyebrow">{templateValues.hero.eyebrow}</p><h1><span data-editor-key="couple.partner1">{weddingData.couple.partner1}</span><i>&amp;</i><span data-editor-key="couple.partner2">{weddingData.couple.partner2}</span></h1></div>
          <div className="atlas-hero__footer"><div className="atlas-hero__location"><MapPin size={16} /><p className="atlas-hero__meta"><span data-editor-key="event.dateLabel">{weddingData.event.dateLabel}</span><br /><span data-editor-key="event.city">{weddingData.event.city}</span></p></div><a className="atlas-hero__discover" href="#countdown">Ver coordenadas <ArrowDownRight size={16} /></a></div>
        </div>
        <div className="atlas-hero__visual">{image ? <img className="atlas-hero__image" src={image} alt="Fotografia de la pareja" /> : <div className="atlas-hero__fallback">A</div>}<p className="atlas-hero__stamp">Edicion privada<br />2027</p></div>
      </div>
    </section>
  );
};

export default Hero;
