import { Controller, Post, Body } from '@nestjs/common';
import { MediaObjectRelationService } from './media-object-relation.service';
import { Crud } from '@nestjsx/crud';
import { MediaObjectRelationEntity } from 'src/entities/media_object_relation.entity';

@Crud({
    model: { type: MediaObjectRelationEntity },
    params: { id: { field: 'id', type: 'uuid', primary: true } },
})
@Controller('media-object-relation')
export class MediaObjectRelationController {
    constructor(public service: MediaObjectRelationService) { }
}
