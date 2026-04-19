# Generated Clients Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace all hand-written client files with generated clients, adding bidirectional camelCase↔snake_case transforms and a field-override sidecar for API inconsistencies.

**Architecture:** Codegen emits typed classes from OpenAPI specs + `x-request-transform`/`x-response-transform` annotations. A new `case.ts` module provides `toCamelCase`/`toSnakeCase` pure functions that codegen wraps around every `execute()` call. Per-field exceptions live in `packages/openapi/field-overrides.yaml` and are inlined by codegen into generated methods.

**Tech Stack:** TypeScript, tsup, vitest, yaml (already in devDeps), openapi-transforms codegen pipeline

---

## File Map

| Action | Path | Responsibility |
|--------|------|----------------|
| Create | `packages/openapi-transforms/src/transforms/case.ts` | `toCamelCase` / `toSnakeCase` pure functions |
| Create | `packages/openapi/field-overrides.yaml` | Per-field name exception map |
| Modify | `packages/openapi-transforms/src/codegen/index.ts` | Load sidecar, pass overrides to emit |
| Modify | `packages/openapi-transforms/src/codegen/emit-method.ts` | Emit camelCase param types, wrap execute with case transforms + overrides |
| Modify | `packages/openapi-transforms/src/codegen/emit-module.ts` | Import case transforms in generated header |
| Modify | `packages/openapi-transforms/src/index.ts` | Export `toCamelCase`, `toSnakeCase` |
| Modify | `packages/openapi/specs/app-automate.yml` | Add `x-request-transform: multipart` to all upload operations |
| Modify | `packages/openapi/build.mjs` | Pass field-overrides sidecar path to `generateClientModule` |
| Delete | `packages/automate/src/client.ts` | — |
| Delete | `packages/app-automate/src/client.ts` | — |
| Delete | `packages/js-testing/src/client.ts` | — |
| Delete | `packages/screenshots/src/client.ts` | — |
| Delete | `packages/local-testing/src/client.ts` | — |
| Modify | `packages/automate/src/index.ts` | Re-export generated class |
| Modify | `packages/app-automate/src/index.ts` | Re-export generated class |
| Modify | `packages/js-testing/src/index.ts` | Re-export generated class |
| Modify | `packages/screenshots/src/index.ts` | Re-export generated class |
| Modify | `packages/local-testing/src/index.ts` | Re-export generated class |
| Modify | `packages/openapi-transforms/src/__tests__/` | Update any tests that import from codegen internals |

---

### Task 1: Create `case.ts` — bidirectional camelCase↔snake_case transforms

**Files:**
- Create: `packages/openapi-transforms/src/transforms/case.ts`
- Create: `packages/openapi-transforms/src/__tests__/transforms/case.test.ts`

- [ ] **Step 1: Write the failing tests**

```typescript
// packages/openapi-transforms/src/__tests__/transforms/case.test.ts
import { describe, it, expect } from "vitest";
import { toCamelCase, toSnakeCase } from "../../transforms/case";

describe("toSnakeCase", () => {
  it("converts camelCase keys to snake_case", () => {
    expect(toSnakeCase({ fileName: "foo.txt", customId: "abc" }))
      .toEqual({ file_name: "foo.txt", custom_id: "abc" });
  });

  it("recurses into nested objects", () => {
    expect(toSnakeCase({ buildInfo: { buildName: "my build" } }))
      .toEqual({ build_info: { build_name: "my build" } });
  });

  it("recurses into arrays", () => {
    expect(toSnakeCase([{ buildName: "a" }, { buildName: "b" }]))
      .toEqual([{ build_name: "a" }, { build_name: "b" }]);
  });

  it("leaves non-object values untouched", () => {
    expect(toSnakeCase("hello")).toBe("hello");
    expect(toSnakeCase(42)).toBe(42);
    expect(toSnakeCase(null)).toBe(null);
  });

  it("leaves already-snake_case keys unchanged", () => {
    expect(toSnakeCase({ file_name: "foo" })).toEqual({ file_name: "foo" });
  });
});

describe("toCamelCase", () => {
  it("converts snake_case keys to camelCase", () => {
    expect(toCamelCase({ file_name: "foo.txt", custom_id: "abc" }))
      .toEqual({ fileName: "foo.txt", customId: "abc" });
  });

  it("recurses into nested objects", () => {
    expect(toCamelCase({ build_info: { build_name: "my build" } }))
      .toEqual({ buildInfo: { buildName: "my build" } });
  });

  it("recurses into arrays", () => {
    expect(toCamelCase([{ build_name: "a" }, { build_name: "b" }]))
      .toEqual([{ buildName: "a" }, { buildName: "b" }]);
  });

  it("leaves non-object values untouched", () => {
    expect(toCamelCase("hello")).toBe("hello");
    expect(toCamelCase(null)).toBe(null);
  });
});
```

- [ ] **Step 2: Run tests to confirm they fail**

```bash
cd /data/repository/browserstack-client
pnpm test -- --project openapi-transforms -- src/__tests__/transforms/case.test.ts
```

Expected: FAIL — module not found.

- [ ] **Step 3: Implement `case.ts`**

```typescript
// packages/openapi-transforms/src/transforms/case.ts

function snakeKey(key: string): string {
  return key.replace(/([A-Z])/g, (c) => `_${c.toLowerCase()}`);
}

function camelKey(key: string): string {
  return key.replace(/_([a-z])/g, (_, c) => c.toUpperCase());
}

export function toSnakeCase(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(toSnakeCase);
  if (value !== null && typeof value === "object") {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
      out[snakeKey(k)] = toSnakeCase(v);
    }
    return out;
  }
  return value;
}

export function toCamelCase(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(toCamelCase);
  if (value !== null && typeof value === "object") {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
      out[camelKey(k)] = toCamelCase(v);
    }
    return out;
  }
  return value;
}
```

- [ ] **Step 4: Run tests to confirm they pass**

```bash
pnpm test -- --project openapi-transforms -- src/__tests__/transforms/case.test.ts
```

Expected: all tests pass.

- [ ] **Step 5: Export from openapi-transforms index**

In `packages/openapi-transforms/src/index.ts`, add at the bottom:

```typescript
export { toCamelCase, toSnakeCase } from "./transforms/case";
```

- [ ] **Step 6: Commit**

```bash
git add packages/openapi-transforms/src/transforms/case.ts \
        packages/openapi-transforms/src/__tests__/transforms/case.test.ts \
        packages/openapi-transforms/src/index.ts
git commit -m "feat(openapi-transforms): add toCamelCase/toSnakeCase transform utilities"
```

---

### Task 2: Create `field-overrides.yaml` sidecar

**Files:**
- Create: `packages/openapi/field-overrides.yaml`

- [ ] **Step 1: Create the sidecar with a known exception**

The `app-automate` spec uses `automation_build` as a wrapper field in list responses. The generated client unwraps it via `json-unwrap $[*].automation_build` already, so the returned object is the inner build — no rename needed there. The `x-response-transform: json-unwrap $.build` on `getAppAutomateBuild` similarly unwraps. Start the sidecar empty but structurally correct; real exceptions will be discovered during integration testing in Task 9.

```yaml
# packages/openapi/field-overrides.yaml
# Per-field camelCase name overrides for API inconsistencies.
# Format:
#   overrides:
#     <operationId>:
#       request:
#         <snake_case_wire_name>: <camelCase_public_name>
#       response:
#         <snake_case_wire_name>: <camelCase_public_name>
#
# Only add entries here when the blanket snake_case→camelCase transform
# produces a wrong or confusing name. Most fields don't need overrides.
overrides: {}
```

- [ ] **Step 2: Commit**

```bash
git add packages/openapi/field-overrides.yaml
git commit -m "feat(openapi): add field-overrides sidecar skeleton"
```

---

### Task 3: Update codegen to load sidecar and add override support to `GenerateClientOptions`

**Files:**
- Modify: `packages/openapi-transforms/src/codegen/index.ts`

- [ ] **Step 1: Write a failing test for sidecar loading**

```typescript
// packages/openapi-transforms/src/__tests__/codegen/field-overrides.test.ts
import { describe, it, expect } from "vitest";
import { loadFieldOverrides, type FieldOverrides } from "../../codegen/field-overrides";
import { writeFile, mkdtemp, rm } from "node:fs/promises";
import { join } from "node:path";
import { tmpdir } from "node:os";

describe("loadFieldOverrides", () => {
  it("returns empty overrides when file does not exist", async () => {
    const result = await loadFieldOverrides("/nonexistent/path.yaml");
    expect(result).toEqual({});
  });

  it("parses overrides from YAML file", async () => {
    const dir = await mkdtemp(join(tmpdir(), "overrides-"));
    const file = join(dir, "overrides.yaml");
    await writeFile(file, `overrides:\n  getBuilds:\n    response:\n      automation_build: build\n`);
    const result = await loadFieldOverrides(file);
    expect(result).toEqual({ getBuilds: { response: { automation_build: "build" } } });
    await rm(dir, { recursive: true });
  });

  it("returns empty overrides when overrides key is empty", async () => {
    const dir = await mkdtemp(join(tmpdir(), "overrides-"));
    const file = join(dir, "overrides.yaml");
    await writeFile(file, `overrides: {}\n`);
    const result = await loadFieldOverrides(file);
    expect(result).toEqual({});
    await rm(dir, { recursive: true });
  });
});
```

- [ ] **Step 2: Run test to confirm it fails**

```bash
pnpm test -- --project openapi-transforms -- src/__tests__/codegen/field-overrides.test.ts
```

Expected: FAIL — module not found.

- [ ] **Step 3: Create `packages/openapi-transforms/src/codegen/field-overrides.ts`**

```typescript
// packages/openapi-transforms/src/codegen/field-overrides.ts
import yaml from "yaml";
import fs from "node:fs/promises";

export interface OperationOverrides {
  request?: Record<string, string>;  // snake_case_wire → camelCasePublic
  response?: Record<string, string>;
}

export type FieldOverrides = Record<string, OperationOverrides>;

interface SidecarDoc {
  overrides?: Record<string, OperationOverrides>;
}

export async function loadFieldOverrides(path: string): Promise<FieldOverrides> {
  let raw: string;
  try {
    raw = await fs.readFile(path, "utf8");
  } catch {
    return {};
  }
  const doc = yaml.parse(raw) as SidecarDoc;
  return doc?.overrides ?? {};
}
```

- [ ] **Step 4: Run test to confirm it passes**

```bash
pnpm test -- --project openapi-transforms -- src/__tests__/codegen/field-overrides.test.ts
```

Expected: all tests pass.

- [ ] **Step 5: Add `fieldOverridesPath` to `GenerateClientOptions` in `codegen/index.ts`**

In `packages/openapi-transforms/src/codegen/index.ts`, update the interface and function signature:

```typescript
// Add to imports at top:
import { loadFieldOverrides, type FieldOverrides } from "./field-overrides";

// Update GenerateClientOptions interface:
export interface GenerateClientOptions {
  specPath: string;
  className: string;
  typesImportPath: string;
  registry: CodecRegistry;
  baseUrl: "sdk" | "sdkCloud";
  fieldOverridesPath?: string;  // add this
}

// In generateClientModule, after reading the spec doc, add:
const fieldOverrides: FieldOverrides = opts.fieldOverridesPath
  ? await loadFieldOverrides(opts.fieldOverridesPath)
  : {};
```

Then pass `fieldOverrides` through to `emitModule` (Task 4 will use it).

Also update the `emitModule` call to pass overrides:

```typescript
return emitModule({
  className: opts.className,
  typesImportPath: opts.typesImportPath,
  methods,
  errorAliases,
  fieldOverrides,  // add this
});
```

- [ ] **Step 6: Commit**

```bash
git add packages/openapi-transforms/src/codegen/field-overrides.ts \
        packages/openapi-transforms/src/__tests__/codegen/field-overrides.test.ts \
        packages/openapi-transforms/src/codegen/index.ts
git commit -m "feat(codegen): add field-overrides sidecar loader and GenerateClientOptions.fieldOverridesPath"
```

---

### Task 4: Update `emit-method.ts` to emit camelCase params + case transform wrapping

**Files:**
- Modify: `packages/openapi-transforms/src/codegen/emit-method.ts`
- Modify: `packages/openapi-transforms/src/codegen/emit-module.ts`

This is the core change. Generated methods will:
1. Accept camelCase input parameters
2. Apply `toSnakeCase` (with any request overrides) before `execute()`
3. Apply `toCamelCase` (with any response overrides) after `execute()`

- [ ] **Step 1: Update `EmitMethodInput` to carry overrides**

In `packages/openapi-transforms/src/codegen/emit-method.ts`, update the interface:

```typescript
import type { OperationAnnotations } from "./annotations";
import type { OperationOverrides } from "./field-overrides";

export interface EmitMethodInput {
  operationId: string;
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  path: string;
  pathParams: Array<{ name: string; tsType: string }>;
  queryParams: Array<{ name: string; tsType: string; required: boolean }>;
  hasRequestBody: boolean;
  operationsKey: string;
  returnType: string;
  annotations: OperationAnnotations;
  baseUrl: "sdk" | "sdkCloud";
  overrides?: OperationOverrides;  // add this
}
```

- [ ] **Step 2: Update `emitMethod` to produce camelCase param names and wrap execute with transforms**

Replace the `emitMethod` function body:

```typescript
export function emitMethod(input: EmitMethodInput): string {
  // camelCase path param names for public API
  const camelParams = input.pathParams.map((p) => ({
    ...p,
    camelName: camelize(p.name),
  }));

  const params = [
    ...camelParams.map((p) => `${p.camelName}: ${p.tsType}`),
    ...(input.hasRequestBody
      ? [
          input.annotations.requestCodec === "multipart"
            ? `body: { file: Blob; fileName: string } & Record<string, unknown>`
            : `body: operations["${input.operationsKey}"]["requestBody"] extends { content: { "application/json": infer B } } ? B : unknown`,
        ]
      : []),
    `options?: ExecuteOptions`,
  ].join(", ");

  // path arg uses snake_case for wire (path params as defined in spec)
  const pathArg =
    input.pathParams.length
      ? `{ path: { ${input.pathParams.map((p, i) => `${p.name}: ${camelParams[i].camelName}`).join(", ")} } }`
      : "undefined";

  const configLit = JSON.stringify(input.annotations.responseCodecConfig);
  const reqConfigLit = JSON.stringify(input.annotations.requestCodecConfig);

  // Build request override map literal (snake→camel inverted to camel→snake for toSnakeCase override)
  const reqOverrides = input.overrides?.request ?? {};
  const reqOverrideLit = Object.keys(reqOverrides).length
    ? JSON.stringify(Object.fromEntries(Object.entries(reqOverrides).map(([snake, camel]) => [camel, snake])))
    : "undefined";

  // Build response override map literal (snake→camel)
  const respOverrides = input.overrides?.response ?? {};
  const respOverrideLit = Object.keys(respOverrides).length
    ? JSON.stringify(respOverrides)
    : "undefined";

  const requestInput = input.hasRequestBody
    ? `toSnakeCase(body, ${reqOverrideLit})`
    : "undefined";

  return `
  ${input.operationId}(${params}): Promise<${input.returnType}> {
    return (this.execute({
      path: "${input.path}",
      params: ${pathArg},
      ${input.hasRequestBody ? `requestInput: ${requestInput},` : ""}
      requestCodec: "${input.annotations.requestCodec}",
      requestCodecConfig: ${reqConfigLit},
      responseCodec: "${input.annotations.responseCodec}",
      responseCodecConfig: ${configLit},
      baseUrl: "${input.baseUrl}" as const,
      operationId: "${input.operationId}",
      method: "${input.method}" as const,
      signal: options?.signal,
    }) as Promise<unknown>).then((r) => toCamelCase(r, ${respOverrideLit})) as Promise<${input.returnType}>;
  }`.trim();
}

function camelize(s: string): string {
  return s.replace(/_([a-z])/g, (_, c) => c.toUpperCase());
}
```

- [ ] **Step 3: Update `toSnakeCase` and `toCamelCase` signatures to accept optional override map**

In `packages/openapi-transforms/src/transforms/case.ts`, update to support overrides:

```typescript
// snake_case_wire → camelCasePublic (used in toCamelCase)
// camelCasePublic → snake_case_wire (used in toSnakeCase, stored inverted in emit)

function snakeKey(key: string, overrides?: Record<string, string>): string {
  if (overrides && key in overrides) return overrides[key];
  return key.replace(/([A-Z])/g, (c) => `_${c.toLowerCase()}`);
}

function camelKey(key: string, overrides?: Record<string, string>): string {
  if (overrides && key in overrides) return overrides[key];
  return key.replace(/_([a-z])/g, (_, c) => c.toUpperCase());
}

export function toSnakeCase(value: unknown, overrides?: Record<string, string>): unknown {
  if (Array.isArray(value)) return value.map((v) => toSnakeCase(v, overrides));
  if (value !== null && typeof value === "object") {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
      out[snakeKey(k, overrides)] = toSnakeCase(v, overrides);
    }
    return out;
  }
  return value;
}

export function toCamelCase(value: unknown, overrides?: Record<string, string>): unknown {
  if (Array.isArray(value)) return value.map((v) => toCamelCase(v, overrides));
  if (value !== null && typeof value === "object") {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
      out[camelKey(k, overrides)] = toCamelCase(v, overrides);
    }
    return out;
  }
  return value;
}
```

- [ ] **Step 4: Update `emit-module.ts` to import `toCamelCase`/`toSnakeCase` in generated header and accept `fieldOverrides`**

In `packages/openapi-transforms/src/codegen/emit-module.ts`:

```typescript
import { emitMethod, type EmitMethodInput } from "./emit-method";
import { emitErrorAlias } from "./emit-error-type";
import type { FieldOverrides } from "./field-overrides";

export interface EmitModuleInput {
  className: string;
  typesImportPath: string;
  methods: EmitMethodInput[];
  errorAliases: Array<{ operationId: string; errorStatuses: number[] }>;
  fieldOverrides: FieldOverrides;  // add this
}

export function emitModule(input: EmitModuleInput): string {
  const header = `/* AUTO-GENERATED — do not edit */
import type { operations } from "${input.typesImportPath}";
import { APIClient, type ExecuteOptions } from "@browserstack-client/core";
import { HttpError, toCamelCase, toSnakeCase } from "@browserstack-client/openapi-transforms";
`;
  // Attach per-operation overrides to each method input
  const methods = input.methods.map((m) => ({
    ...m,
    overrides: input.fieldOverrides[m.operationId],
  }));
  const aliases = input.errorAliases.map((a) => emitErrorAlias(a.operationId, a.errorStatuses)).join("\n\n");
  const body = `export abstract class ${input.className} extends APIClient {
${methods.map(emitMethod).join("\n\n")}
}`;
  return `${header}\n${aliases}\n\n${body}\n`;
}
```

- [ ] **Step 5: Update tests for case.ts to cover the override parameter**

Add to `packages/openapi-transforms/src/__tests__/transforms/case.test.ts`:

```typescript
describe("toSnakeCase with overrides", () => {
  it("uses override map instead of default conversion", () => {
    // overrides here are camelPublic → snake_wire (inverted from sidecar)
    expect(toSnakeCase({ appId: "abc" }, { appId: "custom_id" }))
      .toEqual({ custom_id: "abc" });
  });
});

describe("toCamelCase with overrides", () => {
  it("uses override map for matching keys", () => {
    // overrides here are snake_wire → camelPublic
    expect(toCamelCase({ automation_build: { id: "x" } }, { automation_build: "build" }))
      .toEqual({ build: { id: "x" } });
  });
});
```

- [ ] **Step 6: Run case tests**

```bash
pnpm test -- --project openapi-transforms -- src/__tests__/transforms/case.test.ts
```

Expected: all tests pass.

- [ ] **Step 7: Commit**

```bash
git add packages/openapi-transforms/src/codegen/emit-method.ts \
        packages/openapi-transforms/src/codegen/emit-module.ts \
        packages/openapi-transforms/src/transforms/case.ts \
        packages/openapi-transforms/src/__tests__/transforms/case.test.ts
git commit -m "feat(codegen): emit camelCase params and bidirectional case transforms in generated methods"
```

---

### Task 5: Wire `fieldOverridesPath` into `build.mjs`

**Files:**
- Modify: `packages/openapi/build.mjs`

- [ ] **Step 1: Pass sidecar path to each `generateClientModule` call**

In `packages/openapi/build.mjs`, update the `productSpecs` loop:

```javascript
const fieldOverridesPath = path.join(__dirname, "field-overrides.yaml");

for (const { product, baseUrl } of productSpecs) {
  const specPath = path.join(__dirname, "specs", `${product}.yml`);
  try {
    const src = await generateClientModule({
      specPath,
      className: `Generated${toPascal(product)}Client`,
      typesImportPath: `./${product}`,
      registry,
      baseUrl,
      fieldOverridesPath,  // add this
    });
    await fs.writeFile(path.join(outDir, `${product}.client.ts`), src);
    console.log(`  ✓ ${product}.client.ts`);
  } catch (e) {
    console.error(`  ✗ ${product}:`, e.message);
    process.exitCode = 1;
  }
}
```

- [ ] **Step 2: Run build:types to verify codegen still works**

```bash
cd /data/repository/browserstack-client
pnpm build:types
```

Expected: all products generate successfully, no errors. Inspect one generated file to confirm `toCamelCase`/`toSnakeCase` appear:

```bash
grep -n "toCamelCase\|toSnakeCase" packages/openapi/generated/automate.client.ts | head -5
```

Expected: lines like `import { ... toCamelCase, toSnakeCase } from ...` and `.then((r) => toCamelCase(r, undefined))`.

- [ ] **Step 3: Commit**

```bash
git add packages/openapi/build.mjs
git commit -m "feat(openapi): pass field-overrides sidecar path to generateClientModule"
```

---

### Task 6: Annotate multipart upload operations in `app-automate.yml`

**Files:**
- Modify: `packages/openapi/specs/app-automate.yml`

The upload operations that currently lack `x-request-transform` annotations are:
- `uploadAppAutomateBuildTerminalLogs` — `file` field, no filename in spec (filename from `fileName` camelCase override)
- `uploadAppAutomateSessionTerminalLogs` — same pattern
- `uploadAppAutomateFlutterAndroidApp` — `file` + optional `custom_id`
- `uploadAppAutomateFlutteriOSApp` — `file` + optional `custom_id`
- `uploadAppAutomateDetoxAndroidApp` — `file` + optional `custom_id`
- `uploadAppAutomateDetoxAndroidAppClient` — `file` + optional `custom_id`
- `uploadAppAutomateXCUITestApp` — `file` + optional `custom_id`
- `uploadAppAutomateApp` — `file` or `url` + optional `custom_id`
- `uploadAppAutomateMediaFile` — `file` + optional `custom_id`

- [ ] **Step 1: Add `x-request-transform` to each upload operation**

For each upload operationId listed above, add the annotation immediately after `operationId:`. The multipart codec config requires `fileField` (the Blob field name) and `filenameFrom` (JSONPath to filename within the input object). The public API will pass `{ file: Blob, fileName: string, ... }` and `toSnakeCase` will convert `fileName` → `file_name` before the codec runs — but the multipart codec reads `file_name` from the snake_case input. Set `filenameFrom` to `$.file_name`.

Example for `uploadAppAutomateBuildTerminalLogs`:

```yaml
      operationId: uploadAppAutomateBuildTerminalLogs
      x-request-transform:
        codec: multipart
        config:
          fileField: file
          filenameFrom: "$.file_name"
```

Apply this same pattern to all 9 upload operations listed above. For the `uploadAppAutomateApp` operation which accepts either `file` or `url` (not both), keep `fileField: file` — when `url` is provided instead, the codec will skip the file append (the codec already handles missing Blob by throwing, so `url`-only uploads need a separate annotation or a codec extension — see note below).

> **Note on url-only upload:** `uploadAppAutomateApp` supports either `{ file, fileName }` or `{ url }`. The existing multipart codec requires a Blob for `fileField`. For the `url`-only path, add `x-request-transform: { codec: multipart-or-url }` — but that codec doesn't exist yet. For now, annotate with `codec: multipart` and add a TODO comment in the spec. This edge case can be addressed in a follow-up by adding a `multipart-url` codec variant. Do not block this task on it.

- [ ] **Step 2: Rebuild types to verify annotations parse correctly**

```bash
pnpm build:types
```

Expected: no errors. Check that `uploadAppAutomateBuildTerminalLogs` in the generated client uses `requestCodec: "multipart"`.

```bash
grep -A5 "uploadAppAutomateBuildTerminalLogs" packages/openapi/generated/app-automate.client.ts | head -10
```

Expected: `requestCodec: "multipart"` visible.

- [ ] **Step 3: Commit**

```bash
git add packages/openapi/specs/app-automate.yml
git commit -m "feat(openapi): annotate multipart upload operations with x-request-transform"
```

---

### Task 7: Delete hand-written client files and update package index files

**Files:**
- Delete: `packages/automate/src/client.ts`
- Delete: `packages/app-automate/src/client.ts`
- Delete: `packages/js-testing/src/client.ts`
- Delete: `packages/screenshots/src/client.ts`
- Delete: `packages/local-testing/src/client.ts`
- Modify: `packages/automate/src/index.ts`
- Modify: `packages/app-automate/src/index.ts`
- Modify: `packages/js-testing/src/index.ts`
- Modify: `packages/screenshots/src/index.ts`
- Modify: `packages/local-testing/src/index.ts`

- [ ] **Step 1: Update `packages/automate/src/index.ts`**

```typescript
export { GeneratedAutomateClient as AutomateClient } from "@browserstack-client/openapi/automate/client";
export type { BrowserStackOptions } from "@browserstack-client/core";
```

- [ ] **Step 2: Update `packages/app-automate/src/index.ts`**

```typescript
export { GeneratedAppAutomateClient as AppAutomateClient } from "@browserstack-client/openapi/app-automate/client";
export type { BrowserStackOptions } from "@browserstack-client/core";
```

- [ ] **Step 3: Update `packages/js-testing/src/index.ts`**

```typescript
export { GeneratedJsTestingClient as JSTestingClient } from "@browserstack-client/openapi/js-testing/client";
export type { BrowserStackOptions } from "@browserstack-client/core";
```

- [ ] **Step 4: Update `packages/screenshots/src/index.ts`**

```typescript
export { GeneratedScreenshotsClient as ScreenshotsClient } from "@browserstack-client/openapi/screenshots/client";
export type { BrowserStackOptions } from "@browserstack-client/core";
```

- [ ] **Step 5: Update `packages/local-testing/src/index.ts`**

Check current content first — `local-testing` exports `LocalTestingOptions = Omit<BrowserStackOptions, "username">` which must be preserved:

```typescript
export { GeneratedLocalTestingClient as LocalTestingClient } from "@browserstack-client/openapi/local-testing/client";
export type { BrowserStackOptions } from "@browserstack-client/core";
export type LocalTestingOptions = Omit<import("@browserstack-client/core").BrowserStackOptions, "username">;
```

- [ ] **Step 6: Delete the hand-written client files**

```bash
rm packages/automate/src/client.ts \
   packages/app-automate/src/client.ts \
   packages/js-testing/src/client.ts \
   packages/screenshots/src/client.ts \
   packages/local-testing/src/client.ts
```

- [ ] **Step 7: Run typecheck**

```bash
pnpm typecheck
```

Expected: no errors. Fix any import issues before proceeding.

- [ ] **Step 8: Commit**

```bash
git add -u
git commit -m "feat: replace hand-written client files with generated clients"
```

---

### Task 8: Update `operationId` type in core `execute()` to use `keyof operations | (string & {})`

**Files:**
- Modify: `packages/core/src/api-client.ts`

The `execute()` spec currently types `operationId: string`. Update it to the widened union so that callers get autocomplete.

- [ ] **Step 1: Update the execute spec type in `api-client.ts`**

In `packages/core/src/api-client.ts`, find the `execute` method signature (line ~102). Update the inline spec type:

```typescript
protected async execute<T = unknown>(spec: {
  operationId: keyof Record<string, unknown> | (string & {});  // widened for autocomplete
  method: HttpMethod;
  path: string;
  params?: { path?: Record<string, unknown>; query?: Record<string, unknown> };
  requestCodec?: string;
  requestCodecConfig?: unknown;
  requestInput?: unknown;
  responseCodec: string;
  responseCodecConfig: unknown;
  baseUrl?: "sdk" | "sdkCloud";
  signal?: AbortSignal;
  [key: string]: unknown;
}): Promise<T> {
```

> **Note:** The generated classes are typed against `operations` from each product's types. The `operationId` type in `APIClient.execute()` can't reference `operations` directly (it's product-specific), so `keyof Record<string, unknown> | (string & {})` is equivalent to `string` at this layer. The autocomplete benefit comes from the generated method signatures where `operationId` is hardcoded as a string literal — this task primarily documents the intent. The real type-safety is in the generated methods themselves.

- [ ] **Step 2: Typecheck**

```bash
pnpm typecheck
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add packages/core/src/api-client.ts
git commit -m "feat(core): document operationId type intent in execute() signature"
```

---

### Task 9: Update integration tests to use generated method names

**Files:**
- Modify: `packages/automate/src/__tests__/automate.test.ts`
- Modify: `packages/app-automate/src/__tests__/app-automate.test.ts`
- Modify: `packages/js-testing/src/__tests__/js-testing.test.ts`
- Modify: `packages/local-testing/src/__tests__/local-testing.test.ts`

The hand-written clients had aliased method names (e.g., `getPlan()` → `getAutomatePlan()`). Tests calling those aliases must be updated to use the generated operationId-based names.

- [ ] **Step 1: Find all method calls in automate tests that need updating**

```bash
grep -n "\.(getPlan\|getBrowsers\|getBuilds\|getBuild\|getSession\|updateSession\|getProject\|updateProject\|deleteProject\|recycleKey)\b" \
  packages/automate/src/__tests__/automate.test.ts
```

For each alias found, replace with the generated method name (operationId). The generated names come from the spec's `operationId` fields. Example mappings:
- `getPlan()` → `getAutomatePlan()`
- `getBrowsers()` → `getAutomateBrowsers()`
- `recycleKey()` → `recycleAutomateKey(undefined)` (the generated method takes params first)

- [ ] **Step 2: Repeat for app-automate, js-testing, local-testing tests**

```bash
grep -n "\.\(getPlan\|getBuilds\|getBuild\|getSession\|updateBuild\|deleteSession\|getDevices\)\b" \
  packages/app-automate/src/__tests__/app-automate.test.ts
```

Update all found aliases to their operationId equivalents from the spec.

- [ ] **Step 3: Run tests (requires credentials)**

```bash
BROWSERSTACK_USERNAME=<user> BROWSERSTACK_KEY=<key> pnpm test -- --project automate
```

If credentials are not available in this environment, run typecheck as a proxy:

```bash
pnpm typecheck
```

- [ ] **Step 4: Commit**

```bash
git add packages/automate/src/__tests__/ \
        packages/app-automate/src/__tests__/ \
        packages/js-testing/src/__tests__/ \
        packages/local-testing/src/__tests__/
git commit -m "test: update integration tests to use generated method names"
```

---

### Task 10: Full build and typecheck verification

- [ ] **Step 1: Build types**

```bash
pnpm build:types
```

Expected: all 5 product client files generated with no errors.

- [ ] **Step 2: Build all packages**

```bash
pnpm build
```

Expected: clean build.

- [ ] **Step 3: Typecheck all packages**

```bash
pnpm typecheck
```

Expected: zero errors.

- [ ] **Step 4: Run openapi-transforms unit tests**

```bash
pnpm test -- --project openapi-transforms
```

Expected: all pass.

- [ ] **Step 5: Verify no `client.ts` files remain**

```bash
ls packages/*/src/client.ts 2>&1
```

Expected: "No such file or directory" for all paths.

- [ ] **Step 6: Verify generated files import case transforms**

```bash
grep "toCamelCase\|toSnakeCase" packages/openapi/generated/*.client.ts | head -10
```

Expected: import and usage lines visible in each generated file.

- [ ] **Step 7: Commit if any fixes were needed, then tag**

```bash
git add -A
git commit -m "chore: final build verification and cleanup" --allow-empty
```
