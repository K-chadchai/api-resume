import { Entity, Unique, PrimaryGeneratedColumn, Column } from 'typeorm';
import { IMediaResolutionEntity } from 'src/interfaces/media_resolution.interface';

const tname = 'media_resolution';
@Entity(tname)
@Unique(`uc_${tname}_id`, ['id'])
export class MediaResolutionEntity implements IMediaResolutionEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    nullable: true,
    length: 100,
  })
  Resolution_name: string;

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
