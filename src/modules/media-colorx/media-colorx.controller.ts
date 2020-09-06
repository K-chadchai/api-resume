import { Controller, Get, Query } from '@nestjs/common';
import { MediaColorxEntity } from 'src/entities/media_colorx.entity';
import { Crud } from '@nestjsx/crud';
import { MediaColorxService } from './media-colorx.service';

@Crud({
  model: { type: MediaColorxEntity },
  params: { id: { field: 'id', type: 'uuid', primary: true } },
})
@Controller('media-colorx')
export class MediaColorxController {
  constructor(public service: MediaColorxService) {}

  @Get('/paging')
  async get(@Query() query) {
    return await this.service.getPaging(query);
  }
}
