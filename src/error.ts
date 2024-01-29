import { paths } from "@/generated/openapi";
import { FetchOptions, FetchResponse } from "openapi-fetch";

export type ErrorContext<P extends keyof paths, T> = (FetchOptions<unknown> & {
  path?: P;
  response: T;
}) | Error;

/**
 * BrowserStackError represents an error returned from a BrowserStack Client.
 */
export class BrowserStackError<
  P extends keyof paths,
  T = FetchResponse<unknown>
> extends Error {
  code?: string;
  stack?: string;

  readonly context: ErrorContext<P, T> | undefined;

  constructor(message: string, context?: ErrorContext<P, T>) {
    super(message);
    this.context = context;

    if (context instanceof Error) {
      this.name = context.name;
      this.stack = context.stack;
    }
  }
}
