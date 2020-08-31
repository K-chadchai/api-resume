/* eslint-disable @typescript-eslint/camelcase */
import { Injectable, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { AppService } from 'src/app/app.service';
import { InjectConnection } from '@nestjs/typeorm';
import { Connection, getConnection, QueryRunner, getRepository, Like } from 'typeorm';
import { UploaderService } from 'src/services/uploader.service';
import { MediaObjectEntity } from 'src/entities/media_object.entity';
import { MediaFolderEntity } from 'src/entities/media_folder.entity';
import { MediaArticleEntity } from 'src/entities/media_article.entity';
import { MediaObjectRelationEntity } from 'src/entities/media_object_relation.entity';
import { MediaSideEntity } from 'src/entities/media_side.entity';
import { MediaUnitEntity } from 'src/entities/media_unit.entity';
import { MediaSaleDepartmentEntity } from 'src/entities/media_sale_department.entity';
import { MediaColorxEntity } from 'src/entities/media_colorx.entity';
import { v4 as uuid } from 'uuid';
import { DBMASTER } from 'src/app/app.constants';

interface IGetArticleInfo {
  page_no: number;
  search: string;
}
interface IGetSaleDepartment {
  page_no: number;
  search: string;
}
interface IGetArticle {
  NAMETH: string;
}
interface IGetUnit {
  MYNAME: string;
}
interface IGetSaleDepart {
  MYNAME: string;
}

interface DataUpload {
  article_code: string;
  article_unit_code: string;
  article_side_id: string;
  sale_depart_code: string;
  article_color_id: string;
  ContentType: string;
  s3key: string;
  resolution_id: string;
}

interface DataUploadArticleSet {
  object_name: string;
  folder_id: string;
  article_side_id: string;
  ContentType: string;
  s3key: string;
  resolution_id: string;
}

interface IPostDataUpload {
  data: DataUpload[];
}

interface IGetArticleSet {
  article_code: string;
  folder_id: string;
  article_unit_code: string;
}

interface IGetSearchArticleSet{
  folder_id:string;
  search_name:string;
}

@Injectable()
export class MediaUploadService {
  constructor(
    private readonly appService: AppService,
    @InjectConnection(DBMASTER)
    private readonly connection: Connection,
    private readonly uploaderService: UploaderService,
  ) {}

  async getArticleInfo(props: IGetArticleInfo) {
    let query = '';
    props.search
      ? (query = `select TOP (20) [CODE] as Article,[NAMETH] as DescriptionTH from TBMaster_Product where code like ('%${props.search}%') or NAMETH like ('%${props.search}%')`)
      : (query = 'select TOP (20) [CODE] as Article,[NAMETH] as DescriptionTH from TBMaster_Product');
    return this.connection.query(query);
  }

  async getArticleInfoSet(props: IGetArticleInfo) {
    let query = '';
    props.search
      ? (query = `select TOP (1) [CODE] as Article,[NAMETH] as DescriptionTH from TBMaster_Product where code = '${props.search}'`)
      : (query = 'select TOP (1) [CODE] as Article,[NAMETH] as DescriptionTH from TBMaster_Product');
    return this.connection.query(query);
  }

  async getUnitInfo(props: IGetArticleInfo) {
    let query = '';

    if (!props.search) {
      throw new InternalServerErrorException('กรุณาใส่ข้อมูล article');
    }
    query = `SELECT TOP (1000) [PRODUCTCODE]
    ,[UNITCODE]
    ,un.[MYNAME]
    ,[UNITRATE]
    ,[UNITWEIGHT]
    ,pu.[STATUS]
    ,[UNIT_BUN_CODE]
    ,[UNIT_OUN_CODE]
    ,[UNIT_DI_CODE]
    ,[UNIT_SUN_CODE]
    ,[N_WEIGHT]
    ,[G_WEIGHT]
    ,[WEIGHT_UNIT]
    ,[THICK]
    ,[WIDTH]
    ,[HIGH]
    ,[UNIT_OF_SIZE]
    ,[VOLUME]
    ,[UNIT_OF_VOLUME]
    ,pu.[LAST_UPDATE_DATE]
    ,pu.[LAST_UPDATE_TIME]
FROM [DBMASTER].[dbo].[TBMaster_Product_Unit] pu
LEFT JOIN TBMaster_Unit un ON pu.UNITCODE = un.CODE where pu.PRODUCTCODE = '${props.search}'`;
    return this.connection.query(query);
  }

  async getSaleDepartment(props: IGetSaleDepartment) {
    let query = '';
    props.search
      ? (query = `select TOP (20) * from TBMaster_Seller where CODE like ('%${props.search}%') or MYNAME like ('%${props.search}%')`)
      : (query = 'select TOP (20) * from TBMaster_Seller');
    return this.connection.query(query);
  }

  // Upload file to media
  async uploadMedia(req, res, query, callback = null) {
    const onCallback = async (data: any) => {
      //console.log('data :>> ', data);
      const file = data.files[0];
      if (file) {
        //console.log('file', file);
        const { s3key, ContentType } = file;

        let imageBody = '';
        if (s3key) {
          imageBody = await this.uploaderService.getImageBody(s3key);
          imageBody = `data:image/${ContentType};base64,${imageBody}`;
        }
        return { file, imageBody };
      }
    };
    //Process
    return await this.uploaderService.uploadFile2(req, res, query, onCallback);
  }

  async getMediaImage(s3key, suffix = 'x') {
    let imageBody: string;
    if (s3key) {
      imageBody = await this.uploaderService.getImageBody(s3key);
    }
    if (imageBody) {
      imageBody = `data:${'Lname'};base64,${imageBody}`;
    }
    return { media: 'Lname', s3key, imageBody };
  }

  async getMediaImageBase(s3key, suffix = 'x') {
    let imageBody: string;
    if (s3key) {
      imageBody = await this.uploaderService.getImageBody(s3key);
    }
    if (imageBody) {
      imageBody = `base64,${imageBody}`;
    }
    return imageBody;
  }

  delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  // async shareImage(s3key, res) {
  //   let retValue: any = null;
  //   if (s3key) {
  //     const onCallback = async (e: any) => {
  //       retValue = { ...e };
  //     };
  //     await this.uploaderService.shareImage(s3key, res, onCallback);
  //     // wait
  //     while (retValue === null) {
  //       await this.delay(300);
  //       if (retValue !== null) {
  //         return retValue;
  //       }
  //     }
  //   }
  // }

  async postDataUploadList(body: IPostDataUpload) {
    const saved = [];
    const data = [];
    let message = '';
    for (let i = 0; i < body.data.length; i++) {
      try {
        //หา folder ROOT_ARTICLE เอา id
        const fineFolder = await getConnection()
          .getRepository(MediaFolderEntity)
          .createQueryBuilder('media_folder')
          .select(['media_folder.id'])
          .where(`media_folder.folder_type = 'ARTICLE_ROOT' AND media_folder.is_root = true`)
          .getOne();

        if (fineFolder === undefined) {
          message = 'ไม่พบ id folder root article';
          console.log('ไม่พบ fineFolder');
          throw new InternalServerErrorException('ไม่สามารถอัพโหลดไฟล์ได้');
        }
        //ค้นหา folder ถ้าไม่มีข้อมูลให้ insert ลง
        const fineFolderByDepart = await getConnection()
          .getRepository(MediaFolderEntity)
          .createQueryBuilder('media_folder')
          .select(['media_folder.id'])
          .where(`media_folder.folder_type = 'FOLDER' AND media_folder.reference = '${body.data[i].sale_depart_code}'`)
          .getOne();

        let sideName;
        //ค้นหา article Side
        const fineSide = await getConnection()
          .getRepository(MediaSideEntity)
          .createQueryBuilder('media_side')
          .select(['media_side.side_name'])
          .where(`media_side.id = '${body.data[i].article_side_id}'`)
          .getOne();

        if (fineSide === undefined) {
          message = message + ' , ' + 'ค้นหาข้อมูล side ไม่สำเร็จ';
          console.log('ค้นหาข้อมูล side ไม่สำเร็จ');
        } else sideName = fineSide.side_name;

        let colorName;
        //ค้นหา article Side
        const fineColor = await getConnection()
          .getRepository(MediaColorxEntity)
          .createQueryBuilder('media_color')
          .select(['media_color.colorx_name'])
          .where(`media_color.id = '${body.data[i].article_color_id}'`)
          .getOne();

        if (fineColor === undefined) {
          message = message + ' , ' + 'ค้นหาข้อมูล color ไม่สำเร็จ';
          console.log('ค้นหาข้อมูล color ไม่สำเร็จ');
        } else colorName = fineColor.colorx_name;

        let folder;
        let id_folder;
        if (fineFolderByDepart === undefined) {
          const repositoryFolder = getRepository(MediaFolderEntity);
          folder = new MediaFolderEntity();
          folder.folder_name = `${body.data[i].sale_depart_code}_${body.data[i].article_code}_${colorName}_${body.data[i].article_unit_code}_${sideName}`;
          folder.parent_id = fineFolder.id;
          folder.folder_type = 'FOLDER';
          folder.reference = body.data[i].sale_depart_code;
          folder.created_time = new Date();
          folder.creator = '';
          folder.description = '';
          try {
            const { id } = await repositoryFolder.save(folder);
            id_folder = id;
          } catch (err) {
            message = message + ' , ' + 'บันทึกข้อมูล folder ไม่สำเร็จ';
            console.log('บันทึกข้อมูล folder ไม่สำเร็จ' + err);
          }
        } else id_folder = fineFolderByDepart.id;

        //ค้นหา article ถ้าไม่มีข้อมูลให้ insert ลง
        const fineArticle = await getConnection()
          .getRepository(MediaArticleEntity)
          .createQueryBuilder('media_article')
          .select(['media_article.id'])
          .where(`media_article.code = '${body.data[i].article_code}'`)
          .getOne();

        const queryArticle = `select TOP (1) [NAMETH] from TBMaster_Product where code = '${body.data[i].article_code}'`;
        const articleData = await this.connection.query(queryArticle);
        const DescriptionTHData: Array<IGetArticle> = articleData;
        const descArticle = DescriptionTHData[0].NAMETH ? DescriptionTHData[0].NAMETH : '';

        let article;
        let id_article;
        if (fineArticle === undefined) {
          const repositoryArticle = getRepository(MediaArticleEntity);
          article = new MediaArticleEntity();
          article.code = body.data[i].article_code;
          article.description = descArticle;
          article.creator = '';
          article.created_time = new Date();
          try {
            const { id } = await repositoryArticle.save(article);
            id_article = id;
          } catch (err) {
            message = message + ' , ' + 'บันทึกข้อมูล article ไม่สำเร็จ';
            console.log('บันทึกข้อมูล article ไม่สำเร็จ' + err);
          }
        } else id_article = fineArticle.id;

        //ค้นหา unit ถ้าไม่มีข้อมูลให้ insert ลง
        const fineUnit = await getConnection()
          .getRepository(MediaUnitEntity)
          .createQueryBuilder('media_unit')
          .select(['media_unit.id'])
          .where(`media_unit.code = '${body.data[i].article_unit_code}'`)
          .getOne();

        const queryUnit = `select TOP (1) * from TBMaster_Unit where CODE = '${body.data[i].article_unit_code}'`;
        const unitData = await this.connection.query(queryUnit);
        const unitNameData: Array<IGetUnit> = unitData;
        const unitName = unitNameData[0].MYNAME ? unitNameData[0].MYNAME : '';

        let unit;
        let id_unit;
        if (fineUnit === undefined) {
          const repositoryUnit = getRepository(MediaUnitEntity);
          unit = new MediaUnitEntity();
          unit.code = body.data[i].article_unit_code;
          unit.description = unitName;
          unit.creator = '';
          unit.created_time = new Date();
          try {
            const { id } = await repositoryUnit.save(unit);
            id_unit = id;
          } catch (err) {
            message = message + ' , ' + 'บันทึกข้อมูล Unit ไม่สำเร็จ';
            console.log('บันทึกข้อมูล Unit ไม่สำเร็จ');
          }
        } else id_unit = fineUnit.id;

        //ค้นหา sale_depart ถ้าไม่มีข้อมูลให้ insert ลง
        const fineSaleDepart = await getConnection()
          .getRepository(MediaSaleDepartmentEntity)
          .createQueryBuilder('media_sale')
          .select(['media_sale.id'])
          .where(`media_sale.code = '${body.data[i].sale_depart_code}'`)
          .getOne();

        const querySaleDepart = `select TOP (1) * from TBMaster_Seller where CODE = '${body.data[i].sale_depart_code}'`;
        const SaleDepartData = await this.connection.query(querySaleDepart);
        const SaleDepartNameData: Array<IGetSaleDepart> = SaleDepartData;
        const SaleDepartName = SaleDepartNameData[0].MYNAME ? SaleDepartNameData[0].MYNAME : '';

        let sale_depart;
        let id_sale_depart;
        if (fineSaleDepart === undefined) {
          const repositorySaleDepartment = getRepository(MediaSaleDepartmentEntity);
          sale_depart = new MediaUnitEntity();
          sale_depart.code = body.data[i].sale_depart_code;
          sale_depart.description = SaleDepartName;
          sale_depart.creator = '';
          sale_depart.created_time = new Date();
          try {
            const { id } = await repositorySaleDepartment.save(sale_depart);
            id_sale_depart = id;
          } catch (err) {
            message = message + ' , ' + 'บันทึกข้อมูล Sale Depart ไม่สำเร็จ';
            console.log('บันทึกข้อมูล Sale Depart ไม่สำเร็จ');
          }
        } else id_sale_depart = fineSaleDepart.id;

        console.log('ก่อนเชคเงื่อนไข');
        console.log(
          'เงื่อนไข',
          body.data[i].ContentType,
          body.data[i].s3key,
          body.data[i].sale_depart_code,
          id_article,
          id_unit,
          body.data[i].article_side_id,
          body.data[i].article_color_id,
        );

        if (
          body.data[i].ContentType &&
          body.data[i].s3key &&
          id_sale_depart !== undefined &&
          id_article !== undefined &&
          id_unit !== undefined &&
          sideName !== undefined &&
          colorName !== undefined &&
          body.data[i].article_side_id &&
          body.data[i].article_color_id &&
          body.data[i].resolution_id
        ) {
          try {
            await this.appService.dbRunner(async (runner: QueryRunner) => {
              const media_object = new MediaObjectEntity();
              media_object.folder_id = body.data[i].article_side_id;
              media_object.object_name = `${body.data[i].article_code}_${colorName}_${body.data[i].article_unit_code}_${sideName}_${body.data[i].ContentType}`;
              media_object.descripion = '';
              media_object.file_type = body.data[i].ContentType;
              media_object.file_group = '';
              media_object.is_original = 0;
              media_object.creator = '';
              media_object.created_time = new Date();
              media_object.s3key = body.data[i].s3key;

              let sMedia_object;
              try {
                sMedia_object = await runner.manager.save(MediaObjectEntity, media_object);
              } catch (err) {
                message = err;
                //throw new InternalServerErrorException('ไม่สามารถอัพโหลดไฟล์ได้');
              }
              //เก็บ id ของ media object
              const { id } = sMedia_object;
              console.log('id media_object ----->>>>>>', id);
              if (sMedia_object) {
                const media_object_relation = new MediaObjectRelationEntity();
                media_object_relation.object_id = id;
                media_object_relation.sale_depart_id = id_sale_depart;
                media_object_relation.article_id = id_article;
                media_object_relation.article_unit_id = id_unit;
                media_object_relation.article_side_id = body.data[i].article_side_id;
                media_object_relation.color_id = body.data[i].article_color_id;
                media_object_relation.resolution_id = body.data[i].resolution_id;

                let sMedia_object_relation;
                try {
                  sMedia_object_relation = await runner.manager.save(MediaObjectRelationEntity, media_object_relation);
                } catch (err) {
                  message = err;
                }

                if (sMedia_object_relation) {
                  saved.push({
                    data: sMedia_object_relation,
                    message: '',
                  });
                } else {
                  saved.push({
                    data: body.data[i],
                    message: message,
                  });
                }
              } else {
                saved.push({
                  data: body.data[i],
                  message: message,
                });
              }
            });
          } catch (err) {
            saved.push({
              data: body.data[i],
              message: 'ไม่สามารถอัพโหลดไฟล์ได้' + ' , ' + message,
            });
          }
        } else {
          message = 'ข้อมูลไม่เป็นไปตามเงื่อนไขสร้างไฟล์';
          console.log('ข้อมูลไม่เป็นไปตามเงื่อนไขสร้างไฟล์');
          saved.push({
            data: body.data[i],
            message: message,
          });
        }
        //const { id } = folder;
      } catch (err) {
        throw new InternalServerErrorException('ไม่สามารถอัพโหลดไฟล์ได้ ----->>>>>' + ' , ' + err);
      }
    }
    return saved;
  }

  async postDataUpload(body: DataUpload, req) {
    const message = '';
    try {
      //หา folder ROOT_ARTICLE เอา id
      const fineFolder = await getConnection()
        .getRepository(MediaFolderEntity)
        .createQueryBuilder('media_folder')
        .select(['media_folder.id'])
        .where(`media_folder.folder_type = 'ARTICLE_ROOT' AND media_folder.is_root = true`)
        .getOne();

      if (fineFolder === undefined) {
        console.log('ไม่พบ fineFolder');
        throw new InternalServerErrorException('ไม่สามารถอัพโหลดไฟล์ได้');
      }
      //ค้นหา folder ถ้าไม่มีข้อมูลให้ insert ลง
      const fineFolderByDepart = await getConnection()
        .getRepository(MediaFolderEntity)
        .createQueryBuilder('media_folder')
        .select(['media_folder.id'])
        .where(
          `media_folder.folder_type = 'FOLDER' AND media_folder.reference = '${body.sale_depart_code}' AND media_folder.parent_id = '${fineFolder.id}'`,
        )
        .getOne();

      let sideName;
      //ค้นหา article Side
      const fineSide = await getConnection()
        .getRepository(MediaSideEntity)
        .createQueryBuilder('media_side')
        .select(['media_side.side_name'])
        .where(`media_side.id = '${body.article_side_id}'`)
        .getOne();

      if (fineSide === undefined) {
        console.log('ค้นหาข้อมูล side ไม่สำเร็จ');
        throw new InternalServerErrorException('ไม่พบข้อมูล side');
      } else sideName = fineSide.side_name;

      let colorName;
      //ค้นหา article Side
      const fineColor = await getConnection()
        .getRepository(MediaColorxEntity)
        .createQueryBuilder('media_color')
        .select(['media_color.colorx_name'])
        .where(`media_color.id = '${body.article_color_id}'`)
        .getOne();

      if (fineColor === undefined) {
        console.log('ค้นหาข้อมูล color ไม่สำเร็จ');
        throw new InternalServerErrorException('ไม่พบข้อมูล color');
      } else colorName = fineColor.colorx_name;

      let folder;
      let id_folder;
      let id_folder_Depart;
      let id_folder_Article;
      let id_folder_Color;
      let id_folder_Unit;
      let id_folder_Side;

      if (fineFolderByDepart === undefined) {
        //folder depart
        const repositoryFolder = getRepository(MediaFolderEntity);
        folder = new MediaFolderEntity();
        folder.folder_name = `${body.sale_depart_code}`;
        folder.parent_id = fineFolder.id;
        folder.folder_type = 'FOLDER';
        folder.reference = body.sale_depart_code;
        folder.created_time = (req.actionTime ===  undefined)?new Date():req.actionTime;
        folder.creator = (req.user === undefined)?'':req.user.userId;
        folder.description = '';
        const { id } = await repositoryFolder.save(folder);
        id_folder_Depart = id;
      } else id_folder_Depart = fineFolderByDepart.id;

      //folder.folder_name = `${body.sale_depart_code}_${body.article_code}_${colorName}_${body.article_unit_code}_${sideName}`;
      //folder Article
      if (id_folder_Depart !== undefined) {
        const fineRefArticle = await getConnection()
          .getRepository(MediaFolderEntity)
          .createQueryBuilder('media_folder')
          .select(['media_folder.id'])
          .where(
            `media_folder.folder_type = 'FOLDER' AND media_folder.reference = '${body.article_code}' AND media_folder.parent_id = '${id_folder_Depart}' `,
          )
          .getOne();

        if (fineRefArticle === undefined) {
          const repositoryFolderArticle = getRepository(MediaFolderEntity);
          folder = new MediaFolderEntity();
          folder.folder_name = `${body.article_code}`;
          folder.parent_id = id_folder_Depart;
          folder.folder_type = 'FOLDER';
          folder.reference = body.article_code;
          folder.created_time = (req.actionTime ===  undefined)?new Date():req.actionTime;
          folder.creator = (req.user === undefined)?'':req.user.userId;
          folder.description = '';
          const { id } = await repositoryFolderArticle.save(folder);
          id_folder_Article = id;
        } else id_folder_Article = fineRefArticle.id;
      }

      //folder color
      if (id_folder_Article !== undefined) {
        const fineRefColor = await getConnection()
          .getRepository(MediaFolderEntity)
          .createQueryBuilder('media_folder')
          .select(['media_folder.id'])
          .where(
            `media_folder.folder_type = 'FOLDER' AND media_folder.reference = '${body.article_color_id}' AND media_folder.parent_id = '${id_folder_Article}' `,
          )
          .getOne();

        if (fineRefColor === undefined) {
          const repositoryFolderColor = getRepository(MediaFolderEntity);
          folder = new MediaFolderEntity();
          folder.folder_name = `${colorName}`;
          folder.parent_id = id_folder_Article;
          folder.folder_type = 'FOLDER';
          folder.reference = body.article_color_id;
          folder.created_time = (req.actionTime ===  undefined)?new Date():req.actionTime;
          folder.creator = (req.user === undefined)?'':req.user.userId;
          folder.description = '';
          const { id } = await repositoryFolderColor.save(folder);
          id_folder_Color = id;
        } else id_folder_Color = fineRefColor.id;
      }

      //folder Unit
      if (id_folder_Color !== undefined) {
        const fineRefUnit = await getConnection()
          .getRepository(MediaFolderEntity)
          .createQueryBuilder('media_folder')
          .select(['media_folder.id'])
          .where(
            `media_folder.folder_type = 'FOLDER' AND media_folder.reference = '${body.article_unit_code}' AND media_folder.parent_id = '${id_folder_Color}' `,
          )
          .getOne();

        if (fineRefUnit === undefined) {
          const repositoryFolderUnit = getRepository(MediaFolderEntity);
          folder = new MediaFolderEntity();
          folder.folder_name = `${body.article_unit_code}`;
          folder.parent_id = id_folder_Color;
          folder.folder_type = 'FOLDER';
          folder.reference = body.article_unit_code;
          folder.created_time = (req.actionTime ===  undefined)?new Date():req.actionTime;
          folder.creator = (req.user === undefined)?'':req.user.userId;
          folder.description = '';
          const { id } = await repositoryFolderUnit.save(folder);
          id_folder_Unit = id;
        } else id_folder_Unit = fineRefUnit.id;
      }

      //folder Side
      if (id_folder_Unit !== undefined) {
        const fineRefSide = await getConnection()
          .getRepository(MediaFolderEntity)
          .createQueryBuilder('media_folder')
          .select(['media_folder.id'])
          .where(
            `media_folder.folder_type = 'FOLDER' AND media_folder.reference = '${body.article_side_id}' AND media_folder.parent_id = '${id_folder_Unit}' `,
          )
          .getOne();

        if (fineRefSide === undefined) {
          const repositoryFolderSide = getRepository(MediaFolderEntity);
          folder = new MediaFolderEntity();
          folder.folder_name = sideName;
          folder.parent_id = id_folder_Unit;
          folder.folder_type = 'SIDE_FOLDER';
          folder.reference = body.article_side_id;
          folder.created_time = (req.actionTime ===  undefined)?new Date():req.actionTime;
          folder.creator = (req.user === undefined)?'':req.user.userId;
          folder.description = '';
          const { id } = await repositoryFolderSide.save(folder);
          id_folder_Side = id;
        } else id_folder_Side = fineRefSide.id;
      }

      //ค้นหา article ถ้าไม่มีข้อมูลให้ insert ลง
      const fineArticle = await getConnection()
        .getRepository(MediaArticleEntity)
        .createQueryBuilder('media_article')
        .select(['media_article.id'])
        .where(`media_article.code = '${body.article_code}'`)
        .getOne();

      const queryArticle = `select TOP (1) [NAMETH] from TBMaster_Product where code = '${body.article_code}'`;
      const articleData = await this.connection.query(queryArticle);
      const DescriptionTHData: Array<IGetArticle> = articleData;
      const descArticle = DescriptionTHData[0].NAMETH ? DescriptionTHData[0].NAMETH : '';

      let article;
      let id_article;
      if (fineArticle === undefined) {
        const repositoryArticle = getRepository(MediaArticleEntity);
        article = new MediaArticleEntity();
        article.code = body.article_code;
        article.description = descArticle;
        article.creator = (req.user === undefined)?'':req.user.userId;
        article.created_time = (req.actionTime ===  undefined)?new Date():req.actionTime;

        try {
          const { id } = await repositoryArticle.save(article);
          id_article = id;
        } catch (err) {
          console.log('บันทึกข้อมูล article ไม่สำเร็จ' + err);
          throw new InternalServerErrorException('บันทึกข้อมูล article ไม่สำเร็จ' + ' , ' + err);
        }
      } else id_article = fineArticle.id;

      //ค้นหา unit ถ้าไม่มีข้อมูลให้ insert ลง
      const fineUnit = await getConnection()
        .getRepository(MediaUnitEntity)
        .createQueryBuilder('media_unit')
        .select(['media_unit.id'])
        .where(`media_unit.code = '${body.article_unit_code}'`)
        .getOne();

      const queryUnit = `select TOP (1) * from TBMaster_Unit where CODE = '${body.article_unit_code}'`;
      const unitData = await this.connection.query(queryUnit);
      const unitNameData: Array<IGetUnit> = unitData;
      const unitName = unitNameData[0].MYNAME ? unitNameData[0].MYNAME : '';

      let unit;
      let id_unit;
      if (fineUnit === undefined) {
        const repositoryUnit = getRepository(MediaUnitEntity);
        unit = new MediaUnitEntity();
        unit.code = body.article_unit_code;
        unit.description = unitName;
        unit.creator = (req.user === undefined)?'':req.user.userId;
        unit.created_time = (req.actionTime ===  undefined)?new Date():req.actionTime;

        try {
          const { id } = await repositoryUnit.save(unit);
          id_unit = id;
        } catch (err) {
          console.log('บันทึกข้อมูล Unit ไม่สำเร็จ');
          throw new InternalServerErrorException('บันทึกข้อมูล Unit ไม่สำเร็จ' + ' , ' + err);
        }
      } else id_unit = fineUnit.id;

      //ค้นหา sale_depart ถ้าไม่มีข้อมูลให้ insert ลง
      const fineSaleDepart = await getConnection()
        .getRepository(MediaSaleDepartmentEntity)
        .createQueryBuilder('media_sale')
        .select(['media_sale.id'])
        .where(`media_sale.code = '${body.sale_depart_code}'`)
        .getOne();

      const querySaleDepart = `select TOP (1) * from TBMaster_Seller where CODE = '${body.sale_depart_code}'`;
      const SaleDepartData = await this.connection.query(querySaleDepart);
      const SaleDepartNameData: Array<IGetSaleDepart> = SaleDepartData;
      const SaleDepartName = SaleDepartNameData[0].MYNAME ? SaleDepartNameData[0].MYNAME : '';

      let sale_depart;
      let id_sale_depart;
      if (fineSaleDepart === undefined) {
        const repositorySaleDepartment = getRepository(MediaSaleDepartmentEntity);
        sale_depart = new MediaUnitEntity();
        sale_depart.code = body.sale_depart_code;
        sale_depart.description = SaleDepartName;
        sale_depart.creator = (req.user === undefined)?'':req.user.userId;
        sale_depart.created_time = (req.actionTime ===  undefined)?new Date():req.actionTime;

        try {
          const { id } = await repositorySaleDepartment.save(sale_depart);
          id_sale_depart = id;
        } catch (err) {
          console.log('บันทึกข้อมูล Sale Depart ไม่สำเร็จ');
          throw new InternalServerErrorException('บันทึกข้อมูล Sale Depart ไม่สำเร็จ' + ' , ' + err);
        }
      } else id_sale_depart = fineSaleDepart.id;

      if (
        body.ContentType &&
        body.s3key &&
        id_sale_depart !== undefined &&
        id_article !== undefined &&
        id_unit !== undefined &&
        sideName !== undefined &&
        colorName !== undefined &&
        id_folder_Side !== undefined &&
        body.article_side_id &&
        body.article_color_id &&
        body.resolution_id
      ) {
        try {
          return await this.appService.dbRunner(async (runner: QueryRunner) => {
            const media_object = new MediaObjectEntity();
            console.log(
              body.sale_depart_code,
              id_sale_depart,
              body.article_color_id,
              id_unit,
              body.resolution_id,
              body.article_side_id,
            );
            const fineData = await getConnection()
              .getRepository(MediaObjectRelationEntity)
              .createQueryBuilder('media_object_relation')
              .where(
                `media_object_relation.article_id = '${id_article}' 
                AND media_object_relation.sale_depart_id = '${id_sale_depart}'
                AND media_object_relation.color_id = '${body.article_color_id}'
                AND media_object_relation.article_unit_id = '${id_unit}'
                AND media_object_relation.resolution_id = '${body.resolution_id}'
                AND media_object_relation.article_side_id = '${body.article_side_id}'
                `,
              )
              .getOne();

            if (fineData === undefined) {
              media_object.folder_id = id_folder_Side; ///////
              media_object.object_name = `${body.article_code}_${colorName}_${body.article_unit_code}_${sideName}_${body.ContentType}`;
              media_object.descripion = '';
              media_object.file_type = body.ContentType;
              media_object.file_group = 'ARTICLE';
              media_object.is_original = 0;
              media_object.creator = (req.user === undefined)?'':req.user.userId;
              media_object.created_time = (req.actionTime ===  undefined)?new Date():req.actionTime;
              media_object.s3key = body.s3key;

              const sMedia_object = await runner.manager.save(MediaObjectEntity, media_object);

              //เก็บ id ของ media object
              const { id } = sMedia_object;
              if (sMedia_object) {
                const media_object_relation = new MediaObjectRelationEntity();
                media_object_relation.object_id = id;
                media_object_relation.sale_depart_id = id_sale_depart;
                media_object_relation.article_id = id_article;
                media_object_relation.article_unit_id = id_unit;
                media_object_relation.article_side_id = body.article_side_id;
                media_object_relation.color_id = body.article_color_id;
                media_object_relation.resolution_id = body.resolution_id;
                media_object_relation.relation_type = 'ARTICLE';

                const sMedia_object_relation = await runner.manager.save(
                  MediaObjectRelationEntity,
                  media_object_relation,
                );
                return sMedia_object_relation;
              } else {
                throw new InternalServerErrorException('ไม่สามารถอัพโหลดไฟล์ได้');
              }
            } else {
              const fineDataObject: MediaObjectEntity = await runner.manager.findOne(MediaObjectEntity, {
                where: [{ id: fineData.object_id }],
              });
              if (fineDataObject !== undefined) {
                fineDataObject.s3key = body.s3key;

                const sMedia_object = await runner.manager.save(MediaObjectEntity, fineDataObject);
                return sMedia_object;
              }
            }
          });
        } catch (err) {
          throw new InternalServerErrorException('ไม่สามารถอัพโหลดไฟล์ได้ ----->>>>>' + ' , ' + err);
        }
      } else {
        throw new InternalServerErrorException('ข้อมูลไม่เป็นไปตามเงื่อนไขสร้างไฟล์');
      }

      //const { id } = folder;
    } catch (err) {
      throw new InternalServerErrorException('ไม่สามารถอัพโหลดไฟล์ได้ ----->>>>>' + ' , ' + err);
    }
  }

  async getDownload(s3key) {
    if (!s3key) throw new BadRequestException(`Invalid s3key`);
    return await this.uploaderService.getFileBody(s3key);
  }

  async postDataUploadArticleSetDetail(body: IGetArticleSet, req) {
    if (!body.folder_id && !body.article_code && !body.article_unit_code) {
      throw new BadRequestException('กรุณาใส่ข้อมูลให้ถูกต้อง');
    }

    //ค้นหา article ถ้าไม่มีข้อมูลให้ insert ลง
    const fineArticle = await getConnection()
      .getRepository(MediaArticleEntity)
      .createQueryBuilder('media_article')
      .select(['media_article.id'])
      .where(`media_article.code = '${body.article_code}'`)
      .getOne();

    const queryArticle = `select TOP (1) [NAMETH] from TBMaster_Product where code = '${body.article_code}'`;
    const articleData = await this.connection.query(queryArticle);
    const DescriptionTHData: Array<IGetArticle> = articleData;
    const descArticle = DescriptionTHData[0].NAMETH ? DescriptionTHData[0].NAMETH : '';

    let article;
    let id_article;
    if (fineArticle === undefined) {
      const repositoryArticle = getRepository(MediaArticleEntity);
      article = new MediaArticleEntity();
      article.code = body.article_code;
      article.description = descArticle;
      article.creator = (req.user === undefined)?'':req.user.userId;
      article.created_time = (req.actionTime ===  undefined)?new Date():req.actionTime;

      try {
        const { id } = await repositoryArticle.save(article);
        id_article = id;
      } catch (err) {
        console.log('บันทึกข้อมูล article ไม่สำเร็จ' + err);
        throw new InternalServerErrorException('บันทึกข้อมูล article ไม่สำเร็จ' + ' , ' + err);
      }
    } else id_article = fineArticle.id;

    //ค้นหา unit ถ้าไม่มีข้อมูลให้ insert ลง
    const fineUnit = await getConnection()
      .getRepository(MediaUnitEntity)
      .createQueryBuilder('media_unit')
      .select(['media_unit.id'])
      .where(`media_unit.code = '${body.article_unit_code}'`)
      .getOne();

    const queryUnit = `select TOP (1) * from TBMaster_Unit where CODE = '${body.article_unit_code}'`;
    const unitData = await this.connection.query(queryUnit);
    const unitNameData: Array<IGetUnit> = unitData;
    const unitName = unitNameData[0].MYNAME ? unitNameData[0].MYNAME : '';

    let unit;
    let id_unit;
    if (fineUnit === undefined) {
      const repositoryUnit = getRepository(MediaUnitEntity);
      unit = new MediaUnitEntity();
      unit.code = body.article_unit_code;
      unit.description = unitName;
      unit.creator = (req.user === undefined)?'':req.user.userId;
      unit.created_time = (req.actionTime ===  undefined)?new Date():req.actionTime;

      try {
        const { id } = await repositoryUnit.save(unit);
        id_unit = id;
      } catch (err) {
        console.log('บันทึกข้อมูล Unit ไม่สำเร็จ');
        throw new InternalServerErrorException('บันทึกข้อมูล Unit ไม่สำเร็จ' + ' , ' + err);
      }
    } else id_unit = fineUnit.id;

    //let postDataUploadRelation;
    const repositorypostObjectRelation = getRepository(MediaObjectRelationEntity);
    const postDataUploadRelation = new MediaObjectRelationEntity();
    postDataUploadRelation.object_id = body.folder_id;
    postDataUploadRelation.article_id = id_article;
    postDataUploadRelation.article_unit_id = id_unit;
    postDataUploadRelation.sale_depart_id = uuid();
    postDataUploadRelation.article_side_id = uuid();
    postDataUploadRelation.color_id = uuid();
    postDataUploadRelation.resolution_id = uuid();
    postDataUploadRelation.relation_type = 'ARTICLE_SET';

    return await repositorypostObjectRelation.save(postDataUploadRelation);
  }

  async postDataUploadArticleSet(body: DataUploadArticleSet, req) {
     // Validate
     if (!body.folder_id && !body.object_name && body.ContentType && body.s3key && body.resolution_id) {
      throw new BadRequestException('ไม่พบข้อมูล, folder_id');
    }

      return await this.appService.dbRunner(async (runner: QueryRunner) => {
        const media_object = new MediaObjectEntity();
        media_object.folder_id = body.folder_id; //body.article_side_id;
        media_object.object_name = body.object_name; //`${body.article_code}_${colorName}_${body.article_unit_code}_${sideName}_${body.ContentType}`;
        media_object.descripion = '';
        media_object.file_type = body.ContentType;
        media_object.file_group = 'ARTICLE_SET';
        media_object.is_original = 0;
        media_object.creator = (req.user === undefined)?'':req.user.userId;
        media_object.created_time = (req.actionTime ===  undefined)?new Date():req.actionTime;
        media_object.s3key = body.s3key;

        //let sMedia_object;
        const sMedia_object = await runner.manager.save(MediaObjectEntity, media_object);

        //เก็บ id ของ media object
        const { id } = sMedia_object;
        if (sMedia_object) {
          const media_object_relation = new MediaObjectRelationEntity();
          media_object_relation.object_id = id;
          media_object_relation.sale_depart_id = uuid(); //
          media_object_relation.article_id = uuid();
          media_object_relation.article_unit_id = uuid();
          media_object_relation.article_side_id = uuid(); //
          media_object_relation.color_id = uuid(); //
          media_object_relation.resolution_id = body.resolution_id;
          media_object_relation.relation_type = 'ARTICLE_SET';

          //let sMedia_object_relation;
          const sMedia_object_relation = await runner.manager.save(MediaObjectRelationEntity, media_object_relation);
          return sMedia_object_relation;
        } else {
          throw new InternalServerErrorException('ไม่สามารถอัพโหลดไฟล์ได้');
        }
      });
   
  }

  async getArticleSetDetail(props: IGetArticleSet) {
    // Validate
    if (!props.folder_id) {
      throw new BadRequestException('ไม่พบข้อมูล, folder_id');
    }
    const query = await getConnection()
      .getRepository(MediaObjectRelationEntity)
      .createQueryBuilder('media_object_relation')
      .leftJoinAndSelect(MediaArticleEntity, 'media_article', 'media_article.id = media_object_relation.article_id')
      .leftJoinAndSelect(MediaUnitEntity, 'media_unit', 'media_unit.id = media_object_relation.article_unit_id')
      .where(`media_object_relation.object_id = '${props.folder_id}'`)
      .getRawMany();

    return query;
  }

  async deleteMediaImage(s3key) {
    // Validate
    if (!s3key) {
      throw new BadRequestException('ไม่พบข้อมูล, s3key');
    }
     return await this.uploaderService.deleteFile(s3key);
  }

    // ค้นหาข้อมูล
  async searchArticleSet(props: IGetSearchArticleSet) {
  // Validate
  console.log('props', props.search_name)
  if (!props.folder_id || !props.search_name) {
    throw new BadRequestException('กรุณาตรวจสอบเงื่อนไขการค้นหา');
  }
      return await this.appService.dbRunner(async (runner: QueryRunner) => {
      return (await runner.manager.find(MediaObjectEntity, 
        { where: {folder_id:props.folder_id ,object_name: Like(`%${props.search_name}%`) } })) || ({} as MediaObjectEntity);
  });
}

}