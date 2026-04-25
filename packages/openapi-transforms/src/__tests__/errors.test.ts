import { describe, expect, it } from "vitest";
import {
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
  type CodecContext,
  type ErrorBody,
} from "../errors";

const ctx: CodecContext = {
  operationId: "getFoo",
  method: "GET",
  url: "https://api.example.com/foo",
};

describe("OpenAPIError", () => {
  it("captures kind, operationId, method, url, cause", () => {
    const cause = new Error("root");
    const e = new OpenAPIError("client", "boom", ctx, cause);
    expect(e.kind).toBe("client");
    expect(e.operationId).toBe("getFoo");
    expect(e.method).toBe("GET");
    expect(e.url).toBe("https://api.example.com/foo");
    expect(e.cause).toBe(cause);
    expect(e.message).toBe("boom");
    expect(e.name).toBe("OpenAPIError");
    expect(e instanceof Error).toBe(true);
  });
});

describe("NetworkError", () => {
  it("sets kind to 'network' and requires cause", () => {
    const cause = new Error("ECONNREFUSED");
    const e = new NetworkError("connection refused", ctx, cause);
    expect(e.kind).toBe("network");
    expect(e.name).toBe("NetworkError");
    expect(e.cause).toBe(cause);
    expect(e instanceof OpenAPIError).toBe(true);
  });
});

describe("HttpError", () => {
  it("has non-optional status/statusText/headers and typed body", () => {
    const body: ErrorBody<{ error: string }> = {
      contentType: "application/json",
      text: '{"error":"nope"}',
      parsed: { error: "nope" },
      truncated: false,
    };
    const e = new HttpError<{ error: string }>("Not found", ctx, {
      status: 404,
      statusText: "Not Found",
      headers: new Headers({ "content-type": "application/json" }),
      requestId: "abc",
      body,
      retryable: false,
    });
    expect(e.kind).toBe("http");
    expect(e.status).toBe(404);
    expect(e.body.parsed?.error).toBe("nope");
    expect(e.retryable).toBe(false);
    expect(e.headers.get("content-type")).toBe("application/json");
  });
});

describe("DecodeError", () => {
  it("carries HTTP fields + codecName", () => {
    const e = new DecodeError("bad json", ctx, {
      status: 200,
      statusText: "OK",
      headers: new Headers(),
      codecName: "json",
      cause: new Error("x"),
    });
    expect(e.kind).toBe("decode");
    expect(e.codecName).toBe("json");
    expect(e.status).toBe(200);
  });
});

describe("TransformError", () => {
  it("carries status + codecName + optional path", () => {
    const e = new TransformError("path missing", ctx, {
      status: 200,
      statusText: "OK",
      codecName: "json-unwrap",
      path: "$.project",
      cause: new Error("x"),
    });
    expect(e.kind).toBe("transform");
    expect(e.path).toBe("$.project");
  });
});

describe("ClientError", () => {
  it("has kind 'client' and no HTTP fields", () => {
    const e = new ClientError("bad arg", ctx);
    expect(e.kind).toBe("client");
  });
});

describe("type guards", () => {
  it("narrow discriminated union", () => {
    const err: unknown = new HttpError("x", ctx, {
      status: 500,
      statusText: "",
      headers: new Headers(),
      body: {},
      retryable: true,
    });
    if (isHttpError(err)) {
      expect(err.status).toBe(500);
    } else {
      throw new Error("guard failed");
    }
    expect(isNetworkError(new NetworkError("x", ctx, new Error("x")))).toBe(true);
    expect(
      isDecodeError(
        new DecodeError("x", ctx, {
          status: 200,
          statusText: "",
          headers: new Headers(),
          codecName: "json",
          cause: new Error("y"),
        })
      )
    ).toBe(true);
    expect(
      isTransformError(
        new TransformError("x", ctx, {
          status: 200,
          statusText: "",
          codecName: "json-unwrap",
          cause: new Error("y"),
        })
      )
    ).toBe(true);
    expect(isClientError(new ClientError("x", ctx))).toBe(true);
  });
});
