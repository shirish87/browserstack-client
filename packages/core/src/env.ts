// for compatibility with nodejs and deno

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const proc = globalThis.process ?? { env: {}, versions: {} };

export const env: Record<string, string | undefined> = { ...proc?.env };

export const versions: Record<string, string | undefined> = {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  node: "unknown",
  ...proc?.versions,
};

export const currentPlatform = proc?.platform ?? "unknown";

export const currentArch = proc?.arch ?? "unknown";
