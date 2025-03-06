"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateModuleContent = void 0;
function generateModuleContent(className, folderName) {
    return `import { Module } from '@nestjs/common';
import { ${className}Controller } from './${folderName}.controller';
import { ${className}Service } from './${folderName}.service';
import { ${className} } from './entities/${folderName}.entity';
import { ${className}Repository } from './${folderName}.repository';
import { TypeOrmModule } from '@nestjs/typeorm';


@Module({
  imports: [TypeOrmModule.forFeature([${className}])],
  controllers: [${className}Controller],
  providers: [${className}Service, ${className}Repository],
  exports: [${className}Service, ${className}Repository],
})
export class ${className}Module {}
`;
}
exports.generateModuleContent = generateModuleContent;
