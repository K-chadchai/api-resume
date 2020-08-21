import { IRoleActivity } from 'src/interfaces/role_activity.interface';
import { PrimaryGeneratedColumn, Column, Entity } from 'typeorm';

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
