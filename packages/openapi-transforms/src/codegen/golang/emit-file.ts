import { toGoPackageName } from "./case";

export function emitGoFile(product: string, className: string, modulePath: string): string {
  const pkg = toGoPackageName(product);
  return `package ${pkg}

import (
\t"context"

\tbshttp "${modulePath}/internal/http"
)

type ${className} struct {
\thttp *bshttp.Client
}

func New(c *bshttp.Client) *${className} {
\treturn &${className}{http: c}
}
`;
}
