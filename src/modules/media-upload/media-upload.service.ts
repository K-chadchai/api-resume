import { Injectable } from '@nestjs/common';
import { AppService } from 'src/app/app.service';
import { InjectConnection } from '@nestjs/typeorm';
import { Connection } from 'typeorm';

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
}
