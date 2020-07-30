import { Injectable, BadRequestException } from '@nestjs/common';
import { AppService } from 'src/app/app.service';
import { InjectConnection } from '@nestjs/typeorm';
import { Connection } from 'typeorm';
import { UploaderService } from 'src/services/uploader.service';
import { async } from 'rxjs/internal/scheduler/async';

interface IGetArticleInfo {
  page_no: number;
  search: string;
}
interface IGetSaleDepartment {
  page_no: number;
  search: string;
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
    const onCallback = (data: any) => {
      //console.log('data :>> ', data);
      const file = data.files[0];
      if (file) {
        //console.log('file', file);
        const { s3key } = file;
        return file;
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
  throwBadRequestException(arg0: string) {
    throw new Error('Method not implemented.');
  }
}
