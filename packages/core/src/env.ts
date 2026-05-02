// for compatibility with nodejs and deno

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const proc = globalThis.process ?? { env: {}, versions: {} };

export const env: Record<string, string | undefined> = new Proxy(
  (proc?.env || {}) as Record<string, string | undefined>,
  {
    get(target, prop) {
      if (typeof prop !== "string") return undefined;
      return target[prop];
    },
    set(target, prop, value) {
      if (typeof prop !== "string") return false;
      if (value === undefined) {
        delete target[prop];
      } else {
        target[prop] = String(value);
      }
      return true;
    },
    deleteProperty(target, prop) {
      if (typeof prop === "string") {
        delete target[prop];
      }
      return true;
    },
  }
);

export const versions: Record<string, string | undefined> = {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  node: "unknown",
  ...proc?.versions,
};

export const currentPlatform = proc?.platform ?? "unknown";

export const currentArch = proc?.arch ?? "unknown";
