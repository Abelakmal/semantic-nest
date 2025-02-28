"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateMetadataDecoratorContent = void 0;
function generateMetadataDecoratorContent() {
    return `import 'reflect-metadata';

export function Relation() {
  return (target: any, propertyKey: string) => {
    const relations = Reflect.getMetadata('relations', target) || [];
    Reflect.defineMetadata('relations', [...relations, propertyKey], target);
  };
}
`;
}
exports.generateMetadataDecoratorContent = generateMetadataDecoratorContent;
