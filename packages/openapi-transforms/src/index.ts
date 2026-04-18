export {
  OpenAPIError,
  NetworkError,
  HttpError,
  DecodeError,
  TransformError,
  ClientError,
  isNetworkError,
  isHttpError,
  isDecodeError,
  isTransformError,
  isClientError,
} from "./errors.js";
export type {
  CodecContext,
  ErrorKind,
  ErrorBody,
  HttpErrorFields,
  DecodeErrorFields,
  TransformErrorFields,
} from "./errors.js";
export { captureErrorBody } from "./body-capture.js";
export { defaultErrorMessage } from "./error-message.js";
export { isRetryable } from "./retryable.js";
export { CodecRegistry } from "./registry.js";
export type { ResponseCodec, RequestCodec, EncodedRequest } from "./registry.js";
export { CodecError } from "./codec-error.js";
export { parsePath } from "./path/parser.js";
export { extract, isArrayPath } from "./path/matcher.js";
export type { PathAst, PathNode } from "./path/types.js";
export { streamExtract } from "./streaming/json-stream.js";
export {
  registerBuiltinResponseCodecs,
  jsonResponseCodec,
  jsonUnwrapCodec,
  jsonComposeCodec,
  textResponseCodec,
  binaryResponseCodec,
} from "./codecs/index.js";
export type { JsonUnwrapConfig } from "./codecs/response-json-unwrap.js";
export type { JsonComposeConfig } from "./codecs/response-json-compose.js";
export type { BinaryConfig } from "./codecs/response-binary.js";
