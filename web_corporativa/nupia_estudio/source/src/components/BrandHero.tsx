import { ArrowDown } from "lucide-react";

const BrandHero = () => (
  <section id="inicio" className="brand-hero" aria-labelledby="hero-title">
    <img
      className="brand-hero__image"
      src="/images/nupia-hero-manor.png"
      alt="Mesa de boda iluminada por velas tras un gran arco de piedra al anochecer"
    />
    <div className="brand-hero__shade" aria-hidden="true" />
    <div className="brand-hero__grain" aria-hidden="true" />

    <div className="brand-hero__topline" aria-hidden="true">
      <span>01 / 05</span>
      <span>WEBS DE BODA, HECHAS A MEDIDA</span>
    </div>

    <div className="brand-hero__content">
      <p className="brand-kicker">NUPIA / ESTUDIO DE EXPERIENCIAS DIGITALES</p>
      <h1 id="hero-title">La boda<br />empieza <em>antes</em><br />de llegar.</h1>
      <p>Diseñamos páginas de boda que hacen que el primer enlace ya se sienta como parte del día.</p>
      <a className="brand-hero__link" href="#obra">Entrar en la historia <ArrowDown aria-hidden="true" /></a>
    </div>

    <p className="brand-hero__caption">Nupia es la primera experiencia<br />que reciben vuestros invitados.</p>
  </section>
);

export default BrandHero;
