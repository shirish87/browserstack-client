#!/usr/bin/env node
"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);

// src/browserstack-test-reporting.ts
var browserstack_test_reporting_exports = {};
__export(browserstack_test_reporting_exports, {
  main: () => main
});
module.exports = __toCommonJS(browserstack_test_reporting_exports);

// ../core/src/env.ts
var proc = globalThis.process ?? { env: {}, versions: {} };
var env = { ...proc?.env };
var versions = {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  node: "unknown",
  ...proc?.versions
};
var currentPlatform = proc?.platform ?? "unknown";
var currentArch = proc?.arch ?? "unknown";

// ../openapi-transforms/src/errors.ts
var OpenAPIError = class extends Error {
  constructor(kind, message, ctx, cause) {
    super(message);
    __publicField(this, "kind");
    __publicField(this, "operationId");
    __publicField(this, "method");
    __publicField(this, "url");
    __publicField(this, "cause");
    this.name = "OpenAPIError";
    this.kind = kind;
    this.operationId = ctx.operationId;
    this.method = ctx.method;
    this.url = ctx.url;
    if (cause) this.cause = cause;
    Object.setPrototypeOf(this, new.target.prototype);
  }
};
var NetworkError = class extends OpenAPIError {
  constructor(message, ctx, cause) {
    super("network", message, ctx, cause);
    this.name = "NetworkError";
  }
};
var HttpError = class extends OpenAPIError {
  constructor(message, ctx, fields) {
    super("http", message, ctx);
    __publicField(this, "status");
    __publicField(this, "statusText");
    __publicField(this, "headers");
    __publicField(this, "requestId");
    __publicField(this, "body");
    __publicField(this, "retryable");
    this.name = "HttpError";
    this.status = fields.status;
    this.statusText = fields.statusText;
    this.headers = fields.headers;
    if (fields.requestId !== void 0) this.requestId = fields.requestId;
    this.body = fields.body;
    this.retryable = fields.retryable;
  }
};
var DecodeError = class extends OpenAPIError {
  constructor(message, ctx, fields) {
    super("decode", message, ctx, fields.cause);
    __publicField(this, "status");
    __publicField(this, "statusText");
    __publicField(this, "headers");
    __publicField(this, "codecName");
    this.name = "DecodeError";
    this.status = fields.status;
    this.statusText = fields.statusText;
    this.headers = fields.headers;
    this.codecName = fields.codecName;
  }
};
var TransformError = class extends OpenAPIError {
  constructor(message, ctx, fields) {
    super("transform", message, ctx, fields.cause);
    __publicField(this, "status");
    __publicField(this, "statusText");
    __publicField(this, "codecName");
    __publicField(this, "path");
    this.name = "TransformError";
    this.status = fields.status;
    this.statusText = fields.statusText;
    this.codecName = fields.codecName;
    if (fields.path !== void 0) this.path = fields.path;
  }
};
var ClientError = class extends OpenAPIError {
  constructor(message, ctx, cause) {
    super("client", message, ctx, cause);
    this.name = "ClientError";
  }
};

// ../openapi-transforms/src/body-capture.ts
async function captureErrorBody(response, maxBytes) {
  const contentType = response.headers.get("content-type") ?? void 0;
  if (!response.body) return { contentType };
  const reader = response.body.getReader();
  const chunks = [];
  let received = 0;
  let truncated = false;
  while (received < maxBytes) {
    const { value, done } = await reader.read();
    if (done) break;
    if (received + value.length > maxBytes) {
      chunks.push(value.subarray(0, maxBytes - received));
      received = maxBytes;
      truncated = true;
      try {
        await reader.cancel();
      } catch {
      }
      break;
    }
    chunks.push(value);
    received += value.length;
  }
  const merged = new Uint8Array(received);
  let offset = 0;
  for (const c of chunks) {
    merged.set(c, offset);
    offset += c.length;
  }
  const text = new TextDecoder().decode(merged);
  const out = { contentType, text, truncated };
  if (contentType?.includes("application/json")) {
    try {
      out.parsed = JSON.parse(text);
    } catch {
    }
  }
  return out;
}

// ../openapi-transforms/src/error-message.ts
function firstString(v) {
  if (typeof v !== "string") return void 0;
  const trimmed = v.trim();
  return trimmed.length ? trimmed.slice(0, 512) : void 0;
}
function defaultErrorMessage(body) {
  if (body == null) return void 0;
  if (typeof body === "string") return firstString(body);
  if (typeof body !== "object") return void 0;
  const o = body;
  return firstString(o.error) ?? firstString(o.message) ?? firstString(Array.isArray(o.errors) ? o.errors[0] : void 0) ?? firstString(o.detail) ?? firstString(o.description);
}

// ../openapi-transforms/src/retryable.ts
function isRetryable(kind, status) {
  if (kind === "network") return true;
  if (kind !== "http") return false;
  if (status === 408 || status === 429) return true;
  if (status && status >= 500 && status < 600) return status !== 501 && status !== 505;
  return false;
}

// ../openapi-transforms/src/registry.ts
var CodecRegistry = class {
  constructor() {
    __publicField(this, "response", /* @__PURE__ */ new Map());
    __publicField(this, "request", /* @__PURE__ */ new Map());
  }
  registerResponse(codec) {
    if (this.response.has(codec.name)) {
      throw new Error(`response codec '${codec.name}' already registered`);
    }
    this.response.set(codec.name, codec);
  }
  registerRequest(codec) {
    if (this.request.has(codec.name)) {
      throw new Error(`request codec '${codec.name}' already registered`);
    }
    this.request.set(codec.name, codec);
  }
  resolveResponse(name) {
    const c = this.response.get(name);
    if (!c) throw new Error(`unknown response codec: ${name}`);
    return c;
  }
  resolveRequest(name) {
    const c = this.request.get(name);
    if (!c) throw new Error(`unknown request codec: ${name}`);
    return c;
  }
  listResponse() {
    return [...this.response.keys()];
  }
  listRequest() {
    return [...this.request.keys()];
  }
};

// ../openapi-transforms/src/codec-error.ts
var CodecError = class extends Error {
  constructor(codecName, stage, message, cause) {
    super(message);
    __publicField(this, "codecName");
    __publicField(this, "stage");
    __publicField(this, "cause");
    this.name = "CodecError";
    this.codecName = codecName;
    this.stage = stage;
    if (cause) this.cause = cause;
  }
};

// ../openapi-transforms/src/path/parser.ts
function parsePath(input) {
  if (!input.startsWith("$")) throw new Error(`path must start with $, got: ${input}`);
  const out = [{ kind: "root" }];
  let i = 1;
  while (i < input.length) {
    const c = input[i];
    if (c === ".") {
      if (input[i + 1] === ".") throw new Error(`unsupported path syntax (recursive descent): ${input}`);
      i++;
      let name = "";
      while (i < input.length && /[A-Za-z0-9_]/.test(input[i])) {
        name += input[i];
        i++;
      }
      if (!name) throw new Error(`expected field name after . at offset ${i}`);
      out.push({ kind: "field", name });
    } else if (c === "[") {
      const close = input.indexOf("]", i);
      if (close === -1) throw new Error(`unclosed bracket in path: ${input}`);
      const inner = input.slice(i + 1, close);
      if (inner === "*") out.push({ kind: "wildcard" });
      else if (/^\d+$/.test(inner)) out.push({ kind: "index", index: Number(inner) });
      else throw new Error(`unsupported path syntax: [${inner}]`);
      i = close + 1;
    } else {
      throw new Error(`unexpected character '${c}' at offset ${i} in ${input}`);
    }
  }
  return out;
}

// ../openapi-transforms/src/path/matcher.ts
function isArrayPath(ast) {
  return ast.some((n) => n.kind === "wildcard");
}
function extract(ast, root) {
  return step(ast.slice(1), root);
}
function step(nodes, value) {
  if (nodes.length === 0) return value;
  const [head, ...rest] = nodes;
  if (head.kind === "field") {
    if (value == null || typeof value !== "object") throw new Error(`expected object, got ${typeof value}`);
    return step(rest, value[head.name]);
  }
  if (head.kind === "wildcard") {
    if (!Array.isArray(value)) throw new Error(`expected array at [*], got ${typeof value}`);
    return value.map((v) => step(rest, v));
  }
  if (head.kind === "index") {
    if (!Array.isArray(value)) throw new Error(`expected array at [${head.index}], got ${typeof value}`);
    return step(rest, value[head.index]);
  }
  if (head.kind === "root") {
    return step(rest, value);
  }
  const never = head;
  throw new Error(`unreachable node: ${JSON.stringify(never)}`);
}

// ../../node_modules/.pnpm/@streamparser+json@0.0.22/node_modules/@streamparser/json/dist/mjs/utils/utf-8.js
var charset;
(function(charset2) {
  charset2[charset2["BACKSPACE"] = 8] = "BACKSPACE";
  charset2[charset2["FORM_FEED"] = 12] = "FORM_FEED";
  charset2[charset2["NEWLINE"] = 10] = "NEWLINE";
  charset2[charset2["CARRIAGE_RETURN"] = 13] = "CARRIAGE_RETURN";
  charset2[charset2["TAB"] = 9] = "TAB";
  charset2[charset2["SPACE"] = 32] = "SPACE";
  charset2[charset2["EXCLAMATION_MARK"] = 33] = "EXCLAMATION_MARK";
  charset2[charset2["QUOTATION_MARK"] = 34] = "QUOTATION_MARK";
  charset2[charset2["NUMBER_SIGN"] = 35] = "NUMBER_SIGN";
  charset2[charset2["DOLLAR_SIGN"] = 36] = "DOLLAR_SIGN";
  charset2[charset2["PERCENT_SIGN"] = 37] = "PERCENT_SIGN";
  charset2[charset2["AMPERSAND"] = 38] = "AMPERSAND";
  charset2[charset2["APOSTROPHE"] = 39] = "APOSTROPHE";
  charset2[charset2["LEFT_PARENTHESIS"] = 40] = "LEFT_PARENTHESIS";
  charset2[charset2["RIGHT_PARENTHESIS"] = 41] = "RIGHT_PARENTHESIS";
  charset2[charset2["ASTERISK"] = 42] = "ASTERISK";
  charset2[charset2["PLUS_SIGN"] = 43] = "PLUS_SIGN";
  charset2[charset2["COMMA"] = 44] = "COMMA";
  charset2[charset2["HYPHEN_MINUS"] = 45] = "HYPHEN_MINUS";
  charset2[charset2["FULL_STOP"] = 46] = "FULL_STOP";
  charset2[charset2["SOLIDUS"] = 47] = "SOLIDUS";
  charset2[charset2["DIGIT_ZERO"] = 48] = "DIGIT_ZERO";
  charset2[charset2["DIGIT_ONE"] = 49] = "DIGIT_ONE";
  charset2[charset2["DIGIT_TWO"] = 50] = "DIGIT_TWO";
  charset2[charset2["DIGIT_THREE"] = 51] = "DIGIT_THREE";
  charset2[charset2["DIGIT_FOUR"] = 52] = "DIGIT_FOUR";
  charset2[charset2["DIGIT_FIVE"] = 53] = "DIGIT_FIVE";
  charset2[charset2["DIGIT_SIX"] = 54] = "DIGIT_SIX";
  charset2[charset2["DIGIT_SEVEN"] = 55] = "DIGIT_SEVEN";
  charset2[charset2["DIGIT_EIGHT"] = 56] = "DIGIT_EIGHT";
  charset2[charset2["DIGIT_NINE"] = 57] = "DIGIT_NINE";
  charset2[charset2["COLON"] = 58] = "COLON";
  charset2[charset2["SEMICOLON"] = 59] = "SEMICOLON";
  charset2[charset2["LESS_THAN_SIGN"] = 60] = "LESS_THAN_SIGN";
  charset2[charset2["EQUALS_SIGN"] = 61] = "EQUALS_SIGN";
  charset2[charset2["GREATER_THAN_SIGN"] = 62] = "GREATER_THAN_SIGN";
  charset2[charset2["QUESTION_MARK"] = 63] = "QUESTION_MARK";
  charset2[charset2["COMMERCIAL_AT"] = 64] = "COMMERCIAL_AT";
  charset2[charset2["LATIN_CAPITAL_LETTER_A"] = 65] = "LATIN_CAPITAL_LETTER_A";
  charset2[charset2["LATIN_CAPITAL_LETTER_B"] = 66] = "LATIN_CAPITAL_LETTER_B";
  charset2[charset2["LATIN_CAPITAL_LETTER_C"] = 67] = "LATIN_CAPITAL_LETTER_C";
  charset2[charset2["LATIN_CAPITAL_LETTER_D"] = 68] = "LATIN_CAPITAL_LETTER_D";
  charset2[charset2["LATIN_CAPITAL_LETTER_E"] = 69] = "LATIN_CAPITAL_LETTER_E";
  charset2[charset2["LATIN_CAPITAL_LETTER_F"] = 70] = "LATIN_CAPITAL_LETTER_F";
  charset2[charset2["LATIN_CAPITAL_LETTER_G"] = 71] = "LATIN_CAPITAL_LETTER_G";
  charset2[charset2["LATIN_CAPITAL_LETTER_H"] = 72] = "LATIN_CAPITAL_LETTER_H";
  charset2[charset2["LATIN_CAPITAL_LETTER_I"] = 73] = "LATIN_CAPITAL_LETTER_I";
  charset2[charset2["LATIN_CAPITAL_LETTER_J"] = 74] = "LATIN_CAPITAL_LETTER_J";
  charset2[charset2["LATIN_CAPITAL_LETTER_K"] = 75] = "LATIN_CAPITAL_LETTER_K";
  charset2[charset2["LATIN_CAPITAL_LETTER_L"] = 76] = "LATIN_CAPITAL_LETTER_L";
  charset2[charset2["LATIN_CAPITAL_LETTER_M"] = 77] = "LATIN_CAPITAL_LETTER_M";
  charset2[charset2["LATIN_CAPITAL_LETTER_N"] = 78] = "LATIN_CAPITAL_LETTER_N";
  charset2[charset2["LATIN_CAPITAL_LETTER_O"] = 79] = "LATIN_CAPITAL_LETTER_O";
  charset2[charset2["LATIN_CAPITAL_LETTER_P"] = 80] = "LATIN_CAPITAL_LETTER_P";
  charset2[charset2["LATIN_CAPITAL_LETTER_Q"] = 81] = "LATIN_CAPITAL_LETTER_Q";
  charset2[charset2["LATIN_CAPITAL_LETTER_R"] = 82] = "LATIN_CAPITAL_LETTER_R";
  charset2[charset2["LATIN_CAPITAL_LETTER_S"] = 83] = "LATIN_CAPITAL_LETTER_S";
  charset2[charset2["LATIN_CAPITAL_LETTER_T"] = 84] = "LATIN_CAPITAL_LETTER_T";
  charset2[charset2["LATIN_CAPITAL_LETTER_U"] = 85] = "LATIN_CAPITAL_LETTER_U";
  charset2[charset2["LATIN_CAPITAL_LETTER_V"] = 86] = "LATIN_CAPITAL_LETTER_V";
  charset2[charset2["LATIN_CAPITAL_LETTER_W"] = 87] = "LATIN_CAPITAL_LETTER_W";
  charset2[charset2["LATIN_CAPITAL_LETTER_X"] = 88] = "LATIN_CAPITAL_LETTER_X";
  charset2[charset2["LATIN_CAPITAL_LETTER_Y"] = 89] = "LATIN_CAPITAL_LETTER_Y";
  charset2[charset2["LATIN_CAPITAL_LETTER_Z"] = 90] = "LATIN_CAPITAL_LETTER_Z";
  charset2[charset2["LEFT_SQUARE_BRACKET"] = 91] = "LEFT_SQUARE_BRACKET";
  charset2[charset2["REVERSE_SOLIDUS"] = 92] = "REVERSE_SOLIDUS";
  charset2[charset2["RIGHT_SQUARE_BRACKET"] = 93] = "RIGHT_SQUARE_BRACKET";
  charset2[charset2["CIRCUMFLEX_ACCENT"] = 94] = "CIRCUMFLEX_ACCENT";
  charset2[charset2["LOW_LINE"] = 95] = "LOW_LINE";
  charset2[charset2["GRAVE_ACCENT"] = 96] = "GRAVE_ACCENT";
  charset2[charset2["LATIN_SMALL_LETTER_A"] = 97] = "LATIN_SMALL_LETTER_A";
  charset2[charset2["LATIN_SMALL_LETTER_B"] = 98] = "LATIN_SMALL_LETTER_B";
  charset2[charset2["LATIN_SMALL_LETTER_C"] = 99] = "LATIN_SMALL_LETTER_C";
  charset2[charset2["LATIN_SMALL_LETTER_D"] = 100] = "LATIN_SMALL_LETTER_D";
  charset2[charset2["LATIN_SMALL_LETTER_E"] = 101] = "LATIN_SMALL_LETTER_E";
  charset2[charset2["LATIN_SMALL_LETTER_F"] = 102] = "LATIN_SMALL_LETTER_F";
  charset2[charset2["LATIN_SMALL_LETTER_G"] = 103] = "LATIN_SMALL_LETTER_G";
  charset2[charset2["LATIN_SMALL_LETTER_H"] = 104] = "LATIN_SMALL_LETTER_H";
  charset2[charset2["LATIN_SMALL_LETTER_I"] = 105] = "LATIN_SMALL_LETTER_I";
  charset2[charset2["LATIN_SMALL_LETTER_J"] = 106] = "LATIN_SMALL_LETTER_J";
  charset2[charset2["LATIN_SMALL_LETTER_K"] = 107] = "LATIN_SMALL_LETTER_K";
  charset2[charset2["LATIN_SMALL_LETTER_L"] = 108] = "LATIN_SMALL_LETTER_L";
  charset2[charset2["LATIN_SMALL_LETTER_M"] = 109] = "LATIN_SMALL_LETTER_M";
  charset2[charset2["LATIN_SMALL_LETTER_N"] = 110] = "LATIN_SMALL_LETTER_N";
  charset2[charset2["LATIN_SMALL_LETTER_O"] = 111] = "LATIN_SMALL_LETTER_O";
  charset2[charset2["LATIN_SMALL_LETTER_P"] = 112] = "LATIN_SMALL_LETTER_P";
  charset2[charset2["LATIN_SMALL_LETTER_Q"] = 113] = "LATIN_SMALL_LETTER_Q";
  charset2[charset2["LATIN_SMALL_LETTER_R"] = 114] = "LATIN_SMALL_LETTER_R";
  charset2[charset2["LATIN_SMALL_LETTER_S"] = 115] = "LATIN_SMALL_LETTER_S";
  charset2[charset2["LATIN_SMALL_LETTER_T"] = 116] = "LATIN_SMALL_LETTER_T";
  charset2[charset2["LATIN_SMALL_LETTER_U"] = 117] = "LATIN_SMALL_LETTER_U";
  charset2[charset2["LATIN_SMALL_LETTER_V"] = 118] = "LATIN_SMALL_LETTER_V";
  charset2[charset2["LATIN_SMALL_LETTER_W"] = 119] = "LATIN_SMALL_LETTER_W";
  charset2[charset2["LATIN_SMALL_LETTER_X"] = 120] = "LATIN_SMALL_LETTER_X";
  charset2[charset2["LATIN_SMALL_LETTER_Y"] = 121] = "LATIN_SMALL_LETTER_Y";
  charset2[charset2["LATIN_SMALL_LETTER_Z"] = 122] = "LATIN_SMALL_LETTER_Z";
  charset2[charset2["LEFT_CURLY_BRACKET"] = 123] = "LEFT_CURLY_BRACKET";
  charset2[charset2["VERTICAL_LINE"] = 124] = "VERTICAL_LINE";
  charset2[charset2["RIGHT_CURLY_BRACKET"] = 125] = "RIGHT_CURLY_BRACKET";
  charset2[charset2["TILDE"] = 126] = "TILDE";
})(charset || (charset = {}));
var escapedSequences = {
  [charset.QUOTATION_MARK]: charset.QUOTATION_MARK,
  [charset.REVERSE_SOLIDUS]: charset.REVERSE_SOLIDUS,
  [charset.SOLIDUS]: charset.SOLIDUS,
  [charset.LATIN_SMALL_LETTER_B]: charset.BACKSPACE,
  [charset.LATIN_SMALL_LETTER_F]: charset.FORM_FEED,
  [charset.LATIN_SMALL_LETTER_N]: charset.NEWLINE,
  [charset.LATIN_SMALL_LETTER_R]: charset.CARRIAGE_RETURN,
  [charset.LATIN_SMALL_LETTER_T]: charset.TAB
};

// ../../node_modules/.pnpm/@streamparser+json@0.0.22/node_modules/@streamparser/json/dist/mjs/utils/bufferedString.js
var NonBufferedString = class {
  constructor() {
    this.decoder = new TextDecoder("utf-8");
    this.strings = [];
    this.byteLength = 0;
  }
  appendChar(char) {
    this.strings.push(String.fromCharCode(char));
    this.byteLength += 1;
  }
  appendBuf(buf, start = 0, end = buf.length) {
    this.strings.push(this.decoder.decode(buf.subarray(start, end)));
    this.byteLength += end - start;
  }
  reset() {
    this.strings = [];
    this.byteLength = 0;
  }
  toString() {
    return this.strings.join("");
  }
};
var BufferedString = class {
  constructor(bufferSize) {
    this.decoder = new TextDecoder("utf-8");
    this.bufferOffset = 0;
    this.string = "";
    this.byteLength = 0;
    this.buffer = new Uint8Array(bufferSize);
  }
  appendChar(char) {
    if (this.bufferOffset >= this.buffer.length)
      this.flushStringBuffer();
    this.buffer[this.bufferOffset++] = char;
    this.byteLength += 1;
  }
  appendBuf(buf, start = 0, end = buf.length) {
    const size = end - start;
    if (this.bufferOffset + size > this.buffer.length)
      this.flushStringBuffer();
    this.buffer.set(buf.subarray(start, end), this.bufferOffset);
    this.bufferOffset += size;
    this.byteLength += size;
  }
  flushStringBuffer() {
    this.string += this.decoder.decode(this.buffer.subarray(0, this.bufferOffset));
    this.bufferOffset = 0;
  }
  reset() {
    this.string = "";
    this.bufferOffset = 0;
    this.byteLength = 0;
  }
  toString() {
    this.flushStringBuffer();
    return this.string;
  }
};

// ../../node_modules/.pnpm/@streamparser+json@0.0.22/node_modules/@streamparser/json/dist/mjs/utils/types/tokenType.js
var TokenType;
(function(TokenType2) {
  TokenType2[TokenType2["LEFT_BRACE"] = 0] = "LEFT_BRACE";
  TokenType2[TokenType2["RIGHT_BRACE"] = 1] = "RIGHT_BRACE";
  TokenType2[TokenType2["LEFT_BRACKET"] = 2] = "LEFT_BRACKET";
  TokenType2[TokenType2["RIGHT_BRACKET"] = 3] = "RIGHT_BRACKET";
  TokenType2[TokenType2["COLON"] = 4] = "COLON";
  TokenType2[TokenType2["COMMA"] = 5] = "COMMA";
  TokenType2[TokenType2["TRUE"] = 6] = "TRUE";
  TokenType2[TokenType2["FALSE"] = 7] = "FALSE";
  TokenType2[TokenType2["NULL"] = 8] = "NULL";
  TokenType2[TokenType2["STRING"] = 9] = "STRING";
  TokenType2[TokenType2["NUMBER"] = 10] = "NUMBER";
  TokenType2[TokenType2["SEPARATOR"] = 11] = "SEPARATOR";
})(TokenType || (TokenType = {}));
var tokenType_default = TokenType;

// ../../node_modules/.pnpm/@streamparser+json@0.0.22/node_modules/@streamparser/json/dist/mjs/tokenizer.js
var TokenizerStates;
(function(TokenizerStates2) {
  TokenizerStates2[TokenizerStates2["START"] = 0] = "START";
  TokenizerStates2[TokenizerStates2["ENDED"] = 1] = "ENDED";
  TokenizerStates2[TokenizerStates2["ERROR"] = 2] = "ERROR";
  TokenizerStates2[TokenizerStates2["TRUE1"] = 3] = "TRUE1";
  TokenizerStates2[TokenizerStates2["TRUE2"] = 4] = "TRUE2";
  TokenizerStates2[TokenizerStates2["TRUE3"] = 5] = "TRUE3";
  TokenizerStates2[TokenizerStates2["FALSE1"] = 6] = "FALSE1";
  TokenizerStates2[TokenizerStates2["FALSE2"] = 7] = "FALSE2";
  TokenizerStates2[TokenizerStates2["FALSE3"] = 8] = "FALSE3";
  TokenizerStates2[TokenizerStates2["FALSE4"] = 9] = "FALSE4";
  TokenizerStates2[TokenizerStates2["NULL1"] = 10] = "NULL1";
  TokenizerStates2[TokenizerStates2["NULL2"] = 11] = "NULL2";
  TokenizerStates2[TokenizerStates2["NULL3"] = 12] = "NULL3";
  TokenizerStates2[TokenizerStates2["STRING_DEFAULT"] = 13] = "STRING_DEFAULT";
  TokenizerStates2[TokenizerStates2["STRING_AFTER_BACKSLASH"] = 14] = "STRING_AFTER_BACKSLASH";
  TokenizerStates2[TokenizerStates2["STRING_UNICODE_DIGIT_1"] = 15] = "STRING_UNICODE_DIGIT_1";
  TokenizerStates2[TokenizerStates2["STRING_UNICODE_DIGIT_2"] = 16] = "STRING_UNICODE_DIGIT_2";
  TokenizerStates2[TokenizerStates2["STRING_UNICODE_DIGIT_3"] = 17] = "STRING_UNICODE_DIGIT_3";
  TokenizerStates2[TokenizerStates2["STRING_UNICODE_DIGIT_4"] = 18] = "STRING_UNICODE_DIGIT_4";
  TokenizerStates2[TokenizerStates2["STRING_INCOMPLETE_CHAR"] = 19] = "STRING_INCOMPLETE_CHAR";
  TokenizerStates2[TokenizerStates2["NUMBER_AFTER_INITIAL_MINUS"] = 20] = "NUMBER_AFTER_INITIAL_MINUS";
  TokenizerStates2[TokenizerStates2["NUMBER_AFTER_INITIAL_ZERO"] = 21] = "NUMBER_AFTER_INITIAL_ZERO";
  TokenizerStates2[TokenizerStates2["NUMBER_AFTER_INITIAL_NON_ZERO"] = 22] = "NUMBER_AFTER_INITIAL_NON_ZERO";
  TokenizerStates2[TokenizerStates2["NUMBER_AFTER_FULL_STOP"] = 23] = "NUMBER_AFTER_FULL_STOP";
  TokenizerStates2[TokenizerStates2["NUMBER_AFTER_DECIMAL"] = 24] = "NUMBER_AFTER_DECIMAL";
  TokenizerStates2[TokenizerStates2["NUMBER_AFTER_E"] = 25] = "NUMBER_AFTER_E";
  TokenizerStates2[TokenizerStates2["NUMBER_AFTER_E_AND_SIGN"] = 26] = "NUMBER_AFTER_E_AND_SIGN";
  TokenizerStates2[TokenizerStates2["NUMBER_AFTER_E_AND_DIGIT"] = 27] = "NUMBER_AFTER_E_AND_DIGIT";
  TokenizerStates2[TokenizerStates2["SEPARATOR"] = 28] = "SEPARATOR";
  TokenizerStates2[TokenizerStates2["BOM_OR_START"] = 29] = "BOM_OR_START";
  TokenizerStates2[TokenizerStates2["BOM"] = 30] = "BOM";
})(TokenizerStates || (TokenizerStates = {}));
function TokenizerStateToString(tokenizerState) {
  return [
    "START",
    "ENDED",
    "ERROR",
    "TRUE1",
    "TRUE2",
    "TRUE3",
    "FALSE1",
    "FALSE2",
    "FALSE3",
    "FALSE4",
    "NULL1",
    "NULL2",
    "NULL3",
    "STRING_DEFAULT",
    "STRING_AFTER_BACKSLASH",
    "STRING_UNICODE_DIGIT_1",
    "STRING_UNICODE_DIGIT_2",
    "STRING_UNICODE_DIGIT_3",
    "STRING_UNICODE_DIGIT_4",
    "STRING_INCOMPLETE_CHAR",
    "NUMBER_AFTER_INITIAL_MINUS",
    "NUMBER_AFTER_INITIAL_ZERO",
    "NUMBER_AFTER_INITIAL_NON_ZERO",
    "NUMBER_AFTER_FULL_STOP",
    "NUMBER_AFTER_DECIMAL",
    "NUMBER_AFTER_E",
    "NUMBER_AFTER_E_AND_SIGN",
    "NUMBER_AFTER_E_AND_DIGIT",
    "SEPARATOR",
    "BOM_OR_START",
    "BOM"
  ][tokenizerState];
}
var defaultOpts = {
  stringBufferSize: 0,
  numberBufferSize: 0,
  separator: void 0,
  emitPartialTokens: false
};
var TokenizerError = class _TokenizerError extends Error {
  constructor(message) {
    super(message);
    Object.setPrototypeOf(this, _TokenizerError.prototype);
  }
};
var Tokenizer = class {
  constructor(opts) {
    this.state = TokenizerStates.BOM_OR_START;
    this.bomIndex = 0;
    this.separatorIndex = 0;
    this.escapedCharsByteLength = 0;
    this.bytes_remaining = 0;
    this.bytes_in_sequence = 0;
    this.char_split_buffer = new Uint8Array(4);
    this.encoder = new TextEncoder();
    this.offset = -1;
    opts = Object.assign(Object.assign({}, defaultOpts), opts);
    this.emitPartialTokens = opts.emitPartialTokens === true;
    this.bufferedString = opts.stringBufferSize && opts.stringBufferSize > 4 ? new BufferedString(opts.stringBufferSize) : new NonBufferedString();
    this.bufferedNumber = opts.numberBufferSize && opts.numberBufferSize > 0 ? new BufferedString(opts.numberBufferSize) : new NonBufferedString();
    this.separator = opts.separator;
    this.separatorBytes = opts.separator ? this.encoder.encode(opts.separator) : void 0;
  }
  get isEnded() {
    return this.state === TokenizerStates.ENDED;
  }
  write(input) {
    try {
      let buffer;
      if (input instanceof Uint8Array) {
        buffer = input;
      } else if (typeof input === "string") {
        buffer = this.encoder.encode(input);
      } else if (Array.isArray(input)) {
        buffer = Uint8Array.from(input);
      } else if (ArrayBuffer.isView(input)) {
        buffer = new Uint8Array(input.buffer, input.byteOffset, input.byteLength);
      } else {
        throw new TypeError("Unexpected type. The `write` function only accepts Arrays, TypedArrays and Strings.");
      }
      for (let i = 0; i < buffer.length; i += 1) {
        const n = buffer[i];
        switch (this.state) {
          // @ts-expect-error fall through case
          case TokenizerStates.BOM_OR_START:
            if (input instanceof Uint8Array && n === 239) {
              this.bom = [239, 187, 191];
              this.bomIndex += 1;
              this.state = TokenizerStates.BOM;
              continue;
            }
            if (input instanceof Uint16Array) {
              if (n === 254) {
                this.bom = [254, 255];
                this.bomIndex += 1;
                this.state = TokenizerStates.BOM;
                continue;
              }
              if (n === 255) {
                this.bom = [255, 254];
                this.bomIndex += 1;
                this.state = TokenizerStates.BOM;
                continue;
              }
            }
            if (input instanceof Uint32Array) {
              if (n === 0) {
                this.bom = [0, 0, 254, 255];
                this.bomIndex += 1;
                this.state = TokenizerStates.BOM;
                continue;
              }
              if (n === 255) {
                this.bom = [255, 254, 0, 0];
                this.bomIndex += 1;
                this.state = TokenizerStates.BOM;
                continue;
              }
            }
          // eslint-disable-next-line no-fallthrough
          case TokenizerStates.START:
            this.offset += 1;
            if (this.separatorBytes && n === this.separatorBytes[0]) {
              if (this.separatorBytes.length === 1) {
                this.state = TokenizerStates.START;
                this.onToken({
                  token: tokenType_default.SEPARATOR,
                  value: this.separator,
                  offset: this.offset + this.separatorBytes.length - 1
                });
                continue;
              }
              this.state = TokenizerStates.SEPARATOR;
              continue;
            }
            if (n === charset.SPACE || n === charset.NEWLINE || n === charset.CARRIAGE_RETURN || n === charset.TAB) {
              continue;
            }
            if (n === charset.LEFT_CURLY_BRACKET) {
              this.onToken({
                token: tokenType_default.LEFT_BRACE,
                value: "{",
                offset: this.offset
              });
              continue;
            }
            if (n === charset.RIGHT_CURLY_BRACKET) {
              this.onToken({
                token: tokenType_default.RIGHT_BRACE,
                value: "}",
                offset: this.offset
              });
              continue;
            }
            if (n === charset.LEFT_SQUARE_BRACKET) {
              this.onToken({
                token: tokenType_default.LEFT_BRACKET,
                value: "[",
                offset: this.offset
              });
              continue;
            }
            if (n === charset.RIGHT_SQUARE_BRACKET) {
              this.onToken({
                token: tokenType_default.RIGHT_BRACKET,
                value: "]",
                offset: this.offset
              });
              continue;
            }
            if (n === charset.COLON) {
              this.onToken({
                token: tokenType_default.COLON,
                value: ":",
                offset: this.offset
              });
              continue;
            }
            if (n === charset.COMMA) {
              this.onToken({
                token: tokenType_default.COMMA,
                value: ",",
                offset: this.offset
              });
              continue;
            }
            if (n === charset.LATIN_SMALL_LETTER_T) {
              this.state = TokenizerStates.TRUE1;
              continue;
            }
            if (n === charset.LATIN_SMALL_LETTER_F) {
              this.state = TokenizerStates.FALSE1;
              continue;
            }
            if (n === charset.LATIN_SMALL_LETTER_N) {
              this.state = TokenizerStates.NULL1;
              continue;
            }
            if (n === charset.QUOTATION_MARK) {
              this.bufferedString.reset();
              this.escapedCharsByteLength = 0;
              this.state = TokenizerStates.STRING_DEFAULT;
              continue;
            }
            if (n >= charset.DIGIT_ONE && n <= charset.DIGIT_NINE) {
              this.bufferedNumber.reset();
              this.bufferedNumber.appendChar(n);
              this.state = TokenizerStates.NUMBER_AFTER_INITIAL_NON_ZERO;
              continue;
            }
            if (n === charset.DIGIT_ZERO) {
              this.bufferedNumber.reset();
              this.bufferedNumber.appendChar(n);
              this.state = TokenizerStates.NUMBER_AFTER_INITIAL_ZERO;
              continue;
            }
            if (n === charset.HYPHEN_MINUS) {
              this.bufferedNumber.reset();
              this.bufferedNumber.appendChar(n);
              this.state = TokenizerStates.NUMBER_AFTER_INITIAL_MINUS;
              continue;
            }
            break;
          // STRING
          case TokenizerStates.STRING_DEFAULT:
            if (n === charset.QUOTATION_MARK) {
              const string = this.bufferedString.toString();
              this.state = TokenizerStates.START;
              this.onToken({
                token: tokenType_default.STRING,
                value: string,
                offset: this.offset
              });
              this.offset += this.escapedCharsByteLength + this.bufferedString.byteLength + 1;
              continue;
            }
            if (n === charset.REVERSE_SOLIDUS) {
              this.state = TokenizerStates.STRING_AFTER_BACKSLASH;
              continue;
            }
            if (n >= 128) {
              if (n >= 194 && n <= 223) {
                this.bytes_in_sequence = 2;
              } else if (n <= 239) {
                this.bytes_in_sequence = 3;
              } else {
                this.bytes_in_sequence = 4;
              }
              if (this.bytes_in_sequence <= buffer.length - i) {
                this.bufferedString.appendBuf(buffer, i, i + this.bytes_in_sequence);
                i += this.bytes_in_sequence - 1;
                continue;
              }
              this.bytes_remaining = i + this.bytes_in_sequence - buffer.length;
              this.char_split_buffer.set(buffer.subarray(i));
              i = buffer.length - 1;
              this.state = TokenizerStates.STRING_INCOMPLETE_CHAR;
              continue;
            }
            if (n >= charset.SPACE) {
              this.bufferedString.appendChar(n);
              continue;
            }
            break;
          case TokenizerStates.STRING_INCOMPLETE_CHAR:
            this.char_split_buffer.set(buffer.subarray(i, i + this.bytes_remaining), this.bytes_in_sequence - this.bytes_remaining);
            this.bufferedString.appendBuf(this.char_split_buffer, 0, this.bytes_in_sequence);
            i = this.bytes_remaining - 1;
            this.state = TokenizerStates.STRING_DEFAULT;
            continue;
          case TokenizerStates.STRING_AFTER_BACKSLASH:
            const controlChar = escapedSequences[n];
            if (controlChar) {
              this.bufferedString.appendChar(controlChar);
              this.escapedCharsByteLength += 1;
              this.state = TokenizerStates.STRING_DEFAULT;
              continue;
            }
            if (n === charset.LATIN_SMALL_LETTER_U) {
              this.unicode = "";
              this.state = TokenizerStates.STRING_UNICODE_DIGIT_1;
              continue;
            }
            break;
          case TokenizerStates.STRING_UNICODE_DIGIT_1:
          case TokenizerStates.STRING_UNICODE_DIGIT_2:
          case TokenizerStates.STRING_UNICODE_DIGIT_3:
            if (n >= charset.DIGIT_ZERO && n <= charset.DIGIT_NINE || n >= charset.LATIN_CAPITAL_LETTER_A && n <= charset.LATIN_CAPITAL_LETTER_F || n >= charset.LATIN_SMALL_LETTER_A && n <= charset.LATIN_SMALL_LETTER_F) {
              this.unicode += String.fromCharCode(n);
              this.state += 1;
              continue;
            }
            break;
          case TokenizerStates.STRING_UNICODE_DIGIT_4:
            if (n >= charset.DIGIT_ZERO && n <= charset.DIGIT_NINE || n >= charset.LATIN_CAPITAL_LETTER_A && n <= charset.LATIN_CAPITAL_LETTER_F || n >= charset.LATIN_SMALL_LETTER_A && n <= charset.LATIN_SMALL_LETTER_F) {
              const intVal = parseInt(this.unicode + String.fromCharCode(n), 16);
              let unicodeString;
              if (this.highSurrogate === void 0) {
                if (intVal >= 55296 && intVal <= 56319) {
                  this.highSurrogate = intVal;
                  this.state = TokenizerStates.STRING_DEFAULT;
                  continue;
                } else {
                  unicodeString = String.fromCharCode(intVal);
                }
              } else {
                if (intVal >= 56320 && intVal <= 57343) {
                  unicodeString = String.fromCharCode(this.highSurrogate, intVal);
                } else {
                  unicodeString = String.fromCharCode(this.highSurrogate);
                }
                this.highSurrogate = void 0;
              }
              const unicodeBuffer = this.encoder.encode(unicodeString);
              this.bufferedString.appendBuf(unicodeBuffer);
              this.escapedCharsByteLength += 6 - unicodeBuffer.byteLength;
              this.state = TokenizerStates.STRING_DEFAULT;
              continue;
            }
            break;
          // Number
          case TokenizerStates.NUMBER_AFTER_INITIAL_MINUS:
            if (n === charset.DIGIT_ZERO) {
              this.bufferedNumber.appendChar(n);
              this.state = TokenizerStates.NUMBER_AFTER_INITIAL_ZERO;
              continue;
            }
            if (n >= charset.DIGIT_ONE && n <= charset.DIGIT_NINE) {
              this.bufferedNumber.appendChar(n);
              this.state = TokenizerStates.NUMBER_AFTER_INITIAL_NON_ZERO;
              continue;
            }
            break;
          case TokenizerStates.NUMBER_AFTER_INITIAL_ZERO:
            if (n === charset.FULL_STOP) {
              this.bufferedNumber.appendChar(n);
              this.state = TokenizerStates.NUMBER_AFTER_FULL_STOP;
              continue;
            }
            if (n === charset.LATIN_SMALL_LETTER_E || n === charset.LATIN_CAPITAL_LETTER_E) {
              this.bufferedNumber.appendChar(n);
              this.state = TokenizerStates.NUMBER_AFTER_E;
              continue;
            }
            i -= 1;
            this.state = TokenizerStates.START;
            this.emitNumber();
            continue;
          case TokenizerStates.NUMBER_AFTER_INITIAL_NON_ZERO:
            if (n >= charset.DIGIT_ZERO && n <= charset.DIGIT_NINE) {
              this.bufferedNumber.appendChar(n);
              continue;
            }
            if (n === charset.FULL_STOP) {
              this.bufferedNumber.appendChar(n);
              this.state = TokenizerStates.NUMBER_AFTER_FULL_STOP;
              continue;
            }
            if (n === charset.LATIN_SMALL_LETTER_E || n === charset.LATIN_CAPITAL_LETTER_E) {
              this.bufferedNumber.appendChar(n);
              this.state = TokenizerStates.NUMBER_AFTER_E;
              continue;
            }
            i -= 1;
            this.state = TokenizerStates.START;
            this.emitNumber();
            continue;
          case TokenizerStates.NUMBER_AFTER_FULL_STOP:
            if (n >= charset.DIGIT_ZERO && n <= charset.DIGIT_NINE) {
              this.bufferedNumber.appendChar(n);
              this.state = TokenizerStates.NUMBER_AFTER_DECIMAL;
              continue;
            }
            break;
          case TokenizerStates.NUMBER_AFTER_DECIMAL:
            if (n >= charset.DIGIT_ZERO && n <= charset.DIGIT_NINE) {
              this.bufferedNumber.appendChar(n);
              continue;
            }
            if (n === charset.LATIN_SMALL_LETTER_E || n === charset.LATIN_CAPITAL_LETTER_E) {
              this.bufferedNumber.appendChar(n);
              this.state = TokenizerStates.NUMBER_AFTER_E;
              continue;
            }
            i -= 1;
            this.state = TokenizerStates.START;
            this.emitNumber();
            continue;
          // @ts-expect-error fall through case
          case TokenizerStates.NUMBER_AFTER_E:
            if (n === charset.PLUS_SIGN || n === charset.HYPHEN_MINUS) {
              this.bufferedNumber.appendChar(n);
              this.state = TokenizerStates.NUMBER_AFTER_E_AND_SIGN;
              continue;
            }
          // eslint-disable-next-line no-fallthrough
          case TokenizerStates.NUMBER_AFTER_E_AND_SIGN:
            if (n >= charset.DIGIT_ZERO && n <= charset.DIGIT_NINE) {
              this.bufferedNumber.appendChar(n);
              this.state = TokenizerStates.NUMBER_AFTER_E_AND_DIGIT;
              continue;
            }
            break;
          case TokenizerStates.NUMBER_AFTER_E_AND_DIGIT:
            if (n >= charset.DIGIT_ZERO && n <= charset.DIGIT_NINE) {
              this.bufferedNumber.appendChar(n);
              continue;
            }
            i -= 1;
            this.state = TokenizerStates.START;
            this.emitNumber();
            continue;
          // TRUE
          case TokenizerStates.TRUE1:
            if (n === charset.LATIN_SMALL_LETTER_R) {
              this.state = TokenizerStates.TRUE2;
              continue;
            }
            break;
          case TokenizerStates.TRUE2:
            if (n === charset.LATIN_SMALL_LETTER_U) {
              this.state = TokenizerStates.TRUE3;
              continue;
            }
            break;
          case TokenizerStates.TRUE3:
            if (n === charset.LATIN_SMALL_LETTER_E) {
              this.state = TokenizerStates.START;
              this.onToken({
                token: tokenType_default.TRUE,
                value: true,
                offset: this.offset
              });
              this.offset += 3;
              continue;
            }
            break;
          // FALSE
          case TokenizerStates.FALSE1:
            if (n === charset.LATIN_SMALL_LETTER_A) {
              this.state = TokenizerStates.FALSE2;
              continue;
            }
            break;
          case TokenizerStates.FALSE2:
            if (n === charset.LATIN_SMALL_LETTER_L) {
              this.state = TokenizerStates.FALSE3;
              continue;
            }
            break;
          case TokenizerStates.FALSE3:
            if (n === charset.LATIN_SMALL_LETTER_S) {
              this.state = TokenizerStates.FALSE4;
              continue;
            }
            break;
          case TokenizerStates.FALSE4:
            if (n === charset.LATIN_SMALL_LETTER_E) {
              this.state = TokenizerStates.START;
              this.onToken({
                token: tokenType_default.FALSE,
                value: false,
                offset: this.offset
              });
              this.offset += 4;
              continue;
            }
            break;
          // NULL
          case TokenizerStates.NULL1:
            if (n === charset.LATIN_SMALL_LETTER_U) {
              this.state = TokenizerStates.NULL2;
              continue;
            }
            break;
          case TokenizerStates.NULL2:
            if (n === charset.LATIN_SMALL_LETTER_L) {
              this.state = TokenizerStates.NULL3;
              continue;
            }
            break;
          case TokenizerStates.NULL3:
            if (n === charset.LATIN_SMALL_LETTER_L) {
              this.state = TokenizerStates.START;
              this.onToken({
                token: tokenType_default.NULL,
                value: null,
                offset: this.offset
              });
              this.offset += 3;
              continue;
            }
            break;
          case TokenizerStates.SEPARATOR:
            this.separatorIndex += 1;
            if (!this.separatorBytes || n !== this.separatorBytes[this.separatorIndex]) {
              break;
            }
            if (this.separatorIndex === this.separatorBytes.length - 1) {
              this.state = TokenizerStates.START;
              this.onToken({
                token: tokenType_default.SEPARATOR,
                value: this.separator,
                offset: this.offset + this.separatorIndex
              });
              this.separatorIndex = 0;
            }
            continue;
          // BOM support
          case TokenizerStates.BOM:
            if (n === this.bom[this.bomIndex]) {
              if (this.bomIndex === this.bom.length - 1) {
                this.state = TokenizerStates.START;
                this.bom = void 0;
                this.bomIndex = 0;
                continue;
              }
              this.bomIndex += 1;
              continue;
            }
            break;
          case TokenizerStates.ENDED:
            if (n === charset.SPACE || n === charset.NEWLINE || n === charset.CARRIAGE_RETURN || n === charset.TAB) {
              continue;
            }
        }
        throw new TokenizerError(`Unexpected "${String.fromCharCode(n)}" at position "${i}" in state ${TokenizerStateToString(this.state)}`);
      }
      if (this.emitPartialTokens) {
        switch (this.state) {
          case TokenizerStates.TRUE1:
          case TokenizerStates.TRUE2:
          case TokenizerStates.TRUE3:
            this.onToken({
              token: tokenType_default.TRUE,
              value: true,
              offset: this.offset,
              partial: true
            });
            break;
          case TokenizerStates.FALSE1:
          case TokenizerStates.FALSE2:
          case TokenizerStates.FALSE3:
          case TokenizerStates.FALSE4:
            this.onToken({
              token: tokenType_default.FALSE,
              value: false,
              offset: this.offset,
              partial: true
            });
            break;
          case TokenizerStates.NULL1:
          case TokenizerStates.NULL2:
          case TokenizerStates.NULL3:
            this.onToken({
              token: tokenType_default.NULL,
              value: null,
              offset: this.offset,
              partial: true
            });
            break;
          case TokenizerStates.STRING_DEFAULT: {
            const string = this.bufferedString.toString();
            this.onToken({
              token: tokenType_default.STRING,
              value: string,
              offset: this.offset,
              partial: true
            });
            break;
          }
          case TokenizerStates.NUMBER_AFTER_INITIAL_ZERO:
          case TokenizerStates.NUMBER_AFTER_INITIAL_NON_ZERO:
          case TokenizerStates.NUMBER_AFTER_DECIMAL:
          case TokenizerStates.NUMBER_AFTER_E_AND_DIGIT:
            try {
              this.onToken({
                token: tokenType_default.NUMBER,
                value: this.parseNumber(this.bufferedNumber.toString()),
                offset: this.offset,
                partial: true
              });
            } catch (_a) {
            }
        }
      }
    } catch (err) {
      this.error(err);
    }
  }
  emitNumber() {
    this.onToken({
      token: tokenType_default.NUMBER,
      value: this.parseNumber(this.bufferedNumber.toString()),
      offset: this.offset
    });
    this.offset += this.bufferedNumber.byteLength - 1;
  }
  parseNumber(numberStr) {
    return Number(numberStr);
  }
  error(err) {
    if (this.state !== TokenizerStates.ENDED) {
      this.state = TokenizerStates.ERROR;
    }
    this.onError(err);
  }
  end() {
    switch (this.state) {
      case TokenizerStates.NUMBER_AFTER_INITIAL_ZERO:
      case TokenizerStates.NUMBER_AFTER_INITIAL_NON_ZERO:
      case TokenizerStates.NUMBER_AFTER_DECIMAL:
      case TokenizerStates.NUMBER_AFTER_E_AND_DIGIT:
        this.state = TokenizerStates.ENDED;
        this.emitNumber();
        this.onEnd();
        break;
      case TokenizerStates.BOM_OR_START:
      case TokenizerStates.START:
      case TokenizerStates.ERROR:
      case TokenizerStates.SEPARATOR:
        this.state = TokenizerStates.ENDED;
        this.onEnd();
        break;
      default:
        this.error(new TokenizerError(`Tokenizer ended in the middle of a token (state: ${TokenizerStateToString(this.state)}). Either not all the data was received or the data was invalid.`));
    }
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onToken(parsedToken) {
    throw new TokenizerError(`Can't emit tokens before the "onToken" callback has been set up.`);
  }
  onError(err) {
    throw err;
  }
  onEnd() {
  }
};

// ../../node_modules/.pnpm/@streamparser+json@0.0.22/node_modules/@streamparser/json/dist/mjs/utils/types/stackElement.js
var TokenParserMode;
(function(TokenParserMode2) {
  TokenParserMode2[TokenParserMode2["OBJECT"] = 0] = "OBJECT";
  TokenParserMode2[TokenParserMode2["ARRAY"] = 1] = "ARRAY";
})(TokenParserMode || (TokenParserMode = {}));

// ../../node_modules/.pnpm/@streamparser+json@0.0.22/node_modules/@streamparser/json/dist/mjs/tokenparser.js
var TokenParserState;
(function(TokenParserState2) {
  TokenParserState2[TokenParserState2["VALUE"] = 0] = "VALUE";
  TokenParserState2[TokenParserState2["KEY"] = 1] = "KEY";
  TokenParserState2[TokenParserState2["COLON"] = 2] = "COLON";
  TokenParserState2[TokenParserState2["COMMA"] = 3] = "COMMA";
  TokenParserState2[TokenParserState2["ENDED"] = 4] = "ENDED";
  TokenParserState2[TokenParserState2["ERROR"] = 5] = "ERROR";
  TokenParserState2[TokenParserState2["SEPARATOR"] = 6] = "SEPARATOR";
})(TokenParserState || (TokenParserState = {}));
function TokenParserStateToString(state) {
  return ["VALUE", "KEY", "COLON", "COMMA", "ENDED", "ERROR", "SEPARATOR"][state];
}
var defaultOpts2 = {
  paths: void 0,
  keepStack: true,
  separator: void 0,
  emitPartialValues: false
};
var TokenParserError = class _TokenParserError extends Error {
  constructor(message) {
    super(message);
    Object.setPrototypeOf(this, _TokenParserError.prototype);
  }
};
var TokenParser = class {
  constructor(opts) {
    this.state = TokenParserState.VALUE;
    this.mode = void 0;
    this.key = void 0;
    this.value = void 0;
    this.stack = [];
    opts = Object.assign(Object.assign({}, defaultOpts2), opts);
    if (opts.paths) {
      this.paths = opts.paths.map((path) => {
        if (path === void 0 || path === "$*")
          return void 0;
        if (!path.startsWith("$"))
          throw new TokenParserError(`Invalid selector "${path}". Should start with "$".`);
        const pathParts = path.split(".").slice(1);
        if (pathParts.includes(""))
          throw new TokenParserError(`Invalid selector "${path}". ".." syntax not supported.`);
        return pathParts;
      });
    }
    this.keepStack = opts.keepStack || false;
    this.separator = opts.separator;
    if (!opts.emitPartialValues) {
      this.emitPartial = () => {
      };
    }
  }
  shouldEmit() {
    if (!this.paths)
      return true;
    return this.paths.some((path) => {
      var _a;
      if (path === void 0)
        return true;
      if (path.length !== this.stack.length)
        return false;
      for (let i = 0; i < path.length - 1; i++) {
        const selector2 = path[i];
        const key = this.stack[i + 1].key;
        if (selector2 === "*")
          continue;
        if (selector2 !== (key === null || key === void 0 ? void 0 : key.toString()))
          return false;
      }
      const selector = path[path.length - 1];
      if (selector === "*")
        return true;
      return selector === ((_a = this.key) === null || _a === void 0 ? void 0 : _a.toString());
    });
  }
  push() {
    this.stack.push({
      key: this.key,
      value: this.value,
      mode: this.mode,
      emit: this.shouldEmit()
    });
  }
  pop() {
    const value = this.value;
    let emit;
    ({
      key: this.key,
      value: this.value,
      mode: this.mode,
      emit
    } = this.stack.pop());
    this.state = this.mode !== void 0 ? TokenParserState.COMMA : TokenParserState.VALUE;
    this.emit(value, emit);
  }
  emit(value, emit) {
    if (!this.keepStack && this.value && this.stack.every((item) => !item.emit)) {
      delete this.value[this.key];
    }
    if (emit) {
      this.onValue({
        value,
        key: this.key,
        parent: this.value,
        stack: this.stack
      });
    }
    if (this.stack.length === 0) {
      if (this.separator) {
        this.state = TokenParserState.SEPARATOR;
      } else if (this.separator === void 0) {
        this.end();
      }
    }
  }
  emitPartial(value) {
    if (!this.shouldEmit())
      return;
    if (this.state === TokenParserState.KEY) {
      this.onValue({
        value: void 0,
        key: value,
        parent: this.value,
        stack: this.stack,
        partial: true
      });
      return;
    }
    this.onValue({
      value,
      key: this.key,
      parent: this.value,
      stack: this.stack,
      partial: true
    });
  }
  get isEnded() {
    return this.state === TokenParserState.ENDED;
  }
  write({ token, value, partial }) {
    try {
      if (partial) {
        this.emitPartial(value);
        return;
      }
      if (this.state === TokenParserState.VALUE) {
        if (token === tokenType_default.STRING || token === tokenType_default.NUMBER || token === tokenType_default.TRUE || token === tokenType_default.FALSE || token === tokenType_default.NULL) {
          if (this.mode === TokenParserMode.OBJECT) {
            this.value[this.key] = value;
            this.state = TokenParserState.COMMA;
          } else if (this.mode === TokenParserMode.ARRAY) {
            this.value.push(value);
            this.state = TokenParserState.COMMA;
          }
          this.emit(value, this.shouldEmit());
          return;
        }
        if (token === tokenType_default.LEFT_BRACE) {
          this.push();
          if (this.mode === TokenParserMode.OBJECT) {
            this.value = this.value[this.key] = {};
          } else if (this.mode === TokenParserMode.ARRAY) {
            const val = {};
            this.value.push(val);
            this.value = val;
          } else {
            this.value = {};
          }
          this.mode = TokenParserMode.OBJECT;
          this.state = TokenParserState.KEY;
          this.key = void 0;
          this.emitPartial();
          return;
        }
        if (token === tokenType_default.LEFT_BRACKET) {
          this.push();
          if (this.mode === TokenParserMode.OBJECT) {
            this.value = this.value[this.key] = [];
          } else if (this.mode === TokenParserMode.ARRAY) {
            const val = [];
            this.value.push(val);
            this.value = val;
          } else {
            this.value = [];
          }
          this.mode = TokenParserMode.ARRAY;
          this.state = TokenParserState.VALUE;
          this.key = 0;
          this.emitPartial();
          return;
        }
        if (this.mode === TokenParserMode.ARRAY && token === tokenType_default.RIGHT_BRACKET && this.value.length === 0) {
          this.pop();
          return;
        }
      }
      if (this.state === TokenParserState.KEY) {
        if (token === tokenType_default.STRING) {
          this.key = value;
          this.state = TokenParserState.COLON;
          this.emitPartial();
          return;
        }
        if (token === tokenType_default.RIGHT_BRACE && Object.keys(this.value).length === 0) {
          this.pop();
          return;
        }
      }
      if (this.state === TokenParserState.COLON) {
        if (token === tokenType_default.COLON) {
          this.state = TokenParserState.VALUE;
          return;
        }
      }
      if (this.state === TokenParserState.COMMA) {
        if (token === tokenType_default.COMMA) {
          if (this.mode === TokenParserMode.ARRAY) {
            this.state = TokenParserState.VALUE;
            this.key += 1;
            return;
          }
          if (this.mode === TokenParserMode.OBJECT) {
            this.state = TokenParserState.KEY;
            return;
          }
        }
        if (token === tokenType_default.RIGHT_BRACE && this.mode === TokenParserMode.OBJECT || token === tokenType_default.RIGHT_BRACKET && this.mode === TokenParserMode.ARRAY) {
          this.pop();
          return;
        }
      }
      if (this.state === TokenParserState.SEPARATOR) {
        if (token === tokenType_default.SEPARATOR && value === this.separator) {
          this.state = TokenParserState.VALUE;
          return;
        }
      }
      if (token === tokenType_default.SEPARATOR && this.state !== TokenParserState.SEPARATOR && Array.from(value).map((n) => n.charCodeAt(0)).every((n) => n === charset.SPACE || n === charset.NEWLINE || n === charset.CARRIAGE_RETURN || n === charset.TAB)) {
        return;
      }
      throw new TokenParserError(`Unexpected ${tokenType_default[token]} (${JSON.stringify(value)}) in state ${TokenParserStateToString(this.state)}`);
    } catch (err) {
      this.error(err);
    }
  }
  error(err) {
    if (this.state !== TokenParserState.ENDED) {
      this.state = TokenParserState.ERROR;
    }
    this.onError(err);
  }
  end() {
    if (this.state !== TokenParserState.VALUE && this.state !== TokenParserState.SEPARATOR || this.stack.length > 0) {
      this.error(new Error(`Parser ended in mid-parsing (state: ${TokenParserStateToString(this.state)}). Either not all the data was received or the data was invalid.`));
    } else {
      this.state = TokenParserState.ENDED;
      this.onEnd();
    }
  }
  /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
  onValue(parsedElementInfo) {
    throw new TokenParserError(`Can't emit data before the "onValue" callback has been set up.`);
  }
  onError(err) {
    throw err;
  }
  onEnd() {
  }
};

// ../../node_modules/.pnpm/@streamparser+json@0.0.22/node_modules/@streamparser/json/dist/mjs/jsonparser.js
var JSONParser = class {
  constructor(opts = {}) {
    this.tokenizer = new Tokenizer(opts);
    this.tokenParser = new TokenParser(opts);
    this.tokenizer.onToken = this.tokenParser.write.bind(this.tokenParser);
    this.tokenizer.onEnd = () => {
      if (!this.tokenParser.isEnded)
        this.tokenParser.end();
    };
    this.tokenParser.onError = this.tokenizer.error.bind(this.tokenizer);
    this.tokenParser.onEnd = () => {
      if (!this.tokenizer.isEnded)
        this.tokenizer.end();
    };
  }
  get isEnded() {
    return this.tokenizer.isEnded && this.tokenParser.isEnded;
  }
  write(input) {
    this.tokenizer.write(input);
  }
  end() {
    this.tokenizer.end();
  }
  set onToken(cb) {
    this.tokenizer.onToken = (parsedToken) => {
      cb(parsedToken);
      this.tokenParser.write(parsedToken);
    };
  }
  set onValue(cb) {
    this.tokenParser.onValue = cb;
  }
  set onError(cb) {
    this.tokenizer.onError = cb;
  }
  set onEnd(cb) {
    this.tokenParser.onEnd = () => {
      if (!this.tokenizer.isEnded)
        this.tokenizer.end();
      cb.call(this.tokenParser);
    };
  }
};

// ../openapi-transforms/src/streaming/json-stream.ts
function astToSelector(ast) {
  const parts = [];
  for (const node of ast) {
    if (node.kind === "root") continue;
    if (node.kind === "field") parts.push(node.name);
    else if (node.kind === "wildcard") parts.push("*");
    else if (node.kind === "index") parts.push(String(node.index));
  }
  return parts;
}
async function streamExtract(body, ast) {
  const selector = astToSelector(ast);
  const isArray = isArrayPath(ast);
  const collected = [];
  let whole;
  let matched = false;
  const parser = new JSONParser({
    paths: selector.length === 0 ? ["$"] : ["$." + selector.join(".")],
    keepStack: false
  });
  parser.onValue = ({ value }) => {
    matched = true;
    if (selector.length === 0) whole = value;
    else if (isArray) collected.push(value);
    else whole = value;
  };
  const reader = body.getReader();
  try {
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      parser.write(value);
    }
    if (!parser.isEnded) {
      parser.end();
    }
  } catch (cause) {
    throw cause instanceof Error ? cause : new Error(String(cause));
  }
  if (!matched && !isArray) {
    throw new Error(`path did not match any value: ${selector.join(".") || "$"}`);
  }
  return isArray ? collected : whole;
}

// ../openapi-transforms/src/codecs/schema.ts
function defineSchema(vendor, validate) {
  return {
    "~standard": {
      version: 1,
      vendor,
      validate
    }
  };
}
function isRecord(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

// ../openapi-transforms/src/codecs/response-json.ts
var emptySchema = defineSchema("openapi-transforms", (value) => ({
  value: value ?? {}
}));
var jsonResponseCodec = {
  name: "json",
  contentTypes: ["application/json"],
  configSchema: emptySchema,
  async decode(response) {
    const text = await response.text();
    try {
      return text.length ? JSON.parse(text) : void 0;
    } catch (cause) {
      throw new CodecError("json", "decode", `JSON parse failed: ${cause.message}`, cause);
    }
  }
};

// ../openapi-transforms/src/codecs/response-json-unwrap.ts
var configSchema = defineSchema("openapi-transforms", (value) => {
  if (!isRecord(value) || typeof value.path !== "string") {
    return { issues: [{ message: "config.path must be a string" }] };
  }
  return { value: { path: value.path } };
});
var jsonUnwrapCodec = {
  name: "json-unwrap",
  contentTypes: ["application/json"],
  configSchema,
  async decode(response, config) {
    const ast = parsePath(config.path);
    if (!response.body) {
      throw new CodecError("json-unwrap", "decode", "response has no body");
    }
    try {
      return await streamExtract(response.body, ast);
    } catch (cause) {
      const err = cause;
      const stage = /^path did not match/.test(err.message) || /expected (object|array)/.test(err.message) ? "transform" : "decode";
      throw new CodecError("json-unwrap", stage, err.message, err);
    }
  }
};

// ../openapi-transforms/src/codecs/response-json-compose.ts
var configSchema2 = defineSchema("openapi-transforms", (v) => {
  if (!isRecord(v)) return { issues: [{ message: "config must be an object" }] };
  if (typeof v.base !== "string") return { issues: [{ message: "config.base must be a string" }] };
  if (v.merge !== void 0 && !isRecord(v.merge)) {
    return { issues: [{ message: "config.merge must be an object" }] };
  }
  const merge = v.merge;
  return { value: { base: v.base, merge } };
});
var jsonComposeCodec = {
  name: "json-compose",
  contentTypes: ["application/json"],
  configSchema: configSchema2,
  async decode(response, config) {
    let doc;
    try {
      doc = await response.json();
    } catch (cause) {
      throw new CodecError("json-compose", "decode", cause.message, cause);
    }
    try {
      const base = extract(parsePath(config.base), doc);
      if (!isRecord(base)) {
        throw new CodecError("json-compose", "transform", `base path did not yield object: ${config.base}`);
      }
      const out = { ...base };
      for (const [key, path] of Object.entries(config.merge ?? {})) {
        out[key] = extract(parsePath(path), doc);
      }
      return out;
    } catch (cause) {
      if (cause instanceof CodecError) throw cause;
      throw new CodecError("json-compose", "transform", cause.message, cause);
    }
  }
};

// ../openapi-transforms/src/codecs/response-text.ts
var schema = defineSchema("openapi-transforms", (value) => ({
  value: value ?? {}
}));
var textResponseCodec = {
  name: "text",
  contentTypes: ["text/plain", "text/*"],
  configSchema: schema,
  async decode(response) {
    try {
      return await response.text();
    } catch (cause) {
      throw new CodecError("text", "decode", cause.message, cause);
    }
  }
};

// ../openapi-transforms/src/codecs/response-binary.ts
var schema2 = defineSchema("openapi-transforms", (v) => {
  if (v == null) return { value: {} };
  if (!isRecord(v)) return { issues: [{ message: "config must be an object" }] };
  const as = v.as;
  if (as === void 0) return { value: {} };
  if (as === "arraybuffer" || as === "blob") return { value: { as } };
  return { issues: [{ message: "config.as must be 'arraybuffer' or 'blob'" }] };
});
var binaryResponseCodec = {
  name: "binary",
  contentTypes: ["application/octet-stream", "*/*"],
  configSchema: schema2,
  async decode(response, config) {
    try {
      return config.as === "blob" ? await response.blob() : await response.arrayBuffer();
    } catch (cause) {
      throw new CodecError("binary", "decode", cause.message, cause);
    }
  }
};

// ../openapi-transforms/src/codecs/request-json.ts
var schema3 = defineSchema("openapi-transforms", (v) => ({ value: v ?? {} }));
var jsonRequestCodec = {
  name: "json",
  contentType: "application/json",
  configSchema: schema3,
  encode(input) {
    return { body: JSON.stringify(input), headers: { "content-type": "application/json" } };
  }
};

// ../openapi-transforms/src/codecs/request-multipart.ts
var schema4 = defineSchema("openapi-transforms", (v) => {
  if (!isRecord(v) || typeof v.fileField !== "string" || typeof v.filenameFrom !== "string") {
    return { issues: [{ message: "config.fileField and config.filenameFrom must be strings" }] };
  }
  return { value: { fileField: v.fileField, filenameFrom: v.filenameFrom } };
});
var multipartRequestCodec = {
  name: "multipart",
  contentType: "multipart/form-data",
  configSchema: schema4,
  encode(input, config) {
    const filePart = input[config.fileField];
    const hasFile = filePart instanceof Blob;
    if (!hasFile && !("url" in input)) {
      throw new Error(`multipart: missing file field '${config.fileField}' or not a Blob`);
    }
    const filenameRaw = extract(parsePath(config.filenameFrom), input);
    const filename = typeof filenameRaw === "string" ? filenameRaw : void 0;
    const fd = new FormData();
    if (hasFile) {
      fd.append(config.fileField, filePart, filename);
    }
    for (const [k, v] of Object.entries(input)) {
      if (k === config.fileField) continue;
      if (v == null) continue;
      fd.append(k, typeof v === "string" ? v : JSON.stringify(v));
    }
    return { body: fd };
  }
};

// ../openapi-transforms/src/codecs/request-raw.ts
var schema5 = defineSchema("openapi-transforms", (value) => ({
  value: value ?? {}
}));
var rawRequestCodec = {
  name: "raw",
  contentType: void 0,
  configSchema: schema5,
  encode(input) {
    return { body: input };
  }
};

// ../openapi-transforms/src/codecs/index.ts
function registerBuiltinResponseCodecs(registry) {
  registry.registerResponse(jsonResponseCodec);
  registry.registerResponse(jsonUnwrapCodec);
  registry.registerResponse(jsonComposeCodec);
  registry.registerResponse(textResponseCodec);
  registry.registerResponse(binaryResponseCodec);
}
function registerBuiltinRequestCodecs(registry) {
  registry.registerRequest(jsonRequestCodec);
  registry.registerRequest(multipartRequestCodec);
  registry.registerRequest(rawRequestCodec);
}
function registerAllBuiltins(registry) {
  registerBuiltinResponseCodecs(registry);
  registerBuiltinRequestCodecs(registry);
}

// ../openapi-transforms/src/execute.ts
async function executeOperation(spec, fetchFn = fetch, options = {}) {
  const ctx = { operationId: spec.operationId, method: spec.method, url: spec.url };
  const maxErrorBodySize = options.maxErrorBodySize ?? 64 * 1024;
  const extractor = options.errorMessageExtractor ?? defaultErrorMessage;
  let body;
  let headers = { ...spec.headers ?? {} };
  if (spec.requestCodec) {
    try {
      const codec2 = spec.registry.resolveRequest(spec.requestCodec);
      const enc = codec2.encode(spec.requestInput, spec.requestCodecConfig);
      body = enc.body;
      headers = { ...headers, ...enc.headers ?? {} };
    } catch (cause) {
      throw new ClientError(`request encode failed: ${cause.message}`, ctx, cause);
    }
  }
  let response;
  try {
    response = await fetchFn(spec.url, { method: spec.method, headers, body, signal: spec.signal });
  } catch (cause) {
    throw new NetworkError(cause.message || "network error", ctx, cause);
  }
  if (!response.ok) {
    const captured = await captureErrorBody(response.clone(), maxErrorBodySize);
    const message = extractor(captured.parsed ?? captured.text, ctx) ?? `HTTP ${response.status} ${response.statusText}`;
    throw new HttpError(message, ctx, {
      status: response.status,
      statusText: response.statusText,
      headers: response.headers,
      requestId: response.headers.get("x-request-id") ?? void 0,
      body: captured,
      retryable: isRetryable("http", response.status)
    });
  }
  const codec = spec.registry.resolveResponse(spec.responseCodec);
  try {
    return await codec.decode(response, spec.responseCodecConfig, ctx);
  } catch (cause) {
    if (cause instanceof CodecError) {
      const base = {
        status: response.status,
        statusText: response.statusText,
        headers: response.headers,
        codecName: cause.codecName,
        cause: cause.cause ?? cause
      };
      if (cause.stage === "decode") {
        throw new DecodeError(cause.message, ctx, base);
      }
      throw new TransformError(cause.message, ctx, { ...base });
    }
    throw new OpenAPIError("decode", cause.message, ctx, cause);
  }
}

// ../openapi-transforms/src/transforms/case.ts
function snakeKey(key, overrides) {
  if (overrides && key in overrides) return overrides[key];
  return key.replace(/([A-Z])/g, (c) => `_${c.toLowerCase()}`);
}
function camelKey(key, overrides) {
  if (overrides && key in overrides) return overrides[key];
  return key.replace(/_([a-z])/g, (_, c) => c.toUpperCase());
}
function isPlainObject(v) {
  if (v === null || typeof v !== "object") return false;
  const proto = Object.getPrototypeOf(v);
  return proto === Object.prototype || proto === null;
}
function toSnakeCase(value, overrides) {
  if (Array.isArray(value)) return value.map((v) => toSnakeCase(v, overrides));
  if (isPlainObject(value)) {
    const out = {};
    for (const [k, v] of Object.entries(value)) {
      out[snakeKey(k, overrides)] = toSnakeCase(v, overrides);
    }
    return out;
  }
  return value;
}
function toCamelCase(value, overrides) {
  if (Array.isArray(value)) return value.map((v) => toCamelCase(v, overrides));
  if (isPlainObject(value)) {
    const out = {};
    for (const [k, v] of Object.entries(value)) {
      out[camelKey(k, overrides)] = toCamelCase(v, overrides);
    }
    return out;
  }
  return value;
}

// ../core/src/error.ts
var BrowserStackError = class _BrowserStackError extends Error {
  constructor(message, context) {
    super(message);
    __publicField(this, "code");
    __publicField(this, "context");
    this.name = "BrowserStackError";
    this.context = context;
    if (context instanceof Error) {
      this.name = context.name;
      this.stack = context.stack;
      if ("code" in context && typeof context.code === "string") {
        this.code = context.code;
      }
    }
    Object.setPrototypeOf(this, _BrowserStackError.prototype);
  }
};

// ../core/src/auth.ts
function buildBasicAuthHeader(username, accessKey) {
  return `Basic ${btoa(`${username}:${accessKey}`)}`;
}

// ../core/src/pkginfo.ts
function makePkgInfo(name, version) {
  const libVersion = [name, version].filter(Boolean).join("/");
  const envVersion = ["node", versions.node].filter(Boolean).join("/");
  const userAgent = [libVersion, envVersion].filter(Boolean).join(" ");
  return {
    name,
    version,
    userAgent
  };
}

// ../core/src/api-client.ts
function nonEmpty(value) {
  return value?.trim?.()?.length ? value.trim() : void 0;
}
function resolveAccessKey(optionsAccessKey) {
  return nonEmpty(optionsAccessKey) ?? nonEmpty(env.BROWSERSTACK_ACCESS_KEY) ?? nonEmpty(env.BROWSERSTACK_KEY);
}
function resolveUsername(optionsUsername) {
  return nonEmpty(optionsUsername) ?? nonEmpty(env.BROWSERSTACK_USERNAME);
}
var APIClient = class {
  constructor(options, baseUrl, cloudBaseUrl, pkgName, pkgVersion) {
    __publicField(this, "baseUrls");
    __publicField(this, "authHeader");
    __publicField(this, "userAgent");
    __publicField(this, "fetchFn");
    __publicField(this, "registry");
    __publicField(this, "executeOptions");
    const username = resolveUsername(options.username);
    if (options.usernameOptional !== true && (typeof username !== "string" || !username.trim().length)) {
      throw new BrowserStackError("Missing options.username");
    }
    const accessKey = resolveAccessKey(options.accessKey);
    if (typeof accessKey !== "string" || !accessKey.trim().length) {
      throw new BrowserStackError("Missing options.accessKey");
    }
    const pkginfo = makePkgInfo(pkgName, pkgVersion);
    this.baseUrls = {
      sdk: options.baseUrl ?? baseUrl,
      sdkCloud: cloudBaseUrl
    };
    this.authHeader = username ? buildBasicAuthHeader(username, accessKey) : void 0;
    this.userAgent = pkginfo.userAgent;
    this.fetchFn = options.fetchFn ?? fetch;
    this.registry = new CodecRegistry();
    registerAllBuiltins(this.registry);
    for (const c of options.codecs ?? []) {
      if ("contentTypes" in c) this.registry.registerResponse(c);
      else this.registry.registerRequest(c);
    }
    this.executeOptions = {
      maxErrorBodySize: options.maxErrorBodySize,
      errorMessageExtractor: options.errorMessageExtractor
    };
  }
  /**
   * @internal
   */
  async execute(spec) {
    const base = this.baseUrls[spec.baseUrl ?? "sdk"];
    let interpolated = spec.path;
    for (const [k, v] of Object.entries(spec.params?.path ?? {})) {
      interpolated = interpolated.replace(`{${k}}`, encodeURIComponent(String(v)));
    }
    const qs = new URLSearchParams();
    for (const [k, v] of Object.entries(spec.params?.query ?? {})) {
      if (v == null) continue;
      if (Array.isArray(v)) for (const item of v) qs.append(k, String(item));
      else qs.append(k, String(v));
    }
    const query = qs.toString();
    const url = `${base}${interpolated}${query ? "?" + query : ""}`;
    const headers = { "User-Agent": this.userAgent };
    if (this.authHeader) headers["Authorization"] = this.authHeader;
    const result = await executeOperation(
      {
        operationId: spec.operationId,
        method: spec.method,
        url,
        headers,
        registry: this.registry,
        requestCodec: spec.requestCodec,
        requestCodecConfig: spec.requestCodecConfig,
        requestInput: spec.requestInput,
        responseCodec: spec.responseCodec,
        responseCodecConfig: spec.responseCodecConfig,
        signal: spec.signal
      },
      this.fetchFn,
      this.executeOptions
    );
    return result;
  }
};

// src/utils.ts
function ensureAccessKeyExists(accessKey) {
  const resolved = resolveAccessKey(accessKey);
  if (typeof resolved !== "string" || !resolved.trim().length) {
    throw new BrowserStackError("Missing accessKey");
  }
  return resolved.trim();
}
function ensureUsernameExists(data) {
  const username = resolveUsername(data);
  if (typeof username !== "string" || !username.trim().length) {
    throw new BrowserStackError("Missing username");
  }
  return username.trim();
}

// ../openapi/generated/test-reporting.client.ts
var GeneratedTestReportingClient = class extends APIClient {
  getTestReportingProjects(options) {
    return this.execute({
      path: "/projects",
      params: void 0,
      requestCodec: "json",
      requestCodecConfig: {},
      responseCodec: "json",
      responseCodecConfig: {},
      baseUrl: "sdk",
      operationId: "getTestReportingProjects",
      method: "GET",
      signal: options?.signal
    }).then((r) => toCamelCase(r, void 0));
  }
  getTestReportingBuilds(options) {
    return this.execute({
      path: "/builds",
      params: void 0,
      requestCodec: "json",
      requestCodecConfig: {},
      responseCodec: "json",
      responseCodecConfig: {},
      baseUrl: "sdk",
      operationId: "getTestReportingBuilds",
      method: "GET",
      signal: options?.signal
    }).then((r) => toCamelCase(r, void 0));
  }
  getTestReportingBuild(buildId, options) {
    return this.execute({
      path: "/builds/{buildId}",
      params: { path: { buildId } },
      requestCodec: "json",
      requestCodecConfig: {},
      responseCodec: "json",
      responseCodecConfig: {},
      baseUrl: "sdk",
      operationId: "getTestReportingBuild",
      method: "GET",
      signal: options?.signal
    }).then((r) => toCamelCase(r, void 0));
  }
  updateTestReportingBuild(buildId, body, options) {
    return this.execute({
      path: "/builds/{buildId}",
      params: { path: { buildId } },
      requestInput: toSnakeCase(body, void 0),
      requestCodec: "json",
      requestCodecConfig: {},
      responseCodec: "json",
      responseCodecConfig: {},
      baseUrl: "sdk",
      operationId: "updateTestReportingBuild",
      method: "PATCH",
      signal: options?.signal
    }).then((r) => toCamelCase(r, void 0));
  }
  getTestReportingTestRuns(buildId, options) {
    return this.execute({
      path: "/builds/{buildId}/testRuns",
      params: { path: { buildId } },
      requestCodec: "json",
      requestCodecConfig: {},
      responseCodec: "json",
      responseCodecConfig: {},
      baseUrl: "sdk",
      operationId: "getTestReportingTestRuns",
      method: "GET",
      signal: options?.signal
    }).then((r) => toCamelCase(r, void 0));
  }
  uploadTestReportingJUnitReport(body, options) {
    return this.execute({
      path: "/junit/upload",
      params: void 0,
      requestInput: toSnakeCase(body, void 0),
      requestCodec: "multipart",
      requestCodecConfig: { "fileField": "file", "filenameFrom": "$.file_name" },
      responseCodec: "json",
      responseCodecConfig: {},
      baseUrl: "sdk",
      operationId: "uploadTestReportingJUnitReport",
      method: "POST",
      signal: options?.signal
    }).then((r) => toCamelCase(r, void 0));
  }
};

// ../test-reporting/src/index.ts
var TestReportingClient = class extends GeneratedTestReportingClient {
  constructor(options) {
    super(
      options ?? {},
      options?.baseUrl ?? "https://api-automation.browserstack.com/ext/v1",
      "https://api-automation.browserstack.com/ext/v1",
      "@browserstack-client/test-reporting",
      "6.0.0"
    );
  }
};

// src/browserstack-test-reporting.ts
var import_promises = require("fs/promises");
var import_node_path = require("path");
var import_node_process = __toESM(require("process"), 1);
var import_meta = {};
async function handleProjects(action, _args, opts, logger) {
  const client = new TestReportingClient(opts);
  switch (action) {
    case "list": {
      const projects = await client.getTestReportingProjects();
      const list = Array.isArray(projects) ? projects : [];
      list.forEach((p) => logger.info(p.id ?? "", p.name ?? ""));
      break;
    }
    default:
      throw new BrowserStackError(
        `Invalid projects action: ${action} (valid: list)`
      );
  }
}
async function handleBuilds(action, args, opts, logger) {
  const client = new TestReportingClient(opts);
  switch (action) {
    case "list": {
      const builds = await client.getTestReportingBuilds();
      const list = Array.isArray(builds) ? builds : [];
      list.forEach((b) => logger.info(b.id ?? "", b.name ?? "", b.status ?? ""));
      break;
    }
    case "get": {
      if (!args[0]) throw new BrowserStackError("Missing <buildId>");
      const build = await client.getTestReportingBuild(args[0]);
      logger.info(JSON.stringify(build, null, 2));
      break;
    }
    case "update": {
      if (!args[0]) throw new BrowserStackError("Missing <buildId>");
      if (!args[1]) throw new BrowserStackError("Missing <tags> (comma separated)");
      const tags = args[1].split(",").map((t) => t.trim());
      await client.updateTestReportingBuild(args[0], { tags });
      logger.info(`Build ${args[0]} updated.`);
      break;
    }
    case "test-runs": {
      if (!args[0]) throw new BrowserStackError("Missing <buildId>");
      const runs = await client.getTestReportingTestRuns(args[0]);
      logger.info(JSON.stringify(runs, null, 2));
      break;
    }
    default:
      throw new BrowserStackError(
        `Invalid builds action: ${action} (valid: list, get, update, test-runs)`
      );
  }
}
async function handleUpload(action, args, opts, logger) {
  const client = new TestReportingClient(opts);
  switch (action) {
    case "junit": {
      if (!args[0]) throw new BrowserStackError("Missing <file-path>");
      const filePath = (0, import_node_path.resolve)(args[0]);
      const data = await (0, import_promises.readFile)(filePath);
      const filename = (0, import_node_path.basename)(filePath);
      await client.uploadTestReportingJUnitReport({
        file: new Blob([data]),
        fileName: filename
      });
      logger.info(`Report ${filename} uploaded.`);
      break;
    }
    default:
      throw new BrowserStackError(
        `Invalid upload action: ${action} (valid: junit)`
      );
  }
}
async function main(inputArgs = import_node_process.default.argv.slice(2), logger = globalThis.console) {
  try {
    ensureAccessKeyExists(void 0);
    ensureUsernameExists(void 0);
    const args = inputArgs.map((a) => a.trim());
    const resource = args[0]?.toLowerCase();
    const action = args[1]?.toLowerCase();
    const rest = args.slice(2);
    const opts = {};
    switch (resource) {
      case "projects":
        if (!action) throw new BrowserStackError("Missing action for projects");
        await handleProjects(action, rest, opts, logger);
        break;
      case "builds":
        if (!action) throw new BrowserStackError("Missing action for builds");
        await handleBuilds(action, rest, opts, logger);
        break;
      case "upload":
        if (!action) throw new BrowserStackError("Missing action for upload");
        await handleUpload(action, rest, opts, logger);
        break;
      default:
        import_node_process.default.stderr.write(
          `Invalid or missing resource: ${resource ?? "(none)"} (valid: projects, builds, upload)
`
        );
        import_node_process.default.exit(1);
    }
  } catch (err) {
    logger.error(err instanceof Error ? err.message : String(err));
    import_node_process.default.exit(1);
  }
}
var isMain = import_meta.url === `file://${import_node_process.default.argv[1]}` || import_meta.url === `file://${(0, import_node_path.resolve)(import_node_process.default.argv[1])}` || true;
if (isMain) {
  main();
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  main
});
