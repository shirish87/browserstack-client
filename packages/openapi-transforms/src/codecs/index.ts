import type { CodecRegistry } from "../registry";
import { jsonResponseCodec } from "./response-json";
import { jsonUnwrapCodec } from "./response-json-unwrap";
import { jsonComposeCodec } from "./response-json-compose";
import { textResponseCodec } from "./response-text";
import { binaryResponseCodec } from "./response-binary";

export {
  jsonResponseCodec,
  jsonUnwrapCodec,
  jsonComposeCodec,
  textResponseCodec,
  binaryResponseCodec,
};

export function registerBuiltinResponseCodecs(registry: CodecRegistry): void {
  registry.registerResponse(jsonResponseCodec);
  registry.registerResponse(jsonUnwrapCodec);
  registry.registerResponse(jsonComposeCodec);
  registry.registerResponse(textResponseCodec);
  registry.registerResponse(binaryResponseCodec);
}

import { jsonRequestCodec } from "./request-json";
import { multipartRequestCodec } from "./request-multipart";
import { rawRequestCodec } from "./request-raw";

export {
  jsonRequestCodec,
  multipartRequestCodec,
  rawRequestCodec,
};

export function registerBuiltinRequestCodecs(registry: CodecRegistry): void {
  registry.registerRequest(jsonRequestCodec);
  registry.registerRequest(multipartRequestCodec);
  registry.registerRequest(rawRequestCodec);
}

export function registerAllBuiltins(registry: CodecRegistry): void {
  registerBuiltinResponseCodecs(registry);
  registerBuiltinRequestCodecs(registry);
}
