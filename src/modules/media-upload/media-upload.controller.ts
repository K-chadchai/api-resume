import { Controller, Get, Query, Post, Req, Res, Param } from '@nestjs/common';
import { MediaUploadService } from './media-upload.service';

@Controller('media-upload')
export class MediaUploadController {
  constructor(public service: MediaUploadService) {}

  @Get('/articleInfo')
  async getArticleInfo(@Query() query) {
    return await this.service.getArticleInfo(query);
  }

  @Get('/saleDepartment')
  async getSaleDepartment(@Query() query) {
    return await this.service.getSaleDepartment(query);
  }

  @Post('upload')
  async postUpload(@Req() req, @Res() res, @Query() query) {
    return await this.service.uploadMedia(req, res, query);
  }

  @Get('shareImage/:id')
  async shareImage(@Param('id') id, @Query('suffix') suffix) {
    return await this.service.shareImage(id, suffix);
  }
}
