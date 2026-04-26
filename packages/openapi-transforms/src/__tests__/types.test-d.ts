import { expectTypeOf, test } from "vitest";
import { HttpError, NetworkError, isHttpError, type CodecContext } from "../index";

test("HttpError status is non-optional number", () => {
  const ctx: CodecContext = { operationId: "x", method: "GET", url: "u" };
  const e = new HttpError<{ foo: string }>("m", ctx, { status: 404, statusText: "", headers: new Headers(), body: {}, retryable: false });
  expectTypeOf(e.status).toEqualTypeOf<number>();
  expectTypeOf(e.headers).toEqualTypeOf<Headers>();
  expectTypeOf(e.body.parsed).toEqualTypeOf<{ foo: string } | undefined>();
});

test("isHttpError narrows unknown to HttpError<T>", () => {
  const err: unknown = new Error();
  if (isHttpError<{ q: number }>(err)) {
    expectTypeOf(err).toEqualTypeOf<HttpError<{ q: number }>>();
  }
});

test("NetworkError.cause is non-optional Error", () => {
  const e = new NetworkError("x", { operationId:"x", method:"GET", url:"u" }, new Error("y"));
  expectTypeOf(e.cause).toEqualTypeOf<Error>();
});
