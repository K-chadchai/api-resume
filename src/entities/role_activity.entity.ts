import { PrimaryGeneratedColumn, Column, Entity } from 'typeorm';
import { IRoleActivity } from '@libs/interfaces/role_activity.interface';

const tname = 'role_activity';

@Entity(tname)
export class RoleActivityEntity implements IRoleActivity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  user_id: string;

  @Column()
  roles_json: string;
}
