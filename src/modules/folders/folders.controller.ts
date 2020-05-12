import { Controller } from '@nestjs/common';
import { Crud } from '@nestjsx/crud';
import { FoldersEntity } from 'src/entities/folders.entity';
import { FoldersService } from './folders.service';

@Crud({
  model: { type: FoldersEntity },
  params: { id: { field: 'id', type: 'uuid', primary: true } },
})
@Controller('folders')
export class FoldersController {
  constructor(public service: FoldersService) {}
}
