import { Injectable } from '@nestjs/common';
import { MediaPermissionEntity } from 'src/entities/media_permission.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { MediaObjectRelationEntity } from 'src/entities/media_object_relation.entity';
import { AppService } from 'src/app/app.service';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { Like } from 'typeorm';

interface IPostBulk {
    bulk: MediaPermissionEntity[]
}

interface IGetPermission {
    page_no: number,
    search: string
}

@Injectable()
export class MediaPermissionService extends TypeOrmCrudService<MediaPermissionEntity> {
    constructor(
        @InjectRepository(MediaPermissionEntity) repo,
        private readonly appService: AppService,
    ) {
        super(repo);
    }

    // ค้นหาข้อมูล
    async getPaging(props: IGetPermission) {
        return await this.repo.find({
            where: props.search ? {
                action_id: Like(`%${props.search}%`)
            } : '',
            order: {
                created_time: 'ASC'
            },
            skip: props.page_no > 0 ? ((props.page_no - 1) * 10) : 0,
            take: 10
        });
    }
}