import { PrimaryGeneratedColumn, Column, Entity } from 'typeorm';
import { IRoleActivity } from '@nikom.san/api-authen';

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
