/* eslint-disable @typescript-eslint/camelcase */
import { Injectable } from '@nestjs/common';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { UsersEntity } from 'src/entities/users.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { UploaderService } from 'src/services/uploader.service';
import { QueryRunner, Not, getRepository } from 'typeorm';
import { MediasService } from 'src/modules/medias/medias.service';
import { MediasEntity } from 'src/entities/medias.entity';
import { ImagesEntity } from 'src/entities/images.entity';

@Injectable()
export class UsersService extends TypeOrmCrudService<UsersEntity> {
  constructor(
    @InjectRepository(UsersEntity) repo,
    private readonly uploaderService: UploaderService,
    private readonly mediasService: MediasService,
  ) {
    super(repo);
  }

  // Upload user image
  async postImage(req, res, query) {
    const { employee_id } = query;
    const callback = async (runner: QueryRunner, result) => {
      // console.log('result', result);
      const files: [] = result.files;
      const imageOrigin: ImagesEntity[] = files.filter((item: ImagesEntity) => item.suffix === 'x');
      if (!imageOrigin || imageOrigin.length == 0)
        this.throwBadRequestException(`Not found original image, images.suffix='x'`);
      const s3keyNew = imageOrigin[0].s3key;

      // Update image_key
      const user = (await this.repo.findOne({ employee_id })) || new UsersEntity();
      if (!user.employee_id) user.employee_id = employee_id;
      const key_old = user.image_key;
      user.image_key = s3keyNew;
      await runner.manager.save(user);

      // หา path=users ,media_status=N และเปลี่ยนสถานะเป็น R
      const { id: replaceById } = result;
      const oldMedia = await runner.manager.find(MediasEntity, {
        where: { path: 'users', media_status: 'N', id: Not(replaceById) },
      });
      oldMedia.forEach((item) => {
        this.mediasService.updateReplace(runner, item, {
          created_user: employee_id,
          replaceById,
        });
      });

      // delete old file
      if (key_old) await this.uploaderService.deleteFile(key_old);
    };

    return this.mediasService.uploadMedia(req, res, { ...query, isUserProfile: true }, callback);
  }

  async getImage(employee_id) {
    const user = await this.repo.findOne({ employee_id });
    if (!user) this.throwBadRequestException(`Not found users.employee_id=${employee_id}`);
    const s3key = user.image_key;
    if (!s3key) return null;

    // Find mimetype
    const image = await getRepository(ImagesEntity).findOne({
      where: { s3key },
    });
    if (!image) this.throwBadRequestException('Not found images.s3key=' + s3key);

    // mediaId
    const mediaId = image.mediaId;
    if (!mediaId) this.throwBadRequestException(`Not found mediaId,images.s3key=${s3key}`);

    // Find media
    const media = await getRepository(MediasEntity).findOne(mediaId);
    if (!media) this.throwBadRequestException(`Not found medias.id=${mediaId}`);
    if (!media.mimetype) this.throwBadRequestException(`Not found mimetype,medias.id=${mediaId}`);

    //
    const imageBody = await this.uploaderService.getImageBody(s3key);
    return `data:${media.mimetype};base64,${imageBody}`;
  }
}
