export type FieldType = "string" | "number" | "boolean" | "file";
export type FieldLocation = "path" | "query" | "body";

export interface TUIField {
  name: string;
  label: string;
  description: string;
  type: FieldType;
  required: boolean;
  location: FieldLocation;
  enum?: string[];
}

export interface TUIAction {
  id: string;
  summary: string;
  description: string;
  fields: TUIField[];
}

export interface TUIResource {
  id: string;
  label: string;
  actions: TUIAction[];
}

export interface TUIProduct {
  id: string;
  title: string;
  description: string;
  resources: TUIResource[];
}
