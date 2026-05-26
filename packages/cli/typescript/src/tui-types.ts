export type FieldType = "string" | "number" | "boolean" | "file";
export type FieldLocation = "path" | "query" | "body" | "none";

export interface PickerConfig {
  /** Source action ID, "product.action-id" (e.g. "screenshots.list-browsers"). */
  source: string;
  /** Field in each list item used as this field's value. */
  valueField: string;
  /** Fields shown in the picker UI. Defaults to [valueField]. */
  labelFields?: string[];
  /** Sibling field names that filter the picker results (e.g. ["os","os_version"]). */
  filterBy?: string[];
  /** Per-item envelope key to unwrap (e.g. "automation_build" for [{automation_build:{...}}]). */
  itemPath?: string;
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
  secret?: boolean;
  /** JSON-encoded example object for array-of-object body fields. Non-empty only when items have known properties. */
  itemSample?: string;
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
  sectionOrder?: string[];
}

export interface TUIProduct {
  id: string;
  title: string;
  description: string;
  category?: string;
  resources: TUIResource[];
}
