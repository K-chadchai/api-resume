import { Entity, PrimaryGeneratedColumn, Column, Unique } from 'typeorm';
import { IUsersEntity } from '@libs';

const tname = 'users';

@Entity(tname)
@Unique(`uc_${tname}_employee_id`, ['employee_id'])
export class UsersEntity implements IUsersEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  employee_id: string;

  @Column({ nullable: true })
  image_key: string;
}
