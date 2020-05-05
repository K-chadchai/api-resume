import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { MediaFilesEntity } from './media_files.entity';
import { CategoryFolderEntity } from './category_folder.entity';

@Entity('media')
export class MediaEntity {
  @ManyToOne(
    type => CategoryFolderEntity,
    folder => folder.id,
  )
  folder: CategoryFolderEntity;

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ comment: 'ชื่อไฟล์จาก client ' })
  originalname: string;

  @Column({ comment: 'ประเภทไฟล์ เช่น image/jpeg' })
  mimetype: string;

  @Column({ nullable: true, comment: 'ขนาดไฟล์ (byte)' })
  size: number;

  @Column({ nullable: true, comment: 'uuid ของไฟล์นี้ที่อยู่ใน S3' })
  key: string;

  files: MediaFilesEntity[];
}
