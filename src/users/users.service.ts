/* eslint-disable @typescript-eslint/camelcase */
import { Injectable } from '@nestjs/common';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { UsersEntity } from 'src/entities/users.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { UploaderService } from 'src/uploader/uploader.service';
import { QueryRunner } from 'typeorm';

@Injectable()
export class UsersService extends TypeOrmCrudService<UsersEntity> {
  constructor(
    @InjectRepository(UsersEntity) repo,
    private readonly uploaderService: UploaderService,
  ) {
    super(repo);
  }

  // Upload user picture
  async uploadUserImage(req, res, query) {
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
    return this.uploaderService.uploadMedia(req, res, query, callback);
  }

  async getImageKey(employee_id) {
    const user = await this.repo.findOne({ employee_id });
    if (user) return user.image_key;
  }
}
