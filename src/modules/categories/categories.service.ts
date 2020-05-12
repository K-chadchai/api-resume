import { Injectable } from '@nestjs/common';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CategoriesEntity } from 'src/entities/categories.entity';

@Injectable()
export class CategoriesService extends TypeOrmCrudService<CategoriesEntity> {
  constructor(@InjectRepository(CategoriesEntity) repo) {
    super(repo);
  }
}
