import { defineConfig } from "vitepress";
import typedocSidebar from "../api/typedoc-sidebar.json";

const isCI = process.env.CI === "true";

// https://vitepress.dev/reference/site-config
export default defineConfig({
  base: isCI ? "/browserstack-client/" : "/",
  title: "BrowserStack Client",
  description: "BrowserStack API client library for node.js",
  themeConfig: {
    nav: [
      { text: "Home", link: isCI ? "/" : "/api/" },
      { text: "Recipes", link: "/recipes/" },
      {
        text: "Github",
        link: "https://github.com/shirish87/browserstack-client",
      },
      {
        text: "npm",
        link: "https://www.npmjs.com/package/browserstack-client",
      },
    ],
    sidebar: typedocSidebar,
  },
});
