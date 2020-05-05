import { PrimaryGeneratedColumn, Column, Entity } from 'typeorm';
import { CategoryFolderEntity } from './category-folder.entity';

const tname = 'category';

@Entity(tname)
export class CategoryEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  cat_name: string;

  @Column({ nullable: true, comment: 'คำอธิบาย' })
  cat_desc: string;

  folders: CategoryFolderEntity[];
}
