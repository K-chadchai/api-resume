import { IMediaColorxEntity } from '@libs';
import { Entity, Unique, PrimaryGeneratedColumn, Column } from 'typeorm';

const tname = 'media_colerx';

@Entity(tname)
@Unique(`uc_${tname}_id`, ['id'])
export class MediaColorxEntity implements IMediaColorxEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    nullable: true,
    length: 100,
  })
  colorx_name: string;

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
