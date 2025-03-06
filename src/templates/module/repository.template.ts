export function generateRepositoryContent(
  className: string,
  folderName: string
): string {
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
