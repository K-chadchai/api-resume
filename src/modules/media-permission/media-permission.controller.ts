import { Controller, Get, Query, Param, Put, Body, Delete, Post } from '@nestjs/common';
import { MediaPermissionService } from './media-permission.service';
import { Crud } from '@nestjsx/crud';
import { MediaPermissionEntity } from 'src/entities/media_permission.entity';

@Crud({
    model: { type: MediaPermissionEntity },
    params: { id: { field: 'id', type: 'uuid', primary: true } },
})
@Controller('media-permission')
export class MediaPermissionController {
    constructor(public service: MediaPermissionService) { }


    @Get('/paging')
    async get(@Query() query) {
        return await this.service.getPaging(query)
    }
}
