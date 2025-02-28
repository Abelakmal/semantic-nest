"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateServiceContent = void 0;
function generateServiceContent(className, folderName) {
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
exports.generateServiceContent = generateServiceContent;
