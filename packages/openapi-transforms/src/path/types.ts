export type PathNode =
  | { kind: "root" }
  | { kind: "field"; name: string }
  | { kind: "wildcard" }
  | { kind: "index"; index: number };

export type PathAst = readonly PathNode[];
