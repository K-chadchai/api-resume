import { Injectable } from '@nestjs/common';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { MediaImageShareEntity } from 'src/entities/media_image_share.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { AppService } from 'src/app/app.service';

@Injectable()
export class MediaImageShareService extends TypeOrmCrudService<MediaImageShareEntity> {
    constructor(
        @InjectRepository(MediaImageShareEntity) repo,
        private readonly appService: AppService,
    ) {
        super(repo);
    }
}
