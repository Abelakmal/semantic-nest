"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateBaseServiceContent = void 0;
function generateBaseServiceContent() {
    return `import { NotFoundException } from '@nestjs/common';
import { BaseRepository } from './base.repository';
import { DeepPartial, FindOptionsWhere, FindManyOptions } from 'typeorm';
import { BaseEntity } from './base.entity';
import { QueryParameterDto } from '../dto/query-parameter.dto';

export abstract class BaseService<
  TEntity extends BaseEntity,
  TCreate extends DeepPartial<TEntity>,
  TUpdate extends DeepPartial<TEntity>,
> {
  constructor(private readonly repository: BaseRepository<TEntity>) {}

  async create(createDto: TCreate): Promise<TEntity> {
    const relations =
      Reflect.getMetadata('relations', createDto as Object) || [];

    relations.forEach((key: string) => {
      if (createDto[key] !== undefined) {
        createDto[key] = { id: createDto[key] };
      }
    });

    const instance: TEntity = this.repository.create(createDto);
    return await this.repository.save(instance);
  }

  async findAll(options?: FindManyOptions<TEntity>): Promise<TEntity[]> {
    return await this.repository.find(options);
  }

  async findAndCount(
    queryParam: QueryParameterDto,
    options: FindManyOptions = {},
    user: any,
  ) {
    const { page = 1, limit = 10 } = queryParam;

    // TODO: Multiple Order
    const queryOptions: any = {
      ...options,
      take: limit,
      skip: (page - 1) * limit,
      order: {
        [queryParam.orderBy || 'createdAt']:
          queryParam.orderDirection || 'DESC',
      },
    };

    return await this.repository.findAndCount(queryOptions);
  }

  async findOneById(
    id: number,
    relations: string[] = [],
  ): Promise<TEntity | null> {
    return await this.repository.findOne({
      where: { id } as FindOptionsWhere<TEntity>,
      relations,
    });
  }

  async update(id: number, updateDto: TUpdate): Promise<TEntity> {
    const entity: TEntity | null = await this.repository.findOne({
      where: { id } as FindOptionsWhere<TEntity>,
    });

    if (!entity) {
      throw new NotFoundException(
        this.repository.metadata.name + ' with ID '+ id +' not found',
      );
    }

    Object.assign(entity, updateDto);
    return await this.repository.save(entity);
  }

  async softRemove(id: number, user?: any): Promise<TEntity> {
    const entity = await this.findOneById(id);
    if (!entity) {
      throw new NotFoundException(
        this.repository.metadata.name + ' with ID '+ id +' not found',
      );
    }

    (entity as any).deletedBy = user?.username;
    await this.repository.save(entity);
    return await this.repository.softRemove(entity);
  }
}
`;
}
exports.generateBaseServiceContent = generateBaseServiceContent;
