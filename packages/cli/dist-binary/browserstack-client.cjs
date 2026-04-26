#!/usr/bin/env node
"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __typeError = (msg) => {
  throw TypeError(msg);
};
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
var __accessCheck = (obj, member, msg) => member.has(obj) || __typeError("Cannot " + msg);
var __privateGet = (obj, member, getter) => (__accessCheck(obj, member, "read from private field"), getter ? getter.call(obj) : member.get(obj));
var __privateAdd = (obj, member, value) => member.has(obj) ? __typeError("Cannot add the same private member more than once") : member instanceof WeakSet ? member.add(obj) : member.set(obj, value);
var __privateSet = (obj, member, value, setter) => (__accessCheck(obj, member, "write to private field"), setter ? setter.call(obj, value) : member.set(obj, value), value);
var __privateMethod = (obj, member, method) => (__accessCheck(obj, member, "access private method"), method);

// src/browserstack-client.ts
var browserstack_client_exports = {};
__export(browserstack_client_exports, {
  main: () => main8
});
module.exports = __toCommonJS(browserstack_client_exports);
var import_node_process10 = __toESM(require("process"), 1);

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
  appendBuf(buf, start2 = 0, end = buf.length) {
    this.strings.push(this.decoder.decode(buf.subarray(start2, end)));
    this.byteLength += end - start2;
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
  appendBuf(buf, start2 = 0, end = buf.length) {
    const size = end - start2;
    if (this.bufferOffset + size > this.buffer.length)
      this.flushStringBuffer();
    this.buffer.set(buf.subarray(start2, end), this.bufferOffset);
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
            } catch (_a2) {
            }
        }
      }
    } catch (err2) {
      this.error(err2);
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
  error(err2) {
    if (this.state !== TokenizerStates.ENDED) {
      this.state = TokenizerStates.ERROR;
    }
    this.onError(err2);
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
  onError(err2) {
    throw err2;
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
      this.paths = opts.paths.map((path2) => {
        if (path2 === void 0 || path2 === "$*")
          return void 0;
        if (!path2.startsWith("$"))
          throw new TokenParserError(`Invalid selector "${path2}". Should start with "$".`);
        const pathParts = path2.split(".").slice(1);
        if (pathParts.includes(""))
          throw new TokenParserError(`Invalid selector "${path2}". ".." syntax not supported.`);
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
    return this.paths.some((path2) => {
      var _a2;
      if (path2 === void 0)
        return true;
      if (path2.length !== this.stack.length)
        return false;
      for (let i = 0; i < path2.length - 1; i++) {
        const selector2 = path2[i];
        const key = this.stack[i + 1].key;
        if (selector2 === "*")
          continue;
        if (selector2 !== (key === null || key === void 0 ? void 0 : key.toString()))
          return false;
      }
      const selector = path2[path2.length - 1];
      if (selector === "*")
        return true;
      return selector === ((_a2 = this.key) === null || _a2 === void 0 ? void 0 : _a2.toString());
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
    } catch (err2) {
      this.error(err2);
    }
  }
  error(err2) {
    if (this.state !== TokenParserState.ENDED) {
      this.state = TokenParserState.ERROR;
    }
    this.onError(err2);
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
  onError(err2) {
    throw err2;
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
      const err2 = cause;
      const stage = /^path did not match/.test(err2.message) || /expected (object|array)/.test(err2.message) ? "transform" : "decode";
      throw new CodecError("json-unwrap", stage, err2.message, err2);
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
      for (const [key, path2] of Object.entries(config.merge ?? {})) {
        out[key] = extract(parsePath(path2), doc);
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
    const fd2 = new FormData();
    if (hasFile) {
      fd2.append(config.fileField, filePart, filename);
    }
    for (const [k, v] of Object.entries(input)) {
      if (k === config.fileField) continue;
      if (v == null) continue;
      fd2.append(k, typeof v === "string" ? v : JSON.stringify(v));
    }
    return { body: fd2 };
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

// ../local-testing-binary/src/write-file-atomic.ts
var import_node_buffer = require("buffer");
var import_node_crypto = require("crypto");
var import_node_fs = __toESM(require("fs"), 1);
var import_node_path = __toESM(require("path"), 1);
var import_node_process = __toESM(require("process"), 1);
var import_node_util = require("util");

// ../../node_modules/.pnpm/signal-exit@4.1.0/node_modules/signal-exit/dist/mjs/signals.js
var signals = [];
signals.push("SIGHUP", "SIGINT", "SIGTERM");
if (process.platform !== "win32") {
  signals.push(
    "SIGALRM",
    "SIGABRT",
    "SIGVTALRM",
    "SIGXCPU",
    "SIGXFSZ",
    "SIGUSR2",
    "SIGTRAP",
    "SIGSYS",
    "SIGQUIT",
    "SIGIOT"
    // should detect profiler and enable/disable accordingly.
    // see #21
    // 'SIGPROF'
  );
}
if (process.platform === "linux") {
  signals.push("SIGIO", "SIGPOLL", "SIGPWR", "SIGSTKFLT");
}

// ../../node_modules/.pnpm/signal-exit@4.1.0/node_modules/signal-exit/dist/mjs/index.js
var processOk = (process13) => !!process13 && typeof process13 === "object" && typeof process13.removeListener === "function" && typeof process13.emit === "function" && typeof process13.reallyExit === "function" && typeof process13.listeners === "function" && typeof process13.kill === "function" && typeof process13.pid === "number" && typeof process13.on === "function";
var kExitEmitter = /* @__PURE__ */ Symbol.for("signal-exit emitter");
var global = globalThis;
var ObjectDefineProperty = Object.defineProperty.bind(Object);
var Emitter = class {
  constructor() {
    __publicField(this, "emitted", {
      afterExit: false,
      exit: false
    });
    __publicField(this, "listeners", {
      afterExit: [],
      exit: []
    });
    __publicField(this, "count", 0);
    __publicField(this, "id", Math.random());
    if (global[kExitEmitter]) {
      return global[kExitEmitter];
    }
    ObjectDefineProperty(global, kExitEmitter, {
      value: this,
      writable: false,
      enumerable: false,
      configurable: false
    });
  }
  on(ev, fn) {
    this.listeners[ev].push(fn);
  }
  removeListener(ev, fn) {
    const list2 = this.listeners[ev];
    const i = list2.indexOf(fn);
    if (i === -1) {
      return;
    }
    if (i === 0 && list2.length === 1) {
      list2.length = 0;
    } else {
      list2.splice(i, 1);
    }
  }
  emit(ev, code, signal) {
    if (this.emitted[ev]) {
      return false;
    }
    this.emitted[ev] = true;
    let ret = false;
    for (const fn of this.listeners[ev]) {
      ret = fn(code, signal) === true || ret;
    }
    if (ev === "exit") {
      ret = this.emit("afterExit", code, signal) || ret;
    }
    return ret;
  }
};
var SignalExitBase = class {
};
var signalExitWrap = (handler) => {
  return {
    onExit(cb, opts) {
      return handler.onExit(cb, opts);
    },
    load() {
      return handler.load();
    },
    unload() {
      return handler.unload();
    }
  };
};
var SignalExitFallback = class extends SignalExitBase {
  onExit() {
    return () => {
    };
  }
  load() {
  }
  unload() {
  }
};
var _hupSig, _emitter, _process, _originalProcessEmit, _originalProcessReallyExit, _sigListeners, _loaded, _SignalExit_instances, processReallyExit_fn, processEmit_fn;
var SignalExit = class extends SignalExitBase {
  constructor(process13) {
    super();
    __privateAdd(this, _SignalExit_instances);
    // "SIGHUP" throws an `ENOSYS` error on Windows,
    // so use a supported signal instead
    /* c8 ignore start */
    __privateAdd(this, _hupSig, process2.platform === "win32" ? "SIGINT" : "SIGHUP");
    /* c8 ignore stop */
    __privateAdd(this, _emitter, new Emitter());
    __privateAdd(this, _process);
    __privateAdd(this, _originalProcessEmit);
    __privateAdd(this, _originalProcessReallyExit);
    __privateAdd(this, _sigListeners, {});
    __privateAdd(this, _loaded, false);
    __privateSet(this, _process, process13);
    __privateSet(this, _sigListeners, {});
    for (const sig of signals) {
      __privateGet(this, _sigListeners)[sig] = () => {
        const listeners = __privateGet(this, _process).listeners(sig);
        let { count } = __privateGet(this, _emitter);
        const p = process13;
        if (typeof p.__signal_exit_emitter__ === "object" && typeof p.__signal_exit_emitter__.count === "number") {
          count += p.__signal_exit_emitter__.count;
        }
        if (listeners.length === count) {
          this.unload();
          const ret = __privateGet(this, _emitter).emit("exit", null, sig);
          const s = sig === "SIGHUP" ? __privateGet(this, _hupSig) : sig;
          if (!ret)
            process13.kill(process13.pid, s);
        }
      };
    }
    __privateSet(this, _originalProcessReallyExit, process13.reallyExit);
    __privateSet(this, _originalProcessEmit, process13.emit);
  }
  onExit(cb, opts) {
    if (!processOk(__privateGet(this, _process))) {
      return () => {
      };
    }
    if (__privateGet(this, _loaded) === false) {
      this.load();
    }
    const ev = opts?.alwaysLast ? "afterExit" : "exit";
    __privateGet(this, _emitter).on(ev, cb);
    return () => {
      __privateGet(this, _emitter).removeListener(ev, cb);
      if (__privateGet(this, _emitter).listeners["exit"].length === 0 && __privateGet(this, _emitter).listeners["afterExit"].length === 0) {
        this.unload();
      }
    };
  }
  load() {
    if (__privateGet(this, _loaded)) {
      return;
    }
    __privateSet(this, _loaded, true);
    __privateGet(this, _emitter).count += 1;
    for (const sig of signals) {
      try {
        const fn = __privateGet(this, _sigListeners)[sig];
        if (fn)
          __privateGet(this, _process).on(sig, fn);
      } catch (_) {
      }
    }
    __privateGet(this, _process).emit = (ev, ...a) => {
      return __privateMethod(this, _SignalExit_instances, processEmit_fn).call(this, ev, ...a);
    };
    __privateGet(this, _process).reallyExit = (code) => {
      return __privateMethod(this, _SignalExit_instances, processReallyExit_fn).call(this, code);
    };
  }
  unload() {
    if (!__privateGet(this, _loaded)) {
      return;
    }
    __privateSet(this, _loaded, false);
    signals.forEach((sig) => {
      const listener = __privateGet(this, _sigListeners)[sig];
      if (!listener) {
        throw new Error("Listener not defined for signal: " + sig);
      }
      try {
        __privateGet(this, _process).removeListener(sig, listener);
      } catch (_) {
      }
    });
    __privateGet(this, _process).emit = __privateGet(this, _originalProcessEmit);
    __privateGet(this, _process).reallyExit = __privateGet(this, _originalProcessReallyExit);
    __privateGet(this, _emitter).count -= 1;
  }
};
_hupSig = new WeakMap();
_emitter = new WeakMap();
_process = new WeakMap();
_originalProcessEmit = new WeakMap();
_originalProcessReallyExit = new WeakMap();
_sigListeners = new WeakMap();
_loaded = new WeakMap();
_SignalExit_instances = new WeakSet();
processReallyExit_fn = function(code) {
  if (!processOk(__privateGet(this, _process))) {
    return 0;
  }
  __privateGet(this, _process).exitCode = code || 0;
  __privateGet(this, _emitter).emit("exit", __privateGet(this, _process).exitCode, null);
  return __privateGet(this, _originalProcessReallyExit).call(__privateGet(this, _process), __privateGet(this, _process).exitCode);
};
processEmit_fn = function(ev, ...args) {
  const og = __privateGet(this, _originalProcessEmit);
  if (ev === "exit" && processOk(__privateGet(this, _process))) {
    if (typeof args[0] === "number") {
      __privateGet(this, _process).exitCode = args[0];
    }
    const ret = og.call(__privateGet(this, _process), ev, ...args);
    __privateGet(this, _emitter).emit("exit", __privateGet(this, _process).exitCode, null);
    return ret;
  } else {
    return og.call(__privateGet(this, _process), ev, ...args);
  }
};
var process2 = globalThis.process;
var {
  /**
   * Called when the process is exiting, whether via signal, explicit
   * exit, or running out of stuff to do.
   *
   * If the global process object is not suitable for instrumentation,
   * then this will be a no-op.
   *
   * Returns a function that may be used to unload signal-exit.
   */
  onExit,
  /**
   * Load the listeners.  Likely you never need to call this, unless
   * doing a rather deep integration with signal-exit functionality.
   * Mostly exposed for the benefit of testing.
   *
   * @internal
   */
  load,
  /**
   * Unload the listeners.  Likely you never need to call this, unless
   * doing a rather deep integration with signal-exit functionality.
   * Mostly exposed for the benefit of testing.
   *
   * @internal
   */
  unload
} = signalExitWrap(processOk(process2) ? new SignalExit(process2) : new SignalExitFallback());

// ../local-testing-binary/src/write-file-atomic.ts
var activeFiles = {};
function getTmpname(filename) {
  return filename + "." + (0, import_node_crypto.randomBytes)(6).toString("hex");
}
function cleanupOnExit(tmpfile) {
  return () => {
    const path2 = typeof tmpfile === "function" ? tmpfile() : tmpfile;
    if (!path2) return;
    try {
      import_node_fs.default.unlinkSync(path2);
    } catch {
    }
  };
}
function serializeActiveFile(absoluteName) {
  return new Promise((resolve6) => {
    if (!activeFiles[absoluteName]) {
      activeFiles[absoluteName] = [];
    }
    activeFiles[absoluteName].push(resolve6);
    if (activeFiles[absoluteName].length === 1) {
      resolve6();
    }
  });
}
function isChownErrOk(err2) {
  const errCode = typeof err2 === "object" && err2 && "code" in err2 ? err2.code : void 0;
  if (errCode === "ENOSYS") {
    return true;
  }
  const nonroot = !import_node_process.default.getuid || import_node_process.default.getuid() !== 0;
  if (nonroot) {
    if (errCode === "EINVAL" || errCode === "EPERM") {
      return true;
    }
  }
  return false;
}
async function writeFileAtomic(filename, data, options = {}) {
  if (typeof options === "string") {
    options = { encoding: options };
  }
  let fd2;
  let tmpfile;
  const removeOnExitHandler = onExit(cleanupOnExit(() => tmpfile));
  const absoluteName = import_node_path.default.resolve(filename);
  try {
    await serializeActiveFile(absoluteName);
    const truename = await (0, import_node_util.promisify)(import_node_fs.default.realpath)(filename).catch(
      () => filename
    );
    tmpfile = getTmpname(truename);
    if (!options.mode || !options.chown) {
      const stats = await (0, import_node_util.promisify)(import_node_fs.default.stat)(truename).catch(
        () => {
        }
      );
      if (stats) {
        if (options.mode == null) {
          options.mode = stats.mode;
        }
        if (options.chown == null && import_node_process.default.getuid) {
          options.chown = { uid: stats.uid, gid: stats.gid };
        }
      }
    }
    fd2 = await (0, import_node_util.promisify)(import_node_fs.default.open)(tmpfile, "w", options.mode);
    if (options.tmpfileCreated) {
      await options.tmpfileCreated(tmpfile);
    }
    if (import_node_buffer.Buffer.isBuffer(data)) {
      await (0, import_node_util.promisify)(import_node_fs.default.write)(fd2, data, 0, data.length, 0);
    } else if (data != null) {
      await (0, import_node_util.promisify)(import_node_fs.default.write)(
        fd2,
        String(data),
        0,
        options.encoding || "utf8"
      );
    }
    if (options.fsync !== false) {
      await (0, import_node_util.promisify)(import_node_fs.default.fsync)(fd2);
    }
    await (0, import_node_util.promisify)(import_node_fs.default.close)(fd2);
    fd2 = void 0;
    if (options.chown) {
      await (0, import_node_util.promisify)(import_node_fs.default.chown)(
        tmpfile,
        options.chown.uid,
        options.chown.gid
      ).catch((err2) => {
        if (!isChownErrOk(err2)) {
          throw err2;
        }
      });
    }
    if (options.mode) {
      await (0, import_node_util.promisify)(import_node_fs.default.chmod)(tmpfile, options.mode).catch((err2) => {
        if (!isChownErrOk(err2)) {
          throw err2;
        }
      });
    }
    await (0, import_node_util.promisify)(import_node_fs.default.rename)(tmpfile, truename);
  } finally {
    if (fd2) {
      await (0, import_node_util.promisify)(import_node_fs.default.close)(fd2).catch(
        /* istanbul ignore next */
        () => {
        }
      );
    }
    removeOnExitHandler();
    if (tmpfile) {
      await (0, import_node_util.promisify)(import_node_fs.default.unlink)(tmpfile).catch(() => {
      });
    }
    activeFiles[absoluteName].shift();
    if (activeFiles[absoluteName].length > 0) {
      activeFiles[absoluteName][0]();
    } else {
      delete activeFiles[absoluteName];
    }
  }
}

// ../local-testing-binary/src/fs-utils.ts
var import_node_buffer2 = require("buffer");
var import_node_child_process = require("child_process");
var import_promises = require("fs/promises");
var import_node_path2 = require("path");
var import_node_process2 = __toESM(require("process"), 1);
async function binaryPath(binHome, filename = "BrowserStackLocal") {
  const binDirPath = await ensureDirExists(binHome);
  const osArch = await currentOSArch();
  const binFilename = osArch === "win32" ? `${filename}.exe` : filename;
  const binFilePath = (0, import_node_path2.join)(binDirPath, binFilename);
  if (!await fileExists(binFilePath, import_promises.constants.R_OK | import_promises.constants.X_OK)) {
    throw new BrowserStackError(`Missing or inaccessible file: ${binFilePath}`);
  }
  return binFilePath;
}
async function fileExists(filePath, fileFlags = import_promises.constants.R_OK) {
  if (typeof filePath !== "string" || !filePath.trim().length) {
    return false;
  }
  const fileStat = await (0, import_promises.lstat)(filePath).catch(
    (err2) => err2.code === "ENOENT" ? null : err2
  );
  const flags = fileFlags & 448;
  if (!fileStat || !fileStat.isFile() || (fileStat.mode & flags) !== 0) {
    return false;
  }
  return true;
}
async function dirExists(dirPath, dirFlags = import_promises.constants.R_OK) {
  if (typeof dirPath !== "string" || !dirPath.trim().length) {
    return false;
  }
  const dirStat = await (0, import_promises.lstat)(dirPath).catch(
    (err2) => err2.code === "ENOENT" ? null : err2
  );
  const flags = dirFlags & 448;
  if (!dirStat || !dirStat.isDirectory() || (dirStat.mode & flags) !== 0) {
    return false;
  }
  return true;
}
async function ensureDirExists(binHome, dirMode = 493, dirFlags) {
  try {
    const dirPath = (0, import_node_path2.resolve)(binHome);
    const dirStat = await (0, import_promises.lstat)(dirPath).catch(async (err2) => {
      if (err2.code === "ENOENT") {
        await (0, import_promises.mkdir)(dirPath, { recursive: true, mode: dirMode });
        return (0, import_promises.lstat)(dirPath);
      }
      throw err2;
    });
    const flags = (dirFlags ?? import_promises.constants.R_OK | import_promises.constants.W_OK) & 448;
    if (dirStat && (dirStat.mode & flags) !== 0) {
      await (0, import_promises.chmod)(dirPath, dirMode);
    }
    return dirPath;
  } catch (err2) {
    if (err2 instanceof Error) {
      throw new BrowserStackError(
        `Missing or inaccessible directory: ${binHome}`,
        err2
      );
    }
    throw err2;
  }
}
async function currentOSArch() {
  if (["x64", "ia32"].includes(currentArch)) {
    switch (currentPlatform) {
      case "darwin":
        if (currentArch === "x64") {
          return "darwin-x64";
        }
        break;
      case "win32":
      case "cygwin":
        return "win32";
      case "linux":
        if (currentArch === "ia32") {
          return "linux-ia32";
        }
        try {
          if ((0, import_node_child_process.spawnSync)("ldd", ["--version"]).stderr.toString("utf8").indexOf("musl") !== -1) {
            return "alpine";
          }
        } catch {
        }
        return "linux-x64";
    }
  }
  throw new BrowserStackError(
    `Unsupported platform/arch: ${currentPlatform}/${currentArch}`
  );
}
async function saveFile(dirPath, filename, content, fileMode) {
  const filePath = (0, import_node_path2.join)((0, import_node_path2.resolve)(dirPath), filename);
  try {
    await writeFileAtomic(filePath, import_node_buffer2.Buffer.from(content), { mode: fileMode });
    return filePath;
  } catch (err2) {
    try {
      if ((await (0, import_promises.lstat)(filePath)).isFile()) {
        await (0, import_promises.unlink)(filePath);
      }
    } catch {
    }
    throw err2;
  }
}

// ../openapi/generated/local-testing.client.ts
var GeneratedLocalTestingClient = class extends APIClient {
  getLocalBinaryInstances(options) {
    return this.execute({
      path: "/local/v1/list",
      params: void 0,
      requestCodec: "json",
      requestCodecConfig: {},
      responseCodec: "json",
      responseCodecConfig: {},
      baseUrl: "sdk",
      operationId: "getLocalBinaryInstances",
      method: "GET",
      signal: options?.signal
    }).then((r) => toCamelCase(r, void 0));
  }
  getLocalBinaryInstance(localInstanceId, options) {
    return this.execute({
      path: "/local/v1/{localInstanceId}",
      params: { path: { localInstanceId } },
      requestCodec: "json",
      requestCodecConfig: {},
      responseCodec: "json",
      responseCodecConfig: {},
      baseUrl: "sdk",
      operationId: "getLocalBinaryInstance",
      method: "GET",
      signal: options?.signal
    }).then((r) => toCamelCase(r, void 0));
  }
  disconnectLocalBinaryInstance(localInstanceId, options) {
    return this.execute({
      path: "/local/v1/{localInstanceId}",
      params: { path: { localInstanceId } },
      requestCodec: "json",
      requestCodecConfig: {},
      responseCodec: "json",
      responseCodecConfig: {},
      baseUrl: "sdk",
      operationId: "disconnectLocalBinaryInstance",
      method: "DELETE",
      signal: options?.signal
    }).then((r) => toCamelCase(r, void 0));
  }
};

// ../../node_modules/.pnpm/fflate@0.8.2/node_modules/fflate/esm/index.mjs
var import_module = require("module");
var require2 = (0, import_module.createRequire)("/");
var Worker;
try {
  Worker = require2("worker_threads").Worker;
} catch (e) {
}
var u8 = Uint8Array;
var u16 = Uint16Array;
var i32 = Int32Array;
var fleb = new u8([
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  1,
  1,
  1,
  1,
  2,
  2,
  2,
  2,
  3,
  3,
  3,
  3,
  4,
  4,
  4,
  4,
  5,
  5,
  5,
  5,
  0,
  /* unused */
  0,
  0,
  /* impossible */
  0
]);
var fdeb = new u8([
  0,
  0,
  0,
  0,
  1,
  1,
  2,
  2,
  3,
  3,
  4,
  4,
  5,
  5,
  6,
  6,
  7,
  7,
  8,
  8,
  9,
  9,
  10,
  10,
  11,
  11,
  12,
  12,
  13,
  13,
  /* unused */
  0,
  0
]);
var clim = new u8([16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15]);
var freb = function(eb, start2) {
  var b = new u16(31);
  for (var i = 0; i < 31; ++i) {
    b[i] = start2 += 1 << eb[i - 1];
  }
  var r = new i32(b[30]);
  for (var i = 1; i < 30; ++i) {
    for (var j = b[i]; j < b[i + 1]; ++j) {
      r[j] = j - b[i] << 5 | i;
    }
  }
  return { b, r };
};
var _a = freb(fleb, 2);
var fl = _a.b;
var revfl = _a.r;
fl[28] = 258, revfl[258] = 28;
var _b = freb(fdeb, 0);
var fd = _b.b;
var revfd = _b.r;
var rev = new u16(32768);
for (i = 0; i < 32768; ++i) {
  x = (i & 43690) >> 1 | (i & 21845) << 1;
  x = (x & 52428) >> 2 | (x & 13107) << 2;
  x = (x & 61680) >> 4 | (x & 3855) << 4;
  rev[i] = ((x & 65280) >> 8 | (x & 255) << 8) >> 1;
}
var x;
var i;
var hMap = (function(cd, mb, r) {
  var s = cd.length;
  var i = 0;
  var l = new u16(mb);
  for (; i < s; ++i) {
    if (cd[i])
      ++l[cd[i] - 1];
  }
  var le = new u16(mb);
  for (i = 1; i < mb; ++i) {
    le[i] = le[i - 1] + l[i - 1] << 1;
  }
  var co;
  if (r) {
    co = new u16(1 << mb);
    var rvb = 15 - mb;
    for (i = 0; i < s; ++i) {
      if (cd[i]) {
        var sv = i << 4 | cd[i];
        var r_1 = mb - cd[i];
        var v = le[cd[i] - 1]++ << r_1;
        for (var m = v | (1 << r_1) - 1; v <= m; ++v) {
          co[rev[v] >> rvb] = sv;
        }
      }
    }
  } else {
    co = new u16(s);
    for (i = 0; i < s; ++i) {
      if (cd[i]) {
        co[i] = rev[le[cd[i] - 1]++] >> 15 - cd[i];
      }
    }
  }
  return co;
});
var flt = new u8(288);
for (i = 0; i < 144; ++i)
  flt[i] = 8;
var i;
for (i = 144; i < 256; ++i)
  flt[i] = 9;
var i;
for (i = 256; i < 280; ++i)
  flt[i] = 7;
var i;
for (i = 280; i < 288; ++i)
  flt[i] = 8;
var i;
var fdt = new u8(32);
for (i = 0; i < 32; ++i)
  fdt[i] = 5;
var i;
var flrm = /* @__PURE__ */ hMap(flt, 9, 1);
var fdrm = /* @__PURE__ */ hMap(fdt, 5, 1);
var max = function(a) {
  var m = a[0];
  for (var i = 1; i < a.length; ++i) {
    if (a[i] > m)
      m = a[i];
  }
  return m;
};
var bits = function(d, p, m) {
  var o = p / 8 | 0;
  return (d[o] | d[o + 1] << 8) >> (p & 7) & m;
};
var bits16 = function(d, p) {
  var o = p / 8 | 0;
  return (d[o] | d[o + 1] << 8 | d[o + 2] << 16) >> (p & 7);
};
var shft = function(p) {
  return (p + 7) / 8 | 0;
};
var slc = function(v, s, e) {
  if (s == null || s < 0)
    s = 0;
  if (e == null || e > v.length)
    e = v.length;
  return new u8(v.subarray(s, e));
};
var ec = [
  "unexpected EOF",
  "invalid block type",
  "invalid length/literal",
  "invalid distance",
  "stream finished",
  "no stream handler",
  ,
  "no callback",
  "invalid UTF-8 data",
  "extra field too long",
  "date not in range 1980-2099",
  "filename too long",
  "stream finishing",
  "invalid zip data"
  // determined by unknown compression method
];
var err = function(ind, msg, nt) {
  var e = new Error(msg || ec[ind]);
  e.code = ind;
  if (Error.captureStackTrace)
    Error.captureStackTrace(e, err);
  if (!nt)
    throw e;
  return e;
};
var inflt = function(dat, st, buf, dict) {
  var sl = dat.length, dl = dict ? dict.length : 0;
  if (!sl || st.f && !st.l)
    return buf || new u8(0);
  var noBuf = !buf;
  var resize = noBuf || st.i != 2;
  var noSt = st.i;
  if (noBuf)
    buf = new u8(sl * 3);
  var cbuf = function(l2) {
    var bl = buf.length;
    if (l2 > bl) {
      var nbuf = new u8(Math.max(bl * 2, l2));
      nbuf.set(buf);
      buf = nbuf;
    }
  };
  var final = st.f || 0, pos = st.p || 0, bt = st.b || 0, lm = st.l, dm = st.d, lbt = st.m, dbt = st.n;
  var tbts = sl * 8;
  do {
    if (!lm) {
      final = bits(dat, pos, 1);
      var type = bits(dat, pos + 1, 3);
      pos += 3;
      if (!type) {
        var s = shft(pos) + 4, l = dat[s - 4] | dat[s - 3] << 8, t = s + l;
        if (t > sl) {
          if (noSt)
            err(0);
          break;
        }
        if (resize)
          cbuf(bt + l);
        buf.set(dat.subarray(s, t), bt);
        st.b = bt += l, st.p = pos = t * 8, st.f = final;
        continue;
      } else if (type == 1)
        lm = flrm, dm = fdrm, lbt = 9, dbt = 5;
      else if (type == 2) {
        var hLit = bits(dat, pos, 31) + 257, hcLen = bits(dat, pos + 10, 15) + 4;
        var tl = hLit + bits(dat, pos + 5, 31) + 1;
        pos += 14;
        var ldt = new u8(tl);
        var clt = new u8(19);
        for (var i = 0; i < hcLen; ++i) {
          clt[clim[i]] = bits(dat, pos + i * 3, 7);
        }
        pos += hcLen * 3;
        var clb = max(clt), clbmsk = (1 << clb) - 1;
        var clm = hMap(clt, clb, 1);
        for (var i = 0; i < tl; ) {
          var r = clm[bits(dat, pos, clbmsk)];
          pos += r & 15;
          var s = r >> 4;
          if (s < 16) {
            ldt[i++] = s;
          } else {
            var c = 0, n = 0;
            if (s == 16)
              n = 3 + bits(dat, pos, 3), pos += 2, c = ldt[i - 1];
            else if (s == 17)
              n = 3 + bits(dat, pos, 7), pos += 3;
            else if (s == 18)
              n = 11 + bits(dat, pos, 127), pos += 7;
            while (n--)
              ldt[i++] = c;
          }
        }
        var lt = ldt.subarray(0, hLit), dt = ldt.subarray(hLit);
        lbt = max(lt);
        dbt = max(dt);
        lm = hMap(lt, lbt, 1);
        dm = hMap(dt, dbt, 1);
      } else
        err(1);
      if (pos > tbts) {
        if (noSt)
          err(0);
        break;
      }
    }
    if (resize)
      cbuf(bt + 131072);
    var lms = (1 << lbt) - 1, dms = (1 << dbt) - 1;
    var lpos = pos;
    for (; ; lpos = pos) {
      var c = lm[bits16(dat, pos) & lms], sym = c >> 4;
      pos += c & 15;
      if (pos > tbts) {
        if (noSt)
          err(0);
        break;
      }
      if (!c)
        err(2);
      if (sym < 256)
        buf[bt++] = sym;
      else if (sym == 256) {
        lpos = pos, lm = null;
        break;
      } else {
        var add = sym - 254;
        if (sym > 264) {
          var i = sym - 257, b = fleb[i];
          add = bits(dat, pos, (1 << b) - 1) + fl[i];
          pos += b;
        }
        var d = dm[bits16(dat, pos) & dms], dsym = d >> 4;
        if (!d)
          err(3);
        pos += d & 15;
        var dt = fd[dsym];
        if (dsym > 3) {
          var b = fdeb[dsym];
          dt += bits16(dat, pos) & (1 << b) - 1, pos += b;
        }
        if (pos > tbts) {
          if (noSt)
            err(0);
          break;
        }
        if (resize)
          cbuf(bt + 131072);
        var end = bt + add;
        if (bt < dt) {
          var shift = dl - dt, dend = Math.min(dt, end);
          if (shift + bt < 0)
            err(3);
          for (; bt < dend; ++bt)
            buf[bt] = dict[shift + bt];
        }
        for (; bt < end; ++bt)
          buf[bt] = buf[bt - dt];
      }
    }
    st.l = lm, st.p = lpos, st.b = bt, st.f = final;
    if (lm)
      final = 1, st.m = lbt, st.d = dm, st.n = dbt;
  } while (!final);
  return bt != buf.length && noBuf ? slc(buf, 0, bt) : buf.subarray(0, bt);
};
var et = /* @__PURE__ */ new u8(0);
var b2 = function(d, b) {
  return d[b] | d[b + 1] << 8;
};
var b4 = function(d, b) {
  return (d[b] | d[b + 1] << 8 | d[b + 2] << 16 | d[b + 3] << 24) >>> 0;
};
var b8 = function(d, b) {
  return b4(d, b) + b4(d, b + 4) * 4294967296;
};
function inflateSync(data, opts) {
  return inflt(data, { i: 2 }, opts && opts.out, opts && opts.dictionary);
}
var td = typeof TextDecoder != "undefined" && /* @__PURE__ */ new TextDecoder();
var tds = 0;
try {
  td.decode(et, { stream: true });
  tds = 1;
} catch (e) {
}
var dutf8 = function(d) {
  for (var r = "", i = 0; ; ) {
    var c = d[i++];
    var eb = (c > 127) + (c > 223) + (c > 239);
    if (i + eb > d.length)
      return { s: r, r: slc(d, i - 1) };
    if (!eb)
      r += String.fromCharCode(c);
    else if (eb == 3) {
      c = ((c & 15) << 18 | (d[i++] & 63) << 12 | (d[i++] & 63) << 6 | d[i++] & 63) - 65536, r += String.fromCharCode(55296 | c >> 10, 56320 | c & 1023);
    } else if (eb & 1)
      r += String.fromCharCode((c & 31) << 6 | d[i++] & 63);
    else
      r += String.fromCharCode((c & 15) << 12 | (d[i++] & 63) << 6 | d[i++] & 63);
  }
};
function strFromU8(dat, latin1) {
  if (latin1) {
    var r = "";
    for (var i = 0; i < dat.length; i += 16384)
      r += String.fromCharCode.apply(null, dat.subarray(i, i + 16384));
    return r;
  } else if (td) {
    return td.decode(dat);
  } else {
    var _a2 = dutf8(dat), s = _a2.s, r = _a2.r;
    if (r.length)
      err(8);
    return s;
  }
}
var slzh = function(d, b) {
  return b + 30 + b2(d, b + 26) + b2(d, b + 28);
};
var zh = function(d, b, z) {
  var fnl = b2(d, b + 28), fn = strFromU8(d.subarray(b + 46, b + 46 + fnl), !(b2(d, b + 8) & 2048)), es = b + 46 + fnl, bs = b4(d, b + 20);
  var _a2 = z && bs == 4294967295 ? z64e(d, es) : [bs, b4(d, b + 24), b4(d, b + 42)], sc = _a2[0], su = _a2[1], off = _a2[2];
  return [b2(d, b + 10), sc, su, fn, es + b2(d, b + 30) + b2(d, b + 32), off];
};
var z64e = function(d, b) {
  for (; b2(d, b) != 1; b += 4 + b2(d, b + 2))
    ;
  return [b8(d, b + 12), b8(d, b + 4), b8(d, b + 20)];
};
function unzipSync(data, opts) {
  var files = {};
  var e = data.length - 22;
  for (; b4(data, e) != 101010256; --e) {
    if (!e || data.length - e > 65558)
      err(13);
  }
  ;
  var c = b2(data, e + 8);
  if (!c)
    return {};
  var o = b4(data, e + 16);
  var z = o == 4294967295 || c == 65535;
  if (z) {
    var ze = b4(data, e - 12);
    z = b4(data, ze) == 101075792;
    if (z) {
      c = b4(data, ze + 32);
      o = b4(data, ze + 48);
    }
  }
  var fltr = opts && opts.filter;
  for (var i = 0; i < c; ++i) {
    var _a2 = zh(data, o, z), c_2 = _a2[0], sc = _a2[1], su = _a2[2], fn = _a2[3], no = _a2[4], off = _a2[5], b = slzh(data, off);
    o = no;
    if (!fltr || fltr({
      name: fn,
      size: sc,
      originalSize: su,
      compression: c_2
    })) {
      if (!c_2)
        files[fn] = slc(data, b, b + sc);
      else if (c_2 == 8)
        files[fn] = inflateSync(data.subarray(b, b + sc), { out: new u8(su) });
      else
        err(14, "unknown compression type " + c_2);
    }
  }
  return files;
}

// ../local-testing/src/client.ts
var LocalTestingClient = class extends GeneratedLocalTestingClient {
  constructor(options) {
    super(
      {
        ...options,
        usernameOptional: true
      },
      options?.baseUrl ?? "https://www.browserstack.com",
      "https://api-cloud.browserstack.com",
      "@browserstack-client/local-testing",
      "6.0.0"
    );
    __publicField(this, "authToken");
    const authToken = resolveAccessKey(options?.accessKey);
    if (typeof authToken !== "string" || !authToken.trim().length) {
      throw new BrowserStackError("Missing options.accessKey");
    }
    this.authToken = authToken;
  }
  getBinaryInstances(query, options) {
    return this.execute({
      operationId: "getLocalBinaryInstances",
      method: "GET",
      path: "/local/v1/list",
      params: {
        query: {
          ...query,
          auth_token: this.authToken
        }
      },
      requestCodec: "json",
      requestCodecConfig: {},
      responseCodec: "json",
      responseCodecConfig: {},
      baseUrl: "sdk",
      signal: options?.signal
    }).then((r) => r.instances);
  }
  getBinaryInstance(localInstanceId, query, options) {
    return this.execute({
      operationId: "getLocalBinaryInstance",
      method: "GET",
      path: "/local/v1/{localInstanceId}",
      params: {
        path: { localInstanceId },
        query: {
          ...query,
          auth_token: this.authToken
        }
      },
      requestCodec: "json",
      requestCodecConfig: {},
      responseCodec: "json",
      responseCodecConfig: {},
      baseUrl: "sdk",
      signal: options?.signal
    }).then((r) => {
      if (!r.instances.length) {
        throw new BrowserStackError(
          `No Local binary instance found with id "${localInstanceId}"`
        );
      }
      return r.instances[0];
    });
  }
  disconnectBinaryInstance(localInstanceId, query, options) {
    return this.execute({
      operationId: "disconnectLocalBinaryInstance",
      method: "DELETE",
      path: "/local/v1/{localInstanceId}",
      params: {
        path: { localInstanceId },
        query: {
          ...query,
          auth_token: this.authToken
        }
      },
      requestCodec: "json",
      requestCodecConfig: {},
      responseCodec: "json",
      responseCodecConfig: {},
      baseUrl: "sdk",
      signal: options?.signal
    }).then((r) => r.message);
  }
  downloadBinary(osArch, filenamePrefix = "BrowserStackLocal", options) {
    const url = `${this.baseUrls.sdk}/browserstack-local/BrowserStackLocal-${encodeURIComponent(osArch)}.zip`;
    return this.fetchFn(url, { signal: options?.signal }).then(async (response) => {
      if (!response.ok) {
        throw new BrowserStackError(
          `Failed to download BrowserStackLocal-${osArch}.zip: HTTP ${response.status}`
        );
      }
      return new Uint8Array(await response.arrayBuffer());
    }).then((buffer) => {
      const files = unzipSync(buffer, {
        filter: (file) => {
          return file.name.startsWith(filenamePrefix);
        }
      });
      const entries = Object.keys(files);
      if (!entries.length) {
        throw new BrowserStackError(
          `Local binary not found in BrowserStackLocal-${osArch}.zip`
        );
      }
      const content = files[entries[0]];
      return { content, filename: entries[0] };
    }).catch((err2) => {
      if (err2 instanceof BrowserStackError || err2 instanceof OpenAPIError) {
        throw err2;
      }
      throw new BrowserStackError(
        `Failed to download local binary: ${err2.message}: ${err2.stack}`
      );
    });
  }
};

// ../local-testing-binary/src/local-testing-binary.ts
var import_node_child_process2 = __toESM(require("child_process"), 1);
var import_node_crypto2 = require("crypto");
var import_promises2 = require("fs/promises");
var import_node_os = require("os");
var import_node_path3 = require("path");
var LocalTestingBinary = class _LocalTestingBinary extends LocalTestingClient {
  /**
   * Constructs a new instance of the ScreenshotsClient class.
   * @param options - Optional configuration options for the client.
   */
  constructor(options) {
    super(options);
    __publicField(this, "options", options);
    __publicField(this, "localIdentifier");
    __publicField(this, "child", {
      pid: void 0,
      args: []
    });
    __publicField(this, "commandTimeoutMs");
    __publicField(this, "binHome");
    /**
     * The last state of the BrowserStackLocal daemon command.
     * @public
     */
    __publicField(this, "state", "stopped");
    const localIdentifier = options?.localIdentifier ?? (env.BROWSERSTACK_LOCAL_ID ?? env.BROWSERSTACK_LOCAL_IDENTIFIER)?.trim?.() ?? (0, import_node_crypto2.randomBytes)(16).toString("hex");
    if (typeof localIdentifier !== "string" || !localIdentifier.trim().length) {
      throw new BrowserStackError("Missing options.localIdentifier.id");
    }
    this.localIdentifier = localIdentifier;
    this.commandTimeoutMs = options?.commandTimeoutMs ?? 2e4;
    this.binHome = this.getBinHome();
  }
  /**
   * Retrieves the version of the local testing binary.
   * @returns A promise that resolves to the version string.
   */
  async version() {
    const binFilePath = await this.ensureBinaryExists();
    return new Promise((resolve6, reject) => {
      const child = import_node_child_process2.default.spawnSync(binFilePath, ["--version"], {
        timeout: this.commandTimeoutMs,
        cwd: this.binHome,
        windowsHide: true
      });
      const data = child.stdout?.toString?.("utf8")?.trim?.();
      const version = data?.match(/\s+version\s+(.*)$/i)?.[1]?.trim();
      if (typeof version === "string") {
        return resolve6(version);
      }
      const error = child.stderr?.toString?.("utf8")?.trim?.();
      reject(
        new BrowserStackError(
          `Failed to get version: ${error ?? data} (status=${child.status})`
        )
      );
    });
  }
  /**
   * Starts the BrowserStackLocal daemon.
   *
   * @returns A promise that resolves to a string if the binary starts successfully, or undefined if there is an error.
   */
  async start() {
    let result = void 0;
    await this.runDaemonCommand({
      action: "start",
      initialState: "starting",
      successState: "started",
      isSuccess: (_, state, message) => {
        const isSuccess = state === "connected";
        result ?? (result = message);
        return isSuccess;
      }
    }).catch((err2) => {
      if (result) {
        Object.assign(err2, { message: result });
      }
      throw err2;
    });
    return result;
  }
  /**
   * Stops the BrowserStackLocal daemon.
   *
   * @returns A promise that resolves to a string if the daemon stops successfully, or undefined otherwise.
   */
  async stop() {
    let result;
    await this.runDaemonCommand({
      action: "stop",
      initialState: "stopping",
      successState: "stopped",
      isSuccess: (_, state, message) => {
        result ?? (result = message);
        const isSuccess = state === "success" && message?.toLowerCase?.()?.includes?.("stopped successfully") === true;
        return isSuccess;
      }
    }).catch((err2) => {
      if (result) {
        Object.assign(err2, { message: result });
      }
      throw err2;
    });
    return result;
  }
  /**
   * @internal
   */
  async runDaemonCommand(command, commandTimeoutMs = this.commandTimeoutMs, binHome = this.binHome, healBinary = false) {
    const previousState = {
      state: this.state,
      pid: this.child.pid,
      args: this.child.args
    };
    const restoreState = () => {
      this.state = previousState.state;
      this.child.pid = previousState.pid;
      this.child.args = previousState.args;
    };
    const raiseError = (err2) => {
      restoreState();
      throw err2;
    };
    if (healBinary) {
      try {
        await (0, import_promises2.unlink)(await binaryPath(binHome));
      } catch {
      }
    }
    const binFilePath = await this.ensureBinaryExists().catch(raiseError);
    const retryRun = async (err2) => {
      restoreState();
      if (healBinary) {
        return Promise.reject(
          new BrowserStackError(`Failed to run binary: ${binFilePath}`, err2)
        );
      }
      return this.runDaemonCommand(command, commandTimeoutMs, binHome, true);
    };
    const binArgs = await _LocalTestingBinary.resolveArgs(
      this.authToken,
      this.localIdentifier,
      command.action,
      this.options
    );
    return new Promise((resolve6, reject) => {
      this.state = command.initialState;
      const child = import_node_child_process2.default.spawnSync(binFilePath, binArgs, {
        timeout: commandTimeoutMs,
        cwd: binHome,
        windowsHide: true
      });
      if (child.error) {
        const err2 = new BrowserStackError(child.error.message, child.error);
        if (err2.code === "EACCES") {
          return retryRun(err2).then(resolve6).catch(reject);
        }
        return reject(err2);
      }
      const data = child.stdout?.toString?.("utf8")?.trim?.();
      if (data) {
        try {
          const r = JSON.parse(data);
          if (r && typeof r === "object") {
            const { state, message } = this.parseOutput(r);
            if (command.isSuccess(r, state, message)) {
              this.state = command.successState;
              if (command.action === "start") {
                this.child.pid = r.pid ?? child.pid;
                this.child.args = binArgs.slice(2);
              } else if (command.action === "stop") {
                this.child.pid = void 0;
                this.child.args = [];
              }
              return resolve6();
            }
          }
        } catch {
        }
      }
      const error = child.stderr?.toString?.("utf8")?.trim?.();
      if (error) {
        try {
          const r = JSON.parse(error);
          if (r && typeof r === "object") {
            const { state, message } = this.parseOutput(r);
            if (message) {
              return reject(new BrowserStackError(`${message} state=${state}`));
            }
          }
        } catch (err2) {
          return retryRun(new Error("Invalid binary: stderr")).then(resolve6).catch(reject);
        }
      }
      return reject(new BrowserStackError(error ?? data));
    }).catch(raiseError);
  }
  /**
   * @internal
   */
  static async resolveArgs(accessKey, localIdentifier, daemonModeAction, binaryFlags) {
    if (typeof accessKey !== "string" || !accessKey.trim().length) {
      throw new BrowserStackError("Required: accessKey");
    }
    if (typeof localIdentifier !== "string" || !localIdentifier.trim().length) {
      throw new BrowserStackError("Required: localIdentifier");
    }
    const args = [
      "--key",
      accessKey.trim(),
      "--local-identifier",
      localIdentifier.trim(),
      "--daemon",
      daemonModeAction
    ];
    if (!binaryFlags) {
      return args;
    }
    const addRootCAParams = async ({ rootCA }) => {
      if (rootCA && "useSystem" in rootCA && rootCA.useSystem === true) {
        args.push("--use-system-installed-ca");
      }
      if (rootCA && "path" in rootCA && rootCA.path && await fileExists(rootCA.path)) {
        args.push("--use-ca-certificate", rootCA.path);
      }
    };
    if (binaryFlags?.disableAPILogging !== true) {
      args.push("--enable-logging-for-api");
    }
    if (binaryFlags.forceLocal === true) {
      args.push("--force-local");
    } else if (binaryFlags.only) {
      const only = binaryFlags.only.map(
        ({ host, port, ssl }) => `${host},${port},${ssl ? 1 : 0}`
      );
      args.push("--only", only.join(","));
    }
    if ("folder" in binaryFlags && await dirExists(binaryFlags.folder)) {
      args.push("--folder", binaryFlags.folder);
    } else if ("localProxy" in binaryFlags && binaryFlags.localProxy) {
      const {
        host,
        port,
        auth: { username, password } = {
          username: void 0,
          password: void 0
        }
      } = binaryFlags.localProxy;
      args.push("--local-proxy-host", host.trim());
      if (port) {
        args.push("--local-proxy-port", `${port}`);
      }
      if (username && password) {
        args.push("--local-proxy-user", username.trim());
        args.push("--local-proxy-pass", password.trim());
      }
      await addRootCAParams(binaryFlags.localProxy);
    }
    const proxy = binaryFlags?.proxy;
    if (proxy) {
      if (typeof proxy === "string") {
        if (await fileExists(proxy)) {
          args.push("--proxy-pac", proxy);
        } else {
          throw new BrowserStackError(`Invalid proxy pac file: ${proxy}`);
        }
      } else {
        const {
          host,
          port,
          auth: { username, password } = {
            username: void 0,
            password: void 0
          },
          force
        } = proxy;
        args.push("--proxy-host", host.trim());
        if (port) {
          args.push("--proxy-port", `${port}`);
        }
        if (username && password) {
          args.push("--proxy-user", username.trim());
          args.push("--proxy-pass", password.trim());
        }
        if (force) {
          args.push("--force-proxy");
        }
        await addRootCAParams(proxy);
      }
    }
    if (binaryFlags.onlyAutomate === true) {
      args.push("--only-automate");
    }
    if (binaryFlags.debug) {
      const { level, logFile } = binaryFlags.debug;
      if (level) {
        args.push("--verbose", `${level}`);
      }
      if (logFile) {
        args.push("--log-file", logFile);
      }
    }
    if (binaryFlags.timeout) {
      args.push("--timeout", `${binaryFlags.timeout}`);
    }
    if (binaryFlags.parallelRuns) {
      args.push("--parallel-runs", `${binaryFlags.parallelRuns}`);
    }
    if (binaryFlags.hosts) {
      const { include, exclude } = binaryFlags.hosts;
      if (Array.isArray(include) && include.length) {
        args.push("--include-hosts", ...include);
      }
      if (Array.isArray(exclude) && exclude.length) {
        args.push("--exclude-hosts", ...exclude);
      }
    }
    return args.concat(binaryFlags.more ?? []);
  }
  get pid() {
    return this.child?.pid;
  }
  get args() {
    return this.child?.args ? Array.from(this.child?.args) : [];
  }
  /**
   * @internal
   */
  parseOutput(r) {
    let state;
    let pid;
    let message;
    if (typeof r.status === "string") {
      state = r.status.trim();
    }
    if (typeof r.state === "string") {
      state = r.state.trim();
    }
    if (typeof r.pid === "string") {
      pid = r.pid.trim();
    }
    if ("message" in r && r.message) {
      if (typeof r.message === "string") {
        message = r.message.trim();
      } else if (typeof r.message === "object") {
        message = "message" in r.message && typeof r.message.message === "string" ? r.message.message.trim() : void 0;
      }
    }
    return { state, pid, message };
  }
  /**
   * Returns the default home directory for the BrowserStack binary.
   * If the user's home directory is available, it will be used.
   * Otherwise, the system's temporary directory will be used.
   * @returns The default home directory path.
   *
   * @internal
   */
  defaultBinHome() {
    return (0, import_node_path3.join)((0, import_node_os.homedir)() ?? (0, import_node_os.tmpdir)(), ".browserstack");
  }
  /**
   * @internal
   */
  getBinHome() {
    const binHome = this.options?.binHome ?? env.BROWSERSTACK_LOCAL_BINARY_HOME ?? env.BROWSERSTACK_LOCAL_BINARY_PATH ?? this.defaultBinHome();
    if (typeof binHome !== "string" || !binHome.trim().length) {
      throw new BrowserStackError("Missing options.binHome");
    }
    return binHome.trim();
  }
  /**
   * @internal
   */
  async ensureBinaryExists() {
    try {
      const binPath = await binaryPath(this.binHome);
      if (await fileExists(binPath)) {
        return binPath;
      }
    } catch (err2) {
    }
    const osArch = await currentOSArch();
    if (!osArch) {
      throw new BrowserStackError(`Unsupported platform: ${osArch}`);
    }
    try {
      const { content, filename } = await this.downloadBinary(osArch);
      return await saveFile(this.binHome, filename, content, 493);
    } catch (err2) {
      if (err2 instanceof BrowserStackError) {
        throw err2;
      } else if (err2 instanceof Error) {
        throw new BrowserStackError(
          `Failed to download binary: ${err2.message}`,
          err2
        );
      }
      throw new BrowserStackError(`Failed to download binary: ${err2}`);
    }
  }
};

// src/browserstack-local.ts
var import_node_child_process3 = __toESM(require("child_process"), 1);
var import_promises3 = require("fs/promises");
var import_node_os2 = require("os");
var import_node_path4 = require("path");
var import_node_process3 = __toESM(require("process"), 1);
var import_meta = {};
var BrowserStackLocalAction = /* @__PURE__ */ ((BrowserStackLocalAction2) => {
  BrowserStackLocalAction2["start"] = "start";
  BrowserStackLocalAction2["stop"] = "stop";
  BrowserStackLocalAction2["list"] = "list";
  BrowserStackLocalAction2["runWith"] = "run-with";
  return BrowserStackLocalAction2;
})(BrowserStackLocalAction || {});
async function start(options, statusPath, logger = globalThis.console) {
  const { localIdentifiers = [], ...entries } = await readOrCreateStatusFile(
    statusPath
  );
  const localTestingBinary = new LocalTestingBinary(options);
  const localIdentifier = localTestingBinary.localIdentifier;
  let status;
  try {
    status = await localTestingBinary.start();
  } catch (err2) {
    if (err2 instanceof BrowserStackError && err2.code === "ETIMEDOUT") {
      logger.error(
        `${localIdentifier}: Failed to complete command within ${localTestingBinary.commandTimeoutMs}ms timeout`
      );
    } else if (err2 instanceof Error) {
      logger.error(`${localIdentifier}: ${err2.message}`);
    } else {
      throw err2;
    }
  }
  if (status) {
    localIdentifiers.push(localIdentifier);
    await writeStatusFile(statusPath, localIdentifiers, entries);
    logger.info(`${localIdentifier}: ${status}`);
  }
  return localIdentifier;
}
async function stopInstance(localIdentifier, options, logger = globalThis.console) {
  const localTestingBinary = new LocalTestingBinary({
    ...options,
    localIdentifier
  });
  let status;
  try {
    status = await localTestingBinary.stop();
    logger.info(`${localIdentifier}: ${status}`);
  } catch (err2) {
    if (err2 instanceof Error) {
      if (err2.message.match(/process instance not found/i)) {
        status = err2.message;
      }
      logger.error(`${localIdentifier}: ${err2.message}`);
    } else {
      logger.error(`${localIdentifier}: Failed to stop instance`);
    }
  }
  return status;
}
async function stop(options, statusPath, logger = globalThis.console) {
  const { localIdentifiers = [], ...entries } = await readOrCreateStatusFile(
    statusPath
  );
  const inputLocalIdentifier = options.localIdentifier?.trim?.();
  if (inputLocalIdentifier && localIdentifiers.includes(inputLocalIdentifier)) {
    const status = await stopInstance(inputLocalIdentifier, options, logger);
    if (status) {
      localIdentifiers.splice(
        localIdentifiers.indexOf(inputLocalIdentifier),
        1
      );
      await writeStatusFile(statusPath, localIdentifiers, entries);
    }
  } else {
    while (localIdentifiers.length) {
      const localIdentifier = localIdentifiers.shift();
      if (!localIdentifier) {
        break;
      }
      const status = await stopInstance(localIdentifier, options, logger);
      if (status) {
        await writeStatusFile(statusPath, localIdentifiers, entries);
      }
    }
  }
}
async function list(statusPath, logger = globalThis.console) {
  const { localIdentifiers = [] } = await readOrCreateStatusFile(statusPath);
  localIdentifiers.forEach((localIdentifier) => logger.info(localIdentifier));
}
async function runWith(options, statusPath, runWithArgs, logger, exitOnError = false) {
  const localIdentifier = await start(options, statusPath, logger);
  let childExitCode;
  const exitHandler = async () => {
    await stop({ ...options, localIdentifier }, statusPath, logger);
    if (exitOnError) {
      import_node_process3.default.exit(childExitCode);
    }
  };
  const removeOnExitHandler = onExit(() => {
    (async () => await exitHandler())();
  });
  try {
    const [cmd, ...args] = runWithArgs;
    const childProcess = import_node_child_process3.default.spawnSync(cmd, args, {
      cwd: import_node_process3.default.cwd(),
      stdio: ["pipe", "inherit", "inherit"],
      windowsHide: true,
      env: {
        ...import_node_process3.default.env,
        BROWSERSTACK_LOCAL_ID: localIdentifier,
        BROWSERSTACK_LOCAL_IDENTIFIER: localIdentifier
      },
      // https://stackoverflow.com/a/54515183
      ...import_node_process3.default.platform === "win32" ? { shell: true } : {}
    });
    if (childProcess.error) {
      throw childProcess.error;
    }
    childExitCode = Number(childProcess.status ?? 0);
  } catch (err2) {
    childExitCode = 1;
    if (err2 instanceof Error) {
      logger.error(err2?.message);
    } else {
      logger.error(`An unexpected error occurred: ${err2}`);
    }
  } finally {
    removeOnExitHandler();
    await exitHandler();
  }
}
function defaultBinHome() {
  return (0, import_node_path4.join)((0, import_node_os2.homedir)() ?? (0, import_node_os2.tmpdir)(), ".browserstack");
}
async function ensureBinHomeExists(binPath = env.BROWSERSTACK_LOCAL_BINARY_HOME ?? env.BROWSERSTACK_LOCAL_BINARY_PATH) {
  const binHome = binPath ?? defaultBinHome();
  if (typeof binHome !== "string" || !binHome.trim().length) {
    throw new BrowserStackError("Missing binHome");
  }
  return await ensureDirExists(binHome.trim());
}
function ensureAccessKeyExists(accessKey) {
  const resolved = resolveAccessKey(accessKey);
  if (typeof resolved !== "string" || !resolved.trim().length) {
    throw new BrowserStackError("Missing accessKey");
  }
  return resolved.trim();
}
function ensureValidAction(inputAction, validActions = Object.values(BrowserStackLocalAction)) {
  const action = inputAction?.toLowerCase?.()?.trim?.();
  if (action && validActions.includes(action)) {
    return action;
  }
  throw new BrowserStackError(`Invalid action: ${action}`);
}
function resolveEnvLocalIdentifier() {
  return (env.BROWSERSTACK_LOCAL_ID ?? env.BROWSERSTACK_LOCAL_IDENTIFIER)?.trim?.();
}
async function readOrCreateStatusFile(statusPath, fileEncoding = "utf-8") {
  try {
    const contents = await (0, import_promises3.readFile)(statusPath, fileEncoding).then(
      (data) => data.toString().trim()
    );
    if (contents.length) {
      const data = JSON.parse(contents);
      const localIdentifiers = [];
      if (data && typeof data === "object") {
        if ("localIdentifiers" in data && Array.isArray(data.localIdentifiers)) {
          localIdentifiers.push(
            ...data.localIdentifiers.filter((o) => typeof o === "string").map((o) => o.trim()).filter((o) => o.length)
          );
        }
        return { localIdentifiers, ...data };
      }
    }
    throw new BrowserStackError(`Invalid status file format: ${statusPath}`);
  } catch (err2) {
    if (err2 instanceof BrowserStackError) {
      throw err2;
    }
    if (err2 instanceof Error && "code" in err2 && err2.code === "ENOENT") {
      const result = { localIdentifiers: [] };
      await writeStatusFile(
        statusPath,
        result.localIdentifiers,
        {},
        fileEncoding
      );
      return result;
    }
    throw new BrowserStackError(`Invalid status file: ${statusPath}`);
  }
}
async function writeStatusFile(statusPath, localIdentifiers, attributes = {}, fileEncoding = "utf-8") {
  await writeFileAtomic(
    statusPath,
    JSON.stringify(
      {
        ...attributes,
        localIdentifiers: Array.from(new Set(localIdentifiers))
      },
      null,
      2
    ),
    { encoding: fileEncoding }
  );
}
async function main(inputArgs = import_node_process3.default.argv.slice(2), logger = globalThis.console, cmdSeparator = "--", exitOnError = false) {
  try {
    const args = inputArgs.map((arg) => arg.trim());
    const action = ensureValidAction(args[0]);
    const localIdentifier = resolveEnvLocalIdentifier() ?? (args[1] === cmdSeparator ? void 0 : args[1]);
    const accessKey = ensureAccessKeyExists(
      action === "run-with" /* runWith */ ? void 0 : args[2]
    );
    const binHome = await ensureBinHomeExists();
    const statusPath = (0, import_node_path4.join)(binHome, "status.json");
    switch (action) {
      case "start" /* start */: {
        await start({ accessKey, binHome, localIdentifier }, statusPath, logger);
        break;
      }
      case "stop" /* stop */: {
        await stop({ accessKey, binHome, localIdentifier }, statusPath, logger);
        break;
      }
      case "list" /* list */: {
        await list(statusPath, logger);
        break;
      }
      case "run-with" /* runWith */: {
        const cmdStartIndex = args.findIndex((arg) => arg === cmdSeparator);
        if (cmdStartIndex === -1) {
          throw new BrowserStackError(
            `Invalid run-with command: no command separator ${cmdSeparator} found`
          );
        }
        const runWithArgs = args.slice(cmdStartIndex + 1);
        if (!runWithArgs.length) {
          throw new BrowserStackError(
            "Invalid run-with command: no command provided"
          );
        }
        return await runWith(
          { accessKey, binHome, localIdentifier },
          statusPath,
          runWithArgs,
          logger,
          exitOnError
        );
      }
      default:
        throw new BrowserStackError(
          `Invalid action: ${action} (valid actions: start, stop, list)`
        );
    }
  } catch (err2) {
    if (err2 instanceof Error) {
      logger.error(err2.message);
    } else {
      logger.error(`An unexpected error occurred: ${err2}`);
    }
    if (exitOnError) {
      import_node_process3.default.exit(1);
    }
  }
}
if (import_meta.url === `file://${import_node_process3.default.argv[1]}`) {
  main(import_node_process3.default.argv.slice(2), globalThis.console, "--", true);
}

// src/utils.ts
function ensureAccessKeyExists2(accessKey) {
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

// ../openapi/generated/app-automate.client.ts
var GeneratedAppAutomateClient = class extends APIClient {
  getAppAutomateBuild(buildId, options) {
    return this.execute({
      path: "/app-automate/builds/{buildId}.json",
      params: { path: { buildId } },
      requestCodec: "json",
      requestCodecConfig: {},
      responseCodec: "json-unwrap",
      responseCodecConfig: { "path": "$.build" },
      baseUrl: "sdk",
      operationId: "getAppAutomateBuild",
      method: "GET",
      signal: options?.signal
    }).then((r) => toCamelCase(r, void 0));
  }
  updateAppAutomateBuild(buildId, body, options) {
    return this.execute({
      path: "/app-automate/builds/{buildId}.json",
      params: { path: { buildId } },
      requestInput: toSnakeCase(body, void 0),
      requestCodec: "json",
      requestCodecConfig: {},
      responseCodec: "json",
      responseCodecConfig: {},
      baseUrl: "sdk",
      operationId: "updateAppAutomateBuild",
      method: "PUT",
      signal: options?.signal
    }).then((r) => toCamelCase(r, void 0));
  }
  deleteAppAutomateBuild(buildId, options) {
    return this.execute({
      path: "/app-automate/builds/{buildId}.json",
      params: { path: { buildId } },
      requestCodec: "json",
      requestCodecConfig: {},
      responseCodec: "json",
      responseCodecConfig: {},
      baseUrl: "sdk",
      operationId: "deleteAppAutomateBuild",
      method: "DELETE",
      signal: options?.signal
    }).then((r) => toCamelCase(r, void 0));
  }
  getAppAutomateMediaFilesByCustomId(customId, options) {
    return this.execute({
      path: "/app-automate/recent_media_files/{customId}",
      params: { path: { customId } },
      requestCodec: "json",
      requestCodecConfig: {},
      responseCodec: "json",
      responseCodecConfig: {},
      baseUrl: "sdk",
      operationId: "getAppAutomateMediaFilesByCustomId",
      method: "GET",
      signal: options?.signal
    }).then((r) => toCamelCase(r, void 0));
  }
  getAppAutomateSessionLogs(buildId, sessionId, options) {
    return this.execute({
      path: "/app-automate/builds/{buildId}/sessions/{sessionId}/logs",
      params: { path: { buildId, sessionId } },
      requestCodec: "json",
      requestCodecConfig: {},
      responseCodec: "text",
      responseCodecConfig: {},
      baseUrl: "sdk",
      operationId: "getAppAutomateSessionLogs",
      method: "GET",
      signal: options?.signal
    }).then((r) => toCamelCase(r, void 0));
  }
  getAppAutomateApps(options) {
    return this.execute({
      path: "/app-automate/recent_apps",
      params: void 0,
      requestCodec: "json",
      requestCodecConfig: {},
      responseCodec: "json",
      responseCodecConfig: {},
      baseUrl: "sdk",
      operationId: "getAppAutomateApps",
      method: "GET",
      signal: options?.signal
    }).then((r) => toCamelCase(r, void 0));
  }
  getAppAutomateGroupMediaFiles(options) {
    return this.execute({
      path: "/app-automate/recent_group_media",
      params: void 0,
      requestCodec: "json",
      requestCodecConfig: {},
      responseCodec: "json",
      responseCodecConfig: {},
      baseUrl: "sdk",
      operationId: "getAppAutomateGroupMediaFiles",
      method: "GET",
      signal: options?.signal
    }).then((r) => toCamelCase(r, void 0));
  }
  getAppAutomateXCUITestApp(appId, options) {
    return this.execute({
      path: "/app-automate/xcuitest/v2/apps/{appId}",
      params: { path: { appId } },
      requestCodec: "json",
      requestCodecConfig: {},
      responseCodec: "json-unwrap",
      responseCodecConfig: { "path": "$.app" },
      baseUrl: "sdk",
      operationId: "getAppAutomateXCUITestApp",
      method: "GET",
      signal: options?.signal
    }).then((r) => toCamelCase(r, void 0));
  }
  deleteAppAutomateXCUITestApp(appId, options) {
    return this.execute({
      path: "/app-automate/xcuitest/v2/apps/{appId}",
      params: { path: { appId } },
      requestCodec: "json",
      requestCodecConfig: {},
      responseCodec: "json",
      responseCodecConfig: {},
      baseUrl: "sdk",
      operationId: "deleteAppAutomateXCUITestApp",
      method: "DELETE",
      signal: options?.signal
    }).then((r) => toCamelCase(r, void 0));
  }
  getAppAutomateNetworkLogs(buildId, sessionId, options) {
    return this.execute({
      path: "/app-automate/builds/{buildId}/sessions/{sessionId}/networklogs",
      params: { path: { buildId, sessionId } },
      requestCodec: "json",
      requestCodecConfig: {},
      responseCodec: "json",
      responseCodecConfig: {},
      baseUrl: "sdk",
      operationId: "getAppAutomateNetworkLogs",
      method: "GET",
      signal: options?.signal
    }).then((r) => toCamelCase(r, void 0));
  }
  uploadAppAutomateBuildTerminalLogs(buildId, body, options) {
    return this.execute({
      path: "/app-automate/builds/{buildId}/terminallogs",
      params: { path: { buildId } },
      requestInput: toSnakeCase(body, void 0),
      requestCodec: "multipart",
      requestCodecConfig: { "fileField": "file", "filenameFrom": "$.file_name" },
      responseCodec: "json",
      responseCodecConfig: {},
      baseUrl: "sdk",
      operationId: "uploadAppAutomateBuildTerminalLogs",
      method: "POST",
      signal: options?.signal
    }).then((r) => toCamelCase(r, void 0));
  }
  uploadAppAutomateFlutterAndroidApp(body, options) {
    return this.execute({
      path: "/app-automate/flutter-integration-tests/v2/android/app",
      params: void 0,
      requestInput: toSnakeCase(body, void 0),
      requestCodec: "multipart",
      requestCodecConfig: { "fileField": "file", "filenameFrom": "$.file_name" },
      responseCodec: "json",
      responseCodecConfig: {},
      baseUrl: "sdk",
      operationId: "uploadAppAutomateFlutterAndroidApp",
      method: "POST",
      signal: options?.signal
    }).then((r) => toCamelCase(r, void 0));
  }
  uploadAppAutomateDetoxAndroidApp(body, options) {
    return this.execute({
      path: "/app-automate/detox/v2/android/app",
      params: void 0,
      requestInput: toSnakeCase(body, void 0),
      requestCodec: "multipart",
      requestCodecConfig: { "fileField": "file", "filenameFrom": "$.file_name" },
      responseCodec: "json",
      responseCodecConfig: {},
      baseUrl: "sdk",
      operationId: "uploadAppAutomateDetoxAndroidApp",
      method: "POST",
      signal: options?.signal
    }).then((r) => toCamelCase(r, void 0));
  }
  getAppAutomateXCUITestApps(options) {
    return this.execute({
      path: "/app-automate/xcuitest/v2/apps",
      params: void 0,
      requestCodec: "json",
      requestCodecConfig: {},
      responseCodec: "json-unwrap",
      responseCodecConfig: { "path": "$.apps" },
      baseUrl: "sdk",
      operationId: "getAppAutomateXCUITestApps",
      method: "GET",
      signal: options?.signal
    }).then((r) => toCamelCase(r, void 0));
  }
  uploadAppAutomateSessionTerminalLogs(sessionId, body, options) {
    return this.execute({
      path: "/app-automate/sessions/{sessionId}/terminallogs",
      params: { path: { sessionId } },
      requestInput: toSnakeCase(body, void 0),
      requestCodec: "multipart",
      requestCodecConfig: { "fileField": "file", "filenameFrom": "$.file_name" },
      responseCodec: "json",
      responseCodecConfig: {},
      baseUrl: "sdk",
      operationId: "uploadAppAutomateSessionTerminalLogs",
      method: "POST",
      signal: options?.signal
    }).then((r) => toCamelCase(r, void 0));
  }
  getAppAutomatePlan(options) {
    return this.execute({
      path: "/app-automate/plan.json",
      params: void 0,
      requestCodec: "json",
      requestCodecConfig: {},
      responseCodec: "json",
      responseCodecConfig: {},
      baseUrl: "sdk",
      operationId: "getAppAutomatePlan",
      method: "GET",
      signal: options?.signal
    }).then((r) => toCamelCase(r, void 0));
  }
  uploadAppAutomateFlutteriOSApp(body, options) {
    return this.execute({
      path: "/app-automate/flutter-integration-tests/v2/ios/test-package",
      params: void 0,
      requestInput: toSnakeCase(body, void 0),
      requestCodec: "multipart",
      requestCodecConfig: { "fileField": "file", "filenameFrom": "$.file_name" },
      responseCodec: "json",
      responseCodecConfig: {},
      baseUrl: "sdk",
      operationId: "uploadAppAutomateFlutteriOSApp",
      method: "POST",
      signal: options?.signal
    }).then((r) => toCamelCase(r, void 0));
  }
  uploadAppAutomateDetoxAndroidAppClient(body, options) {
    return this.execute({
      path: "/app-automate/detox/v2/android/app-client",
      params: void 0,
      requestInput: toSnakeCase(body, void 0),
      requestCodec: "multipart",
      requestCodecConfig: { "fileField": "file", "filenameFrom": "$.file_name" },
      responseCodec: "json",
      responseCodecConfig: {},
      baseUrl: "sdk",
      operationId: "uploadAppAutomateDetoxAndroidAppClient",
      method: "POST",
      signal: options?.signal
    }).then((r) => toCamelCase(r, void 0));
  }
  uploadAppAutomateXCUITestApp(body, options) {
    return this.execute({
      path: "/app-automate/xcuitest/v2/app",
      params: void 0,
      requestInput: toSnakeCase(body, void 0),
      requestCodec: "multipart",
      requestCodecConfig: { "fileField": "file", "filenameFrom": "$.file_name" },
      responseCodec: "json",
      responseCodecConfig: {},
      baseUrl: "sdk",
      operationId: "uploadAppAutomateXCUITestApp",
      method: "POST",
      signal: options?.signal
    }).then((r) => toCamelCase(r, void 0));
  }
  getAppAutomateProject(projectId, options) {
    return this.execute({
      path: "/app-automate/projects/{projectId}.json",
      params: { path: { projectId } },
      requestCodec: "json",
      requestCodecConfig: {},
      responseCodec: "json-unwrap",
      responseCodecConfig: { "path": "$.project" },
      baseUrl: "sdk",
      operationId: "getAppAutomateProject",
      method: "GET",
      signal: options?.signal
    }).then((r) => toCamelCase(r, void 0));
  }
  updateAppAutomateProject(projectId, body, options) {
    return this.execute({
      path: "/app-automate/projects/{projectId}.json",
      params: { path: { projectId } },
      requestInput: toSnakeCase(body, void 0),
      requestCodec: "json",
      requestCodecConfig: {},
      responseCodec: "json",
      responseCodecConfig: {},
      baseUrl: "sdk",
      operationId: "updateAppAutomateProject",
      method: "PUT",
      signal: options?.signal
    }).then((r) => toCamelCase(r, void 0));
  }
  deleteAppAutomateProject(projectId, options) {
    return this.execute({
      path: "/app-automate/projects/{projectId}.json",
      params: { path: { projectId } },
      requestCodec: "json",
      requestCodecConfig: {},
      responseCodec: "json",
      responseCodecConfig: {},
      baseUrl: "sdk",
      operationId: "deleteAppAutomateProject",
      method: "DELETE",
      signal: options?.signal
    }).then((r) => toCamelCase(r, void 0));
  }
  getAppAutomateDevices(options) {
    return this.execute({
      path: "/app-automate/devices.json",
      params: void 0,
      requestCodec: "json",
      requestCodecConfig: {},
      responseCodec: "json",
      responseCodecConfig: {},
      baseUrl: "sdk",
      operationId: "getAppAutomateDevices",
      method: "GET",
      signal: options?.signal
    }).then((r) => toCamelCase(r, void 0));
  }
  getAppAutomateAppiumLogs(buildId, sessionId, options) {
    return this.execute({
      path: "/app-automate/builds/{buildId}/sessions/{sessionId}/appiumlogs",
      params: { path: { buildId, sessionId } },
      requestCodec: "json",
      requestCodecConfig: {},
      responseCodec: "text",
      responseCodecConfig: {},
      baseUrl: "sdk",
      operationId: "getAppAutomateAppiumLogs",
      method: "GET",
      signal: options?.signal
    }).then((r) => toCamelCase(r, void 0));
  }
  deleteAppAutomateApp(appId, options) {
    return this.execute({
      path: "/app-automate/app/delete/{appId}",
      params: { path: { appId } },
      requestCodec: "json",
      requestCodecConfig: {},
      responseCodec: "json",
      responseCodecConfig: {},
      baseUrl: "sdk",
      operationId: "deleteAppAutomateApp",
      method: "DELETE",
      signal: options?.signal
    }).then((r) => toCamelCase(r, void 0));
  }
  getAppAutomateFlutterAndroidApp(appId, options) {
    return this.execute({
      path: "/app-automate/flutter-integration-tests/v2/android/apps/{appId}",
      params: { path: { appId } },
      requestCodec: "json",
      requestCodecConfig: {},
      responseCodec: "json-unwrap",
      responseCodecConfig: { "path": "$.app" },
      baseUrl: "sdk",
      operationId: "getAppAutomateFlutterAndroidApp",
      method: "GET",
      signal: options?.signal
    }).then((r) => toCamelCase(r, void 0));
  }
  deleteAppAutomateFlutterAndroidApp(appId, options) {
    return this.execute({
      path: "/app-automate/flutter-integration-tests/v2/android/apps/{appId}",
      params: { path: { appId } },
      requestCodec: "json",
      requestCodecConfig: {},
      responseCodec: "json",
      responseCodecConfig: {},
      baseUrl: "sdk",
      operationId: "deleteAppAutomateFlutterAndroidApp",
      method: "DELETE",
      signal: options?.signal
    }).then((r) => toCamelCase(r, void 0));
  }
  uploadAppAutomateMediaFile(body, options) {
    return this.execute({
      path: "/app-automate/upload-media",
      params: void 0,
      requestInput: toSnakeCase(body, void 0),
      requestCodec: "multipart",
      requestCodecConfig: { "fileField": "file", "filenameFrom": "$.file_name" },
      responseCodec: "json",
      responseCodecConfig: {},
      baseUrl: "sdk",
      operationId: "uploadAppAutomateMediaFile",
      method: "POST",
      signal: options?.signal
    }).then((r) => toCamelCase(r, void 0));
  }
  getAppAutomateEspressoApps(options) {
    return this.execute({
      path: "/app-automate/espresso/v2/apps",
      params: void 0,
      requestCodec: "json",
      requestCodecConfig: {},
      responseCodec: "json-unwrap",
      responseCodecConfig: { "path": "$.apps" },
      baseUrl: "sdk",
      operationId: "getAppAutomateEspressoApps",
      method: "GET",
      signal: options?.signal
    }).then((r) => toCamelCase(r, void 0));
  }
  getAppAutomateAppProfilingDataV2(buildId, sessionId, options) {
    return this.execute({
      path: "/app-automate/builds/{buildId}/sessions/{sessionId}/appprofiling/v2",
      params: { path: { buildId, sessionId } },
      requestCodec: "json",
      requestCodecConfig: {},
      responseCodec: "json",
      responseCodecConfig: {},
      baseUrl: "sdk",
      operationId: "getAppAutomateAppProfilingDataV2",
      method: "GET",
      signal: options?.signal
    }).then((r) => toCamelCase(r, void 0));
  }
  getAppAutomateSession(sessionId, options) {
    return this.execute({
      path: "/app-automate/sessions/{sessionId}.json",
      params: { path: { sessionId } },
      requestCodec: "json",
      requestCodecConfig: {},
      responseCodec: "json-unwrap",
      responseCodecConfig: { "path": "$.automation_session" },
      baseUrl: "sdk",
      operationId: "getAppAutomateSession",
      method: "GET",
      signal: options?.signal
    }).then((r) => toCamelCase(r, void 0));
  }
  updateAppAutomateSession(sessionId, body, options) {
    return this.execute({
      path: "/app-automate/sessions/{sessionId}.json",
      params: { path: { sessionId } },
      requestInput: toSnakeCase(body, void 0),
      requestCodec: "json",
      requestCodecConfig: {},
      responseCodec: "json-unwrap",
      responseCodecConfig: { "path": "$.automation_session" },
      baseUrl: "sdk",
      operationId: "updateAppAutomateSession",
      method: "PUT",
      signal: options?.signal
    }).then((r) => toCamelCase(r, void 0));
  }
  deleteAppAutomateSession(sessionId, options) {
    return this.execute({
      path: "/app-automate/sessions/{sessionId}.json",
      params: { path: { sessionId } },
      requestCodec: "json",
      requestCodecConfig: {},
      responseCodec: "json",
      responseCodecConfig: {},
      baseUrl: "sdk",
      operationId: "deleteAppAutomateSession",
      method: "DELETE",
      signal: options?.signal
    }).then((r) => toCamelCase(r, void 0));
  }
  getAppAutomateProjects(options) {
    return this.execute({
      path: "/app-automate/projects.json",
      params: void 0,
      requestCodec: "json",
      requestCodecConfig: {},
      responseCodec: "json",
      responseCodecConfig: {},
      baseUrl: "sdk",
      operationId: "getAppAutomateProjects",
      method: "GET",
      signal: options?.signal
    }).then((r) => toCamelCase(r, void 0));
  }
  deleteAppAutomateMediaFile(mediaId, options) {
    return this.execute({
      path: "/app-automate/custom_media/delete/{mediaId}",
      params: { path: { mediaId } },
      requestCodec: "json",
      requestCodecConfig: {},
      responseCodec: "json",
      responseCodecConfig: {},
      baseUrl: "sdk",
      operationId: "deleteAppAutomateMediaFile",
      method: "DELETE",
      signal: options?.signal
    }).then((r) => toCamelCase(r, void 0));
  }
  getAppAutomateEspressoApp(appId, options) {
    return this.execute({
      path: "/app-automate/espresso/v2/apps/{appId}",
      params: { path: { appId } },
      requestCodec: "json",
      requestCodecConfig: {},
      responseCodec: "json-unwrap",
      responseCodecConfig: { "path": "$.app" },
      baseUrl: "sdk",
      operationId: "getAppAutomateEspressoApp",
      method: "GET",
      signal: options?.signal
    }).then((r) => toCamelCase(r, void 0));
  }
  deleteAppAutomateEspressoApp(appId, options) {
    return this.execute({
      path: "/app-automate/espresso/v2/apps/{appId}",
      params: { path: { appId } },
      requestCodec: "json",
      requestCodecConfig: {},
      responseCodec: "json",
      responseCodecConfig: {},
      baseUrl: "sdk",
      operationId: "deleteAppAutomateEspressoApp",
      method: "DELETE",
      signal: options?.signal
    }).then((r) => toCamelCase(r, void 0));
  }
  getAppAutomateMediaFiles(options) {
    return this.execute({
      path: "/app-automate/recent_media_files",
      params: void 0,
      requestCodec: "json",
      requestCodecConfig: {},
      responseCodec: "json",
      responseCodecConfig: {},
      baseUrl: "sdk",
      operationId: "getAppAutomateMediaFiles",
      method: "GET",
      signal: options?.signal
    }).then((r) => toCamelCase(r, void 0));
  }
  getAppAutomateFlutteriOSApps(options) {
    return this.execute({
      path: "/app-automate/flutter-integration-tests/v2/ios/test-packages",
      params: void 0,
      requestCodec: "json",
      requestCodecConfig: {},
      responseCodec: "json-unwrap",
      responseCodecConfig: { "path": "$.test_packages" },
      baseUrl: "sdk",
      operationId: "getAppAutomateFlutteriOSApps",
      method: "GET",
      signal: options?.signal
    }).then((r) => toCamelCase(r, void 0));
  }
  uploadAppAutomateApp(body, options) {
    return this.execute({
      path: "/app-automate/upload",
      params: void 0,
      requestInput: toSnakeCase(body, void 0),
      requestCodec: "multipart",
      requestCodecConfig: { "fileField": "file", "filenameFrom": "$.file_name" },
      responseCodec: "json",
      responseCodecConfig: {},
      baseUrl: "sdk",
      operationId: "uploadAppAutomateApp",
      method: "POST",
      signal: options?.signal
    }).then((r) => toCamelCase(r, void 0));
  }
  getAppAutomateGroupApps(options) {
    return this.execute({
      path: "/app-automate/recent_group_apps",
      params: void 0,
      requestCodec: "json",
      requestCodecConfig: {},
      responseCodec: "json",
      responseCodecConfig: {},
      baseUrl: "sdk",
      operationId: "getAppAutomateGroupApps",
      method: "GET",
      signal: options?.signal
    }).then((r) => toCamelCase(r, void 0));
  }
  getAppAutomateAppsByCustomId(customId, options) {
    return this.execute({
      path: "/app-automate/recent_apps/{customId}",
      params: { path: { customId } },
      requestCodec: "json",
      requestCodecConfig: {},
      responseCodec: "json",
      responseCodecConfig: {},
      baseUrl: "sdk",
      operationId: "getAppAutomateAppsByCustomId",
      method: "GET",
      signal: options?.signal
    }).then((r) => toCamelCase(r, void 0));
  }
  getAppAutomateFlutterAndroidApps(options) {
    return this.execute({
      path: "/app-automate/flutter-integration-tests/v2/android/apps",
      params: void 0,
      requestCodec: "json",
      requestCodecConfig: {},
      responseCodec: "json-unwrap",
      responseCodecConfig: { "path": "$.apps" },
      baseUrl: "sdk",
      operationId: "getAppAutomateFlutterAndroidApps",
      method: "GET",
      signal: options?.signal
    }).then((r) => toCamelCase(r, void 0));
  }
  getAppAutomateDeviceLogs(buildId, sessionId, options) {
    return this.execute({
      path: "/app-automate/builds/{buildId}/sessions/{sessionId}/devicelogs",
      params: { path: { buildId, sessionId } },
      requestCodec: "json",
      requestCodecConfig: {},
      responseCodec: "text",
      responseCodecConfig: {},
      baseUrl: "sdk",
      operationId: "getAppAutomateDeviceLogs",
      method: "GET",
      signal: options?.signal
    }).then((r) => toCamelCase(r, void 0));
  }
  getAppAutomateAppProfilingDataV1(buildId, sessionId, options) {
    return this.execute({
      path: "/app-automate/builds/{buildId}/sessions/{sessionId}/appprofiling",
      params: { path: { buildId, sessionId } },
      requestCodec: "json",
      requestCodecConfig: {},
      responseCodec: "json",
      responseCodecConfig: {},
      baseUrl: "sdk",
      operationId: "getAppAutomateAppProfilingDataV1",
      method: "GET",
      signal: options?.signal
    }).then((r) => toCamelCase(r, void 0));
  }
  getAppAutomateBuilds(options) {
    return this.execute({
      path: "/app-automate/builds.json",
      params: void 0,
      requestCodec: "json",
      requestCodecConfig: {},
      responseCodec: "json-unwrap",
      responseCodecConfig: { "path": "$[*].automation_build" },
      baseUrl: "sdk",
      operationId: "getAppAutomateBuilds",
      method: "GET",
      signal: options?.signal
    }).then((r) => toCamelCase(r, void 0));
  }
  getAppAutomateFlutteriOSApp(appId, options) {
    return this.execute({
      path: "/app-automate/flutter-integration-tests/v2/ios/test-package/{appId}",
      params: { path: { appId } },
      requestCodec: "json",
      requestCodecConfig: {},
      responseCodec: "json-unwrap",
      responseCodecConfig: { "path": "$.test_package" },
      baseUrl: "sdk",
      operationId: "getAppAutomateFlutteriOSApp",
      method: "GET",
      signal: options?.signal
    }).then((r) => toCamelCase(r, void 0));
  }
  deleteAppAutomateFlutteriOSApp(appId, options) {
    return this.execute({
      path: "/app-automate/flutter-integration-tests/v2/ios/test-package/{appId}",
      params: { path: { appId } },
      requestCodec: "json",
      requestCodecConfig: {},
      responseCodec: "json",
      responseCodecConfig: {},
      baseUrl: "sdk",
      operationId: "deleteAppAutomateFlutteriOSApp",
      method: "DELETE",
      signal: options?.signal
    }).then((r) => toCamelCase(r, void 0));
  }
  getAppAutomateProjectBadgeKey(projectId, options) {
    return this.execute({
      path: "/app-automate/projects/{projectId}/badge_key",
      params: { path: { projectId } },
      requestCodec: "json",
      requestCodecConfig: {},
      responseCodec: "text",
      responseCodecConfig: {},
      baseUrl: "sdk",
      operationId: "getAppAutomateProjectBadgeKey",
      method: "GET",
      signal: options?.signal
    }).then((r) => toCamelCase(r, void 0));
  }
};

// ../app-automate/src/index.ts
var AppAutomateClient = class extends GeneratedAppAutomateClient {
  constructor(options) {
    super(
      options ?? {},
      options?.baseUrl ?? "https://api.browserstack.com",
      "https://api-cloud.browserstack.com",
      "@browserstack-client/app-automate",
      "6.0.0"
    );
  }
  uploadAppAutomateEspressoApp(body, options) {
    return this.execute({
      path: "/app-automate/espresso/v2/upload",
      params: void 0,
      requestCodec: "multipart",
      requestCodecConfig: { fileField: "file", filenameFrom: "$.file_name" },
      requestInput: body,
      responseCodec: "json",
      responseCodecConfig: {},
      baseUrl: "sdk",
      operationId: "uploadAppAutomateEspressoApp",
      method: "POST",
      signal: options?.signal
    }).then((r) => toCamelCase(r, void 0));
  }
};
var FlutterPlatform = /* @__PURE__ */ ((FlutterPlatform2) => {
  FlutterPlatform2["android"] = "android";
  FlutterPlatform2["ios"] = "ios";
  return FlutterPlatform2;
})(FlutterPlatform || {});

// src/browserstack-app-automate.ts
var import_node_crypto3 = require("crypto");
var import_promises4 = require("fs/promises");
var import_node_path5 = require("path");
var import_node_process4 = __toESM(require("process"), 1);
var import_meta2 = {};
var PlatformAction = /* @__PURE__ */ ((PlatformAction2) => {
  PlatformAction2["upload"] = "upload";
  PlatformAction2["get"] = "get";
  PlatformAction2["list"] = "list";
  PlatformAction2["delete"] = "delete";
  return PlatformAction2;
})(PlatformAction || {});
var PlatformCommand = class {
  constructor(platform, supportedActions, platformRun) {
    __publicField(this, "platform");
    __publicField(this, "supportedActions");
    __publicField(this, "_implPlatformCommand");
    __publicField(this, "_urlProtocol");
    this.platform = platform;
    this.supportedActions = supportedActions;
    this._implPlatformCommand = platformRun;
    this._urlProtocol = this._implPlatformCommand.getURLProtocol();
  }
  async list(options, args, logger) {
    const apps = await this._implPlatformCommand.list(options, args);
    apps.forEach((app) => this._logApp(app, logger));
  }
  async upload(options, args, logger) {
    const { filename, filePath, url, ...clientOptions } = options;
    const app = await this._implPlatformCommand.upload(
      {
        filename,
        ...filePath ? { file: new Blob([await (0, import_promises4.readFile)(filePath)]) } : { url: url.toString() }
      },
      clientOptions,
      args
    );
    const appURL = app ? this._implPlatformCommand.getURL(app) : void 0;
    if (appURL) {
      logger.info(appURL, "Uploaded successfully");
    } else {
      logger.error(`Failed to upload app`, app);
    }
  }
  async get(options, args, logger) {
    const { id, ...clientOptions } = options;
    const app = await this._implPlatformCommand.get(
      { id: this.cleanupId(id) },
      clientOptions,
      args
    );
    this._logApp(app, logger);
  }
  async delete(options, args, logger) {
    const { id, ...clientOptions } = options;
    const success = await this._implPlatformCommand.delete(
      { id: this.cleanupId(id) },
      clientOptions,
      args
    );
    if (success) {
      logger.info(`${this._urlProtocol}${id}`, "Deleted successfully");
    } else {
      logger.error(`Failed to delete app: ${id}`);
    }
  }
  _logApp(app, logger) {
    logger.info(...this._implPlatformCommand.logParams(app));
  }
  cleanupId(id, urlProto = this._urlProtocol) {
    return id.startsWith(urlProto) ? id.replace(urlProto, "") : id;
  }
};
var transformFlutterTestPackageToApp = (testPackage) => {
  const { testPackageId, testPackageUrl, testPackageName, ...common } = testPackage;
  return {
    ...common,
    appId: testPackageId,
    appUrl: testPackageUrl,
    appName: testPackageName
  };
};
var ensureFlutterPlatform = (platform, validPlatforms = Object.values(FlutterPlatform)) => {
  if (!platform || !validPlatforms.includes(platform)) {
    throw new BrowserStackError(
      `Invalid or missing flutter platform. Supported platforms: ${validPlatforms.sort().join(", ")}`
    );
  }
  return platform;
};
var appPlatformCommand = {
  getURLProtocol: () => "bs://",
  getURL: (app) => app?.appUrl,
  logParams: (app) => [
    app?.appUrl ?? "",
    app?.uploadedAt ? new Date(app.uploadedAt).toISOString() : "",
    app?.appName,
    app?.appVersion
  ]
};
var flutterPlatformCommand = new PlatformCommand(
  "flutter" /* flutter */,
  [
    "upload" /* upload */,
    "list" /* list */,
    "get" /* get */,
    "delete" /* delete */
  ],
  {
    ...appPlatformCommand,
    list: (clientOptions, args) => {
      const client = new AppAutomateClient(clientOptions);
      const platform = ensureFlutterPlatform(
        args[0]?.toLowerCase?.()?.trim?.()
      );
      if (platform === "android" /* android */) {
        return client.getAppAutomateFlutterAndroidApps().then((r) => Array.isArray(r) ? r : []);
      }
      return client.getAppAutomateFlutteriOSApps().then((r) => (Array.isArray(r) ? r : []).map(transformFlutterTestPackageToApp));
    },
    upload: (options, clientOptions, args) => {
      const client = new AppAutomateClient(clientOptions);
      let platform = args[0]?.toLowerCase?.()?.trim?.();
      if (!platform && options.filename?.toLowerCase?.()?.match?.(/\.(apk|aar|appbundle)$/)) {
        platform = "android" /* android */;
      } else {
        platform = ensureFlutterPlatform(platform);
      }
      if (platform === "android" /* android */) {
        return client.uploadAppAutomateFlutterAndroidApp({ ...options, fileName: options.filename });
      }
      return client.uploadAppAutomateFlutteriOSApp({ ...options, fileName: options.filename }).then(transformFlutterTestPackageToApp);
    },
    get: (options, clientOptions, args) => {
      const client = new AppAutomateClient(clientOptions);
      const platform = ensureFlutterPlatform(
        args[0]?.toLowerCase?.()?.trim?.()
      );
      if (platform === "android" /* android */) {
        return client.getAppAutomateFlutterAndroidApp(options.id);
      }
      return client.getAppAutomateFlutteriOSApp(options.id).then(transformFlutterTestPackageToApp);
    },
    delete: async (options, clientOptions, args) => {
      const client = new AppAutomateClient(clientOptions);
      const platform = ensureFlutterPlatform(
        args[0]?.toLowerCase?.()?.trim?.()
      );
      const result = await (platform === "android" /* android */ ? client.deleteAppAutomateFlutterAndroidApp(options.id) : client.deleteAppAutomateFlutteriOSApp(options.id));
      return result?.success?.message?.length > 0;
    }
  }
);
var patchAppIdWithCustomId = (app) => {
  if (!app.appId || !app.customId) {
    return app;
  }
  const customId = app.appId;
  return {
    ...app,
    appId: app.customId,
    appUrl: app.appUrl.replace(app.appId, app.customId),
    customId
  };
};
var appiumPlatformCommand = new PlatformCommand(
  "appium" /* appium */,
  [
    "upload" /* upload */,
    "list" /* list */,
    "get" /* get */,
    "delete" /* delete */
  ],
  {
    ...appPlatformCommand,
    list: (clientOptions) => {
      const client = new AppAutomateClient(clientOptions);
      return client.getAppAutomateApps().then((r) => (Array.isArray(r) ? r : []).map(patchAppIdWithCustomId));
    },
    upload: (options, clientOptions) => {
      const client = new AppAutomateClient(clientOptions);
      return client.uploadAppAutomateApp({
        ...options,
        fileName: options.filename,
        customId: (0, import_node_crypto3.randomBytes)(20).toString("hex")
      }).then(patchAppIdWithCustomId);
    },
    get: (options, clientOptions) => {
      const client = new AppAutomateClient(clientOptions);
      return client.getAppAutomateAppsByCustomId(options.id).then((r) => {
        const apps = Array.isArray(r) ? r : [];
        if (!apps.length) {
          throw new BrowserStackError(`${options.id} Not found`);
        }
        return patchAppIdWithCustomId(apps[0]);
      });
    },
    delete: async (options, clientOptions) => {
      const client = new AppAutomateClient(clientOptions);
      const result = await client.getAppAutomateAppsByCustomId(options.id);
      const apps = Array.isArray(result) ? result : [];
      const appId = apps[0]?.appId ?? options.id;
      const r = await client.deleteAppAutomateApp(appId);
      return r?.success === true;
    }
  }
);
var espressoPlatformCommand = new PlatformCommand(
  "espresso" /* espresso */,
  [
    "upload" /* upload */,
    "list" /* list */,
    "get" /* get */,
    "delete" /* delete */
  ],
  {
    ...appPlatformCommand,
    list: (clientOptions) => {
      const client = new AppAutomateClient(clientOptions);
      return client.getAppAutomateEspressoApps().then((r) => Array.isArray(r) ? r : []);
    },
    upload: (options, clientOptions) => {
      const client = new AppAutomateClient(clientOptions);
      return client.uploadAppAutomateApp({ ...options, fileName: options.filename });
    },
    get: (options, clientOptions) => {
      const client = new AppAutomateClient(clientOptions);
      return client.getAppAutomateEspressoApp(options.id);
    },
    delete: async (options, clientOptions) => {
      const client = new AppAutomateClient(clientOptions);
      const r = await client.deleteAppAutomateEspressoApp(options.id);
      return r?.success?.message?.length > 0;
    }
  }
);
var xcuiTestPlatformCommand = new PlatformCommand(
  "xcuitest" /* xcuitest */,
  [
    "upload" /* upload */,
    "list" /* list */,
    "get" /* get */,
    "delete" /* delete */
  ],
  {
    ...appPlatformCommand,
    list: (clientOptions) => {
      const client = new AppAutomateClient(clientOptions);
      return client.getAppAutomateXCUITestApps().then((r) => Array.isArray(r) ? r : []);
    },
    upload: (options, clientOptions) => {
      const client = new AppAutomateClient(clientOptions);
      return client.uploadAppAutomateXCUITestApp({ ...options, fileName: options.filename });
    },
    get: (options, clientOptions) => {
      const client = new AppAutomateClient(clientOptions);
      return client.getAppAutomateXCUITestApp(options.id);
    },
    delete: async (options, clientOptions) => {
      const client = new AppAutomateClient(clientOptions);
      const r = await client.deleteAppAutomateXCUITestApp(options.id);
      return r?.success?.message?.length > 0;
    }
  }
);
var detoxPlatformCommand = new PlatformCommand(
  "detox" /* detox */,
  ["upload" /* upload */],
  {
    ...appPlatformCommand,
    upload: (options, clientOptions, args) => {
      const appType = args?.[0]?.toLowerCase?.()?.trim?.();
      switch (appType) {
        case "app": {
          const client = new AppAutomateClient(clientOptions);
          return client.uploadAppAutomateDetoxAndroidApp({ ...options, fileName: options.filename });
        }
        case "app-client": {
          const client = new AppAutomateClient(clientOptions);
          return client.uploadAppAutomateDetoxAndroidAppClient({ ...options, fileName: options.filename });
        }
        default:
          throw new BrowserStackError(
            "Invalid or missing detox app type. Supported types: app, app-client"
          );
      }
    },
    list: () => {
      throw new BrowserStackError("Listing detox apps is not supported");
    },
    get: () => {
      throw new BrowserStackError("Fetching detox apps is not supported");
    },
    delete: () => {
      throw new BrowserStackError("Deleting detox apps is not supported");
    }
  }
);
var patchMediaIdWithCustomId = (media) => {
  if (!media.customId) {
    return media;
  }
  const customId = media.mediaId;
  return {
    ...media,
    mediaId: media.customId,
    mediaUrl: media.mediaUrl.replace(media.mediaId, media.customId),
    customId
  };
};
var mediaPlatformCommand = new PlatformCommand(
  "media" /* media */,
  [
    "upload" /* upload */,
    "list" /* list */,
    "get" /* get */,
    "delete" /* delete */
  ],
  {
    getURLProtocol: () => "media://",
    getURL: (media) => media?.mediaUrl,
    logParams: (media) => [
      media?.mediaUrl ?? "",
      media?.uploadedAt ? new Date(media.uploadedAt).toISOString() : "",
      media?.mediaName
    ],
    list: (clientOptions) => {
      const client = new AppAutomateClient(clientOptions);
      return client.getAppAutomateMediaFiles().then((r) => (Array.isArray(r) ? r : []).map(patchMediaIdWithCustomId));
    },
    upload: (options, clientOptions) => {
      if (options.url) {
        throw new BrowserStackError(
          "URL upload is not supported for media files"
        );
      }
      if (!options.file) {
        throw new BrowserStackError("No file provided for media upload");
      }
      const client = new AppAutomateClient(clientOptions);
      return client.uploadAppAutomateMediaFile({
        ...options,
        fileName: options.filename,
        customId: (0, import_node_crypto3.randomBytes)(20).toString("hex")
      }).then(patchMediaIdWithCustomId);
    },
    get: (options, clientOptions) => {
      const client = new AppAutomateClient(clientOptions);
      return client.getAppAutomateMediaFilesByCustomId(options.id).then((r) => {
        const media = Array.isArray(r) ? r : [];
        if (!media.length) {
          throw new BrowserStackError(`${options.id} Not found`);
        }
        return patchMediaIdWithCustomId(media[0]);
      });
    },
    delete: async (options, clientOptions) => {
      const client = new AppAutomateClient(clientOptions);
      const result = await client.getAppAutomateMediaFilesByCustomId(options.id);
      const media = Array.isArray(result) ? result : [];
      const mediaId = media[0]?.mediaId ?? options.id;
      const r = await client.deleteAppAutomateMediaFile(mediaId);
      return r?.success === true;
    }
  }
);
var platformCommands = new Map(
  [
    flutterPlatformCommand,
    appiumPlatformCommand,
    espressoPlatformCommand,
    xcuiTestPlatformCommand,
    detoxPlatformCommand,
    mediaPlatformCommand
  ].map((command) => [command.platform, command])
);
async function run(platformRun, action, args, logger = globalThis.console, osPlatforms = ["android", "ios"]) {
  if (!platformRun.supportedActions.includes(action)) {
    throw new BrowserStackError(
      `Invalid action: ${action} (valid actions: ${platformRun.supportedActions.join(
        ", "
      )})`
    );
  }
  switch (action) {
    case "upload" /* upload */: {
      const pathArg = args.shift();
      if (!pathArg) {
        throw new BrowserStackError("No file path or URL provided");
      }
      if (pathArg?.toLowerCase?.().startsWith?.("http")) {
        if (!args[0] || osPlatforms.includes(args[0])) {
          throw new BrowserStackError("No filename provided for URL upload");
        }
        return await platformRun.upload(
          { url: new URL(pathArg), filename: args[0] },
          args.slice(1),
          logger
        );
      }
      const filePath = (0, import_node_path5.resolve)(pathArg);
      await platformRun.upload(
        {
          filePath,
          filename: (0, import_node_path5.basename)(filePath)
        },
        args,
        logger
      );
      break;
    }
    case "list" /* list */: {
      await platformRun.list({}, args, logger);
      break;
    }
    case "get" /* get */: {
      await platformRun.get({ id: args[0] }, args.slice(1), logger);
      break;
    }
    case "delete" /* delete */: {
      await platformRun.delete({ id: args[0] }, args.slice(1), logger);
      break;
    }
    default:
      throw new BrowserStackError(`Unsupported action: ${action}`);
  }
}
function ensureValidPlatform(inputPlatform) {
  const action = inputPlatform?.toLowerCase?.()?.trim?.();
  if (action && platformCommands.has(action)) {
    return action;
  }
  throw new BrowserStackError(`Invalid platform: ${action}`);
}
function ensureValidAction2(inputAction, validActions = Object.values(PlatformAction)) {
  const action = inputAction?.toLowerCase?.()?.trim?.();
  if (action && validActions.includes(action)) {
    return action;
  }
  throw new BrowserStackError(`Invalid action: ${action}`);
}
async function main2(inputArgs = import_node_process4.default.argv.slice(2), logger = globalThis.console) {
  try {
    ensureAccessKeyExists2(void 0);
    ensureUsernameExists(void 0);
    const args = inputArgs.map((arg) => arg.trim());
    const appPlatformCommand2 = platformCommands.get(
      ensureValidPlatform(args[0])
    );
    if (!appPlatformCommand2) {
      throw new BrowserStackError("Invalid platform");
    }
    const action = ensureValidAction2(args[1]);
    await run(appPlatformCommand2, action, args.slice(2), logger);
  } catch (err2) {
    if (err2 instanceof Error) {
      logger.error(err2.message);
    } else {
      logger.error(`An unexpected error occurred: ${err2}`);
    }
    import_node_process4.default.exit(1);
  }
}
if (import_meta2.url === `file://${import_node_process4.default.argv[1]}`) {
  main2();
}

// ../openapi/generated/automate.client.ts
var GeneratedAutomateClient = class extends APIClient {
  getAutomateBrowsers(options) {
    return this.execute({
      path: "/automate/browsers.json",
      params: void 0,
      requestCodec: "json",
      requestCodecConfig: {},
      responseCodec: "json",
      responseCodecConfig: {},
      baseUrl: "sdk",
      operationId: "getAutomateBrowsers",
      method: "GET",
      signal: options?.signal
    }).then((r) => toCamelCase(r, void 0));
  }
  getAutomatePlan(options) {
    return this.execute({
      path: "/automate/plan.json",
      params: void 0,
      requestCodec: "json",
      requestCodecConfig: {},
      responseCodec: "json",
      responseCodecConfig: {},
      baseUrl: "sdk",
      operationId: "getAutomatePlan",
      method: "GET",
      signal: options?.signal
    }).then((r) => toCamelCase(r, void 0));
  }
  getAutomateSessionAppiumLogs(sessionId, options) {
    return this.execute({
      path: "/automate/sessions/{sessionId}/appiumlogs",
      params: { path: { sessionId } },
      requestCodec: "json",
      requestCodecConfig: {},
      responseCodec: "text",
      responseCodecConfig: {},
      baseUrl: "sdk",
      operationId: "getAutomateSessionAppiumLogs",
      method: "GET",
      signal: options?.signal
    }).then((r) => toCamelCase(r, void 0));
  }
  getAutomateProjectBadgeKey(projectId, options) {
    return this.execute({
      path: "/automate/projects/{projectId}/badge_key",
      params: { path: { projectId } },
      requestCodec: "json",
      requestCodecConfig: {},
      responseCodec: "text",
      responseCodecConfig: {},
      baseUrl: "sdk",
      operationId: "getAutomateProjectBadgeKey",
      method: "GET",
      signal: options?.signal
    }).then((r) => toCamelCase(r, void 0));
  }
  uploadAutomateSessionTerminalLogs(sessionId, body, options) {
    return this.execute({
      path: "/automate/sessions/{sessionId}/terminallogs",
      params: { path: { sessionId } },
      requestInput: toSnakeCase(body, void 0),
      requestCodec: "multipart",
      requestCodecConfig: { "fileField": "file", "filenameFrom": "$.file_name" },
      responseCodec: "json",
      responseCodecConfig: {},
      baseUrl: "sdk",
      operationId: "uploadAutomateSessionTerminalLogs",
      method: "POST",
      signal: options?.signal
    }).then((r) => toCamelCase(r, void 0));
  }
  deleteAutomateBuilds(options) {
    return this.execute({
      path: "/automate/builds",
      params: void 0,
      requestCodec: "json",
      requestCodecConfig: {},
      responseCodec: "json",
      responseCodecConfig: {},
      baseUrl: "sdk",
      operationId: "deleteAutomateBuilds",
      method: "DELETE",
      signal: options?.signal
    }).then((r) => toCamelCase(r, void 0));
  }
  getAutomateSession(sessionId, options) {
    return this.execute({
      path: "/automate/sessions/{sessionId}.json",
      params: { path: { sessionId } },
      requestCodec: "json",
      requestCodecConfig: {},
      responseCodec: "json-unwrap",
      responseCodecConfig: { "path": "$.automation_session" },
      baseUrl: "sdk",
      operationId: "getAutomateSession",
      method: "GET",
      signal: options?.signal
    }).then((r) => toCamelCase(r, void 0));
  }
  updateAutomateSession(sessionId, body, options) {
    return this.execute({
      path: "/automate/sessions/{sessionId}.json",
      params: { path: { sessionId } },
      requestInput: toSnakeCase(body, void 0),
      requestCodec: "json",
      requestCodecConfig: {},
      responseCodec: "json-unwrap",
      responseCodecConfig: { "path": "$.automation_session" },
      baseUrl: "sdk",
      operationId: "updateAutomateSession",
      method: "PUT",
      signal: options?.signal
    }).then((r) => toCamelCase(r, void 0));
  }
  deleteAutomateSession(sessionId, options) {
    return this.execute({
      path: "/automate/sessions/{sessionId}.json",
      params: { path: { sessionId } },
      requestCodec: "json",
      requestCodecConfig: {},
      responseCodec: "json",
      responseCodecConfig: {},
      baseUrl: "sdk",
      operationId: "deleteAutomateSession",
      method: "DELETE",
      signal: options?.signal
    }).then((r) => toCamelCase(r, void 0));
  }
  deleteAutomateSessions(options) {
    return this.execute({
      path: "/automate/sessions",
      params: void 0,
      requestCodec: "json",
      requestCodecConfig: {},
      responseCodec: "json",
      responseCodecConfig: {},
      baseUrl: "sdk",
      operationId: "deleteAutomateSessions",
      method: "DELETE",
      signal: options?.signal
    }).then((r) => toCamelCase(r, void 0));
  }
  deleteAutomateMediaFile(mediaId, options) {
    return this.execute({
      path: "/automate/custom_media/delete/{mediaId}",
      params: { path: { mediaId } },
      requestCodec: "json",
      requestCodecConfig: {},
      responseCodec: "json",
      responseCodecConfig: {},
      baseUrl: "sdk",
      operationId: "deleteAutomateMediaFile",
      method: "DELETE",
      signal: options?.signal
    }).then((r) => toCamelCase(r, void 0));
  }
  getAutomateBuild(buildId, options) {
    return this.execute({
      path: "/automate/builds/{buildId}.json",
      params: { path: { buildId } },
      requestCodec: "json",
      requestCodecConfig: {},
      responseCodec: "json-compose",
      responseCodecConfig: { "base": "$.build.automation_build", "merge": { "sessions": "$.build.sessions[*].automation_session" } },
      baseUrl: "sdk",
      operationId: "getAutomateBuild",
      method: "GET",
      signal: options?.signal
    }).then((r) => toCamelCase(r, void 0));
  }
  updateAutomateBuild(buildId, body, options) {
    return this.execute({
      path: "/automate/builds/{buildId}.json",
      params: { path: { buildId } },
      requestInput: toSnakeCase(body, void 0),
      requestCodec: "json",
      requestCodecConfig: {},
      responseCodec: "json",
      responseCodecConfig: {},
      baseUrl: "sdk",
      operationId: "updateAutomateBuild",
      method: "PUT",
      signal: options?.signal
    }).then((r) => toCamelCase(r, void 0));
  }
  deleteAutomateBuild(buildId, options) {
    return this.execute({
      path: "/automate/builds/{buildId}.json",
      params: { path: { buildId } },
      requestCodec: "json",
      requestCodecConfig: {},
      responseCodec: "json",
      responseCodecConfig: {},
      baseUrl: "sdk",
      operationId: "deleteAutomateBuild",
      method: "DELETE",
      signal: options?.signal
    }).then((r) => toCamelCase(r, void 0));
  }
  getAutomateSessionLogs(sessionId, options) {
    return this.execute({
      path: "/automate/sessions/{sessionId}/logs",
      params: { path: { sessionId } },
      requestCodec: "json",
      requestCodecConfig: {},
      responseCodec: "text",
      responseCodecConfig: {},
      baseUrl: "sdk",
      operationId: "getAutomateSessionLogs",
      method: "GET",
      signal: options?.signal
    }).then((r) => toCamelCase(r, void 0));
  }
  uploadAutomateMediaFile(body, options) {
    return this.execute({
      path: "/automate/upload-media",
      params: void 0,
      requestInput: toSnakeCase(body, void 0),
      requestCodec: "multipart",
      requestCodecConfig: { "fileField": "file", "filenameFrom": "$.file_name" },
      responseCodec: "json",
      responseCodecConfig: {},
      baseUrl: "sdk",
      operationId: "uploadAutomateMediaFile",
      method: "POST",
      signal: options?.signal
    }).then((r) => toCamelCase(r, void 0));
  }
  recycleAutomateKey(body, options) {
    return this.execute({
      path: "/automate/recycle_key.json",
      params: void 0,
      requestInput: toSnakeCase(body, void 0),
      requestCodec: "json",
      requestCodecConfig: {},
      responseCodec: "json",
      responseCodecConfig: {},
      baseUrl: "sdk",
      operationId: "recycleAutomateKey",
      method: "PUT",
      signal: options?.signal
    }).then((r) => toCamelCase(r, void 0));
  }
  getAutomateSessions(buildId, options) {
    return this.execute({
      path: "/automate/builds/{buildId}/sessions.json",
      params: { path: { buildId } },
      requestCodec: "json",
      requestCodecConfig: {},
      responseCodec: "json-unwrap",
      responseCodecConfig: { "path": "$[*].automation_session" },
      baseUrl: "sdk",
      operationId: "getAutomateSessions",
      method: "GET",
      signal: options?.signal
    }).then((r) => toCamelCase(r, void 0));
  }
  getAutomateProject(projectId, options) {
    return this.execute({
      path: "/automate/projects/{projectId}.json",
      params: { path: { projectId } },
      requestCodec: "json",
      requestCodecConfig: {},
      responseCodec: "json-unwrap",
      responseCodecConfig: { "path": "$.project" },
      baseUrl: "sdk",
      operationId: "getAutomateProject",
      method: "GET",
      signal: options?.signal
    }).then((r) => toCamelCase(r, void 0));
  }
  updateAutomateProject(projectId, body, options) {
    return this.execute({
      path: "/automate/projects/{projectId}.json",
      params: { path: { projectId } },
      requestInput: toSnakeCase(body, void 0),
      requestCodec: "json",
      requestCodecConfig: {},
      responseCodec: "json",
      responseCodecConfig: {},
      baseUrl: "sdk",
      operationId: "updateAutomateProject",
      method: "PUT",
      signal: options?.signal
    }).then((r) => toCamelCase(r, void 0));
  }
  deleteAutomateProject(projectId, options) {
    return this.execute({
      path: "/automate/projects/{projectId}.json",
      params: { path: { projectId } },
      requestCodec: "json",
      requestCodecConfig: {},
      responseCodec: "json",
      responseCodecConfig: {},
      baseUrl: "sdk",
      operationId: "deleteAutomateProject",
      method: "DELETE",
      signal: options?.signal
    }).then((r) => toCamelCase(r, void 0));
  }
  getAutomateSessionSeleniumLogs(sessionId, options) {
    return this.execute({
      path: "/automate/sessions/{sessionId}/seleniumlogs",
      params: { path: { sessionId } },
      requestCodec: "json",
      requestCodecConfig: {},
      responseCodec: "text",
      responseCodecConfig: {},
      baseUrl: "sdk",
      operationId: "getAutomateSessionSeleniumLogs",
      method: "GET",
      signal: options?.signal
    }).then((r) => toCamelCase(r, void 0));
  }
  uploadAutomateBuildTerminalLogs(buildId, body, options) {
    return this.execute({
      path: "/automate/builds/{buildId}/terminallogs",
      params: { path: { buildId } },
      requestInput: toSnakeCase(body, void 0),
      requestCodec: "multipart",
      requestCodecConfig: { "fileField": "file", "filenameFrom": "$.file_name" },
      responseCodec: "json",
      responseCodecConfig: {},
      baseUrl: "sdk",
      operationId: "uploadAutomateBuildTerminalLogs",
      method: "POST",
      signal: options?.signal
    }).then((r) => toCamelCase(r, void 0));
  }
  getAutomateMediaFiles(options) {
    return this.execute({
      path: "/automate/recent_media_files",
      params: void 0,
      requestCodec: "json",
      requestCodecConfig: {},
      responseCodec: "json",
      responseCodecConfig: {},
      baseUrl: "sdk",
      operationId: "getAutomateMediaFiles",
      method: "GET",
      signal: options?.signal
    }).then((r) => toCamelCase(r, void 0));
  }
  getAutomateProjects(options) {
    return this.execute({
      path: "/automate/projects.json",
      params: void 0,
      requestCodec: "json",
      requestCodecConfig: {},
      responseCodec: "json",
      responseCodecConfig: {},
      baseUrl: "sdk",
      operationId: "getAutomateProjects",
      method: "GET",
      signal: options?.signal
    }).then((r) => toCamelCase(r, void 0));
  }
  getAutomateSessionConsoleLogs(sessionId, options) {
    return this.execute({
      path: "/automate/sessions/{sessionId}/consolelogs",
      params: { path: { sessionId } },
      requestCodec: "json",
      requestCodecConfig: {},
      responseCodec: "text",
      responseCodecConfig: {},
      baseUrl: "sdk",
      operationId: "getAutomateSessionConsoleLogs",
      method: "GET",
      signal: options?.signal
    }).then((r) => toCamelCase(r, void 0));
  }
  getAutomateSessionTelemetryLogs(sessionId, options) {
    return this.execute({
      path: "/automate/sessions/{sessionId}/telemetrylogs",
      params: { path: { sessionId } },
      requestCodec: "json",
      requestCodecConfig: {},
      responseCodec: "binary",
      responseCodecConfig: {},
      baseUrl: "sdk",
      operationId: "getAutomateSessionTelemetryLogs",
      method: "GET",
      signal: options?.signal
    }).then((r) => toCamelCase(r, void 0));
  }
  getAutomateBuilds(options) {
    return this.execute({
      path: "/automate/builds.json",
      params: void 0,
      requestCodec: "json",
      requestCodecConfig: {},
      responseCodec: "json-unwrap",
      responseCodecConfig: { "path": "$[*].automation_build" },
      baseUrl: "sdk",
      operationId: "getAutomateBuilds",
      method: "GET",
      signal: options?.signal
    }).then((r) => toCamelCase(r, void 0));
  }
  getAutomateSessionNetworkLogs(sessionId, options) {
    return this.execute({
      path: "/automate/sessions/{sessionId}/networklogs",
      params: { path: { sessionId } },
      requestCodec: "json",
      requestCodecConfig: {},
      responseCodec: "json",
      responseCodecConfig: {},
      baseUrl: "sdk",
      operationId: "getAutomateSessionNetworkLogs",
      method: "GET",
      signal: options?.signal
    }).then((r) => toCamelCase(r, void 0));
  }
};

// ../automate/src/index.ts
var AutomateClient = class extends GeneratedAutomateClient {
  constructor(options) {
    super(
      options ?? {},
      options?.baseUrl ?? "https://api.browserstack.com",
      "https://api-cloud.browserstack.com",
      "@browserstack-client/automate",
      "6.0.0"
    );
  }
  deleteBuilds(buildIds, options) {
    return this.execute({
      operationId: "deleteAutomateBuilds",
      method: "DELETE",
      path: "/automate/builds",
      params: { query: { "buildId[]": buildIds } },
      requestCodec: "json",
      requestCodecConfig: {},
      responseCodec: "json",
      responseCodecConfig: {},
      baseUrl: "sdk",
      signal: options?.signal
    });
  }
  deleteSessions(sessionIds, options) {
    return this.execute({
      operationId: "deleteAutomateSessions",
      method: "DELETE",
      path: "/automate/sessions",
      params: { query: { "sessionId[]": sessionIds } },
      requestCodec: "json",
      requestCodecConfig: {},
      responseCodec: "json",
      responseCodecConfig: {},
      baseUrl: "sdk",
      signal: options?.signal
    });
  }
};

// src/browserstack-automate.ts
var import_promises5 = require("fs/promises");
var import_node_path6 = require("path");
var import_node_process5 = __toESM(require("process"), 1);
var import_meta3 = {};
function parseKvArgs(args) {
  const out = {};
  for (const arg of args) {
    const eq = arg.indexOf("=");
    if (eq > 0) {
      out[arg.slice(0, eq)] = arg.slice(eq + 1);
    }
  }
  return out;
}
async function handleBuilds(action, args, opts, logger) {
  const client = new AutomateClient(opts);
  switch (action) {
    case "list": {
      const builds = await client.getAutomateBuilds();
      const list2 = Array.isArray(builds) ? builds : [];
      list2.forEach((b) => logger.info(b.hashedId ?? "", b.name, b.status));
      break;
    }
    case "get": {
      if (!args[0]) throw new BrowserStackError("Missing <buildId>");
      const build = await client.getAutomateBuild(args[0]);
      logger.info(JSON.stringify(build, null, 2));
      break;
    }
    case "update": {
      if (!args[0]) throw new BrowserStackError("Missing <buildId>");
      const kv = parseKvArgs(args.slice(1));
      const result = await client.updateAutomateBuild(args[0], kv);
      logger.info(JSON.stringify(result, null, 2));
      break;
    }
    case "delete": {
      if (!args[0]) throw new BrowserStackError("Missing <buildId>");
      const result = await client.deleteAutomateBuild(args[0]);
      logger.info(JSON.stringify(result, null, 2));
      break;
    }
    case "delete-many": {
      if (!args.length) throw new BrowserStackError("Missing build IDs");
      const result = await client.deleteBuilds(args);
      logger.info(JSON.stringify(result, null, 2));
      break;
    }
    default:
      throw new BrowserStackError(
        `Invalid builds action: ${action} (valid: list, get, update, delete, delete-many)`
      );
  }
}
var LOG_TYPES = ["selenium", "appium", "console", "network", "telemetry"];
function parseLogType(args) {
  const flag = args.find((a) => a.startsWith("--type="));
  if (!flag) return "selenium";
  const t = flag.replace("--type=", "").toLowerCase();
  if (!LOG_TYPES.includes(t)) {
    throw new BrowserStackError(
      `Invalid log type: ${t} (valid: ${LOG_TYPES.join(", ")})`
    );
  }
  return t;
}
async function handleSessions(action, args, opts, logger) {
  const client = new AutomateClient(opts);
  switch (action) {
    case "list": {
      if (!args[0]) throw new BrowserStackError("Missing <buildId>");
      const sessions = await client.getAutomateSessions(args[0]);
      const list2 = Array.isArray(sessions) ? sessions : [];
      list2.forEach((s) => logger.info(s.hashedId ?? "", s.name, s.status));
      break;
    }
    case "get": {
      if (!args[0]) throw new BrowserStackError("Missing <sessionId>");
      const session = await client.getAutomateSession(args[0]);
      logger.info(JSON.stringify(session, null, 2));
      break;
    }
    case "update": {
      if (!args[0]) throw new BrowserStackError("Missing <sessionId>");
      const kv = parseKvArgs(args.slice(1));
      const result = await client.updateAutomateSession(args[0], kv);
      logger.info(JSON.stringify(result, null, 2));
      break;
    }
    case "delete": {
      if (!args[0]) throw new BrowserStackError("Missing <sessionId>");
      const result = await client.deleteAutomateSession(args[0]);
      logger.info(JSON.stringify(result, null, 2));
      break;
    }
    case "delete-many": {
      if (!args.length) throw new BrowserStackError("Missing session IDs");
      const result = await client.deleteSessions(args);
      logger.info(JSON.stringify(result, null, 2));
      break;
    }
    case "logs": {
      if (!args[0]) throw new BrowserStackError("Missing <sessionId>");
      const sessionId = args[0];
      const logType = parseLogType(args.slice(1));
      switch (logType) {
        case "selenium":
          import_node_process5.default.stdout.write(await client.getAutomateSessionLogs(sessionId));
          break;
        case "appium":
          import_node_process5.default.stdout.write(await client.getAutomateSessionAppiumLogs(sessionId));
          break;
        case "console":
          import_node_process5.default.stdout.write(await client.getAutomateSessionConsoleLogs(sessionId));
          break;
        case "network":
          logger.info(JSON.stringify(await client.getAutomateSessionNetworkLogs(sessionId), null, 2));
          break;
        case "telemetry": {
          const buf = await client.getAutomateSessionTelemetryLogs(sessionId);
          import_node_process5.default.stdout.write(Buffer.from(buf));
          break;
        }
      }
      break;
    }
    default:
      throw new BrowserStackError(
        `Invalid sessions action: ${action} (valid: list, get, update, delete, delete-many, logs)`
      );
  }
}
async function handleProjects(action, args, opts, logger) {
  const client = new AutomateClient(opts);
  switch (action) {
    case "list": {
      const projects = await client.getAutomateProjects();
      const list2 = Array.isArray(projects) ? projects : [];
      list2.forEach((p) => {
        const proj = p.project ?? p;
        logger.info(String(proj.id ?? ""), proj.name);
      });
      break;
    }
    case "get": {
      if (!args[0]) throw new BrowserStackError("Missing <projectId>");
      const project = await client.getAutomateProject(args[0]);
      logger.info(JSON.stringify(project, null, 2));
      break;
    }
    case "update": {
      if (!args[0]) throw new BrowserStackError("Missing <projectId>");
      const kv = parseKvArgs(args.slice(1));
      const result = await client.updateAutomateProject(args[0], kv);
      logger.info(JSON.stringify(result, null, 2));
      break;
    }
    case "delete": {
      if (!args[0]) throw new BrowserStackError("Missing <projectId>");
      const result = await client.deleteAutomateProject(args[0]);
      logger.info(JSON.stringify(result, null, 2));
      break;
    }
    case "badge-key": {
      if (!args[0]) throw new BrowserStackError("Missing <projectId>");
      const key = await client.getAutomateProjectBadgeKey(args[0]);
      logger.info(key);
      break;
    }
    default:
      throw new BrowserStackError(
        `Invalid projects action: ${action} (valid: list, get, update, delete, badge-key)`
      );
  }
}
async function handleMedia(action, args, opts, logger) {
  const client = new AutomateClient(opts);
  switch (action) {
    case "list": {
      const files = await client.getAutomateMediaFiles();
      const list2 = Array.isArray(files) ? files : [];
      list2.forEach(
        (f) => logger.info(
          f.mediaUrl ?? "",
          f.uploadedAt ? new Date(f.uploadedAt).toISOString() : "",
          f.mediaName
        )
      );
      break;
    }
    case "upload": {
      if (!args[0]) throw new BrowserStackError("Missing <file-path>");
      const filePath = (0, import_node_path6.resolve)(args[0]);
      const filename = (0, import_node_path6.basename)(filePath);
      const result = await client.uploadAutomateMediaFile({
        file: new Blob([await (0, import_promises5.readFile)(filePath)]),
        fileName: filename
      });
      logger.info(JSON.stringify(result, null, 2));
      break;
    }
    case "delete": {
      if (!args[0]) throw new BrowserStackError("Missing <mediaId>");
      const result = await client.deleteAutomateMediaFile(args[0]);
      logger.info(JSON.stringify(result, null, 2));
      break;
    }
    default:
      throw new BrowserStackError(
        `Invalid media action: ${action} (valid: list, upload, delete)`
      );
  }
}
async function main3(inputArgs = import_node_process5.default.argv.slice(2), logger = globalThis.console) {
  try {
    ensureAccessKeyExists2(void 0);
    ensureUsernameExists(void 0);
    const args = inputArgs.map((a) => a.trim());
    const resource = args[0]?.toLowerCase();
    const action = args[1]?.toLowerCase();
    const rest = args.slice(2);
    const opts = {};
    switch (resource) {
      case "builds":
        if (!action) throw new BrowserStackError("Missing action for builds");
        await handleBuilds(action, rest, opts, logger);
        break;
      case "sessions":
        if (!action) throw new BrowserStackError("Missing action for sessions");
        await handleSessions(action, rest, opts, logger);
        break;
      case "projects":
        if (!action) throw new BrowserStackError("Missing action for projects");
        await handleProjects(action, rest, opts, logger);
        break;
      case "media":
        if (!action) throw new BrowserStackError("Missing action for media");
        await handleMedia(action, rest, opts, logger);
        break;
      case "plan": {
        const client = new AutomateClient(opts);
        const plan = await client.getAutomatePlan();
        logger.info(JSON.stringify(plan, null, 2));
        break;
      }
      case "browsers": {
        const client = new AutomateClient(opts);
        const browsers = await client.getAutomateBrowsers();
        logger.info(JSON.stringify(browsers, null, 2));
        break;
      }
      default:
        throw new BrowserStackError(
          `Invalid resource: ${resource} (valid: builds, sessions, projects, media, plan, browsers)`
        );
    }
  } catch (err2) {
    if (err2 instanceof Error) {
      logger.error(err2.message);
    } else {
      logger.error(`An unexpected error occurred: ${err2}`);
    }
    import_node_process5.default.exit(1);
  }
}
if (import_meta3.url === `file://${import_node_process5.default.argv[1]}`) {
  main3();
}

// src/browserstack-local-testing.ts
var import_node_process6 = __toESM(require("process"), 1);
var import_meta4 = {};
async function main4(inputArgs = import_node_process6.default.argv.slice(2), logger = globalThis.console) {
  try {
    const accessKey = ensureAccessKeyExists2(void 0);
    const client = new LocalTestingClient({ accessKey });
    const args = inputArgs.map((a) => a.trim());
    const resource = args[0]?.toLowerCase();
    const action = args[1]?.toLowerCase();
    const rest = args.slice(2);
    if (resource !== "instances") {
      throw new BrowserStackError(
        `Invalid resource: ${resource} (valid: instances)`
      );
    }
    switch (action) {
      case "list": {
        const instances = await client.getBinaryInstances();
        const list2 = Array.isArray(instances) ? instances : [];
        list2.forEach(
          (inst) => logger.info(inst.id ?? "", inst.localIdentifier ?? "", inst.startTime ?? "")
        );
        break;
      }
      case "get": {
        if (!rest[0]) throw new BrowserStackError("Missing <instanceId>");
        const inst = await client.getBinaryInstance(rest[0]);
        logger.info(JSON.stringify(inst, null, 2));
        break;
      }
      case "disconnect": {
        if (!rest[0]) throw new BrowserStackError("Missing <instanceId>");
        const message = await client.disconnectBinaryInstance(rest[0]);
        logger.info(message);
        break;
      }
      default:
        throw new BrowserStackError(
          `Invalid instances action: ${action} (valid: list, get, disconnect)`
        );
    }
  } catch (err2) {
    if (err2 instanceof Error) {
      logger.error(err2.message);
    } else {
      logger.error(`An unexpected error occurred: ${err2}`);
    }
    import_node_process6.default.exit(1);
  }
}
if (import_meta4.url === `file://${import_node_process6.default.argv[1]}`) {
  main4();
}

// ../openapi/generated/test-management.client.ts
var GeneratedTestManagementClient = class extends APIClient {
  getTestManagementProjects(options) {
    return this.execute({
      path: "/api/v2/projects",
      params: void 0,
      requestCodec: "json",
      requestCodecConfig: {},
      responseCodec: "json-unwrap",
      responseCodecConfig: { "path": "$.projects" },
      baseUrl: "sdk",
      operationId: "getTestManagementProjects",
      method: "GET",
      signal: options?.signal
    }).then((r) => toCamelCase(r, void 0));
  }
  createTestManagementProject(body, options) {
    return this.execute({
      path: "/api/v2/projects",
      params: void 0,
      requestInput: toSnakeCase(body, void 0),
      requestCodec: "json",
      requestCodecConfig: {},
      responseCodec: "json-unwrap",
      responseCodecConfig: { "path": "$.project" },
      baseUrl: "sdk",
      operationId: "createTestManagementProject",
      method: "POST",
      signal: options?.signal
    }).then((r) => toCamelCase(r, void 0));
  }
  getTestManagementProject(projectId, options) {
    return this.execute({
      path: "/api/v2/projects/{projectId}",
      params: { path: { projectId } },
      requestCodec: "json",
      requestCodecConfig: {},
      responseCodec: "json-unwrap",
      responseCodecConfig: { "path": "$.project" },
      baseUrl: "sdk",
      operationId: "getTestManagementProject",
      method: "GET",
      signal: options?.signal
    }).then((r) => toCamelCase(r, void 0));
  }
  updateTestManagementProject(projectId, body, options) {
    return this.execute({
      path: "/api/v2/projects/{projectId}",
      params: { path: { projectId } },
      requestInput: toSnakeCase(body, void 0),
      requestCodec: "json",
      requestCodecConfig: {},
      responseCodec: "json-unwrap",
      responseCodecConfig: { "path": "$.project" },
      baseUrl: "sdk",
      operationId: "updateTestManagementProject",
      method: "PATCH",
      signal: options?.signal
    }).then((r) => toCamelCase(r, void 0));
  }
  deleteTestManagementProject(projectId, options) {
    return this.execute({
      path: "/api/v2/projects/{projectId}",
      params: { path: { projectId } },
      requestCodec: "json",
      requestCodecConfig: {},
      responseCodec: "json",
      responseCodecConfig: {},
      baseUrl: "sdk",
      operationId: "deleteTestManagementProject",
      method: "DELETE",
      signal: options?.signal
    }).then((r) => toCamelCase(r, void 0));
  }
  getTestManagementFolders(projectId, options) {
    return this.execute({
      path: "/api/v2/projects/{projectId}/folders",
      params: { path: { projectId } },
      requestCodec: "json",
      requestCodecConfig: {},
      responseCodec: "json-unwrap",
      responseCodecConfig: { "path": "$.folders" },
      baseUrl: "sdk",
      operationId: "getTestManagementFolders",
      method: "GET",
      signal: options?.signal
    }).then((r) => toCamelCase(r, void 0));
  }
  createTestManagementFolder(projectId, body, options) {
    return this.execute({
      path: "/api/v2/projects/{projectId}/folders",
      params: { path: { projectId } },
      requestInput: toSnakeCase(body, void 0),
      requestCodec: "json",
      requestCodecConfig: {},
      responseCodec: "json-unwrap",
      responseCodecConfig: { "path": "$.folder" },
      baseUrl: "sdk",
      operationId: "createTestManagementFolder",
      method: "POST",
      signal: options?.signal
    }).then((r) => toCamelCase(r, void 0));
  }
  getTestManagementFolder(projectId, folderId, options) {
    return this.execute({
      path: "/api/v2/projects/{projectId}/folders/{folderId}",
      params: { path: { projectId, folderId } },
      requestCodec: "json",
      requestCodecConfig: {},
      responseCodec: "json-unwrap",
      responseCodecConfig: { "path": "$.folder" },
      baseUrl: "sdk",
      operationId: "getTestManagementFolder",
      method: "GET",
      signal: options?.signal
    }).then((r) => toCamelCase(r, void 0));
  }
  updateTestManagementFolder(projectId, folderId, body, options) {
    return this.execute({
      path: "/api/v2/projects/{projectId}/folders/{folderId}",
      params: { path: { projectId, folderId } },
      requestInput: toSnakeCase(body, void 0),
      requestCodec: "json",
      requestCodecConfig: {},
      responseCodec: "json-unwrap",
      responseCodecConfig: { "path": "$.folder" },
      baseUrl: "sdk",
      operationId: "updateTestManagementFolder",
      method: "PATCH",
      signal: options?.signal
    }).then((r) => toCamelCase(r, void 0));
  }
  deleteTestManagementFolder(projectId, folderId, options) {
    return this.execute({
      path: "/api/v2/projects/{projectId}/folders/{folderId}",
      params: { path: { projectId, folderId } },
      requestCodec: "json",
      requestCodecConfig: {},
      responseCodec: "json",
      responseCodecConfig: {},
      baseUrl: "sdk",
      operationId: "deleteTestManagementFolder",
      method: "DELETE",
      signal: options?.signal
    }).then((r) => toCamelCase(r, void 0));
  }
  moveTestManagementFolder(projectId, folderId, body, options) {
    return this.execute({
      path: "/api/v2/projects/{projectId}/folders/{folderId}/move",
      params: { path: { projectId, folderId } },
      requestInput: toSnakeCase(body, void 0),
      requestCodec: "json",
      requestCodecConfig: {},
      responseCodec: "json-unwrap",
      responseCodecConfig: { "path": "$.folder" },
      baseUrl: "sdk",
      operationId: "moveTestManagementFolder",
      method: "POST",
      signal: options?.signal
    }).then((r) => toCamelCase(r, void 0));
  }
  getTestManagementTestCases(projectId, options) {
    return this.execute({
      path: "/api/v2/projects/{projectId}/test-cases",
      params: { path: { projectId } },
      requestCodec: "json",
      requestCodecConfig: {},
      responseCodec: "json-unwrap",
      responseCodecConfig: { "path": "$.test_cases" },
      baseUrl: "sdk",
      operationId: "getTestManagementTestCases",
      method: "GET",
      signal: options?.signal
    }).then((r) => toCamelCase(r, void 0));
  }
  bulkEditTestManagementTestCases(projectId, body, options) {
    return this.execute({
      path: "/api/v2/projects/{projectId}/test-cases",
      params: { path: { projectId } },
      requestInput: toSnakeCase(body, void 0),
      requestCodec: "json",
      requestCodecConfig: {},
      responseCodec: "json",
      responseCodecConfig: {},
      baseUrl: "sdk",
      operationId: "bulkEditTestManagementTestCases",
      method: "PATCH",
      signal: options?.signal
    }).then((r) => toCamelCase(r, void 0));
  }
  bulkDeleteTestManagementTestCases(projectId, body, options) {
    return this.execute({
      path: "/api/v2/projects/{projectId}/test-cases",
      params: { path: { projectId } },
      requestInput: toSnakeCase(body, void 0),
      requestCodec: "json",
      requestCodecConfig: {},
      responseCodec: "json",
      responseCodecConfig: {},
      baseUrl: "sdk",
      operationId: "bulkDeleteTestManagementTestCases",
      method: "DELETE",
      signal: options?.signal
    }).then((r) => toCamelCase(r, void 0));
  }
  bulkArchiveTestManagementTestCases(projectId, body, options) {
    return this.execute({
      path: "/api/v2/projects/{projectId}/test-cases/archive",
      params: { path: { projectId } },
      requestInput: toSnakeCase(body, void 0),
      requestCodec: "json",
      requestCodecConfig: {},
      responseCodec: "json",
      responseCodecConfig: {},
      baseUrl: "sdk",
      operationId: "bulkArchiveTestManagementTestCases",
      method: "POST",
      signal: options?.signal
    }).then((r) => toCamelCase(r, void 0));
  }
  bulkUnarchiveTestManagementTestCases(projectId, body, options) {
    return this.execute({
      path: "/api/v2/projects/{projectId}/test-cases/unarchive",
      params: { path: { projectId } },
      requestInput: toSnakeCase(body, void 0),
      requestCodec: "json",
      requestCodecConfig: {},
      responseCodec: "json",
      responseCodecConfig: {},
      baseUrl: "sdk",
      operationId: "bulkUnarchiveTestManagementTestCases",
      method: "POST",
      signal: options?.signal
    }).then((r) => toCamelCase(r, void 0));
  }
  bulkEditTestManagementTestCasesWithOperations(projectId, body, options) {
    return this.execute({
      path: "/api/v2/projects/{projectId}/test-cases/with-operations",
      params: { path: { projectId } },
      requestInput: toSnakeCase(body, void 0),
      requestCodec: "json",
      requestCodecConfig: {},
      responseCodec: "json",
      responseCodecConfig: {},
      baseUrl: "sdk",
      operationId: "bulkEditTestManagementTestCasesWithOperations",
      method: "PATCH",
      signal: options?.signal
    }).then((r) => toCamelCase(r, void 0));
  }
  createTestManagementTestCase(projectId, folderId, body, options) {
    return this.execute({
      path: "/api/v2/projects/{projectId}/folders/{folderId}/test-cases",
      params: { path: { projectId, folderId } },
      requestInput: toSnakeCase(body, void 0),
      requestCodec: "json",
      requestCodecConfig: {},
      responseCodec: "json-unwrap",
      responseCodecConfig: { "path": "$.data.test_case" },
      baseUrl: "sdk",
      operationId: "createTestManagementTestCase",
      method: "POST",
      signal: options?.signal
    }).then((r) => toCamelCase(r, void 0));
  }
  updateTestManagementTestCase(projectId, testCaseId, body, options) {
    return this.execute({
      path: "/api/v2/projects/{projectId}/test-cases/{testCaseId}",
      params: { path: { projectId, testCaseId } },
      requestInput: toSnakeCase(body, void 0),
      requestCodec: "json",
      requestCodecConfig: {},
      responseCodec: "json-unwrap",
      responseCodecConfig: { "path": "$.data.test_case" },
      baseUrl: "sdk",
      operationId: "updateTestManagementTestCase",
      method: "PATCH",
      signal: options?.signal
    }).then((r) => toCamelCase(r, void 0));
  }
  deleteTestManagementTestCase(projectId, testCaseId, options) {
    return this.execute({
      path: "/api/v2/projects/{projectId}/test-cases/{testCaseId}",
      params: { path: { projectId, testCaseId } },
      requestCodec: "json",
      requestCodecConfig: {},
      responseCodec: "json",
      responseCodecConfig: {},
      baseUrl: "sdk",
      operationId: "deleteTestManagementTestCase",
      method: "DELETE",
      signal: options?.signal
    }).then((r) => toCamelCase(r, void 0));
  }
  archiveTestManagementTestCase(projectId, testCaseId, options) {
    return this.execute({
      path: "/api/v2/projects/{projectId}/test-cases/{testCaseId}/archive",
      params: { path: { projectId, testCaseId } },
      requestCodec: "json",
      requestCodecConfig: {},
      responseCodec: "json-unwrap",
      responseCodecConfig: { "path": "$.data.test_case" },
      baseUrl: "sdk",
      operationId: "archiveTestManagementTestCase",
      method: "POST",
      signal: options?.signal
    }).then((r) => toCamelCase(r, void 0));
  }
  unarchiveTestManagementTestCase(projectId, testCaseId, options) {
    return this.execute({
      path: "/api/v2/projects/{projectId}/test-cases/{testCaseId}/unarchive",
      params: { path: { projectId, testCaseId } },
      requestCodec: "json",
      requestCodecConfig: {},
      responseCodec: "json-unwrap",
      responseCodecConfig: { "path": "$.data.test_case" },
      baseUrl: "sdk",
      operationId: "unarchiveTestManagementTestCase",
      method: "POST",
      signal: options?.signal
    }).then((r) => toCamelCase(r, void 0));
  }
  moveTestManagementTestCase(projectId, testCaseId, body, options) {
    return this.execute({
      path: "/api/v2/projects/{projectId}/test-cases/{testCaseId}/move",
      params: { path: { projectId, testCaseId } },
      requestInput: toSnakeCase(body, void 0),
      requestCodec: "json",
      requestCodecConfig: {},
      responseCodec: "json-unwrap",
      responseCodecConfig: { "path": "$.data.test_case" },
      baseUrl: "sdk",
      operationId: "moveTestManagementTestCase",
      method: "POST",
      signal: options?.signal
    }).then((r) => toCamelCase(r, void 0));
  }
  getTestManagementTestCaseAttachments(projectId, testCaseId, options) {
    return this.execute({
      path: "/api/v2/projects/{projectId}/test-cases/{testCaseId}/attachments",
      params: { path: { projectId, testCaseId } },
      requestCodec: "json",
      requestCodecConfig: {},
      responseCodec: "json-unwrap",
      responseCodecConfig: { "path": "$.attachments" },
      baseUrl: "sdk",
      operationId: "getTestManagementTestCaseAttachments",
      method: "GET",
      signal: options?.signal
    }).then((r) => toCamelCase(r, void 0));
  }
  addTestManagementTestCaseAttachment(projectId, testCaseId, body, options) {
    return this.execute({
      path: "/api/v2/projects/{projectId}/test-cases/{testCaseId}/attachments",
      params: { path: { projectId, testCaseId } },
      requestInput: toSnakeCase(body, void 0),
      requestCodec: "multipart",
      requestCodecConfig: { "fileField": "file", "filenameFrom": "$.file_name" },
      responseCodec: "json-unwrap",
      responseCodecConfig: { "path": "$.attachment" },
      baseUrl: "sdk",
      operationId: "addTestManagementTestCaseAttachment",
      method: "POST",
      signal: options?.signal
    }).then((r) => toCamelCase(r, void 0));
  }
  deleteTestManagementTestCaseAttachment(projectId, testCaseId, attachmentId, options) {
    return this.execute({
      path: "/api/v2/projects/{projectId}/test-cases/{testCaseId}/attachments/{attachmentId}",
      params: { path: { projectId, testCaseId, attachmentId } },
      requestCodec: "json",
      requestCodecConfig: {},
      responseCodec: "json",
      responseCodecConfig: {},
      baseUrl: "sdk",
      operationId: "deleteTestManagementTestCaseAttachment",
      method: "DELETE",
      signal: options?.signal
    }).then((r) => toCamelCase(r, void 0));
  }
  getTestManagementTestCaseResults(projectId, testCaseId, options) {
    return this.execute({
      path: "/api/v2/projects/{projectId}/test-cases/{testCaseId}/results",
      params: { path: { projectId, testCaseId } },
      requestCodec: "json",
      requestCodecConfig: {},
      responseCodec: "json-unwrap",
      responseCodecConfig: { "path": "$.test_results" },
      baseUrl: "sdk",
      operationId: "getTestManagementTestCaseResults",
      method: "GET",
      signal: options?.signal
    }).then((r) => toCamelCase(r, void 0));
  }
  getTestManagementTestRuns(projectId, options) {
    return this.execute({
      path: "/api/v2/projects/{projectId}/test-runs",
      params: { path: { projectId } },
      requestCodec: "json",
      requestCodecConfig: {},
      responseCodec: "json-unwrap",
      responseCodecConfig: { "path": "$.test_runs" },
      baseUrl: "sdk",
      operationId: "getTestManagementTestRuns",
      method: "GET",
      signal: options?.signal
    }).then((r) => toCamelCase(r, void 0));
  }
  createTestManagementTestRun(projectId, body, options) {
    return this.execute({
      path: "/api/v2/projects/{projectId}/test-runs",
      params: { path: { projectId } },
      requestInput: toSnakeCase(body, void 0),
      requestCodec: "json",
      requestCodecConfig: {},
      responseCodec: "json-unwrap",
      responseCodecConfig: { "path": "$.test_run" },
      baseUrl: "sdk",
      operationId: "createTestManagementTestRun",
      method: "POST",
      signal: options?.signal
    }).then((r) => toCamelCase(r, void 0));
  }
  getTestManagementTestRun(projectId, testRunId, options) {
    return this.execute({
      path: "/api/v2/projects/{projectId}/test-runs/{testRunId}",
      params: { path: { projectId, testRunId } },
      requestCodec: "json",
      requestCodecConfig: {},
      responseCodec: "json-unwrap",
      responseCodecConfig: { "path": "$.test_run" },
      baseUrl: "sdk",
      operationId: "getTestManagementTestRun",
      method: "GET",
      signal: options?.signal
    }).then((r) => toCamelCase(r, void 0));
  }
  getTestManagementTestRunTestCases(projectId, testRunId, options) {
    return this.execute({
      path: "/api/v2/projects/{projectId}/test-runs/{testRunId}/test-cases",
      params: { path: { projectId, testRunId } },
      requestCodec: "json",
      requestCodecConfig: {},
      responseCodec: "json-unwrap",
      responseCodecConfig: { "path": "$.test_cases" },
      baseUrl: "sdk",
      operationId: "getTestManagementTestRunTestCases",
      method: "GET",
      signal: options?.signal
    }).then((r) => toCamelCase(r, void 0));
  }
  updateTestManagementTestRun(projectId, testRunId, body, options) {
    return this.execute({
      path: "/api/v2/projects/{projectId}/test-runs/{testRunId}/update",
      params: { path: { projectId, testRunId } },
      requestInput: toSnakeCase(body, void 0),
      requestCodec: "json",
      requestCodecConfig: {},
      responseCodec: "json-unwrap",
      responseCodecConfig: { "path": "$.testrun" },
      baseUrl: "sdk",
      operationId: "updateTestManagementTestRun",
      method: "POST",
      signal: options?.signal
    }).then((r) => toCamelCase(r, void 0));
  }
  patchTestManagementTestRun(projectId, testRunId, body, options) {
    return this.execute({
      path: "/api/v2/projects/{projectId}/test-runs/{testRunId}/update",
      params: { path: { projectId, testRunId } },
      requestInput: toSnakeCase(body, void 0),
      requestCodec: "json",
      requestCodecConfig: {},
      responseCodec: "json-unwrap",
      responseCodecConfig: { "path": "$.testrun" },
      baseUrl: "sdk",
      operationId: "patchTestManagementTestRun",
      method: "PATCH",
      signal: options?.signal
    }).then((r) => toCamelCase(r, void 0));
  }
  assignTestManagementTestRunTestCases(projectId, testRunId, body, options) {
    return this.execute({
      path: "/api/v2/projects/{projectId}/test-runs/{testRunId}/assign",
      params: { path: { projectId, testRunId } },
      requestInput: toSnakeCase(body, void 0),
      requestCodec: "json",
      requestCodecConfig: {},
      responseCodec: "json",
      responseCodecConfig: {},
      baseUrl: "sdk",
      operationId: "assignTestManagementTestRunTestCases",
      method: "POST",
      signal: options?.signal
    }).then((r) => toCamelCase(r, void 0));
  }
  closeTestManagementTestRun(projectId, testRunId, options) {
    return this.execute({
      path: "/api/v2/projects/{projectId}/test-runs/{testRunId}/close",
      params: { path: { projectId, testRunId } },
      requestCodec: "json",
      requestCodecConfig: {},
      responseCodec: "json-unwrap",
      responseCodecConfig: { "path": "$.testrun" },
      baseUrl: "sdk",
      operationId: "closeTestManagementTestRun",
      method: "POST",
      signal: options?.signal
    }).then((r) => toCamelCase(r, void 0));
  }
  deleteTestManagementTestRun(projectId, testRunId, options) {
    return this.execute({
      path: "/api/v2/projects/{projectId}/test-runs/{testRunId}/delete",
      params: { path: { projectId, testRunId } },
      requestCodec: "json",
      requestCodecConfig: {},
      responseCodec: "json",
      responseCodecConfig: {},
      baseUrl: "sdk",
      operationId: "deleteTestManagementTestRun",
      method: "POST",
      signal: options?.signal
    }).then((r) => toCamelCase(r, void 0));
  }
  getTestManagementTestRunResults(projectId, testRunId, options) {
    return this.execute({
      path: "/api/v2/projects/{projectId}/test-runs/{testRunId}/results",
      params: { path: { projectId, testRunId } },
      requestCodec: "json",
      requestCodecConfig: {},
      responseCodec: "json-unwrap",
      responseCodecConfig: { "path": "$.test_results" },
      baseUrl: "sdk",
      operationId: "getTestManagementTestRunResults",
      method: "GET",
      signal: options?.signal
    }).then((r) => toCamelCase(r, void 0));
  }
  addTestManagementTestRunResults(projectId, testRunId, body, options) {
    return this.execute({
      path: "/api/v2/projects/{projectId}/test-runs/{testRunId}/results",
      params: { path: { projectId, testRunId } },
      requestInput: toSnakeCase(body, void 0),
      requestCodec: "json",
      requestCodecConfig: {},
      responseCodec: "json",
      responseCodecConfig: {},
      baseUrl: "sdk",
      operationId: "addTestManagementTestRunResults",
      method: "POST",
      signal: options?.signal
    }).then((r) => toCamelCase(r, void 0));
  }
  getTestManagementTestRunTestCaseResults(projectId, testRunId, testCaseId, options) {
    return this.execute({
      path: "/api/v2/projects/{projectId}/test-runs/{testRunId}/test-cases/{testCaseId}/results",
      params: { path: { projectId, testRunId, testCaseId } },
      requestCodec: "json",
      requestCodecConfig: {},
      responseCodec: "json-unwrap",
      responseCodecConfig: { "path": "$.test_results" },
      baseUrl: "sdk",
      operationId: "getTestManagementTestRunTestCaseResults",
      method: "GET",
      signal: options?.signal
    }).then((r) => toCamelCase(r, void 0));
  }
  getTestManagementTestResultAttachments(projectId, testResultId, options) {
    return this.execute({
      path: "/api/v2/projects/{projectId}/test-results/{testResultId}/attachments",
      params: { path: { projectId, testResultId } },
      requestCodec: "json",
      requestCodecConfig: {},
      responseCodec: "json-unwrap",
      responseCodecConfig: { "path": "$.attachments" },
      baseUrl: "sdk",
      operationId: "getTestManagementTestResultAttachments",
      method: "GET",
      signal: options?.signal
    }).then((r) => toCamelCase(r, void 0));
  }
  addTestManagementTestResultAttachment(projectId, testResultId, body, options) {
    return this.execute({
      path: "/api/v2/projects/{projectId}/test-results/{testResultId}/attachments",
      params: { path: { projectId, testResultId } },
      requestInput: toSnakeCase(body, void 0),
      requestCodec: "multipart",
      requestCodecConfig: { "fileField": "file", "filenameFrom": "$.file_name" },
      responseCodec: "json-unwrap",
      responseCodecConfig: { "path": "$.attachment" },
      baseUrl: "sdk",
      operationId: "addTestManagementTestResultAttachment",
      method: "POST",
      signal: options?.signal
    }).then((r) => toCamelCase(r, void 0));
  }
  deleteTestManagementTestResultAttachment(projectId, testResultId, attachmentId, options) {
    return this.execute({
      path: "/api/v2/projects/{projectId}/test-results/{testResultId}/attachments/{attachmentId}",
      params: { path: { projectId, testResultId, attachmentId } },
      requestCodec: "json",
      requestCodecConfig: {},
      responseCodec: "json",
      responseCodecConfig: {},
      baseUrl: "sdk",
      operationId: "deleteTestManagementTestResultAttachment",
      method: "DELETE",
      signal: options?.signal
    }).then((r) => toCamelCase(r, void 0));
  }
  getTestManagementTestPlans(projectId, options) {
    return this.execute({
      path: "/api/v2/projects/{projectId}/test-plans",
      params: { path: { projectId } },
      requestCodec: "json",
      requestCodecConfig: {},
      responseCodec: "json-unwrap",
      responseCodecConfig: { "path": "$.test_plans" },
      baseUrl: "sdk",
      operationId: "getTestManagementTestPlans",
      method: "GET",
      signal: options?.signal
    }).then((r) => toCamelCase(r, void 0));
  }
  createTestManagementTestPlan(projectId, body, options) {
    return this.execute({
      path: "/api/v2/projects/{projectId}/test-plans",
      params: { path: { projectId } },
      requestInput: toSnakeCase(body, void 0),
      requestCodec: "json",
      requestCodecConfig: {},
      responseCodec: "json-unwrap",
      responseCodecConfig: { "path": "$.test_plan" },
      baseUrl: "sdk",
      operationId: "createTestManagementTestPlan",
      method: "POST",
      signal: options?.signal
    }).then((r) => toCamelCase(r, void 0));
  }
  getTestManagementTestPlan(projectId, testPlanId, options) {
    return this.execute({
      path: "/api/v2/projects/{projectId}/test-plans/{testPlanId}",
      params: { path: { projectId, testPlanId } },
      requestCodec: "json",
      requestCodecConfig: {},
      responseCodec: "json-unwrap",
      responseCodecConfig: { "path": "$.test_plan" },
      baseUrl: "sdk",
      operationId: "getTestManagementTestPlan",
      method: "GET",
      signal: options?.signal
    }).then((r) => toCamelCase(r, void 0));
  }
  updateTestManagementTestPlan(projectId, testPlanId, body, options) {
    return this.execute({
      path: "/api/v2/projects/{projectId}/test-plans/{testPlanId}/update",
      params: { path: { projectId, testPlanId } },
      requestInput: toSnakeCase(body, void 0),
      requestCodec: "json",
      requestCodecConfig: {},
      responseCodec: "json-unwrap",
      responseCodecConfig: { "path": "$.test_plan" },
      baseUrl: "sdk",
      operationId: "updateTestManagementTestPlan",
      method: "POST",
      signal: options?.signal
    }).then((r) => toCamelCase(r, void 0));
  }
  getTestManagementTestPlanTestRuns(projectId, testPlanId, options) {
    return this.execute({
      path: "/api/v2/projects/{projectId}/test-plans/{testPlanId}/test-runs",
      params: { path: { projectId, testPlanId } },
      requestCodec: "json",
      requestCodecConfig: {},
      responseCodec: "json-unwrap",
      responseCodecConfig: { "path": "$.test_runs" },
      baseUrl: "sdk",
      operationId: "getTestManagementTestPlanTestRuns",
      method: "GET",
      signal: options?.signal
    }).then((r) => toCamelCase(r, void 0));
  }
  getTestManagementConfigurations(options) {
    return this.execute({
      path: "/api/v2/configurations",
      params: void 0,
      requestCodec: "json",
      requestCodecConfig: {},
      responseCodec: "json-unwrap",
      responseCodecConfig: { "path": "$.configurations" },
      baseUrl: "sdk",
      operationId: "getTestManagementConfigurations",
      method: "GET",
      signal: options?.signal
    }).then((r) => toCamelCase(r, void 0));
  }
  createTestManagementConfiguration(body, options) {
    return this.execute({
      path: "/api/v2/configurations",
      params: void 0,
      requestInput: toSnakeCase(body, void 0),
      requestCodec: "json",
      requestCodecConfig: {},
      responseCodec: "json",
      responseCodecConfig: {},
      baseUrl: "sdk",
      operationId: "createTestManagementConfiguration",
      method: "POST",
      signal: options?.signal
    }).then((r) => toCamelCase(r, void 0));
  }
  getTestManagementConfiguration(configurationId, options) {
    return this.execute({
      path: "/api/v2/configurations/{configurationId}",
      params: { path: { configurationId } },
      requestCodec: "json",
      requestCodecConfig: {},
      responseCodec: "json-unwrap",
      responseCodecConfig: { "path": "$.configuration" },
      baseUrl: "sdk",
      operationId: "getTestManagementConfiguration",
      method: "GET",
      signal: options?.signal
    }).then((r) => toCamelCase(r, void 0));
  }
  getTestManagementCustomFields(options) {
    return this.execute({
      path: "/api/v2/custom-fields",
      params: void 0,
      requestCodec: "json",
      requestCodecConfig: {},
      responseCodec: "json-unwrap",
      responseCodecConfig: { "path": "$.custom_fields" },
      baseUrl: "sdk",
      operationId: "getTestManagementCustomFields",
      method: "GET",
      signal: options?.signal
    }).then((r) => toCamelCase(r, void 0));
  }
  createTestManagementCustomField(body, options) {
    return this.execute({
      path: "/api/v2/custom-fields",
      params: void 0,
      requestInput: toSnakeCase(body, void 0),
      requestCodec: "json",
      requestCodecConfig: {},
      responseCodec: "json-unwrap",
      responseCodecConfig: { "path": "$.custom_field" },
      baseUrl: "sdk",
      operationId: "createTestManagementCustomField",
      method: "POST",
      signal: options?.signal
    }).then((r) => toCamelCase(r, void 0));
  }
  updateTestManagementCustomField(customFieldId, body, options) {
    return this.execute({
      path: "/api/v2/custom-fields/{customFieldId}",
      params: { path: { customFieldId } },
      requestInput: toSnakeCase(body, void 0),
      requestCodec: "json",
      requestCodecConfig: {},
      responseCodec: "json-unwrap",
      responseCodecConfig: { "path": "$.data.custom_field" },
      baseUrl: "sdk",
      operationId: "updateTestManagementCustomField",
      method: "PATCH",
      signal: options?.signal
    }).then((r) => toCamelCase(r, void 0));
  }
  deleteTestManagementCustomField(customFieldId, options) {
    return this.execute({
      path: "/api/v2/custom-fields/{customFieldId}",
      params: { path: { customFieldId } },
      requestCodec: "json",
      requestCodecConfig: {},
      responseCodec: "json",
      responseCodecConfig: {},
      baseUrl: "sdk",
      operationId: "deleteTestManagementCustomField",
      method: "DELETE",
      signal: options?.signal
    }).then((r) => toCamelCase(r, void 0));
  }
};

// ../test-management/src/index.ts
var TestManagementClient = class extends GeneratedTestManagementClient {
  constructor(options) {
    super(
      options ?? {},
      options?.baseUrl ?? "https://test-management.browserstack.com",
      "https://test-management.browserstack.com",
      "@browserstack-client/test-management",
      "6.0.0"
    );
  }
};

// src/browserstack-test-management.ts
var import_promises6 = require("fs/promises");
var import_node_path7 = require("path");
var import_node_process7 = __toESM(require("process"), 1);
var import_meta5 = {};
async function handleProjects2(action, args, opts, logger) {
  const client = new TestManagementClient(opts);
  switch (action) {
    case "list": {
      const projects = await client.getTestManagementProjects();
      const list2 = Array.isArray(projects) ? projects : [];
      list2.forEach((p) => logger.info(p.identifier ?? "", p.name ?? ""));
      break;
    }
    case "get": {
      if (!args[0]) throw new BrowserStackError("Missing <projectId>");
      const project = await client.getTestManagementProject(args[0]);
      logger.info(JSON.stringify(project, null, 2));
      break;
    }
    case "create": {
      if (!args[0]) throw new BrowserStackError("Missing <name>");
      const result = await client.createTestManagementProject({ project: { name: args[0], description: args[1] } });
      logger.info(JSON.stringify(result, null, 2));
      break;
    }
    case "update": {
      if (!args[0]) throw new BrowserStackError("Missing <projectId>");
      if (!args[1]) throw new BrowserStackError("Missing <name>");
      const result = await client.updateTestManagementProject(args[0], { project: { name: args[1] } });
      logger.info(JSON.stringify(result, null, 2));
      break;
    }
    case "delete": {
      if (!args[0]) throw new BrowserStackError("Missing <projectId>");
      const result = await client.deleteTestManagementProject(args[0]);
      logger.info(JSON.stringify(result, null, 2));
      break;
    }
    default:
      throw new BrowserStackError(
        `Invalid projects action: ${action} (valid: list, get, create, update, delete)`
      );
  }
}
async function handleFolders(action, args, opts, logger) {
  const client = new TestManagementClient(opts);
  switch (action) {
    case "list": {
      if (!args[0]) throw new BrowserStackError("Missing <projectId>");
      const folders = await client.getTestManagementFolders(args[0]);
      const list2 = Array.isArray(folders) ? folders : [];
      list2.forEach((f) => logger.info(String(f.id ?? ""), f.name ?? ""));
      break;
    }
    case "get": {
      if (!args[0]) throw new BrowserStackError("Missing <projectId>");
      if (!args[1]) throw new BrowserStackError("Missing <folderId>");
      const folder = await client.getTestManagementFolder(args[0], Number(args[1]));
      logger.info(JSON.stringify(folder, null, 2));
      break;
    }
    case "create": {
      if (!args[0]) throw new BrowserStackError("Missing <projectId>");
      if (!args[1]) throw new BrowserStackError("Missing <name>");
      const result = await client.createTestManagementFolder(args[0], { folder: { name: args[1], description: args[2] ?? "" } });
      logger.info(JSON.stringify(result, null, 2));
      break;
    }
    case "delete": {
      if (!args[0]) throw new BrowserStackError("Missing <projectId>");
      if (!args[1]) throw new BrowserStackError("Missing <folderId>");
      const result = await client.deleteTestManagementFolder(args[0], Number(args[1]));
      logger.info(JSON.stringify(result, null, 2));
      break;
    }
    default:
      throw new BrowserStackError(
        `Invalid folders action: ${action} (valid: list, get, create, delete)`
      );
  }
}
async function handleTestCases(action, args, opts, logger) {
  const client = new TestManagementClient(opts);
  switch (action) {
    case "list": {
      if (!args[0]) throw new BrowserStackError("Missing <projectId>");
      const cases = await client.getTestManagementTestCases(args[0]);
      const list2 = Array.isArray(cases) ? cases : [];
      list2.forEach((tc) => logger.info(tc.identifier ?? "", tc.name ?? "", tc.status ?? ""));
      break;
    }
    case "create": {
      if (!args[0]) throw new BrowserStackError("Missing <projectId>");
      if (!args[1]) throw new BrowserStackError("Missing <folderId>");
      if (!args[2]) throw new BrowserStackError("Missing <name>");
      const result = await client.createTestManagementTestCase(args[0], Number(args[1]), { testCase: { name: args[2] } });
      logger.info(JSON.stringify(result, null, 2));
      break;
    }
    case "update": {
      if (!args[0]) throw new BrowserStackError("Missing <projectId>");
      if (!args[1]) throw new BrowserStackError("Missing <testCaseId>");
      if (!args[2]) throw new BrowserStackError("Missing <name>");
      const result = await client.updateTestManagementTestCase(args[0], args[1], { testCase: { name: args[2] } });
      logger.info(JSON.stringify(result, null, 2));
      break;
    }
    case "delete": {
      if (!args[0]) throw new BrowserStackError("Missing <projectId>");
      if (!args[1]) throw new BrowserStackError("Missing <testCaseId>");
      const result = await client.deleteTestManagementTestCase(args[0], args[1]);
      logger.info(JSON.stringify(result, null, 2));
      break;
    }
    case "archive": {
      if (!args[0]) throw new BrowserStackError("Missing <projectId>");
      if (!args[1]) throw new BrowserStackError("Missing <testCaseId>");
      const result = await client.archiveTestManagementTestCase(args[0], args[1]);
      logger.info(JSON.stringify(result, null, 2));
      break;
    }
    case "unarchive": {
      if (!args[0]) throw new BrowserStackError("Missing <projectId>");
      if (!args[1]) throw new BrowserStackError("Missing <testCaseId>");
      const result = await client.unarchiveTestManagementTestCase(args[0], args[1]);
      logger.info(JSON.stringify(result, null, 2));
      break;
    }
    case "move": {
      if (!args[0]) throw new BrowserStackError("Missing <projectId>");
      if (!args[1]) throw new BrowserStackError("Missing <testCaseId>");
      if (!args[2]) throw new BrowserStackError("Missing <destinationFolderId>");
      const result = await client.moveTestManagementTestCase(args[0], args[1], { destinationFolderId: Number(args[2]) });
      logger.info(JSON.stringify(result, null, 2));
      break;
    }
    case "attachments": {
      if (!args[0]) throw new BrowserStackError("Missing <projectId>");
      if (!args[1]) throw new BrowserStackError("Missing <testCaseId>");
      const attachments = await client.getTestManagementTestCaseAttachments(args[0], args[1]);
      logger.info(JSON.stringify(attachments, null, 2));
      break;
    }
    case "attach": {
      if (!args[0]) throw new BrowserStackError("Missing <projectId>");
      if (!args[1]) throw new BrowserStackError("Missing <testCaseId>");
      if (!args[2]) throw new BrowserStackError("Missing <file-path>");
      const filePath = (0, import_node_path7.resolve)(args[2]);
      const filename = (0, import_node_path7.basename)(filePath);
      const result = await client.addTestManagementTestCaseAttachment(args[0], args[1], {
        file: new Blob([await (0, import_promises6.readFile)(filePath)]),
        fileName: filename
      });
      logger.info(JSON.stringify(result, null, 2));
      break;
    }
    case "results": {
      if (!args[0]) throw new BrowserStackError("Missing <projectId>");
      if (!args[1]) throw new BrowserStackError("Missing <testCaseId>");
      const results = await client.getTestManagementTestCaseResults(args[0], args[1]);
      logger.info(JSON.stringify(results, null, 2));
      break;
    }
    default:
      throw new BrowserStackError(
        `Invalid test-cases action: ${action} (valid: list, create, update, delete, archive, unarchive, move, attachments, attach, results)`
      );
  }
}
async function handleTestRuns(action, args, opts, logger) {
  const client = new TestManagementClient(opts);
  switch (action) {
    case "list": {
      if (!args[0]) throw new BrowserStackError("Missing <projectId>");
      const runs = await client.getTestManagementTestRuns(args[0]);
      const list2 = Array.isArray(runs) ? runs : [];
      list2.forEach((r) => logger.info(r.identifier ?? "", r.name ?? "", r.runState ?? ""));
      break;
    }
    case "get": {
      if (!args[0]) throw new BrowserStackError("Missing <projectId>");
      if (!args[1]) throw new BrowserStackError("Missing <testRunId>");
      const run2 = await client.getTestManagementTestRun(args[0], args[1]);
      logger.info(JSON.stringify(run2, null, 2));
      break;
    }
    case "create": {
      if (!args[0]) throw new BrowserStackError("Missing <projectId>");
      if (!args[1]) throw new BrowserStackError("Missing <name>");
      const result = await client.createTestManagementTestRun(args[0], { testRun: { name: args[1], includeAll: true } });
      logger.info(JSON.stringify(result, null, 2));
      break;
    }
    case "close": {
      if (!args[0]) throw new BrowserStackError("Missing <projectId>");
      if (!args[1]) throw new BrowserStackError("Missing <testRunId>");
      const result = await client.closeTestManagementTestRun(args[0], args[1]);
      logger.info(JSON.stringify(result, null, 2));
      break;
    }
    case "delete": {
      if (!args[0]) throw new BrowserStackError("Missing <projectId>");
      if (!args[1]) throw new BrowserStackError("Missing <testRunId>");
      const result = await client.deleteTestManagementTestRun(args[0], args[1]);
      logger.info(JSON.stringify(result, null, 2));
      break;
    }
    case "results": {
      if (!args[0]) throw new BrowserStackError("Missing <projectId>");
      if (!args[1]) throw new BrowserStackError("Missing <testRunId>");
      const results = await client.getTestManagementTestRunResults(args[0], args[1]);
      logger.info(JSON.stringify(results, null, 2));
      break;
    }
    default:
      throw new BrowserStackError(
        `Invalid test-runs action: ${action} (valid: list, get, create, close, delete, results)`
      );
  }
}
async function handleTestPlans(action, args, opts, logger) {
  const client = new TestManagementClient(opts);
  switch (action) {
    case "list": {
      if (!args[0]) throw new BrowserStackError("Missing <projectId>");
      const plans = await client.getTestManagementTestPlans(args[0]);
      const list2 = Array.isArray(plans) ? plans : [];
      list2.forEach((p) => logger.info(p.identifier ?? "", p.name ?? "", p.planStatus ?? ""));
      break;
    }
    case "get": {
      if (!args[0]) throw new BrowserStackError("Missing <projectId>");
      if (!args[1]) throw new BrowserStackError("Missing <testPlanId>");
      const plan = await client.getTestManagementTestPlan(args[0], args[1]);
      logger.info(JSON.stringify(plan, null, 2));
      break;
    }
    case "create": {
      if (!args[0]) throw new BrowserStackError("Missing <projectId>");
      if (!args[1]) throw new BrowserStackError("Missing <name>");
      const result = await client.createTestManagementTestPlan(args[0], { testPlan: { name: args[1] } });
      logger.info(JSON.stringify(result, null, 2));
      break;
    }
    default:
      throw new BrowserStackError(
        `Invalid test-plans action: ${action} (valid: list, get, create)`
      );
  }
}
async function handleConfigurations(action, args, opts, logger) {
  const client = new TestManagementClient(opts);
  switch (action) {
    case "list": {
      const configs = await client.getTestManagementConfigurations();
      const list2 = Array.isArray(configs) ? configs : [];
      list2.forEach((c) => logger.info(String(c.id ?? ""), c.name ?? ""));
      break;
    }
    case "get": {
      if (!args[0]) throw new BrowserStackError("Missing <configurationId>");
      const config = await client.getTestManagementConfiguration(args[0]);
      logger.info(JSON.stringify(config, null, 2));
      break;
    }
    case "create": {
      if (!args[0]) throw new BrowserStackError("Missing <name>");
      const result = await client.createTestManagementConfiguration({ name: args[0] });
      logger.info(JSON.stringify(result, null, 2));
      break;
    }
    default:
      throw new BrowserStackError(
        `Invalid configurations action: ${action} (valid: list, get, create)`
      );
  }
}
async function handleCustomFields(action, _args, opts, logger) {
  const client = new TestManagementClient(opts);
  switch (action) {
    case "list": {
      const fields = await client.getTestManagementCustomFields();
      const list2 = Array.isArray(fields) ? fields : [];
      list2.forEach((f) => logger.info(f.id ?? "", f.fieldName ?? "", f.fieldType ?? ""));
      break;
    }
    default:
      throw new BrowserStackError(
        `Invalid custom-fields action: ${action} (valid: list)`
      );
  }
}
async function main5(inputArgs = import_node_process7.default.argv.slice(2), logger = globalThis.console) {
  try {
    ensureAccessKeyExists2(void 0);
    ensureUsernameExists(void 0);
    const args = inputArgs.map((a) => a.trim());
    const resource = args[0]?.toLowerCase();
    const action = args[1]?.toLowerCase();
    const rest = args.slice(2);
    const opts = {};
    switch (resource) {
      case "projects":
        if (!action) throw new BrowserStackError("Missing action for projects");
        await handleProjects2(action, rest, opts, logger);
        break;
      case "folders":
        if (!action) throw new BrowserStackError("Missing action for folders");
        await handleFolders(action, rest, opts, logger);
        break;
      case "test-cases":
        if (!action) throw new BrowserStackError("Missing action for test-cases");
        await handleTestCases(action, rest, opts, logger);
        break;
      case "test-runs":
        if (!action) throw new BrowserStackError("Missing action for test-runs");
        await handleTestRuns(action, rest, opts, logger);
        break;
      case "test-plans":
        if (!action) throw new BrowserStackError("Missing action for test-plans");
        await handleTestPlans(action, rest, opts, logger);
        break;
      case "configurations":
        if (!action) throw new BrowserStackError("Missing action for configurations");
        await handleConfigurations(action, rest, opts, logger);
        break;
      case "custom-fields":
        if (!action) throw new BrowserStackError("Missing action for custom-fields");
        await handleCustomFields(action, rest, opts, logger);
        break;
      default:
        import_node_process7.default.stderr.write(
          `Invalid or missing resource: ${resource ?? "(none)"} (valid: projects, folders, test-cases, test-runs, test-plans, configurations, custom-fields)
`
        );
        import_node_process7.default.exit(1);
    }
  } catch (err2) {
    logger.error(err2 instanceof Error ? err2.message : String(err2));
    import_node_process7.default.exit(1);
  }
}
if (import_meta5.url === `file://${import_node_process7.default.argv[1]}`) {
  main5();
}

// ../openapi/generated/accessibility.client.ts
var GeneratedAccessibilityClient = class extends APIClient {
  getAccessibilityWorkflowAnalyzerReports(options) {
    return this.execute({
      path: "/api/workflow-analyzer/v1/reports",
      params: void 0,
      requestCodec: "json",
      requestCodecConfig: {},
      responseCodec: "json",
      responseCodecConfig: {},
      baseUrl: "sdk",
      operationId: "getAccessibilityWorkflowAnalyzerReports",
      method: "GET",
      signal: options?.signal
    }).then((r) => toCamelCase(r, void 0));
  }
  getAccessibilityWorkflowAnalyzerReportSummary(reportId, options) {
    return this.execute({
      path: "/api/workflow-analyzer/v1/reports/{report_id}",
      params: { path: { report_id: reportId } },
      requestCodec: "json",
      requestCodecConfig: {},
      responseCodec: "json",
      responseCodecConfig: {},
      baseUrl: "sdk",
      operationId: "getAccessibilityWorkflowAnalyzerReportSummary",
      method: "GET",
      signal: options?.signal
    }).then((r) => toCamelCase(r, void 0));
  }
  getAccessibilityWorkflowAnalyzerReportIssues(options) {
    return this.execute({
      path: "/api/workflow-analyzer/v1/reports/issues",
      params: void 0,
      requestCodec: "json",
      requestCodecConfig: {},
      responseCodec: "json",
      responseCodecConfig: {},
      baseUrl: "sdk",
      operationId: "getAccessibilityWorkflowAnalyzerReportIssues",
      method: "GET",
      signal: options?.signal
    }).then((r) => toCamelCase(r, void 0));
  }
  getAccessibilityAssistedTestReports(options) {
    return this.execute({
      path: "/api/assisted-test/v1/reports",
      params: void 0,
      requestCodec: "json",
      requestCodecConfig: {},
      responseCodec: "json",
      responseCodecConfig: {},
      baseUrl: "sdk",
      operationId: "getAccessibilityAssistedTestReports",
      method: "GET",
      signal: options?.signal
    }).then((r) => toCamelCase(r, void 0));
  }
  getAccessibilityAssistedTestReportSummary(reportId, options) {
    return this.execute({
      path: "/api/assisted-test/v1/reports/{report_id}",
      params: { path: { report_id: reportId } },
      requestCodec: "json",
      requestCodecConfig: {},
      responseCodec: "json",
      responseCodecConfig: {},
      baseUrl: "sdk",
      operationId: "getAccessibilityAssistedTestReportSummary",
      method: "GET",
      signal: options?.signal
    }).then((r) => toCamelCase(r, void 0));
  }
  getAccessibilityAssistedTestReportIssues(options) {
    return this.execute({
      path: "/api/assisted-test/v1/reports/issues",
      params: void 0,
      requestCodec: "json",
      requestCodecConfig: {},
      responseCodec: "json",
      responseCodecConfig: {},
      baseUrl: "sdk",
      operationId: "getAccessibilityAssistedTestReportIssues",
      method: "GET",
      signal: options?.signal
    }).then((r) => toCamelCase(r, void 0));
  }
  getAccessibilityWebsiteScannerAuthConfigs(options) {
    return this.execute({
      path: "/api/website-scanner/v1/auth_configs",
      params: void 0,
      requestCodec: "json",
      requestCodecConfig: {},
      responseCodec: "json-unwrap",
      responseCodecConfig: { "path": "$.data.authConfigs" },
      baseUrl: "sdk",
      operationId: "getAccessibilityWebsiteScannerAuthConfigs",
      method: "GET",
      signal: options?.signal
    }).then((r) => toCamelCase(r, void 0));
  }
  createAccessibilityWebsiteScannerAuthConfig(body, options) {
    return this.execute({
      path: "/api/website-scanner/v1/auth_configs",
      params: void 0,
      requestInput: toSnakeCase(body, void 0),
      requestCodec: "json",
      requestCodecConfig: {},
      responseCodec: "json-unwrap",
      responseCodecConfig: { "path": "$.data" },
      baseUrl: "sdk",
      operationId: "createAccessibilityWebsiteScannerAuthConfig",
      method: "POST",
      signal: options?.signal
    }).then((r) => toCamelCase(r, void 0));
  }
  getAccessibilityWebsiteScannerScans(options) {
    return this.execute({
      path: "/api/website-scanner/v1/scans",
      params: void 0,
      requestCodec: "json",
      requestCodecConfig: {},
      responseCodec: "json",
      responseCodecConfig: {},
      baseUrl: "sdk",
      operationId: "getAccessibilityWebsiteScannerScans",
      method: "GET",
      signal: options?.signal
    }).then((r) => toCamelCase(r, void 0));
  }
  createAccessibilityWebsiteScannerScan(body, options) {
    return this.execute({
      path: "/api/website-scanner/v1/scans",
      params: void 0,
      requestInput: toSnakeCase(body, void 0),
      requestCodec: "json",
      requestCodecConfig: {},
      responseCodec: "json-unwrap",
      responseCodecConfig: { "path": "$.data" },
      baseUrl: "sdk",
      operationId: "createAccessibilityWebsiteScannerScan",
      method: "POST",
      signal: options?.signal
    }).then((r) => toCamelCase(r, void 0));
  }
  getAccessibilityWebsiteScannerScanOverview(scanId, options) {
    return this.execute({
      path: "/api/website-scanner/v1/scans/{scan_id}/overview",
      params: { path: { scan_id: scanId } },
      requestCodec: "json",
      requestCodecConfig: {},
      responseCodec: "json-unwrap",
      responseCodecConfig: { "path": "$.data" },
      baseUrl: "sdk",
      operationId: "getAccessibilityWebsiteScannerScanOverview",
      method: "GET",
      signal: options?.signal
    }).then((r) => toCamelCase(r, void 0));
  }
  getAccessibilityWebsiteScannerScanRuns(scanId, options) {
    return this.execute({
      path: "/api/website-scanner/v1/scans/{scan_id}/scan_runs",
      params: { path: { scan_id: scanId } },
      requestCodec: "json",
      requestCodecConfig: {},
      responseCodec: "json",
      responseCodecConfig: {},
      baseUrl: "sdk",
      operationId: "getAccessibilityWebsiteScannerScanRuns",
      method: "GET",
      signal: options?.signal
    }).then((r) => toCamelCase(r, void 0));
  }
  getAccessibilityWebsiteScannerScanRunSummary(scanId, scanRunId, options) {
    return this.execute({
      path: "/api/website-scanner/v1/scans/{scan_id}/scan_runs/{scan_run_id}",
      params: { path: { scan_id: scanId, scan_run_id: scanRunId } },
      requestCodec: "json",
      requestCodecConfig: {},
      responseCodec: "json",
      responseCodecConfig: {},
      baseUrl: "sdk",
      operationId: "getAccessibilityWebsiteScannerScanRunSummary",
      method: "GET",
      signal: options?.signal
    }).then((r) => toCamelCase(r, void 0));
  }
  getAccessibilityWebsiteScannerScanRunStatus(scanId, scanRunId, options) {
    return this.execute({
      path: "/api/website-scanner/v1/scans/{scan_id}/scan_runs/{scan_run_id}/status",
      params: { path: { scan_id: scanId, scan_run_id: scanRunId } },
      requestCodec: "json",
      requestCodecConfig: {},
      responseCodec: "json-unwrap",
      responseCodecConfig: { "path": "$.data" },
      baseUrl: "sdk",
      operationId: "getAccessibilityWebsiteScannerScanRunStatus",
      method: "GET",
      signal: options?.signal
    }).then((r) => toCamelCase(r, void 0));
  }
  getAccessibilityWebsiteScannerScanRunIssues(scanId, options) {
    return this.execute({
      path: "/api/website-scanner/v1/scans/{scan_id}/scan_runs/issues",
      params: { path: { scan_id: scanId } },
      requestCodec: "json",
      requestCodecConfig: {},
      responseCodec: "json",
      responseCodecConfig: {},
      baseUrl: "sdk",
      operationId: "getAccessibilityWebsiteScannerScanRunIssues",
      method: "GET",
      signal: options?.signal
    }).then((r) => toCamelCase(r, void 0));
  }
  getAccessibilityWebsiteScannerScanRunLogs(scanId, scanRunId, options) {
    return this.execute({
      path: "/api/website-scanner/v1/scans/{scan_id}/scan_runs/{scan_run_id}/scan_logs",
      params: { path: { scan_id: scanId, scan_run_id: scanRunId } },
      requestCodec: "json",
      requestCodecConfig: {},
      responseCodec: "json-unwrap",
      responseCodecConfig: { "path": "$.data" },
      baseUrl: "sdk",
      operationId: "getAccessibilityWebsiteScannerScanRunLogs",
      method: "GET",
      signal: options?.signal
    }).then((r) => toCamelCase(r, void 0));
  }
  getAccessibilityAutomatedTestProjects(options) {
    return this.execute({
      path: "/api/automated-tests/v1/projects",
      params: void 0,
      requestCodec: "json",
      requestCodecConfig: {},
      responseCodec: "json",
      responseCodecConfig: {},
      baseUrl: "sdk",
      operationId: "getAccessibilityAutomatedTestProjects",
      method: "GET",
      signal: options?.signal
    }).then((r) => toCamelCase(r, void 0));
  }
  getAccessibilityAutomatedTestBuilds(options) {
    return this.execute({
      path: "/api/automated-tests/v1/builds",
      params: void 0,
      requestCodec: "json",
      requestCodecConfig: {},
      responseCodec: "json",
      responseCodecConfig: {},
      baseUrl: "sdk",
      operationId: "getAccessibilityAutomatedTestBuilds",
      method: "GET",
      signal: options?.signal
    }).then((r) => toCamelCase(r, void 0));
  }
  getAccessibilityAutomatedTestBuildTestCases(thBuildId, options) {
    return this.execute({
      path: "/api/automated-tests/v1/builds/{thBuildId}/test-cases",
      params: { path: { thBuildId } },
      requestCodec: "json",
      requestCodecConfig: {},
      responseCodec: "json-unwrap",
      responseCodecConfig: { "path": "$.testCases" },
      baseUrl: "sdk",
      operationId: "getAccessibilityAutomatedTestBuildTestCases",
      method: "GET",
      signal: options?.signal
    }).then((r) => toCamelCase(r, void 0));
  }
  getAccessibilityAutomatedTestBuildSummary(thBuildId, options) {
    return this.execute({
      path: "/api/automated-tests/v1/builds/{thBuildId}",
      params: { path: { thBuildId } },
      requestCodec: "json",
      requestCodecConfig: {},
      responseCodec: "json-unwrap",
      responseCodecConfig: { "path": "$.data" },
      baseUrl: "sdk",
      operationId: "getAccessibilityAutomatedTestBuildSummary",
      method: "GET",
      signal: options?.signal
    }).then((r) => toCamelCase(r, void 0));
  }
  getAccessibilityAutomatedTestBuildIssues(options) {
    return this.execute({
      path: "/api/automated-tests/v1/builds/issues",
      params: void 0,
      requestCodec: "json",
      requestCodecConfig: {},
      responseCodec: "json",
      responseCodecConfig: {},
      baseUrl: "sdk",
      operationId: "getAccessibilityAutomatedTestBuildIssues",
      method: "GET",
      signal: options?.signal
    }).then((r) => toCamelCase(r, void 0));
  }
  getAccessibilityAutomatedTestBuildTestCaseSummary(thBuildId, testCaseId, options) {
    return this.execute({
      path: "/api/automated-tests/v1/builds/{thBuildId}/test-cases/{test_case_id}",
      params: { path: { thBuildId, test_case_id: testCaseId } },
      requestCodec: "json",
      requestCodecConfig: {},
      responseCodec: "json-unwrap",
      responseCodecConfig: { "path": "$.data" },
      baseUrl: "sdk",
      operationId: "getAccessibilityAutomatedTestBuildTestCaseSummary",
      method: "GET",
      signal: options?.signal
    }).then((r) => toCamelCase(r, void 0));
  }
  getAccessibilityAutomatedTestBuildTestCaseIssues(thBuildId, options) {
    return this.execute({
      path: "/api/automated-tests/v1/builds/{thBuildId}/issues",
      params: { path: { thBuildId } },
      requestCodec: "json",
      requestCodecConfig: {},
      responseCodec: "json",
      responseCodecConfig: {},
      baseUrl: "sdk",
      operationId: "getAccessibilityAutomatedTestBuildTestCaseIssues",
      method: "GET",
      signal: options?.signal
    }).then((r) => toCamelCase(r, void 0));
  }
};

// ../accessibility/src/index.ts
var AccessibilityClient = class extends GeneratedAccessibilityClient {
  constructor(options) {
    super(
      options ?? {},
      options?.baseUrl ?? "https://api-accessibility.browserstack.com",
      "https://api-accessibility.browserstack.com",
      "@browserstack-client/accessibility",
      "6.0.0"
    );
  }
};

// src/browserstack-accessibility.ts
var import_node_process8 = __toESM(require("process"), 1);
async function handleWorkflowAnalyzer(action, args, opts, logger) {
  const client = new AccessibilityClient(opts);
  switch (action) {
    case "list": {
      const result = await client.getAccessibilityWorkflowAnalyzerReports();
      logger.info(JSON.stringify(result, null, 2));
      break;
    }
    case "get": {
      if (!args[0]) throw new BrowserStackError("Missing <report_id>");
      const result = await client.getAccessibilityWorkflowAnalyzerReportSummary(Number(args[0]));
      logger.info(JSON.stringify(result, null, 2));
      break;
    }
    case "issues": {
      const result = await client.getAccessibilityWorkflowAnalyzerReportIssues();
      logger.info(JSON.stringify(result, null, 2));
      break;
    }
    default:
      throw new BrowserStackError(
        `Invalid workflow-analyzer action: ${action} (valid: list, get, issues)`
      );
  }
}
async function handleAssistedTest(action, args, opts, logger) {
  const client = new AccessibilityClient(opts);
  switch (action) {
    case "list": {
      const result = await client.getAccessibilityAssistedTestReports();
      logger.info(JSON.stringify(result, null, 2));
      break;
    }
    case "get": {
      if (!args[0]) throw new BrowserStackError("Missing <report_id>");
      const result = await client.getAccessibilityAssistedTestReportSummary(Number(args[0]));
      logger.info(JSON.stringify(result, null, 2));
      break;
    }
    case "issues": {
      const result = await client.getAccessibilityAssistedTestReportIssues();
      logger.info(JSON.stringify(result, null, 2));
      break;
    }
    default:
      throw new BrowserStackError(
        `Invalid assisted-test action: ${action} (valid: list, get, issues)`
      );
  }
}
async function handleWebsiteScanner(action, args, opts, logger) {
  const client = new AccessibilityClient(opts);
  switch (action) {
    case "list-configs": {
      const result = await client.getAccessibilityWebsiteScannerAuthConfigs();
      logger.info(JSON.stringify(result, null, 2));
      break;
    }
    case "list-scans": {
      const result = await client.getAccessibilityWebsiteScannerScans();
      logger.info(JSON.stringify(result, null, 2));
      break;
    }
    case "get-scan": {
      if (!args[0]) throw new BrowserStackError("Missing <scan_id>");
      const result = await client.getAccessibilityWebsiteScannerScanOverview(Number(args[0]));
      logger.info(JSON.stringify(result, null, 2));
      break;
    }
    case "list-runs": {
      if (!args[0]) throw new BrowserStackError("Missing <scan_id>");
      const result = await client.getAccessibilityWebsiteScannerScanRuns(Number(args[0]));
      logger.info(JSON.stringify(result, null, 2));
      break;
    }
    case "get-run": {
      if (!args[0]) throw new BrowserStackError("Missing <scan_id>");
      if (!args[1]) throw new BrowserStackError("Missing <scan_run_id>");
      const result = await client.getAccessibilityWebsiteScannerScanRunSummary(Number(args[0]), Number(args[1]));
      logger.info(JSON.stringify(result, null, 2));
      break;
    }
    case "status": {
      if (!args[0]) throw new BrowserStackError("Missing <scan_id>");
      if (!args[1]) throw new BrowserStackError("Missing <scan_run_id>");
      const result = await client.getAccessibilityWebsiteScannerScanRunStatus(Number(args[0]), Number(args[1]));
      logger.info(JSON.stringify(result, null, 2));
      break;
    }
    case "issues": {
      if (!args[0]) throw new BrowserStackError("Missing <scan_id>");
      const result = await client.getAccessibilityWebsiteScannerScanRunIssues(Number(args[0]));
      logger.info(JSON.stringify(result, null, 2));
      break;
    }
    case "logs": {
      if (!args[0]) throw new BrowserStackError("Missing <scan_id>");
      if (!args[1]) throw new BrowserStackError("Missing <scan_run_id>");
      const result = await client.getAccessibilityWebsiteScannerScanRunLogs(Number(args[0]), Number(args[1]));
      logger.info(JSON.stringify(result, null, 2));
      break;
    }
    default:
      throw new BrowserStackError(
        `Invalid website-scanner action: ${action} (valid: list-configs, list-scans, get-scan, list-runs, get-run, status, issues, logs)`
      );
  }
}
async function handleAutomatedTests(action, args, opts, logger) {
  const client = new AccessibilityClient(opts);
  switch (action) {
    case "list-projects": {
      const result = await client.getAccessibilityAutomatedTestProjects();
      logger.info(JSON.stringify(result, null, 2));
      break;
    }
    case "list-builds": {
      const result = await client.getAccessibilityAutomatedTestBuilds();
      logger.info(JSON.stringify(result, null, 2));
      break;
    }
    case "list-test-cases": {
      if (!args[0]) throw new BrowserStackError("Missing <thBuildId>");
      const result = await client.getAccessibilityAutomatedTestBuildTestCases(args[0]);
      logger.info(JSON.stringify(result, null, 2));
      break;
    }
    case "get-build": {
      if (!args[0]) throw new BrowserStackError("Missing <thBuildId>");
      const result = await client.getAccessibilityAutomatedTestBuildSummary(args[0]);
      logger.info(JSON.stringify(result, null, 2));
      break;
    }
    case "build-issues": {
      const result = await client.getAccessibilityAutomatedTestBuildIssues();
      logger.info(JSON.stringify(result, null, 2));
      break;
    }
    case "get-test-case": {
      if (!args[0]) throw new BrowserStackError("Missing <thBuildId>");
      if (!args[1]) throw new BrowserStackError("Missing <testCaseId>");
      const result = await client.getAccessibilityAutomatedTestBuildTestCaseSummary(args[0], args[1]);
      logger.info(JSON.stringify(result, null, 2));
      break;
    }
    case "test-case-issues": {
      if (!args[0]) throw new BrowserStackError("Missing <thBuildId>");
      const result = await client.getAccessibilityAutomatedTestBuildTestCaseIssues(args[0]);
      logger.info(JSON.stringify(result, null, 2));
      break;
    }
    default:
      throw new BrowserStackError(
        `Invalid automated-tests action: ${action} (valid: list-projects, list-builds, list-test-cases, get-build, build-issues, get-test-case, test-case-issues)`
      );
  }
}
async function main6(args) {
  const logger = {
    info: (msg, ...params) => console.log(msg, ...params),
    error: (msg, ...params) => console.error(msg, ...params)
  };
  try {
    const username = ensureUsernameExists();
    const accessKey = ensureAccessKeyExists2();
    const opts = { username, accessKey };
    const area = args[0]?.toLowerCase();
    const action = args[1]?.toLowerCase();
    const remainingArgs = args.slice(2);
    if (!area) {
      throw new BrowserStackError(
        "Missing product area (workflow-analyzer, assisted-test, website-scanner, automated-tests)"
      );
    }
    if (!action) {
      throw new BrowserStackError("Missing action");
    }
    switch (area) {
      case "workflow-analyzer":
        await handleWorkflowAnalyzer(action, remainingArgs, opts, logger);
        break;
      case "assisted-test":
        await handleAssistedTest(action, remainingArgs, opts, logger);
        break;
      case "website-scanner":
        await handleWebsiteScanner(action, remainingArgs, opts, logger);
        break;
      case "automated-tests":
        await handleAutomatedTests(action, remainingArgs, opts, logger);
        break;
      default:
        throw new BrowserStackError(
          `Invalid product area: ${area} (valid: workflow-analyzer, assisted-test, website-scanner, automated-tests)`
        );
    }
  } catch (error) {
    if (error instanceof BrowserStackError) {
      logger.error(error.message);
    } else {
      logger.error("An unexpected error occurred:", error);
    }
    import_node_process8.default.exit(1);
  }
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
var import_promises7 = require("fs/promises");
var import_node_path8 = require("path");
var import_node_process9 = __toESM(require("process"), 1);
var import_meta6 = {};
async function handleProjects3(action, _args, opts, logger) {
  const client = new TestReportingClient(opts);
  switch (action) {
    case "list": {
      const projects = await client.getTestReportingProjects();
      const list2 = Array.isArray(projects) ? projects : [];
      list2.forEach((p) => logger.info(p.id ?? "", p.name ?? ""));
      break;
    }
    default:
      throw new BrowserStackError(
        `Invalid projects action: ${action} (valid: list)`
      );
  }
}
async function handleBuilds2(action, args, opts, logger) {
  const client = new TestReportingClient(opts);
  switch (action) {
    case "list": {
      const builds = await client.getTestReportingBuilds();
      const list2 = Array.isArray(builds) ? builds : [];
      list2.forEach((b) => logger.info(b.id ?? "", b.name ?? "", b.status ?? ""));
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
      const filePath = (0, import_node_path8.resolve)(args[0]);
      const data = await (0, import_promises7.readFile)(filePath);
      const filename = (0, import_node_path8.basename)(filePath);
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
async function main7(inputArgs = import_node_process9.default.argv.slice(2), logger = globalThis.console) {
  try {
    ensureAccessKeyExists2(void 0);
    ensureUsernameExists(void 0);
    const args = inputArgs.map((a) => a.trim());
    const resource = args[0]?.toLowerCase();
    const action = args[1]?.toLowerCase();
    const rest = args.slice(2);
    const opts = {};
    switch (resource) {
      case "projects":
        if (!action) throw new BrowserStackError("Missing action for projects");
        await handleProjects3(action, rest, opts, logger);
        break;
      case "builds":
        if (!action) throw new BrowserStackError("Missing action for builds");
        await handleBuilds2(action, rest, opts, logger);
        break;
      case "upload":
        if (!action) throw new BrowserStackError("Missing action for upload");
        await handleUpload(action, rest, opts, logger);
        break;
      default:
        import_node_process9.default.stderr.write(
          `Invalid or missing resource: ${resource ?? "(none)"} (valid: projects, builds, upload)
`
        );
        import_node_process9.default.exit(1);
    }
  } catch (err2) {
    logger.error(err2 instanceof Error ? err2.message : String(err2));
    import_node_process9.default.exit(1);
  }
}
var isMain = import_meta6.url === `file://${import_node_process9.default.argv[1]}` || import_meta6.url === `file://${(0, import_node_path8.resolve)(import_node_process9.default.argv[1])}` || true;
if (isMain) {
  main7();
}

// src/browserstack-client.ts
var products = {
  local: main,
  "app-automate": main2,
  automate: main3,
  "local-testing": main4,
  "test-management": main5,
  accessibility: main6,
  "test-reporting": main7
};
async function main8(inputArgs = import_node_process10.default.argv.slice(2)) {
  const product = inputArgs[0]?.toLowerCase().trim();
  if (!product || !products[product]) {
    const valid = Object.keys(products).join(", ");
    import_node_process10.default.stderr.write(
      `Invalid or missing product: ${product ?? "(none)"} (valid: ${valid})
`
    );
    import_node_process10.default.exit(1);
  }
  await products[product](inputArgs.slice(1));
}
main8();
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  main
});
