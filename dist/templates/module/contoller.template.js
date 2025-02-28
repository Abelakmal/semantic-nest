"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateControllerContent = void 0;
function generateControllerContent(className, folderName) {
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
exports.generateControllerContent = generateControllerContent;
