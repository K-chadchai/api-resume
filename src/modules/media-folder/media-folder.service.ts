import { Injectable } from '@nestjs/common';
import { MediaFolderEntity } from 'src/entities/media_folder.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { AppService } from 'src/app/app.service';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { Like } from 'typeorm';

interface IPostBulk {
    bulk: MediaFolderEntity[]
}

interface IGetFolder {
    page_no: number,
    search: string
}

@Injectable()
export class MediaFolderService extends TypeOrmCrudService<MediaFolderEntity> {

    constructor(
        @InjectRepository(MediaFolderEntity) repo,
        private readonly appService: AppService,
    ) {
        super(repo);
    }

    // ค้นหาข้อมูล
    async getPaging(props: IGetFolder) {
        return await this.repo.find({
            where: props.search ? {
                folder_name: Like(`%${props.search}%`)
            } : '',
            order: {
                folder_name: 'ASC'
            },
            skip: props.page_no > 0 ? ((props.page_no - 1) * 10) : 0,
            take: 10
        });
    }
}
