/**
 * Decode an OTLP ExportTraceServiceRequest (protobuf) into the JSON shape
 * `parseOtlp` already accepts. Field numbers follow
 * opentelemetry-proto trace/v1 and common/v1. Unknown fields are skipped.
 */

interface Reader {
  buf: Uint8Array;
  pos: number;
  end: number;
}

function reader(buf: Uint8Array, start = 0, end = buf.length): Reader {
  return { buf, pos: start, end };
}

function varint(r: Reader): bigint {
  let result = 0n;
  let shift = 0n;
  while (r.pos < r.end) {
    const byte = r.buf[r.pos++] ?? 0;
    result |= BigInt(byte & 0x7f) << shift;
    if ((byte & 0x80) === 0) return result;
    shift += 7n;
    if (shift > 70n) throw new Error("varint too long");
  }
  throw new Error("truncated varint");
}

function take(r: Reader, length: number): Uint8Array {
  if (length < 0 || r.pos + length > r.end) throw new Error("truncated bytes");
  const out = r.buf.subarray(r.pos, r.pos + length);
  r.pos += length;
  return out;
}

function skip(r: Reader, wire: number): void {
  if (wire === 0) {
    varint(r);
    return;
  }
  if (wire === 1) {
    take(r, 8);
    return;
  }
  if (wire === 2) {
    const length = Number(varint(r));
    take(r, length);
    return;
  }
  if (wire === 5) {
    take(r, 4);
    return;
  }
  throw new Error(`unsupported wire type ${wire}`);
}

interface Field {
  field: number;
  wire: number;
  varint?: bigint;
  fixed64?: bigint;
  bytes?: Uint8Array;
}

function nextField(r: Reader): Field | undefined {
  if (r.pos >= r.end) return undefined;
  const tag = varint(r);
  const field = Number(tag >> 3n);
  const wire = Number(tag & 7n);
  if (wire === 0) return { field, wire, varint: varint(r) };
  if (wire === 1) {
    const bytes = take(r, 8);
    let value = 0n;
    for (let i = 0; i < 8; i += 1) value |= BigInt(bytes[i] ?? 0) << BigInt(8 * i);
    return { field, wire, fixed64: value };
  }
  if (wire === 2) {
    const length = Number(varint(r));
    return { field, wire, bytes: take(r, length) };
  }
  skip(r, wire);
  return { field, wire };
}

function fields(buf: Uint8Array): Field[] {
  const r = reader(buf);
  const out: Field[] = [];
  while (r.pos < r.end) {
    const field = nextField(r);
    if (!field) break;
    out.push(field);
  }
  return out;
}

function text(bytes: Uint8Array): string {
  return new TextDecoder().decode(bytes);
}

function hex(bytes: Uint8Array): string {
  let out = "";
  for (const byte of bytes) out += byte.toString(16).padStart(2, "0");
  return out;
}

function fixed64Text(value: bigint | undefined): string | undefined {
  if (value === undefined) return undefined;
  return value.toString();
}

function doubleOf(bits: bigint): number {
  const buffer = new ArrayBuffer(8);
  const view = new DataView(buffer);
  view.setBigUint64(0, bits, true);
  return view.getFloat64(0, true);
}

type Json = Record<string, unknown>;

function anyValue(buf: Uint8Array): Json {
  const value: Json = {};
  for (const field of fields(buf)) {
    if (field.field === 1 && field.bytes) value.string_value = text(field.bytes);
    else if (field.field === 2 && field.varint !== undefined) value.bool_value = field.varint !== 0n;
    else if (field.field === 3 && field.varint !== undefined) value.int_value = field.varint.toString();
    else if (field.field === 4 && field.fixed64 !== undefined) value.double_value = doubleOf(field.fixed64);
  }
  return value;
}

function keyValue(buf: Uint8Array): Json | undefined {
  let key = "";
  let value: Json | undefined;
  for (const field of fields(buf)) {
    if (field.field === 1 && field.bytes) key = text(field.bytes);
    else if (field.field === 2 && field.bytes) value = anyValue(field.bytes);
  }
  if (!key || !value) return undefined;
  return { key, value };
}

function attributes(list: Uint8Array[]): Json[] {
  const out: Json[] = [];
  for (const item of list) {
    const entry = keyValue(item);
    if (entry) out.push(entry);
  }
  return out;
}

function eventOf(buf: Uint8Array): Json {
  const event: Json = {};
  const attrs: Uint8Array[] = [];
  for (const field of fields(buf)) {
    if (field.field === 1) event.time_unix_nano = fixed64Text(field.fixed64);
    else if (field.field === 2 && field.bytes) event.name = text(field.bytes);
    else if (field.field === 3 && field.bytes) attrs.push(field.bytes);
  }
  if (attrs.length > 0) event.attributes = attributes(attrs);
  return event;
}

function statusOf(buf: Uint8Array): Json {
  const status: Json = {};
  for (const field of fields(buf)) {
    if (field.field === 2 && field.bytes) status.message = text(field.bytes);
    else if (field.field === 3 && field.varint !== undefined) status.code = Number(field.varint);
  }
  return status;
}

function spanOf(buf: Uint8Array): Json {
  const span: Json = {};
  const attrs: Uint8Array[] = [];
  const events: Json[] = [];
  for (const field of fields(buf)) {
    if (field.field === 1 && field.bytes && field.bytes.length > 0) span.trace_id = hex(field.bytes);
    else if (field.field === 2 && field.bytes && field.bytes.length > 0) span.span_id = hex(field.bytes);
    else if (field.field === 4 && field.bytes && field.bytes.length > 0) span.parent_span_id = hex(field.bytes);
    else if (field.field === 5 && field.bytes) span.name = text(field.bytes);
    else if (field.field === 7) span.start_time_unix_nano = fixed64Text(field.fixed64);
    else if (field.field === 8) span.end_time_unix_nano = fixed64Text(field.fixed64);
    else if (field.field === 9 && field.bytes) attrs.push(field.bytes);
    else if (field.field === 11 && field.bytes) events.push(eventOf(field.bytes));
    else if (field.field === 15 && field.bytes) span.status = statusOf(field.bytes);
  }
  if (attrs.length > 0) span.attributes = attributes(attrs);
  if (events.length > 0) span.events = events;
  return span;
}

function scopeSpansOf(buf: Uint8Array): Json {
  const spans: Json[] = [];
  for (const field of fields(buf)) {
    if (field.field === 2 && field.bytes) spans.push(spanOf(field.bytes));
  }
  return { spans };
}

function resourceOf(buf: Uint8Array): Json {
  const attrs: Uint8Array[] = [];
  for (const field of fields(buf)) {
    if (field.field === 1 && field.bytes) attrs.push(field.bytes);
  }
  return { attributes: attributes(attrs) };
}

function resourceSpansOf(buf: Uint8Array): Json {
  const scopeSpans: Json[] = [];
  let resource: Json | undefined;
  for (const field of fields(buf)) {
    if (field.field === 1 && field.bytes) resource = resourceOf(field.bytes);
    else if (field.field === 2 && field.bytes) scopeSpans.push(scopeSpansOf(field.bytes));
  }
  return { resource, scope_spans: scopeSpans };
}

export function decodeOtlpProtobuf(body: Uint8Array): { resource_spans: Json[] } {
  const resourceSpans: Json[] = [];
  for (const field of fields(body)) {
    if (field.field === 1 && field.bytes) resourceSpans.push(resourceSpansOf(field.bytes));
  }
  return { resource_spans: resourceSpans };
}
