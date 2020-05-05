import { Controller, Get, Param } from '@nestjs/common';
import { Crud } from '@nestjsx/crud';
import { CategoryFolderEntity } from 'src/entities/category-folder.entity';
import { CategoryFolderService } from './category-folder.service';

@Crud({
  model: { type: CategoryFolderEntity },
  params: { id: { field: 'id', type: 'uuid', primary: true } },
})
@Controller('category-folder')
export class CategoryFolderController {
  constructor(public service: CategoryFolderService) {}

  @Get('category/:catId')
  async getFolderByCat(@Param('catId') catId) {
    return await this.service.getFolderByCat(catId);
  }
}
