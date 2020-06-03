import { IMember } from "src/interfaces/member.interface";
import { PrimaryGeneratedColumn, Column, Entity, Unique } from "typeorm";

const tname = 'member';

@Entity(tname)
@Unique(`uc_${tname}_membership_no`, ['membership_no'])
export class Member implements IMember {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    membership_no: string;

    @Column()
    first_name: string;

    @Column({ nullable: true })
    last_name: string;

}