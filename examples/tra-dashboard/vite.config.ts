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
  server: { proxy: { "/api": API, "/gateway": API } },
});
