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
    timer.current = window.setTimeout(() => onComplete?.(), 720);
  };

  return (
    <section
      className={`watercolor-intro${opened ? " is-open" : ""}${leaving ? " is-leaving" : ""}`}
      aria-label="Entrada a la invitación de boda"
    >
      <style>{`
        @keyframes watercolor-card-in {
          from { opacity: 0; transform: translate(-50%, -46%) scale(.94); }
          to { opacity: 1; transform: translate(-50%, -50%) scale(1); }
        }
        @keyframes watercolor-breath {
          0%, 100% { transform: scale(1); opacity: .72; }
          50% { transform: scale(1.1); opacity: 1; }
        }
        .watercolor-intro {
          position: fixed;
          inset: 0;
          z-index: 140;
          overflow: hidden;
          isolation: isolate;
          background: #4d6046;
          color: #faf7ed;
          font-family: var(--font-title), Georgia, serif;
          transition: opacity .72s ease, filter .72s ease;
        }
        .watercolor-intro.is-leaving { opacity: 0; filter: blur(8px); pointer-events: none; }
        .watercolor-intro__scene {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center 48%;
          filter: saturate(.86) brightness(.84) contrast(.96);
          transform: scale(1.025);
          transition: transform 1.15s cubic-bezier(.22, 1, .36, 1), filter .85s ease;
        }
        .watercolor-intro::before {
          position: absolute;
          z-index: 1;
          inset: 0;
          background: rgba(67, 84, 58, .22);
          content: "";
          transition: background .7s ease;
        }
        .watercolor-intro::after {
          position: absolute;
          z-index: 8;
          inset: 20px;
          border: 1px solid rgba(255, 250, 235, .66);
          content: "";
          pointer-events: none;
        }
        .watercolor-intro__place {
          position: absolute;
          z-index: 2;
          top: clamp(34px, 7vh, 72px);
          left: clamp(34px, 7vw, 110px);
          display: flex;
          align-items: center;
          gap: 11px;
          margin: 0;
          color: rgba(255, 251, 239, .94);
          font-family: var(--font-nav), Arial, sans-serif;
          font-size: 9px;
          font-weight: 500;
          letter-spacing: .26em;
          line-height: 1.5;
          text-transform: uppercase;
        }
        .watercolor-intro__place i {
          display: block;
          width: 8px;
          height: 8px;
          border: 1px solid currentColor;
          border-radius: 50%;
          box-shadow: 14px 7px 0 -4px rgba(255, 251, 239, .86), -13px 12px 0 -4px rgba(255, 251, 239, .68);
        }
        .watercolor-intro__cover-copy {
          position: absolute;
          z-index: 4;
          left: 50%;
          bottom: clamp(70px, 11vh, 142px);
          width: min(620px, calc(100vw - 56px));
          transform: translateX(-50%);
          text-align: center;
          text-shadow: 0 5px 24px rgba(40, 53, 36, .42);
          transition: opacity .38s ease, transform .7s cubic-bezier(.22, 1, .36, 1);
        }
        .watercolor-intro__eyebrow,
        .watercolor-intro__date {
          margin: 0;
          font-family: var(--font-nav), Arial, sans-serif;
          font-size: 10px;
          font-weight: 500;
          letter-spacing: .3em;
          line-height: 1.65;
          text-transform: uppercase;
        }
        .watercolor-intro__eyebrow { color: rgba(255, 251, 239, .88); }
        .watercolor-intro__date { color: #f2d6a4; }
        .watercolor-intro__cover-copy h1 {
          margin: 22px 0 18px;
          color: #fffaf0;
          font-family: var(--font-title), Georgia, serif;
          font-size: clamp(58px, 9vw, 118px);
          font-weight: 400;
          letter-spacing: 0;
          line-height: .76;
        }
        .watercolor-intro__cover-copy h1 span { display: block; }
        .watercolor-intro__cover-copy h1 i {
          display: block;
          margin: 12px 0;
          color: #f5d6a0;
          font-size: .35em;
          font-style: italic;
        }
        .watercolor-intro__open {
          display: inline-flex;
          position: relative;
          z-index: 1;
          align-items: center;
          gap: 13px;
          margin-top: 34px;
          border: 1px solid rgba(255, 250, 235, .78);
          padding: 15px 19px;
          background: rgba(77, 96, 70, .32);
          color: #fffaf0;
          font-family: var(--font-nav), Arial, sans-serif;
          font-size: 10px;
          font-weight: 500;
          letter-spacing: .22em;
          text-transform: uppercase;
          backdrop-filter: blur(4px);
          cursor: pointer;
          transition: background .2s ease, transform .2s ease;
        }
        .watercolor-intro__open:hover { background: rgba(77, 96, 70, .62); transform: translateY(-2px); }
        .watercolor-intro__open i {
          display: block;
          width: 12px;
          height: 12px;
          border: 1px solid currentColor;
          border-radius: 50%;
          animation: watercolor-breath 2.6s ease-in-out infinite;
        }
        .watercolor-intro.is-open .watercolor-intro__cover-copy {
          opacity: 0;
          pointer-events: none;
          transform: translate(-50%, 18px);
        }
        .watercolor-intro.is-open .watercolor-intro__scene {
          filter: saturate(.72) brightness(.48) blur(2px);
          transform: scale(1.08);
        }
        .watercolor-intro.is-open::before { background: rgba(54, 72, 47, .5); }
        .watercolor-intro__card {
          position: absolute;
          z-index: 5;
          top: 50%;
          left: 50%;
          display: grid;
          width: min(570px, calc(100vw - 52px));
          min-height: min(604px, calc(100vh - 54px));
          box-sizing: border-box;
          place-items: center;
          padding: clamp(36px, 6vw, 76px);
          background: #f7f0df;
          color: #506242;
          box-shadow: 0 42px 120px rgba(8, 23, 16, .48);
          opacity: 0;
          pointer-events: none;
        }
        .watercolor-intro__card::before {
          position: absolute;
          inset: 15px;
          border: 1px solid rgba(54, 85, 68, .34);
          content: "";
        }
        .watercolor-intro__card::after {
          position: absolute;
          inset: 28px;
          border: 1px solid rgba(173, 116, 75, .48);
          content: "";
        }
        .watercolor-intro__paper { position: relative; z-index: 1; width: 100%; text-align: center; }
        .watercolor-intro__paper h1 {
          margin: 28px 0 24px;
          font-size: clamp(49px, 7.2vw, 82px);
          font-weight: 400;
          line-height: .86;
        }
        .watercolor-intro__paper h1 span { display: block; white-space: nowrap; }
        .watercolor-intro__paper h1 em {
          display: block;
          margin: 11px 0;
          color: #af754d;
          font-size: .38em;
          font-style: italic;
        }
        .watercolor-intro__paper .watercolor-intro__eyebrow { color: #607e68; }
        .watercolor-intro__paper .watercolor-intro__date { color: #536c5a; }
        .watercolor-intro__enter {
          margin-top: 42px;
          border: 1px solid #506242;
          padding: 15px 22px;
          background: #506242;
          color: #f7f0df;
          font-family: var(--font-nav), Arial, sans-serif;
          font-size: 10px;
          font-weight: 500;
          letter-spacing: .21em;
          text-transform: uppercase;
          cursor: pointer;
          transition: background .2s ease, color .2s ease;
        }
        .watercolor-intro__enter:hover { background: #a86f49; color: #fff9ed; }
        .watercolor-intro.is-open .watercolor-intro__card {
          animation: watercolor-card-in .9s cubic-bezier(.22, 1, .36, 1) .22s forwards;
          pointer-events: auto;
        }
        @media (max-width: 640px) {
          .watercolor-intro::after { inset: 12px; }
          .watercolor-intro__place { top: 29px; left: 29px; }
          .watercolor-intro__cover-copy { bottom: 76px; width: calc(100vw - 44px); }
          .watercolor-intro__cover-copy h1 { font-size: clamp(54px, 16vw, 78px); }
          .watercolor-intro__card { min-height: min(630px, calc(100dvh - 38px)); }
        }
        @media (prefers-reduced-motion: reduce) {
          .watercolor-intro, .watercolor-intro * { animation-duration: 1ms !important; transition-duration: 1ms !important; }
        }
      `}</style>

      <img
        className="watercolor-intro__scene"
        src="/images/azure/finca-acuarela.png"
        alt="Ilustración en acuarela de la finca de la celebración"
      />
      <p className="watercolor-intro__place"><i aria-hidden="true" /> La finca</p>

      <div className="watercolor-intro__cover-copy">
        <p className="watercolor-intro__eyebrow" data-editor-key="hero.eyebrow">{templateValues.hero.eyebrow}</p>
        <h1><span data-editor-key="couple.partner1">{weddingData.couple.partner1}</span><i>&amp;</i><span data-editor-key="couple.partner2">{weddingData.couple.partner2}</span></h1>
        <p className="watercolor-intro__date"><span data-editor-key="event.dateLabel">{weddingData.event.dateLabel}</span> / <span data-editor-key="event.city">{weddingData.event.city}</span></p>
        <button className="watercolor-intro__open" type="button" onClick={() => setStage("opened")}><i aria-hidden="true" /> Descubrir la invitación</button>
      </div>

      <article className="watercolor-intro__card" aria-hidden={!opened}>
        <div className="watercolor-intro__paper">
          <p className="watercolor-intro__eyebrow" data-editor-key="hero.eyebrow">{templateValues.hero.eyebrow}</p>
          <h1><span data-editor-key="couple.partner1">{weddingData.couple.partner1}</span><em>&amp;</em><span data-editor-key="couple.partner2">{weddingData.couple.partner2}</span></h1>
          <p className="watercolor-intro__date"><span data-editor-key="event.dateLabel">{weddingData.event.dateLabel}</span><br /><span data-editor-key="event.venue">{weddingData.event.venue}</span></p>
          <button className="watercolor-intro__enter" type="button" onClick={enterCelebration}>Entrar a la celebración</button>
        </div>
      </article>
    </section>
  );
}
