import { Controller, Post, Body, Get, Query, Param, Put, Delete } from '@nestjs/common';
import { Crud } from '@nestjsx/crud';
import { MediaFolderEntity } from 'src/entities/media_folder.entity';
import { MediaFolderService } from './media-folder.service';

// @Crud({
//     model: { type: MediaFolderEntity },
//     params: { id: { field: 'id', type: 'uuid', primary: true } },
// })
@Controller('media-folder')
export class MediaFolderController {
    constructor(public service: MediaFolderService) { }


    @Get()
    async get(@Query() query) {
        return await this.service.get(query)
    }

    @Get('/:id')
    async getById(@Param('id') id) {
        return await this.service.getById(id)
    }

    @Put()
    async put(@Body() body) {
        return await this.service.update(body)
    }

    @Delete('/:id')
    async delete(@Param('id') id) {
        return await this.service.delete(id)
    }

    @Post()
    async post(@Body() body) {
        return await this.service.post(body)
    }

    @Post('/bulk')
    async postBulk(@Body() body) {
        return await this.service.postBulk(body)
    }
}
