import { Injectable } from '@nestjs/common';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { MediaRoleEntity } from 'src/entities/media_role.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { AppService } from 'src/app/app.service';

@Injectable()
export class MediaRoleService extends TypeOrmCrudService<MediaRoleEntity>{
    constructor(
        @InjectRepository(MediaRoleEntity) repo,
        private readonly appservice: AppService,
    ) {
        super(repo);
    }
}
