import { Injectable } from '@nestjs/common';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { MediaUserActionEntity } from 'src/entities/media_user_action.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { AppService } from 'src/app/app.service';

@Injectable()
export class MediaUserActionService extends TypeOrmCrudService<MediaUserActionEntity> {
    constructor(
        @InjectRepository(MediaUserActionEntity) repo,
        private readonly appService: AppService,
    ) {
        super(repo);
    }
}
