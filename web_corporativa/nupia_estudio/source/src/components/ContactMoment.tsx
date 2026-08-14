import type { FormEvent } from "react";
import { ArrowUpRight } from "lucide-react";

const CONTACT_EMAIL = "maestrodesarrollos1@gmail.com";

const ContactMoment = () => {
  const openEmail = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const details = new FormData(event.currentTarget);
    const names = String(details.get("names") ?? "").trim();
    const date = String(details.get("date") ?? "").trim();
    const email = String(details.get("email") ?? "").trim();
    const note = String(details.get("note") ?? "").trim();
    const subject = names ? `Nupia - ${names}` : "Nupia - Consulta de web de boda";
    const body = [
      `Nombres: ${names || "Sin indicar"}`,
      `Fecha: ${date || "Sin indicar"}`,
      `Correo: ${email || "Sin indicar"}`,
      "",
      note || "Hola, queremos conocer Nupia.",
    ].join("\n");

    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  return (
    <section id="contacto" className="contact-moment" aria-labelledby="contact-title">
      <div className="contact-moment__layout brand-shell">
        <div className="contact-moment__intro">
          <p className="brand-index">05 / PRIMERA CONVERSACION</p>
          <h2 id="contact-title">La vuestra puede<br />empezar <em>aqui.</em></h2>
          <p>Dejadnos lo esencial. Abriremos un correo con vuestra historia ya preparada para llegar a nuestro estudio.</p>
          <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}<ArrowUpRight aria-hidden="true" /></a>
        </div>

        <form className="contact-sheet" onSubmit={openEmail}>
          <div className="contact-sheet__topline">
            <span>NUPIA / FICHA PRIVADA</span>
            <span>01</span>
          </div>
          <label>
            <span>VUESTROS NOMBRES</span>
            <input name="names" type="text" autoComplete="name" placeholder="Marta y Diego" required />
          </label>
          <div className="contact-sheet__split">
            <label>
              <span>FECHA APROXIMADA</span>
              <input name="date" type="date" />
            </label>
            <label>
              <span>VUESTRO CORREO</span>
              <input name="email" type="email" autoComplete="email" placeholder="hola@ejemplo.com" required />
            </label>
          </div>
          <label>
            <span>UNA PISTA SOBRE VUESTRO DIA</span>
            <textarea name="note" rows={3} placeholder="Una finca, una ciudad, una foto que os represente..." />
          </label>
          <button type="submit">Abrir el correo <ArrowUpRight aria-hidden="true" /></button>
        </form>
      </div>
    </section>
  );
};

export default ContactMoment;
