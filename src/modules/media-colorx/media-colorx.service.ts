import { Injectable } from '@nestjs/common';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { MediaColorxEntity } from 'src/entities/media_colorx.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { AppService } from 'src/app/app.service';
import { Like } from 'typeorm';

interface IGetColorx {
  page_no: number;
  search: string;
}

@Injectable()
export class MediaColorxService extends TypeOrmCrudService<MediaColorxEntity> {
  constructor(
    @InjectRepository(MediaColorxEntity) repo,
    private readonly appService: AppService,
  ) {
    super(repo);
  }

  // ค้นหาข้อมูล
  async getPaging(props: IGetColorx) {
    // console.log('props :>> ', props);
    return await this.repo.find({
      where: props.search
        ? {
            colorx_name: Like(`%${props.search}%`),
          }
        : '',
      order: {
        colorx_name: 'ASC',
      },
      skip: props.page_no > 0 ? (props.page_no - 1) * 10 : 0,
      take: 10,
    });
  }
}
