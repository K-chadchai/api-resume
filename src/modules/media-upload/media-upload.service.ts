import { Injectable, BadRequestException } from '@nestjs/common';
import { AppService } from 'src/app/app.service';
import { InjectConnection } from '@nestjs/typeorm';
import { Connection } from 'typeorm';
import { UploaderService } from 'src/services/uploader.service';

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
        const { s3key } = file;
        return { s3key };
      }
    };
    //Process
    return await this.uploaderService.uploadFile2(req, res, query, onCallback);
  }

  async shareImage(s3key, suffix = 'x') {
    // Find Media
    // const medias = await this.repo.findByIds([mediaId]);
    // if (medias.length == 0)
    //   throw new BadRequestException(`Not found media.id=${mediaId}`);
    // Find Image with suffix [Option]
    let imageBody: string;
    if (s3key) {
      imageBody = await this.uploaderService.shareImage(s3key);
    }

    if (imageBody) {
      // imageBody = `data:${medias[0].mimetype};base64,${imageBody}`;
      imageBody = `data:${'Lname'};base64,${imageBody}`;
    }

    //return { media: medias[0], s3key, imageBody };
    return { media: 'Lname', s3key, imageBody };
  }
}
