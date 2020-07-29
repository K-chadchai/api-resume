import { IMediaObjectRelationEntity } from 'src/interfaces/media_object_relation.interface';
import { PrimaryGeneratedColumn, Column, Entity, Unique } from 'typeorm';

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

  @Column({
    nullable: true,
    length: 36,
  })
  object_id: string;

  @Column({
    nullable: true,
    length: 36,
  })
  sale_depart_id: string;

  @Column({
    nullable: true,
    length: 36,
  })
  article_id: string;

  @Column({
    nullable: true,
    length: 36,
  })
  article_unit_id: string;

  @Column({
    nullable: true,
    length: 36,
  })
  article_side_id: string;

  @Column({
    nullable: true,
    length: 36,
  })
  color_id: string;

  @Column({
    nullable: true,
    length: 36,
  })
  resolution_id: string;
}
