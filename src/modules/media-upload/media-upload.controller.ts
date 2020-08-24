import { Controller, Get, Query, Post, Req, Res, Param, Body } from '@nestjs/common';
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

  @Get('/unitInfo')
  async getUnitInfo(@Query() query) {
    return await this.service.getUnitInfo(query);
  }

  @Post('upload')
  async postUpload(@Req() req, @Res() res, @Query() query) {
    return await this.service.uploadMedia(req, res, query);
  }

  @Get('image/:id')
  async getMediaImage(@Param('id') id, @Query('suffix') suffix) {
    return await this.service.getMediaImage(id, suffix);
  }

  @Get('imageBase/:id')
  async getMediaImageBase(@Param('id') id, @Query('suffix') suffix) {
    return await this.service.getMediaImageBase(id, suffix);
  }

  // @Get('shareImage/:id')
  // async shareImage(@Param('id') id, @Res() res) {
  //   return await this.service.shareImage(id, res);
  // }

  @Post('DataUpload')
  async postDataUpload(@Body() body) {
    return await this.service.postDataUpload(body);
  }

  @Get('download/:s3key')
  async getDownload(@Param('s3key') s3key) {
    return await this.service.getDownload(s3key);
  }

  @Post('DataUploadRelation')
  async postDataUploadRelation(@Body() body) {
    return await this.service.postDataUploadRelation(body);
  }

  @Post('DataUploadArticleSet')
  async postDataUploadArticleSet(@Body() body) {
    return await this.service.postDataUploadArticleSet(body);
  }
}
