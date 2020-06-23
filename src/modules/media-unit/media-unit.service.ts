import { Injectable } from '@nestjs/common';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { MediaUnitEntity } from 'src/entities/media_unit.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { AppService } from 'src/app/app.service';

@Injectable()
export class MediaUnitService extends TypeOrmCrudService<MediaUnitEntity> {
    constructor(
        @InjectRepository(MediaUnitEntity) repo,
        private readonly appService: AppService,
    ) {
        super(repo);
    }

    async post(body: MediaUnitEntity) {
        return await this.repo.save(body);
    }
}
