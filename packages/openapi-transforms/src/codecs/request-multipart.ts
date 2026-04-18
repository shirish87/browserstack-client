import type { RequestCodec } from "../registry.js";
import { parsePath } from "../path/parser.js";
import { extract } from "../path/matcher.js";

export interface MultipartConfig {
  fileField: string;
  filenameFrom: string;
}

const schema = { "~standard": { version: 1 as const, vendor: "ot", validate: (v: unknown) => {
  const o = v as any;
  if (!o || typeof o.fileField !== "string" || typeof o.filenameFrom !== "string") {
    return { issues: [{ message: "config.fileField and config.filenameFrom must be strings" }] };
  }
  return { value: v as MultipartConfig };
} } };

export const multipartRequestCodec: RequestCodec<Record<string, unknown>, MultipartConfig> = {
  name: "multipart",
  contentType: "multipart/form-data",
  configSchema: schema as any,
  encode(input, config) {
    const filePart = input[config.fileField];
    if (!(filePart instanceof Blob)) {
      throw new Error(`multipart: missing file field '${config.fileField}' or not a Blob`);
    }
    const filenameRaw = extract(parsePath(config.filenameFrom), input);
    const filename = typeof filenameRaw === "string" ? filenameRaw : undefined;
    const fd = new FormData();
    fd.append(config.fileField, filePart, filename);
    for (const [k, v] of Object.entries(input)) {
      if (k === config.fileField) continue;
      if (v == null) continue;
      fd.append(k, typeof v === "string" ? v : JSON.stringify(v));
    }
    return { body: fd };
  },
};
