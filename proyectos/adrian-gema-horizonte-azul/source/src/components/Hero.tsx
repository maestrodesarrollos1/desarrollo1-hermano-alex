import { ArrowDown } from "lucide-react";
import { templateValues as v } from "@/config/template-values";
export default function Hero() {
  return <section id="hero" data-editor-component="hero" className="az-hero">
    <picture>
      <source media="(max-width: 600px)" srcSet={v.images.landingMobile}/>
      <img src={v.images.landing || v.images.hero} alt="Adrián y Gema mirándose frente al Coliseo de Roma" width="1200" height="1600"/>
    </picture>
    <div className="az-hero-copy">
      <p className="az-kicker">Nos casamos · {v.event.venue}</p>
      <h1><span data-editor-key="couple.partner1">{v.couple.partner1}</span><em>&amp;</em><span data-editor-key="couple.partner2">{v.couple.partner2}</span></h1>
    </div>
    <p className="az-hero-vow" data-editor-key="hero.eyebrow">{v.hero.eyebrow}</p>
    <div className="az-hero-bottom"><span data-editor-key="event.dateLabel">Sábado, {v.event.dateLabel}</span><a href="#countdown" aria-label="Descubrir el día de la boda"><ArrowDown size={20}/></a></div>
  </section>;
}
