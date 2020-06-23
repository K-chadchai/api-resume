import { Controller, Post, Body } from '@nestjs/common';
import { MediaArticleService } from './media-article.service';

@Controller('media-article')
export class MediaArticleController {
    constructor(public service: MediaArticleService) { }


    @Post()
    async post(@Body() body) {
        return await this.service.post(body);
    }
}
