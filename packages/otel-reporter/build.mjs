import { build } from "esbuild";

await build({
  entryPoints: ["src/register.cts"],
  bundle: true,
  platform: "node",
  target: "node18",
  format: "cjs",
  outfile: "dist/register.cjs",
  minify: false,
  sourcemap: false,
  external: [],
  define: {
    "process.env.NODE_ENV": '"production"',
  },
});

console.log("Built dist/register.cjs");
