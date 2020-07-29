import { Injectable } from '@nestjs/common';
import { MediaFolderEntity } from 'src/entities/media_folder.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { AppService } from 'src/app/app.service';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { Like, QueryRunner } from 'typeorm';

interface IPostBulk {
  bulk: MediaFolderEntity[];
}

interface IGetFolder {
  page_no: number;
  search: string;
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
    if (props.search === 'ROOT') {
      return await this.repo.find({
        where: {
          parent_id: props.search,
        },
        order: {
          folder_name: 'ASC',
        },
        skip: props.page_no > 0 ? (props.page_no - 1) * 10 : 0,
        take: 10,
      });
    } else {
      return await this.repo.find({
        where: props.search
          ? {
              parent_id: Like(`%${props.search}%`),
            }
          : '',
        order: {
          folder_name: 'ASC',
        },
        skip: props.page_no > 0 ? (props.page_no - 1) * 10 : 0,
        take: 10,
      });
    }
  }

  async postInit() {
    return await this.appService.dbRunner(async (runner: QueryRunner) => {
      let folder1 = new MediaFolderEntity();
      folder1.folder_name = 'ARTICLE';
      folder1.parent_id = 'ROOT';
      folder1.folder_type = 'ARTICLE_ROOT';

      let folder2 = new MediaFolderEntity();
      folder2.folder_name = 'Article Set';
      folder2.parent_id = 'ROOT';
      folder2.folder_type = 'ARTICLE_SET_ROOT';

      const sf1 = await runner.manager.save(MediaFolderEntity, folder1);
      const sf2 = await runner.manager.save(MediaFolderEntity, folder2);

      if (!sf1 && !sf2) {
        this.throwBadRequestException(`บันทึกข้อมูลไม่สำเร็จ`);
      }
      return { sf1, sf2 };
    });
  }
}
