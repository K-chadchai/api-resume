import {
  Injectable,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { AppService } from 'src/app/app.service';
import { InjectConnection } from '@nestjs/typeorm';
import { Connection } from 'typeorm';
import { UploaderService } from 'src/services/uploader.service';
import { async } from 'rxjs/internal/scheduler/async';
import { MediaObjectEntity } from 'src/entities/media_object.entity';

interface IGetArticleInfo {
  page_no: number;
  search: string;
}
interface IGetSaleDepartment {
  page_no: number;
  search: string;
}

interface DataUpload {
  article_id: string;
  article_unit_id: string;
  article_side_id: string;
  sale_depart_id: string;
  s3key: string;
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
        const { s3key } = file;
        let imageBody: string = '';
        if (s3key) {
          imageBody = await this.uploaderService.getImageBody(s3key);
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

  async shareImage(s3key, res) {
    let retValue: any = null;
    if (s3key) {
      const onCallback = async (e: any) => {
        retValue = { ...e };
      };
      await this.uploaderService.shareImage(s3key, res, onCallback);
      // wait
      while (retValue === null) {
        await this.delay(300);
        if (retValue !== null) {
          return retValue;
        }
      }
    }
  }

  async postDataUpload(body: IPostDataUpload) {
    const saved = [];
    for (let i = 0; i < body.data.length; i++) {
      console.log('data', body.data);
      //saved.push(await this.repo.save(body.bulk[i]));
    }
    return saved;
  }
}
