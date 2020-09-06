/* eslint-disable @typescript-eslint/camelcase */
import { Injectable, BadRequestException } from '@nestjs/common';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { MediaActivityLogEntity } from 'src/entities/media_activity_log.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { AppService } from 'src/app/app.service';
import { Like, QueryRunner } from 'typeorm';
import { MediaObjectEntity } from 'src/entities/media_object.entity';

interface IPostBulk {
  bulk: MediaActivityLogEntity[];
}

interface IGetActivityLog {
  page_no: number;
  search: string;
  object_id: string;
}

@Injectable()
export class MediaActivityLogService extends TypeOrmCrudService<MediaActivityLogEntity> {
  constructor(@InjectRepository(MediaActivityLogEntity) repo, private readonly appService: AppService) {
    super(repo);
  }

  // ค้นหาข้อมูล
  async getPaging(props: IGetActivityLog) {
    console.log('props', props);
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


  // ค้นหาข้อมูล
  async getLogByObjectId(props: IGetActivityLog) {
    // Validate
    if (!props.object_id) {
      throw new BadRequestException('กรุณาตรวจสอบเงื่อนไขการค้นหา');
    }
        return await this.appService.dbRunner(async (runner: QueryRunner) => {
        return (await runner.manager.find(MediaActivityLogEntity,
          { 
          where: {object_id: props.object_id},
          order:{
            created_time:'ASC'
          },
          take:10,
          })) || ({} as MediaActivityLogEntity);
    });
  }
}
