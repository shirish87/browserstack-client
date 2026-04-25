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
} from "./errors";
export type {
  CodecContext,
  ErrorKind,
  ErrorBody,
  HttpErrorFields,
  DecodeErrorFields,
  TransformErrorFields,
} from "./errors";
export { captureErrorBody } from "./body-capture";
export { defaultErrorMessage } from "./error-message";
export { isRetryable } from "./retryable";
export { CodecRegistry } from "./registry";
export type { ResponseCodec, RequestCodec, EncodedRequest } from "./registry";
export { CodecError } from "./codec-error";
export { parsePath } from "./path/parser";
export { extract, isArrayPath } from "./path/matcher";
export type { PathAst, PathNode } from "./path/types";
export { streamExtract } from "./streaming/json-stream";
export {
  registerBuiltinResponseCodecs,
  registerBuiltinRequestCodecs,
  registerAllBuiltins,
  jsonResponseCodec,
  jsonUnwrapCodec,
  jsonComposeCodec,
  textResponseCodec,
  binaryResponseCodec,
  jsonRequestCodec,
  multipartRequestCodec,
} from "./codecs/index";
export type { JsonUnwrapConfig } from "./codecs/response-json-unwrap";
export type { JsonComposeConfig } from "./codecs/response-json-compose";
export type { BinaryConfig } from "./codecs/response-binary";
export type { MultipartConfig } from "./codecs/request-multipart";

export { executeOperation } from "./execute";
export type { ExecuteSpec, ExecuteOptions } from "./execute";

export { toCamelCase, toSnakeCase } from "./transforms/case";
export type { DeepCamelCase, DeepSnakeCase } from "./transforms/case";
