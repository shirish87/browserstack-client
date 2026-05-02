import { CLIMetadata } from "./index";
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

export function generateGoDispatch(m: CLIMetadata): string {
  const pkgName = toGoPackageName(m.product);
  const hasTypedResult = Object.values(m.resources).some(r =>
    Object.values(r.actions).some(a => a.resultFieldName)
  );

  let out = `package ${pkgName}\n\n`;
  out += "// Generated CLI dispatcher. Do not modify.\n\n";

  out += `import (\n\t"context"\n\t"fmt"\n)\n\n`;

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
      out += `\tcase ${prefix}${toPascalCase(action)}:\n`;

      const pathParams = actionMeta.parameters.filter((p: any) => p.in === "path");
      const queryParams = actionMeta.parameters.filter((p: any) => p.in === "query");
      const requiredQueryParams = queryParams.filter((p: any) => p.required);

      const totalRequired = pathParams.length + requiredQueryParams.length;

      if (pathParams.length > 0 || requiredQueryParams.length > 0) {
        out += `\t\tif len(args) < ${totalRequired} {\n`;
        const argNames = [...pathParams, ...requiredQueryParams, ...queryParams.filter((p: any) => !p.required)].map((p: any) => `<${p.name}>`).join(" ");
        out += `\t\t\treturn nil, fmt.Errorf("usage: ${m.product} ${action} ${argNames}")\n`;
        out += `\t\t}\n`;
      }

      const callArgs = ["ctx"];
      let argIndex = 0;
      for (const _ of pathParams) {
        callArgs.push(`args[${argIndex++}]`);
      }
      for (const _ of queryParams) {
        callArgs.push(`argAt(args, ${argIndex})`);
        argIndex++;
      }

      // Handle request body
      if (actionMeta.requestBody) {
        const isMultipart = actionMeta.requestBody.content?.["multipart/form-data"];
        if (isMultipart) {
           callArgs.push("nil", `""`, "nil");
        } else {
           callArgs.push("nil");
        }
      }

      const callExpr = `client.${toPascalCase(actionMeta.methodName)}(${callArgs.join(", ")})`;

      if (hasTypedResult) {
        if (actionMeta.resultFieldName) {
          const respType = actionMeta.responseGoType ?? "";
          out += `\t\tv, err := ${callExpr}\n`;
          out += `\t\tif err != nil { return nil, err }\n`;
          if (respType === "string") {
            // string is not addressable directly — store in var
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
    }
  }

  out += `\tdefault:\n\t\treturn nil, fmt.Errorf("unknown action: %s", action)\n\t}\n`;
  out += `}\n`;

  return out;
}