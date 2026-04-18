import type { StandardSchemaV1 } from "@standard-schema/spec";
import type { CodecContext } from "./errors.js";

export interface EncodedRequest {
  body: BodyInit;
  headers?: Record<string, string>;
}

export interface ResponseCodec<TConfig, TOutput> {
  readonly name: string;
  readonly contentTypes: readonly string[];
  readonly configSchema: StandardSchemaV1<TConfig>;
  decode(response: Response, config: TConfig, ctx: CodecContext): Promise<TOutput>;
}

export interface RequestCodec<TInput, TConfig> {
  readonly name: string;
  readonly contentType: string;
  readonly configSchema: StandardSchemaV1<TConfig>;
  encode(input: TInput, config: TConfig): EncodedRequest;
}

export class CodecRegistry {
  private response = new Map<string, ResponseCodec<unknown, unknown>>();
  private request = new Map<string, RequestCodec<unknown, unknown>>();

  registerResponse(codec: ResponseCodec<any, any>): void {
    if (this.response.has(codec.name)) {
      throw new Error(`response codec '${codec.name}' already registered`);
    }
    this.response.set(codec.name, codec);
  }
  registerRequest(codec: RequestCodec<any, any>): void {
    if (this.request.has(codec.name)) {
      throw new Error(`request codec '${codec.name}' already registered`);
    }
    this.request.set(codec.name, codec);
  }
  resolveResponse(name: string): ResponseCodec<any, any> {
    const c = this.response.get(name);
    if (!c) throw new Error(`unknown response codec: ${name}`);
    return c;
  }
  resolveRequest(name: string): RequestCodec<any, any> {
    const c = this.request.get(name);
    if (!c) throw new Error(`unknown request codec: ${name}`);
    return c;
  }
  listResponse(): string[] { return [...this.response.keys()]; }
  listRequest(): string[] { return [...this.request.keys()]; }
}
