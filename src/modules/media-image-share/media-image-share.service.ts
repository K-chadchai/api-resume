import { Injectable } from '@nestjs/common';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { MediaImageShareEntity } from 'src/entities/media_image_share.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { AppService } from 'src/app/app.service';
import { Like } from 'typeorm';

interface IPostBulk {
    bulk: MediaImageShareEntity[]
}

interface IGetImageShare {
    page_no: number,
    search: string
}

@Injectable()
export class MediaImageShareService extends TypeOrmCrudService<MediaImageShareEntity> {
    constructor(
        @InjectRepository(MediaImageShareEntity) repo,
        private readonly appService: AppService,
    ) {
        super(repo);
    }

    // ค้นหาข้อมูล
    async getPaging(props: IGetImageShare) {
        return await this.repo.find({
            where: props.search ? {
                object_id: Like(`%${props.search}%`)
            } : '',
            order: {
                object_id: 'ASC'
            },
            skip: props.page_no > 0 ? ((props.page_no - 1) * 10) : 0,
            take: 10
        });
    }
}
