import { useEffect, useRef, useState } from "react";
import { weddingData } from "@/data/weddingData";
import { templateValues } from "@/config/template-values";
import flowersImage from "../../resources/flores.png";

type EnvelopeIntroProps = {
  onComplete?: () => void;
};

type IntroStage = "closed" | "opening" | "revealed" | "leaving";

export default function EnvelopeIntro({ onComplete }: EnvelopeIntroProps) {
  const [stage, setStage] = useState<IntroStage>("closed");
  const [showHint, setShowHint] = useState(false);
  const timers = useRef<number[]>([]);
  const completed = useRef(false);

  const at = (ms: number, fn: () => void) => {
    const id = window.setTimeout(fn, ms);
    timers.current.push(id);
  };

  useEffect(() => {
    return () => timers.current.forEach(window.clearTimeout);
  }, []);

  useEffect(() => {
    const fontId = "wedding-intro-fonts";
    if (document.getElementById(fontId)) return;

    const link = document.createElement("link");
    link.id = fontId;
    link.rel = "stylesheet";
    link.href =
      "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500;600&family=Montserrat:wght@300;400;500&display=swap";
    document.head.appendChild(link);
  }, []);

  useEffect(() => {
    if (stage !== "closed") return;

    const hintIn = window.setTimeout(() => setShowHint(true), 4200);
    const hintOut = window.setTimeout(() => setShowHint(false), 9800);
    timers.current.push(hintIn, hintOut);

    return () => {
      clearTimeout(hintIn);
      clearTimeout(hintOut);
    };
  }, [stage]);

  const completeIntro = () => {
    if (completed.current) return;
    completed.current = true;
    onComplete?.();
  };

  const handleOpen = () => {
    if (stage !== "closed") return;

    setShowHint(false);
    setStage("opening");
    at(980, () => setStage("revealed"));
    at(2350, () => {
      setStage("leaving");
      completeIntro();
    });
  };

  const isOpen = stage !== "closed";
  const leaving = stage === "leaving";

  return (
    <div style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}>
      <style>{`
        @keyframes folioIn {
          from { opacity: 0; transform: translateY(24px) scale(.97); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes invitationFloat {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-7px); }
        }
        @keyframes shimmerLine {
          from { transform: translateX(-115%); }
          to { transform: translateX(115%); }
        }
        @keyframes hintRise {
          0%, 100% { opacity: .55; transform: translate(-50%, 0); }
          50% { opacity: .95; transform: translate(-50%, -8px); }
        }
        .folio-shell {
          animation: folioIn 850ms cubic-bezier(.22,1,.36,1) both;
        }
        .folio-card {
          animation: invitationFloat 4.8s ease-in-out infinite;
        }
        .folio-line::after {
          animation: shimmerLine 2.2s ease-in-out infinite;
          background: linear-gradient(90deg, transparent, color-mix(in srgb, var(--template-primary) 42%, white), transparent);
          content: "";
          inset: 0;
          position: absolute;
        }
        .folio-seal:hover {
          background: var(--template-primary-dark) !important;
          transform: translate(-50%, -50%) scale(1.04) !important;
        }
      `}</style>

      <div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 140,
          display: "grid",
          placeItems: "center",
          overflow: "hidden",
          padding: "clamp(18px, 4vw, 42px)",
          background:
            "radial-gradient(circle at 50% 18%, color-mix(in srgb, var(--template-soft) 72%, white) 0%, transparent 34%), linear-gradient(135deg, #fffaf8 0%, var(--template-surface) 46%, color-mix(in srgb, var(--template-primary-dark) 12%, #fff) 100%)",
          opacity: leaving ? 0 : 1,
          filter: leaving ? "blur(10px)" : "blur(0)",
          transition: "opacity 780ms ease, filter 780ms ease",
          pointerEvents: leaving ? "none" : "auto",
        }}
      >
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: "clamp(14px, 3vw, 32px)",
            border: "1px solid color-mix(in srgb, var(--template-primary) 22%, transparent)",
          }}
        />
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: "clamp(28px, 5vw, 58px)",
            border: "1px solid color-mix(in srgb, var(--template-soft) 60%, transparent)",
          }}
        />

        <div
          className="folio-shell"
          style={{
            position: "relative",
            width: "min(92vw, 680px)",
            height: "min(78vh, 510px)",
            minHeight: 390,
            perspective: "1600px",
          }}
        >
          <div
            className="folio-card"
            style={{
              position: "absolute",
              inset: "6% 7%",
              display: "grid",
              placeItems: "center",
              padding: "clamp(22px, 5vw, 56px)",
              background:
                "linear-gradient(145deg, rgba(255,255,255,.96), color-mix(in srgb, var(--template-soft) 28%, white))",
              border: "1px solid color-mix(in srgb, var(--template-primary) 20%, white)",
              boxShadow: "0 28px 80px color-mix(in srgb, var(--template-primary-dark) 14%, transparent)",
              opacity: isOpen ? 1 : 0.18,
              transform: isOpen ? "translateY(0) scale(1)" : "translateY(18px) scale(.94)",
              transition: "opacity 760ms ease 260ms, transform 980ms cubic-bezier(.22,1,.36,1) 220ms",
            }}
          >
            <img
              src={flowersImage}
              alt=""
              aria-hidden="true"
              style={{
                position: "absolute",
                left: "-32px",
                top: "-30px",
                width: "clamp(118px, 24vw, 190px)",
                transform: "rotate(-18deg)",
                opacity: 0.12,
                pointerEvents: "none",
              }}
            />
            <img
              src={flowersImage}
              alt=""
              aria-hidden="true"
              style={{
                position: "absolute",
                right: "-34px",
                bottom: "-36px",
                width: "clamp(126px, 25vw, 210px)",
                transform: "rotate(164deg)",
                opacity: 0.1,
                pointerEvents: "none",
              }}
            />
            <div style={{ width: "100%", textAlign: "center", color: "var(--template-primary-dark)" }}>
              <p
                data-editor-key="hero.eyebrow"
                style={{
                  margin: 0,
                  fontFamily: "'Montserrat', sans-serif",
                  fontSize: "clamp(10px, 2.2vw, 13px)",
                  fontWeight: 400,
                  letterSpacing: "0.28em",
                  lineHeight: 1.5,
                  textTransform: "uppercase",
                  color: "var(--template-primary)",
                }}
              >
                {templateValues.hero.eyebrow}
              </p>

              <h1
                style={{
                  margin: "clamp(18px, 5vw, 34px) 0 0",
                  fontSize: "clamp(42px, 10vw, 86px)",
                  fontWeight: 400,
                  lineHeight: 0.95,
                }}
              >
                <span data-editor-key="couple.partner1">{weddingData.couple.partner1}</span>
                <span style={{ display: "block", margin: "0.08em 0", fontSize: "0.38em", color: "var(--template-primary)" }}>
                  &
                </span>
                <span data-editor-key="couple.partner2">{weddingData.couple.partner2}</span>
              </h1>

              <div
                className="folio-line"
                style={{
                  position: "relative",
                  height: 1,
                  width: "min(58%, 260px)",
                  margin: "clamp(22px, 5vw, 32px) auto",
                  overflow: "hidden",
                  background: "color-mix(in srgb, var(--template-primary) 28%, transparent)",
                }}
              />

              <p
                style={{
                  margin: 0,
                  fontFamily: "'Montserrat', sans-serif",
                  fontSize: "clamp(11px, 2.4vw, 15px)",
                  letterSpacing: "0.2em",
                  lineHeight: 1.7,
                  textTransform: "uppercase",
                  color: "var(--template-text)",
                }}
              >
                <span data-editor-key="event.dateLabel">{weddingData.event.dateLabel}</span>
                <span aria-hidden="true"> · </span>
                <span data-editor-key="event.city">{weddingData.event.city}</span>
              </p>
            </div>
          </div>

          <div
            aria-hidden="true"
            style={{
              position: "absolute",
              inset: 0,
              boxShadow: "0 34px 90px color-mix(in srgb, var(--template-primary-dark) 18%, transparent)",
              pointerEvents: "none",
            }}
          />

          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              transformStyle: "preserve-3d",
              pointerEvents: isOpen ? "none" : "auto",
            }}
          >
            <div
              style={{
                position: "relative",
                background:
                  "linear-gradient(135deg, var(--template-primary-dark), color-mix(in srgb, var(--template-primary) 72%, #111))",
                borderRight: "1px solid color-mix(in srgb, var(--template-soft) 22%, transparent)",
                transformOrigin: "0% 50%",
                transform: isOpen ? "rotateY(-106deg)" : "rotateY(0deg)",
                transition: "transform 1180ms cubic-bezier(.22,1,.36,1)",
                overflow: "hidden",
              }}
            >
              <img
                src={flowersImage}
                alt=""
                aria-hidden="true"
                style={{
                  position: "absolute",
                  left: "-54px",
                  top: "-50px",
                  width: "clamp(110px, 22vw, 168px)",
                  transform: "rotate(-22deg)",
                  opacity: isOpen ? 0.02 : 0.18,
                  transition: "opacity 520ms ease",
                  pointerEvents: "none",
                }}
              />
              <PanelPattern side="left" />
            </div>
            <div
              style={{
                position: "relative",
                background:
                  "linear-gradient(225deg, var(--template-primary-dark), color-mix(in srgb, var(--template-primary) 72%, #111))",
                borderLeft: "1px solid color-mix(in srgb, var(--template-soft) 22%, transparent)",
                transformOrigin: "100% 50%",
                transform: isOpen ? "rotateY(106deg)" : "rotateY(0deg)",
                transition: "transform 1180ms cubic-bezier(.22,1,.36,1)",
                overflow: "hidden",
              }}
            >
              <img
                src={flowersImage}
                alt=""
                aria-hidden="true"
                style={{
                  position: "absolute",
                  right: "-58px",
                  bottom: "-58px",
                  width: "clamp(118px, 24vw, 180px)",
                  transform: "rotate(158deg)",
                  opacity: isOpen ? 0.02 : 0.17,
                  transition: "opacity 520ms ease",
                  pointerEvents: "none",
                }}
              />
              <PanelPattern side="right" />
            </div>
          </div>

          {stage === "closed" ? (
            <button
              className="folio-seal"
              onClick={handleOpen}
              aria-label="Abrir invitacion"
              style={{
                position: "absolute",
                left: "50%",
                top: "50%",
                zIndex: 12,
                width: "clamp(88px, 18vw, 116px)",
                height: "clamp(88px, 18vw, 116px)",
                borderRadius: "50%",
                border: "1px solid color-mix(in srgb, var(--template-soft) 58%, white)",
                background: "var(--template-primary)",
                boxShadow:
                  "0 18px 34px color-mix(in srgb, var(--template-primary-dark) 28%, transparent), inset 0 0 0 8px color-mix(in srgb, var(--template-soft) 22%, transparent)",
                color: "#fffaf8",
                cursor: "pointer",
                transform: "translate(-50%, -50%)",
                transition: "background 260ms ease, transform 260ms ease",
              }}
            >
              <span
                style={{
                  display: "grid",
                  placeItems: "center",
                  width: "100%",
                  height: "100%",
                  fontSize: "clamp(24px, 5vw, 34px)",
                  fontWeight: 500,
                  letterSpacing: "0.04em",
                }}
              >
                {(weddingData.couple.partner1.charAt(0) || "N").toUpperCase()}
                <span style={{ fontSize: "0.5em", margin: "-0.24em 0", opacity: 0.82 }}>&</span>
                {(weddingData.couple.partner2.charAt(0) || "N").toUpperCase()}
              </span>
            </button>
          ) : null}

          {showHint && stage === "closed" ? (
            <div
              style={{
                position: "absolute",
                left: "50%",
                bottom: "clamp(18px, 5vw, 38px)",
                zIndex: 11,
                animation: "hintRise 1.6s ease-in-out infinite",
                color: "#fffaf8",
                fontFamily: "'Montserrat', sans-serif",
                fontSize: "11px",
                letterSpacing: "0.22em",
                textTransform: "uppercase",
                pointerEvents: "none",
              }}
            >
              Tocar para abrir
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

function PanelPattern({ side }: { side: "left" | "right" }) {
  return (
    <>
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: "clamp(16px, 3vw, 28px)",
          border: "1px solid color-mix(in srgb, var(--template-soft) 34%, transparent)",
          }}
        />
      <img
        src={flowersImage}
        alt=""
        aria-hidden="true"
        style={{
          position: "absolute",
          top: "-46px",
          left: side === "left" ? "-22px" : undefined,
          right: side === "right" ? "-22px" : undefined,
          width: "clamp(138px, 28vw, 220px)",
          height: "auto",
          objectFit: "contain",
          opacity: 0.18,
          transform: side === "left" ? "rotate(82deg)" : "rotate(98deg) scaleX(-1)",
          transformOrigin: "top center",
          filter: "saturate(.92)",
          pointerEvents: "none",
        }}
      />
      <img
        src={flowersImage}
        alt=""
        aria-hidden="true"
        style={{
          position: "absolute",
          top: "28%",
          left: side === "left" ? "-68px" : undefined,
          right: side === "right" ? "-68px" : undefined,
          width: "clamp(112px, 22vw, 168px)",
          height: "auto",
          objectFit: "contain",
          opacity: 0.1,
          transform: side === "left" ? "rotate(36deg)" : "rotate(-36deg) scaleX(-1)",
          filter: "saturate(.85)",
          pointerEvents: "none",
        }}
      />
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          background:
            side === "left"
              ? "linear-gradient(105deg, rgba(255,255,255,.1) 0%, transparent 34%, rgba(0,0,0,.16) 100%)"
              : "linear-gradient(255deg, rgba(255,255,255,.1) 0%, transparent 34%, rgba(0,0,0,.16) 100%)",
          opacity: 0.72,
        }}
      />
    </>
  );
}
