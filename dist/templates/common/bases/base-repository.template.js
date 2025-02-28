"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateBaseRepositoryContent = void 0;
function generateBaseRepositoryContent() {
    return `import { DataSource, Repository, In, ObjectLiteral } from 'typeorm';
import { Injectable, NotFoundException } from '@nestjs/common';
import { BaseEntity } from './base.entity';

@Injectable()
export class BaseRepository<
  TEntity extends BaseEntity,
> extends Repository<TEntity> {
  constructor(
    private readonly entity: new () => TEntity,
    dataSource: DataSource,
  ) {
    super(entity, dataSource.createEntityManager());
  }

  async firstWhere(
    column: string,
    value: string | number,
    operator = '=',
  ): Promise<TEntity | null> {
    
  }

  async findByIdsFail(
    ids: number[],
    relations: string[] = [],
  ): Promise<TEntity[]> {
    const instances = await this.find({
      where: { id: In(ids) } as any,
      relations,
    });

    const foundIds = instances.map((instance: any) => instance.id);
    const notFoundIds = ids.filter((id) => !foundIds.includes(id));

    if (notFoundIds.length > 0) {
      throw new NotFoundException(
        this.entity.name +' IDs not found: ' + notFoundIds.join(', ')},
      );
    }

    return instances;
  }
}`;
}
exports.generateBaseRepositoryContent = generateBaseRepositoryContent;
