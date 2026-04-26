export class CodecError extends Error {
  readonly codecName: string;
  readonly stage: "decode" | "transform" | "encode";
  readonly cause?: Error;
  constructor(codecName: string, stage: "decode" | "transform" | "encode", message: string, cause?: Error) {
    super(message);
    this.name = "CodecError";
    this.codecName = codecName;
    this.stage = stage;
    if (cause) this.cause = cause;
  }
}
