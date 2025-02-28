export function generateRepositoryContent(
  className: string,
  folderName: string
): string {
  return `import { DataSource, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { ${className} } from './entities/${folderName}.entity';

@Injectable()
export class ${className}Repository extends Repository<${className}> {
  constructor(private dataSource: DataSource) {
    super(${className}, dataSource.createEntityManager());
  }

  async firstWhere(column: string, value: string | number, operator = '='): Promise<${className} | null> {
    return await this.createQueryBuilder()
                     .where(\`${className}.\${column} \${operator} :value\`, { value })
                     .getOne();
  }
}`;
}
