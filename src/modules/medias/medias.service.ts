/* eslint-disable @typescript-eslint/camelcase */
import {
  Injectable,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { QueryRunner, getRepository } from 'typeorm';
import { MediasEntity } from 'src/entities/medias.entity';
import { ImagesEntity } from 'src/entities/images.entity';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { AppService } from 'src/app/app.service';
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
    const { folderId, employee_id, path, old_id, isUserProfile } = query;
    if (!path) {
      if (!folderId) {
        throw new BadRequestException('Invalid folderId');
      }
    }
    if (!employee_id) {
      throw new BadRequestException('Invalid employee_id');
    }
    //
    const uploadFileCallback = async value => {
      return await this.appService.dbRunner(async runner => {
        const media = await this.uploadMediaDB(runner, {
          ...value,
          folderId,
          created_user: employee_id,
          path,
          old_id,
          isUserProfile,
        });
        if (callback) {
          await callback(runner, media);
        }
        return media;
      });
    };
    // Upload file
    return await this.uploaderService.uploadFile2(
      req,
      res,
      query,
      uploadFileCallback,
    );
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
      isUserProfile,
    } = value;
    const { files }: { files: [] } = value;
    if (!folderId && !path)
      throw new BadRequestException('Invalid, folderId and path');

    // ใน folder เดียวกันจะต้องไม่มีชื่อไฟล์เดียวกัน ที่มีสถานะปกติ
    const mediaNormal = folderId
      ? await runner.manager.find(MediasEntity, {
          where: { media_status: 'N', originalname, folderId },
        })
      : await runner.manager.find(MediasEntity, {
          where: { media_status: 'N', originalname, path },
        });
    if (mediaNormal.length > 0) {
      if (old_id == mediaNormal[0].id || isUserProfile) {
      } else {
        throw new BadRequestException(`Duplicate file name [${originalname}]`);
      }
    }

    const created_time = new Date();

    // Insert MediasEntity
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

    // Insert ImagesEntity
    const images = files.map(item => {
      const { suffix, width, height, size, s3key } = item;
      const image = new ImagesEntity();
      image.suffix = suffix;
      image.width = width;
      image.height = height;
      image.size = size;
      image.s3key = s3key;
      image.media = media;
      return image;
    });
    await runner.manager.save(ImagesEntity, images);

    // Replace old file
    if (old_id) {
      const oldMedia = await runner.manager.findByIds(MediasEntity, [old_id]);
      if (oldMedia.length == 1) {
        const media = oldMedia[0];
        await this.updateReplace(runner, media, {
          created_user,
          created_time,
          replaceById: idNew,
        });
      }
    }

    return { ...value, id: media.id };
  }

  async updateReplace(runner, media: MediasEntity, value) {
    const { created_user, created_time, replaceById } = value;
    //
    if (media.media_status != 'N') {
      throw new BadRequestException(
        `สถานะไฟล์ที่ถูกแทนที่ไม่ปกติ(${media.media_status}) ,กรุณาตรวจสอบ`,
      );
    }
    //
    media.media_status = 'R';
    media.deleted_user = created_user;
    media.deleted_time = created_time || new Date();
    media.replaceById = replaceById;
    await runner.manager.save(MediasEntity, media);
  }

  // ลบไฟล์( user กดลบ)
  async deleteUpload(id, query) {
    const { employee_id } = query;
    if (!id) throw new BadRequestException('Invalid id');
    if (!employee_id) throw new BadRequestException('Invalid employee_id');
    //
    return await this.appService.dbRunner(async (runner: QueryRunner) => {
      const medias = await runner.manager.findByIds(MediasEntity, [id]);
      if (medias.length == 0)
        throw new BadRequestException('Not found id,' + id);
      const media = medias[0];
      if (media.media_status != 'N')
        throw new BadRequestException(
          'Can not delete, media_status=' + media.media_status,
        );
      media.media_status = 'D';
      media.deleted_user = employee_id;
      media.deleted_time = new Date();
      return await runner.manager.save(MediasEntity, media);
    });
  }

  // Return imageBody and MediaEntity
  async getImage(mediaId, suffix = 'x') {
    // Find Media
    const medias = await this.repo.findByIds([mediaId]);
    if (medias.length == 0)
      throw new BadRequestException(`Not found media.id=${mediaId}`);

    // Find Image with suffix [Option]
    let imageBody: string;
    let s3key: string;
    const images = await getRepository(ImagesEntity).find({
      where: { mediaId, suffix },
    });
    if (images.length == 1) {
      s3key = images[0].s3key;
      if (s3key) {
        imageBody = await this.uploaderService.getImageBody(s3key);
      }
    }
    if (imageBody) {
      imageBody = `data:${medias[0].mimetype};base64,${imageBody}`;
    }

    return { media: medias[0], s3key, imageBody };
  }

  async getDownload(s3key) {
    if (!s3key) throw new BadRequestException(`Invalid s3key`);
    return await this.uploaderService.getFileBody(s3key);
  }
}
