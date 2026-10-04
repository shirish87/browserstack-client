#!/usr/bin/env node
// Verifies that what each publishable package declares for TypeScript is actually shipped and usable:
//  1. every `types` path in package.json (top level and in `exports`) exists after the build, and
//  2. every bare module a shipped .d.ts imports is a declared dependency/peer of that package that itself
//     ships declarations (or a Node built-in). Anything else becomes `any` for consumers, or an error under
//     `noImplicitAny` without `skipLibCheck`.
// Run after `pnpm build`. Exits 1 and lists every problem.
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { builtinModules } from "node:module";
import path from "node:path";

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const problems = [];

// Packages whose declarations are known to be incomplete (tracked in scripts/declarations-known-gaps.json).
// A known gap that has been fixed must be removed from the list, so the list only ever shrinks.
const knownGapsFile = path.join(root, "scripts/declarations-known-gaps.json");
const knownGaps = existsSync(knownGapsFile) ? JSON.parse(readFileSync(knownGapsFile, "utf8")) : {};
const problemsByPackage = new Map();

function packageDirs() {
  const out = [];
  for (const base of ["packages", "packages/cli"]) {
    const dir = path.join(root, base);
    if (!existsSync(dir)) continue;
    for (const name of readdirSync(dir)) {
      const p = path.join(dir, name);
      if (existsSync(path.join(p, "package.json")) && statSync(p).isDirectory()) out.push(p);
    }
  }
  // The TypeScript CLI lives one level deeper.
  const cli = path.join(root, "packages/cli/typescript");
  if (existsSync(path.join(cli, "package.json")) && !out.includes(cli)) out.push(cli);
  return out;
}

function typesPaths(pkg) {
  const found = new Set();
  if (pkg.types) found.add(pkg.types);
  const walk = (v) => {
    if (!v || typeof v !== "object") return;
    for (const [k, val] of Object.entries(v)) {
      if (k === "types" && typeof val === "string") found.add(val);
      else walk(val);
    }
  };
  walk(pkg.exports);
  return [...found];
}

function declarationFiles(dir) {
  const out = [];
  if (!existsSync(dir)) return out;
  for (const name of readdirSync(dir)) {
    const p = path.join(dir, name);
    if (statSync(p).isDirectory()) out.push(...declarationFiles(p));
    else if (/\.d\.[cm]?ts$/.test(name)) out.push(p);
  }
  return out;
}

const IMPORT = /(?:from|import)\s*\(?\s*['"]([^'"]+)['"]/g;
const builtins = new Set([...builtinModules, ...builtinModules.map((m) => `node:${m}`)]);

function packageNameOf(specifier) {
  const parts = specifier.split("/");
  return specifier.startsWith("@") ? parts.slice(0, 2).join("/") : parts[0];
}

/** Does a dependency ship declarations a consumer's TypeScript can find? */
function shipsTypes(name, fromDir) {
  let dir;
  try {
    dir = path.dirname(new URL(import.meta.resolve(`${name}/package.json`, `file://${fromDir}/`)).pathname);
  } catch {
    const candidate = path.join(fromDir, "node_modules", name);
    dir = existsSync(candidate) ? candidate : undefined;
  }
  if (!dir) return false;
  const pkg = JSON.parse(readFileSync(path.join(dir, "package.json"), "utf8"));
  if (pkg.types || pkg.typings) return existsSync(path.join(dir, pkg.types ?? pkg.typings));
  if (name.startsWith("@types/")) return true;
  const typed = typesPaths(pkg);
  return typed.length > 0 ? typed.every((t) => existsSync(path.join(dir, t))) : existsSync(path.join(dir, "index.d.ts"));
}

for (const dir of packageDirs()) {
  const pkg = JSON.parse(readFileSync(path.join(dir, "package.json"), "utf8"));
  if (pkg.private || !pkg.name) continue;
  const rel = path.relative(root, dir);
  const before = problems.length;
  for (const t of typesPaths(pkg)) {
    if (!existsSync(path.join(dir, t))) problems.push(`${pkg.name}: package.json declares types "${t}" but ${path.join(rel, t)} does not exist`);
  }
  const shipped = new Set([...Object.keys(pkg.dependencies ?? {}), ...Object.keys(pkg.peerDependencies ?? {}), ...Object.keys(pkg.optionalDependencies ?? {})]);
  for (const file of declarationFiles(path.join(dir, "dist"))) {
    const text = readFileSync(file, "utf8");
    const seen = new Set();
    for (const m of text.matchAll(IMPORT)) {
      const spec = m[1];
      if (spec.startsWith(".") || spec.startsWith("/") || builtins.has(spec)) continue;
      const name = packageNameOf(spec);
      if (seen.has(name)) continue;
      seen.add(name);
      if (!shipped.has(name)) problems.push(`${pkg.name}: ${path.relative(root, file)} imports "${spec}", which is not a dependency or peer, so consumers cannot resolve it`);
      else if (!shipsTypes(name, dir)) problems.push(`${pkg.name}: ${path.relative(root, file)} imports "${spec}", which ships no declarations`);
    }
  }

  const mine = problems.splice(before);
  if (mine.length > 0 && knownGaps[pkg.name]) {
    problemsByPackage.set(pkg.name, mine.length);
  } else {
    problems.push(...mine);
    if (mine.length === 0 && knownGaps[pkg.name]) problems.push(`${pkg.name}: declarations are fine now; remove it from scripts/declarations-known-gaps.json`);
  }
}

for (const [name, n] of problemsByPackage) console.warn(`known gap: ${name} (${n} problem(s)): ${knownGaps[name]}`);

if (problems.length > 0) {
  console.error(`${problems.length} declaration problem(s):\n${problems.map((p) => `  - ${p}`).join("\n")}`);
  process.exit(1);
}
console.log("Declarations OK: every declared types file exists and every imported module resolves for consumers.");
