import { Injectable } from '@nestjs/common';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { ImagePostitionEntity } from 'src/entities/image-position.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ImagePositionService extends TypeOrmCrudService<
  ImagePostitionEntity
> {
  constructor(@InjectRepository(ImagePostitionEntity) repo) {
    super(repo);
  }
}
