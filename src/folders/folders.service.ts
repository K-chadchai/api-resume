import { Injectable } from '@nestjs/common';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { FoldersEntity } from 'src/entities/folders.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class FoldersService extends TypeOrmCrudService<FoldersEntity> {
  constructor(@InjectRepository(FoldersEntity) repo) {
    super(repo);
  }

  async getFolderByCat(catId) {
    return await this.repo.find({ category: catId });
  }
}
