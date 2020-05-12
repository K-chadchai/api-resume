import {
  PrimaryGeneratedColumn,
  Column,
  Entity,
  ManyToOne,
  Unique,
} from 'typeorm';
import { MediasEntity } from './medias.entity';
import { CategoriesEntity } from './categories.entity';
import { IFoldersEntity } from 'src/interfaces/folders.interface';

const tname = 'folders';

@Entity(tname)
@Unique(`uc_${tname}_folder_name`, ['categoryId', 'folder_name'])
export class FoldersEntity implements IFoldersEntity {
  @ManyToOne(
    () => CategoriesEntity,
    category => category.id,
  )
  category: CategoriesEntity;
  @Column()
  categoryId: string;

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ comment: 'ชื่อโฟล์เดอร์(ต้องไม่ซ้ำ)' })
  folder_name: string;

  @Column({ nullable: true, comment: 'คำอธิบาย' })
  folder_desc: string;

  media: MediasEntity[];
}
