"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateCreateDtoContent = void 0;
function generateCreateDtoContent(className) {
    return `export class Create${className}Dto {}`;
}
exports.generateCreateDtoContent = generateCreateDtoContent;
