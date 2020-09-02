import { IMediaSideEntity } from '@libs';
import { PrimaryGeneratedColumn, Column, Entity, Unique } from 'typeorm';

const tname = 'media_side';

@Entity(tname)
@Unique(`uc_${tname}_id`, ['id'])
export class MediaSideEntity implements IMediaSideEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    nullable: true,
    length: 100,
  })
  side_name: string;

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

  @Column({
    nullable: true,
    length: 15,
  })
  last_edidor: string;

  @Column({
    nullable: true,
  })
  last_edited_time: Date;
}
