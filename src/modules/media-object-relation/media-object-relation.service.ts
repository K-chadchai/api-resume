/* eslint-disable @typescript-eslint/class-name-casing */
/* eslint-disable @typescript-eslint/camelcase */
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
  article_unit: dataOB[];
  article_side: dataOB[];
  sale_depart: dataOB[];
  last_edited: string;
  page_no: number;
}
interface dataOB {
  text: string;
  value: string;
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

    let unit = '';
    for (let i = 0; i < props.article_unit.length; i++) {
      const { value } = props.article_unit[i];
      unit +=
        `'` + value + `'` + (i >= props.article_unit.length - 1 ? '' : ',');
    }

    let side = '';
    for (let i = 0; i < props.article_side.length; i++) {
      const { value } = props.article_side[i];
      side +=
        `'` + value + `'` + (i >= props.article_side.length - 1 ? '' : ',');
    }

    let depart = '';
    for (let i = 0; i < props.sale_depart.length; i++) {
      const { value } = props.sale_depart[i];
      depart +=
        `'` + value + `'` + (i >= props.sale_depart.length - 1 ? '' : ',');
    }

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

      .andWhere(
        props.searchAll
          ? `media_article.code like '%${props.searchAll}%'
          or media_article.description like '%${props.searchAll}%'
          or media_unit.code like '%${props.searchAll}%'
          or media_unit.description like '%${props.searchAll}%'
          or media_side.side_name like '%${props.searchAll}%'
          or media_depart.code like '%${props.searchAll}%'
          or media_depart.description like '%${props.searchAll}%'
          or TO_CHAR(media_object.last_edited_time,'YYYY-DD-MM') = '${props.searchAll}'`
          : `media_article.code = ''`,
      )
      .orWhere(unit ? `media_unit.id in (${unit})` : `media_unit.code = ''`)
      .orWhere(
        side ? `media_side.id in (${side})` : `media_side.side_name = ''`,
      )
      .orWhere(
        depart ? `media_depart.id in (${depart})` : `media_depart.code = ''`,
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
          ? `https://${process.env.AWS_S3_BUCKET_NAME}.s3-ap-southeast-1.amazonaws.com/${media_object_s3key}`
          : '',
      });
    });
    return IGetMediaObjectdata;
  }
}
