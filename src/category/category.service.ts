import { Injectable } from '@nestjs/common';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CategoryEntity } from 'src/entities/category.entity';

@Injectable()
export class CategoryService extends TypeOrmCrudService<CategoryEntity> {
  constructor(@InjectRepository(CategoryEntity) repo) {
    super(repo);
  }
}
