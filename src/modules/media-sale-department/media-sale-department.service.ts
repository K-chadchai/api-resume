import { Injectable } from '@nestjs/common';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { MediaSaleDepartmentEntity } from 'src/entities/media_sale_department.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { AppService } from 'src/app/app.service';

@Injectable()
export class MediaSaleDepartmentService extends TypeOrmCrudService<MediaSaleDepartmentEntity> {
    constructor(
        @InjectRepository(MediaSaleDepartmentEntity) repo,
        private readonly appService: AppService,
    ) {
        super(repo);
    }

    async post(body: MediaSaleDepartmentEntity) {
        return await this.repo.save(body);
    }
}
