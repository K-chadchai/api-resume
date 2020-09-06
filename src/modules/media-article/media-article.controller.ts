import { Controller, Post, Body } from '@nestjs/common';
import { MediaArticleService } from './media-article.service';
import { Crud } from '@nestjsx/crud';
import { MediaArticleEntity } from 'src/entities/media_article.entity';

@Crud({
  model: { type: MediaArticleEntity },
  params: { id: { field: 'id', type: 'uuid', primary: true } },
})
@Controller('media-article')
export class MediaArticleController {
  constructor(public service: MediaArticleService) {}
}
