import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { ILoginActivity } from '@libs/interfaces';

const tname = 'login_activity';

@Entity(tname)
export class LoginActivityEntity implements ILoginActivity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    nullable: true,
    length: 20,
  })
  user_id: string;

  @Column()
  login_time: Date; // วันเวลาที่กด login ( อาจจะผ่านหรือไม่ผ่าน ก็ได้ )

  @Column({
    length: 2,
  })
  login_success: string; // 1=สำเร็จ, 0=ไม่สำเร็จ

  @Column({ nullable: true })
  time_expire: Date;

  @Column({ nullable: true })
  kill_status: string;

  @Column({ nullable: true })
  kill_admin: string;

  @Column({ nullable: true })
  kill_time: Date;

  @Column({ nullable: true })
  logout_status: string; // 1=ออกจากระบบแล้ว

  @Column({ nullable: true })
  logout_time: Date; // เวลาที่ทำการ logout
}
