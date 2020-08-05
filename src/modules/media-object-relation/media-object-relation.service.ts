import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { MediaObjectRelationEntity } from 'src/entities/media_object_relation.entity';
import { AppService } from 'src/app/app.service';
import { getConnection } from 'typeorm';
import { MediaObjectEntity } from 'src/entities/media_object.entity';

interface IPostBulk {
  bulk: MediaObjectRelationEntity[];
}
interface IGetByArticleDepartUnitSide {
  article_id: string;
  article_unit_id: string;
  article_side_id: string;
  sale_depart_id: string;
  last_edited: string;
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
  async getArticleDepartUnitSide(props: IGetByArticleDepartUnitSide) {
    if (
      !props.article_id &&
      !props.article_unit_id &&
      !props.article_unit_id &&
      !props.sale_depart_id &&
      !props.last_edited
    )
      throw new InternalServerErrorException('กรุณาตรวจสอบเงื่อนไขการค้นหา');

    const query = await getConnection()
      .getRepository(MediaObjectRelationEntity)
      .createQueryBuilder('media_object_relation')
      .leftJoinAndSelect(
        MediaObjectEntity,
        'media_object',
        'media_object.id = media_object_relation.object_id',
      )
      .where([
        props.article_id
          ? { article_id: props.article_id }
          : { article_id: '' },
        props.article_unit_id
          ? { article_unit_id: props.article_unit_id }
          : { article_unit_id: '' },
        props.article_side_id
          ? { article_side_id: props.article_side_id }
          : { article_side_id: '' },
        props.sale_depart_id
          ? { sale_depart_id: props.sale_depart_id }
          : { sale_depart_id: '' },
      ])
      .andWhere(
        props.last_edited
          ? `TO_CHAR(last_edited_time,'YYYY-DD-MM') = '${props.last_edited}'`
          : `TO_CHAR(last_edited_time,'YYYY-DD-MM') = ''`,
      )
      .getRawMany();

    const IGetMediaObjectdata = [];
    query.forEach(item => {
      const { media_object_s3key } = item;
      IGetMediaObjectdata.push({
        Data: item,
        Link: media_object_s3key
          ? `https://${process.env.AWS_S3_BUCKET_NAME}.s3-ap-southeast-1.amazonaws.com/${media_object_s3key}`
          : '',
      });
    });
    return IGetMediaObjectdata;
  }
}
