import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import { fileURLToPath } from "node:url";

const demoValues = fileURLToPath(new URL("./src/demo/demo-values.ts", import.meta.url));
const templates = fileURLToPath(new URL("../../../plantillas/", import.meta.url));

export default defineConfig({
  server: {
    host: "::",
    port: 8084,
  },
  resolve: {
    dedupe: ["react", "react-dom"],
    alias: {
      "@/data/weddingData": demoValues,
      "@/config/template-values": demoValues,
    },
  },
  plugins: [
    {
      name: "nupia-opening-assets",
      enforce: "pre",
      transform(code, id) {
        // Reuse the original openings with the corporate site's optimized assets.
        if (!id.replaceAll("\\", "/").startsWith(templates.replaceAll("\\", "/")) || !id.endsWith("/EnvelopeIntro.tsx")) return;
        return code
          .replaceAll("/images/intro/jewel-case-editorial.png", "/images/jewel-case-editorial-1600.webp")
          .replaceAll("/images/doors/rose-double-doors.png", "/images/rose-double-doors-1600.webp");
      },
    },
    react(),
  ],
  build: {
    rollupOptions: {
      input: {
        main: fileURLToPath(new URL("./index.html", import.meta.url)),
        opening: fileURLToPath(new URL("./opening.html", import.meta.url)),
      },
    },
  },
});
