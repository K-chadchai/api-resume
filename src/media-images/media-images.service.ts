import { Injectable } from '@nestjs/common';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { MediaImagesEntity } from 'src/entities/media_images.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class MediaImagesService extends TypeOrmCrudService<MediaImagesEntity> {
  constructor(@InjectRepository(MediaImagesEntity) repo) {
    super(repo);
  }
}
