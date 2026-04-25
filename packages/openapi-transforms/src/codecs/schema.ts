import type { StandardSchemaV1 } from "@standard-schema/spec";

type Validate<T> = (value: unknown) =>
  | { value: T; issues?: undefined }
  | { issues: readonly { message: string }[]; value?: undefined };

export function defineSchema<T>(vendor: string, validate: Validate<T>): StandardSchemaV1<T, T> {
  return {
    "~standard": {
      version: 1,
      vendor,
      validate,
    },
  };
}

export function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}
