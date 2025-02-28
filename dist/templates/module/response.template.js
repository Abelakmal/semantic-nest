"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateResponseDtoContent = void 0;
function generateResponseDtoContent(className) {
    return `export class Response${className}Dto {}`;
}
exports.generateResponseDtoContent = generateResponseDtoContent;
