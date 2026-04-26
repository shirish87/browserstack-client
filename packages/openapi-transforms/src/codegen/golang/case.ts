const PACKAGE_EXCEPTIONS: Record<string, string> = {
  "local-testing": "localtesting",
  "local-testing-binary": "localbinary",
  "app-automate": "appautomate",
};


export function toPascalCase(s: string): string {
  return s
    .split(/[-_ .]/)
    .filter((part) => part.length > 0)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join("");
}

export function toGoPackageName(product: string): string {
  if (PACKAGE_EXCEPTIONS[product]) return PACKAGE_EXCEPTIONS[product];
  const parts = product.split("-");
  return parts[parts.length - 1]!;
}
