export function generateServiceContent(
  className: string,
  folderName: string
): string {
  return `import { Injectable } from '@nestjs/common';
import { ${className}Repository } from './${folderName}.repository';

@Injectable()
export class ${className}Service {
  constructor(private ${folderName}Repository: ${className}Repository) {}

  findAll() {
    return ['This is the ${className} service'];
  }
}`;
}
