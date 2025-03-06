import { toCamelCase } from "../../helpers/text-format.helper";

export function generateServiceContent(
  className: string,
  folderName: string
): string {
  const folderNameCamelCase = toCamelCase(folderName);
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
