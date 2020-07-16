import { Controller, Get, Query } from '@nestjs/common';
import { MediaUploadService } from './media-upload.service';

@Controller('media-upload')
export class MediaUploadController {
  constructor(public service: MediaUploadService) {}

  @Get('/ArticleInfo')
  async getArticleInfo(@Query() query) {
    return await this.service.getArticleInfo(query);
  }

  @Get('/SaleDepartment')
  async getSaleDepartment(@Query() query) {
    return await this.service.getSaleDepartment(query);
  }
}
