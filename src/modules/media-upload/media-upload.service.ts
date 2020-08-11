import {
  Injectable,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { AppService } from 'src/app/app.service';
import { InjectConnection } from '@nestjs/typeorm';
import { Connection, getConnection, QueryRunner, getRepository } from 'typeorm';
import { UploaderService } from 'src/services/uploader.service';
import { async } from 'rxjs/internal/scheduler/async';
import { MediaObjectEntity } from 'src/entities/media_object.entity';
import { MediaFolderEntity } from 'src/entities/media_folder.entity';
import { create } from 'domain';
import { MediaArticleEntity } from 'src/entities/media_article.entity';
import { MediaObjectRelationEntity } from 'src/entities/media_object_relation.entity';
import { MediaSideEntity } from 'src/entities/media_side.entity';
import { MediaUnitEntity } from 'src/entities/media_unit.entity';
import { MediaSaleDepartmentEntity } from 'src/entities/media_sale_department.entity';
import { MediaColorxEntity } from 'src/entities/media_colorx.entity';

interface IGetArticleInfo {
  page_no: number;
  search: string;
}
interface IGetSaleDepartment {
  page_no: number;
  search: string;
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

interface IPostDataUpload {
  data: DataUpload[];
}

@Injectable()
export class MediaUploadService {
  constructor(
    private readonly appService: AppService,
    @InjectConnection('mssql')
    private readonly connection: Connection,
    private readonly uploaderService: UploaderService,
  ) {}

  async getArticleInfo(props: IGetArticleInfo) {
    let query = '';
    props.search
      ? (query = `select TOP (20) * from TBMaster_Article where Article like ('%${props.search}%') or DescriptionEN like ('%${props.search}%')`)
      : (query = 'select TOP (20) * from TBMaster_Article');
    return this.connection.query(query);
  }

  async getUnitInfo(props: IGetArticleInfo) {
    let query = '';

    if (!props.search) {
      throw new InternalServerErrorException('กรุณาใส่ข้อมูล article');
    }
    query = `select * from TBMaster_Product_Unit where PRODUCTCODE = '${props.search}'`;
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
    const { folderId, employee_id, path, old_id, isUserProfile } = query;
    const onCallback = async (data: any) => {
      //console.log('data :>> ', data);
      const file = data.files[0];
      if (file) {
        //console.log('file', file);
        const { s3key, ContentType } = file;

        let imageBody: string = '';
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

  delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
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

  async postDataUpload(body: IPostDataUpload) {
    const saved = [];
    const data = [];
    let message: string = '';
    for (let i = 0; i < body.data.length; i++) {
      try {
        //หา folder ROOT_ARTICLE เอา id
        const fineFolder = await getConnection()
          .getRepository(MediaFolderEntity)
          .createQueryBuilder('media_folder')
          .select(['media_folder.id'])
          .where(
            `media_folder.folder_type = 'ARTICLE_ROOT' AND media_folder.is_root = true`,
          )
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
          .where(
            `media_folder.folder_type = 'FOLDER' AND media_folder.reference = '${body.data[i].sale_depart_code}'`,
          )
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

        let article;
        let id_article;
        if (fineArticle === undefined) {
          const repositoryArticle = getRepository(MediaArticleEntity);
          article = new MediaArticleEntity();
          article.code = body.data[i].article_code;
          article.description = '';
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

        let unit;
        let id_unit;
        if (fineUnit === undefined) {
          const repositoryUnit = getRepository(MediaUnitEntity);
          unit = new MediaUnitEntity();
          unit.code = body.data[i].article_unit_code;
          unit.description = '';
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

        let sale_depart;
        let id_sale_depart;
        if (fineSaleDepart === undefined) {
          const repositorySaleDepartment = getRepository(
            MediaSaleDepartmentEntity,
          );
          sale_depart = new MediaUnitEntity();
          sale_depart.code = body.data[i].sale_depart_code;
          sale_depart.description = '';
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
              let media_object = new MediaObjectEntity();
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
                sMedia_object = await runner.manager.save(
                  MediaObjectEntity,
                  media_object,
                );
              } catch (err) {
                message = err;
                //throw new InternalServerErrorException('ไม่สามารถอัพโหลดไฟล์ได้');
              }
              //เก็บ id ของ media object
              const { id } = sMedia_object;
              console.log('id media_object ----->>>>>>', id);
              if (sMedia_object) {
                let media_object_relation = new MediaObjectRelationEntity();
                media_object_relation.object_id = id;
                media_object_relation.sale_depart_id = id_sale_depart;
                media_object_relation.article_id = id_article;
                media_object_relation.article_unit_id = id_unit;
                media_object_relation.article_side_id =
                  body.data[i].article_side_id;
                media_object_relation.color_id = body.data[i].article_color_id;
                media_object_relation.resolution_id =
                  body.data[i].resolution_id;

                let sMedia_object_relation;
                try {
                  sMedia_object_relation = await runner.manager.save(
                    MediaObjectRelationEntity,
                    media_object_relation,
                  );
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
        throw new InternalServerErrorException(
          'ไม่สามารถอัพโหลดไฟล์ได้ ----->>>>>' + ' , ' + err,
        );
      }
    }
    return saved;
  }
}
