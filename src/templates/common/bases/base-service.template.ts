export function generateBaseServiceContent(): string {
  return `import {
  BadRequestException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { BaseRepository } from './base.repository';
import {
  FindOptionsWhere,
  FindManyOptions,
  FindOptionsOrder,
  QueryFailedError,
} from 'typeorm';
import { BaseEntity } from './base.entity';
import { QueryParameterDto } from '../dto/query-parameter.dto';
import { IJwtPayload } from "../interfaces/jwt-payload.interface";

export abstract class BaseService<
  TEntity extends BaseEntity,
  TCreate,
  TUpdate,
> {
  constructor(private readonly repository: BaseRepository<TEntity>) {}

  protected paramBuilder(
    options?: QueryParameterDto,
  ): FindManyOptions<TEntity> {
    const {
      limit = 10,
      page = 1,
      orderBy = 'id',
      orderDirection = 'ASC',
    } = options || {};

    const order: Record<string, 'ASC' | 'DESC'> = {
      [orderBy || 'createdAt']: orderDirection || 'DESC',
    };

    return {
      take: limit,
      skip: (page - 1) * limit,
      order: order as unknown as FindOptionsOrder<TEntity>,
      ...options,
    };
  }

  private handleError(error: unknown, action: string): void {
    console.error('Error during : ' + action , error);

    if (error instanceof QueryFailedError && 'code' in error) {
      const pgError = error as QueryFailedError & {
        code: string;
        detail?: string;
      };
      if (pgError.code === '23505') {
        const match = pgError.detail?.match(/\(([^)]+)\)/);
        const field = match ? match[1] : 'unknown field';
        throw new BadRequestException(
          'Duplicate value for unique field: ' + field,
        );
      }
    }

       throw new InternalServerErrorException(
      'Failed to ' +
        action +
        ': ' +
        (error instanceof Error ? error.message : 'Unknown error'),
    );


    // Tangani error lain
  }

  async create(createDto: TCreate, user?: IJwtPayload): Promise<TEntity> {
    try {
      const relations =
        (Reflect.getMetadata('relations', createDto as object) as string[]) ||
        [];

      const modifiedDto: Record<string, unknown> = {
        ...(createDto as Record<string, unknown>),
      };

      relations.forEach((key) => {
        const value = createDto[key as keyof Partial<TCreate>];

        if (value !== undefined && typeof value !== 'object') {
          const newKey = key.replace('Id', '');

          modifiedDto[newKey] = { id: value };
        }
      });

      modifiedDto.createdBy = user?.username;

      const instance: TEntity = this.repository.create(modifiedDto as TEntity);
      return await this.repository.save(instance);
    } catch (error) {
      this.handleError(error, 'create entity');
      throw error;
    }
  }

  async findAll(options?: FindManyOptions<TEntity>): Promise<TEntity[]> {
    return await this.repository.find(options);
  }

  async findAndCount(
    queryParam: QueryParameterDto,
    options: FindManyOptions = {},
  ): Promise<[TEntity[], number]> {
    const queryOptions = Object.keys(options || {}).length
      ? options
      : this.paramBuilder(queryParam);
    return await this.repository.findAndCount(queryOptions);
  }

  async findOneById(
    id: number | string,
    relations: string[] = [],
  ): Promise<TEntity | null> {
    return await this.repository.findOne({
      where: { id } as FindOptionsWhere<TEntity>,
      relations,
    });
  }

  async update(
    id: number | string,
    updateDto: TUpdate,
    user?: IJwtPayload,
  ): Promise<TEntity> {
    const entity: TEntity | null = await this.repository.findOne({
      where: { id } as FindOptionsWhere<TEntity>,
    });

    if (!entity) {
      throw new NotFoundException(
        this.repository.metadata.name + ' with ID ' + id + ' not found',
      );
    }

    const relations =
      (Reflect.getMetadata('relations', updateDto as object) as string[]) || [];

    const modifiedDto: Record<string, unknown> = {
      ...(updateDto as Record<string, unknown>),
    };

    relations.forEach((key) => {
      const value = updateDto[key as keyof Partial<TUpdate>];
      if (value !== undefined && typeof value !== 'object') {
        modifiedDto[key] = { id: value };
      }
    });

    Object.assign(entity, updateDto);
    entity.deletedBy = user?.username;

    return await this.repository.save(entity);
  }

  async softRemove(id: number | string, user?: IJwtPayload): Promise<TEntity> {
    const entity = await this.findOneById(id);
    if (!entity) {
      throw new NotFoundException(
        this.repository.metadata.name + ' with ID ' + id + ' not found',
      );
    }

    entity.deletedBy = user?.username;
    await this.repository.save(entity);
    return await this.repository.softRemove(entity);
  }
}
`;
}
