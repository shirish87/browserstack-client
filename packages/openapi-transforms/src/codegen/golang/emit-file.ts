import { toGoPackageName } from "./case";

export function emitGoFile(product: string, className: string, modulePath: string, needsStrconv = false): string {
  const pkg = toGoPackageName(product);
  const strconvImport = needsStrconv ? `\t"strconv"\n\n` : "";
  return `package ${pkg}

import (
\t"context"
${strconvImport}\tbshttp "${modulePath}/internal/http"
)

type ${className} struct {
\thttp *bshttp.Client
}

func New(c *bshttp.Client) *${className} {
\treturn &${className}{http: c}
}
`;
}
