export function generateEntityContent(
  className: string,
  folderName: string
): string {
  return `import {  Entity } from 'typeorm';
import { I${className} } from '../interfaces/${folderName}.interface';
import { BaseEntity } from 'src/common/bases/base.entity';

@Entity()
export class ${className} extends BaseEntity implements I${className} {
}`;
}
