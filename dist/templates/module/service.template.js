"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateServiceContent = void 0;
const text_format_helper_1 = require("../../helpers/text-format.helper");
function generateServiceContent(className, folderName) {
    const folderNameCamelCase = (0, text_format_helper_1.toCamelCase)(folderName);
    return `import { Injectable } from '@nestjs/common';
import { Create${className}Dto } from './dto/create-${folderName}.dto';
import { Update${className}Dto } from './dto/update-${folderName}.dto';
import { BaseService } from 'src/common/bases/base.service';
import { ${className} } from './entities/${folderName}.entity';
import { ${className}Repository } from './${folderName}.repository';

@Injectable()
export class ${className}Service extends BaseService<
  ${className},
  Create${className}Dto,
  Update${className}Dto
> {
  constructor(private readonly ${folderNameCamelCase}Repository: ${className}Repository) {
    super(${folderNameCamelCase}Repository);
  }
}`;
}
exports.generateServiceContent = generateServiceContent;
