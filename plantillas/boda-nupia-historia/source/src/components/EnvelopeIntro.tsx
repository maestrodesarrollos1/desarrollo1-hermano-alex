import { useEffect, useRef, useState } from "react";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { templateValues as v } from "@/config/template-values";

export default function EnvelopeIntro({ onComplete }: { onComplete?: () => void }) {
  const [opened, setOpened] = useState(false);
  const enterRef = useRef<HTMLButtonElement>(null);
  useEffect(() => { if (opened) enterRef.current?.focus({preventScroll:true}); }, [opened]);
  return <section className={`az-intro${opened ? " is-open" : ""}`} aria-label={`Invitación de ${v.couple.partner1} y ${v.couple.partner2}`}>
    <img className="az-intro-scene" src="/images/azure/finca-acuarela-velo.png" alt="Ilustración en acuarela de una finca entre árboles" />
    {!opened ? <>
      <div className="az-intro-top" aria-label="Invitación de boda">
        <span>{v.couple.partner1} &amp; {v.couple.partner2}</span>
        <i aria-hidden="true" />
        <span>{v.event.dateLabel}</span>
      </div>
      <div className="az-intro-copy">
        <p className="az-kicker">Una invitación para vosotros</p>
        <h1 data-editor-key="hero.eyebrow">{v.hero.eyebrow}</h1>
        <p className="az-intro-date"><span>Nos casamos</span>{v.event.dateLabel} · {v.event.venue}</p>
        <button className="az-button" onClick={() => setOpened(true)}>Descubrir la invitación <ArrowUpRight size={17}/></button>
      </div>
    </> : <article className="az-invitation">
      <div className="az-invitation-illustration" aria-hidden="true" />
      <div className="az-invitation-paper">
        <p className="az-kicker">Nuestra boda</p>
        <h1><span>{v.couple.partner1}</span><em>&amp;</em><span>{v.couple.partner2}</span></h1>
        <p className="az-invitation-quote">{v.hero.eyebrow}</p>
        <div className="az-invitation-date"><span>Nos casamos</span><strong>{v.event.dateLabel}</strong><span>{v.event.venue}</span></div>
        <button ref={enterRef} className="az-button" onClick={onComplete}>Entrar a la celebración <ArrowRight size={17}/></button>
      </div>
    </article>}
  </section>;
}
