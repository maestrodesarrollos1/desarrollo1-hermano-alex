import { ArrowDown } from "lucide-react";

const BrandHero = () => (
  <section id="inicio" className="brand-hero" aria-labelledby="hero-title">
    <img
      className="brand-hero__image"
      src="/images/nupia-hero-manor-1600.webp"
      srcSet="/images/nupia-hero-manor-800.webp 800w, /images/nupia-hero-manor-1600.webp 1600w"
      sizes="100vw"
      width={1672}
      height={941}
      fetchPriority="high"
      alt="Mesa de boda iluminada por velas tras un gran arco de piedra al anochecer"
    />
    <div className="brand-hero__shade" aria-hidden="true" />
    <div className="brand-hero__grain" aria-hidden="true" />

    <div className="brand-hero__topline" aria-hidden="true">
      <span>DISEÑO QUE SE SIENTE</span>
      <span>ESTUDIO DIGITAL / BODAS</span>
    </div>

    <div className="brand-hero__content">
      <p className="brand-kicker">NUPIA / LA PRIMERA IMPRESIÓN DE VUESTRA BODA</p>
      <h1 id="hero-title">Webs de boda.<br /><em>Muy vuestras.</em></h1>
      <p>Vuestras fotos, vuestra forma de celebrar. Una invitación que emociona al abrirse y acompaña a los invitados hasta el gran día.</p>
      <a className="brand-hero__link" href="#coleccion">Descubrir los diseños <ArrowDown aria-hidden="true" /></a>
    </div>

    <p className="brand-hero__caption">La boda empieza<br /><em>antes de llegar.</em></p>
  </section>
);

export default BrandHero;
