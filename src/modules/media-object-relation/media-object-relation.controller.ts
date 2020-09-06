import { Controller, Post, Body, Get, Query } from '@nestjs/common';
import { MediaObjectRelationService } from './media-object-relation.service';
import { Crud } from '@nestjsx/crud';
import { MediaObjectRelationEntity } from 'src/entities/media_object_relation.entity';

@Crud({
  model: { type: MediaObjectRelationEntity },
  params: { id: { field: 'id', type: 'uuid', primary: true } },
})
@Controller('media-object-relation')
export class MediaObjectRelationController {
  constructor(public service: MediaObjectRelationService) {}

  @Post('/article-depart-unit-side')
  async getArticleDepartUnitSide(@Body() body) {
    return await this.service.getArticleDepartUnitSide(body);
  }
}
