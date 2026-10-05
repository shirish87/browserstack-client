import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "node:path";

const API = "http://localhost:3000";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: { alias: { "@": path.resolve(import.meta.dirname, "src") } },
  // Static assets are served by the Express server from ./public.
  build: { outDir: "public", emptyOutDir: true },
  // Keep the browser's Host header so the server's same-origin check matches Origin (the string
  // shorthand would set changeOrigin: true and every POST would be refused).
  server: {
    proxy: {
      "/api": { target: API, changeOrigin: false },
      "/gateway": { target: API, changeOrigin: false },
    },
  },
});
