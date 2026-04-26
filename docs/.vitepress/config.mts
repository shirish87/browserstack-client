import { defineConfig } from "vitepress";
import typedocSidebar from "../api/typedoc-sidebar.json";

const isCI = process.env.CI === "true" || process.env.GITHUB_ACTIONS === "true";

// https://vitepress.dev/reference/site-config
export default defineConfig({
  base: isCI ? "/browserstack-client/" : "/",
  cleanUrls: true,
  title: "BrowserStack Client",
  description: "BrowserStack API client library for node.js",
  themeConfig: {
    nav: [
      { text: "Home", link: "/" },
      { text: "Recipes", link: "/recipes" },
      {
        text: "Github",
        link: "https://github.com/shirish87/browserstack-client",
      },
      {
        text: "npm",
        link: "https://www.npmjs.com/package/browserstack-client",
      },
    ],
    sidebar: [
      { text: "Architecture", link: "/architecture" },
      { text: "Recipes", link: "/recipes" },
      ...typedocSidebar,
    ],
  },
});
