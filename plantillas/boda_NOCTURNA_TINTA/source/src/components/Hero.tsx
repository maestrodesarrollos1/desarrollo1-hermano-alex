import { weddingData } from "@/data/weddingData";
import { templateValues } from "@/config/template-values";

const Hero = () => (
  <section id="hero" data-editor-component="hero" className="nocturne-hero">
    <style>{`
      .nocturne-hero { position:relative; min-height:100svh; overflow:hidden; color:#f2f0f3; background:#090a0e; }
      .nocturne-hero__image { position:absolute; inset:0; width:100%; height:100%; object-fit:cover; filter:brightness(.48) saturate(.48) contrast(1.12); }
      .nocturne-hero::after { content:""; position:absolute; inset:0; background:linear-gradient(90deg,rgba(4,4,6,.84),rgba(4,4,6,.16) 68%),linear-gradient(0deg,rgba(4,4,6,.74),transparent 55%); }
      .nocturne-hero__frame { position:absolute; z-index:2; inset:24px; border:1px solid rgba(239,236,242,.38); pointer-events:none; }
      .nocturne-hero__content { position:relative; z-index:3; display:flex; min-height:100svh; width:min(100% - 96px,1360px); flex-direction:column; justify-content:flex-end; padding:126px 0 80px; margin:0 auto; }
      .nocturne-hero__index,.nocturne-hero__date { margin:0; font-family:var(--font-nav),Arial,sans-serif; font-size:10px; letter-spacing:.28em; line-height:1.6; text-transform:uppercase; } .nocturne-hero__index { color:#b9b4bd; }
      .nocturne-hero h1 { max-width:770px; margin:22px 0 22px; font-family:var(--font-title),Georgia,serif; font-size:clamp(66px,8.4vw,132px); font-weight:400; line-height:.74; } .nocturne-hero h1 span { display:block; } .nocturne-hero h1 em { display:block; margin:12px 0; color:#a79aa9; font-size:.35em; font-style:italic; }
      .nocturne-hero__line { width:min(210px,42vw); height:1px; margin:0 0 22px; background:rgba(239,236,242,.68); } .nocturne-hero__date { color:#ded9e0; }
      .nocturne-hero__aside { position:absolute; z-index:3; top:112px; right:clamp(38px,6vw,94px); display:grid; gap:10px; width:150px; color:#cfccd2; font-family:var(--font-nav),Arial,sans-serif; font-size:9px; letter-spacing:.14em; line-height:1.6; text-align:right; } .nocturne-hero__aside::before { justify-self:end; width:36px; height:36px; border:1px solid rgba(239,236,242,.52); border-radius:50%; content:""; }
      @media (max-width:640px) { .nocturne-hero__frame { inset:12px; } .nocturne-hero__content { width:min(100% - 48px,1360px); padding-bottom:66px; } .nocturne-hero h1 { font-size:clamp(57px,17vw,78px); } .nocturne-hero__aside { display:none; } }
    `}</style>
    <img className="nocturne-hero__image" src={templateValues.images.hero || "/images/nocturna/black-lacquer-moon.png"} alt="Estuche de laca negro para una celebracion nocturna" />
    <div className="nocturne-hero__frame" aria-hidden="true" />
    <div className="nocturne-hero__content"><p className="nocturne-hero__index" data-editor-key="hero.eyebrow">{templateValues.hero.eyebrow}</p><h1><span data-editor-key="couple.partner1">{weddingData.couple.partner1}</span><em>&amp;</em><span data-editor-key="couple.partner2">{weddingData.couple.partner2}</span></h1><div className="nocturne-hero__line" /><p className="nocturne-hero__date"><span data-editor-key="event.dateLabel">{weddingData.event.dateLabel}</span> / <span data-editor-key="event.city">{weddingData.event.city}</span></p></div>
    <p className="nocturne-hero__aside">Pase privado<br />Para una noche<br />sin testigos del reloj</p>
  </section>
);

export default Hero;
