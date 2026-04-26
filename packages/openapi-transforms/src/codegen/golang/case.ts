export { toPascalCase } from "../shared/operation";

export function toGoPackageName(product: string): string {
  return product.replace(/-/g, "").toLowerCase();
}

