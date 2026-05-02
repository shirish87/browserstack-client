import { toGoPackageName } from "./case";

export interface DispatchAction {
  /** Go field name in DispatchResult, e.g. "GetPlan" */
  fieldName: string;
  /** The Go response type, e.g. "AutomatePlan", "string", "[]byte" */
  responseType: string;
}

export function emitDispatchResult(product: string, actions: DispatchAction[]): string {
  const pkg = toGoPackageName(product);

  // Collect unique Go types — all in the same package, no import needed
  const fields: string[] = [];
  const seen = new Set<string>();

  for (const { fieldName, responseType } of actions) {
    if (seen.has(fieldName)) continue;
    seen.add(fieldName);

    let fieldType: string;
    if (responseType === "string") {
      fieldType = "*string";
    } else if (responseType === "[]byte") {
      fieldType = "*[]byte";
    } else if (responseType.startsWith("[]")) {
      fieldType = `*${responseType}`;
    } else {
      fieldType = `*${responseType}`;
    }

    fields.push(`\t${fieldName} ${fieldType} \`json:"${toSnake(fieldName)},omitempty"\``);
  }

  const fieldBlock = fields.join("\n");

  return `package ${pkg}

// Generated DispatchResult for ${product}. Do not modify.

// DispatchResult holds the outcome of a single Dispatch call.
// Action identifies which operation ran; exactly one payload field is non-nil.
type DispatchResult struct {
\tAction string \`json:"action"\`
${fieldBlock}
}
`;
}

function toSnake(s: string): string {
  return s
    .replace(/([A-Z]+)([A-Z][a-z])/g, "$1_$2")
    .replace(/([a-z])([A-Z])/g, "$1_$2")
    .toLowerCase();
}
