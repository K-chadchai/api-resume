import { PrimaryGeneratedColumn, Column, Entity, Unique } from 'typeorm';
import { ISingleSignOnTokenEntity } from 'src/interfaces/single_sign_on_token.interface';

const tname = 'single_sign_on_token';

@Entity(tname)
@Unique(`uc_${tname}_id`, ['id'])
export class SingleSignOnTokenEntity implements ISingleSignOnTokenEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    nullable: true,
    length: 1000,
  })
  token: string;

  @Column({
    nullable: true,
  })
  login_time: Date;

  @Column({
    nullable: true,
  })
  expire_date: Date;
}