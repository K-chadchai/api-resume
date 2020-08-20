import { Entity, Unique, PrimaryGeneratedColumn, Column } from 'typeorm';
import { ILoginActivity } from 'src/interfaces/login_activity.interface';

const tname = 'login_activity';

@Entity(tname)
@Unique(`uc_${tname}_id`, ['id'])
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
}
