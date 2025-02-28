export function generateControllerContent(
  className: string,
  folderName: string
): string {
  return `import { Controller, Get } from '@nestjs/common';
import { ${className}Service } from './${folderName}.service';

@Controller('${folderName}s')
@ApiTags('${className}')
export class ${className}Controller {
  constructor(private readonly ${folderName}Service: ${className}Service) {}

  @Get()
  findAll() {
    return this.${folderName}Service.findAll();
  }
}`;
}
