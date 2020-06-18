import { Controller, Get, Query, Put, Body } from '@nestjs/common';
import { Crud } from '@nestjsx/crud';
import { MediaSideEntity } from 'src/entities/media_side.entity';
import { MediaSideService } from './media-side.service';

@Crud({
    model: { type: MediaSideEntity },
    params: { id: { field: 'id', type: 'uuid', primary: true } },
})

@Controller('media-side')
export class MediaSideController {
    constructor(public service: MediaSideService) { }

    @Get('sides')
    async getSides(@Query() query) {
        return await this.service.getSides(query)
    }

    @Get('side')
    async getSide(@Query() query) {
        return await this.service.getSide(query)
    }

    @Put('EditSide')
    async EditSide(@Body() query) {
        return await this.service.EditSide(query)
    }


}
