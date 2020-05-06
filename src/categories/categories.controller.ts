import { Controller } from '@nestjs/common';
import { Crud } from '@nestjsx/crud';
import { CategoriesService } from './categories.service';
import { CategoriesEntity } from 'src/entities/categories.entity';

@Crud({
  model: { type: CategoriesEntity },
  params: { id: { field: 'id', type: 'uuid', primary: true } },
})
@Controller('categories')
export class CategoriesController {
  constructor(public service: CategoriesService) {}
}
