/* eslint-disable @typescript-eslint/camelcase */
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { UsersEntity } from 'src/entities/users.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { UploaderService } from 'src/services/uploader.service';
import { QueryRunner } from 'typeorm';
import { MediasService } from 'src/medias/medias.service';

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
      const key_new = result.files.filter(item => item.suffix === 'x')[0].key;

      // console.log('key', key);
      const user =
        (await this.repo.findOne({ employee_id })) || new UsersEntity();
      if (!user.employee_id) user.employee_id = employee_id;
      const key_old = user.image_key;
      user.image_key = key_new;
      await runner.manager.save(user);

      // delete old file
      if (key_old) await this.uploaderService.deleteFile(key_old);
    };

    return this.mediasService.uploadMedia(req, res, query, callback);
  }

  async getImage(employee_id) {
    const user = await this.repo.findOne({ employee_id });
    if (user?.image_key)
      return await this.uploaderService.getImageBody(user.image_key);
    throw new InternalServerErrorException('Not found employee_id');
  }
}
