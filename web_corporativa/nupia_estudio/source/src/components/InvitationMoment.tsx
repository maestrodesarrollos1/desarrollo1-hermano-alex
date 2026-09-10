const steps = [
  { title: "Encontramos vuestro tono.", text: "Un diseño, una fotografía o una idea. Partimos de lo que os representa y concretamos qué necesitáis." },
  { title: "Nos contáis vuestra boda.", text: "Nombres, fecha, fotografías y detalles del día. Un único documento para reunir la información, aunque aún queden cosas por decidir." },
  { title: "Le damos forma.", text: "Preparamos vuestra web con esa información. Revisamos los detalles con vosotros antes de que la compartáis con los invitados." },
];

const InvitationMoment = () => (
  <section id="proceso" className="invitation-moment" aria-labelledby="moment-title">
    <div className="brand-shell process-layout">
      <div className="process-visual">
        <img src="/images/nupia-envelope-closed-800.webp" srcSet="/images/nupia-envelope-closed-800.webp 800w, /images/nupia-envelope-closed-1600.webp 1600w" sizes="(max-width: 760px) 100vw, 50vw" width={1672} height={941} alt="Sobre de papel texturizado, sello y rama de olivo sobre tela verde" loading="lazy" decoding="async" />
        <p>Vuestro primer detalle.<br /><em>Nuestro punto de partida.</em></p>
      </div>
      <div className="process-copy">
        <p className="brand-index">03 / ASÍ EMPEZAMOS</p>
        <h2 id="moment-title">Bastante tenéis<br />con organizar<br /><em>una boda.</em></h2>
        <p className="section-lede">No necesitáis aprender a diseñar una web. Solo contarnos cómo queréis que se sienta la vuestra.</p>
        <ol>{steps.map((step, index) => <li key={step.title}><span>0{index + 1}</span><div><h3>{step.title}</h3><p>{step.text}</p></div></li>)}</ol>
      </div>
    </div>
  </section>
);
export default InvitationMoment;
