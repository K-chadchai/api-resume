import { Controller, Get, Query } from '@nestjs/common';
import { Crud } from '@nestjsx/crud';
import { MediaColorsEntity } from 'src/entities/media_colors.entity';
import { MediaColorsService } from './media-colors.service';

@Crud({
  model: { type: MediaColorsEntity },
  params: { id: { field: 'id', type: 'uuid', primary: true } },
})
@Controller('media-colors')
export class MediaColorsController {
  constructor(public service: MediaColorsService) {}

  @Get('/paging')
  async get(@Query() query) {
    return await this.service.getPaging(query);
  }
}
