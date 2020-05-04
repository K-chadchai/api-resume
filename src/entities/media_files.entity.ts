import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Unique,
  ManyToOne,
} from 'typeorm';
import { MediaEntity } from './media.entity';

const tname = 'media_images';

@Entity(tname)
@Unique(`uc_${tname}_suffix`, ['media', 'suffix'])
@Unique(`uc_${tname}_key`, ['media', 'key'])
export class MediaFilesEntity {
  @ManyToOne(
    type => MediaEntity,
    media => media.id,
  )
  media: MediaEntity;

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
}
