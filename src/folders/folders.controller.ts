import { Controller, Get, Param } from '@nestjs/common';
import { Crud } from '@nestjsx/crud';
import { FoldersEntity } from 'src/entities/folders.entity';
import { FoldersService } from './folders.service';

@Crud({
  model: { type: FoldersEntity },
  params: { id: { field: 'id', type: 'uuid', primary: true } },
})
@Controller('category-folder')
export class FoldersController {
  constructor(public service: FoldersService) {}

  @Get('category/:catId')
  async getFolderByCat(@Param('catId') catId) {
    return await this.service.getFolderByCat(catId);
  }
}
