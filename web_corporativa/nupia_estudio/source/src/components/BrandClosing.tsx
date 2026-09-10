import { ArrowUp } from "lucide-react";

const BrandClosing = () => (
  <footer className="brand-closing">
    <div className="brand-closing__cta brand-shell">
      <p>La próxima historia<br /><em>puede ser la vuestra.</em></p>
      <a className="text-link" href="#coleccion">Volver a los diseños <ArrowUp aria-hidden="true" /></a>
    </div>
    <div className="brand-closing__signature brand-shell" aria-hidden="true"><img src="/images/nupia-mark.png" alt="" />NUPIA</div>
    <div className="brand-closing__bottom brand-shell">
      <span>ESTUDIO DIGITAL / WEBS DE BODA</span>
      <a href="mailto:maestrodesarrollos1@gmail.com">maestrodesarrollos1@gmail.com</a>
      <a href="#inicio" aria-label="Volver al inicio">Al principio <ArrowUp aria-hidden="true" /></a>
    </div>
  </footer>
);
export default BrandClosing;
