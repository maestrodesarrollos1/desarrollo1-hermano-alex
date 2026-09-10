import { weddingData } from "@/data/weddingData";
import { templateValues } from "@/config/template-values";

const Hero = () => (
  <section id="hero" data-editor-component="hero" className="hanami-hero">
    <style>{`
      .hanami-hero { position:relative; min-height:100svh; overflow:hidden; color:#fff9f1; background:#0b1658; }
      .hanami-hero__image { position:absolute; inset:0; width:100%; height:100%; object-fit:cover; filter:saturate(.92) brightness(.62); } .hanami-hero::after { content:""; position:absolute; inset:0; background:linear-gradient(90deg,rgba(8,20,82,.76),transparent 66%),linear-gradient(0deg,rgba(8,20,82,.72),transparent 52%); }
      .hanami-hero__frame { position:absolute; z-index:2; inset:20px; border:2px solid rgba(255,246,238,.86); box-shadow:inset 0 0 0 2px rgba(255,91,145,.52); pointer-events:none; }
      .hanami-hero__content { position:relative; z-index:3; display:flex; min-height:100svh; width:min(100% - 96px,1360px); flex-direction:column; justify-content:flex-end; padding:126px 0 78px; margin:0 auto; }
      .hanami-hero__chapter,.hanami-hero__date { margin:0; font-family:var(--font-nav),Arial,sans-serif; font-size:10px; font-weight:700; letter-spacing:.22em; line-height:1.6; text-transform:uppercase; } .hanami-hero__chapter { color:#ffc6d7; }
      .hanami-hero h1 { max-width:780px; margin:21px 0 22px; font-family:var(--font-title),Georgia,serif; font-size:clamp(66px,8.4vw,132px); font-weight:400; line-height:.74; text-shadow:5px 5px 0 #ef5e93,-3px -2px 0 #1d68cb; } .hanami-hero h1 span { display:block; } .hanami-hero h1 em { display:block; margin:12px 0; color:#ffd1df; font-size:.35em; font-style:italic; text-shadow:none; }
      .hanami-hero__date { color:#fff0d6; } .hanami-hero__bubble { position:absolute; z-index:3; top:110px; right:clamp(36px,6vw,94px); display:grid; width:150px; min-height:118px; place-items:center; padding:20px; border:2px solid #fff6ee; border-radius:50%; color:#10205c; background:#fff6ee; box-shadow:5px 5px 0 #ff5c91; font-family:var(--font-nav),Arial,sans-serif; font-size:9px; font-weight:700; letter-spacing:.12em; line-height:1.4; text-align:center; text-transform:uppercase; } .hanami-hero__bubble::after { position:absolute; right:16px; bottom:-14px; width:20px; height:20px; border-right:2px solid #fff6ee; border-bottom:2px solid #fff6ee; background:#fff6ee; content:""; transform:rotate(45deg); }
      @media (max-width:640px) { .hanami-hero__frame { inset:11px; } .hanami-hero__content { width:min(100% - 48px,1360px); padding-bottom:65px; } .hanami-hero h1 { font-size:clamp(57px,17vw,78px); } .hanami-hero__bubble { display:none; } }
    `}</style>
    <img className="hanami-hero__image" src={templateValues.images.hero || "/images/hanami/festival-night.png"} alt="Pareja bajo farolillos en una celebracion nocturna" />
    <div className="hanami-hero__frame" aria-hidden="true" />
    <div className="hanami-hero__content"><p className="hanami-hero__chapter" data-editor-key="hero.eyebrow">{templateValues.hero.eyebrow}</p><h1><span data-editor-key="couple.partner1">{weddingData.couple.partner1}</span><em>&amp;</em><span data-editor-key="couple.partner2">{weddingData.couple.partner2}</span></h1><p className="hanami-hero__date"><span data-editor-key="event.dateLabel">{weddingData.event.dateLabel}</span> / <span data-editor-key="event.city">{weddingData.event.city}</span></p></div>
    <p className="hanami-hero__bubble">Siguiente<br />escena:<br />celebrar</p>
  </section>
);

export default Hero;
