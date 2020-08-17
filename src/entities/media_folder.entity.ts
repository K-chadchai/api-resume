import { IMediaFolderEntity } from 'src/interfaces/media_folder.interface';
import {
  PrimaryGeneratedColumn,
  Column,
  Entity,
  Unique,
  PrimaryColumn,
  Generated,
} from 'typeorm';

const tname = 'media_folder';

@Entity(tname)
@Unique(`uc_${tname}_pid_fname`, ['parent_id', 'folder_name'])
export class MediaFolderEntity implements IMediaFolderEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  @Generated('uuid')
  parent_id: string;

  @Column({
    length: 100,
  })
  folder_name: string;

  @Column({
    nullable: true,
    length: 255,
  })
  description: string;

  @Column({
    nullable: true,
    length: 36,
  })
  reference: string;

  @Column({
    nullable: true,
    length: 20,
  })
  folder_type: string;

  @Column({
    nullable: true,
    length: 15,
  })
  creator: string;

  @Column({
    nullable: true,
  })
  created_time: Date;

  @Column({
    nullable: true,
    length: 15,
  })
  last_editor: string;

  @Column({
    nullable: true,
  })
  last_edited_time: Date;

  @Column({
    nullable: true,
  })
  is_root: boolean;
}
