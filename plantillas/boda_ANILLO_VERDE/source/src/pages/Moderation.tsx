import { useCallback, useEffect, useState } from "react";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import {
  approvePendingMessage,
  deleteApprovedMessage,
  deletePendingMessage,
  fetchModerationSnapshot,
  loginModeration,
  logoutModeration,
  subscribeToLoveMessageUpdates,
  type MessageItem,
} from "@/lib/love-messages";

const Moderation = () => {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [pendingMessages, setPendingMessages] = useState<MessageItem[]>([]);
  const [approvedMessages, setApprovedMessages] = useState<MessageItem[]>([]);
  const [csrfToken, setCsrfToken] = useState("");
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeMessageId, setActiveMessageId] = useState<string | null>(null);

  const syncSnapshot = useCallback(async () => {
    const snapshot = await fetchModerationSnapshot();

    setIsUnlocked(snapshot.authenticated);
    setCsrfToken(snapshot.csrfToken ?? "");
    setPendingMessages(snapshot.pendingMessages);
    setApprovedMessages(snapshot.approvedMessages);
  }, []);

  useEffect(() => {
    let isActive = true;

    const loadSnapshot = async () => {
      try {
        const snapshot = await fetchModerationSnapshot();
        if (!isActive) return;

        setIsUnlocked(snapshot.authenticated);
        setCsrfToken(snapshot.csrfToken ?? "");
        setPendingMessages(snapshot.pendingMessages);
        setApprovedMessages(snapshot.approvedMessages);
        setError("");
      } catch {
        if (!isActive) return;

        setIsUnlocked(false);
        setCsrfToken("");
        setPendingMessages([]);
        setApprovedMessages([]);
        setError("No se pudo conectar con la moderación segura.");
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    };

    void loadSnapshot();

    const unsubscribe = subscribeToLoveMessageUpdates(() => {
      void loadSnapshot();
    });

    return () => {
      isActive = false;
      unsubscribe();
    };
  }, []);

  const handleUnlock = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSubmitting) return;

    const runUnlock = async () => {
      setIsSubmitting(true);

      try {
        const result = await loginModeration(password.trim());
        if (!result.ok) {
          setError(result.error);
          return;
        }

        await syncSnapshot();
        setError("");
        setPassword("");
      } catch {
        setError("No se pudo iniciar sesión. Inténtalo otra vez.");
      } finally {
        setIsSubmitting(false);
      }
    };

    void runUnlock();
  };

  const handleLock = async () => {
    if (isSubmitting) return;

    setIsSubmitting(true);

    try {
      await logoutModeration();
      setIsUnlocked(false);
      setCsrfToken("");
      setPendingMessages([]);
      setApprovedMessages([]);
      setPassword("");
      setError("");
    } catch {
      setError("No se pudo cerrar la sesión segura.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const runMessageAction = (messageId: string, action: "approve" | "delete-pending" | "delete-approved") => {
    if (!csrfToken || isSubmitting) return;

    const task = async () => {
      setIsSubmitting(true);
      setActiveMessageId(messageId);

      try {
        if (action === "approve") {
          await approvePendingMessage(messageId, csrfToken);
        } else if (action === "delete-pending") {
          await deletePendingMessage(messageId, csrfToken);
        } else {
          await deleteApprovedMessage(messageId, csrfToken);
        }

        await syncSnapshot();
        setError("");
      } catch {
        setError("No se pudo completar la acción. Vuelve a intentarlo.");
        await syncSnapshot();
      } finally {
        setIsSubmitting(false);
        setActiveMessageId(null);
      }
    };

    void task();
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#F8FCF8] pt-[var(--nav-height)]">
        <section className="px-5 py-16 md:py-24">
          <div className="mx-auto max-w-6xl">
            {isLoading ? (
              <div className="mx-auto max-w-xl border border-[#DDECE0] bg-white p-6 text-center text-sm text-[#1F5E46] shadow-[0_16px_40px_rgba(15,61,46,0.06)] md:p-8">
                Cargando moderación segura...
              </div>
            ) : !isUnlocked ? (
              <div className="mx-auto max-w-xl border border-[#DDECE0] bg-white p-6 shadow-[0_16px_40px_rgba(15,61,46,0.06)] md:p-8">
                <p className="text-xs uppercase tracking-[0.36em] text-[#7FAF8E]">Moderación</p>
                <h1 className="mt-4 font-script text-5xl text-[#0F3D2E] md:text-6xl">
                  Acceso privado
                </h1>
                <p className="mt-6 text-base leading-8 text-[#1F5E46]">
                  Introduce la contraseña para revisar mensajes pendientes y borrar mensajes ya
                  publicados.
                </p>
                <form onSubmit={handleUnlock} className="mt-8 space-y-4">
                  <input
                    type="password"
                    value={password}
                    onChange={(event) => {
                      setPassword(event.target.value);
                      setError("");
                    }}
                    placeholder="Contraseña"
                    className="w-full border border-[#EAF6EC] bg-white px-4 py-3 text-[#0F3D2E] outline-none transition focus:border-[#C9E6D0]"
                  />
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full border border-[#0F3D2E] bg-[#0F3D2E] px-5 py-4 text-sm uppercase tracking-[0.28em] text-white transition hover:bg-white hover:text-[#0F3D2E] disabled:opacity-50"
                  >
                    {isSubmitting ? "Entrando..." : "Entrar"}
                  </button>
                </form>
                {error ? <p className="mt-4 text-sm text-[#A14848]">{error}</p> : null}
              </div>
            ) : (
              <div className="space-y-10">
                <div className="flex flex-col gap-4 border border-[#DDECE0] bg-white p-6 shadow-[0_16px_40px_rgba(15,61,46,0.06)] md:flex-row md:items-end md:justify-between md:p-8">
                  <div>
                    <p className="text-xs uppercase tracking-[0.36em] text-[#7FAF8E]">Moderación</p>
                    <h1 className="mt-4 font-script text-5xl text-[#0F3D2E] md:text-6xl">
                      Mensajes bonitos
                    </h1>
                    <p className="mt-4 text-base leading-8 text-[#1F5E46]">
                      Desde aquí puedes aprobar mensajes pendientes y borrar los ya publicados.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleLock}
                    disabled={isSubmitting}
                    className="inline-flex h-12 items-center justify-center border border-[#DDECE0] bg-[#F8FCF8] px-5 text-sm uppercase tracking-[0.22em] text-[#1F5E46] transition hover:border-[#0F3D2E] hover:text-[#0F3D2E] disabled:opacity-50"
                  >
                    Cerrar sesión
                  </button>
                </div>

                {error ? (
                  <div className="border border-[#F1D1D1] bg-[#FFF7F7] px-5 py-4 text-sm text-[#A14848]">
                    {error}
                  </div>
                ) : null}

                <div className="grid gap-8 lg:grid-cols-2">
                  <section className="border border-[#DDECE0] bg-white p-6 shadow-[0_16px_40px_rgba(15,61,46,0.06)] md:p-8">
                    <p className="text-xs uppercase tracking-[0.36em] text-[#7FAF8E]">
                      Pendientes
                    </p>
                    <p className="mt-2 font-script text-4xl text-[#0F3D2E]">
                      {pendingMessages.length}
                    </p>
                    <div className="mt-6 space-y-4">
                      {pendingMessages.length === 0 ? (
                        <p className="text-sm text-[#2E7D59]">No hay mensajes pendientes.</p>
                      ) : (
                        pendingMessages.map((item) => (
                          <article
                            key={item.id}
                            className="border border-[#EAF6EC] bg-[#F8FCF8] p-5"
                          >
                            <p className="text-sm uppercase tracking-[0.22em] text-[#7FAF8E]">
                              {item.name}
                            </p>
                            <p className="mt-3 leading-7 whitespace-pre-wrap text-[#1F5E46]">
                              {item.message}
                            </p>
                            <div className="mt-5 flex flex-wrap gap-3">
                              <button
                                type="button"
                                onClick={() => runMessageAction(item.id, "approve")}
                                disabled={isSubmitting}
                                className="border border-[#0F3D2E] bg-[#0F3D2E] px-4 py-2 text-sm uppercase tracking-[0.18em] text-white transition hover:bg-[#1F5E46] disabled:opacity-50"
                              >
                                {activeMessageId === item.id ? "Guardando..." : "Aprobar"}
                              </button>
                              <button
                                type="button"
                                onClick={() => runMessageAction(item.id, "delete-pending")}
                                disabled={isSubmitting}
                                className="border border-[#DDECE0] bg-white px-4 py-2 text-sm uppercase tracking-[0.18em] text-[#1F5E46] transition hover:border-[#A14848] hover:text-[#A14848] disabled:opacity-50"
                              >
                                Borrar
                              </button>
                            </div>
                          </article>
                        ))
                      )}
                    </div>
                  </section>

                  <section className="border border-[#DDECE0] bg-white p-6 shadow-[0_16px_40px_rgba(15,61,46,0.06)] md:p-8">
                    <p className="text-xs uppercase tracking-[0.36em] text-[#7FAF8E]">
                      Publicados
                    </p>
                    <p className="mt-2 font-script text-4xl text-[#0F3D2E]">
                      {approvedMessages.length}
                    </p>
                    <div className="mt-6 space-y-4">
                      {approvedMessages.map((item) => (
                        <article key={item.id} className="border border-[#EAF6EC] bg-[#F8FCF8] p-5">
                          <p className="text-sm uppercase tracking-[0.22em] text-[#7FAF8E]">
                            {item.name}
                          </p>
                          <p className="mt-3 leading-7 whitespace-pre-wrap text-[#1F5E46]">
                            {item.message}
                          </p>
                          <div className="mt-5">
                            <button
                              type="button"
                              onClick={() => runMessageAction(item.id, "delete-approved")}
                              disabled={isSubmitting}
                              className="border border-[#DDECE0] bg-white px-4 py-2 text-sm uppercase tracking-[0.18em] text-[#1F5E46] transition hover:border-[#A14848] hover:text-[#A14848] disabled:opacity-50"
                            >
                              {activeMessageId === item.id ? "Borrando..." : "Borrar"}
                            </button>
                          </div>
                        </article>
                      ))}
                    </div>
                  </section>
                </div>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default Moderation;
