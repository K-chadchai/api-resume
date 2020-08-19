import { ILoginLock } from 'src/interfaces/login_lock.interface';
import { PrimaryGeneratedColumn, Column, Entity, Unique } from 'typeorm';

const tname = 'login_lock';

@Entity(tname)
@Unique(`uc_${tname}_id`, ['id'])
export class LoginLockEntity implements ILoginLock {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  time_begin: Date;

  @Column({
    nullable: true,
  })
  time_end: Date;
}
