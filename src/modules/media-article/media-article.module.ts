import { Module } from '@nestjs/common';
import { MediaArticleService } from './media-article.service';
import { MediaArticleController } from './media-article.controller';
import { AppService } from 'src/app/app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MediaArticleEntity } from 'src/entities/media_article.entity';

@Module({
  imports: [TypeOrmModule.forFeature([MediaArticleEntity])],
  providers: [MediaArticleService, AppService],
  controllers: [MediaArticleController]
})
export class MediaArticleModule { }
