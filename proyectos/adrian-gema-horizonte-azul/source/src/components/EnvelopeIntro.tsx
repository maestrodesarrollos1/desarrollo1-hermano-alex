import { useEffect, useRef, useState } from "react";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { templateValues as v } from "@/config/template-values";

export default function EnvelopeIntro({ onComplete }: { onComplete?: () => void }) {
  const [opened, setOpened] = useState(false);
  const enterRef = useRef<HTMLButtonElement>(null);
  useEffect(() => { if (opened) enterRef.current?.focus({preventScroll:true}); }, [opened]);
  return <section className={`az-intro${opened ? " is-open" : ""}`} aria-label="Invitación de Adrián y Gema">
    <img className="az-intro-scene" src="/images/pareja/finca-ilustrada.webp" alt="Paisaje de finca ilustrado en acuarela" fetchPriority="high" />
    {!opened ? <>
      <p className="az-intro-top">Una invitación para vosotros</p>
      <div className="az-intro-copy">
        <p className="az-kicker">Nos casamos</p>
        <h1>{v.couple.partner1} <em>&amp;</em> {v.couple.partner2}</h1>
        <p className="az-intro-date">{v.event.dateLabel} · {v.event.venue}</p>
        <button className="az-button" onClick={() => setOpened(true)}>Descubrir la invitación <ArrowUpRight size={17}/></button>
      </div>
      <p className="az-intro-foot">{v.hero.eyebrow}</p>
    </> : <article className="az-invitation">
      <div className="az-invitation-illustration" aria-hidden="true" />
      <div className="az-invitation-paper">
        <p className="az-kicker">Nuestra boda</p>
        <h1><span>{v.couple.partner1}</span><em>&amp;</em><span>{v.couple.partner2}</span></h1>
        <p className="az-invitation-quote">{v.hero.eyebrow}</p>
        <div className="az-invitation-date"><span>Sábado</span><strong>27.03.27</strong><span>{v.event.venue} · 12:00 h</span></div>
        <button ref={enterRef} className="az-button" onClick={onComplete}>Entrar a la celebración <ArrowRight size={17}/></button>
      </div>
    </article>}
  </section>;
}
