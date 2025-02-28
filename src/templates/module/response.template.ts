export function generateResponseDtoContent(className: string): string {
  return `export class Response${className}Dto {}`;
}
