export type GameAdminEntry = {
  name: string;
  phone: string;
  legacyEmail?: string;
  score: number;
  attempts: number;
  lastPlayedAt: string;
};

export type GameScoreSubmission = {
  name: string;
  phone: string;
  score: number;
  privacyConsent: boolean;
};

const LOCAL_STORAGE_KEY = "wedding-speed-game-ranking-v3";
const PUBLIC_GAME_ENDPOINT = "/api/game-public.php";
const ADMIN_GAME_ENDPOINT = "/api/game-admin.php";

const canUseStorage = () =>
  typeof window !== "undefined" && typeof window.localStorage !== "undefined";

const canUseLocalhostFallback = () =>
  typeof window !== "undefined" &&
  (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1");

const normalizePhone = (phone: string) => phone.trim().replace(/[\s().-]/g, "");

const normalizeAdminEntry = (value: unknown): GameAdminEntry | null => {
  if (!value || typeof value !== "object") return null;
  const candidate = value as Record<string, unknown>;

  if (
    typeof candidate.name !== "string" ||
    typeof candidate.phone !== "string" ||
    typeof candidate.score !== "number" ||
    typeof candidate.attempts !== "number" ||
    typeof candidate.lastPlayedAt !== "string"
  ) {
    return null;
  }

  return {
    name: candidate.name,
    phone: candidate.phone,
    legacyEmail: typeof candidate.legacyEmail === "string" ? candidate.legacyEmail : undefined,
    score: candidate.score,
    attempts: candidate.attempts,
    lastPlayedAt: candidate.lastPlayedAt,
  };
};

const normalizeAdminRanking = (value: unknown): GameAdminEntry[] => {
  if (!Array.isArray(value)) return [];
  return value
    .map((item) => normalizeAdminEntry(item))
    .filter((item): item is GameAdminEntry => item !== null)
    .sort((a, b) => b.score - a.score || a.attempts - b.attempts);
};

const parseJsonResponse = async <T,>(response: Response) => {
  const rawText = await response.text();
  return rawText ? (JSON.parse(rawText) as T) : ({} as T);
};

const fetchJson = async <T,>(input: RequestInfo | URL, init?: RequestInit) => {
  const response = await fetch(input, {
    credentials: "same-origin",
    cache: "no-store",
    ...init,
    headers: {
      Accept: "application/json",
      ...(init?.headers ?? {}),
    },
  });

  const data = await parseJsonResponse<T>(response);
  return { response, data };
};

const isRemoteUnavailable = (error: unknown) =>
  error instanceof TypeError || error instanceof SyntaxError;

const readLocalStore = () => {
  if (!canUseStorage()) return [];

  try {
    const stored = window.localStorage.getItem(LOCAL_STORAGE_KEY);
    const parsed = stored ? JSON.parse(stored) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const writeLocalStore = (entries: unknown[]) => {
  if (!canUseStorage()) return;
  window.localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(entries));
};

const buildLocalAdminRanking = (): GameAdminEntry[] => {
  const bestByPhone = new Map<string, GameAdminEntry>();

  readLocalStore().forEach((entry) => {
    if (!entry || typeof entry !== "object") return;
    const candidate = entry as Record<string, unknown>;
    if (
      typeof candidate.name !== "string" ||
      typeof candidate.phone !== "string" ||
      typeof candidate.score !== "number" ||
      typeof candidate.createdAt !== "string"
    ) {
      return;
    }

    const phone = normalizePhone(candidate.phone);
    const current = bestByPhone.get(phone);
    const attempts = readLocalStore().filter((item) => {
      if (!item || typeof item !== "object") return false;
      const attempt = item as Record<string, unknown>;
      return typeof attempt.phone === "string" && normalizePhone(attempt.phone) === phone;
    }).length;

    if (!current || candidate.score > current.score) {
      bestByPhone.set(phone, {
        name: candidate.name,
        phone,
        score: candidate.score,
        attempts,
        lastPlayedAt: candidate.createdAt,
      });
    } else {
      bestByPhone.set(phone, {
        ...current,
        attempts,
      });
    }
  });

  return normalizeAdminRanking([...bestByPhone.values()]);
};

export const submitGameScore = async (submission: GameScoreSubmission) => {
  const payload = {
    name: submission.name.trim(),
    phone: normalizePhone(submission.phone),
    score: submission.score,
    privacyConsent: submission.privacyConsent,
  };

  try {
    const { response, data } = await fetchJson<{ attemptNumber?: unknown }>(
      PUBLIC_GAME_ENDPOINT,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      },
    );

    if (!response.ok) {
      throw new Error(`Submit game score failed with ${response.status}`);
    }

    return {
      attemptNumber: typeof data.attemptNumber === "number" ? data.attemptNumber : 1,
    };
  } catch (error) {
    if (!isRemoteUnavailable(error) || !canUseLocalhostFallback()) {
      throw error;
    }

    const currentStore = readLocalStore();
    const createdAt = new Date().toISOString();
    const nextStore = [
      ...currentStore,
      {
        ...payload,
        createdAt,
      },
    ];

    writeLocalStore(nextStore);

    return {
      attemptNumber: nextStore.filter((entry) => {
        if (!entry || typeof entry !== "object") return false;
        const candidate = entry as Record<string, unknown>;
        return typeof candidate.phone === "string" && normalizePhone(candidate.phone) === payload.phone;
      }).length,
    };
  }
};

export const isGamePreview = canUseLocalhostFallback();

const saveCsv = (blob: Blob, filename: string) => {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.append(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
};

const csvCell = (value: string | number) => {
  const text = String(value);
  return `"${(/^[\s]*[=+\-@]/u.test(text) ? "'" : "") + text.replace(/"/g, '""')}"`;
};

export const fetchGameAdminRanking = async (): Promise<GameAdminEntry[]> => {
  if (isGamePreview) return buildLocalAdminRanking();

  const { response, data } = await fetchJson<{ ranking?: unknown }>(ADMIN_GAME_ENDPOINT);
  if (!response.ok) throw new Error(`Game administration request failed with ${response.status}`);
  return normalizeAdminRanking(data.ranking);
};

export const downloadGameCsv = async () => {
  if (!isGamePreview) {
    const response = await fetch(`${ADMIN_GAME_ENDPOINT}?format=csv`, {
      credentials: "same-origin",
      cache: "no-store",
    });
    if (!response.ok) throw new Error("No se pudo descargar el CSV del reto.");
    saveCsv(await response.blob(), "ranking-reto-boda.csv");
    return;
  }

  const rows = [
    ["Posición", "Nombre", "Teléfono", "Puntos", "Intentos", "Última participación"],
    ...buildLocalAdminRanking().map((entry, index) => [
      index + 1,
      entry.name,
      entry.phone,
      entry.score,
      entry.attempts,
      new Date(entry.lastPlayedAt).toLocaleString("es-ES"),
    ]),
  ];
  saveCsv(new Blob(["\uFEFF", rows.map((row) => row.map(csvCell).join(";")).join("\r\n")], {
    type: "text/csv;charset=utf-8",
  }), "ranking-reto-boda.csv");
};
