import { defineConfig } from "vitepress";
import typedocSidebar from "../api/typedoc-sidebar.json";

// https://vitepress.dev/reference/site-config
export default defineConfig({
  base: process.env.CI === "true" ? "/browserstack-client/" : "/",
  title: "BrowserStack Client",
  description: "BrowserStack API client library for node.js",
  themeConfig: {
    nav: [
      { text: "API", link: "/api/" },
      { text: "Recipes", link: "/recipes/" },
    ],
    sidebar: typedocSidebar,
  },
});
