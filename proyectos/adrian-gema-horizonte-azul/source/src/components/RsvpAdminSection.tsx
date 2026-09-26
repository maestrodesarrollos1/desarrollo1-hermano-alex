import { useCallback, useEffect, useMemo, useState } from "react";
import { Download, Trash2 } from "lucide-react";
import { deleteRsvp, dietaryLabels, downloadRsvpCsv, fetchRsvpAdmin, isRsvpPreview, RSVP_UPDATED_EVENT, type RsvpEntry, type RsvpSummary } from "@/lib/rsvp";

type Props = { csrfToken: string };

export default function RsvpAdminSection({ csrfToken }: Props) {
  const [entries, setEntries] = useState<RsvpEntry[]>([]);
  const [summary, setSummary] = useState<RsvpSummary>({ yes: 0, no: 0, guests: 0 });
  const [query, setQuery] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    try {
      const result = await fetchRsvpAdmin();
      setEntries(result.entries);
      setSummary(result.summary);
      setError("");
    } catch {
      setError("No se pudo cargar el registro de asistencia.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
    window.addEventListener(RSVP_UPDATED_EVENT, refresh);
    return () => window.removeEventListener(RSVP_UPDATED_EVENT, refresh);
  }, [refresh]);

  const visible = useMemo(() => entries.filter((entry) =>
    [entry.name, entry.phone, entry.email ?? "", ...entry.companions.map((person) => person.name)].some((value) => value.toLocaleLowerCase("es").includes(query.toLocaleLowerCase("es")))
  ), [entries, query]);

  const remove = async (id: string) => {
    if (busyId) return;
    setBusyId(id);
    try {
      await deleteRsvp(id, csrfToken);
      await refresh();
    } catch {
      setError("No se pudo borrar la respuesta. Vuelve a intentarlo.");
    } finally {
      setBusyId(null);
    }
  };

  return <section className="az-rsvp-admin" aria-labelledby="rsvp-admin-title">
    <div className="az-rsvp-admin-head">
      <div><p className="az-rsvp-admin-kicker">Lista privada</p><h2 id="rsvp-admin-title">Confirmaciones</h2><p>{isRsvpPreview ? "Aquí puedes revisar respuestas de prueba guardadas en este navegador." : "Las respuestas se guardan en el servidor y solo aparecen aquí tras iniciar sesión."}</p></div>
      <button type="button" className="az-rsvp-admin-export" disabled={loading || entries.length === 0} onClick={() => { void downloadRsvpCsv().catch(() => setError("No se pudo descargar el CSV.")); }}><Download size={17} aria-hidden="true"/> Descargar CSV</button>
    </div>
    {isRsvpPreview && <p className="az-rsvp-admin-preview">Vista previa local: estos datos solo existen en este navegador.</p>}
    <div className="az-rsvp-admin-totals" aria-label="Resumen de asistencia">
      <div><strong>{summary.yes}</strong><span>Respuestas sí</span></div>
      <div><strong>{summary.no}</strong><span>Respuestas no</span></div>
      <div><strong>{summary.guests}</strong><span>Personas que vendrán</span></div>
    </div>
    <label className="az-rsvp-admin-search" htmlFor="rsvp-admin-search">Buscar invitado<input id="rsvp-admin-search" type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Nombre o teléfono"/></label>
    {error && <p className="az-rsvp-admin-error" role="alert">{error}</p>}
    {loading ? <p className="az-rsvp-admin-empty">Cargando respuestas…</p> : visible.length === 0 ? <p className="az-rsvp-admin-empty">{query ? "No hay respuestas con ese nombre o teléfono." : "Todavía no hay respuestas."}</p> : <div className="az-rsvp-admin-list">
      {visible.map((entry) => <article className="az-rsvp-admin-entry" key={entry.id}>
        <div className="az-rsvp-admin-entry-main">
          <span className={`az-rsvp-admin-status ${entry.attendance === "yes" ? "is-yes" : "is-no"}`}>{entry.attendance === "yes" ? "Asistirá" : "No asistirá"}</span>
          <h3>{entry.name}</h3>
          <p>{entry.phone || entry.email || "Sin teléfono (respuesta anterior)"}</p>
          {entry.attendance === "yes" && <ul className="az-rsvp-admin-people">
            {[{ name: entry.name, dietary: entry.dietary }, ...entry.companions].map((person, index) => <li key={`${entry.id}-${index}`}><strong>{index === 0 ? "Titular" : "Acompañante"} · {person.name}</strong><span>{dietaryLabels(person.dietary).join(" · ") || "Sin necesidades de menú indicadas"}</span></li>)}
          </ul>}
        </div>
        <div className="az-rsvp-admin-entry-actions">
          <time dateTime={entry.submittedAt}>{new Date(entry.submittedAt).toLocaleDateString("es-ES", { day: "numeric", month: "short", year: "numeric" })}</time>
          <button type="button" aria-label={`Borrar respuesta de ${entry.name}`} title="Borrar respuesta" disabled={Boolean(busyId)} onClick={() => { void remove(entry.id); }}><Trash2 size={17} aria-hidden="true"/></button>
        </div>
      </article>)}
    </div>}
  </section>;
}
