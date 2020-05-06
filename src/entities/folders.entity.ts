/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  PrimaryGeneratedColumn,
  Column,
  Entity,
  ManyToOne,
  Unique,
} from 'typeorm';
import { MediasEntity } from './medias.entity';
import { CategoriesEntity } from './categories.entity';

const tname = 'folders';

@Entity(tname)
@Unique(`uc_${tname}_folder_name`, ['category', 'folder_name'])
export class FoldersEntity {
  @ManyToOne(
    type => CategoriesEntity,
    category => category.id,
  )
  category: CategoriesEntity;

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ comment: 'ชื่อโฟล์เดอร์(ต้องไม่ซ้ำ)' })
  folder_name: string;

  @Column({ nullable: true, comment: 'คำอธิบาย' })
  folder_desc: string;

  media: MediasEntity[];
}
