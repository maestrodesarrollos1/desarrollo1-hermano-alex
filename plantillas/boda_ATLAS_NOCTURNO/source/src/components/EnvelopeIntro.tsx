import { useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { templateValues } from "@/config/template-values";
import { weddingData } from "@/data/weddingData";

type AtlasIntroProps = { onComplete?: () => void };

export default function EnvelopeIntro({ onComplete }: AtlasIntroProps) {
  const [opened, setOpened] = useState(false);

  return (
    <section className={`atlas-pass ${opened ? "is-open" : ""}`} aria-label="Abrir invitacion" onClick={opened ? () => onComplete?.() : undefined}>
      <style>{`
        .atlas-pass { position:fixed; inset:0; z-index:140; display:grid; place-items:center; overflow:hidden; background:var(--template-primary-dark); color:#fff; isolation:isolate; transition:opacity .62s ease, filter .62s ease; }
        .atlas-pass::before { content:""; position:absolute; inset:24px; border:1px solid color-mix(in srgb,var(--template-soft) 36%,transparent); pointer-events:none; }
        .atlas-pass::after { content:""; position:absolute; width:74vmax; height:74vmax; border:1px solid color-mix(in srgb,var(--template-primary) 42%,transparent); border-radius:50%; opacity:.42; transform:translate(31%,35%); }
        .atlas-pass.is-leaving { opacity:0; filter:blur(8px); pointer-events:none; }
        .atlas-pass__meta { position:absolute; right:clamp(28px,6vw,96px); bottom:clamp(28px,6vh,64px); z-index:3; color:color-mix(in srgb,var(--template-soft) 78%,white); font-family:var(--font-nav); font-size:9px; letter-spacing:.25em; text-transform:uppercase; writing-mode:vertical-rl; }
        .atlas-pass__stage { position:relative; width:min(920px,calc(100vw - 56px)); min-height:min(570px,calc(100dvh - 130px)); perspective:1500px; }
        .atlas-pass__ticket { position:absolute; inset:0; display:grid; grid-template-columns:.92fr 1.08fr; overflow:hidden; background:var(--template-soft); color:var(--template-primary-dark); box-shadow:0 42px 110px rgba(0,0,0,.32); transition:transform .95s cubic-bezier(.22,1,.36,1); }
        .atlas-pass__ticket::before { content:""; position:absolute; inset:18px; border:1px solid color-mix(in srgb,var(--template-primary-dark) 28%,transparent); pointer-events:none; }
        .atlas-pass__cover { position:relative; overflow:hidden; background:var(--template-primary); }
        .atlas-pass__cover::before { content:""; position:absolute; inset:0; background:repeating-linear-gradient(45deg,rgba(255,255,255,.12) 0 1px,transparent 1px 12px); mix-blend-mode:overlay; }
        .atlas-pass__cover::after { content:""; position:absolute; inset:0; background:linear-gradient(180deg,rgba(44,38,56,.06),rgba(44,38,56,.66)); }
        .atlas-pass__photo { width:100%; height:100%; object-fit:cover; mix-blend-mode:multiply; opacity:.68; }
        .atlas-pass__cover-copy { position:absolute; inset:0; z-index:1; display:flex; flex-direction:column; justify-content:space-between; padding:clamp(30px,5vw,60px); color:#fff; }
        .atlas-pass__cover-copy p { margin:0; font-family:var(--font-nav); font-size:10px; letter-spacing:.28em; text-transform:uppercase; }
        .atlas-pass__cover-copy strong { display:block; font-family:var(--font-title); font-size:clamp(4rem,8vw,7.6rem); font-weight:400; line-height:.72; }
        .atlas-pass__cover-copy span { color:color-mix(in srgb,var(--template-soft) 80%,white); font-family:var(--font-nav); font-size:10px; letter-spacing:.25em; text-transform:uppercase; }
        .atlas-pass__inside { position:relative; display:flex; flex-direction:column; justify-content:center; align-items:center; padding:clamp(34px,6vw,82px); text-align:center; }
        .atlas-pass__inside::after { content:""; position:absolute; left:0; top:10%; bottom:10%; border-left:1px dashed color-mix(in srgb,var(--template-primary-dark) 30%,transparent); }
        .atlas-pass__eyebrow, .atlas-pass__date { margin:0; color:var(--template-text); font-family:var(--font-nav); font-size:10px; letter-spacing:.27em; line-height:1.7; text-transform:uppercase; }
        .atlas-pass__names { margin:27px 0 25px; font-family:var(--font-title); font-size:clamp(3.8rem,7vw,7rem); font-weight:400; line-height:.78; }
        .atlas-pass__names span { display:block; } .atlas-pass__names i { display:block; margin:11px 0; color:var(--template-primary); font-size:.38em; font-style:italic; }
        .atlas-pass__open { position:absolute; right:0; top:0; z-index:6; display:flex; align-items:center; gap:12px; border:0; padding:18px 22px; background:var(--template-primary-dark); color:var(--template-soft); font-family:var(--font-nav); font-size:10px; letter-spacing:.2em; text-transform:uppercase; cursor:pointer; transition:background .2s ease; }
        .atlas-pass__open:hover { background:var(--template-text); }
        .atlas-pass__shutter { position:absolute; inset:0; z-index:4; display:grid; grid-template-columns:1fr 1fr; pointer-events:none; }
        .atlas-pass__shutter span { background:var(--template-primary-dark); transition:transform .82s cubic-bezier(.22,1,.36,1); }
        .atlas-pass__shutter span:last-child { border-left:1px solid color-mix(in srgb,var(--template-soft) 30%,transparent); }
        .atlas-pass.is-open .atlas-pass__shutter span:first-child { transform:translateX(-102%); }
        .atlas-pass.is-open .atlas-pass__shutter span:last-child { transform:translateX(102%); }
        .atlas-pass__reveal { position:absolute; inset:0; z-index:7; display:grid; place-items:center; padding:22px; opacity:0; pointer-events:none; transition:opacity .35s ease .45s; }
        .atlas-pass__reveal-card { position:relative; display:grid; place-items:center; width:min(520px,100%); min-height:360px; padding:44px; background:var(--template-primary-dark); color:var(--template-soft); text-align:center; box-shadow:0 30px 90px rgba(0,0,0,.28); }
        .atlas-pass__reveal-card::before { content:""; position:absolute; inset:15px; border:1px solid color-mix(in srgb,var(--template-primary) 72%,white); }
        .atlas-pass__reveal-card h1 { margin:20px 0; font-family:var(--font-title); font-size:clamp(3.5rem,7vw,6.5rem); font-weight:400; line-height:.76; }
        .atlas-pass__reveal-card h1 span { display:block; } .atlas-pass__reveal-card h1 em { display:block; color:var(--template-primary); font-size:.36em; font-style:italic; }
        .atlas-pass__enter { position:relative; z-index:1; display:inline-flex; align-items:center; gap:12px; margin-top:22px; border-bottom:1px solid var(--template-primary); padding:0 0 10px; background:none; color:var(--template-soft); font-family:var(--font-nav); font-size:10px; letter-spacing:.22em; text-transform:uppercase; cursor:pointer; }
        .atlas-pass__enter--stage { position:absolute; z-index:10; left:50%; bottom:clamp(42px,8vh,76px); margin:0; transform:translateX(-50%); }
        .atlas-pass.is-open .atlas-pass__reveal { opacity:1; pointer-events:auto; }
        @media (max-width:700px) { .atlas-pass::before { inset:12px; } .atlas-pass__stage { min-height:min(620px,calc(100dvh - 88px)); width:calc(100vw - 36px); } .atlas-pass__ticket { grid-template-columns:1fr; } .atlas-pass__cover { min-height:44%; } .atlas-pass__cover-copy { padding:26px; } .atlas-pass__cover-copy strong { font-size:4.5rem; } .atlas-pass__inside { min-height:56%; padding:28px; } .atlas-pass__inside::after { display:none; } .atlas-pass__open { padding:14px 16px; } .atlas-pass__meta { display:none; } }
        @media (prefers-reduced-motion:reduce) { .atlas-pass, .atlas-pass * { transition-duration:1ms!important; animation-duration:1ms!important; } }
      `}</style>
      <p className="atlas-pass__meta">Pase privado / 01</p>
      <div className="atlas-pass__stage">
        <article className="atlas-pass__ticket">
          <div className="atlas-pass__cover">
            {templateValues.images.landing ? <img className="atlas-pass__photo" src={templateValues.images.landing} alt="" /> : null}
            <div className="atlas-pass__cover-copy"><p>Atlas nocturno</p><strong>01</strong><span>Una celebracion sin mapa</span></div>
          </div>
          <div className="atlas-pass__inside">
            <p className="atlas-pass__eyebrow" data-editor-key="hero.eyebrow">{templateValues.hero.eyebrow}</p>
            <h1 className="atlas-pass__names"><span data-editor-key="couple.partner1">{weddingData.couple.partner1}</span><i>&amp;</i><span data-editor-key="couple.partner2">{weddingData.couple.partner2}</span></h1>
            <p className="atlas-pass__date"><span data-editor-key="event.dateLabel">{weddingData.event.dateLabel}</span><br /><span data-editor-key="event.venue">{weddingData.event.venue}</span></p>
          </div>
        </article>
        {!opened ? <button className="atlas-pass__open" type="button" onClick={() => setOpened(true)}>Abrir el pase <ArrowUpRight size={15} /></button> : null}
        <div className="atlas-pass__shutter" aria-hidden="true"><span /><span /></div>
        <div className="atlas-pass__reveal"><div className="atlas-pass__reveal-card"><div><p className="atlas-pass__eyebrow">Estais invitados</p><h1><span data-editor-key="couple.partner1">{weddingData.couple.partner1}</span><em>&amp;</em><span data-editor-key="couple.partner2">{weddingData.couple.partner2}</span></h1><p className="atlas-pass__date"><span data-editor-key="event.dateLabel">{weddingData.event.dateLabel}</span> / <span data-editor-key="event.city">{weddingData.event.city}</span></p></div></div></div>
        {opened ? <a className="atlas-pass__enter atlas-pass__enter--stage" href="/es?celebracion=1">Entrar en el atlas <ArrowUpRight size={15} /></a> : null}
      </div>
    </section>
  );
}
