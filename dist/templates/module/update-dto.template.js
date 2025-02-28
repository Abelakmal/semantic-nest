"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateUpdateDtoContent = void 0;
function generateUpdateDtoContent(className, folderName) {
    return `import { PartialType } from '@nestjs/swagger';
  import { Create${className}Dto } from './create-${folderName}.dto';

  export class Update${className}Dto extends PartialType(Create${className}Dto) {}   `;
}
exports.generateUpdateDtoContent = generateUpdateDtoContent;
