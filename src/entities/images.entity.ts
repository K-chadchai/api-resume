import { Entity, PrimaryGeneratedColumn, Column, Unique, ManyToOne } from 'typeorm';
import { MediasEntity } from './medias.entity';
import { IImagesEntity } from '@libs';

const tname = 'images';

@Entity(tname)
@Unique(`uc_${tname}_suffix`, ['mediaId', 'suffix'])
@Unique(`uc_${tname}_s3key`, ['mediaId', 's3key'])
export class ImagesEntity implements IImagesEntity {
  @ManyToOne(() => MediasEntity, (col) => col.id)
  media: MediasEntity;
  @Column()
  mediaId: string;

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
  s3key: string;
}
