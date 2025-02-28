"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateEntityContent = void 0;
function generateEntityContent(className) {
    return `export class ${className} {}`;
}
exports.generateEntityContent = generateEntityContent;
