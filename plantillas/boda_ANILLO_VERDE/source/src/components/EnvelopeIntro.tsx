import { useEffect, useRef, useState } from "react";
import { weddingData } from "@/data/weddingData";
import { templateValues } from "@/config/template-values";

type EnvelopeIntroProps = {
  onComplete?: () => void;
};

type IntroStage = "closed" | "revealed" | "leaving";

export default function EnvelopeIntro({ onComplete }: EnvelopeIntroProps) {
  const [stage, setStage] = useState<IntroStage>("closed");
  const timer = useRef<number | null>(null);
  const isRevealed = stage === "revealed";
  const isLeaving = stage === "leaving";

  useEffect(() => {
    return () => {
      if (timer.current) window.clearTimeout(timer.current);
    };
  }, []);

  const enterSite = () => {
    setStage("leaving");
    timer.current = window.setTimeout(() => onComplete?.(), 700);
  };

  return (
    <section
      className={`jewel-intro ${isRevealed ? "is-revealed" : ""} ${isLeaving ? "is-leaving" : ""}`}
      aria-label="Invitacion de boda"
    >
      <style>{`
        @keyframes introTitleIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes introPaperIn {
          0% { opacity: 0; transform: translate(-50%, -46%) scale(.92); }
          65% { opacity: 1; transform: translate(-50%, -50.8%) scale(1.01); }
          100% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
        }
        .jewel-intro {
          position: fixed;
          inset: 0;
          z-index: 140;
          overflow: hidden;
          isolation: isolate;
          background: #0a120d;
          color: #f7f1e5;
          font-family: var(--font-title), Georgia, serif;
          transition: opacity 700ms ease, filter 700ms ease;
        }
        .jewel-intro.is-leaving {
          opacity: 0;
          filter: blur(7px);
          pointer-events: none;
        }
        .jewel-intro__image {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: 50% 62%;
          filter: saturate(.76) contrast(1.07) brightness(.78);
          transform: scale(1.02);
          transition: transform 1200ms cubic-bezier(.22, 1, .36, 1), filter 900ms ease;
        }
        .jewel-intro::before {
          content: "";
          position: absolute;
          inset: 0;
          z-index: 1;
          background: linear-gradient(90deg, rgba(4, 11, 7, .76) 0%, rgba(4, 11, 7, .24) 54%, rgba(4, 11, 7, .5) 100%), linear-gradient(0deg, rgba(4, 11, 7, .83) 0%, transparent 35%, rgba(4, 11, 7, .34) 100%);
          transition: background 850ms ease;
        }
        .jewel-intro::after {
          content: "";
          position: absolute;
          z-index: 2;
          inset: 22px;
          border: 1px solid rgba(248, 238, 215, .2);
          pointer-events: none;
        }
        .jewel-intro__nupia {
          position: absolute;
          z-index: 3;
          top: clamp(36px, 7vh, 74px);
          right: clamp(34px, 7vw, 116px);
          display: flex;
          align-items: center;
          gap: 9px;
          color: rgba(247, 241, 229, .76);
          font-family: var(--font-nav), Arial, sans-serif;
          font-size: 9px;
          font-weight: 500;
          letter-spacing: .24em;
        }
        .jewel-intro__nupia img { width: 19px; height: 28px; object-fit: contain; filter: brightness(0) invert(1); opacity: .82; }
        .jewel-intro__masthead {
          position: absolute;
          z-index: 3;
          top: clamp(36px, 7vh, 74px);
          left: clamp(34px, 7vw, 116px);
          max-width: min(520px, 78vw);
          transition: opacity 450ms ease, transform 600ms ease;
        }
        .jewel-intro__kicker,
        .jewel-intro__date,
        .jewel-intro__hint,
        .jewel-intro__eyebrow,
        .jewel-intro__location {
          margin: 0;
          font-family: var(--font-nav), Arial, sans-serif;
          font-size: 10px;
          font-weight: 500;
          letter-spacing: .3em;
          line-height: 1.6;
          text-transform: uppercase;
        }
        .jewel-intro__kicker { color: rgba(247, 241, 229, .72); }
        .jewel-intro__names {
          margin: 18px 0 20px;
          font-size: clamp(52px, 7.2vw, 112px);
          font-weight: 400;
          letter-spacing: 0;
          line-height: .83;
          text-wrap: balance;
        }
        .jewel-intro__ampersand {
          display: block;
          margin: 9px 0;
          color: #d9b76f;
          font-size: .46em;
          font-style: italic;
          line-height: .65;
        }
        .jewel-intro__date { color: #d9b76f; }
        .jewel-intro__control {
          position: absolute;
          z-index: 4;
          left: 50%;
          bottom: clamp(42px, 8vh, 86px);
          display: inline-flex;
          align-items: center;
          gap: 15px;
          transform: translateX(-50%);
          border: 0;
          border-bottom: 1px solid rgba(247, 241, 229, .62);
          padding: 0 0 12px;
          background: transparent;
          color: #f7f1e5;
          cursor: pointer;
          transition: color 250ms ease, border-color 250ms ease, opacity 300ms ease;
        }
        .jewel-intro__control:hover { color: #d9b76f; border-color: #d9b76f; }
        .jewel-intro__control svg { width: 23px; height: 23px; transition: transform 260ms ease; }
        .jewel-intro__control:hover svg { transform: translateX(5px); }
        .jewel-intro__hint { white-space: nowrap; }
        .jewel-intro__card {
          position: absolute;
          z-index: 5;
          top: 50%;
          left: 50%;
          width: min(555px, calc(100vw - 54px));
          min-height: min(580px, calc(100vh - 78px));
          display: grid;
          place-items: center;
          padding: clamp(36px, 6vw, 76px);
          box-sizing: border-box;
          background: #f3efe4;
          color: #14382a;
          box-shadow: 0 42px 100px rgba(0, 0, 0, .52);
          opacity: 0;
          pointer-events: none;
        }
        .jewel-intro__card::before,
        .jewel-intro__card::after {
          content: "";
          position: absolute;
          pointer-events: none;
        }
        .jewel-intro__card::before { inset: 16px; border: 1px solid rgba(20, 56, 42, .26); }
        .jewel-intro__card::after { inset: 28px; border: 1px solid rgba(190, 151, 75, .54); }
        .jewel-intro__card-content { position: relative; z-index: 1; text-align: center; }
        .jewel-intro__eyebrow { color: #8d6d2d; }
        .jewel-intro__card h1 {
          margin: 27px 0 22px;
          font-size: clamp(46px, 7vw, 78px);
          font-weight: 400;
          letter-spacing: 0;
          line-height: .9;
        }
        .jewel-intro__card h1 span { display: block; white-space: nowrap; }
        .jewel-intro__card h1 em { display: block; margin: 10px 0; color: #a77b30; font-size: .38em; font-style: italic; line-height: .6; }
        .jewel-intro__location { color: #496758; }
        .jewel-intro__enter {
          margin-top: 42px;
          border: 1px solid #14382a;
          padding: 15px 23px;
          background: #14382a;
          color: #f7f1e5;
          font-family: var(--font-nav), Arial, sans-serif;
          font-size: 10px;
          font-weight: 500;
          letter-spacing: .24em;
          line-height: 1;
          text-transform: uppercase;
          cursor: pointer;
          transition: background 220ms ease, color 220ms ease;
        }
        .jewel-intro__enter:hover { background: #b58a3c; color: #102a20; }
        .jewel-intro.is-revealed .jewel-intro__image {
          transform: scale(1.09);
          filter: saturate(.52) contrast(1.02) brightness(.34) blur(3px);
        }
        .jewel-intro.is-revealed::before { background: rgba(4, 11, 7, .56); }
        .jewel-intro.is-revealed .jewel-intro__masthead,
        .jewel-intro.is-revealed .jewel-intro__control { opacity: 0; transform: translateY(-14px); pointer-events: none; }
        .jewel-intro.is-revealed .jewel-intro__card {
          animation: introPaperIn 880ms cubic-bezier(.22, 1, .36, 1) 70ms forwards;
          pointer-events: auto;
        }
        @media (max-width: 640px) {
          .jewel-intro__image { object-position: 51% 56%; }
          .jewel-intro::before { background: linear-gradient(0deg, rgba(4, 11, 7, .83) 0%, rgba(4, 11, 7, .08) 58%, rgba(4, 11, 7, .36) 100%); }
          .jewel-intro__nupia { top: 30px; right: 28px; }
          .jewel-intro__masthead { top: 54px; left: 42px; }
          .jewel-intro__names { font-size: clamp(47px, 15vw, 70px); }
          .jewel-intro__card { min-height: min(610px, calc(100vh - 52px)); }
        }
        @media (prefers-reduced-motion: reduce) {
          .jewel-intro, .jewel-intro * { animation-duration: 1ms !important; transition-duration: 1ms !important; }
        }
      `}</style>

      <img className="jewel-intro__image" src="/images/intro/jewel-case-editorial.png" alt="Estuche de joyeria verde con lazo de seda" />

      <div className="jewel-intro__nupia" aria-label="Nupia">
        <img src="/images/nupia-mark.png" alt="" />
        <span>NUPIA</span>
      </div>

      <div className="jewel-intro__masthead">
        <p className="jewel-intro__kicker" data-editor-key="hero.eyebrow">{templateValues.hero.eyebrow}</p>
        <p className="jewel-intro__names">
          <span data-editor-key="couple.partner1">{weddingData.couple.partner1}</span>
          <i className="jewel-intro__ampersand">&amp;</i>
          <span data-editor-key="couple.partner2">{weddingData.couple.partner2}</span>
        </p>
        <p className="jewel-intro__date"><span data-editor-key="event.dateLabel">{weddingData.event.dateLabel}</span> / <span data-editor-key="event.city">{weddingData.event.city}</span></p>
      </div>

      <button className="jewel-intro__control" type="button" onClick={() => setStage("revealed")} aria-label="Abrir invitacion">
        <span className="jewel-intro__hint">Descubrir la invitacion</span>
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M4 12h15M13 6l6 6-6 6" stroke="currentColor" strokeWidth="1.25" /></svg>
      </button>

      <article className="jewel-intro__card" aria-hidden={!isRevealed}>
        <div className="jewel-intro__card-content">
          <p className="jewel-intro__eyebrow" data-editor-key="hero.eyebrow">{templateValues.hero.eyebrow}</p>
          <h1>
            <span data-editor-key="couple.partner1">{weddingData.couple.partner1}</span>
            <em>&amp;</em>
            <span data-editor-key="couple.partner2">{weddingData.couple.partner2}</span>
          </h1>
          <p className="jewel-intro__location"><span data-editor-key="event.dateLabel">{weddingData.event.dateLabel}</span><br /><span data-editor-key="event.venue">{weddingData.event.venue}</span></p>
          <button type="button" className="jewel-intro__enter" onClick={enterSite}>Entrar a la celebracion</button>
        </div>
      </article>
    </section>
  );
}
