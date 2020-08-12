import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { MediaObjectRelationEntity } from 'src/entities/media_object_relation.entity';
import { AppService } from 'src/app/app.service';
import { getConnection } from 'typeorm';
import { MediaObjectEntity } from 'src/entities/media_object.entity';
import { MediaArticleEntity } from 'src/entities/media_article.entity';
import { MediaUnitEntity } from 'src/entities/media_unit.entity';
import { MediaSideEntity } from 'src/entities/media_side.entity';
import { MediaSaleDepartmentEntity } from 'src/entities/media_sale_department.entity';

interface IPostBulk {
  bulk: MediaObjectRelationEntity[];
}
interface IGetByArticleDepartUnitSide {
  searchAll: string;
  article_unit: string;
  article_side: string;
  sale_depart: string;
  last_edited: string;
  page_no: number;
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
      !props.searchAll &&
      !props.article_unit &&
      !props.article_side &&
      !props.sale_depart &&
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
      .leftJoinAndSelect(
        MediaArticleEntity,
        'media_article',
        'media_article.id = media_object_relation.article_id',
      )
      .leftJoinAndSelect(
        MediaUnitEntity,
        'media_unit',
        'media_unit.id = media_object_relation.article_unit_id',
      )
      .leftJoinAndSelect(
        MediaSideEntity,
        'media_side',
        'media_side.id = media_object_relation.article_side_id',
      )
      .leftJoinAndSelect(
        MediaSaleDepartmentEntity,
        'media_depart',
        'media_depart.id = media_object_relation.sale_depart_id',
      )
      .where('media_object.id is not null')
      .take(10)
      .skip(props.page_no > 0 ? (props.page_no - 1) * 10 : 0)

      .orWhere(
        props.searchAll
          ? `media_article.code like '%${props.searchAll}%' 
          or media_article.description like '%${props.searchAll}%' 
          or media_unit.code like '%${props.searchAll}%' 
          or media_unit.description like '%${props.searchAll}%'
          or media_side.side_name like '%${props.searchAll}%'
          or media_depart.code like '%${props.sale_depart}%' 
          or media_depart.description like '%${props.sale_depart}%'
          or TO_CHAR(media_object.last_edited_time,'YYYY-DD-MM') = '${props.searchAll}'`
          : `media_article.code = ''`,
      )
      .orWhere(
        props.article_unit
          ? `media_unit.code like '%${props.article_unit}%' or media_unit.description like '%${props.article_unit}%'`
          : `media_unit.code = ''`,
      )
      .orWhere(
        props.article_side
          ? `media_side.side_name like '%${props.article_side}%'`
          : `media_side.side_name = ''`,
      )
      .orWhere(
        props.sale_depart
          ? `media_depart.code like '%${props.sale_depart}%' or media_depart.description like '%${props.sale_depart}%'`
          : `media_depart.code = ''`,
      )
      .orWhere(
        props.last_edited
          ? `TO_CHAR(media_object.last_edited_time,'YYYY-DD-MM') = '${props.last_edited}'`
          : `TO_CHAR(media_object.last_edited_time,'YYYY-DD-MM') = ''`,
      )
      .getRawMany();

    const IGetMediaObjectdata = [];
    query.forEach(item => {
      const { media_object_s3key } = item;
      IGetMediaObjectdata.push({
        Data: item,
        Link: media_object_s3key
          ? `${process.env.API_GETIMAGE}/${media_object_s3key}`
          : '',
      });
    });
    return IGetMediaObjectdata;
  }
}
