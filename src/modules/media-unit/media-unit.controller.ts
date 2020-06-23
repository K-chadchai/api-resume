import { Controller, Post, Body } from '@nestjs/common';
import { MediaUnitService } from './media-unit.service';

@Controller('media-unit')
export class MediaUnitController {
    constructor(public service: MediaUnitService) { }

    @Post()
    async post(@Body() body) {
        return await this.service.post(body);
    }

}
