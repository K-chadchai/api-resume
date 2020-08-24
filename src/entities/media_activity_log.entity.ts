import { IMediaActivityLogEntity } from 'src/interfaces/media_activity_log.interface';
import { PrimaryGeneratedColumn, Column, Entity, Unique, Generated } from 'typeorm';

const tname = 'media_activity_log';

@Entity(tname)
@Unique(`uc_${tname}_id`, ['id'])
export class MediaActivityLogEntity implements IMediaActivityLogEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  @Generated('uuid')
  object_id: string;

  @Column({
    nullable: true,
    length: 255,
  })
  description: string;

  @Column({
    nullable: true,
    length: 15,
  })
  creator: string;

  @Column({
    nullable: true,
  })
  created_time: Date;
}
