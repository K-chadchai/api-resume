import { Injectable } from '@nestjs/common';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { MediaObjectRelationEntity } from 'src/entities/media_object_relation.entity';
import { AppService } from 'src/app/app.service';

interface IPostBulk {
    bulk: MediaObjectRelationEntity[]
}

@Injectable()
export class MediaObjectRelationService extends TypeOrmCrudService<MediaObjectRelationEntity>{
    constructor(
        @InjectRepository(MediaObjectRelationEntity) repo,
        private readonly appService: AppService,
    ) {
        super(repo);
    }
}
