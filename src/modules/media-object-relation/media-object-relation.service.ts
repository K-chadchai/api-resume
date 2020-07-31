import { Injectable } from '@nestjs/common';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { MediaObjectRelationEntity } from 'src/entities/media_object_relation.entity';
import { AppService } from 'src/app/app.service';
import { getConnection } from 'typeorm';
import { MediaObjectEntity } from 'src/entities/media_object.entity';

interface IPostBulk {
  bulk: MediaObjectRelationEntity[];
}

@Injectable()
export class MediaObjectRelationService extends TypeOrmCrudService<
  MediaObjectRelationEntity
> {
  constructor(
    @InjectRepository(MediaObjectRelationEntity) repo,
    private readonly appService: AppService,
  ) {
    super(repo);
  }
  // ค้นหาข้อมูล
  async getArticleDepartUnitSide() {
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
