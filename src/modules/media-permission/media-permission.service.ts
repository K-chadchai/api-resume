import { Injectable } from '@nestjs/common';
import { MediaPermissionEntity } from 'src/entities/media_permission.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { MediaObjectRelationEntity } from 'src/entities/media_object_relation.entity';
import { AppService } from 'src/app/app.service';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';

@Injectable()
export class MediaPermissionService extends TypeOrmCrudService<MediaPermissionEntity> {
    constructor(
        @InjectRepository(MediaPermissionEntity) repo,
        private readonly appService: AppService,
    ) {
        super(repo);
    }
}