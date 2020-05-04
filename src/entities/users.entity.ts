import { Entity, PrimaryGeneratedColumn, Column, Unique } from 'typeorm';

const tname = 'users';

@Entity(tname)
@Unique(`uc_${tname}_employee_id`, ['employee_id'])
export class UsersEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  employee_id: string;

  @Column({ nullable: true })
  image_key: string;
}
