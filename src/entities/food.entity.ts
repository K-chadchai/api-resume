import { IFoodEntity } from "src/interfaces/food.interface";
import { PrimaryGeneratedColumn, Column, Entity, Unique } from "typeorm";

const tname = 'food';

@Entity(tname)
@Unique(`uc_${tname}_food_no`, ['food_no'])
export class FoodEntity implements IFoodEntity {


    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    food_no: string;

    @Column()
    food_name: string;

    @Column()
    price: string;
}