import { Controller, Get, Param } from '@nestjs/common';
import { Crud } from '@nestjsx/crud';
import { CategoryFolderEntity } from 'src/entities/category_folder.entity';
import { CategoryFolderService } from './category-folder.service';

@Crud({
  model: {
    type: CategoryFolderEntity,
  },
})
@Controller('category-folder')
export class CategoryFolderController {
  constructor(public service: CategoryFolderService) {}

  @Get('category/:catId')
  async getFolderByCat(@Param('catId') catId) {
    return await this.service.getFolderByCat(catId);
  }
}
