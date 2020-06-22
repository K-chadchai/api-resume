import { Injectable, BadRequestException } from '@nestjs/common';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { MediaSideEntity } from 'src/entities/media_side.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, QueryRunner } from 'typeorm';
import { AppService } from 'src/app/app.service';

interface IgetSides {
    page_no: number,
    search: string
}

interface IEditSide {
    id: string,
    side_name: string,
    description: string,
    created_user: string,
    created_time: Date,
    last_edidor: string,
    last_edited_time: Date
}

@Injectable()
export class MediaSideService extends TypeOrmCrudService<MediaSideEntity> {

    constructor(
        @InjectRepository(MediaSideEntity) repo,
        private readonly appService: AppService,
    ) {
        super(repo);
    }

    // ค้นหาข้อมูล
    async get(props: IgetSides) {
        // console.log('props :>> ', props);
        return await this.repo.find({
            where: props.search ? {
                side_name: Like(`%${props.search}%`)
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

    async post(body: MediaSideEntity) {
        return this.repo.save(body)
    }
}