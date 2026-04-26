// for compatibility with nodejs and deno

interface Dict<T> {
  [key: string]: T | undefined;
}

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const proc = globalThis.process ?? { env: {}, versions: {} };

export const env: Dict<string> = { ...proc?.env };

export const versions: Dict<string> = {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  node: "unknown",
  ...proc?.versions,
};

export const currentPlatform = proc?.platform ?? "unknown";

export const currentArch = proc?.arch ?? "unknown";
