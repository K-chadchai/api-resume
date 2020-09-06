import { Controller, Get, Query, Put, Body, Req, Res, Delete, Param, Post } from '@nestjs/common';
import { Crud } from '@nestjsx/crud';
import { MediaSideEntity } from 'src/entities/media_side.entity';
import { MediaSideService } from './media-side.service';

@Crud({
  model: { type: MediaSideEntity },
  params: { id: { field: 'id', type: 'uuid', primary: true } },
})
@Controller('media-side')
export class MediaSideController {
  constructor(public service: MediaSideService) {}

  @Get('/paging')
  async get(@Query() query) {
    return await this.service.getPaging(query);
  }

  // @Get('/:id')
  // async getById(@Param('id') id) {
  //     return await this.service.getById(id)
  // }

  // @Put()
  // async put(@Body() body) {
  //     return await this.service.update(body)
  // }

  // @Delete('/:id')
  // async delete(@Param('id') id) {
  //     return await this.service.delete(id)
  // }

  // @Post()
  // async post(@Body() body) {
  //     return await this.service.post(body)
  // }

  // @Post('/bulk')
  // async postBulk(@Body() body) {
  //     return await this.service.postBulk(body)
  // }
}
