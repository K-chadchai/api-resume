import { Controller, Get, Query, Param, Put, Body, Delete, Post } from '@nestjs/common';
import { MediaRoleService } from './media-role.service';
import { Crud } from '@nestjsx/crud';
import { MediaRoleEntity } from 'src/entities/media_role.entity';

@Crud({
  model: { type: MediaRoleEntity },
  params: { id: { field: 'id', type: 'uuid', primary: true } },
})
@Controller('media-role')
export class MediaRoleController {
  constructor(public service: MediaRoleService) {}

  @Get('/paging')
  async get(@Query() query) {
    return await this.service.getPaging(query);
  }
}
