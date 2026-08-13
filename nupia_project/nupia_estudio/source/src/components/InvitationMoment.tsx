import { useState } from "react";
import { ArrowUpRight } from "lucide-react";

const InvitationMoment = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <section className="invitation-moment" aria-labelledby="moment-title">
      <div className="invitation-moment__heading brand-shell">
        <p className="brand-index">02 / UN GESTO</p>
        <h2 id="moment-title">La información puede<br /><em>esperar un segundo.</em></h2>
        <p>La tecnología organiza el día. El primer gesto, en cambio, debería pertenecer solo a vosotros.</p>
      </div>

      <div className={`invitation-moment__scene${isOpen ? " is-open" : ""}`}>
        <div className="invitation-moment__envelope-visual" aria-hidden="true">
          <img className="invitation-moment__envelope-image invitation-moment__envelope-image--closed" src="/images/nupia-envelope-closed.png" alt="" />
          <img className="invitation-moment__envelope-image invitation-moment__envelope-image--open" src="/images/nupia-envelope-open-v2.png" alt="" />
          <div className="invitation-moment__card-details" aria-hidden="true">
            <span>UNA CELEBRACIÓN</span>
            <strong>MARTA <em>&amp;</em> DIEGO</strong>
            <i />
            <small>12 SEPTIEMBRE 2027<br />MASIA DEL MAR</small>
          </div>
          <div className="invitation-moment__envelope-caption">
            <span>UNA CELEBRACIÓN</span>
            <strong>MARTA &amp; DIEGO</strong>
            <small>12.09.2027 / MASIA DEL MAR</small>
          </div>
        </div>
        <div className="invitation-moment__scene-copy" aria-live="polite">
          <p>{isOpen ? "EL DIA, ABIERTO" : "TOCAD PARA DESCUBRIR"}</p>
          <span>{isOpen ? "Una entrada puede cambiar por completo el primer minuto." : "Una escena, no una pantalla."}</span>
        </div>
        <button
          type="button"
          className="invitation-moment__trigger"
          aria-pressed={isOpen}
          onClick={() => setIsOpen((current) => !current)}
        >
          {isOpen ? "Cerrar la escena" : "Abrir la invitación"}
          <ArrowUpRight aria-hidden="true" />
        </button>
      </div>
    </section>
  );
};

export default InvitationMoment;
