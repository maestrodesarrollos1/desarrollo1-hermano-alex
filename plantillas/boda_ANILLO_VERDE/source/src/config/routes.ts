export const LANGUAGE_PREFIXES: Record<string, string> = {
  es: "es",
  va: "val",
  en: "eng",
  ru: "ru",
};

export const getLanguageFromPrefix = (prefix: string): string => {
  const entry = Object.entries(LANGUAGE_PREFIXES).find(([, value]) => value === prefix);
  return entry ? entry[0] : "es";
};
