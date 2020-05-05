import { Injectable } from '@nestjs/common';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { CategoryFolderEntity } from 'src/entities/category-folder.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class CategoryFolderService extends TypeOrmCrudService<
  CategoryFolderEntity
> {
  constructor(@InjectRepository(CategoryFolderEntity) repo) {
    super(repo);
  }

  async getFolderByCat(catId) {
    return await this.repo.find({ category: catId });
  }
}
