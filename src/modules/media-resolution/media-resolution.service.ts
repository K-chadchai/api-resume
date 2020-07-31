import { Injectable } from '@nestjs/common';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { MediaResolutionEntity } from 'src/entities/media_resolution.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { AppService } from 'src/app/app.service';
import { Like, getConnection, createQueryBuilder } from 'typeorm';
import { MediaObjectEntity } from 'src/entities/media_object.entity';
import { MediaObjectRelationEntity } from 'src/entities/media_object_relation.entity';

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

  // ค้นหาข้อมูล
  async getArticleDepartUnitSide(props: IGetResolution) {
    const query = await getConnection()
      .getRepository(MediaObjectRelationEntity)
      .createQueryBuilder('media_object_relation')
      .innerJoinAndSelect(
        MediaObjectEntity,
        'media_object',
        'media_object.id = media_object_relation.object_id',
      )
      .getRawMany();

    return query;
  }
}
