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
    <section className={`ink-intro ${opened ? "is-open" : ""} ${leaving ? "is-leaving" : ""}`} aria-label="Abrir invitacion de boda">
      <style>{`
        @keyframes ink-card { from { opacity:0; transform:translate(-50%,-43%) rotateX(-5deg) scale(.94); } to { opacity:1; transform:translate(-50%,-50%) rotateX(0) scale(1); } }
        .ink-intro { position:fixed; inset:0; z-index:140; overflow:hidden; isolation:isolate; background:#060608; color:#eeedf0; font-family:var(--font-title),Georgia,serif; transition:opacity .7s ease,filter .7s ease; }
        .ink-intro.is-leaving { opacity:0; filter:blur(8px); pointer-events:none; }
        .ink-intro__image { position:absolute; inset:0; width:100%; height:100%; object-fit:cover; filter:brightness(.54) contrast(1.14) saturate(.46); transform:scale(1.03); transition:filter .9s ease,transform 1.2s cubic-bezier(.22,1,.36,1); }
        .ink-intro::before { content:""; position:absolute; inset:0; z-index:1; background:linear-gradient(90deg,rgba(3,3,5,.8),transparent 52%,rgba(3,3,5,.54)),linear-gradient(0deg,rgba(3,3,5,.88),transparent 52%); }
        .ink-intro::after { content:""; position:absolute; inset:20px; z-index:9; border:1px solid rgba(233,231,235,.38); pointer-events:none; }
        .ink-intro__caption { position:absolute; z-index:3; top:clamp(30px,6vh,70px); left:clamp(30px,6vw,96px); color:rgba(237,235,240,.68); font-family:var(--font-nav),Arial,sans-serif; font-size:9px; letter-spacing:.28em; text-transform:uppercase; writing-mode:vertical-rl; }
        .ink-intro__cover { position:absolute; z-index:4; inset:0; display:grid; grid-template-columns:1fr 1fr; pointer-events:none; }
        .ink-intro__leaf { position:relative; background:#08090c; transition:transform 1.18s cubic-bezier(.22,1,.36,1); }
        .ink-intro__leaf::before { content:""; position:absolute; inset:clamp(16px,4vw,54px); border:1px solid rgba(225,222,228,.2); }
        .ink-intro__leaf:first-child { background:linear-gradient(110deg,#06070a,#11131a); } .ink-intro__leaf:last-child { background:linear-gradient(250deg,#06070a,#11131a); }
        .ink-intro__leaf:first-child::after,.ink-intro__leaf:last-child::after { content:""; position:absolute; top:15%; bottom:15%; width:1px; background:rgba(225,222,228,.24); }
        .ink-intro__leaf:first-child::after { right:clamp(12px,3vw,40px); } .ink-intro__leaf:last-child::after { left:clamp(12px,3vw,40px); }
        .ink-intro.is-open .ink-intro__leaf:first-child { transform:translateX(-102%); } .ink-intro.is-open .ink-intro__leaf:last-child { transform:translateX(102%); }
        .ink-intro__cover-copy { position:absolute; z-index:6; top:50%; left:50%; width:min(610px,calc(100vw - 54px)); transform:translate(-50%,-50%); text-align:center; transition:opacity .35s ease,transform .65s ease; }
        .ink-intro__eyebrow,.ink-intro__date { margin:0; font-family:var(--font-nav),Arial,sans-serif; font-size:10px; letter-spacing:.28em; line-height:1.65; text-transform:uppercase; }
        .ink-intro__eyebrow { color:#b4b6be; } .ink-intro__date { color:#c2c5cf; }
        .ink-intro__cover-copy h1 { margin:22px 0 20px; font-size:clamp(60px,9vw,118px); font-weight:400; line-height:.76; } .ink-intro__cover-copy h1 span { display:block; } .ink-intro__cover-copy h1 i { display:block; margin:12px 0; color:#b8adbf; font-size:.34em; font-style:italic; }
        .ink-intro__open { display:inline-flex; align-items:center; gap:12px; margin-top:34px; border:1px solid rgba(239,237,241,.68); padding:15px 19px; background:rgba(5,6,9,.26); color:#f3f1f4; font-family:var(--font-nav),Arial,sans-serif; font-size:10px; letter-spacing:.2em; text-transform:uppercase; backdrop-filter:blur(5px); cursor:pointer; transition:background .2s ease,transform .2s ease; } .ink-intro__open:hover { background:rgba(239,237,241,.14); transform:translateY(-2px); }
        .ink-intro__open b { display:block; width:9px; height:9px; border:1px solid currentColor; transform:rotate(45deg); }
        .ink-intro.is-open .ink-intro__cover-copy { opacity:0; pointer-events:none; transform:translate(-50%,-56%); } .ink-intro.is-open .ink-intro__image { filter:brightness(.24) contrast(1.06) saturate(.28) blur(2px); transform:scale(1.08); }
        .ink-intro__card { position:absolute; z-index:5; top:50%; left:50%; width:min(575px,calc(100vw - 50px)); min-height:min(610px,calc(100vh - 50px)); display:grid; place-items:center; box-sizing:border-box; padding:clamp(36px,6vw,74px); border:1px solid rgba(228,226,233,.36); background:#101116; color:#f0eff2; box-shadow:0 44px 120px rgba(0,0,0,.64); opacity:0; pointer-events:none; }
        .ink-intro__card::before { content:""; position:absolute; inset:14px; border:1px solid rgba(229,226,233,.16); } .ink-intro__card::after { content:""; position:absolute; left:50%; top:28px; bottom:28px; width:1px; background:rgba(229,226,233,.09); }
        .ink-intro__paper { position:relative; z-index:1; width:100%; text-align:center; } .ink-intro__paper h1 { margin:28px 0 24px; font-size:clamp(49px,7vw,80px); font-weight:400; line-height:.85; } .ink-intro__paper h1 span { display:block; white-space:nowrap; } .ink-intro__paper h1 em { display:block; margin:11px 0; color:#c5bec9; font-size:.38em; font-style:italic; }
        .ink-intro__enter { margin-top:42px; border:1px solid #e9e6eb; padding:15px 22px; background:#e9e6eb; color:#101116; font-family:var(--font-nav),Arial,sans-serif; font-size:10px; font-weight:600; letter-spacing:.2em; text-transform:uppercase; cursor:pointer; transition:background .2s ease,color .2s ease; } .ink-intro__enter:hover { background:#83778d; color:#fff; }
        .ink-intro.is-open .ink-intro__card { animation:ink-card .9s cubic-bezier(.22,1,.36,1) .34s forwards; pointer-events:auto; }
        @media (max-width:640px) { .ink-intro::after { inset:12px; } .ink-intro__caption { top:29px; left:29px; } .ink-intro__cover-copy h1 { font-size:clamp(54px,16vw,78px); } .ink-intro__card { min-height:min(630px,calc(100dvh - 38px)); } }
        @media (prefers-reduced-motion:reduce) { .ink-intro,.ink-intro * { animation-duration:1ms!important; transition-duration:1ms!important; } }
      `}</style>
      <img className="ink-intro__image" src="/images/nocturna/black-lacquer-moon.png" alt="Estuche negro de laca junto a una orquidea" />
      <p className="ink-intro__caption">Edicion despues de medianoche</p>
      <div className="ink-intro__cover" aria-hidden="true"><div className="ink-intro__leaf" /><div className="ink-intro__leaf" /></div>
      <div className="ink-intro__cover-copy"><p className="ink-intro__eyebrow" data-editor-key="hero.eyebrow">{templateValues.hero.eyebrow}</p><h1><span data-editor-key="couple.partner1">{weddingData.couple.partner1}</span><i>&amp;</i><span data-editor-key="couple.partner2">{weddingData.couple.partner2}</span></h1><p className="ink-intro__date"><span data-editor-key="event.dateLabel">{weddingData.event.dateLabel}</span> / <span data-editor-key="event.city">{weddingData.event.city}</span></p><button className="ink-intro__open" type="button" onClick={() => setStage("opened")}><b aria-hidden="true" /> Abrir el ritual</button></div>
      <article className="ink-intro__card" aria-hidden={!opened}><div className="ink-intro__paper"><p className="ink-intro__eyebrow" data-editor-key="hero.eyebrow">{templateValues.hero.eyebrow}</p><h1><span data-editor-key="couple.partner1">{weddingData.couple.partner1}</span><em>&amp;</em><span data-editor-key="couple.partner2">{weddingData.couple.partner2}</span></h1><p className="ink-intro__date"><span data-editor-key="event.dateLabel">{weddingData.event.dateLabel}</span><br /><span data-editor-key="event.venue">{weddingData.event.venue}</span></p><button className="ink-intro__enter" type="button" onClick={enterCelebration}>Entrar en la noche</button></div></article>
    </section>
  );
}
