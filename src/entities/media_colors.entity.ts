import { IMediaColorsEntity } from 'src/interfaces/media_colors.interface';
import { PrimaryGeneratedColumn, Column, Entity, Unique } from 'typeorm';

const tname = 'media_colors';

@Entity(tname)
@Unique(`uc_${tname}_id`, ['id'])
export class MediaColorsEntity implements IMediaColorsEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    nullable: true,
    length: 100,
  })
  color_name: string;

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
