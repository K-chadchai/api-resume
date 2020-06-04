import { Injectable } from '@nestjs/common';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { FoodEntity } from 'src/entities/food.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class FoodService extends TypeOrmCrudService<FoodEntity> {
    constructor(@InjectRepository(FoodEntity) repo) {
        super(repo)
    }
}
