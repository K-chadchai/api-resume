import { ILoginLock } from 'src/interfaces/login_lock.interface';
import { PrimaryGeneratedColumn, Column, Entity, Unique } from 'typeorm';

const tname = 'login_lock';

@Entity(tname)
@Unique(`uc_${tname}_id`, ['id'])
export class LoginLockEntity implements ILoginLock {
  @PrimaryGeneratedColumn('uuid')
  id: string; // PK

  @Column({
    nullable: true,
    length: 20,
  })
  user_id: string;

  @Column()
  time_begin: Date; // เวลาที่เริ่ม lock ( not null )

  @Column({
    nullable: true,
  })
  time_end: Date; // เวลาที่สิ้นสุดการ lock ( nullable ) ( ถ้าเป็น null ให้ล็อคตลอด ) ( ถ้าไม่ใช้ null ต้องมากกว่า time_begin เสมอ)

  @Column()
  login_activity_id: string;
}
