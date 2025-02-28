"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateQueryParamaterDtoContent = void 0;
function generateQueryParamaterDtoContent() {
    return `import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsOptional, IsString } from 'class-validator';
import { PaginationDto } from './pagination.dto';

export class QueryParameterDto extends PaginationDto {
  @IsString()
  @IsOptional()
  @ApiPropertyOptional()
  orderBy?: string;

  @IsString()
  @IsOptional()
  @Transform(({ value }) => value.toUpperCase())
  @ApiPropertyOptional({ enum: ['ASC', 'DESC'] })
  orderDirection?: 'ASC' | 'DESC';

  @IsString()
  @IsOptional()
  @ApiPropertyOptional()
  search?: string;
}
`;
}
exports.generateQueryParamaterDtoContent = generateQueryParamaterDtoContent;
