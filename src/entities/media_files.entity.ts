import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Unique,
  ManyToOne,
} from 'typeorm';
import { Media } from './media.entity';

const tname = 'media_images';

@Entity(tname)
@Unique(`uc_${tname}_suffix`, ['id', 'suffix'])
@Unique(`uc_${tname}_key`, ['id', 'key'])
export class MediaFiles {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  suffix: string;

  @Column()
  width: number;

  @Column()
  height: number;

  @Column()
  size: number;

  @Column()
  key: string;

  @ManyToOne(
    type => Media,
    media => media.id,
  )
  media: Media;
}
