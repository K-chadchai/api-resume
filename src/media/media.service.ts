import { Injectable } from '@nestjs/common';
import { QueryRunner } from 'typeorm';
import { MediaEntity } from 'src/entities/media.entity';
import { MediaFilesEntity } from 'src/entities/media_files.entity';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class MediaService extends TypeOrmCrudService<MediaEntity> {
  constructor(@InjectRepository(MediaEntity) repo) {
    super(repo);
  }
  // Upload media file
  async uploadFile(runner: QueryRunner, value) {
    const { originalname, mimetype } = value;
    const { files }: { files: [] } = value;

    // Insert media
    const media = new MediaEntity();
    media.originalname = originalname;
    media.mimetype = mimetype;
    await runner.manager.save(MediaEntity, media);

    // Insert media_files
    const mediaFiles = files.map(item => {
      const { suffix, width, height, size, key } = item;
      const mediaFile = new MediaFilesEntity();
      mediaFile.suffix = suffix;
      mediaFile.width = width;
      mediaFile.height = height;
      mediaFile.size = size;
      mediaFile.key = key;
      mediaFile.media = media;
      return mediaFile;
    });
    await runner.manager.save(MediaFilesEntity, mediaFiles);

    return { ...value, id: media.id };
  }
}
