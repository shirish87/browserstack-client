// Node exposes `process`. Other runtimes may not.
function hostProcess(): NodeJS.Process | undefined {
  if (typeof process === "undefined") return undefined;
  return process;
}

const proc = hostProcess();

const envSource: Record<string, string | undefined> = proc?.env ?? {};

export const env: Record<string, string | undefined> = new Proxy(envSource, {
  get(target, prop) {
    if (typeof prop !== "string") return undefined;
    return target[prop];
  },
  set(target, prop, value) {
    if (typeof prop !== "string") return false;
    if (value === undefined) delete target[prop];
    else target[prop] = String(value);
    return true;
  },
  deleteProperty(target, prop) {
    if (typeof prop === "string") delete target[prop];
    return true;
  },
});

function versionMap(source: NodeJS.ProcessVersions | undefined): Record<string, string | undefined> {
  const out: Record<string, string | undefined> = { node: "unknown" };
  if (!source) return out;
  for (const [key, value] of Object.entries(source)) {
    if (typeof value === "string") out[key] = value;
  }
  return out;
}

export const versions = versionMap(proc?.versions);

export const currentPlatform = proc?.platform ?? "unknown";

export const currentArch = proc?.arch ?? "unknown";
