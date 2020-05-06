/* eslint-disable @typescript-eslint/camelcase */
import { Injectable, BadRequestException } from '@nestjs/common';
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
    const { folderId, employee_id, path, old_id } = query;
    if (!path) {
      if (!folderId) {
        throw new BadRequestException('Invalid folderId');
      }
    }
    if (!employee_id) {
      throw new BadRequestException('Invalid employee_id');
    }
    //
    const uploaded = async value => {
      return await this.appService.dbRunner(async runner => {
        const media = await this.uploadMediaDB(runner, {
          ...value,
          folderId,
          created_user: employee_id,
          path,
          old_id,
        });
        if (callback) {
          await callback(runner, media);
        }
        return media;
      });
    };
    // Upload file
    return await this.uploaderService.uploadFile2(req, res, query, uploaded);
  }

  // Upload media file
  async uploadMediaDB(runner: QueryRunner, value) {
    const {
      originalname,
      mimetype,
      folderId,
      created_user,
      path,
      old_id,
    } = value;
    const { files }: { files: [] } = value;

    // สถานะปกติ(N) จะต้องไม่มีชื่อไฟล์เดียวกัน
    const mediaValid = await runner.manager.find(MediasEntity, {
      where: { media_status: 'N', originalname },
    });
    if (mediaValid.length > 0) {
      if (old_id == mediaValid[0].id) {
      } else {
        throw new BadRequestException(`Duplicate file name [${originalname}]`);
      }
    }

    const created_time = new Date();

    // Insert media
    const media = new MediasEntity();
    media.originalname = originalname;
    media.mimetype = mimetype;
    media.folderId = folderId;
    media.created_user = created_user;
    media.created_time = created_time;
    media.media_status = 'N';
    media.path = path;
    await runner.manager.save(MediasEntity, media);
    const idNew = media.id;

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

    // Replace old file
    if (old_id) {
      const oldMedia = await runner.manager.findByIds(MediasEntity, [old_id]);
      if (oldMedia.length == 1) {
        const media = oldMedia[0];
        if (media.media_status != 'N') {
          throw new BadRequestException(
            `สถานะไฟล์ที่ถูกแทนที่ไม่ปกติ(${media.media_status}) ,กรุณาตรวจสอบ`,
          );
        }
        media.media_status = 'R';
        media.deleted_user = created_user;
        media.deleted_time = created_time;
        media.replaceById = idNew;
        await runner.manager.save(MediasEntity, media);
      }
    }

    return { ...value, id: media.id };
  }

  // ลบไฟล์( user กดลบ)
  async deleteUpload(id, query) {
    const { employee_id } = query;
    if (!id) throw new BadRequestException('Invalid id');
    if (!employee_id) throw new BadRequestException('Invalid employee_id');
    //
    return await this.appService.dbRunner(async (runner: QueryRunner) => {
      const media = new MediasEntity();
      media.id = id;
      media.media_status = 'D';
      media.deleted_user = employee_id;
      media.deleted_time = new Date();
      return await runner.manager.save(MediasEntity, media);
    });
  }
}
