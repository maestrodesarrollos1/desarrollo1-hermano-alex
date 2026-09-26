import { useState, type FormEvent } from "react";
import { ArrowRight, Plus, Trash2 } from "lucide-react";
import RsvpDietaryFields from "@/components/RsvpDietaryFields";
import { dietaryHasDetails, emptyDietary, isRsvpPreview, submitRsvp, type RsvpAttendance, type RsvpDietary, type RsvpGuest } from "@/lib/rsvp";

type FormCompanion = RsvpGuest & { id: string };

export default function RsvpForm() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [attendance, setAttendance] = useState<RsvpAttendance | "">("");
  const [dietary, setDietary] = useState<RsvpDietary>(emptyDietary);
  const [companions, setCompanions] = useState<FormCompanion[]>([]);
  const [dietaryConsent, setDietaryConsent] = useState(false);
  const [website, setWebsite] = useState("");
  const [sending, setSending] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (sending || !attendance) return;
    setSending(true);
    setError("");
    try {
      await submitRsvp({ name, phone, attendance, dietary, companions, dietaryConsent, website });
      setSaved(true);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "No se pudo enviar la respuesta. Inténtalo de nuevo.");
    } finally {
      setSending(false);
    }
  };

  return <div className="az-rsvp-paper">
    <div className="az-rsvp-paper-head"><span>Confirmación de asistencia</span><span>A &amp; G · 2027</span></div>
    {saved ? <div className="az-rsvp-success" role="status">
      <span className="az-rsvp-success-mark" aria-hidden="true">✓</span>
      <h2>{attendance === "yes" ? "Qué alegría contar contigo." : "Gracias por avisarnos."}</h2>
      <p>{isRsvpPreview ? "Prueba guardada solo en este navegador. No se ha enviado a los novios." : "Hemos guardado tu respuesta. Si necesitas cambiarla, escríbenos antes de la boda."}</p>
      <button type="button" className="az-text-button" onClick={() => { setName(""); setPhone(""); setAttendance(""); setDietary(emptyDietary()); setCompanions([]); setDietaryConsent(false); setSaved(false); }}>Enviar otra respuesta <ArrowRight size={16} aria-hidden="true"/></button>
    </div> : <form className="az-rsvp-form" onSubmit={(event) => { void handleSubmit(event); }}>
      <p className="az-rsvp-form-intro">Reservamos un lugar para vosotros. Decidnos si vendréis.</p>
      <fieldset className="az-rsvp-choice">
        <legend>¿Podrás acompañarnos?</legend>
        <div>
          <label className={attendance === "yes" ? "is-selected" : ""}><input type="radio" name="attendance" value="yes" required checked={attendance === "yes"} onChange={() => { setAttendance("yes"); setError(""); }}/> Sí, allí estaré</label>
          <label className={attendance === "no" ? "is-selected" : ""}><input type="radio" name="attendance" value="no" required checked={attendance === "no"} onChange={() => { setAttendance("no"); setDietary(emptyDietary()); setCompanions([]); setDietaryConsent(false); setError(""); }}/> No podré ir</label>
        </div>
      </fieldset>
      <div className="az-rsvp-fields">
        <label htmlFor="rsvp-name">Tu nombre y apellidos<input id="rsvp-name" type="text" autoComplete="name" required minLength={2} maxLength={100} value={name} onChange={(event) => setName(event.target.value)} placeholder="Nombre y apellidos"/></label>
        <label htmlFor="rsvp-phone">Teléfono de contacto<input id="rsvp-phone" type="tel" inputMode="tel" autoComplete="tel" required maxLength={24} value={phone} onChange={(event) => setPhone(event.target.value)} placeholder="Por ejemplo, 612 345 678"/></label>
      </div>
      {attendance === "yes" && <RsvpDietaryFields label="tú" id="rsvp-primary" value={dietary} onChange={setDietary}/>}
      {attendance === "yes" && <div className="az-rsvp-companions">
        <div className="az-rsvp-companions-title"><span>¿Vienes con alguien?</span><small>Añade a cada acompañante por su nombre.</small></div>
        {companions.map((companion, index) => <div className="az-rsvp-companion" key={companion.id}>
          <div className="az-rsvp-companion-row">
            <label htmlFor={`rsvp-companion-${companion.id}`}>Acompañante {index + 1}<input id={`rsvp-companion-${companion.id}`} required minLength={2} maxLength={100} value={companion.name} onChange={(event) => setCompanions((current) => current.map((value) => value.id === companion.id ? { ...value, name: event.target.value } : value))} placeholder="Nombre y apellidos"/></label>
            <button type="button" aria-label={`Quitar acompañante ${index + 1}`} title="Quitar acompañante" onClick={() => setCompanions((current) => current.filter((person) => person.id !== companion.id))}><Trash2 size={17} aria-hidden="true"/></button>
          </div>
          <RsvpDietaryFields label={`acompañante ${index + 1}`} id={`rsvp-${companion.id}`} value={companion.dietary} onChange={(next) => setCompanions((current) => current.map((person) => person.id === companion.id ? { ...person, dietary: next } : person))}/>
        </div>)}
        {companions.length < 5 && <button className="az-rsvp-add" type="button" onClick={() => setCompanions((current) => [...current, { id: crypto.randomUUID(), name: "", dietary: emptyDietary() }])}><Plus size={17} aria-hidden="true"/> Añadir acompañante</button>}
      </div>}
      <div className="az-rsvp-honeypot" aria-hidden="true"><label htmlFor="rsvp-website">Sitio web</label><input id="rsvp-website" tabIndex={-1} autoComplete="off" value={website} onChange={(event) => setWebsite(event.target.value)}/></div>
      {attendance === "yes" && [dietary, ...companions.map((person) => person.dietary)].some(dietaryHasDetails) && <label className="az-rsvp-consent"><input type="checkbox" required checked={dietaryConsent} onChange={(event) => setDietaryConsent(event.target.checked)}/><span>Confirmo que puedo compartir estas necesidades de menú, también las de mis acompañantes. Se usarán solo para organizar la comida de la boda.</span></label>}
      <p className="az-rsvp-privacy">El teléfono es solo para contactar sobre la boda. Las necesidades de menú son opcionales y el registro requiere acceso privado.</p>
      {isRsvpPreview && <p className="az-rsvp-preview">Vista previa: en localhost las respuestas solo se guardan en este navegador.</p>}
      {error && <p className="az-rsvp-error" role="alert">{error}</p>}
      <button className="az-button az-rsvp-submit" type="submit" disabled={sending || !attendance}>{sending ? "Enviando…" : "Enviar respuesta"}<ArrowRight size={17} aria-hidden="true"/></button>
    </form>}
  </div>;
}
