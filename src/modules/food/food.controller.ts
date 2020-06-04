import { Controller } from '@nestjs/common';
import { FoodEntity } from 'src/entities/food.entity';
import { Crud } from '@nestjsx/crud';
import { FoodService } from './food.service';

@Crud({
    model: { type: FoodEntity },
    params: { id: { field: 'id', type: 'uuid', primary: true } },
})

@Controller('food')
export class FoodController {
    constructor(public service: FoodService) { }
}
