import { paths } from "@/generated/openapi.ts";
import { FetchOptions, FetchResponse } from "openapi-fetch";

export type ErrorContext<P extends keyof paths, T> =
  | (FetchOptions<unknown> & {
      path?: P;
      response: T;
    })
  | Error;

/**
 * BrowserStackError represents an error returned from a BrowserStack Client.
 * @internal
 */
export class BrowserStackError<
  P extends keyof paths,
  T = FetchResponse<unknown, FetchOptions<unknown>>
> extends Error {
  readonly code?: string;
  readonly stack?: string;

  readonly context: ErrorContext<P, T> | undefined;

  constructor(message: string, context?: ErrorContext<P, T>) {
    super(message);
    this.context = context;

    if (context instanceof Error) {
      this.name = context.name;
      this.stack = context.stack;

      if ("code" in context && typeof context.code === "string") {
        this.code = context.code;
      }
    }
  }
}
