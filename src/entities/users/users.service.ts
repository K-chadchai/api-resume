/* eslint-disable @typescript-eslint/camelcase */
import { Injectable } from '@nestjs/common';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryRunner } from 'typeorm';
import { UsersEntity } from '../users.entity';
import { MediaService } from 'src/media/media.service';
import { UploaderService } from 'src/services/uploader.service';

@Injectable()
export class UsersService extends TypeOrmCrudService<UsersEntity> {
  constructor(
    @InjectRepository(UsersEntity) repo,
    private readonly uploaderService: UploaderService,
    private readonly mediaService: MediaService,
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

    return this.mediaService.uploadMedia(req, res, query, callback);
  }

  async getImage(employee_id) {
    const user = await this.repo.findOne({ employee_id });
    if (user?.image_key)
      return await this.uploaderService.getImageBody(user.image_key);
  }
}
