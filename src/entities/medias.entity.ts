/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  Unique,
} from 'typeorm';
import { ImagePostitionEntity } from './image-position.entity';
import { FoldersEntity } from './folders.entity';
import { ImagesEntity } from './images.entity';

// รูปภาพและวิดีโอ ที่อัพโหลด
const tname = 'medias';

@Entity(tname)
@Unique(`uc_${tname}_folder_originalname`, ['folder', 'originalname'])
export class MediasEntity {
  @ManyToOne(
    type => FoldersEntity,
    folder => folder.id,
  )
  folder: FoldersEntity;

  @ManyToOne(
    type => ImagePostitionEntity,
    position => position.id,
  )
  position: ImagePostitionEntity;

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  originalname: string;

  @Column({ comment: 'ประเภทไฟล์ เช่น image/jpeg' })
  mimetype: string;

  @Column({ nullable: true, comment: 'คำอธิบาย' })
  description: string;

  @Column({ nullable: true, comment: 'ขนาดไฟล์ (byte)' })
  video_size: number;

  @Column({ nullable: true, comment: 'uuid ของไฟล์นี้ที่อยู่ใน S3' })
  video_s3key: string;

  images: ImagesEntity[];
}
