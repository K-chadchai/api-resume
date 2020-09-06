import { Injectable } from '@nestjs/common';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { MediaUserActionEntity } from 'src/entities/media_user_action.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { AppService } from 'src/app/app.service';
import { Like } from 'typeorm';

interface IPostBulk {
  bulk: MediaUserActionEntity[];
}

interface IGetUserAction {
  page_no: number;
  search: string;
}
@Injectable()
export class MediaUserActionService extends TypeOrmCrudService<MediaUserActionEntity> {
  constructor(@InjectRepository(MediaUserActionEntity) repo, private readonly appService: AppService) {
    super(repo);
  }

  // ค้นหาข้อมูล
  async getPaging(props: IGetUserAction) {
    return await this.repo.find({
      where: props.search
        ? {
            description: Like(`%${props.search}%`),
          }
        : '',
      order: {
        description: 'ASC',
      },
      skip: props.page_no > 0 ? (props.page_no - 1) * 10 : 0,
      take: 10,
    });
  }
}
