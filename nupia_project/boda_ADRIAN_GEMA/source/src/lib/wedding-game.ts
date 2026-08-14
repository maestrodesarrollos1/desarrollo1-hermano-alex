export type GameRankingEntry = {
  name: string;
  score: number;
  attempts: number;
  lastPlayedAt: string;
};

export type GameScoreSubmission = {
  name: string;
  email: string;
  score: number;
};

const LOCAL_STORAGE_KEY = "wedding-speed-game-ranking-v2";
const PUBLIC_GAME_ENDPOINT = "/api/game-public.php";

const canUseStorage = () =>
  typeof window !== "undefined" && typeof window.localStorage !== "undefined";

const canUseLocalhostFallback = () =>
  typeof window !== "undefined" &&
  (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1");

const normalizeEmail = (email: string) => email.trim().toLowerCase();

const normalizeRankingEntry = (value: unknown): GameRankingEntry | null => {
  if (!value || typeof value !== "object") return null;
  const candidate = value as Record<string, unknown>;

  if (
    typeof candidate.name !== "string" ||
    typeof candidate.score !== "number" ||
    typeof candidate.attempts !== "number" ||
    typeof candidate.lastPlayedAt !== "string"
  ) {
    return null;
  }

  return {
    name: candidate.name,
    score: candidate.score,
    attempts: candidate.attempts,
    lastPlayedAt: candidate.lastPlayedAt,
  };
};

const normalizeRanking = (value: unknown): GameRankingEntry[] => {
  if (!Array.isArray(value)) return [];

  return value
    .map((item) => normalizeRankingEntry(item))
    .filter((item): item is GameRankingEntry => item !== null)
    .sort((a, b) => b.score - a.score || a.attempts - b.attempts)
    .slice(0, 10);
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

const buildLocalRanking = () => {
  const bestByEmail = new Map<string, GameRankingEntry>();

  readLocalStore().forEach((entry) => {
    if (!entry || typeof entry !== "object") return;
    const candidate = entry as Record<string, unknown>;
    if (
      typeof candidate.name !== "string" ||
      typeof candidate.email !== "string" ||
      typeof candidate.score !== "number" ||
      typeof candidate.createdAt !== "string"
    ) {
      return;
    }

    const email = normalizeEmail(candidate.email);
    const current = bestByEmail.get(email);
    const attempts = readLocalStore().filter((item) => {
      if (!item || typeof item !== "object") return false;
      const attempt = item as Record<string, unknown>;
      return typeof attempt.email === "string" && normalizeEmail(attempt.email) === email;
    }).length;

    if (!current || candidate.score > current.score) {
      bestByEmail.set(email, {
        name: candidate.name,
        score: candidate.score,
        attempts,
        lastPlayedAt: candidate.createdAt,
      });
    } else {
      bestByEmail.set(email, {
        ...current,
        attempts,
      });
    }
  });

  return normalizeRanking([...bestByEmail.values()]);
};

export const fetchGameRanking = async () => {
  try {
    const { response, data } = await fetchJson<{ ranking?: unknown }>(PUBLIC_GAME_ENDPOINT);
    if (!response.ok) {
      throw new Error(`Game ranking request failed with ${response.status}`);
    }

    return normalizeRanking(data.ranking);
  } catch (error) {
    if (!isRemoteUnavailable(error) || !canUseLocalhostFallback()) {
      throw error;
    }

    return buildLocalRanking();
  }
};

export const submitGameScore = async (submission: GameScoreSubmission) => {
  const payload = {
    name: submission.name.trim(),
    email: normalizeEmail(submission.email),
    score: submission.score,
  };

  try {
    const { response, data } = await fetchJson<{ ranking?: unknown; attemptNumber?: unknown }>(
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
      ranking: normalizeRanking(data.ranking),
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
      ranking: buildLocalRanking(),
      attemptNumber: nextStore.filter((entry) => {
        if (!entry || typeof entry !== "object") return false;
        const candidate = entry as Record<string, unknown>;
        return typeof candidate.email === "string" && normalizeEmail(candidate.email) === payload.email;
      }).length,
    };
  }
};
