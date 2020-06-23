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
    async get(props: IGetFolder) {
        return await this.repo.find({
            where: props.search ? {
                folder_name: Like(`%${props.search}%`)
            } : '',
            order: {
                created_time: 'ASC'
            },
            skip: props.page_no > 0 ? ((props.page_no - 1) * 10) : 0,
            take: 10
        });
    }

    // ค้นหาข้อมูล by id
    async getById(id: string) {
        return await this.repo.findOne({
            where: [
                { id: id }
            ]
        });
    }

    // Update
    async update(body) {
        // Validate
        if (!body.id) {
            this.throwBadRequestException("ไม่พบข้อมูล, id");
        }
        if (!await this.repo.findOne({ where: { id: body.id } })) {
            this.throwBadRequestException(`ไม่พบข้อมูล, id=${body.id}`);
        }
        // Process
        return await this.repo.save(body);
    }

    // Delete
    async delete(id: string) {
        // Validate
        if (!id) {
            this.throwBadRequestException("ไม่พบข้อมูล, id");
        }
        // Find data
        const data = await this.repo.findOne({
            where: { id: id }
        })
        if (!data) {
            this.throwBadRequestException(`ไม่พบข้อมูล, id=${id}`);
        }
        // Process
        return await this.repo.remove(data);
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
