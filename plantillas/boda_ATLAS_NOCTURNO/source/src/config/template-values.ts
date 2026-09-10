import values from "@/generated/template-values.json";

export type TemplateValues = typeof values & {
  theme: typeof values.theme & { radius?: string };
  images: typeof values.images & Record<"landing" | "historia1" | "historia2" | "galeria1" | "galeria2" | "galeria3" | "galeria4" | "galeria5" | "galeria6" | "despedida", string>;
};

export const templateValues: TemplateValues = values as TemplateValues;

const hexToHslChannels = (hex: string) => {
  const normalized = hex.replace("#", "");
  if (!/^[0-9a-fA-F]{6}$/.test(normalized)) return "0 0% 0%";
  const red = Number.parseInt(normalized.slice(0, 2), 16) / 255;
  const green = Number.parseInt(normalized.slice(2, 4), 16) / 255;
  const blue = Number.parseInt(normalized.slice(4, 6), 16) / 255;
  const maximum = Math.max(red, green, blue);
  const minimum = Math.min(red, green, blue);
  const lightness = (maximum + minimum) / 2;
  const delta = maximum - minimum;
  let hue = 0;
  let saturation = 0;
  if (delta !== 0) {
    saturation = delta / (1 - Math.abs(2 * lightness - 1));
    if (maximum === red) hue = 60 * (((green - blue) / delta) % 6);
    else if (maximum === green) hue = 60 * ((blue - red) / delta + 2);
    else hue = 60 * ((red - green) / delta + 4);
  }
  if (hue < 0) hue += 360;
  return `${Math.round(hue)} ${Math.round(saturation * 100)}% ${Math.round(lightness * 100)}%`;
};

export const applyTemplateTheme = () => {
  const root = document.documentElement;
  root.style.setProperty("--template-primary-dark", templateValues.theme.primaryDark);
  root.style.setProperty("--template-primary", templateValues.theme.primary);
  root.style.setProperty("--template-soft", templateValues.theme.soft);
  root.style.setProperty("--template-text", templateValues.theme.text);
  const radius = Math.max(0, Math.min(32, Number(templateValues.theme.radius ?? 12) || 0));
  root.style.setProperty("--template-radius", `${radius}px`);
  root.style.setProperty("--template-radius-control", `clamp(0px, ${Math.max(2, Math.round(radius * 0.62))}px, 18px)`);
  root.style.setProperty("--template-radius-card", `clamp(0px, ${radius}px, 30px)`);
  root.style.setProperty("--template-radius-image", `clamp(0px, ${Math.max(1, Math.round(radius * 0.72))}px, 24px)`);
  root.style.setProperty("--foreground", hexToHslChannels(templateValues.theme.primaryDark));
  root.style.setProperty("--card-foreground", hexToHslChannels(templateValues.theme.primaryDark));
  root.style.setProperty("--popover-foreground", hexToHslChannels(templateValues.theme.primaryDark));
  root.style.setProperty("--primary", hexToHslChannels(templateValues.theme.primary));
  root.style.setProperty("--secondary", hexToHslChannels(templateValues.theme.soft));
  root.style.setProperty("--secondary-foreground", hexToHslChannels(templateValues.theme.primaryDark));
  root.style.setProperty("--muted", hexToHslChannels(templateValues.theme.soft));
  root.style.setProperty("--muted-foreground", hexToHslChannels(templateValues.theme.text));
  root.style.setProperty("--accent", hexToHslChannels(templateValues.theme.primary));
  root.style.setProperty("--ring", hexToHslChannels(templateValues.theme.primary));
  root.style.setProperty("--border", hexToHslChannels(templateValues.theme.soft));
  root.style.setProperty("--input", hexToHslChannels(templateValues.theme.soft));
  root.style.setProperty("--sage-300", templateValues.theme.soft);
  root.style.setProperty("--sage-500", templateValues.theme.primary);
  root.style.setProperty("--sage-600", templateValues.theme.text);
  root.style.setProperty("--sage-700", templateValues.theme.primaryDark);
};
