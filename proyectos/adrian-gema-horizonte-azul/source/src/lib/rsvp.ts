export type RsvpAttendance = "yes" | "no";
export type RsvpDietary = {
  allergies: boolean;
  allergyDetails: string;
  intolerances: boolean;
  intoleranceDetails: string;
  vegan: boolean;
  pregnant: boolean;
};
export type RsvpGuest = { name: string; dietary: RsvpDietary };
export type RsvpInput = {
  name: string;
  phone: string;
  attendance: RsvpAttendance;
  dietary: RsvpDietary;
  companions: RsvpGuest[];
  dietaryConsent: boolean;
  website?: string;
};
export type RsvpEntry = RsvpInput & { id: string; submittedAt: string; email?: string };
export type RsvpSummary = { yes: number; no: number; guests: number };

const PUBLIC_ENDPOINT = "/api/rsvp-public.php";
const ADMIN_ENDPOINT = "/api/rsvp-admin.php";
const LOCAL_KEY = "adrian-gema-rsvp-preview";
export const RSVP_UPDATED_EVENT = "adrian-gema-rsvp-updated";

export const emptyDietary = (): RsvpDietary => ({
  allergies: false, allergyDetails: "", intolerances: false, intoleranceDetails: "", vegan: false, pregnant: false,
});

export const dietaryHasDetails = (dietary: RsvpDietary) =>
  dietary.allergies || dietary.intolerances || dietary.vegan || dietary.pregnant;

export const dietaryLabels = (dietary: RsvpDietary): string[] => [
  ...(dietary.allergies ? [`Alergias: ${dietary.allergyDetails || "sin concretar"}`] : []),
  ...(dietary.intolerances ? [`Intolerancias: ${dietary.intoleranceDetails || "sin concretar"}`] : []),
  ...(dietary.vegan ? ["Vegano/a"] : []),
  ...(dietary.pregnant ? ["Embarazada"] : []),
];

const normalizeDietary = (value: unknown): RsvpDietary => {
  const source = value && typeof value === "object" ? value as Partial<RsvpDietary> : {};
  return {
    allergies: source.allergies === true,
    allergyDetails: typeof source.allergyDetails === "string" ? source.allergyDetails : "",
    intolerances: source.intolerances === true,
    intoleranceDetails: typeof source.intoleranceDetails === "string" ? source.intoleranceDetails : "",
    vegan: source.vegan === true,
    pregnant: source.pregnant === true,
  };
};

const normalizeEntry = (value: unknown): RsvpEntry | null => {
  if (!value || typeof value !== "object") return null;
  const source = value as Partial<RsvpEntry>;
  if (typeof source.id !== "string" || typeof source.name !== "string" ||
    (source.attendance !== "yes" && source.attendance !== "no")) return null;
  return {
    id: source.id, name: source.name, phone: typeof source.phone === "string" ? source.phone : "",
    email: typeof source.email === "string" ? source.email : undefined,
    attendance: source.attendance, dietary: normalizeDietary(source.dietary),
    dietaryConsent: source.dietaryConsent === true,
    companions: Array.isArray(source.companions) ? source.companions.flatMap((person) => {
      if (typeof person === "string") return [{ name: person, dietary: emptyDietary() }];
      if (person && typeof person === "object" && typeof person.name === "string") {
        return [{ name: person.name, dietary: normalizeDietary(person.dietary) }];
      }
      return [];
    }) : [],
    submittedAt: typeof source.submittedAt === "string" ? source.submittedAt : "",
  };
};

export const isRsvpPreview = import.meta.env.DEV &&
  typeof window !== "undefined" &&
  ["localhost", "127.0.0.1"].includes(window.location.hostname);

const readLocal = (): RsvpEntry[] => {
  try {
    const value: unknown = JSON.parse(localStorage.getItem(LOCAL_KEY) ?? "[]");
    return Array.isArray(value) ? value.flatMap((entry) => normalizeEntry(entry) ?? []) : [];
  } catch {
    return [];
  }
};

const writeLocal = (entries: RsvpEntry[]) => {
  localStorage.setItem(LOCAL_KEY, JSON.stringify(entries));
  window.dispatchEvent(new Event(RSVP_UPDATED_EVENT));
};

const requestJson = async <T,>(url: string, options?: RequestInit): Promise<T> => {
  const response = await fetch(url, {
    credentials: "same-origin", cache: "no-store", ...options,
    headers: { Accept: "application/json", ...options?.headers },
  });
  const data = await response.json().catch(() => { throw new Error("El servidor de confirmaciones no está disponible. Inténtalo más tarde."); }) as T & { error?: string };
  if (!response.ok) throw new Error(data.error ?? "No se pudo completar la solicitud.");
  return data;
};

const summaryOf = (entries: RsvpEntry[]): RsvpSummary => ({
  yes: entries.filter((entry) => entry.attendance === "yes").length,
  no: entries.filter((entry) => entry.attendance === "no").length,
  guests: entries.reduce((total, entry) => total + (entry.attendance === "yes" ? 1 + entry.companions.length : 0), 0),
});

const cleanDietary = (dietary: RsvpDietary): RsvpDietary => ({
  allergies: dietary.allergies,
  allergyDetails: dietary.allergies ? dietary.allergyDetails.trim() : "",
  intolerances: dietary.intolerances,
  intoleranceDetails: dietary.intolerances ? dietary.intoleranceDetails.trim() : "",
  vegan: dietary.vegan,
  pregnant: dietary.pregnant,
});

export const submitRsvp = async (input: RsvpInput) => {
  const payload: RsvpInput = {
    name: input.name.trim(), phone: input.phone.trim(), attendance: input.attendance,
    dietary: input.attendance === "yes" ? cleanDietary(input.dietary) : emptyDietary(),
    companions: input.attendance === "yes" ? input.companions.map((person) => ({ name: person.name.trim(), dietary: cleanDietary(person.dietary) })) : [],
    dietaryConsent: input.dietaryConsent,
    website: input.website ?? "",
  };
  const digits = payload.phone.replace(/\D/g, "");
  if (!/^\+?[0-9\s().-]{9,24}$/.test(payload.phone) || digits.length < 9 || digits.length > 15) {
    throw new Error("Escribe un teléfono de contacto válido.");
  }
  if (payload.attendance === "yes") {
    for (const person of [{ name: payload.name, dietary: payload.dietary }, ...payload.companions]) {
      if (person.dietary.allergies && !person.dietary.allergyDetails) throw new Error(`Concreta las alergias de ${person.name}.`);
      if (person.dietary.intolerances && !person.dietary.intoleranceDetails) throw new Error(`Concreta las intolerancias de ${person.name}.`);
    }
  }
  if (payload.attendance === "yes" && [payload.dietary, ...payload.companions.map((person) => person.dietary)].some(dietaryHasDetails) && !payload.dietaryConsent) {
    throw new Error("Confirma que puedes compartir los datos de menú indicados.");
  }
  if (isRsvpPreview) {
    writeLocal([{ ...payload, id: crypto.randomUUID(), submittedAt: new Date().toISOString() }, ...readLocal()]);
    return;
  }
  await requestJson(PUBLIC_ENDPOINT, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
};

export const fetchRsvpAdmin = async (): Promise<{ entries: RsvpEntry[]; summary: RsvpSummary }> => {
  if (isRsvpPreview) {
    const entries = readLocal();
    return { entries, summary: summaryOf(entries) };
  }
  const result = await requestJson<{ entries: unknown[]; summary: RsvpSummary }>(ADMIN_ENDPOINT);
  return { entries: result.entries.flatMap((entry) => normalizeEntry(entry) ?? []), summary: result.summary };
};

export const deleteRsvp = async (id: string, csrfToken: string) => {
  if (isRsvpPreview) {
    writeLocal(readLocal().filter((entry) => entry.id !== id));
    return;
  }
  await requestJson(ADMIN_ENDPOINT, {
    method: "POST", headers: { "Content-Type": "application/json", "X-CSRF-Token": csrfToken },
    body: JSON.stringify({ action: "delete", id, csrfToken }),
  });
};

const saveCsv = (blob: Blob) => {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "confirmaciones-boda.csv";
  document.body.append(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
};

export const downloadRsvpCsv = async () => {
  if (!isRsvpPreview) {
    const response = await fetch(`${ADMIN_ENDPOINT}?format=csv`, { credentials: "same-origin", cache: "no-store" });
    if (!response.ok) throw new Error("No se pudo descargar el CSV.");
    saveCsv(await response.blob());
    return;
  }
  const cell = (value: string) => `"${(/^[\s]*[=+\-@]/u.test(value) ? "'" : "") + value.replace(/"/g, '""')}"`;
  const rows = [
    ["Fecha", "Contacto", "Teléfono", "Asistencia", "Persona", "Tipo", "Alergias", "Intolerancias", "Vegano/a", "Embarazada"],
    ...readLocal().flatMap((entry) => {
      const people = [{ name: entry.name, dietary: entry.dietary, role: "Titular" },
        ...(entry.attendance === "yes" ? entry.companions.map((person) => ({ ...person, role: "Acompañante" })) : [])];
      return people.map((person) => [entry.submittedAt, entry.name, entry.phone || entry.email || "", entry.attendance === "yes" ? "Sí" : "No", person.name, person.role,
        person.dietary.allergies ? person.dietary.allergyDetails : "", person.dietary.intolerances ? person.dietary.intoleranceDetails : "",
        person.dietary.vegan ? "Sí" : "No", person.dietary.pregnant ? "Sí" : "No"]);
    }),
  ];
  saveCsv(new Blob(["\uFEFF", rows.map((row) => row.map(cell).join(";")).join("\r\n")], { type: "text/csv;charset=utf-8" }));
};
