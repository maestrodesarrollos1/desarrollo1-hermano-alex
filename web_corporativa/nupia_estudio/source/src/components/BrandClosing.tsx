import { ArrowUpRight } from "lucide-react";

const steps = [
  ["01", "Elegis el tono."],
  ["02", "Nos contais el dia."],
  ["03", "La experiencia toma forma."],
] as const;

const BrandClosing = () => (
  <footer id="proceso" className="brand-closing" aria-labelledby="closing-title">
    <div className="brand-closing__process brand-shell">
      <div>
        <p className="brand-index">06 / SIN CONVERTIRLO EN OTRA TAREA</p>
        <h2 id="closing-title">Vosotros traeis<br />la historia. <em>Nosotros<br />le damos lugar.</em></h2>
      </div>
      <ol>
        {steps.map(([number, title]) => (
          <li key={number}><span>{number}</span><p>{title}</p></li>
        ))}
      </ol>
    </div>

    <div className="brand-closing__cta brand-shell">
      <p>Una pagina para el dia que no se repite.</p>
      <a href="#contacto">Escribirnos <ArrowUpRight aria-hidden="true" /></a>
    </div>

    <div className="brand-closing__bottom brand-shell">
      <a href="#inicio" className="brand-closing__mark" aria-label="Nupia, volver al inicio">NUPIA</a>
      <span>EXPERIENCIAS DIGITALES PARA BODAS</span>
      <a href="mailto:maestrodesarrollos1@gmail.com">maestrodesarrollos1@gmail.com</a>
    </div>
  </footer>
);

export default BrandClosing;
