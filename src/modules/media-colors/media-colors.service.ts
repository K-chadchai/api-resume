import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AppService } from 'src/app/app.service';
import { MediaColorsEntity } from 'src/entities/media_colors.entity';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { Like } from 'typeorm';

interface IGetColors {
  page_no: number;
  search: string;
}

@Injectable()
export class MediaColorsService extends TypeOrmCrudService<MediaColorsEntity> {
  constructor(
    @InjectRepository(MediaColorsEntity) repo,
    private readonly appService: AppService,
  ) {
    super(repo);
  }

  // ค้นหาข้อมูล
  async getPaging(props: IGetColors) {
    // console.log('props :>> ', props);
    return await this.repo.find({
      where: props.search
        ? {
            color_name: Like(`%${props.search}%`),
          }
        : '',
      order: {
        color_name: 'ASC',
      },
      skip: props.page_no > 0 ? (props.page_no - 1) * 10 : 0,
      take: 10,
    });
  }
}
