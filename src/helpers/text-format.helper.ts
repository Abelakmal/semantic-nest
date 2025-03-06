export function capitalize(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

export function toCamelCase(text: string) {
  return text.replace(/-([a-z])/g, (_, char) => char.toUpperCase());
}
