import { useCallback, useEffect, useState } from "react";
import { Download, Trophy } from "lucide-react";
import {
  downloadGameCsv,
  fetchGameAdminRanking,
  isGamePreview,
  type GameAdminEntry,
} from "@/lib/wedding-game";

const formatDate = (value: string) => {
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? value
    : date.toLocaleString("es-ES", { dateStyle: "medium", timeStyle: "short" });
};

export default function GameAdminSection() {
  const [ranking, setRanking] = useState<GameAdminEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const refresh = useCallback(async () => {
    try {
      setLoading(true);
      setRanking(await fetchGameAdminRanking());
      setError("");
    } catch {
      setError("No se pudo cargar el ranking del reto.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { void refresh(); }, [refresh]);

  return <section className="az-game-admin" aria-labelledby="game-admin-title">
    <div className="az-game-admin-head">
      <div>
        <p className="az-rsvp-admin-kicker">Premios para invitados</p>
        <h2 id="game-admin-title">Reto de 20 segundos</h2>
        <p>El juego se cierra el 13 de marzo de 2027 a las 23:59. Aquí se ven todos los participantes y su mejor marca.</p>
      </div>
      <div className="az-game-admin-actions">
        <button type="button" className="az-rsvp-admin-export" disabled={loading || ranking.length === 0} onClick={() => { void downloadGameCsv().catch(() => setError("No se pudo descargar el CSV del reto.")); }}>
          <Download size={17} aria-hidden="true"/> Descargar CSV
        </button>
        <button type="button" className="az-game-admin-refresh" disabled={loading} onClick={() => { void refresh(); }}>
          Actualizar
        </button>
      </div>
    </div>
    {isGamePreview && <p className="az-rsvp-admin-preview">Modo prueba · El ranking mostrado procede de este navegador.</p>}
    {error ? <p className="az-rsvp-admin-error" role="alert">{error}</p> : null}
    {loading ? <p className="az-rsvp-admin-empty">Cargando ranking…</p> : ranking.length === 0 ? <p className="az-rsvp-admin-empty">Todavía no hay participantes. En cuanto alguien complete el reto aparecerá aquí.</p> : <div className="az-game-admin-table-wrap">
      <table className="az-game-admin-table">
        <thead><tr><th>Pos.</th><th>Participante</th><th>Teléfono</th><th>Puntos</th><th>Intentos</th><th>Última partida</th></tr></thead>
        <tbody>{ranking.map((entry, index) => <tr key={`${entry.phone}-${index}`}>
          <td><span className="az-game-admin-rank">{index + 1}</span></td>
          <td>{entry.name}</td>
          <td>{entry.phone ? <a href={`tel:${entry.phone}`}>{entry.phone}</a> : entry.legacyEmail || "Registro anterior sin teléfono"}</td>
          <td><strong>{entry.score}</strong></td>
          <td>{entry.attempts}</td>
          <td>{formatDate(entry.lastPlayedAt)}</td>
        </tr>)}</tbody>
      </table>
    </div>}
    <p className="az-game-admin-note"><Trophy size={16} aria-hidden="true"/> Se agrupan los intentos por teléfono: cada persona aparece una sola vez con su mejor puntuación.</p>
  </section>;
}
