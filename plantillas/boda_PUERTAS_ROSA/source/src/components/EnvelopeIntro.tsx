import { useEffect, useRef, useState } from "react";
import { weddingData } from "@/data/weddingData";
import { templateValues } from "@/config/template-values";

type EnvelopeIntroProps = { onComplete?: () => void };
type IntroStage = "closed" | "open" | "leaving";

export default function EnvelopeIntro({ onComplete }: EnvelopeIntroProps) {
  const [stage, setStage] = useState<IntroStage>("closed");
  const timer = useRef<number | null>(null);
  const isOpen = stage === "open";
  const isLeaving = stage === "leaving";

  useEffect(() => () => {
    if (timer.current) window.clearTimeout(timer.current);
  }, []);

  const enterSite = () => {
    setStage("leaving");
    timer.current = window.setTimeout(() => onComplete?.(), 720);
  };

  return (
    <section className={`rose-doors ${isOpen ? "is-open" : ""} ${isLeaving ? "is-leaving" : ""}`} aria-label="Abrir invitacion de boda">
      <style>{`
        @keyframes invitationReveal {
          from { opacity: 0; transform: translate(-50%, -47%) scale(.93); }
          to { opacity: 1; transform: translate(-50%, -50%) scale(1); }
        }
        .rose-doors {
          position: fixed; inset: 0; z-index: 140; overflow: hidden; isolation: isolate;
          background: #b98075; color: #fff9f3; font-family: var(--font-title), Georgia, serif;
          transition: opacity .72s ease, filter .72s ease;
        }
        .rose-doors.is-leaving { opacity: 0; filter: blur(8px); pointer-events: none; }
        .rose-doors__scene, .rose-doors__door { background-image: url('/images/doors/rose-double-doors.png'); background-position: center; background-size: cover; }
        .rose-doors__scene { position: absolute; inset: 0; z-index: -3; filter: brightness(.72) saturate(.78); }
        .rose-doors__underlay { position:absolute; inset:0; z-index:-2; background: linear-gradient(135deg, #f8e8df 0%, #e5b6ac 44%, #80485a 100%); }
        .rose-doors__shade { position:absolute; inset:0; z-index:2; pointer-events:none; background: linear-gradient(180deg, rgba(64,26,36,.25), transparent 30%, rgba(64,26,36,.38)); transition: opacity .8s ease; }
        .rose-doors__frame { position:absolute; inset:20px; z-index:8; border:1px solid rgba(255,249,243,.46); pointer-events:none; }
        .rose-doors__door { position:absolute; top:0; bottom:0; z-index:4; width:50.2%; background-size:200% auto; transition: transform 1250ms cubic-bezier(.22,1,.36,1), filter 800ms ease; will-change:transform; }
        .rose-doors__door--left { left:0; background-position:left center; transform-origin:left center; }
        .rose-doors__door--right { right:0; background-position:right center; transform-origin:right center; }
        .rose-doors__door::after { content:""; position:absolute; inset:0; background:linear-gradient(90deg, rgba(67,27,38,.28), transparent 22%, transparent 78%, rgba(67,27,38,.3)); }
        .rose-doors__door--left::before, .rose-doors__door--right::before { content:""; position:absolute; top:0; bottom:0; width:2px; background:rgba(72,29,39,.62); }
        .rose-doors__door--left::before { right:0; } .rose-doors__door--right::before { left:0; }
        .rose-doors.is-open .rose-doors__door--left { transform: translateX(-101%); }
        .rose-doors.is-open .rose-doors__door--right { transform: translateX(101%); }
        .rose-doors.is-open .rose-doors__shade { opacity: .3; }
        .rose-doors__heading { position:absolute; z-index:6; left:50%; top:clamp(42px,8vh,96px); width:min(90vw,640px); transform:translateX(-50%); text-align:center; transition:opacity .3s ease, transform .55s ease; }
        .rose-doors__eyebrow, .rose-doors__hint, .rose-doors__date { margin:0; font-family:var(--font-nav),Arial,sans-serif; font-size:10px; font-weight:500; letter-spacing:.32em; line-height:1.6; text-transform:uppercase; }
        .rose-doors__eyebrow { color:#fff0e4; }
        .rose-doors__names { margin:20px 0 14px; font-size:clamp(52px,8vw,100px); font-weight:400; line-height:.79; text-shadow:0 4px 26px rgba(70,25,36,.25); }
        .rose-doors__names span { display:block; } .rose-doors__names i { display:block; margin:10px 0; color:#f8d9b7; font-size:.39em; font-style:italic; line-height:.5; }
        .rose-doors__date { color:#f8d9b7; }
        .rose-doors__handle { position:absolute; z-index:7; left:50%; top:53%; transform:translate(-50%,-50%); display:grid; height:74px; width:74px; place-items:center; border:1px solid rgba(255,248,235,.52); border-radius:50%; background:rgba(112,58,65,.24); color:#fff8ed; backdrop-filter:blur(3px); cursor:pointer; transition:opacity .3s ease, transform .3s ease, background .25s ease; }
        .rose-doors__handle:hover { background:rgba(255,244,230,.26); transform:translate(-50%,-50%) scale(1.06); }
        .rose-doors__handle span { display:block; height:20px; width:20px; border:1.5px solid currentColor; border-radius:50%; box-shadow:0 0 0 7px rgba(255,248,235,.12); }
        .rose-doors__prompt { position:absolute; z-index:7; left:50%; bottom:clamp(42px,8vh,88px); transform:translateX(-50%); border-bottom:1px solid rgba(255,248,235,.64); padding-bottom:11px; color:#fff8ed; cursor:pointer; transition:opacity .25s ease, color .25s ease; }
        .rose-doors__prompt:hover { color:#f8d9b7; }
        .rose-doors.is-open .rose-doors__heading, .rose-doors.is-open .rose-doors__handle, .rose-doors.is-open .rose-doors__prompt { opacity:0; pointer-events:none; }
        .rose-doors.is-open .rose-doors__heading { transform:translateX(-50%) translateY(-18px); }
        .rose-doors__invitation { position:absolute; z-index:3; left:50%; top:50%; width:min(560px,calc(100vw - 50px)); min-height:min(610px,calc(100vh - 58px)); display:grid; place-items:center; box-sizing:border-box; padding:clamp(34px,6vw,74px); background:#fff9f3; color:#633542; box-shadow:0 36px 110px rgba(63,24,35,.3); opacity:0; pointer-events:none; }
        .rose-doors__invitation::before { content:""; position:absolute; inset:15px; border:1px solid rgba(137,77,92,.34); } .rose-doors__invitation::after { content:""; position:absolute; inset:27px; border:1px solid rgba(202,152,123,.52); }
        .rose-doors__paper { position:relative; z-index:1; text-align:center; }
        .rose-doors__paper h1 { margin:28px 0 24px; font-size:clamp(48px,7vw,78px); font-weight:400; line-height:.9; }
        .rose-doors__paper h1 span { display:block; white-space:nowrap; } .rose-doors__paper h1 em { display:block; margin:10px 0; color:#ba7b89; font-size:.38em; font-style:italic; line-height:.6; }
        .rose-doors__paper .rose-doors__eyebrow { color:#9a5b6d; } .rose-doors__paper .rose-doors__date { color:#7a5360; }
        .rose-doors__enter { margin-top:40px; border:1px solid #633542; padding:15px 24px; background:#633542; color:#fff9f3; font-family:var(--font-nav),Arial,sans-serif; font-size:10px; font-weight:500; letter-spacing:.23em; text-transform:uppercase; cursor:pointer; transition:background .25s ease,color .25s ease; }
        .rose-doors__enter:hover { background:#c47f8f; color:#542d39; }
        .rose-doors.is-open .rose-doors__invitation { animation:invitationReveal .85s cubic-bezier(.22,1,.36,1) .34s forwards; pointer-events:auto; }
        @media (max-width:640px) { .rose-doors__scene, .rose-doors__door { background-position:center center; } .rose-doors__door { background-size:auto 100%; } .rose-doors__frame { inset:13px; } .rose-doors__heading { top:52px; } .rose-doors__names { font-size:clamp(47px,15vw,68px); } .rose-doors__invitation { min-height:min(620px,calc(100vh - 40px)); } }
        @media (prefers-reduced-motion:reduce) { .rose-doors, .rose-doors * { transition-duration:1ms !important; animation-duration:1ms !important; } }
      `}</style>

      <div className="rose-doors__underlay" />
      <div className="rose-doors__scene" />
      <div className="rose-doors__door rose-doors__door--left" />
      <div className="rose-doors__door rose-doors__door--right" />
      <div className="rose-doors__shade" />
      <div className="rose-doors__frame" />
      <div className="rose-doors__heading">
        <p className="rose-doors__eyebrow" data-editor-key="hero.eyebrow">{templateValues.hero.eyebrow}</p>
        <p className="rose-doors__names"><span data-editor-key="couple.partner1">{weddingData.couple.partner1}</span><i>&amp;</i><span data-editor-key="couple.partner2">{weddingData.couple.partner2}</span></p>
        <p className="rose-doors__date"><span data-editor-key="event.dateLabel">{weddingData.event.dateLabel}</span> / <span data-editor-key="event.city">{weddingData.event.city}</span></p>
      </div>

      <button type="button" className="rose-doors__handle" aria-label="Abrir las puertas" onClick={() => setStage("open")}><span /></button>
      <button type="button" className="rose-doors__prompt" onClick={() => setStage("open")}><span className="rose-doors__hint">Abre las puertas</span></button>

      <article className="rose-doors__invitation" aria-hidden={!isOpen}>
        <div className="rose-doors__paper">
          <p className="rose-doors__eyebrow" data-editor-key="hero.eyebrow">{templateValues.hero.eyebrow}</p>
          <h1><span data-editor-key="couple.partner1">{weddingData.couple.partner1}</span><em>&amp;</em><span data-editor-key="couple.partner2">{weddingData.couple.partner2}</span></h1>
          <p className="rose-doors__date"><span data-editor-key="event.dateLabel">{weddingData.event.dateLabel}</span><br /><span data-editor-key="event.venue">{weddingData.event.venue}</span></p>
          <button className="rose-doors__enter" type="button" onClick={enterSite}>Entrar a la celebracion</button>
        </div>
      </article>
    </section>
  );
}
