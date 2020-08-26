import { Controller, Get, Query, Param, Put, Body, Delete, Post, Res, Req } from '@nestjs/common';
import { MediaImageShareService } from './media-image-share.service';
import { Crud } from '@nestjsx/crud';
import { MediaImageShareEntity } from 'src/entities/media_image_share.entity';

@Crud({
  model: { type: MediaImageShareEntity },
  params: { id: { field: 'id', type: 'uuid', primary: true } },
})
@Controller('media-image-share')
export class MediaImageShareController {
  constructor(public service: MediaImageShareService) {}

  @Get('/paging')
  async get(@Query() query) {
    return await this.service.getPaging(query);
  }

  @Get('shareImage/:id')
  async shareImage(@Param('id') id, @Res() res) {
    return await this.service.shareImages(id, res);
  }

  @Post('postShareImage')
  async postDataUpload(@Body() body, @Req() req) {
    return await this.service.postShareImage(body,req);
  }
  @Post('postShareImageDownload')
  async postShareImageDoload(@Body() body, @Req() req) {
    return await this.service.postShareImageDownload(body, req);
  }
}
