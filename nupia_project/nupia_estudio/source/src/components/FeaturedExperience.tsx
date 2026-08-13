const FeaturedExperience = () => (
  <section id="obra" className="featured-work" aria-labelledby="featured-title">
    <div className="featured-work__intro brand-shell">
      <p className="brand-index">01 / LA PRIMERA IMPRESION</p>
      <h2 id="featured-title">No es una invitación.<br />Es la <em>entrada</em> al día.</h2>
      <p className="featured-work__lede">Antes de saber la hora o la dirección, los invitados perciben una atmósfera. Ahí empieza una buena web de boda.</p>
    </div>

    <figure className="featured-work__image">
      <img src="/images/dinner-editorial.png" alt="Detalle editorial de una mesa de boda nocturna con flores blancas y velas" loading="lazy" decoding="async" />
      <div className="featured-work__veil" aria-hidden="true" />
      <figcaption>
        <span>OBRA DESTACADA / 2027</span>
        <strong>EL DÍA DE ALMA &amp; HUGO</strong>
        <span>Una invitación nocturna, pensada para leerse despacio.</span>
      </figcaption>
    </figure>

    <div className="featured-work__notes brand-shell" aria-label="Elementos que puede integrar una web de boda">
      <p><span>01</span> La historia, en vuestro tono.</p>
      <p><span>02</span> El día, sin mensajes perdidos.</p>
      <p><span>03</span> Un lugar para confirmar y volver.</p>
    </div>
  </section>
);

export default FeaturedExperience;
