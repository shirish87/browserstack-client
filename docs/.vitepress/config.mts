import { defineConfig } from 'vitepress';
import typedocSidebar from '../api/typedoc-sidebar.json';

// const sortOrder = [
//   "index",
//   "automate",
//   "app-automate",
//   "screenshots",
//   "client",
//   "api",
//   "error",
// ];

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "BrowserStack Client",
  description: "BrowserStack API client library for node.js",
  themeConfig: {
    nav: [{ text: 'API', link: '/api/' }],
    sidebar: typedocSidebar, //.sort((a, b) => sortOrder.indexOf(a.text) - sortOrder.indexOf(b.text)),
  },
});
