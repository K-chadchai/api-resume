import { Injectable } from '@nestjs/common';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { MediaObjectEntity } from 'src/entities/media_object.entity';
import { AppService } from 'src/app/app.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Like } from 'typeorm';

interface IPostBulk {
  bulk: MediaObjectEntity[];
}

interface IGetObjectService {
  page_no: number;
  search: string;
}

@Injectable()
export class MediaObjectService extends TypeOrmCrudService<MediaObjectEntity> {
  constructor(
    @InjectRepository(MediaObjectEntity) repo,
    private readonly appService: AppService,
  ) {
    super(repo);
  }

  // ค้นหาข้อมูล
  async getPaging(props: IGetObjectService) {
    return await this.repo.find({
      where: props.search
        ? {
            object_name: Like(`%${props.search}%`),
          }
        : '',
      order: {
        object_name: 'ASC',
      },
      skip: props.page_no > 0 ? (props.page_no - 1) * 10 : 0,
      take: 10,
    });
  }

  // ค้นหาข้อมูล ByFolderId
  async getByFolderId(id: string) {
    console.log('id', id);
    return await this.repo.find({
      where: [{ folder_id: id }],
    });
  }
}
