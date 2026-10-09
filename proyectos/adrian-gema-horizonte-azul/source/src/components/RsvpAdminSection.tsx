import { useCallback, useEffect, useMemo, useState } from "react";
import { Check, Download, RotateCcw, Trash2 } from "lucide-react";
import {
  deleteRsvp,
  dietaryLabels,
  downloadRsvpCsv,
  fetchRsvpAdmin,
  isRsvpPreview,
  RSVP_UPDATED_EVENT,
  updateRsvpStatus,
  type RsvpEntry,
  type RsvpReviewStatus,
  type RsvpSummary,
} from "@/lib/rsvp";

type Props = { csrfToken: string };
type Filter = "pending" | "accepted" | "all";

const emptySummary: RsvpSummary = { yes: 0, no: 0, guests: 0, pending: 0, accepted: 0 };

export default function RsvpAdminSection({ csrfToken }: Props) {
  const [entries, setEntries] = useState<RsvpEntry[]>([]);
  const [summary, setSummary] = useState<RsvpSummary>(emptySummary);
  const [filter, setFilter] = useState<Filter>("pending");
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

  const visible = useMemo(() => entries.filter((entry) => {
    const matchesStatus = filter === "all" || entry.reviewStatus === filter;
    const needle = query.toLocaleLowerCase("es");
    const matchesQuery = [entry.name, entry.phone, entry.email ?? "", entry.comment, ...entry.companions.map((person) => person.name)]
      .some((value) => value.toLocaleLowerCase("es").includes(needle));
    return matchesStatus && matchesQuery;
  }), [entries, filter, query]);

  const changeStatus = async (id: string, reviewStatus: RsvpReviewStatus) => {
    if (busyId) return;
    setBusyId(id);
    try {
      await updateRsvpStatus(id, reviewStatus, csrfToken);
      await refresh();
    } catch {
      setError("No se pudo actualizar la respuesta. Vuelve a intentarlo.");
    } finally {
      setBusyId(null);
    }
  };

  const remove = async (entry: RsvpEntry) => {
    if (busyId || !window.confirm(`¿Descartar definitivamente la respuesta de ${entry.name}?`)) return;
    setBusyId(entry.id);
    try {
      await deleteRsvp(entry.id, csrfToken);
      await refresh();
    } catch {
      setError("No se pudo descartar la respuesta. Vuelve a intentarlo.");
    } finally {
      setBusyId(null);
    }
  };

  return <section className="az-rsvp-admin" aria-labelledby="rsvp-admin-title">
    <div className="az-rsvp-admin-head">
      <div><p className="az-rsvp-admin-kicker">Lista privada</p><h2 id="rsvp-admin-title">Confirmaciones</h2><p>{isRsvpPreview ? "Revisa aquí la prueba exactamente como llegará al panel privado." : "Las respuestas se guardan en el servidor y solo aparecen aquí tras iniciar sesión."}</p></div>
      <button type="button" className="az-rsvp-admin-export" disabled={loading || entries.length === 0} onClick={() => { void downloadRsvpCsv().catch(() => setError("No se pudo descargar el CSV.")); }}><Download size={17} aria-hidden="true"/> Descargar CSV</button>
    </div>
    {isRsvpPreview && <p className="az-rsvp-admin-preview">Modo prueba · Los datos permanecen únicamente en este navegador.</p>}
    <div className="az-rsvp-admin-totals" aria-label="Resumen de asistencia">
      <div><strong>{summary.pending}</strong><span>Pendientes</span></div>
      <div><strong>{summary.accepted}</strong><span>Aceptadas</span></div>
      <div><strong>{summary.yes}</strong><span>Asistirán</span></div>
      <div><strong>{summary.no}</strong><span>No asistirán</span></div>
      <div><strong>{summary.guests}</strong><span>Personas</span></div>
    </div>
    <div className="az-rsvp-admin-tools">
      <div className="az-rsvp-admin-filters" aria-label="Filtrar confirmaciones">
        {(["pending", "accepted", "all"] as const).map((value) => <button key={value} type="button" className={filter === value ? "is-active" : ""} onClick={() => setFilter(value)}>{value === "pending" ? "Pendientes" : value === "accepted" ? "Aceptadas" : "Todas"}</button>)}
      </div>
      <label className="az-rsvp-admin-search" htmlFor="rsvp-admin-search">Buscar invitado<input id="rsvp-admin-search" type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Nombre, teléfono o comentario"/></label>
    </div>
    {error && <p className="az-rsvp-admin-error" role="alert">{error}</p>}
    {loading ? <p className="az-rsvp-admin-empty">Cargando respuestas…</p> : visible.length === 0 ? <p className="az-rsvp-admin-empty">{query ? "No hay respuestas que coincidan con la búsqueda." : filter === "pending" ? "No quedan respuestas pendientes." : "No hay respuestas en esta sección."}</p> : <div className="az-rsvp-admin-list">
      {visible.map((entry) => <article className={`az-rsvp-admin-entry is-${entry.reviewStatus}`} key={entry.id}>
        <div className="az-rsvp-admin-entry-main">
          <div className="az-rsvp-admin-badges"><span className={`az-rsvp-admin-status ${entry.attendance === "yes" ? "is-yes" : "is-no"}`}>{entry.attendance === "yes" ? "Asistirá" : "No asistirá"}</span><span className={`az-rsvp-admin-review is-${entry.reviewStatus}`}>{entry.reviewStatus === "accepted" ? "Aceptada" : "Pendiente"}</span></div>
          <h3>{entry.name}</h3>
          <p>{entry.phone || entry.email || "Sin teléfono (respuesta anterior)"}</p>
          {entry.attendance === "yes" && <ul className="az-rsvp-admin-people">
            {[{ name: entry.name, dietary: entry.dietary }, ...entry.companions].map((person, index) => <li key={`${entry.id}-${index}`}><strong>{index === 0 ? "Titular" : "Acompañante"} · {person.name}</strong><span>{dietaryLabels(person.dietary).join(" · ") || "Sin necesidades de menú indicadas"}</span></li>)}
          </ul>}
          {entry.comment && <blockquote className="az-rsvp-admin-comment"><span>Comentario</span>{entry.comment}</blockquote>}
        </div>
        <div className="az-rsvp-admin-entry-side">
          <time dateTime={entry.submittedAt}>{new Date(entry.submittedAt).toLocaleDateString("es-ES", { day: "numeric", month: "short", year: "numeric" })}</time>
          <div className="az-rsvp-admin-entry-actions">
            {entry.reviewStatus === "pending" ? <button type="button" className="is-primary" disabled={Boolean(busyId)} onClick={() => { void changeStatus(entry.id, "accepted"); }}><Check size={16} aria-hidden="true"/> Aceptar</button> : <button type="button" disabled={Boolean(busyId)} onClick={() => { void changeStatus(entry.id, "pending"); }}><RotateCcw size={16} aria-hidden="true"/> Deshacer</button>}
            <button type="button" className="is-danger" disabled={Boolean(busyId)} onClick={() => { void remove(entry); }}><Trash2 size={16} aria-hidden="true"/> Descartar</button>
          </div>
        </div>
      </article>)}
    </div>}
  </section>;
}
