import {
  PrimaryGeneratedColumn,
  Column,
  Entity,
  ManyToOne,
  Unique,
} from 'typeorm';
import { CategoryEntity } from '../entities/category.entity';
import { MediaEntity } from '../entities/media.entity';

const tname = 'category_folder';

@Entity(tname)
@Unique(`uc_${tname}_folder_name`, ['category', 'folder_name'])
export class CategoryFolderEntity {
  @ManyToOne(
    type => CategoryEntity,
    category => category.id,
  )
  category: CategoryEntity;

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ comment: 'ชื่อโฟล์เดอร์(ต้องไม่ซ้ำ)' })
  folder_name: string;

  @Column({ nullable: true, comment: 'คำอธิบาย' })
  folder_desc: string;

  media: MediaEntity[];
}
