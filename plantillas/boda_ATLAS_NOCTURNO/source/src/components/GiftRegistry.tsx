import { ArrowUpRight } from "lucide-react";

const GiftRegistry = () => (
  <section id="regalos" data-editor-component="gifts" className="atlas-gifts scroll-animate">
    <div className="atlas-gifts__frame">
      <p className="atlas-kicker">Una nota para quienes preguntan</p>
      <p className="atlas-gifts__mark" aria-hidden="true">A</p>
      <div className="atlas-gifts__copy">
        <h2>Lo mejor es<br />que esteis.</h2>
        <p>Vuestra presencia ya es el regalo. Para quien quiera acompanar tambien el proximo capitulo, dejad aqui una cuenta, una lista o una nota personal.</p>
        <a href="#confirmar-asistencia">Ver los detalles <ArrowUpRight aria-hidden="true" /></a>
      </div>
    </div>
  </section>
);

export default GiftRegistry;
