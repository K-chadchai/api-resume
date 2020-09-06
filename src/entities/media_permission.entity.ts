import { IMediaPermissionEntity } from '@libs';
import { PrimaryGeneratedColumn, Column, Entity, Unique, Generated } from 'typeorm';

const tname = 'media_permission';

@Entity(tname)
@Unique(`uc_${tname}_rid_atid`, ['role_id', 'action_id'])
export class MediaPermissionEntity implements IMediaPermissionEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  @Generated('uuid')
  role_id: string;

  @Column()
  @Generated('uuid')
  action_id: string;

  @Column({
    nullable: true,
  })
  is_read: number;

  @Column({
    nullable: true,
  })
  is_add: number;

  @Column({
    nullable: true,
  })
  is_edit: number;

  @Column({
    nullable: true,
  })
  is_delete: number;

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
}
