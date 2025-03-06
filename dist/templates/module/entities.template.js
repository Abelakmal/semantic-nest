"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateEntityContent = void 0;
function generateEntityContent(className, folderName) {
    return `import {  Entity } from 'typeorm';
import { I${className} } from '../interfaces/${folderName}.interface';
import { BaseEntity } from 'src/common/bases/base.entity';

@Entity()
export class ${className} extends BaseEntity implements I${className} {
}`;
}
exports.generateEntityContent = generateEntityContent;
