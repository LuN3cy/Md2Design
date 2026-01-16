import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import fs from "fs";
import path from "path";

// Custom plugin to generate fonts.json (from upstream)
import { type ViteDevServer } from 'vite';
function generateFontsJson() {
  return {
    name: "generate-fonts-json",
    buildStart() {
      const fontsDir = path.resolve(__dirname, "public/fonts");
      if (fs.existsSync(fontsDir)) {
        const files = fs.readdirSync(fontsDir);
        const fontFiles = files.filter((file) =>
          /\.(ttf|otf|woff2?)$/i.test(file)
        );
        const fonts = fontFiles.map((file) => ({
          name: path.parse(file).name,
          filename: file,
        }));
        fs.writeFileSync(
          path.resolve(__dirname, "public/fonts.json"),
          JSON.stringify(fonts, null, 2)
        );
      }
    },
    handleHotUpdate({ file, server }: { file: string; server: ViteDevServer }) {
      if (file.includes("public/fonts")) {
        const fontsDir = path.resolve(__dirname, "public/fonts");
        const files = fs.readdirSync(fontsDir);
        const fontFiles = files.filter((f) =>
          /\.(ttf|otf|woff2?)$/i.test(f)
        );
        const fonts = fontFiles.map((f) => ({
          name: path.parse(f).name,
          filename: f,
        }));
        fs.writeFileSync(
          path.resolve(__dirname, "public/fonts.json"),
          JSON.stringify(fonts, null, 2)
        );
        server.ws.send({
          type: "full-reload",
          path: "*",
        });
      }
    },
  };
}

// https://vite.dev/config/
export default defineConfig({
  // Use relative base path to support both root and subpath deployments
  base:
    process.env.TAURI_PLATFORM || process.env.DOCKER_BUILD
      ? "./"
      : "/Md2Design/",
  plugins: [react(), tailwindcss(), generateFontsJson()],
  server: {
    host: true,
  },
  build: {
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules")) {
            if (id.includes("react-dom") || id.includes("react/")) {
              return "vendor-react";
            }
            if (id.includes("framer-motion")) {
              return "vendor-framer";
            }
            if (
              id.includes("react-markdown") ||
              id.includes("remark") ||
              id.includes("unified")
            ) {
              return "vendor-markdown";
            }
            if (
              id.includes("html-to-image") ||
              id.includes("jszip") ||
              id.includes("turndown")
            ) {
              return "vendor-utils";
            }
            if (
              id.includes("lucide-react") ||
              id.includes("react-colorful") ||
              id.includes("react-rnd")
            ) {
              return "vendor-ui";
            }
            return "vendor";
          }
        },
      },
    },
  },
});
