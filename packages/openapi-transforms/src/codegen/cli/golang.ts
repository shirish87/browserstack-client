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

  let out = `package ${pkgName}\n\n`;
  out += "// Generated CLI dispatcher. Do not modify.\n\n";
  out += `import (\n\t"context"\n\t"fmt"\n)\n\n`;

  out += `func argAt(args []string, i int) string {\n`;
  out += `\tif i < len(args) { return args[i] }\n`;
  out += `\treturn ""\n`;
  out += `}\n\n`;

  out += `func Dispatch(client *${toPascalCase(m.product)}Client, ctx context.Context, action string, args []string) (interface{}, error) {\n`;
  out += `\tswitch action {\n`;

  for (const [resource, resMeta] of Object.entries(m.resources)) {
    const prefix = resource === "default" ? "Action" : `${toPascalCase(resource)}Action`;
    for (const [action, actionMeta] of Object.entries(resMeta.actions)) {
      out += `\tcase ${prefix}${toPascalCase(action)}:\n`;

      const pathParams = actionMeta.parameters.filter((p: any) => p.in === "path");
      const queryParams = actionMeta.parameters.filter((p: any) => p.in === "query");
      const allParams = [...pathParams, ...queryParams];

      if (allParams.length > 0) {
        // Only path params are strictly required; query params are optional positional
        const requiredCount = pathParams.length;
        if (requiredCount > 0) {
          out += `\t\tif len(args) < ${requiredCount} {\n`;
          const argNames = [...pathParams, ...queryParams].map((p: any) => `<${p.name}>`).join(" ");
          out += `\t\t\treturn nil, fmt.Errorf("usage: ${m.product} ${action} ${argNames}")\n`;
          out += `\t\t}\n`;
        }
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

      out += `\t\treturn client.${toPascalCase(actionMeta.methodName)}(${callArgs.join(", ")})\n`;
    }
  }

  out += `\tdefault:\n\t\treturn nil, fmt.Errorf("unknown action: %s", action)\n\t}\n`;
  out += `}\n`;

  return out;
}