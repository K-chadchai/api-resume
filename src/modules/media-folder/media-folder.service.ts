import { Injectable } from '@nestjs/common';
import { MediaFolderEntity } from 'src/entities/media_folder.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { AppService } from 'src/app/app.service';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';

interface IPostBulk {
    bulk: MediaFolderEntity[]
}

@Injectable()
export class MediaFolderService extends TypeOrmCrudService<MediaFolderEntity> {

    constructor(
        @InjectRepository(MediaFolderEntity) repo,
        private readonly appService: AppService,
    ) {
        super(repo);
    }

    async post(body: MediaFolderEntity) {
        return await this.repo.save(body)
    }

    async postBulk(body: IPostBulk) {
        const saved = []
        for (let i = 0; i < body.bulk.length; i++) {
            saved.push(await this.repo.save(body.bulk[i]))
        }
        return saved
    }
}
