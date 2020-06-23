import { Controller, Post, Body } from '@nestjs/common';
import { MediaObjectRelationService } from './media-object-relation.service';

@Controller('media-object-relation')
export class MediaObjectRelationController {
    constructor(public service: MediaObjectRelationService) { }

    @Post()
    async post(@Body() body) {
        return this.service.post(body);
    }
}
