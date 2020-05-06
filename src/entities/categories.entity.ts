import { PrimaryGeneratedColumn, Column, Entity } from 'typeorm';
import { FoldersEntity } from './folders.entity';

const tname = 'categories';

@Entity(tname)
export class CategoriesEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  cat_name: string;

  @Column({ nullable: true, comment: 'คำอธิบาย' })
  cat_desc: string;

  folders: FoldersEntity[];
}
