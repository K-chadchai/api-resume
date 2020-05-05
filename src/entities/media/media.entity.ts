import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  Unique,
} from 'typeorm';
import { MediaImagesEntity } from '../media-images.entity';
import { CategoryFolderEntity } from '../category-folder.entity';
import { ImagePostitionEntity } from '../image-position.entity';

// รูปภาพและวิดีโอ ที่อัพโหลด
const tname = 'media';

@Entity(tname)
@Unique(`uc_${tname}_folder_originalname`, ['folder', 'originalname'])
export class MediaEntity {
  @ManyToOne(
    type => CategoryFolderEntity,
    folder => folder.id,
  )
  folder: CategoryFolderEntity;

  @ManyToOne(
    type => ImagePostitionEntity,
    position => position.id,
  )
  position: ImagePostitionEntity;

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ comment: 'ชื่อไฟล์จาก client ' })
  originalname: string;

  @Column({ comment: 'ประเภทไฟล์ เช่น image/jpeg' })
  mimetype: string;

  @Column({ nullable: true, comment: 'คำอธิบาย' })
  description: string;

  @Column({ nullable: true, comment: 'ขนาดไฟล์ (byte)' })
  video_size: number;

  @Column({ nullable: true, comment: 'uuid ของไฟล์นี้ที่อยู่ใน S3' })
  video_s3key: string;

  images: MediaImagesEntity[];
}
