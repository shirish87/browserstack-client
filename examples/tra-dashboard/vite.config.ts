import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "node:path";
import { traGatewayPlugin } from "./server/gateway-plugin";

export default defineConfig({
  plugins: [react(), tailwindcss(), traGatewayPlugin({ mock: process.env.TRA_MOCK === "1" })],
  resolve: { alias: { "@": path.resolve(import.meta.dirname, "src") } },
});
