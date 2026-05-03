#!/usr/bin/env node
import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import { mkdirSync, writeFileSync, copyFileSync, chmodSync, existsSync, readFileSync, renameSync, statSync, truncateSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";

const __dirname = dirname(fileURLToPath(import.meta.url));
const require = createRequire(import.meta.url);
const { inject: postjectInject } = require("postject");

const NODE_VERSION = "24.15.0";
const SEA_FUSE = "NODE_SEA_FUSE_fce680ab2cc467b6e072b8b5df1996b2";

// SHA256 sums for node-v24.15.0 archives (https://nodejs.org/dist/v24.15.0/SHASUMS256.txt)
const SHASUMS = {
  "node-v24.15.0-darwin-arm64.tar.gz": "372331b969779ab5d15b949884fc6eaf88d5afe87bde8ba881d6400b9100ffc4",
  "node-v24.15.0-darwin-x64.tar.gz":   "ffd5ee293467927f3ee731a553eb88fd1f48cf74eebc2d74a6babe4af228673b",
  "node-v24.15.0-linux-arm64.tar.gz":  "73afc234d558c24919875f51c2d1ea002a2ada4ea6f83601a383869fefa64eed",
  "node-v24.15.0-linux-x64.tar.gz":    "44836872d9aec49f1e6b52a9a922872db9a2b02d235a616a5681b6a85fec8d89",
  "node-v24.15.0-win-x64.zip":         "cc5149eabd53779ce1e7bdc5401643622d0c7e6800ade18928a767e940bb0e62",
};

const TARGETS = [
  { id: "linux-x64",     archive: "tar.gz", outName: "linux-amd64",      isMacho: false, isWin: false },
  { id: "linux-arm64",   archive: "tar.gz", outName: "linux-arm64",      isMacho: false, isWin: false },
  { id: "darwin-x64",    archive: "tar.gz", outName: "darwin-amd64",     isMacho: true,  isWin: false },
  { id: "darwin-arm64",  archive: "tar.gz", outName: "darwin-arm64",     isMacho: true,  isWin: false },
  { id: "win-x64",       archive: "zip",    outName: "windows-amd64.exe", isMacho: false, isWin: true  },
];

const ROOT = __dirname;
const DIST = join(ROOT, "dist-binary");
const CACHE = join(DIST, ".node-cache");
const OUT_BASE = "browserstack-client-ts";

function log(...args) { console.log(">", ...args); }

// postject's emscripten-compiled binutils prints noisy ELF section warnings
// to stderr that are harmless. Filter them out for the duration of `fn`.
async function runQuiet(fn) {
  const origWrite = process.stderr.write.bind(process.stderr);
  const dropPatterns = [
    /Can't find string offset for section name/,
    /The signature seems corrupted!/,
  ];
  process.stderr.write = (chunk, ...rest) => {
    const text = typeof chunk === "string" ? chunk : chunk.toString();
    if (dropPatterns.some((re) => re.test(text))) {
      const cb = rest[rest.length - 1];
      if (typeof cb === "function") cb();
      return true;
    }
    return origWrite(chunk, ...rest);
  };
  try {
    return await fn();
  } finally {
    process.stderr.write = origWrite;
  }
}

// Zero out the PE Certificate Table data directory and truncate the
// trailing certificate blob so postject doesn't see a corrupted Authenticode
// signature after injection.
function stripPESignature(filePath) {
  const buf = readFileSync(filePath);
  // DOS header e_lfanew @ 0x3C
  const peOff = buf.readUInt32LE(0x3c);
  if (buf.readUInt32LE(peOff) !== 0x00004550) return; // not a PE file
  // PE header (4) + COFF header (20) = 24 bytes; then optional header
  const optHdrOff = peOff + 24;
  const magic = buf.readUInt16LE(optHdrOff);
  const isPE32Plus = magic === 0x20b;
  // Data directories start at offset 96 (PE32) or 112 (PE32+) within optional header
  const dataDirOff = optHdrOff + (isPE32Plus ? 112 : 96);
  // Index 4 = IMAGE_DIRECTORY_ENTRY_SECURITY (Certificate Table)
  const certEntryOff = dataDirOff + 4 * 8;
  const certRva = buf.readUInt32LE(certEntryOff);
  const certSize = buf.readUInt32LE(certEntryOff + 4);
  if (!certRva || !certSize) return; // already stripped
  // Zero the entry
  buf.writeUInt32LE(0, certEntryOff);
  buf.writeUInt32LE(0, certEntryOff + 4);
  writeFileSync(filePath, buf);
  // Cert table RVA is actually a file offset for SECURITY directory
  truncateSync(filePath, certRva);
}

function sha256(file) {
  const h = createHash("sha256");
  h.update(readFileSync(file));
  return h.digest("hex");
}

async function downloadVerified(url, dest, expectedSha) {
  if (existsSync(dest) && sha256(dest) === expectedSha) return;
  log(`fetch ${url}`);
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Download failed: ${url} (${res.status})`);
  const buf = Buffer.from(await res.arrayBuffer());
  writeFileSync(dest, buf);
  const got = sha256(dest);
  if (got !== expectedSha) {
    throw new Error(`SHA mismatch for ${url}: got ${got}, expected ${expectedSha}`);
  }
}

function extractNode(archivePath, target) {
  // Output: cache/<id>/node[.exe]
  const outDir = join(CACHE, target.id);
  mkdirSync(outDir, { recursive: true });
  const expected = join(outDir, target.isWin ? "node.exe" : "node");
  if (existsSync(expected)) return expected;

  if (target.archive === "tar.gz") {
    // tar produces node-v24.15.0-<os>-<arch>/bin/node
    execFileSync("tar", ["-xzf", archivePath, "-C", outDir], { stdio: "inherit" });
    const inner = join(outDir, `node-v${NODE_VERSION}-${target.id}`, "bin", "node");
    renameSync(inner, expected);
  } else {
    // unzip produces node-v24.15.0-win-x64/node.exe
    execFileSync("unzip", ["-q", "-o", archivePath, "-d", outDir], { stdio: "inherit" });
    const inner = join(outDir, `node-v${NODE_VERSION}-${target.id}`, "node.exe");
    renameSync(inner, expected);
  }
  chmodSync(expected, 0o755);
  return expected;
}

async function main() {
  mkdirSync(DIST, { recursive: true });
  mkdirSync(CACHE, { recursive: true });

  // 1) Bundle JS
  log("bundling JS via tsup");
  execFileSync("pnpm", ["run", "build:binary-bundle"], { stdio: "inherit", cwd: ROOT });

  const bundle = join(DIST, "browserstack-client.cjs");
  if (!existsSync(bundle)) throw new Error(`Missing bundle: ${bundle}`);

  // Strip the `#!/usr/bin/env node` shebang. Node's SEA CJS loader can fail
  // to compile sources with a shebang on the first line.
  const bundleSrc = readFileSync(bundle, "utf8");
  if (bundleSrc.startsWith("#!")) {
    writeFileSync(bundle, bundleSrc.replace(/^#![^\n]*\n/, ""));
  }

  // 2) Fetch + extract Node binaries first — we need the host-arch Node v${NODE_VERSION}
  //    to generate the SEA blob. Node's SEA loader requires the blob to be
  //    produced by the same Node version that will execute it; using
  //    `process.execPath` (a different version) yields a blob that crashes
  //    the embedded Node with `v8::ToLocalChecked Empty MaybeLocal`.
  await Promise.all(TARGETS.map(async (target) => {
    const fname = `node-v${NODE_VERSION}-${target.id}.${target.archive}`;
    const url = `https://nodejs.org/dist/v${NODE_VERSION}/${fname}`;
    const archive = join(CACHE, fname);
    const sha = SHASUMS[fname];
    if (!sha) throw new Error(`Missing SHA for ${fname}`);
    await downloadVerified(url, archive, sha);
    extractNode(archive, target);
  }));

  const hostId = `${process.platform === "win32" ? "win" : process.platform}-${process.arch === "x64" ? "x64" : process.arch}`;
  const hostTarget = TARGETS.find((t) => t.id === hostId);
  if (!hostTarget) throw new Error(`Unsupported host platform/arch: ${hostId}`);
  const hostNode = join(CACHE, hostTarget.id, hostTarget.isWin ? "node.exe" : "node");

  // 3) Write sea-config.json + 4) generate blob using the host-arch Node v${NODE_VERSION}
  const seaConfigPath = join(DIST, "sea-config.json");
  const blobPath = join(DIST, "sea-prep.blob");
  writeFileSync(seaConfigPath, JSON.stringify({
    main: bundle,
    output: blobPath,
    disableExperimentalSEAWarning: true,
    useSnapshot: false,
    useCodeCache: false,
  }, null, 2));
  log(`generating SEA blob with Node v${NODE_VERSION} (${hostNode})`);
  execFileSync(hostNode, ["--experimental-sea-config", seaConfigPath], { stdio: "inherit" });

  const blob = readFileSync(blobPath);

  // 5+6) Copy, inject, codesign
  for (const target of TARGETS) {
    const cachedNode = join(CACHE, target.id, target.isWin ? "node.exe" : "node");
    const outName = `${OUT_BASE}-${target.outName}`;
    const outPath = join(DIST, outName);
    log(`creating ${outName}`);
    copyFileSync(cachedNode, outPath);
    chmodSync(outPath, 0o755);

    if (target.isMacho) {
      // Strip the signature before injection (re-applied below)
      try { execFileSync("codesign", ["--remove-signature", outPath], { stdio: "inherit" }); } catch {}
    }

    if (target.isWin) {
      stripPESignature(outPath);
    }

    await runQuiet(() => postjectInject(outPath, "NODE_SEA_BLOB", blob, {
      sentinelFuse: SEA_FUSE,
      machoSegmentName: target.isMacho ? "NODE_SEA" : undefined,
      overwrite: true,
    }));

    if (target.isMacho) {
      execFileSync("codesign", ["--sign", "-", outPath], { stdio: "inherit" });
    }
  }

  // Print summary
  log("done");
  for (const target of TARGETS) {
    const outPath = join(DIST, `${OUT_BASE}-${target.outName}`);
    const size = (statSync(outPath).size / 1024 / 1024).toFixed(1);
    console.log(`  ${target.outName.padEnd(20)} ${size} MB`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
