import { Injectable } from '@nestjs/common';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { MediaActivityLogEntity } from 'src/entities/media_activity_log.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { AppService } from 'src/app/app.service';

@Injectable()
export class MediaActivityLogService extends TypeOrmCrudService<MediaActivityLogEntity> {
    constructor(
        @InjectRepository(MediaActivityLogEntity) repo,
        private readonly appService: AppService,
    ) {
        super(repo);
    }
}
