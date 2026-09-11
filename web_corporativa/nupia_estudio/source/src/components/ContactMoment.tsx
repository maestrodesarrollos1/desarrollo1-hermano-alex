import { useEffect, useState, type FormEvent } from "react";
import { ArrowUpRight, Copy, Check } from "lucide-react";
import { designs } from "../data/designs";

const CONTACT_EMAIL = "maestrodesarrollos1@gmail.com";
type Props = { selectedDesign: string; onDesignChange: (value: string) => void };

const ContactMoment = ({ selectedDesign, onDesignChange }: Props) => {
  const [draft, setDraft] = useState("");
  const [copyStatus, setCopyStatus] = useState("");
  const [copied, setCopied] = useState(false);
  useEffect(() => {
    setDraft("");
    setCopyStatus("");
    setCopied(false);
  }, [selectedDesign]);

  const openEmail = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const details = new FormData(event.currentTarget);
    const names = String(details.get("names") ?? "").trim();
    const date = String(details.get("date") ?? "").trim();
    const email = String(details.get("email") ?? "").trim();
    const note = String(details.get("note") ?? "").trim();
    if (!names) {
      (event.currentTarget.elements.namedItem("names") as HTMLInputElement).focus();
      return;
    }
    const subject = `Nupia · La boda de ${names}`;
    const body = [
      "Hola, nos gustaría hablar de nuestra web de boda.", "",
      `Nombres: ${names}`, `Fecha aproximada: ${date || "Por decidir"}`,
      `Correo de contacto: ${email}`, `Diseño: ${selectedDesign || "Nos dejamos aconsejar"}`,
      "", note,
    ].join("\n");
    setDraft(`Para: ${CONTACT_EMAIL}\nAsunto: ${subject}\n\n${body}`);
    setCopied(false);
    setCopyStatus("");
    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  const copyDraft = async () => {
    try {
      await navigator.clipboard.writeText(draft);
      setCopied(true);
      setCopyStatus("Consulta copiada. Podéis pegarla en un correo.");
    } catch {
      setCopied(false);
      setCopyStatus("Seleccionad el texto de abajo para copiarlo manualmente.");
    }
  };

  return (
    <section id="contacto" className="contact-moment" aria-labelledby="contact-title">
      <div className="contact-moment__layout brand-shell">
        <div className="contact-moment__intro">
          <p className="brand-index">05 / EMPIEZA CON UNA CONVERSACIÓN</p>
          <h2 id="contact-title">Ahora,<br /><em>la vuestra.</em></h2>
          <p>Contadnos qué estáis imaginando. Una fecha, un lugar, una idea que no os quitáis de la cabeza.</p>
          <p>Con esos primeros detalles podremos hablar de diseño, alcance y presupuesto.</p>
          <a className="text-link" href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}<ArrowUpRight aria-hidden="true" /></a>
          <span className="contact-moment__note">También podéis escribirnos directamente.</span>
        </div>
        <form className="contact-sheet" onSubmit={openEmail} onChange={() => { setDraft(""); setCopyStatus(""); }}>
          <div className="contact-sheet__topline"><span>UNA NOTA PARA NUPIA</span><span>VUESTRA BODA</span></div>
          <label htmlFor="contact-names"><span>Vuestros nombres <small>(necesario)</small></span><input id="contact-names" name="names" type="text" autoComplete="name" placeholder="Marta y Diego" maxLength={100} required /></label>
          <div className="contact-sheet__split">
            <label><span>Fecha aproximada <small>(opcional)</small></span><input name="date" type="date" /></label>
            <label><span>Vuestro correo <small>(necesario)</small></span><input name="email" type="email" autoComplete="email" placeholder="hola@ejemplo.com" maxLength={160} required /></label>
          </div>
          <label><span>¿Algún diseño en mente?</span><select name="design" value={selectedDesign} onChange={(event) => onDesignChange(event.target.value)}><option value="">Nos dejamos aconsejar</option>{designs.map(design => <option key={design.id} value={design.title}>{design.title}</option>)}<option value="Tenemos otra idea">Tenemos otra idea</option></select></label>
          <label><span>Una pista sobre vuestro día <small>(opcional)</small></span><textarea name="note" rows={3} maxLength={2000} placeholder="Dónde será, cómo la imagináis, qué os gustaría que sintieran vuestros invitados…" /></label>
          <div className="contact-sheet__action"><button className="dark-button" type="submit">Preparar nuestra consulta <ArrowUpRight aria-hidden="true" /></button><p>Se abrirá vuestro correo con el mensaje preparado. Revisadlo y enviadlo desde allí.</p></div>
          <p className="contact-sheet__privacy">Lo que escribáis aquí no se envía ni se guarda en esta web. Solo lo recibiremos cuando enviéis el correo.</p>
          {draft && <div className="contact-draft">
            <p role="status">Consulta preparada. Todavía no se ha enviado.</p>
            <p>Si no se abre vuestro correo, podéis copiar el mensaje:</p>
            <button className="text-link" type="button" onClick={copyDraft}>{copied ? <Check aria-hidden="true" /> : <Copy aria-hidden="true" />}{copied ? "Copiado" : "Copiar consulta"}</button>
            <details><summary>Ver el mensaje preparado</summary><textarea readOnly aria-label="Consulta preparada para copiar" value={draft} rows={8} onFocus={(event) => event.currentTarget.select()} /></details>
            <span role="status">{copyStatus}</span>
          </div>}
        </form>
      </div>
    </section>
  );
};
export default ContactMoment;
