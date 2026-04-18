import type { CodecRegistry } from "../registry.js";
import { jsonResponseCodec } from "./response-json.js";
import { jsonUnwrapCodec } from "./response-json-unwrap.js";
import { jsonComposeCodec } from "./response-json-compose.js";
import { textResponseCodec } from "./response-text.js";
import { binaryResponseCodec } from "./response-binary.js";

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

import { jsonRequestCodec } from "./request-json.js";
import { multipartRequestCodec } from "./request-multipart.js";

export {
  jsonRequestCodec,
  multipartRequestCodec,
};

export function registerBuiltinRequestCodecs(registry: CodecRegistry): void {
  registry.registerRequest(jsonRequestCodec);
  registry.registerRequest(multipartRequestCodec);
}

export function registerAllBuiltins(registry: CodecRegistry): void {
  registerBuiltinResponseCodecs(registry);
  registerBuiltinRequestCodecs(registry);
}
