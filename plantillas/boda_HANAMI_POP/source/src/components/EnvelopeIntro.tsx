import { useEffect, useRef, useState } from "react";
import { weddingData } from "@/data/weddingData";
import { templateValues } from "@/config/template-values";

type IntroStage = "closed" | "opened" | "leaving";
type EnvelopeIntroProps = { onComplete?: () => void };

export default function EnvelopeIntro({ onComplete }: EnvelopeIntroProps) {
  const [stage, setStage] = useState<IntroStage>("closed");
  const timer = useRef<number | null>(null);
  const opened = stage === "opened";
  const leaving = stage === "leaving";

  useEffect(() => () => {
    if (timer.current) window.clearTimeout(timer.current);
  }, []);

  const enterCelebration = () => {
    if (!opened) return;
    setStage("leaving");
    timer.current = window.setTimeout(() => onComplete?.(), 700);
  };

  return (
    <section className={`hanami-intro ${opened ? "is-open" : ""} ${leaving ? "is-leaving" : ""}`} aria-label="Abrir invitacion de boda">
      <style>{`
        @keyframes hanami-card { from { opacity:0; transform:translate(-50%,-46%) rotate(-3deg) scale(.9); } 65% { opacity:1; transform:translate(-50%,-51%) rotate(.5deg) scale(1.02); } to { opacity:1; transform:translate(-50%,-50%) rotate(0) scale(1); } }
        .hanami-intro { position:fixed; inset:0; z-index:140; overflow:hidden; isolation:isolate; background:#07124b; color:#fff7ee; font-family:var(--font-title),Georgia,serif; transition:opacity .7s ease,filter .7s ease; }
        .hanami-intro.is-leaving { opacity:0; filter:blur(8px); pointer-events:none; }
        .hanami-intro__image { position:absolute; inset:0; width:100%; height:100%; object-fit:cover; filter:saturate(.9) contrast(1.02) brightness(.66); transform:scale(1.04); transition:transform 1.15s cubic-bezier(.22,1,.36,1),filter .8s ease; }
        .hanami-intro::before { content:""; position:absolute; inset:0; z-index:1; background:linear-gradient(180deg,rgba(7,17,75,.34),rgba(7,17,75,.12) 48%,rgba(7,17,75,.72)); }
        .hanami-intro::after { content:""; position:absolute; z-index:9; inset:20px; border:2px solid rgba(255,242,234,.84); box-shadow:inset 0 0 0 2px rgba(255,91,143,.5); pointer-events:none; }
        .hanami-intro__chapter { position:absolute; z-index:3; top:clamp(31px,6vh,70px); left:clamp(31px,6vw,98px); display:flex; align-items:center; gap:10px; color:#fff3e9; font-family:var(--font-nav),Arial,sans-serif; font-size:10px; font-weight:600; letter-spacing:.2em; text-transform:uppercase; }
        .hanami-intro__chapter strong { display:grid; width:30px; height:30px; place-items:center; border:2px solid currentColor; border-radius:50%; color:#ffb3c9; font-size:10px; }
        .hanami-intro__panels { position:absolute; z-index:4; inset:0; display:grid; grid-template-columns:1fr 1fr 1fr; gap:10px; padding:clamp(32px,6vw,88px); pointer-events:none; }
        .hanami-intro__panel { border:2px solid rgba(255,242,234,.82); background:rgba(9,20,81,.78); box-shadow:inset 0 0 0 2px rgba(255,87,141,.35); transition:transform .9s cubic-bezier(.22,1,.36,1),opacity .45s ease; }
        .hanami-intro__panel:nth-child(1) { transform:skewY(-4deg); } .hanami-intro__panel:nth-child(2) { transform:skewY(3deg); } .hanami-intro__panel:nth-child(3) { transform:skewY(-2deg); }
        .hanami-intro.is-open .hanami-intro__panel:nth-child(1) { opacity:0; transform:translate(-105%,-20%) rotate(-12deg); } .hanami-intro.is-open .hanami-intro__panel:nth-child(2) { opacity:0; transform:translateY(-105%) rotate(8deg); } .hanami-intro.is-open .hanami-intro__panel:nth-child(3) { opacity:0; transform:translate(105%,22%) rotate(12deg); }
        .hanami-intro__cover-copy { position:absolute; z-index:6; left:50%; top:50%; width:min(620px,calc(100vw - 56px)); transform:translate(-50%,-50%); text-align:center; transition:opacity .3s ease,transform .6s cubic-bezier(.22,1,.36,1); }
        .hanami-intro__eyebrow,.hanami-intro__date { margin:0; font-family:var(--font-nav),Arial,sans-serif; font-size:10px; font-weight:600; letter-spacing:.25em; line-height:1.65; text-transform:uppercase; } .hanami-intro__eyebrow { color:#ffd4de; } .hanami-intro__date { color:#ffe8cb; }
        .hanami-intro__cover-copy h1 { margin:20px 0 18px; color:#fff9f2; font-size:clamp(58px,9vw,116px); font-weight:400; line-height:.76; text-shadow:4px 4px 0 #fa6294,-3px -2px 0 #1b66cf; } .hanami-intro__cover-copy h1 span { display:block; } .hanami-intro__cover-copy h1 i { display:block; margin:12px 0; color:#ffb1c7; font-size:.35em; font-style:italic; text-shadow:none; }
        .hanami-intro__open { display:inline-flex; align-items:center; gap:11px; margin-top:32px; border:2px solid #fff6ee; padding:14px 18px; background:#ff5c91; color:#fffdf8; box-shadow:4px 4px 0 #123b9d; font-family:var(--font-nav),Arial,sans-serif; font-size:10px; font-weight:700; letter-spacing:.18em; text-transform:uppercase; cursor:pointer; transition:transform .2s ease,box-shadow .2s ease; } .hanami-intro__open:hover { transform:translate(2px,2px); box-shadow:2px 2px 0 #123b9d; }
        .hanami-intro__open span { font-size:14px; line-height:1; } .hanami-intro.is-open .hanami-intro__cover-copy { opacity:0; pointer-events:none; transform:translate(-50%,-56%) scale(.96); } .hanami-intro.is-open .hanami-intro__image { filter:saturate(.58) brightness(.34) blur(2px); transform:scale(1.1); }
        .hanami-intro__card { position:absolute; z-index:5; left:50%; top:50%; width:min(590px,calc(100vw - 50px)); min-height:min(612px,calc(100vh - 50px)); display:grid; place-items:center; box-sizing:border-box; padding:clamp(34px,6vw,74px); border:3px solid #173b9a; background:#fff7ee; color:#112968; box-shadow:11px 12px 0 #ff5c91; opacity:0; pointer-events:none; }
        .hanami-intro__card::before { content:""; position:absolute; inset:14px; border:2px solid #ff6b9e; } .hanami-intro__card::after { content:""; position:absolute; width:94px; height:94px; right:7%; top:8%; border:2px solid rgba(23,59,154,.22); border-radius:50%; box-shadow:-12px 18px 0 -8px rgba(255,92,145,.58); }
        .hanami-intro__paper { position:relative; z-index:1; width:100%; text-align:center; } .hanami-intro__paper h1 { margin:28px 0 24px; font-size:clamp(48px,7vw,80px); font-weight:400; line-height:.84; } .hanami-intro__paper h1 span { display:block; white-space:nowrap; } .hanami-intro__paper h1 em { display:block; margin:11px 0; color:#ef5d91; font-size:.4em; font-style:italic; }
        .hanami-intro__paper .hanami-intro__eyebrow { color:#ec4f85; } .hanami-intro__paper .hanami-intro__date { color:#1c58b1; }
        .hanami-intro__enter { margin-top:42px; border:2px solid #173b9a; padding:14px 20px; background:#173b9a; color:#fff7ee; box-shadow:4px 4px 0 #ff5c91; font-family:var(--font-nav),Arial,sans-serif; font-size:10px; font-weight:700; letter-spacing:.18em; text-transform:uppercase; cursor:pointer; transition:transform .2s ease,box-shadow .2s ease; } .hanami-intro__enter:hover { transform:translate(2px,2px); box-shadow:2px 2px 0 #ff5c91; }
        .hanami-intro.is-open .hanami-intro__card { animation:hanami-card .9s cubic-bezier(.22,1,.36,1) .22s forwards; pointer-events:auto; }
        @media (max-width:640px) { .hanami-intro::after { inset:11px; } .hanami-intro__chapter { top:28px; left:27px; } .hanami-intro__panels { gap:6px; padding:26px; } .hanami-intro__cover-copy h1 { font-size:clamp(52px,16vw,77px); } .hanami-intro__card { min-height:min(630px,calc(100dvh - 38px)); box-shadow:7px 8px 0 #ff5c91; } }
        @media (prefers-reduced-motion:reduce) { .hanami-intro,.hanami-intro * { animation-duration:1ms!important; transition-duration:1ms!important; } }
      `}</style>
      <img className="hanami-intro__image" src="/images/hanami/festival-night.png" alt="Pareja en una celebracion nocturna entre farolillos y petalos" />
      <p className="hanami-intro__chapter"><strong>01</strong> Capitulo de dos</p>
      <div className="hanami-intro__panels" aria-hidden="true"><div className="hanami-intro__panel" /><div className="hanami-intro__panel" /><div className="hanami-intro__panel" /></div>
      <div className="hanami-intro__cover-copy"><p className="hanami-intro__eyebrow" data-editor-key="hero.eyebrow">{templateValues.hero.eyebrow}</p><h1><span data-editor-key="couple.partner1">{weddingData.couple.partner1}</span><i>&amp;</i><span data-editor-key="couple.partner2">{weddingData.couple.partner2}</span></h1><p className="hanami-intro__date"><span data-editor-key="event.dateLabel">{weddingData.event.dateLabel}</span> / <span data-editor-key="event.city">{weddingData.event.city}</span></p><button className="hanami-intro__open" type="button" onClick={() => setStage("opened")}><span aria-hidden="true">+</span> Abrir capitulo I</button></div>
      <article className="hanami-intro__card" aria-hidden={!opened}><div className="hanami-intro__paper"><p className="hanami-intro__eyebrow" data-editor-key="hero.eyebrow">{templateValues.hero.eyebrow}</p><h1><span data-editor-key="couple.partner1">{weddingData.couple.partner1}</span><em>&amp;</em><span data-editor-key="couple.partner2">{weddingData.couple.partner2}</span></h1><p className="hanami-intro__date"><span data-editor-key="event.dateLabel">{weddingData.event.dateLabel}</span><br /><span data-editor-key="event.venue">{weddingData.event.venue}</span></p><button className="hanami-intro__enter" type="button" onClick={enterCelebration}>Entrar en nuestra historia</button></div></article>
    </section>
  );
}
