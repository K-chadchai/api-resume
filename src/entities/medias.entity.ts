import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { ImagePostitionEntity } from './image_position.entity';
import { FoldersEntity } from './folders.entity';
import { ImagesEntity } from './images.entity';
import { IMediasEntity } from 'src/interfaces/medias.interface';

// รูปภาพและวิดีโอ ที่อัพโหลด
const tname = 'medias';

@Entity(tname)
// @Unique(`uc_${tname}_folder_originalname`, ['folderId', 'originalname']) เช็คเฉพาะสถานะปกติ(N)
export class MediasEntity implements IMediasEntity {
  @ManyToOne(
    () => FoldersEntity,
    folder => folder.id,
  )
  folder: FoldersEntity;
  @Column({
    nullable: true,
    comment: 'เป็น null ได้ในกรณีที่ระบุ path เช่นการอัพรูป user',
  })
  folderId: string;

  @Column({ nullable: true, comment: 'path folder ที่เก็บรูปใน S3' })
  path: string;

  @ManyToOne(
    () => ImagePostitionEntity,
    inv => inv.id,
  )
  imagePosition: ImagePostitionEntity;
  @Column({ nullable: true, comment: 'ตำแหน่งภาพถ่าย' })
  imagePositionId: string;

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

  @Column()
  created_user: string;

  @Column()
  created_time: Date;

  @Column({
    length: 1,
    comment: 'N=ปกติ,D=ลบแล้ว,R=อัพรูปใหม่(replaceById)',
    default: 'N',
  })
  media_status: string;

  @Column({ nullable: true })
  deleted_user: string;

  @Column({ nullable: true })
  deleted_time: Date;

  @OneToOne(() => MediasEntity)
  @JoinColumn()
  replaceBy: string;
  @Column({
    nullable: true,
    comment: 'รูปใหม่ที่อัพแทนรูปนี้( กรณีที่ media_status=R)',
  })
  replaceById: string;

  images: ImagesEntity[];
}
