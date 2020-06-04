import { Module } from '@nestjs/common';
import { FoodService } from './food.service';
import { FoodController } from './food.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FoodEntity } from 'src/entities/food.entity';

@Module({
  imports: [TypeOrmModule.forFeature([FoodEntity])],
  providers: [FoodService],
  controllers: [FoodController]
})
export class FoodModule { }
