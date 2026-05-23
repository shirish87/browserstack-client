export type FieldType = "string" | "number" | "boolean" | "file";
export type FieldLocation = "path" | "query" | "body";

export interface PickerConfig {
  /** Source action ID, "product.action-id" (e.g. "screenshots.list-browsers"). */
  source: string;
  /** Field in each list item used as this field's value. */
  valueField: string;
  /** Fields shown in the picker UI. Defaults to [valueField]. */
  labelFields?: string[];
  /** Sibling field names that filter the picker results (e.g. ["os","os_version"]). */
  filterBy?: string[];
}

export interface TUIField {
  name: string;
  label: string;
  description: string;
  type: FieldType;
  required: boolean;
  location: FieldLocation;
  enum?: string[];
  picker?: PickerConfig;
}

export interface TUIAction {
  id: string;
  summary: string;
  description: string;
  section?: string;
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
