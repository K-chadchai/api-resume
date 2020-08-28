/* eslint-disable @typescript-eslint/camelcase */
import { Injectable } from '@nestjs/common';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { MediaImageShareEntity } from 'src/entities/media_image_share.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { AppService } from 'src/app/app.service';
import { Like, getRepository, QueryRunner } from 'typeorm';
import { UploaderService } from 'src/services/uploader.service';

interface IPostBulk {
  bulk: MediaImageShareEntity[];
}

interface IGetImageShare {
  page_no: number;
  search: string;
}

@Injectable()
export class MediaImageShareService extends TypeOrmCrudService<MediaImageShareEntity> {
  constructor(
    @InjectRepository(MediaImageShareEntity) repo,
    private readonly appService: AppService,
    private readonly uploaderService: UploaderService,
  ) {
    super(repo);
  }

  // ค้นหาข้อมูล
  async getPaging(props: IGetImageShare) {
    return await this.repo.find({
      where: props.search
        ? {
            object_id: Like(`%${props.search}%`),
          }
        : '',
      order: {
        object_id: 'ASC',
      },
      skip: props.page_no > 0 ? (props.page_no - 1) * 10 : 0,
      take: 10,
    });
  }
  delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
  async shareImages(s3key, res) {
    let retValue: any = null;
    if (s3key) {
      const onCallback = async (e: any) => {
        retValue = { ...e };
      };
      await this.uploaderService.shareImage(s3key, res, onCallback);
      // wait
      while (retValue === null) {
        await this.delay(300);
        if (retValue !== null) {
          return retValue;
        }
      }
    }
  }

  async postShareImage(body: MediaImageShareEntity,req) {
    return await this.appService.dbRunner(async (runner: QueryRunner) => {
      const postShareImage = new MediaImageShareEntity();
      postShareImage.object_id = body.object_id;
      postShareImage.file_type = body.file_type;
      postShareImage.resolution = body.resolution;
      postShareImage.url = body.url;
      postShareImage.creator = (req.user === undefined)?'':req.user.userId; //จาก token
      postShareImage.created_time = (req.actionTime ===  undefined)?new Date():req.actionTime; // จาก token
      postShareImage.s3key = body.s3key;
      postShareImage.share_type = 'Public';
      return await runner.manager.save(MediaImageShareEntity, postShareImage);
    });
  }

  async postShareImageDownload(body: MediaImageShareEntity,req) {
    return await this.appService.dbRunner(async (runner: QueryRunner) => {
      const postShareImage = new MediaImageShareEntity();
      postShareImage.object_id = body.object_id;
      postShareImage.file_type = body.file_type;
      postShareImage.resolution = body.resolution;
      postShareImage.url = body.url;
      postShareImage.creator = (req.user === undefined)?'':req.user.userId;
      postShareImage.created_time = (req.actionTime ===  undefined)?new Date():req.actionTime;
      postShareImage.s3key = body.s3key;
      postShareImage.share_type = 'InHouse';
      return await runner.manager.save(MediaImageShareEntity, postShareImage);
    });
  }
}
