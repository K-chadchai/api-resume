import { PrimaryGeneratedColumn, Column, Entity } from 'typeorm';
import { CategoryFolderEntity } from './category_folder.entity';

const tname = 'category';

@Entity(tname)
export class CategoryEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  cat_name: string;

  @Column()
  create_user: string;

  @Column()
  create_time: Date;

  folders: CategoryFolderEntity[];
}
