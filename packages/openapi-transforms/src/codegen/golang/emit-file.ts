import { toGoPackageName } from "./case";

export function emitGoFile(
  product: string,
  className: string,
  modulePath: string,
  needsStrconv = false,
  needsUrl = false,
): string {
  const pkg = toGoPackageName(product);
  const strconvImport = needsStrconv ? `\t"strconv"\n` : "";
  const urlImport = needsUrl ? `\t"net/url"\n` : "";
  const extraImports = strconvImport + urlImport;
  return `package ${pkg}

import (
\t"context"
${extraImports ? extraImports + "\n" : ""}\tbrowserstackhttp "${modulePath}/internal/http"
)

type ${className} struct {
\thttp *browserstackhttp.Client
}

func New(c *browserstackhttp.Client) *${className} {
\treturn &${className}{http: c}
}
`;
}
