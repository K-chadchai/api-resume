import { Controller, Get, Query, Post, Req, Res, Param, Body, Delete } from '@nestjs/common';
import { MediaUploadService } from './media-upload.service';

@Controller('media-upload')
export class MediaUploadController {
  constructor(public service: MediaUploadService) {}

  @Get('/articleInfo')
  async getArticleInfo(@Query() query) {
    return await this.service.getArticleInfo(query);
  }

  @Get('/articleInfoSet')
  async getArticleInfoSet(@Query() query) {
    return await this.service.getArticleInfoSet(query);
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
  async postDataUpload(@Body() body, @Req() req) {
    return await this.service.postDataUpload(body, req);
  }

  @Get('download/:s3key')
  async getDownload(@Param('s3key') s3key) {
    return await this.service.getDownload(s3key);
  }

  @Post('DataUploadArticleSetDetail')
  async postDataUploadArticleSetDetail(@Body() body, @Req() req) {
    return await this.service.postDataUploadArticleSetDetail(body,req);
  }

  @Post('DataUploadArticleSet')
  async postDataUploadArticleSet(@Body() body, @Req() req) {
    return await this.service.postDataUploadArticleSet(body, req);
  }

  @Get('/ArticleSetDetail')
  async getArticleSetDetail(@Query() query) {
      return await this.service.getArticleSetDetail(query)
  }

  @Delete('deleteImage/:s3key')
  async deleteMediaImage(@Param('s3key') s3key) {
    console.log('s3key', s3key)
    return await this.service.deleteMediaImage(s3key);
  }

  @Get('/searchArticleSet')
  async get(@Query() query) {
    return await this.service.searchArticleSet(query);
  }
  
}