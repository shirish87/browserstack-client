import type { RequestCodec } from "../registry";
import { parsePath } from "../path/parser";
import { extract } from "../path/matcher";
import { defineSchema, isRecord } from "./schema";

export interface MultipartConfig {
  fileField: string;
  filenameFrom: string;
}

const schema = defineSchema<MultipartConfig>("openapi-transforms", (v) => {
  if (!isRecord(v) || typeof v.fileField !== "string" || typeof v.filenameFrom !== "string") {
    return { issues: [{ message: "config.fileField and config.filenameFrom must be strings" }] };
  }
  return { value: { fileField: v.fileField, filenameFrom: v.filenameFrom } };
});

export const multipartRequestCodec: RequestCodec<Record<string, unknown>, MultipartConfig> = {
  name: "multipart",
  contentType: "multipart/form-data",
  configSchema: schema,
  encode(input, config) {
    const filePart = input[config.fileField];
    const hasFile = filePart instanceof Blob;
    if (!hasFile && !("url" in input)) {
      throw new Error(`multipart: missing file field '${config.fileField}' or not a Blob`);
    }
    const filenameRaw = extract(parsePath(config.filenameFrom), input);
    const filename = typeof filenameRaw === "string" ? filenameRaw : undefined;
    const fd = new FormData();
    if (hasFile) {
      fd.append(config.fileField, filePart as Blob, filename);
    }
    for (const [k, v] of Object.entries(input)) {
      if (k === config.fileField) continue;
      if (v == null) continue;
      fd.append(k, typeof v === "string" ? v : JSON.stringify(v));
    }
    return { body: fd };
  },
};
