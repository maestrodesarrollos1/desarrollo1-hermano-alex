import installedComponents from "@/generated/installed-components.json";
import { templateValues } from "@/config/template-values";

type ComponentSlot = "after-hero" | "before-rsvp" | "after-rsvp";

type InstalledComponent = {
  id: string;
  name: string;
  description: string;
  variant: "feature" | "split" | "quote" | "banner" | "cards";
  slot: ComponentSlot;
  height: number;
  enabled: boolean;
  code: {
    html: string;
    css: string;
    js: string;
  };
};

const catalog = installedComponents as InstalledComponent[];

const escapeClosingTag = (value: string, tag: "style" | "script") =>
  value.replace(new RegExp(`</${tag}`, "gi"), `<\\/${tag}`);

const componentDocument = (component: InstalledComponent) => {
  const theme = templateValues.theme;
  const css = escapeClosingTag(component.code.css, "style");
  const javascript = escapeClosingTag(component.code.js, "script");
  return `<!doctype html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <meta http-equiv="Content-Security-Policy" content="default-src 'none'; img-src https: data:; style-src 'unsafe-inline'; script-src 'unsafe-inline'; connect-src https:; font-src https: data:; media-src https:; frame-src https:">
  <style>
    :root {
      --template-primary-dark: ${theme.primaryDark};
      --template-primary: ${theme.primary};
      --template-soft: ${theme.soft};
      --template-text: ${theme.text};
      --template-surface: color-mix(in srgb, var(--template-soft) 86%, #eadabd);
      --template-border: color-mix(in srgb, var(--template-primary-dark) 19%, var(--template-soft));
    }
    html { color-scheme: light; }
    ${css}
  </style>
</head>
<body>
  ${component.code.html}
  <script>"use strict";${javascript}</script>
</body>
</html>`;
};

const InstalledComponents = ({ slot }: { slot: ComponentSlot }) => {
  const components = catalog.filter((component) => component.enabled && component.slot === slot);
  if (!components.length) return null;

  return (
    <>
      {components.map((component) => (
        <section
          id={`custom-component-${component.id}`}
          key={component.id}
          data-editor-component={`custom:${component.id}`}
          className="scroll-animate w-full bg-white"
          aria-label={component.name}
        >
          <iframe
            title={component.name}
            srcDoc={componentDocument(component)}
            sandbox="allow-scripts"
            referrerPolicy="no-referrer"
            loading="lazy"
            className="block w-full border-0"
            style={{ height: `${component.height}px` }}
          />
        </section>
      ))}
    </>
  );
};

export default InstalledComponents;
