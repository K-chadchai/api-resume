import { Controller, Get, Query, Param, Put, Body, Delete, Post } from '@nestjs/common';
import { MediaUserActionService } from './media-user-action.service';
import { Crud } from '@nestjsx/crud';
import { MediaUserActionEntity } from 'src/entities/media_user_action.entity';

@Crud({
  model: { type: MediaUserActionEntity },
  params: { id: { field: 'id', type: 'uuid', primary: true } },
})
@Controller('media-user-action')
export class MediaUserActionController {
  constructor(public service: MediaUserActionService) {}

  @Get('/paging')
  async get(@Query() query) {
    return await this.service.getPaging(query);
  }
}
