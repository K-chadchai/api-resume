import { Injectable } from '@nestjs/common';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { MediaArticleEntity } from 'src/entities/media_article.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { AppService } from 'src/app/app.service';

interface IPostBulk {
    bulk: MediaArticleEntity[]
}

@Injectable()
export class MediaArticleService extends TypeOrmCrudService<MediaArticleEntity> {
    constructor(
        @InjectRepository(MediaArticleEntity) repo,
        private readonly appService: AppService,
    ) {
        super(repo);
    }
}
