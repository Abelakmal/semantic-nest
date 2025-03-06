"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateRepositoryContent = void 0;
function generateRepositoryContent(className, folderName) {
    return `import { Injectable } from '@nestjs/common';
import { BaseRepository } from 'src/common/bases/base.repository';
import { ${className} } from './entities/${folderName}.entity';
import { DataSource } from 'typeorm';

@Injectable()
export class ${className}Repository extends BaseRepository<${className}> {
  constructor(private readonly datasource: DataSource) {
    super(${className}, datasource);
  }
}`;
}
exports.generateRepositoryContent = generateRepositoryContent;
