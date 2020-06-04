import { IInterstRateEntity } from "src/interfaces/interst_rate.interface";
import { PrimaryGeneratedColumn, Column, Entity, Unique } from "typeorm";

const tname = 'interst_rate';

@Entity(tname)
@Unique(`uc_${tname}_effect_date`, ['effect_date'])

export class InterstRateEntity implements IInterstRateEntity {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    effect_date: Date;

    @Column()
    percent: number;
}