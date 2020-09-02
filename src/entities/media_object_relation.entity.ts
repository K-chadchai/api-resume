import { IMediaObjectRelationEntity } from '@libs';
import { PrimaryGeneratedColumn, Column, Entity, Unique, Generated } from 'typeorm';

const tname = 'media_object_relation';

@Entity(tname)
@Unique(`uc_${tname}_ob_sal_arid_aruid_arsid`, [
  'object_id',
  'sale_depart_id',
  'article_id',
  'article_unit_id',
  'article_side_id',
])
export class MediaObjectRelationEntity implements IMediaObjectRelationEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  @Generated('uuid')
  object_id: string;

  @Column('uuid')
  sale_depart_id: string;

  @Column('uuid')
  article_id: string;

  @Column('uuid')
  article_unit_id: string;

  @Column('uuid')
  article_side_id: string;

  @Column('uuid')
  color_id: string;

  @Column('uuid')
  resolution_id: string;

  @Column({
    nullable: true,
    length: 15,
  })
  relation_type: string;
}
