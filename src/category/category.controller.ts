import { Controller } from '@nestjs/common';
import { Crud } from '@nestjsx/crud';
import { CategoryService } from './category.service';
import { CategoryEntity } from 'src/entities/category.entity';

@Crud({
  model: { type: CategoryEntity },
  params: { id: { field: 'id', type: 'uuid', primary: true } },
})
@Controller('category')
export class CategoryController {
  constructor(public service: CategoryService) {}
}
