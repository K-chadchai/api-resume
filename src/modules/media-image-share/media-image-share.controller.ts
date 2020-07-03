import { Controller, Get, Query, Param, Put, Body, Delete, Post } from '@nestjs/common';
import { MediaImageShareService } from './media-image-share.service';
import { Crud } from '@nestjsx/crud';
import { MediaImageShareEntity } from 'src/entities/media_image_share.entity';

@Crud({
    model: { type: MediaImageShareEntity },
    params: { id: { field: 'id', type: 'uuid', primary: true } },
})

@Controller('media-image-share')
export class MediaImageShareController {
    constructor(public service: MediaImageShareService) { }

    @Get('/paging')
    async get(@Query() query) {
        return await this.service.getPaging(query)
    }

}
