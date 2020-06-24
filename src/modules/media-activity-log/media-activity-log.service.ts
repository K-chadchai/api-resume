import { Injectable } from '@nestjs/common';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { MediaActivityLogEntity } from 'src/entities/media_activity_log.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { AppService } from 'src/app/app.service';
import { Like } from 'typeorm';

interface IPostBulk {
    bulk: MediaActivityLogEntity[]
}

interface IGetActivityLog {
    page_no: number,
    search: string
}

@Injectable()
export class MediaActivityLogService extends TypeOrmCrudService<MediaActivityLogEntity> {
    constructor(
        @InjectRepository(MediaActivityLogEntity) repo,
        private readonly appService: AppService,
    ) {
        super(repo);
    }

    // ค้นหาข้อมูล
    async getPaging(props: IGetActivityLog) {
        console.log('props', props)
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
