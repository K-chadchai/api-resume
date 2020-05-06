import {
  Injectable,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { QueryRunner } from 'typeorm';
import { MediasEntity } from 'src/entities/medias.entity';
import { ImagesEntity } from 'src/entities/images.entity';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { AppService } from 'src/app.service';
import { UploaderService } from 'src/services/uploader.service';

@Injectable()
export class MediasService extends TypeOrmCrudService<MediasEntity> {
  constructor(
    @InjectRepository(MediasEntity) repo,
    private readonly appService: AppService,
    private readonly uploaderService: UploaderService,
  ) {
    super(repo);
  }

  // Upload file to media
  async uploadMedia(req, res, query, callback = null) {
    const { folderId } = query;
    if (!folderId) throw new BadRequestException('Invalid folderId');
    //
    const uploaded = async uploaded => {
      return await this.appService.dbRunner(async runner => {
        const media = await this.uploadFile(runner, uploaded);
        if (callback) {
          await callback(runner, media);
        }
        return media;
      });
    };
    return await this.uploaderService.uploadFile2(req, res, query, uploaded);
  }

  // Upload media file
  async uploadFile(runner: QueryRunner, value) {
    const { originalname, mimetype } = value;
    const { files }: { files: [] } = value;

    // Insert media
    const media = new MediasEntity();
    media.originalname = originalname;
    media.mimetype = mimetype;
    await runner.manager.save(MediasEntity, media);

    // Insert media_files
    const mediaFiles = files.map(item => {
      const { suffix, width, height, size, key } = item;
      const image = new ImagesEntity();
      image.suffix = suffix;
      image.width = width;
      image.height = height;
      image.size = size;
      image.s3key = key;
      image.media = media;
      return image;
    });
    await runner.manager.save(ImagesEntity, mediaFiles);

    return { ...value, id: media.id };
  }
}
