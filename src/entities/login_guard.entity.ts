import { Entity, Unique, PrimaryGeneratedColumn, Column } from 'typeorm';
import { ILoginGuard } from '@libs';

const tname = 'login_guard';

@Entity(tname)
@Unique(`uc_${tname}_user_id`, ['user_id'])
export class LoginGuardEntity implements ILoginGuard {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    nullable: true,
    length: 20,
  })
  user_id: string; // UC

  @Column({
    nullable: true,
    length: 36,
  })
  login_lock_id: string; // login_lock.id ( nullable )
}
