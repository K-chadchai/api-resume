import { Injectable } from '@nestjs/common';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { MediaResolutionEntity } from 'src/entities/media_resolution.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { AppService } from 'src/app/app.service';
import { Like } from 'typeorm';

interface IGetResolution {
  page_no: number;
  search: string;
}

@Injectable()
export class MediaResolutionService extends TypeOrmCrudService<
  MediaResolutionEntity
> {
  constructor(
    @InjectRepository(MediaResolutionEntity) repo,
    private readonly appService: AppService,
  ) {
    super(repo);
  }

  // ค้นหาข้อมูล
  async getPaging(props: IGetResolution) {
    // console.log('props :>> ', props);
    return await this.repo.find({
      where: props.search
        ? {
            Resolution_name: Like(`%${props.search}%`),
          }
        : '',
      order: {
        Resolution_name: 'ASC',
      },
      skip: props.page_no > 0 ? (props.page_no - 1) * 10 : 0,
      take: 10,
    });
  }
}
