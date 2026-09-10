import { ArrowUpRight } from "lucide-react";

const FeaturedExperience = () => (
  <section id="obra" className="featured-work brand-shell" aria-labelledby="featured-title">
    <div className="featured-work__intro">
      <p className="brand-index">01 / MUCHO MÁS QUE UNA FECHA</p>
      <h2 id="featured-title">Que os reconozcan.<br /><em>Incluso antes de leer vuestros nombres.</em></h2>
      <div className="featured-work__lede">
        <p>Habéis elegido cada detalle de la boda. La invitación también puede hablar de vosotros.</p>
        <p>Damos forma a una web con vuestras fotografías, colores e historia. Y reunimos en ella lo que vuestros invitados necesitan saber.</p>
        <a className="text-link" href="#proceso">Vosotros la imagináis. Nosotros la creamos. <ArrowUpRight aria-hidden="true" /></a>
      </div>
    </div>
    <dl className="featured-work__notes">
      <div><dt>Una primera emoción.</dt><dd>Una entrada con personalidad y un espacio para vuestra historia.</dd></div>
      <div><dt>El día, en un solo lugar.</dt><dd>Fecha, horarios, ubicación y detalles prácticos, siempre a mano.</dd></div>
      <div><dt>Un enlace para compartir.</dt><dd>Una web que los invitados abren desde el móvil, sin instalar una app.</dd></div>
    </dl>
  </section>
);
export default FeaturedExperience;
