import { Controller, Get, Query } from '@nestjs/common';
import { Crud } from '@nestjsx/crud';
import { MediaResolutionEntity } from 'src/entities/media_resolution.entity';
import { MediaResolutionService } from './media-resolution.service';

@Crud({
  model: { type: MediaResolutionEntity },
  params: { id: { field: 'id', type: 'uuid', primary: true } },
})
@Controller('media-resolution')
export class MediaResolutionController {
  constructor(public service: MediaResolutionService) {}

  @Get('/paging')
  async get(@Query() query) {
    return await this.service.getPaging(query);
  }

  @Get('/article-depart-unit-side')
  async getArticleDepartUnitSide(@Query() query) {
    return await this.service.getArticleDepartUnitSide(query);
  }
}
