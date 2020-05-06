import { Injectable } from '@nestjs/common';
import { QueryRunner } from 'typeorm';
import { MediaEntity } from 'src/entities/media.entity';
import { MediaImagesEntity } from 'src/entities/media-images.entity';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { AppService } from 'src/app.service';
import { UploaderService } from 'src/services/uploader.service';

@Injectable()
export class MediaService extends TypeOrmCrudService<MediaEntity> {
  constructor(
    @InjectRepository(MediaEntity) repo,
    private readonly appService: AppService,
    private readonly uploaderService: UploaderService,
  ) {
    super(repo);
  }

  // Upload file to media
  async uploadMedia(req, res, query, callback = null) {
    const uploaded = async uploaded => {
      return await this.appService.dbRunner(async runner => {
        const media = await this.uploadFile(runner, uploaded);
        callback && (await callback(runner, media));
        return media;
      });
    };
    //
    try {
      return await this.uploaderService.uploadFile2(req, res, query, uploaded);
    } catch (error) {
      return res
        .status(500)
        .json(`Failed to upload image file: ${error.message}`);
    }
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
      const mediaFile = new MediaImagesEntity();
      mediaFile.suffix = suffix;
      mediaFile.width = width;
      mediaFile.height = height;
      mediaFile.size = size;
      mediaFile.s3key = key;
      mediaFile.media = media;
      return mediaFile;
    });
    await runner.manager.save(MediaImagesEntity, mediaFiles);

    return { ...value, id: media.id };
  }
}
