import { Injectable } from '@nestjs/common';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { MediaObjectEntity } from 'src/entities/media_object.entity';
import { AppService } from 'src/app/app.service';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class MediaObjectService extends TypeOrmCrudService<MediaObjectEntity> {
    constructor(
        @InjectRepository(MediaObjectEntity) repo,
        private readonly appService: AppService
    ) {
        super(repo);
    }
}
