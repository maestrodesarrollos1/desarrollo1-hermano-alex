import { weddingData } from "@/data/weddingData";

export type MessageItem = {
  id: string;
  name: string;
  message: string;
};

export type ModerationSnapshot = {
  authenticated: boolean;
  csrfToken: string | null;
  pendingMessages: MessageItem[];
  approvedMessages: MessageItem[];
};

export const APPROVED_KEY = "adrian-gema-2027-approved-messages";
export const PENDING_KEY = "adrian-gema-2027-pending-messages";
export const LOVE_MESSAGES_UPDATED_EVENT = "love-messages-updated";

const LOCAL_MODERATION_SESSION_KEY = "wedding-template-local-moderation-auth";
const LOCAL_MODERATION_CSRF_TOKEN = "local-dev-csrf";

const PUBLIC_MESSAGES_ENDPOINT = "/api/messages-public.php";
const ADMIN_MESSAGES_ENDPOINT = "/api/messages-admin.php";
const MODERATION_AUTH_ENDPOINT = "/api/moderation-auth.php";

const canUseStorage = () =>
  typeof window !== "undefined" && typeof window.localStorage !== "undefined";

const canUseSessionStorage = () =>
  typeof window !== "undefined" && typeof window.sessionStorage !== "undefined";

const canUseLocalhostFallback = () =>
  typeof window !== "undefined" &&
  (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1");

const parseMessages = (value: string | null, fallback: MessageItem[]) => {
  if (!value) return fallback;

  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? normalizeMessages(parsed, fallback) : fallback;
  } catch {
    return fallback;
  }
};

const normalizeMessage = (value: unknown): MessageItem | null => {
  if (!value || typeof value !== "object") return null;

  const candidate = value as Record<string, unknown>;
  if (
    typeof candidate.id !== "string" ||
    typeof candidate.name !== "string" ||
    typeof candidate.message !== "string"
  ) {
    return null;
  }

  return {
    id: candidate.id,
    name: candidate.name,
    message: candidate.message,
  };
};

const normalizeMessages = (value: unknown, fallback: MessageItem[] = []) => {
  if (!Array.isArray(value)) return fallback;

  const nextMessages = value
    .map((item) => normalizeMessage(item))
    .filter((item): item is MessageItem => item !== null);

  return nextMessages.length > 0 || value.length === 0 ? nextMessages : fallback;
};

const emitMessagesUpdated = () => {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event(LOVE_MESSAGES_UPDATED_EVENT));
};

const readLocalModerationAuthenticated = () => {
  if (!canUseSessionStorage()) return false;
  return window.sessionStorage.getItem(LOCAL_MODERATION_SESSION_KEY) === "1";
};

const writeLocalModerationAuthenticated = (value: boolean) => {
  if (!canUseSessionStorage()) return;

  if (value) {
    window.sessionStorage.setItem(LOCAL_MODERATION_SESSION_KEY, "1");
    return;
  }

  window.sessionStorage.removeItem(LOCAL_MODERATION_SESSION_KEY);
};

const buildLocalModerationSnapshot = (): ModerationSnapshot => {
  const authenticated = readLocalModerationAuthenticated();

  return {
    authenticated,
    csrfToken: authenticated ? LOCAL_MODERATION_CSRF_TOKEN : null,
    pendingMessages: readPendingMessages(),
    approvedMessages: readApprovedMessages(),
  };
};

const runLocalModerationAction = (action: string, messageId: string) => {
  const pendingMessages = readPendingMessages();
  const approvedMessages = readApprovedMessages();

  if (action === "approve") {
    const targetMessage = pendingMessages.find((item) => item.id === messageId);
    if (!targetMessage) {
      throw new Error("No se encontro el mensaje pendiente.");
    }

    writePendingMessages(pendingMessages.filter((item) => item.id !== messageId));
    writeApprovedMessages([
      targetMessage,
      ...approvedMessages.filter((item) => item.id !== messageId),
    ]);
    return;
  }

  if (action === "delete-pending") {
    writePendingMessages(pendingMessages.filter((item) => item.id !== messageId));
    return;
  }

  if (action === "delete-approved") {
    writeApprovedMessages(approvedMessages.filter((item) => item.id !== messageId));
    return;
  }

  throw new Error(`Unsupported local moderation action: ${action}`);
};

const parseJsonResponse = async <T,>(response: Response) => {
  const rawText = await response.text();

  if (!rawText) {
    return {} as T;
  }

  return JSON.parse(rawText) as T;
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

export const initializeApprovedMessages = () => {
  if (!canUseStorage()) return;

  if (!window.localStorage.getItem(APPROVED_KEY)) {
    window.localStorage.setItem(APPROVED_KEY, JSON.stringify(weddingData.approvedMessages));
  }
};

export const readApprovedMessages = () => {
  if (!canUseStorage()) {
    return [...weddingData.approvedMessages];
  }

  initializeApprovedMessages();
  return parseMessages(window.localStorage.getItem(APPROVED_KEY), [...weddingData.approvedMessages]);
};

export const readPendingMessages = () => {
  if (!canUseStorage()) return [];
  return parseMessages(window.localStorage.getItem(PENDING_KEY), []);
};

export const writeApprovedMessages = (messages: MessageItem[]) => {
  if (!canUseStorage()) return;
  window.localStorage.setItem(APPROVED_KEY, JSON.stringify(messages));
  emitMessagesUpdated();
};

export const writePendingMessages = (messages: MessageItem[]) => {
  if (!canUseStorage()) return;
  window.localStorage.setItem(PENDING_KEY, JSON.stringify(messages));
  emitMessagesUpdated();
};

export const fetchApprovedMessages = async () => {
  try {
    const { response, data } = await fetchJson<{ approvedMessages?: unknown }>(PUBLIC_MESSAGES_ENDPOINT);
    if (!response.ok) {
      throw new Error(`Public messages request failed with ${response.status}`);
    }

    return normalizeMessages(data.approvedMessages, readApprovedMessages());
  } catch (error) {
    if (!isRemoteUnavailable(error)) {
      throw error;
    }

    return readApprovedMessages();
  }
};

export const submitPendingMessage = async (message: Omit<MessageItem, "id">) => {
  const payload = {
    name: message.name.trim(),
    message: message.message.trim(),
  };

  if (canUseLocalhostFallback()) {
    writePendingMessages([{ id: crypto.randomUUID(), ...payload }, ...readPendingMessages()]);
    return;
  }

  try {
    const { response } = await fetchJson(PUBLIC_MESSAGES_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`Submit message request failed with ${response.status}`);
    }

    emitMessagesUpdated();
    return;
  } catch (error) {
    if (!isRemoteUnavailable(error) || !canUseLocalhostFallback()) {
      throw error;
    }

    const nextMessage: MessageItem = {
      id: crypto.randomUUID(),
      ...payload,
    };

    writePendingMessages([nextMessage, ...readPendingMessages()]);
  }
};

const normalizeModerationSnapshot = (value: unknown): ModerationSnapshot => {
  const candidate = value as Record<string, unknown> | null;

  return {
    authenticated: candidate?.authenticated === true,
    csrfToken: typeof candidate?.csrfToken === "string" ? candidate.csrfToken : null,
    pendingMessages: normalizeMessages(candidate?.pendingMessages, []),
    approvedMessages: normalizeMessages(candidate?.approvedMessages, []),
  };
};

export const fetchModerationSnapshot = async () => {
  try {
    const { response, data } = await fetchJson(ADMIN_MESSAGES_ENDPOINT);

    if (response.status === 401) {
      return {
        authenticated: false,
        csrfToken: null,
        pendingMessages: [],
        approvedMessages: [],
      } satisfies ModerationSnapshot;
    }

    if (!response.ok) {
      throw new Error(`Moderation snapshot request failed with ${response.status}`);
    }

    return normalizeModerationSnapshot(data);
  } catch (error) {
    if (!isRemoteUnavailable(error) || !canUseLocalhostFallback()) {
      throw error;
    }

    return buildLocalModerationSnapshot();
  }
};

export const loginModeration = async (password: string) => {
  try {
    const { response, data } = await fetchJson<{ error?: string }>(MODERATION_AUTH_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        action: "login",
        password,
      }),
    });

    if (response.status === 401) {
      return {
        ok: false,
        error: typeof data.error === "string" ? data.error : "Contrase\u00F1a incorrecta.",
      };
    }

    if (!response.ok) {
      throw new Error(`Moderation login request failed with ${response.status}`);
    }

    return { ok: true, error: "" };
  } catch (error) {
    if (!isRemoteUnavailable(error) || !canUseLocalhostFallback()) {
      throw error;
    }

    if (password.trim() === "") {
      return {
        ok: false,
        error: "Escribe cualquier contrase\u00F1a para desbloquear la moderacion local.",
      };
    }

    writeLocalModerationAuthenticated(true);
    return { ok: true, error: "" };
  }
};

export const logoutModeration = async () => {
  try {
    const { response } = await fetchJson(MODERATION_AUTH_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        action: "logout",
      }),
    });

    if (!response.ok) {
      throw new Error(`Moderation logout request failed with ${response.status}`);
    }
  } catch (error) {
    if (!isRemoteUnavailable(error) || !canUseLocalhostFallback()) {
      throw error;
    }

    writeLocalModerationAuthenticated(false);
  }
};

const postModerationAction = async (action: string, messageId: string, csrfToken: string) => {
  try {
    const { response } = await fetchJson(ADMIN_MESSAGES_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-CSRF-Token": csrfToken,
      },
      body: JSON.stringify({
        action,
        messageId,
        csrfToken,
      }),
    });

    if (response.status === 401) {
      throw new Error("No autorizado.");
    }

    if (!response.ok) {
      throw new Error(`Moderation action failed with ${response.status}`);
    }
  } catch (error) {
    if (!isRemoteUnavailable(error) || !canUseLocalhostFallback()) {
      throw error;
    }

    if (!readLocalModerationAuthenticated()) {
      throw new Error("No autorizado.");
    }

    runLocalModerationAction(action, messageId);
  }

  emitMessagesUpdated();
};

export const approvePendingMessage = async (messageId: string, csrfToken: string) =>
  postModerationAction("approve", messageId, csrfToken);

export const deletePendingMessage = async (messageId: string, csrfToken: string) =>
  postModerationAction("delete-pending", messageId, csrfToken);

export const deleteApprovedMessage = async (messageId: string, csrfToken: string) =>
  postModerationAction("delete-approved", messageId, csrfToken);

export const subscribeToLoveMessageUpdates = (callback: () => void) => {
  if (typeof window === "undefined") {
    return () => undefined;
  }

  const handleStorage = (event: StorageEvent) => {
    if (event.key === null || event.key === APPROVED_KEY || event.key === PENDING_KEY) {
      callback();
    }
  };

  window.addEventListener(LOVE_MESSAGES_UPDATED_EVENT, callback);
  window.addEventListener("storage", handleStorage);

  return () => {
    window.removeEventListener(LOVE_MESSAGES_UPDATED_EVENT, callback);
    window.removeEventListener("storage", handleStorage);
  };
};
