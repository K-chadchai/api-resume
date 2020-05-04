import {
  PrimaryGeneratedColumn,
  Column,
  Entity,
  ManyToOne,
  Unique,
} from 'typeorm';
import { CategoryEntity } from './category.entity';
import { MediaEntity } from './media.entity';

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

  @Column()
  folder_name: string;

  @Column()
  create_user: string;

  @Column()
  create_time: string;

  media: MediaEntity[];
}
