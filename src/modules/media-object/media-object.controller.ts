import {
  Controller,
  Get,
  Query,
  Param,
  Put,
  Body,
  Delete,
  Post,
} from '@nestjs/common';
import { MediaObjectService } from './media-object.service';
import { Crud } from '@nestjsx/crud';
import { MediaObjectEntity } from 'src/entities/media_object.entity';

@Crud({
  model: { type: MediaObjectEntity },
  params: { id: { field: 'id', type: 'uuid', primary: true } },
})
@Controller('media-object')
export class MediaObjectController {
  constructor(public service: MediaObjectService) {}

  @Get('/paging')
  async get(@Query() query) {
    return await this.service.getPaging(query);
  }

  @Get('/byFolder_id/:id')
  async getByFolderId(@Param('id') id) {
    return await this.service.getByFolderId(id);
  }
}
