import { PrimaryGeneratedColumn, Column, Entity, Unique } from 'typeorm';
import { FoldersEntity } from './folders.entity';
import { ICategoriesEntity } from 'src/interfaces/categories.interface';

const tname = 'categories';

@Entity(tname)
@Unique(`uc_${tname}_cat_name`, ['cat_name'])
export class CategoriesEntity implements ICategoriesEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  cat_name: string;

  @Column({ nullable: true, comment: 'คำอธิบาย' })
  cat_desc: string;

  folders: FoldersEntity[];
}
