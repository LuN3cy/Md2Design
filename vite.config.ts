import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  // Use relative base path to support both root and subpath deployments
  base:
    process.env.TAURI_PLATFORM || process.env.DOCKER_BUILD
      ? "./"
      : "/Md2Design/",
  plugins: [react(), tailwindcss()],
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
