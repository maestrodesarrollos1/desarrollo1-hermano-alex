import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Play, RotateCcw } from "lucide-react";
import { weddingData } from "@/data/weddingData";
import { templateValues } from "@/config/template-values";
import { submitGameScore } from "@/lib/wedding-game";

type GameStatus = "idle" | "playing" | "finished";
const GAME_SECONDS = 20;
const TILE_COUNT = 9;

const getGameDeadline = () => {
  const eventDate = new Date(templateValues.event.dateIso);
  if (Number.isNaN(eventDate.getTime())) return null;
  eventDate.setDate(eventDate.getDate() - 14);
  eventDate.setHours(23, 59, 59, 999);
  return eventDate;
};

const WeddingGame = () => {
  const [status, setStatus] = useState<GameStatus>("idle");
  const [secondsLeft, setSecondsLeft] = useState(GAME_SECONDS);
  const [score, setScore] = useState(0);
  const [activeTile, setActiveTile] = useState(4);
  const [playerName, setPlayerName] = useState("");
  const [playerPhone, setPlayerPhone] = useState("");
  const [privacyConsent, setPrivacyConsent] = useState(false);
  const [saved, setSaved] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [attemptNumber, setAttemptNumber] = useState<number | null>(null);
  const lastTile = useRef(activeTile);
  const gameDeadline = useMemo(() => getGameDeadline(), []);
  const gameClosed = gameDeadline ? Date.now() > gameDeadline.getTime() : false;

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
    const phone = playerPhone.trim();
    if (!name || !phone || !privacyConsent || saved || status !== "finished" || gameClosed) return;

    try {
      setSaveError("");
      const result = await submitGameScore({ name, phone, score, privacyConsent });
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

      <section className="mx-auto max-w-3xl pb-12 pt-10">
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
                El juego ya está cerrado. El resultado se desvelará el día de la boda.
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
                        ? "scale-[1.02] border-[#F1DDD5] bg-[#A7605F] shadow-[0_0_34px_rgba(241,221,213,0.38)]"
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
                    Puedes participar varias veces. Para optar a los premios, guarda la marca con tu nombre y teléfono reales. El resultado seguirá siendo sorpresa hasta la boda.
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
                        required
                        autoComplete="name"
                        placeholder="Tu nombre y apellidos"
                        className="min-h-12 w-full border border-white/16 bg-white px-4 text-[#0F3D2E] outline-none"
                      />
                    </label>

                    <label className="block min-w-0">
                      <span className="mb-2 block font-nav text-[10px] uppercase tracking-[0.22em] text-white/48">
                        Teléfono
                      </span>
                      <input
                        value={playerPhone}
                        onChange={(event) => setPlayerPhone(event.target.value)}
                        maxLength={24}
                        type="tel"
                        inputMode="tel"
                        autoComplete="tel"
                        required
                        placeholder="Tu número de teléfono"
                        className="min-h-12 w-full border border-white/16 bg-white px-4 text-[#0F3D2E] outline-none"
                      />
                    </label>
                  </div>

                  <label className="flex items-start gap-3 text-sm leading-6 text-white/70">
                    <input
                      type="checkbox"
                      checked={privacyConsent}
                      onChange={(event) => setPrivacyConsent(event.target.checked)}
                      required
                      className="mt-1 h-4 w-4 accent-[#F1DDD5]"
                    />
                    <span>He leído la <Link to="/es/privacidad" className="underline decoration-white/45 underline-offset-4 hover:text-white">información de privacidad</Link> y acepto el uso de mis datos para gestionar el reto y los premios.</span>
                  </label>

                  <button
                    type="button"
                    onClick={saveScore}
                    disabled={!playerName.trim() || !playerPhone.trim() || !privacyConsent || saved}
                    className="font-nav flex min-h-12 w-full items-center justify-center border border-[#F1DDD5] bg-[#F1DDD5] px-5 text-xs uppercase tracking-[0.22em] text-[#4A1F2A] transition hover:border-white hover:bg-white disabled:opacity-45"
                  >
                    {saved ? "Guardado" : "Guardar mi marca"}
                  </button>
                </div>
                {attemptNumber ? (
                  <p className="px-5 pb-5 text-sm text-white/70">
                    Intento registrado: #{attemptNumber}. Tu marca queda guardada para la sorpresa del día.
                  </p>
                ) : null}
                {saveError ? <p className="px-5 pb-5 text-sm text-[#F1DDD5]">{saveError}</p> : null}
              </div>
            ) : null}
          </div>
        </div>

      </section>
    </main>
  );
};

export default WeddingGame;
