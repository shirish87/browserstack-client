export function toPascalCase(s: string): string {
  return s
    .split(/[-_ .]/)
    .filter((part) => part.length > 0)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join("");
}

export function toGoPackageName(product: string): string {
  return product.replace(/-/g, "").toLowerCase();
}

