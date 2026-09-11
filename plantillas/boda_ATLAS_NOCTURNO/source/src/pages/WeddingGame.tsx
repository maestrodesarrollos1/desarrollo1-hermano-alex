import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Play, RotateCcw, Trophy } from "lucide-react";
import { weddingData } from "@/data/weddingData";
import { templateValues } from "@/config/template-values";
import { fetchGameRanking, submitGameScore } from "@/lib/wedding-game";
import type { GameRankingEntry } from "@/lib/wedding-game";

type GameStatus = "idle" | "playing" | "finished";
const GAME_SECONDS = 20;
const TILE_COUNT = 9;

const getGameDeadline = () => {
  const eventDate = new Date(templateValues.event.dateIso);
  if (Number.isNaN(eventDate.getTime())) return null;
  eventDate.setDate(eventDate.getDate() - 1);
  eventDate.setHours(23, 59, 59, 999);
  return eventDate;
};

const WeddingGame = () => {
  const [status, setStatus] = useState<GameStatus>("idle");
  const [secondsLeft, setSecondsLeft] = useState(GAME_SECONDS);
  const [score, setScore] = useState(0);
  const [activeTile, setActiveTile] = useState(4);
  const [playerName, setPlayerName] = useState("");
  const [playerEmail, setPlayerEmail] = useState("");
  const [ranking, setRanking] = useState<GameRankingEntry[]>([]);
  const [saved, setSaved] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [attemptNumber, setAttemptNumber] = useState<number | null>(null);
  const lastTile = useRef(activeTile);
  const gameDeadline = useMemo(() => getGameDeadline(), []);
  const gameClosed = gameDeadline ? Date.now() > gameDeadline.getTime() : false;

  useEffect(() => {
    void fetchGameRanking().then(setRanking).catch(() => setRanking([]));
  }, []);

  useEffect(() => {
    if (status !== "playing") return;

    const interval = window.setInterval(() => {
      setSecondsLeft((current) => {
        if (current <= 1) {
          window.clearInterval(interval);
          setStatus("finished");
          return 0;
        }
        return current - 1;
      });
    }, 1000);

    return () => window.clearInterval(interval);
  }, [status]);

  const accuracyLabel = useMemo(() => {
    if (score >= 30) return "Leyenda de la pista";
    if (score >= 22) return "Invitado de oro";
    if (score >= 14) return "Muy buen ritmo";
    if (score > 0) return "Calentando motores";
    return "Preparado para jugar";
  }, [score]);

  const pickNextTile = () => {
    let nextTile = Math.floor(Math.random() * TILE_COUNT);
    if (nextTile === lastTile.current) {
      nextTile = (nextTile + 1) % TILE_COUNT;
    }
    lastTile.current = nextTile;
    setActiveTile(nextTile);
  };

  const startGame = () => {
    if (gameClosed) return;

    setStatus("playing");
    setSecondsLeft(GAME_SECONDS);
    setScore(0);
    setSaved(false);
    setSaveError("");
    setAttemptNumber(null);
    pickNextTile();
  };

  const handleTileClick = (index: number) => {
    if (status !== "playing") return;

    if (index === activeTile) {
      setScore((current) => current + 1);
      pickNextTile();
      return;
    }

    setScore((current) => Math.max(0, current - 1));
  };

  const saveScore = async () => {
    const name = playerName.trim();
    const email = playerEmail.trim();
    if (!name || !email || saved || status !== "finished" || gameClosed) return;

    try {
      setSaveError("");
      const result = await submitGameScore({ name, email, score });
      setRanking(result.ranking);
      setAttemptNumber(result.attemptNumber);
      setSaved(true);
    } catch {
      setSaveError("No se pudo guardar la puntuacion. Prueba otra vez.");
    }
  };

  return (
    <main className="min-h-screen bg-[#0D1F18] px-5 py-8 text-white md:py-10">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4">
        <Link
          to="/es"
          className="font-nav inline-flex items-center gap-2 border border-white/18 bg-white/8 px-4 py-3 text-xs uppercase tracking-[0.22em] text-white/82 transition hover:bg-white hover:text-[#0F3D2E]"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Volver
        </Link>
        <p className="hidden font-nav text-xs uppercase tracking-[0.28em] text-white/50 sm:block">
          {weddingData.couple.display}
        </p>
      </div>

      <section className="mx-auto grid max-w-6xl gap-8 pb-12 pt-10 lg:grid-cols-[1fr_0.74fr] lg:items-start">
        <div className="relative overflow-hidden border border-white/18 bg-white/[0.06] p-5 shadow-[0_30px_90px_rgba(0,0,0,0.22)] backdrop-blur-md md:p-8">
          <div className="absolute -right-20 -top-20 h-56 w-56 rounded-full border border-white/10" aria-hidden="true" />
          <div className="absolute -bottom-24 left-10 h-64 w-64 rounded-full border border-white/10" aria-hidden="true" />

          <div className="relative">
            <p className="font-nav text-xs uppercase tracking-[0.34em] text-white/58">Reto para invitados</p>
            <h1 className="mt-4 font-script text-5xl leading-none md:text-7xl">Participa y gana</h1>
            <p className="mt-5 max-w-2xl text-base leading-8 text-white/74 md:text-lg">
              Toca la luz que se enciende tantas veces como puedas antes de que termine el tiempo.
            </p>
            {gameDeadline ? (
              <p className="mt-3 font-nav text-xs uppercase tracking-[0.22em] text-white/48">
                Abierto hasta el {gameDeadline.toLocaleDateString("es-ES")}
              </p>
            ) : null}
            {gameClosed ? (
              <p className="mt-5 border border-white/16 bg-white/8 p-4 text-sm leading-7 text-white/76">
                El juego ya esta cerrado. El ranking queda listo para revisar ganadores.
              </p>
            ) : null}

            <div className="mt-8 grid grid-cols-3 gap-3 sm:gap-4">
              {Array.from({ length: TILE_COUNT }, (_, index) => {
                const active = status === "playing" && activeTile === index;
                return (
                  <button
                    key={index}
                    type="button"
                    onClick={() => handleTileClick(index)}
                    disabled={status !== "playing" || gameClosed}
                    aria-label={active ? "Luz activa" : "Luz apagada"}
                    className={`aspect-square border transition duration-150 ${
                      active
                        ? "scale-[1.02] border-[#DDEBDD] bg-[#4F8B6D] shadow-[0_0_34px_rgba(221,235,221,0.38)]"
                        : "border-white/14 bg-white/[0.055] hover:bg-white/[0.09]"
                    }`}
                  >
                    <span
                      className={`mx-auto block h-9 w-9 rounded-full transition md:h-12 md:w-12 ${
                        active ? "bg-white shadow-[0_0_26px_rgba(255,255,255,0.82)]" : "bg-white/14"
                      }`}
                    />
                  </button>
                );
              })}
            </div>

            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              <div className="border border-white/14 bg-white/[0.06] p-4">
                <p className="font-nav text-[10px] uppercase tracking-[0.26em] text-white/50">Tiempo</p>
                <p className="mt-2 font-script text-4xl">{secondsLeft}s</p>
              </div>
              <div className="border border-white/14 bg-white/[0.06] p-4">
                <p className="font-nav text-[10px] uppercase tracking-[0.26em] text-white/50">Puntos</p>
                <p className="mt-2 font-script text-4xl">{score}</p>
              </div>
              <div className="border border-white/14 bg-white/[0.06] p-4">
                <p className="font-nav text-[10px] uppercase tracking-[0.26em] text-white/50">Estado</p>
                <p className="mt-3 text-sm leading-6 text-white/78">{accuracyLabel}</p>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              {status === "playing" || gameClosed ? null : (
                <button
                  type="button"
                  onClick={startGame}
                  className="font-nav inline-flex h-12 items-center gap-2 border border-white/70 bg-white px-5 text-xs uppercase tracking-[0.24em] text-[#0F3D2E] transition hover:bg-transparent hover:text-white"
                >
                  <Play className="h-4 w-4" aria-hidden="true" />
                  {status === "finished" ? "Repetir" : "Jugar"}
                </button>
              )}
              {status === "playing" && !gameClosed ? (
                <button
                  type="button"
                  onClick={startGame}
                  className="font-nav inline-flex h-12 items-center gap-2 border border-white/26 bg-transparent px-5 text-xs uppercase tracking-[0.24em] text-white/82 transition hover:bg-white hover:text-[#0F3D2E]"
                >
                  <RotateCcw className="h-4 w-4" aria-hidden="true" />
                  Reiniciar
                </button>
              ) : null}
            </div>

            {status === "finished" && !gameClosed ? (
              <div className="mt-7 overflow-hidden border border-white/14 bg-white/[0.08]">
                <div className="border-b border-white/12 px-5 py-4">
                  <p className="font-nav text-xs uppercase tracking-[0.26em] text-white/58">Guardar marca</p>
                  <p className="mt-3 text-sm leading-6 text-white/72">
                    Puedes participar varias veces. El ranking guarda tu mejor puntuacion y cuenta tus intentos.
                  </p>
                </div>

                <div className="grid gap-4 p-5">
                  <div className="grid gap-4 md:grid-cols-2">
                    <label className="block min-w-0">
                      <span className="mb-2 block font-nav text-[10px] uppercase tracking-[0.22em] text-white/48">
                        Nombre
                      </span>
                      <input
                        value={playerName}
                        onChange={(event) => setPlayerName(event.target.value)}
                        maxLength={28}
                        placeholder="Tu nombre"
                        className="min-h-12 w-full border border-white/16 bg-white px-4 text-[#0F3D2E] outline-none"
                      />
                    </label>

                    <label className="block min-w-0">
                      <span className="mb-2 block font-nav text-[10px] uppercase tracking-[0.22em] text-white/48">
                        Email
                      </span>
                      <input
                        value={playerEmail}
                        onChange={(event) => setPlayerEmail(event.target.value)}
                        maxLength={120}
                        type="email"
                        placeholder="tu@email.com"
                        className="min-h-12 w-full border border-white/16 bg-white px-4 text-[#0F3D2E] outline-none"
                      />
                    </label>
                  </div>

                  <button
                    type="button"
                    onClick={saveScore}
                    disabled={!playerName.trim() || !playerEmail.trim() || saved}
                    className="font-nav flex min-h-12 w-full items-center justify-center border border-[#DDEBDD] bg-[#DDEBDD] px-5 text-xs uppercase tracking-[0.22em] text-[#123C2D] transition hover:border-white hover:bg-white disabled:opacity-45"
                  >
                    {saved ? "Guardado" : "Guardar en ranking"}
                  </button>
                </div>
                {attemptNumber ? (
                  <p className="px-5 pb-5 text-sm text-white/70">
                    Intento registrado: #{attemptNumber}. Tu mejor marca entra en el ranking.
                  </p>
                ) : null}
                {saveError ? <p className="px-5 pb-5 text-sm text-[#DDEBDD]">{saveError}</p> : null}
              </div>
            ) : null}
          </div>
        </div>

        <aside className="border border-[#DDECE0] bg-white p-5 text-[#0F3D2E] shadow-[0_24px_64px_rgba(15,61,46,0.1)] md:p-7">
          <div className="flex items-center gap-3">
            <Trophy className="h-5 w-5 text-[#4F8B6D]" aria-hidden="true" />
            <p className="font-nav text-xs uppercase tracking-[0.3em] text-[#7FAF8E]">Ranking</p>
          </div>
          <h2 className="mt-4 font-script text-4xl">Mesa de honor</h2>

          <div className="mt-6 space-y-3">
            {ranking.length ? (
              ranking.map((entry, index) => (
                <div key={`${entry.name}-${entry.lastPlayedAt}`} className="grid grid-cols-[2rem_1fr_auto] items-center gap-3 border border-[#EAF6EC] bg-[#FBFEFB] px-4 py-3">
                  <span className="font-script text-2xl text-[#4F8B6D]">{index + 1}</span>
                  <span className="min-w-0">
                    <span className="block truncate text-sm text-[#1F5E46]">{entry.name}</span>
                    <span className="font-nav mt-1 block text-[10px] uppercase tracking-[0.2em] text-[#7FAF8E]">
                      {entry.attempts} intento{entry.attempts === 1 ? "" : "s"}
                    </span>
                  </span>
                  <span className="font-nav text-sm font-semibold tabular-nums text-[#0F3D2E]">{entry.score}</span>
                </div>
              ))
            ) : (
              <p className="border border-[#EAF6EC] bg-[#FBFEFB] p-4 text-sm leading-7 text-[#1F5E46]">
                Aun no hay participantes. La primera puntuacion marcara el liston.
              </p>
            )}
          </div>
        </aside>
      </section>
    </main>
  );
};

export default WeddingGame;
