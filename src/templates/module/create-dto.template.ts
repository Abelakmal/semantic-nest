export function generateCreateDtoContent(className: string): string {
  return `export class Create${className}Dto {}`;
}
