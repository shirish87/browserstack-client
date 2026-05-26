import { CLIMetadata, CLIActionMetadata } from "./index";
import { toPascalCase, toGoPackageName } from "../golang/case";

export function generateGoConstants(m: CLIMetadata): string {
  const pkgName = toGoPackageName(m.product);

  let out = `package ${pkgName}\n\n`;
  out += "// Generated CLI constants. Do not modify.\n\n";

  const productPascal = toPascalCase(m.product);
  out += `const Product${productPascal} = "${m.product}"\n\n`;

  // Resources
  const resourceKeys = Object.keys(m.resources).filter(k => k !== "default");
  if (resourceKeys.length > 0) {
    out += "const (\n";
    for (const resource of resourceKeys) {
        out += `\tResource${toPascalCase(resource)} = "${resource}"\n`;
    }
    out += ")\n\n";
  }

  // Actions
  for (const [resource, resMeta] of Object.entries(m.resources)) {
    const prefix = resource === "default" ? "Action" : `${toPascalCase(resource)}Action`;
    out += `// ${resource || "default"} actions\nconst (\n`;
    for (const action of Object.keys(resMeta.actions)) {
        out += `\t${prefix}${toPascalCase(action)} = "${action}"\n`;
    }
    out += ")\n\n";
  }

  return out;
}

function buildCallArgs(
  pathParams: CLIActionMetadata["parameters"],
  queryParams: CLIActionMetadata["parameters"],
  actionMeta: CLIActionMetadata,
  bodyVarName?: string
): string[] {
  const callArgs = ["ctx"];
  let argIndex = 0;
  for (const _ of pathParams) {
    callArgs.push(`args[${argIndex++}]`);
  }
  for (const _ of queryParams) {
    callArgs.push(`argAt(args, ${argIndex})`);
    argIndex++;
  }
  if (actionMeta.requestBody) {
    const isMultipart = actionMeta.requestBody.content?.["multipart/form-data"];
    if (isMultipart) {
      callArgs.push("nil", `""`, "nil");
    } else {
      callArgs.push(bodyVarName ?? "nil");
    }
  }
  return callArgs;
}

function emitDispatchCase(
  action: string,
  prefix: string,
  actionMeta: CLIActionMetadata,
  hasTypedResult: boolean,
  product: string
): string {
  const pathParams = actionMeta.parameters.filter((p) => p.in === "path");
  const queryParams = actionMeta.parameters.filter((p) => p.in === "query");
  const requiredQueryParams = queryParams.filter((p) => p.required);
  const totalRequired = pathParams.length + requiredQueryParams.length;
  const bodyArgIndex = pathParams.length + queryParams.length;

  let out = `\tcase ${prefix}${toPascalCase(action)}:\n`;

  if (pathParams.length > 0 || requiredQueryParams.length > 0) {
    out += `\t\tif len(args) < ${totalRequired} {\n`;
    const argNames = [...pathParams, ...requiredQueryParams, ...queryParams.filter((p) => !p.required)].map((p) => `<${p.name}>`).join(" ");
    out += `\t\t\treturn nil, fmt.Errorf("usage: ${product} ${action} ${argNames}")\n`;
    out += `\t\t}\n`;
  }

  // Emit JSON body unmarshal when the action has a typed request body.
  const bodyType = actionMeta.requestBodyGoType;
  const isMultipart = actionMeta.requestBody?.content?.["multipart/form-data"];
  let bodyVarName: string | undefined;
  if (bodyType && !isMultipart) {
    bodyVarName = "body";
    out += `\t\tvar ${bodyVarName} *${bodyType}\n`;
    out += `\t\tif raw := argAt(args, ${bodyArgIndex}); raw != "" {\n`;
    out += `\t\t\tif err := json.Unmarshal([]byte(raw), &${bodyVarName}); err != nil {\n`;
    out += `\t\t\t\treturn nil, fmt.Errorf("invalid JSON body: %w", err)\n`;
    out += `\t\t\t}\n`;
    out += `\t\t}\n`;
  }

  const callArgs = buildCallArgs(pathParams, queryParams, actionMeta, bodyVarName);
  const callExpr = `client.${toPascalCase(actionMeta.methodName)}(${callArgs.join(", ")})`;

  if (hasTypedResult) {
    if (actionMeta.resultFieldName) {
      const respType = actionMeta.responseGoType ?? "";
      out += `\t\tv, err := ${callExpr}\n`;
      out += `\t\tif err != nil { return nil, err }\n`;
      if (respType === "string") {
        out += `\t\treturn &DispatchResult{Action: action, ${actionMeta.resultFieldName}: &v}, nil\n`;
      } else {
        out += `\t\treturn &DispatchResult{Action: action, ${actionMeta.resultFieldName}: v}, nil\n`;
      }
    } else {
      out += `\t\t_, err := ${callExpr}\n`;
      out += `\t\tif err != nil { return nil, err }\n`;
      out += `\t\treturn &DispatchResult{Action: action}, nil\n`;
    }
  } else {
    out += `\t\treturn ${callExpr}\n`;
  }
  return out;
}

export function generateGoDispatch(m: CLIMetadata): string {
  const pkgName = toGoPackageName(m.product);
  const hasTypedResult = Object.values(m.resources).some(r =>
    Object.values(r.actions).some(a => a.resultFieldName)
  );
  const needsJSON = Object.values(m.resources).some(r =>
    Object.values(r.actions).some(a => a.requestBodyGoType && !a.requestBody?.content?.["multipart/form-data"])
  );

  let out = `package ${pkgName}\n\n`;
  out += "// Generated CLI dispatcher. Do not modify.\n\n";

  const imports = [`"context"`, `"fmt"`];
  if (needsJSON) imports.push(`"encoding/json"`);
  out += `import (\n${imports.map(i => `\t${i}`).join("\n")}\n)\n\n`;

  out += `func argAt(args []string, i int) string {\n`;
  out += `\tif i < len(args) { return args[i] }\n`;
  out += `\treturn ""\n`;
  out += `}\n\n`;

  const returnType = hasTypedResult
    ? `(*DispatchResult, error)`
    : `(any, error)`;

  out += `func Dispatch(client *${toPascalCase(m.product)}Client, ctx context.Context, action string, args []string) ${returnType} {\n`;
  out += `\tswitch action {\n`;

  for (const [resource, resMeta] of Object.entries(m.resources)) {
    const prefix = resource === "default" ? "Action" : `${toPascalCase(resource)}Action`;
    for (const [action, actionMeta] of Object.entries(resMeta.actions)) {
      out += emitDispatchCase(action, prefix, actionMeta, hasTypedResult, m.product);
    }
  }

  out += `\tdefault:\n\t\treturn nil, fmt.Errorf("unknown action: %s", action)\n\t}\n`;
  out += `}\n\n`;

  // DisplayColumns returns the spec-declared display columns for a list action, or nil.
  out += `func DisplayColumns(action string) []string {\n`;
  out += `\tswitch action {\n`;
  for (const [, resMeta] of Object.entries(m.resources)) {
    for (const [action, actionMeta] of Object.entries(resMeta.actions)) {
      if (actionMeta.displayColumns && actionMeta.displayColumns.length > 0) {
        const cols = actionMeta.displayColumns.map(c => `"${c}"`).join(", ");
        out += `\tcase "${action}":\n\t\treturn []string{${cols}}\n`;
      }
    }
  }
  out += `\tdefault:\n\t\treturn nil\n\t}\n`;
  out += `}\n`;

  return out;
}
