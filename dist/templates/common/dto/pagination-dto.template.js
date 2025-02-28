"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generatePaginationDtoContent = void 0;
function generatePaginationDtoContent() {
    return `import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, IsOptional, Min } from 'class-validator';

export class PaginationDto {
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @ApiPropertyOptional()
  page: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @ApiPropertyOptional()
  limit: number = 10;
}
`;
}
exports.generatePaginationDtoContent = generatePaginationDtoContent;
