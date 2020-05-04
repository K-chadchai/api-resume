import { Controller } from '@nestjs/common';
import { Crud } from '@nestjsx/crud';
import { CategoryEntity } from 'src/entities/category.entity';

@Crud({
  model: {
    type: CategoryEntity,
  },
})
@Controller('category')
export class CategoryController {}
