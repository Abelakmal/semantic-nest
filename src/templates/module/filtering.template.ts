export function generateFilteringContent(className: string): string {
  return `import { QueryParameterDto } from 'src/common/dto/query-parameter.dto';

export class Filtering${className}Dto extends QueryParameterDto {}`;
}
