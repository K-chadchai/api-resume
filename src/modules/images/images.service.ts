import { Injectable } from '@nestjs/common';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { ImagesEntity } from 'src/entities/images.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ImagesService extends TypeOrmCrudService<ImagesEntity> {
  constructor(@InjectRepository(ImagesEntity) repo) {
    super(repo);
  }
}
