"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateControllerContent = void 0;
const pluralize = require("pluralize");
const text_format_helper_1 = require("../../helpers/text-format.helper");
function generateControllerContent(className, folderName) {
    const pluralFolderName = pluralize(folderName);
    const folderNameCamelCase = (0, text_format_helper_1.toCamelCase)(folderName);
    return `import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  Query,
  Request,
} from '@nestjs/common';
import { ${className}Service } from './${folderName}.service';
import { ApiTags } from '@nestjs/swagger';
import {
  CreateSwaggerExample,
  DeleteSwaggerExample,
  DetailSwaggerExample,
  ListSwaggerExample,
} from 'src/common/swagger/swagger-example.response';
import { Create${className}Dto } from './dto/create-${folderName}.dto';
import { Response${className}Dto } from './dto/response-${folderName}.dto';
import { Request as ExpressRequest } from 'express';
import { BaseSuccessResponse } from 'src/common/bases/base.response';
import { plainToInstance } from 'class-transformer';
import { Filtering${className}Dto } from './dto/filtering-${folderName}.dto';
import { Update${className}Dto } from './dto/update-${folderName}.dto';

@Controller('${pluralFolderName}')
@ApiTags('${className}')
export class ${className}Controller {
  constructor(private readonly ${folderNameCamelCase}Service: ${className}Service) {}

  @Post()
  @CreateSwaggerExample(
    Create${className}Dto,
    Response${className}Dto,
    false,
    'Create One ${className}',
  )
  async create(
    @Body() createDto: Create${className}Dto,
    @Request() req: ExpressRequest,
  ): Promise<BaseSuccessResponse<Response${className}Dto>> {
    const result = await this.${folderNameCamelCase}Service.create(createDto, req.user);

    return {
      data: plainToInstance(Response${className}Dto, result, {
        excludeExtraneousValues: true,
      }),
    };
  }

  @Get()
  @ListSwaggerExample(Response${className}Dto, 'Get many Data ${className}')
  async findAndCount(
    @Query() queryParameterDto: Filtering${className}Dto,
  ): Promise<BaseSuccessResponse<Response${className}Dto>> {
    const { page = 1, limit = 10 } = queryParameterDto;
    const [result, total] = await this.${folderNameCamelCase}Service.findAndCount(
      queryParameterDto
    );

    return {
      data: plainToInstance(Response${className}Dto, result, {
        excludeExtraneousValues: true,
      }),
      meta: {
        page: page,
        totalData: total,
        totalPage: Math.ceil(total / limit),
      },
    };
  }

  @Get(':id')
  @DetailSwaggerExample(Response${className}Dto, 'Mengambil Data ${className} By ID')
  async findOne(
    @Param('id') id: string,
  ): Promise<BaseSuccessResponse<Response${className}Dto>> {
    const result = await this.${folderNameCamelCase}Service.findOneById(id);

    return {
      data: plainToInstance(Response${className}Dto, result, {
        excludeExtraneousValues: true,
      }),
    };
  }

  @Patch(':id')
  @DetailSwaggerExample(Response${className}Dto, 'Mengupdate Data ${className} By ID')
  async update(
    @Param('id') id: string,
    @Body() update: Update${className}Dto,
    @Request() req: ExpressRequest,
  ): Promise<BaseSuccessResponse<Response${className}Dto>> {
    const result = await this.${folderNameCamelCase}Service.update(id, update, req.user);

    return {
      data: plainToInstance(Response${className}Dto, result, {
        excludeExtraneousValues: true,
      }),
    };
  }

  @Delete(':id')
  @HttpCode(204)
  @DeleteSwaggerExample('Menghapus Data ${className} By ID')
  async remove(
    @Param('id') id: string,
    @Request() req: ExpressRequest,
  ): Promise<void> {
    await this.${folderNameCamelCase}Service.softRemove(id, req.user);
  }
}`;
}
exports.generateControllerContent = generateControllerContent;
