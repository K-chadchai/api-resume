import { Injectable } from '@nestjs/common';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { MediaRoleEntity } from 'src/entities/media_role.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { AppService } from 'src/app/app.service';
import { Like } from 'typeorm';

interface IPostBulk {
  bulk: MediaRoleEntity[];
}

interface IGetRole {
  page_no: number;
  search: string;
}

@Injectable()
export class MediaRoleService extends TypeOrmCrudService<MediaRoleEntity> {
  constructor(@InjectRepository(MediaRoleEntity) repo, private readonly appservice: AppService) {
    super(repo);
  }

  // ค้นหาข้อมูล
  async getPaging(props: IGetRole) {
    return await this.repo.find({
      where: props.search
        ? {
            description: Like(`%${props.search}%`),
          }
        : '',
      order: {
        description: 'ASC',
      },
      skip: props.page_no > 0 ? (props.page_no - 1) * 10 : 0,
      take: 10,
    });
  }
}
