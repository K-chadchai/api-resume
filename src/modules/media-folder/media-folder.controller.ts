import { Controller, Post, Body } from '@nestjs/common';
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

    @Post()
    async post(@Body() body) {
        return await this.service.post(body)
    }

    @Post('/bulk')
    async postBulk(@Body() body) {
        return await this.service.postBulk(body)
    }
}
