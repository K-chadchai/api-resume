import { Controller } from '@nestjs/common';
import { Crud } from '@nestjsx/crud';
import { CategoryEntity } from 'src/entities/category.entity';
import { CategoryService } from './category.service';

@Crud({
  model: {
    type: CategoryEntity,
  },
})
@Controller('category')
export class CategoryController {
  constructor(public service: CategoryService) {}
}
